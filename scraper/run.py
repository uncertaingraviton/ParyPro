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

    if len(failures) == 2:
        # Both failed (e.g. Instagram/BookMyShow blocking GitHub's IPs).
        # If last-good feeds already exist, keep them serving and stay green -
        # a red cron every 6 hours helps nobody. Fail loudly only when there
        # is no data at all to fall back on.
        have_last_good = all(
            (FEED_DIR / f"{name}.json").exists() for name in ("hotel", "city")
        )
        if have_last_good:
            print(
                "All sources blocked; keeping last-good feeds. "
                "Consider setting APIFY_TOKEN for an Instagram fallback.",
                file=sys.stderr,
            )
            return 0
        return 1

    return 0


if __name__ == "__main__":
    raise SystemExit(main())