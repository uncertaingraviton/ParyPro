"""One-off helper: download accurate lead images for city places from Wikipedia."""
import json
import time
import urllib.parse
import urllib.request

TOPICS = {
    # id: wikipedia title
    "charminar": "Charminar",
    "laad": "Laad Bazaar",
    "chowmahalla": "Chowmahalla Palace",
    "hitec": "HITEC City",
    "jubilee": "Jubilee Hills",
    "banjara": "Banjara Hills",
    "salar": "Salar Jung Museum",
    "biryani": "Hyderabadi biryani",
    "chai": "Irani café",
    "pearls": "Basra pearl",
    "necklace": "Hussain Sagar",
    "golconda": "Golconda",
    "qutb": "Qutb Shahi Tombs",
    "paigah": "Paigah Tombs",
    "ramoji": "Ramoji Film City",
    "zoo": "Nehru Zoological Park",
    "shilparamam": "Shilparamam",
    "birla": "Birla Mandir, Hyderabad",
    "mecca": "Mecca Masjid, Hyderabad",
    "haleem": "Hyderabadi haleem",
}

HEADERS = {"User-Agent": "trident-concierge-site/1.0 (contact: desk)"}

# One-off local run: the machine's cert store rejects Wikipedia's chain.
CTX = urllib.request.build_opener(
    urllib.request.HTTPSHandler(context=__import__("ssl")._create_unverified_context())
).open


def fetch(url: str) -> bytes:
    req = urllib.request.Request(url, headers=HEADERS)
    with CTX(req, timeout=30) as r:
        return r.read()


RETRY_ONLY = {"biryani", "chai", "golconda", "qutb", "paigah", "shilparamam", "pearls"}

for pid, title in TOPICS.items():
    if pid not in RETRY_ONLY:
        continue
    for attempt in range(3):
        try:
            time.sleep(4)
            api = f"https://en.wikipedia.org/api/rest_v1/page/summary/{urllib.parse.quote(title)}"
            meta = json.loads(fetch(api))
            img = (meta.get("originalimage") or {}).get("source") or (meta.get("thumbnail") or {}).get("source")
            if not img:
                print(f"MISS {pid}: no image on '{title}'")
                break
            time.sleep(2)
            data = fetch(img)
            ext = ".jpg" if ".jpg" in img.lower() or ".jpeg" in img.lower() else ".png"
            path = rf"src/assets/place-{pid}{ext}"
            with open(path, "wb") as f:
                f.write(data)
            print(f"OK   {pid}: {len(data)//1024} KB <- {img[:90]}")
            break
        except Exception as exc:  # noqa: BLE001
            print(f"FAIL {pid} (attempt {attempt + 1}): {exc}")
