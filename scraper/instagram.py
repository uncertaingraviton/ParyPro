"""Instagram scraper for Trident Hyderabad F&B promotions.

Fetches the public profile feed of @tridenthyderabad without any login,
filters posts down to food & beverage specials (e.g. "Onam Sadhya at Kanak"),
and returns a list of promotion records.

Strategy:
  1. Instagram public web endpoint (web_profile_info) - no login required.
  2. Fallback: headless Chromium (Playwright) rendering the logged-out
     profile grid - works even when plain HTTP gets a login-wall shell.
  3. Fallback: public RSSHub instance serving an RSS bridge for the profile.
  4. Last resort: Apify free tier (only when APIFY_TOKEN is set).
  If all fail, raise - run.py will keep the last-good JSON untouched.
"""

from __future__ import annotations

import json
import re
import sys
import xml.etree.ElementTree as ET  # noqa: F401  (kept for potential RSS tweaks)
from datetime import datetime, timezone

import requests

HANDLE = "tridenthyderabad"
PROFILE_URL = f"https://www.instagram.com/{HANDLE}/"

# Public web app id used by instagram.com itself; not a secret.
IG_APP_ID = "936619743392459"
WEB_PROFILE_ENDPOINT = (
    "https://www.instagram.com/api/v1/users/web_profile_info/"
    f"?username={HANDLE}"
)

BROWSER_HEADERS = {
    "User-Agent": (
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 "
        "(KHTML, like Gecko) Chrome/124.0 Safari/537.36"
    ),
    "Accept": "application/json",
    "Accept-Language": "en-US,en;q=0.9",
}

RSSHUB_URLS = [
    f"https://rsshub.app/instagram/user/{HANDLE}",
    f"https://rsshub.rssforever.com/instagram/user/{HANDLE}",
]

# --- Promotion filtering -------------------------------------------------

VENUE_TERMS = [
    "kanak", "amara", "tuscany", "ninety six", "ninety-six",
    "sadhya", "thali", "trident hyderabad",
]

PROMO_TERMS = [
    "onam", "festival", "buffet", "offer", "offers", "promotion",
    "special", "brunch", "dinner", "lunch", "feast", "celebration",
    "limited", "indulge", "culinary", "chef", "menu", "food", "dining",
    "cocktail", "cocktails", "afternoon tea", "high tea",
]


def _score_caption(text: str) -> int:
    """Score how strongly a caption looks like an F&B special."""
    if not text:
        return 0
    # Normalise punctuation so 'Trident, Hyderabad' matches 'trident hyderabad'.
    low = re.sub(r"[^a-z0-9 ]+", " ", text.lower())
    venue_hits = sum(1 for t in VENUE_TERMS if t in low)
    promo_hits = sum(1 for t in PROMO_TERMS if t in low)
    score = venue_hits * 2 + promo_hits
    # Strong single signals
    if venue_hits >= 1 and promo_hits >= 1:
        score += 2
    return score


def _clean_caption(caption: str) -> str:
    """Strip hashtags/mentions/urls and collapse whitespace."""
    text = re.sub(r"\s*\[[^\]]*\]\s*[\".]*\s*$", "", (caption or "").strip())
    text = re.sub(r"#\w+", "", text)
    # Mentions only - leave email addresses like reservations@… intact.
    text = re.sub(r"(?<![\w.@-])@\w+", "", text)
    text = re.sub(r"https?://\S+", "", text)
    lines = [ln.strip() for ln in text.splitlines() if ln.strip()]
    return " ".join(lines).strip()


