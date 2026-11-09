"""Validate the generated route tree and all local HTML links for static hosting."""
from __future__ import annotations

import html.parser
import json
import re
import sys
import os
from pathlib import Path
from urllib.parse import unquote, urlsplit

ROOT = Path(__file__).resolve().parents[1]
OUT = Path(sys.argv[1]) if len(sys.argv) > 1 else ROOT / "out"
events = json.loads((ROOT / "src/content/events.json").read_text(encoding="utf-8"))
base_path = os.environ.get("NEXT_PUBLIC_BASE_PATH", "").rstrip("/")
site_url = os.environ.get("NEXT_PUBLIC_SITE_URL", "https://uaTeg.com").rstrip("/").lower()

class Links(html.parser.HTMLParser):
    def __init__(self) -> None:
        super().__init__()
        self.values: list[str] = []
    def handle_starttag(self, tag: str, attrs: list[tuple[str, str | None]]) -> None:
        for name, value in attrs:
            if name in {"href", "src"} and value:
                self.values.append(value)

def main() -> int:
    errors: list[str] = []
    required = ["index.html", "404.html", "en/index.html", "uk/index.html", "robots.txt", "sitemap.xml", ".nojekyll"]
    for route in required:
        if not (OUT / route).is_file():
            errors.append(f"missing required export file: {route}")
    route_count = 0
    for locale in ("en", "uk"):
        for route in ("about", "events", "map", "timeline", "team", "organize", "contact", "privacy", "gallery"):
            route_count += 1
            if not (OUT / locale / route / "index.html").is_file():
                errors.append(f"missing route: /{locale}/{route}/")
        for event in events:
            route_count += 1
            if not (OUT / locale / "events" / event["slug"] / "index.html").is_file():
                errors.append(f"missing event route: /{locale}/events/{event['slug']}/")

    if len(events) != 33:
        errors.append(f"expected 33 event records in public JSON, found {len(events)}")
    if not OUT.exists():
        errors.append(f"export folder does not exist: {OUT}")
    else:
        all_files = [path for path in OUT.rglob("*") if path.is_file()]
        root_html = (OUT / "index.html").read_text(encoding="utf-8", errors="replace") if (OUT / "index.html").is_file() else ""
        if "Remembering," not in root_html or "The Archive" not in root_html or "Organize an Event" not in root_html:
            errors.append("root route must render the English landing page")
        if "Photographs &amp; source materials" not in (OUT / "en" / "gallery" / "index.html").read_text(encoding="utf-8", errors="replace") if (OUT / "en" / "gallery" / "index.html").is_file() else True:
            errors.append("English photo archive page is missing its gallery heading")
        for locale in ("en", "uk"):
            gallery = OUT / locale / "gallery" / "index.html"
            if gallery.is_file() and "photo-archive-grid" not in gallery.read_text(encoding="utf-8", errors="replace"):
                errors.append(f"photo gallery /{locale}/gallery/ has no rendered archive grid")
        for locale in ("en", "uk"):
            organizer_page = OUT / locale / "organize" / "index.html"
            if organizer_page.is_file():
                organizer_html = organizer_page.read_text(encoding="utf-8", errors="replace")
                if "FORM_NOT_CONFIGURED" not in organizer_html:
                    errors.append(f"organizer page /{locale}/organize/ must expose its unconfigured state")
                if re.search(r"<form(?:\s|>)", organizer_html, flags=re.I):
                    errors.append(f"unconfigured organizer page /{locale}/organize/ contains an active form")
        sitemap_path = OUT / "sitemap.xml"
        if sitemap_path.is_file():
            sitemap_text = sitemap_path.read_text(encoding="utf-8", errors="replace")
            for locale in ("en", "uk"):
                for event in events:
                    expected = f"{site_url}{base_path}/{locale}/events/{event['slug']}/"
                    if expected not in sitemap_text:
                        errors.append(f"sitemap is missing {expected}")
        for page in (path for path in all_files if path.suffix.lower() == ".html"):
            parser = Links()
            parser.feed(page.read_text(encoding="utf-8", errors="replace"))
            for value in parser.values:
                parsed = urlsplit(value)
                if parsed.scheme or parsed.netloc or not parsed.path.startswith("/"):
                    continue
                logical_path = parsed.path
                if base_path and logical_path.startswith(base_path + "/"):
                    logical_path = logical_path[len(base_path):]
                route = unquote(logical_path).lstrip("/")
                if not route:
                    route = "index.html"
                target = OUT / route
                candidates = [target]
                if parsed.path.endswith("/"):
                    candidates.append(target / "index.html")
                elif not target.suffix:
                    candidates.extend([target.with_suffix(".html"), target / "index.html"])
                if not any(candidate.is_file() for candidate in candidates):
                    errors.append(f"broken local link in {page.relative_to(OUT).as_posix()}: {value}")
        for path in all_files:
            if path.suffix.lower() not in {".html", ".js", ".css", ".json", ".txt", ".xml"}:
                continue
            content = path.read_text(encoding="utf-8", errors="replace").lower()
            forbidden_markers = ("localhost:3000", "vercel.app")
            if path.suffix.lower() == ".html":
                forbidden_markers += ("/_next/image",)
            for forbidden in forbidden_markers:
                if forbidden in content:
                    errors.append(f"unsupported runtime or base path marker {forbidden!r} in {path.relative_to(OUT)}")
            if path.suffix.lower() == ".html" and base_path and "/images/archive/" in content and f"{base_path}/images/archive/" not in content:
                errors.append(f"source image URL missing project base path in {path.relative_to(OUT)}")

    if errors:
        print(f"FAIL: static export validation found {len(errors)} issue(s)")
        print("\n".join(f"- {item}" for item in errors[:40]))
        return 1
    size = sum(path.stat().st_size for path in OUT.rglob("*") if path.is_file())
    print(f"PASS: {route_count} non-home localized routes including 66 event pages, localized homes, root landing, bilingual photo galleries, 404/sitemap/robots/.nojekyll; local links resolve; {size:,} bytes")
    return 0

if __name__ == "__main__":
    raise SystemExit(main())
