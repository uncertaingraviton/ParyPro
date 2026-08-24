"""BookMyShow scraper for Hyderabad events.

Layered strategy, most-reliable-first:
  1. schema.org Event objects embedded as ld+json in the explore page
     (rich: name, venue, date, image, url).
  2. Anchor sweep over the server-rendered HTML: every /events/<slug>/ETxxxx
     link carries the event title. Reliable even on thin/cached responses.
  3. Optional enrichment: fetch individual event pages (ld+json there gives
     venue/date/image) for the top few events that lack details.
"""

from __future__ import annotations

import json
import re
import sys
from datetime import datetime, timezone

import requests

EXPLORE_URL = "https://in.bookmyshow.com/explore/events-hyderabad"
EVENT_PAGE = "https://in.bookmyshow.com/events/{slug}/{etid}"

BROWSER_HEADERS = {
    "User-Agent": (
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 "
        "(KHTML, like Gecko) Chrome/124.0 Safari/537.36"
    ),
    "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
    "Accept-Language": "en-US,en;q=0.9",
}

CATEGORY_MAP = {
    "Music": "live-music",
    "Comedy": "comedy",
    "Theatre": "theatre",
    "Arts": "art",
    "Food & Drink": "food",
    "Workshops": "culture",
    "Exhibitions": "art",
    "Nightlife": "party",
}


def _get(url: str, timeout: int = 25) -> str:
    resp = requests.get(url, headers=BROWSER_HEADERS, timeout=timeout)
    resp.raise_for_status()
    return resp.text


def _extract_ldjson(html: str) -> list:
    blobs: list = []
    for match in re.finditer(
        r'<script[^>]*type="application/(?:json|ld\+json)"[^>]*>(.*?)</script>',
        html,
        re.DOTALL,
    ):
        raw = match.group(1).strip()
        if not raw:
            continue
        try:
            parsed = json.loads(raw)
        except json.JSONDecodeError:
            continue
        if isinstance(parsed, list):
            blobs.extend(parsed)
        else:
            blobs.append(parsed)
    return blobs


def _schema_events(blobs: list) -> list[dict]:
    """Flatten every @type:Event node out of the ld+json blobs."""
    found: list[dict] = []
    stack: list = list(blobs)
    while stack:
        node = stack.pop()
        if isinstance(node, dict):
            t = node.get("@type")
            if t == "Event" or (isinstance(t, list) and "Event" in t):
                found.append(node)
            else:
                stack.extend(v for v in node.values() if isinstance(v, (list, dict)))
        elif isinstance(node, list):
            stack.extend(node)
    return found


def _from_schema_event(node: dict) -> dict:
    location = node.get("location") or {}
    offers = node.get("offers") or {}
    image = node.get("image")
    if isinstance(image, list):
        image = image[0] if image else ""
    return {
        "id": f"bms-{node.get('url', node.get('name', 'x'))[-20:]}",
        "title": str(node.get("name", "")).strip(),
        "category": CATEGORY_MAP.get(str(node.get("eventType", "")), "culture"),
        "time": str(node.get("startDate", "")).strip(),
        "venue": str(location.get("name", "")).strip() if isinstance(location, dict) else "",
        "description": str(node.get("description", "")).strip()[:300],
        "editorial": "",
        "url": str(offers.get("url", "") if isinstance(offers, dict) else "") or EXPLORE_URL,
        "image": str(image or ""),
    }


def _anchor_events(html: str) -> list[dict]:
    """Every /events/<slug>/ETxxxxxx anchor with its title text."""
    cards = re.findall(
        r'href="/events/([a-z0-9\-]+)/(ET\d+)"[^>]*>([^<]+)</a>', html
    )
    seen: dict[str, dict] = {}
    for slug, etid, title in cards:
        title = title.strip()
        if etid in seen or len(title) < 3:
            continue
        seen[etid] = {
            "id": f"bms-{etid}",
            "title": title,
            "category": "culture",
            "time": "",
            "venue": "",
            "description": "",
            "editorial": "",
            "url": EVENT_PAGE.format(slug=slug, etid=etid),
            "image": "",
            "_slug": slug,
            "_etid": etid,
        }
    return list(seen.values())


def _parse_initial_state(html: str) -> dict | None:
    m = re.search(r"window\.__INITIAL_STATE__\s*=\s*", html)
    if not m:
        return None
    try:
        state, _ = json.JSONDecoder().raw_decode(html[m.end():])
        return state
    except json.JSONDecodeError:
        return None