def _title_from_caption(caption: str) -> str:
    """Best short title from a caption or an accessibility alt string."""
    raw = (caption or "").strip()

    # Real captions: lead with the first sentence - the hotel's own hook.
    first_sentence = re.split(r"(?<=[.!?])\s+", raw, maxsplit=1)[0].strip()
    if (
        first_sentence
        and not first_sentence.lower().startswith(("video by", "photo by"))
        and len(first_sentence) >= 12
    ):
        return first_sentence.rstrip(".!?,")[:80].rstrip()

    # Alt texts often quote overlaid design text:
    #   "... text that says 'Namaskaram!'."
    m = re.search(r"says\s+['\"](.+?)['\"]", raw)
    if m and len(m.group(1).strip()) >= 3:
        return m.group(1).strip()[:80]

    first_line = next(
        (ln.strip() for ln in raw.splitlines() if ln.strip()), ""
    )
    first_line = _clean_caption(first_line)
    if not first_line:
        return "Trident Hyderabad special"
    # Trim boilerplate prefixes found in alt strings.
    trimmed = re.sub(
        r"^(?:Video|Photo|Reel)\s+by\s+.*?\.\s*",
        "",
        first_line,
        flags=re.IGNORECASE,
    )
    trimmed = (trimmed or first_line).strip()
    # 'May be an image of couscous, biryani and text.' -> 'Couscous, biryani'
    m = re.match(
        r"[Mm]ay be an? (?:image|video) of (.+?) and text\.?$", trimmed
    )
    if m:
        trimmed = m.group(1).strip().rstrip(".")
        trimmed = trimmed[0].upper() + trimmed[1:]
    return trimmed[:80].rstrip()


def fetch_via_web_endpoint(timeout: int = 20) -> list[dict]:
    """Primary source: Instagram's public web_profile_info JSON."""
    headers = dict(BROWSER_HEADERS)
    headers["x-ig-app-id"] = IG_APP_ID
    resp = requests.get(WEB_PROFILE_ENDPOINT, headers=headers, timeout=timeout)
    resp.raise_for_status()
    data = resp.json()

    edges = (
        data.get("data", {})
        .get("user", {})
        .get("edge_owner_to_timeline_media", {})
        .get("edges", [])
    )
    posts: list[dict] = []
    for edge in edges:
        node = edge.get("node", {})
        caption_edges = node.get("edge_media_to_caption", {}).get("edges", [])
        caption = (
            caption_edges[0]["node"]["text"] if caption_edges else ""
        )
        posts.append(
            {
                "caption": caption,
                "url": f"https://www.instagram.com/p/{node.get('shortcode', '')}/",
                "image": node.get("thumbnail_src")
                or (node.get("display_url") or ""),
                "postedAt": datetime.fromtimestamp(
                    node.get("taken_at_timestamp", 0), tz=timezone.utc
                ).isoformat(),
            }
        )
    return posts


