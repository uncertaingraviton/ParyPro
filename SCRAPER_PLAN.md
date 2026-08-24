# Live Feed Scraper — Plan

Goal: automatically surface **Trident Hyderabad F&B promotions** (from Instagram) and **Hyderabad city events** (from BookMyShow) into the two "now" cards on the home page, using only **free hosting**.

---

## 1. Architecture at a glance

```
┌─────────────────────────────────────────────────────────────┐
│ GitHub Actions (cron, every 6h — free on public repos)      │
│                                                             │
│  ┌──────────────┐        ┌───────────────────┐              │
│  │ ig_scraper   │        │ bms_scraper       │              │
│  │ (Python)     │        │ (Python)          │              │
│  └──────┬───────┘        └─────────┬─────────┘              │
│         │                          │                        │
│         ▼                          ▼                        │
│  filter/classify            extract events                  │
│         │                          │                        │
│         ▼                          ▼                        │
│  public/feed/hotel.json    public/feed/city.json            │
│         └──────── commit to repo ────┘                      │
└─────────────────────────────────────────────────────────────┘
                     │
                     ▼
        Vite build bundles JSON with the site
        Home.tsx "now" cards read the JSON,
        fall back to current defaults if stale/missing
```

**Data consumption model (decided):** static JSON committed into this repo by a scheduled GitHub Actions workflow. Zero-cost hosting, no runtime API needed, and the site keeps working even if a scrape fails (last-good JSON stays committed).

---

## 2. Instagram pipeline — API vs scraping (decision)

| Option | Verdict |
|---|---|
| Official Graph API | ❌ Requires a Meta developer app linked to Trident Hyderabad's Business/Creator account + app review. We have no credentials. |
| Basic Display API | ❌ Deprecated by Meta (Dec 2024). |
| Third-party paid APIs (Apify etc.) | ❌ Paid tiers; against the free-hosting constraint. |
| **Public web scraping** | ✅ Chosen. Instagram serves a public JSON endpoint for any profile's ~12 most recent posts without login. |

### How it works
1. **Fetch:** `GET https://www.instagram.com/api/v1/users/web_profile_info/?username=tridenthyderabad`
   - Required header: `x-ig-app-id: 936619743392459` (public web app id), plus a browser-like `User-Agent`.
   - Returns JSON with `edge_owner_to_timeline_media.edges[]` — caption, permalink, thumbnail, timestamp for the last ~12 posts.
2. **Fallback chain** (IG blocks are common from cloud IPs):
   - Try the endpoint above directly.
   - If blocked (401/429), retry through a public RSSHub instance: `https://rsshub.app/instagram/user/tridenthyderabad` (parse RSS).
   - If both fail → exit non-zero but **do not touch the existing JSON** (last-good data persists).
3. **Filter for F&B promotions** — keyword scoring on captions:
   - Venue terms: `kanak, amara, tuscany, ninety six, sadhya, thali`
   - Promo terms: `onam, festival, buffet, offer, promotion, special, brunch, dinner, feast, celebration, limited`
   - A post is a "special" if it hits ≥1 venue term OR ≥2 promo terms. (Later upgrade: swap keyword scoring for an LLM classifier call — still free via a small local heuristic or a free-tier LLM API.)
4. **Output record shape** (matches what the home card needs):
   ```json
   {
     "title": "Onam Sadhya at Kanak",
     "detail": "<first 1–2 lines of caption>",
     "image": "<post thumbnail url>",
     "url": "<instagram permalink>",
     "postedAt": "2026-08-20T10:30:00Z"
   }
   ```
   Title = first line of caption (trimmed); pick the newest qualifying post as the featured one, keep up to 5 as a list.

---

## 3. BookMyShow pipeline

No official API exists, so we scrape the public explore page.

1. **Fetch:** `https://in.bookmyshow.com/explore/events-hyderabad`
   - Plain `requests` GET with browser headers. BMS renders server-side and embeds all event data as a JSON blob inside the HTML (`<script id="__NEXT_DATA__">` or a similar inline JSON). Parse that — **no headless browser needed**, which keeps CI fast and reliable.
   - Fallback: if the JSON blob isn't found or the request is challenged, escalate to Playwright (chromium) headless render — still free in Actions.
2. **Extract per event:** name, venue, date/time string, category tag, poster image, canonical BMS URL.
3. **Curate:** filter to categories worth recommending (music, comedy, theatre, food, workshops), dedupe, sort by date, take top 6–8.
4. **Output shape** (aligns with the existing `CityEvent` type in `src/types.ts`):
   ```json
   {
     "id": "bms-<slug>",
     "title": "Event name",
     "category": "live-music",
     "time": "Sat, 8 PM",
     "venue": "Venue name",
     "description": "...",
     "editorial": "",
     "featured": true/false
   }
   ```

---

## 4. Scheduling & free hosting

- **Runner:** GitHub Actions scheduled workflow (`.github/workflows/scrape.yml`), `cron: '0 */6 * * *'`. Free for public repos; well within the 2,000 min/month free tier even if private (~2 min/run × 4/day ≈ 240 min/month).
- **Commit strategy:** after a successful scrape, commit `public/feed/*.json` with message `[skip ci] refresh live feeds` (the `[skip ci]` prevents recursive workflow triggers).
- **Secrets:** none required (no credentials anywhere). Optional: pin a `GH_TOKEN` is implicit in Actions.
- **Site integration:**
  - New module `src/lib/feed.ts`: fetches `/feed/hotel.json` and `/feed/city.json` at app start (or imports them statically — simpler: `import hotelFeed from '../../public/feed/hotel.json'`), validates freshness (`fetchedAt` field; ignore if > 7 days old), and merges into the store's `cms.specials` / `cms.events`, falling back to the current hardcoded defaults in `src/data.ts`.

## 5. Resilience rules

- Scraper never deletes/empties output on failure — write-on-success only.
- Every JSON carries `"fetchedAt"`; the site ignores feeds older than 7 days and falls back to defaults.
- Workflow sends a failure notification (optional: GitHub email is automatic on failure).

## 6. File layout to implement

```
scraper/
  requirements.txt        # requests, beautifulsoup4, feedparser, playwright (optional)
  instagram.py            # IG fetch + fallback chain + promo filter
  bookmyshow.py           # BMS fetch + __NEXT_DATA__ parse + curation
  run.py                  # orchestrates both, writes public/feed/*.json
.github/workflows/scrape.yml
public/feed/              # committed output (gitignored initially until first run)
src/lib/feed.ts           # loads feeds into store with freshness check
```

## 7. Caveats / honest notes

- Scraping Instagram/BookMyShow technically violates their ToS. Mitigations: public data only, no logins, low frequency (4×/day), graceful degradation. Fine for an internal/demo concierge app; not for commercial redistribution.
- IG may block GitHub Actions' IP ranges intermittently — hence the RSSHub fallback and last-good-JSON persistence.
- BMS markup can change without notice; the parser should fail loudly (non-zero exit) rather than emit garbage.

## 8. Implementation order

1. `scraper/bookmyshow.py` (most deterministic — build & test first)
2. `scraper/instagram.py` + fallback chain
3. `run.py` + JSON writers with `fetchedAt`
4. GitHub Actions workflow + first manual trigger
5. `src/lib/feed.ts` + wire into `Home.tsx` now-cards with fallback
6. End-to-end test: force-run workflow, confirm cards update