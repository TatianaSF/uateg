"""Check that static homepage exports contain the real bilingual Classic Hero UI."""
from __future__ import annotations

import sys
from html.parser import HTMLParser
from pathlib import Path

OUT = Path(sys.argv[1]) if len(sys.argv) > 1 else Path("out")

class HeroCardLinks(HTMLParser):
    def __init__(self) -> None:
        super().__init__()
        self.hrefs: list[str] = []

    def handle_starttag(self, tag: str, attrs: list[tuple[str, str | None]]) -> None:
        values = dict(attrs)
        if tag == "a" and "classic-hero-card" in (values.get("class") or "").split():
            self.hrefs.append(values.get("href") or "")

EXPECTED = {
    "index.html": [
        "A PUBLIC MEMORIAL PROJECT", "Remembering,", "together.",
        "A travelling memorial installation to honour Ukrainian children whose lives were taken by war.",
        "The Archive", "Timeline", "The Map", "Gallery", "Organize an Event",
        "/en/events/", "/en/timeline/", "/en/map/", "/en/gallery/", "/en/organize/",
    ],
    "en/index.html": [
        "A PUBLIC MEMORIAL PROJECT", "Remembering,", "together.",
        "33", "25", "8", "All documented events", "From 2022 to 2025",
        "Events across the world", "Photos, people, places", "Bring Angels of Ukraine to your city",
    ],
    "uk/index.html": [
        "ПУБЛІЧНИЙ МЕМОРІАЛЬНИЙ ПРОЄКТ", "Пам’ятаємо", "разом.",
        "33", "25", "8", "Архів", "Хронологія", "Мапа", "Галерея", "Організувати акцію",
        "/uk/events/", "/uk/timeline/", "/uk/map/", "/uk/gallery/", "/uk/organize/",
    ],
}

def main() -> int:
    errors: list[str] = []
    for relative, required in EXPECTED.items():
        path = OUT / relative
        if not path.is_file():
            errors.append(f"missing homepage export: {relative}")
            continue
        html = path.read_text(encoding="utf-8", errors="replace")
        parser = HeroCardLinks()
        parser.feed(html)
        for phrase in required:
            if phrase not in html:
                errors.append(f"{relative} is missing rendered content: {phrase}")
        if len(parser.hrefs) != 5:
            errors.append(f"{relative} does not render exactly five live hero cards")
        locale = "uk" if relative == "uk/index.html" else "en"
        expected_routes = {f"/{locale}/{route}/" for route in ("events", "timeline", "map", "gallery", "organize")}
        if set(parser.hrefs) != expected_routes:
            errors.append(f"{relative} has incorrect localized hero card destinations")
        for asset in ("classic-hero-wide.webp", "classic-hero-mobile.webp"):
            if asset not in html:
                errors.append(f"{relative} is missing responsive artwork reference {asset}")
        if "APPROVED_CLASSIC_HERO_MOCKUP.png" in html:
            errors.append(f"{relative} must not embed the full-page reference mockup")

    for route in ("en/events/index.html", "en/timeline/index.html", "en/map/index.html", "en/gallery/index.html", "en/organize/index.html",
                  "uk/events/index.html", "uk/timeline/index.html", "uk/map/index.html", "uk/gallery/index.html", "uk/organize/index.html"):
        if not (OUT / route).is_file():
            errors.append(f"Classic Hero card target is missing: {route}")

    if errors:
        print(f"FAIL: Classic Hero export check found {len(errors)} issue(s)")
        print("\n".join(f"- {error}" for error in errors))
        return 1
    print("PASS: root, English and Ukrainian homepages render the real Classic Hero text, archive totals, five live links and both responsive assets")
    return 0

if __name__ == "__main__":
    raise SystemExit(main())