def fetch_via_browser(timeout_ms: int = 60000) -> list[dict]:
    """Render the logged-out profile in headless Chromium and read the grid.

    Instagram serves roughly the latest 6-12 posts to anonymous visitors in a
    real browser. Each grid tile exposes an <img> whose src is the thumbnail
    and whose alt reads like:
      'Video by Trident, Hyderabad on August 24, 2026. May be an image of
       biryani ... and text that says Namaskaram!.'
    We map that onto our post shape; the alt doubles as the caption signal
    used for promo scoring.
    """
    from playwright.sync_api import sync_playwright

    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        context = browser.new_context(
            user_agent=BROWSER_HEADERS["User-Agent"],
            viewport={"width": 1366, "height": 900},
            locale="en-US",
        )
        page = context.new_page()
        page.goto(PROFILE_URL, timeout=timeout_ms, wait_until="domcontentloaded")
        page.wait_for_timeout(8000)

        # Dismiss the login modal if it appeared.
        try:
            close = page.query_selector(
                "div[role='dialog'] svg[aria-label='Close']"
            )
            if close:
                close.click()
                page.wait_for_timeout(1500)
        except Exception:  # noqa: BLE001 - modal is optional
            pass

        raw = page.evaluate(
            """
            () => {
              const out = [];
              document.querySelectorAll("a[href*='/reel/'], a[href^='/p/']").forEach(a => {
                const href = a.getAttribute('href') || '';
                const img = a.querySelector('img');
                if (!img) return;
                out.push({
                  url: 'https://www.instagram.com' + href.split('?')[0],
                  image: img.src || '',
                  alt: img.alt || '',
                });
              });
              return out;
            }
            """
        )

        posts: list[dict] = []
        for item in raw:
            if f"/{HANDLE}/" not in item["url"]:
                continue  # skip tagged/other-account tiles
            alt = item.get("alt", "")
            posted_at = ""
            m = re.search(r"on ([A-Z][a-z]+ \d{1,2}, \d{4})", alt)
            if m:
                try:
                    posted_at = (
                        datetime.strptime(m.group(1), "%B %d, %Y")
                        .replace(tzinfo=timezone.utc)
                        .isoformat()
                    )
                except ValueError:
                    pass
            posts.append(
                {
                    "caption": alt,
                    "url": item["url"],
                    "image": item.get("image", ""),
                    "postedAt": posted_at,
                }
            )

        # Visit each post page to read the real caption (og:description).
        # This is the hotel team's own copy - far better than alt text.
        for post in posts[:5]:
            caption = _read_post_caption(page, post["url"])
            if caption:
                post["caption"] = caption

        browser.close()

    if not posts:
        raise RuntimeError("Browser rendered no posts - layout may have changed")
    return posts


def _read_post_caption(page, url: str, timeout_ms: int = 45000) -> str:
    """Read a post's real caption from og:description on its page.

    Format: '76 likes, 0 comments - tridenthyderabad on August 24, 2026:
    "caption text".' - we keep just the caption body and drop the trailing
    bracketed hashtag block.
    """
    try:
        page.goto(url, timeout=timeout_ms, wait_until="domcontentloaded")
        page.wait_for_timeout(4000)
        og = page.eval_on_selector_all(
            "meta[property='og:description']",
            "els => els.map(e => e.content)",
        )
        if not og:
            return ""
        text = og[0].strip()
        m = re.search(r"on [A-Z][a-z]+ \d{1,2}, \d{4}:\s*(.+)", text, re.DOTALL)
        if not m:
            return ""
        body = m.group(1).strip().strip('"').strip()
        body = re.sub(r"\s*\[[^\]]*\]\s*.?$", "", body, flags=re.DOTALL)
        return body.strip()
    except Exception:  # noqa: BLE001 - caption enrichment is best-effort
        return ""


def fetch_via_rsshub(timeout: int = 25) -> list[dict]:
    """Fallback source: public RSSHub instances bridging the profile."""
    import feedparser

    last_error: Exception | None = None
    for url in RSSHUB_URLS:
        try:
            resp = requests.get(url, headers=BROWSER_HEADERS, timeout=timeout)
            resp.raise_for_status()
            parsed = feedparser.parse(resp.text)
            posts: list[dict] = []
            for entry in parsed.entries:
                img = ""
                if getattr(entry, "media_content", None):
                    img = entry.media_content[0].get("url", "")
                elif getattr(entry, "media_thumbnail", None):
                    img = entry.media_thumbnail[0].get("url", "")
                posted_at = ""
                if getattr(entry, "published_parsed", None):
                    posted_at = datetime(
                        *entry.published_parsed[:6], tzinfo=timezone.utc
                    ).isoformat()
                posts.append(
                    {
                        "caption": entry.get("summary", "")
                        or entry.get("title", ""),
                        "url": entry.get("link", PROFILE_URL),
                        "image": img,
                        "postedAt": posted_at,
                    }
                )
            if posts:
                return posts
        except Exception as exc:  # noqa: BLE001 - try every mirror
            last_error = exc
    raise RuntimeError(f"All RSSHub mirrors failed: {last_error}")