def _enrich(event: dict, timeout: int = 15) -> dict:
    """Fetch an event page and pull venue/date/image from its embedded state."""
    try:
        html = _get(event["url"], timeout=timeout)

        # Primary: seo.queries.<path>.data.ldSchema.eventSchema[0]
        state = _parse_initial_state(html)
        schema = None
        if state:
            queries = (state.get("seo", {}) or {}).get("queries", {}) or {}
            for q in queries.values():
                data = (q.get("data", {}) or {}) if isinstance(q, dict) else {}
                schemas = ((data.get("ldSchema", {}) or {}).get("eventSchema")) or []
                if schemas:
                    schema = schemas[0]
                    break

        if schema:
            location = schema.get("location") or {}
            image = schema.get("image")
            if isinstance(image, list):
                image = image[0] if image else ""
            event["time"] = event["time"] or str(schema.get("startDate", "")).strip()
            event["image"] = event["image"] or str(image or "")
            if isinstance(location, dict) and location.get("name"):
                event["venue"] = event["venue"] or str(location["name"]).strip()
            if schema.get("description"):
                event["description"] = str(schema["description"]).strip()[:300]

        # Fallback: meta_description usually reads "... happening at <Venue>: Hyderabad"
        if not event["venue"]:
            m = re.search(
                r'name="description"\s+content="([^"]*?)\s+happening at\s+([^"]*)"',
                html,
            )
            if m:
                event["venue"] = m.group(2).strip()[:120]
    except Exception:  # noqa: BLE001 - enrichment is best-effort
        pass
    return event


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


def _editorialise(event: dict) -> str:
    """Write the card's body copy in the concierge's voice, not BMS's.

    Drops the 'Book online tickets for X in Hyderabad on BookMyShow which is
    a workshops event' boilerplate and keeps any real description; otherwise
    composes a short recommendation from what we know. Only whole sentences
    are kept so the card never shows a cut-off line.
    """
    description = re.sub(
        r"Book online tickets for .*? on BookMyShow[^.]*\.?\s*",
        "",
        event.get("description", ""),
    ).strip()
    description = re.sub(r"#+\s*", "", description).strip()
    if len(description) >= 40:
        return _fit_sentences(description) or description

    venue = (event.get("venue") or "").split(":")[0].strip()
    title = (event.get("title") or "This one").strip()
    if venue:
        return f"We would happily send you to {title} at {venue} — book ahead, seats go fast."
    return f"We would happily send you to {title} — book ahead, seats go fast."


def get_city_events(limit: int = 8, enrich_top: int = 8) -> list[dict]:
    html = _get(EXPLORE_URL)

    # Layer 1: rich schema.org events straight off the explore page.
    events = [_from_schema_event(n) for n in _schema_events(_extract_ldjson(html))]

    # Layer 2: anchors fill gaps (and usually dominate on cached pages).
    by_url = {e["url"].rstrip("/"): e for e in events}
    for anchor in _anchor_events(html):
        key = anchor["url"].rstrip("/")
        if key in by_url:
            existing = by_url[key]
            existing.setdefault("_etid", anchor["_etid"])
            continue
        events.append(anchor)

    # Dedupe by ET id where available, else title.
    unique: dict[str, dict] = {}
    for ev in events:
        key = ev.get("_etid") or ev["title"].lower()
        if key not in unique:
            unique[key] = ev

    ordered = list(unique.values())[: max(limit, enrich_top)]

    # Layer 3: enrich the ones missing venue/date/image.
    for ev in ordered[:enrich_top]:
        if not (ev["venue"] and ev["time"] and ev["image"]):
            _enrich(ev)

    # Drop past events, untitled entries, and internal keys.
    now = datetime.now(timezone.utc)
    final = []
    for e in ordered:
        if not e["title"]:
            continue
        if e["time"]:
            try:
                start = datetime.fromisoformat(e["time"])
                if start.tzinfo is None:
                    start = start.replace(tzinfo=timezone.utc)
                if start < now:
                    continue
            except ValueError:
                pass  # unparseable date - keep the event
        e["editorial"] = _editorialise(e)
        final.append({k: v for k, v in e.items() if not k.startswith("_")})
    return final[:limit]


if __name__ == "__main__":
    if hasattr(sys.stdout, "reconfigure"):
        sys.stdout.reconfigure(encoding="utf-8")
    found = get_city_events()
    print(json.dumps(found, indent=2, ensure_ascii=False))
    if not found:
        print("No events extracted - markup may have changed.", file=sys.stderr)
        sys.exit(1)