# Trident Hyderabad — The Concierge

A concept digital concierge for Trident, Hyderabad: luxury magazine, personal desk, and a living F&B operating layer. Independent student/innovation project — not an official Oberoi/Trident product.

## Run

```bash
npm install
npm run dev
```

## What’s in the house

- Mood-first homepage, dine/drink, Hyderabad explorer, Tonight, Today dashboard
- Ask the Concierge (rule-based desk voice, logged for staff)
- Build My Evening
- Staff CMS at `/staff` (weather, events, availability, specials, picks, requests) stored in the browser
- QR entry points at `/qr` and `/qr/room` `/qr/bar` etc.

Guest preferences and editorial updates persist in `localStorage`.

## Live feeds (scrapers)

A small Python pipeline refreshes two JSON feeds that the homepage overlays
onto its curated defaults:

- `public/feed/hotel.json` — F&B promotions from the @tridenthyderabad
  Instagram feed (filtered for venue/promo keywords).
- `public/feed/city.json` — upcoming Hyderabad events from BookMyShow.

```bash
pip install -r scraper/requirements.txt
python scraper/run.py   # writes public/feed/*.json, keeps last-good on failure
```

Sources are tried most-reliable-first and degrade gracefully:

- **Instagram**: public web endpoint → RSSHub mirrors → Apify free tier
  (set the `APIFY_TOKEN` env var / GitHub secret to enable; without it this
  source is skipped). Instagram blocks many datacenter IPs, so CI may succeed
  where a local run fails.
- **BookMyShow**: schema.org events embedded in the explore page → anchor
  sweep of event links → per-event page enrichment (venue/date/image).

The GitHub Actions workflow `.github/workflows/scrape.yml` runs every 6 hours,
commits refreshed feeds, and deploys picks them up. The site ignores any feed
older than 7 days and falls back to desk-curated content.