def fetch_via_apify(timeout: int = 180) -> list[dict]:
    """Last-resort source: Apify's Instagram Scraper (free monthly credits).

    Only runs when the APIFY_TOKEN environment variable is set. The token is
    stored as a GitHub Actions secret; without it this source is skipped.
    """
    import os

    token = os.environ.get("APIFY_TOKEN")
    if not token:
        raise RuntimeError("APIFY_TOKEN not set - skipping Apify source")

    resp = requests.post(
        "https://api.apify.com/v2/acts/apify~instagram-scraper/run-sync-get-dataset-items",
        params={"token": token},
        json={
            "usernames": [HANDLE],
            "resultsType": "posts",
            "resultsLimit": 12,
        },
        timeout=timeout,
    )
    resp.raise_for_status()
    items = resp.json()
    posts: list[dict] = []
    for item in items:
        posts.append(
            {
                "caption": item.get("caption") or item.get("title") or "",
                "url": item.get("url") or PROFILE_URL,
                "image": item.get("displayUrl") or item.get("thumbnailUrl") or "",
                "postedAt": item.get("timestamp") or "",
            }
        )
    return posts


VENUE_DISPLAY = {
    "kanak": "Kanak",
    "amara": "Amara",
    "tuscany": "Tuscany",
    "ninety six": "Ninety Six",
    "ninety-six": "Ninety Six",
    "sadhya": "",
    "thali": "",
    "trident hyderabad": "Trident Hyderabad",
}

PROMO_DISPLAY = [
    ("onam sadhya", "Onam Sadhya"),
    ("high tea", "High Tea"),
    ("afternoon tea", "Afternoon Tea"),
    ("brunch", "Brunch"),
    ("buffet", "Buffet"),
    ("cocktail", "Cocktails"),
    ("dinner", "Dinner"),
    ("lunch", "Lunch"),
    ("feast", "Feast"),
    ("onam", "Onam"),
]

MEAL_SLOTS = {
    "breakfast": ["07:00", "08:00", "09:00"],
    "brunch": ["12:00", "12:30", "13:30"],
    "lunch": ["12:30", "13:30", "14:30"],
    "high tea": ["16:00", "16:30", "17:30"],
    "afternoon tea": ["16:00", "16:30", "17:30"],
    "dinner": ["19:00", "19:30", "20:30"],
}


def _fit_sentences(text: str, budget: int = 170) -> str:
    """Keep only whole sentences that fit the budget - never cut mid-sentence."""
    out = ""
    for sentence in re.split(r"(?<=[.!?])\s+", text.strip()):
        sentence = sentence.strip()
        if not sentence:
            continue
        candidate = f"{out} {sentence}".strip()
        if candidate and len(candidate) > budget:
            break
        out = candidate
    return out


def _short_title(caption: str, clean: str) -> str:
    """A true sub-heading: 'Onam Sadhya at Kanak', not a whole sentence."""
    low = re.sub(r"[^a-z0-9 ]+", " ", clean.lower())
    promo = next((label for term, label in PROMO_DISPLAY if term in low), "")
    venue = next(
        (disp for term, disp in VENUE_DISPLAY.items()
         if disp and disp.lower() != "trident hyderabad" and term in low),
        "",
    )
    if promo and venue:
        return f"{promo} at {venue}"
    if promo:
        return promo
    if venue:
        return venue
    # Fallback: first few words of the first sentence, cut at a word boundary.
    first = re.split(r"(?<=[.!?])\s+", clean)[0]
    words = first.split()
    return " ".join(words[:7]).rstrip(",.;:!")


def _short_body(sentences: list[str], budget: int = 110) -> str:
    """One short, grammatical line for the card body."""
    if not sentences:
        return ""
    s = sentences[0].rstrip(".")
    if len(s) <= budget:
        return f"{s}."
    # Cut at the last comma inside the budget - a complete clause, then a period.
    cut = s.rfind(",", 0, budget)
    if cut > 40:
        clause = s[:cut].rstrip(" ,;:and")
        return f"{clause}."
    words = s[:budget].split()
    return " ".join(words[:-1]).rstrip(",") + "."


