"""Orchestrates both scrapers and writes public/feed/*.json.

Write-on-success: if a scraper fails, its existing JSON file is left untouched
so the site always has last-good data. Each output carries a `fetchedAt`
timestamp so the frontend can ignore stale feeds.
"""

from __future__ import annotations

import json
import sys
from datetime import datetime, timezone
from pathlib import Path

REPO_ROOT = Path(__file__).resolve().parent.parent
FEED_DIR = REPO_ROOT / "public" / "feed"

sys.path.insert(0, str(Path(__file__).parent))

import bookmyshow  # noqa: E402


def write_feed(name: str, payload: dict) -> None:
    FEED_DIR.mkdir(parents=True, exist_ok=True)
    target = FEED_DIR / f"{name}.json"
    tmp = target.with_suffix(".tmp")
    tmp.write_text(
        json.dumps(payload, indent=2, ensure_ascii=False), encoding="utf-8"
    )
    tmp.replace(target)
    print(f"wrote {target.relative_to(REPO_ROOT)}")


def main() -> int:
    now = datetime.now(timezone.utc).isoformat()
    failures: list[str] = []

    # --- BookMyShow -> city happenings ---
    try:
        events = bookmyshow.get_city_events()
        write_feed(
            "city",
            {
                "fetchedAt": now,
                "source": "bookmyshow/hyderabad-events",
                "events": events,
            },
        )
    except Exception as exc:  # noqa: BLE001
        failures.append(f"bookmyshow: {exc}")

    if failures:
        print("Scrape finished with failures:", file=sys.stderr)
        for failure in failures:
            print(f"  - {failure}", file=sys.stderr)

    if failures:
        have_city = (FEED_DIR / "city.json").exists()
        if have_city:
            print(
                "BookMyShow blocked; keeping last-good city feed.",
                file=sys.stderr,
            )
            return 0
        return 1

    return 0


if __name__ == "__main__":
    raise SystemExit(main())