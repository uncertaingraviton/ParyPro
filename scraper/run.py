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
import instagram  # noqa: E402


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

    # --- Instagram -> hotel happenings ---
    try:
        promos = instagram.get_promotions()
        write_feed(
            "hotel",
            {
                "fetchedAt": now,
                "source": "instagram/@tridenthyderabad",
                "promotions": promos,
            },
        )
    except Exception as exc:  # noqa: BLE001
        failures.append(f"instagram: {exc}")

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

    # Exit non-zero only if BOTH failed — partial success still refreshes
    # whatever it could, which is better than nothing.
    return 1 if len(failures) == 2 else 0


if __name__ == "__main__":
    raise SystemExit(main())