def _parse_schedule(caption: str) -> dict:
    """Extract event dates and meal/time from the caption, with correct years.

    Handles '26 August | Lunch', ranges like '20-25 August' / 'till 30 August',
    and explicit times like '7 pm'. A date that has already passed this year
    is assumed to be next year's occurrence.
    """
    today = datetime.now().date()
    start: str = ""
    end: str = ""
    time_label: str = ""

    month_names = [
        "january", "february", "march", "april", "may", "june", "july",
        "august", "september", "october", "november", "december",
    ]
    # Keyed by 3-letter prefix so 'august' and 'aug' both resolve.
    month_map = {name[:3]: i for i, name in enumerate(month_names, start=1)}

    def make_date(day: int, month: int) -> str:
        year = today.year
        try:
            d = datetime(year, month, day).date()
        except ValueError:
            return ""
        if d < today:  # already passed - it must mean next year
            d = datetime(year + 1, month, day).date()
        return d.isoformat()

    def day_month(day: int, month_name: str) -> str:
        month = month_map.get(month_name.lower()[:3])
        if not month:
            return ""
        return make_date(day, month) if 1 <= day <= 31 else ""

    text = caption or ""
    low = text.lower()

    # Range first: '20-25 August', '20 to 25 August', '20–25 August'.
    m = re.search(
        r"(\d{1,2})\s*(?:-|–|to)\s*(\d{1,2})\s+([a-z]+)", low
    )
    if m and month_map.get(m.group(3)[:3]):
        start = day_month(int(m.group(1)), m.group(3))
        end = day_month(int(m.group(2)), m.group(3))

    # 'till/until 30 August' or 'through 30 August'.
    if not end:
        m = re.search(r"(?:till|until|through)\s+(\d{1,2})\s+([a-z]+)", low)
        if m and month_map.get(m.group(2)[:3]):
            end = day_month(int(m.group(1)), m.group(2))

    # Single date: '26 August' (also covers 'August 26').
    if not start:
        m = re.search(r"(\d{1,2})\s+([a-z]+)", low)
        if m and month_map.get(m.group(2)[:3]):
            start = day_month(int(m.group(1)), m.group(2))
        else:
            m = re.search(r"([a-z]+)\s+(\d{1,2})", low)
            if m and month_map.get(m.group(1)[:3]):
                start = day_month(int(m.group(2)), m.group(1))

    # Meal or explicit time.
    for meal in MEAL_SLOTS:
        if re.search(rf"\b{meal}\b", low):
            time_label = meal.title()
            break
    if not time_label:
        m = re.search(r"\b(\d{1,2})(:\d{2})?\s*(am|pm)\b", low)
        if m:
            time_label = f"{m.group(1)}{m.group(2) or ''} {m.group(3).upper()}".replace("  ", " ")

    return {"startDate": start, "endDate": end, "timeLabel": time_label}


def _build_promo_copy(caption: str) -> dict:
    """Split a caption into card copy: title hook, body, and schedule line.

    The title is the caption's first sentence; the body is built from the
    following sentences so the card never repeats itself. The schedule line
    ('26 August | Lunch') becomes the `when` field for the meta row.
    """
    # Pull the schedule line ('26 August | Lunch') out by line, before the
    # text is collapsed - it only reads as its own line in the caption.
    when = ""
    body_lines = []
    for line in (caption or "").splitlines():
        line = line.strip()
        if not line:
            continue
        if not when and re.fullmatch(r"[0-3]?\d\s+[A-Z][a-z]+\s*\|\s*[A-Za-z ]+", line):
            when = line
        else:
            body_lines.append(line)

    clean = _clean_caption(" ".join(body_lines))
    sentences = [s.strip() for s in re.split(r"(?<=[.!?])\s+", clean) if s.strip()]

    # Card copy is a true sub-heading + one short line, summarised from the
    # caption's own keywords - never a cut-off sentence.
    title = _short_title(caption, clean)
    body = _short_body(sentences)
    if not body and sentences:
        body = sentences[0][:110].rstrip() 
    return {"title": title, "detail": body, "when": when}


def _venue_name(caption: str) -> str:
    low = re.sub(r"[^a-z0-9 ]+", " ", (caption or "").lower())
    for term, disp in VENUE_DISPLAY.items():
        if disp and term in low:
            return disp
    return "Trident Hyderabad"


def _story(post: dict, schedule: dict) -> str:
    """A cleanly written description for the detail view.

    Composed from the caption's complete sentences (never the raw paste with
    phone numbers, pins and line breaks) plus a proper invitation line with
    the venue, date and meal.
    """
    clean = _clean_caption(post["caption"])
    sentences = [s.strip() for s in re.split(r"(?<=[.!?])\s+", clean) if s.strip()]
    story = _fit_sentences(" ".join(sentences), budget=280)

    venue = _venue_name(post["caption"])
    invite = f"We look forward to hosting you at {venue}"
    if schedule["startDate"]:
        try:
            d = datetime.fromisoformat(schedule["startDate"])
            invite += f" on {d.day} {d.strftime('%B %Y')}"
        except ValueError:
            pass
    if schedule["timeLabel"]:
        invite += f" for {schedule['timeLabel'].lower()}"
    invite += "."
    return f"{story} {invite}".strip()[:600]


def _to_promotion(post: dict) -> dict:
    copy = _build_promo_copy(post["caption"])
    schedule = _parse_schedule(post["caption"])
    return {
        "title": copy["title"],
        "detail": copy["detail"],
        "when": copy["when"],
        "startDate": schedule["startDate"],
        "endDate": schedule["endDate"],
        "timeLabel": schedule["timeLabel"],
        "venueName": _venue_name(post["caption"]),
        "story": _story(post, schedule),
        "full": _clean_caption(post["caption"])[:600],
        "image": post["image"],
        "url": post["url"],
        "postedAt": post["postedAt"],
    }


def get_promotions(limit: int = 5) -> list[dict]:
    """Return up to `limit` F&B promotion records, newest first.

    Tries every source until one yields posts that look like F&B specials.
    If no post qualifies anywhere, the newest available posts are still used
    as generic 'hotel happenings' - an empty feed helps nobody.
    """
    errors: list[str] = []
    fallback: list[dict] = []

    for fetcher in (
        fetch_via_web_endpoint,
        fetch_via_browser,
        fetch_via_rsshub,
        fetch_via_apify,
    ):
        try:
            posts = fetcher()
        except Exception as exc:  # noqa: BLE001
            errors.append(f"{fetcher.__name__}: {exc}")
            continue

        scored = [
            (_score_caption(_clean_caption(p["caption"])), p)
            for p in posts
        ]
        scored = [pair for pair in scored if pair[0] >= 2]
        if scored:
            scored.sort(key=lambda pair: pair[0], reverse=True)
            return [_to_promotion(p) for _, p in scored[:limit]]

        if posts and not fallback:
            fallback = posts

    if fallback:
        # Nothing matched promo keywords - surface the latest posts anyway.
        fallback.sort(
            key=lambda p: p.get("postedAt") or "", reverse=True
        )
        return [_to_promotion(p) for p in fallback[:limit]]

    raise RuntimeError(
        "Instagram scrape failed on all sources: " + " | ".join(errors)
    )


if __name__ == "__main__":
    if hasattr(sys.stdout, "reconfigure"):
        sys.stdout.reconfigure(encoding="utf-8")
    promos = get_promotions()
    print(json.dumps(promos, indent=2, ensure_ascii=False))
    if not promos:
        print("No qualifying promotions found.", file=sys.stderr)