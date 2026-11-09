"""Correct document language and keep the static 404 out of search indexes."""
from __future__ import annotations

import re
import sys
from pathlib import Path


def main() -> int:
    out = Path(sys.argv[1] if len(sys.argv) > 1 else "out")
    if not out.is_dir():
        print(f"FAIL: export directory missing: {out}")
        return 1

    localized = 0
    for page in (out / "uk").rglob("*.html"):
        text = page.read_text(encoding="utf-8")
        text, count = re.subn(r"<html\s+lang=(['\"])en\1", '<html lang="uk"', text, count=1, flags=re.I)
        if count:
            page.write_text(text, encoding="utf-8")
            localized += 1

    not_found = out / "404.html"
    if not not_found.is_file():
        print("FAIL: static 404.html missing")
        return 1
    text = not_found.read_text(encoding="utf-8")
    text = re.sub(r'<meta\s+name="robots"[^>]*>\s*', "", text, flags=re.I)
    text = re.sub(r"</head>", '<meta name="robots" content="noindex, follow"/></head>', text, count=1, flags=re.I)
    not_found.write_text(text, encoding="utf-8")
    print(f"PASS: set lang=uk on {localized} exported Ukrainian routes and marked 404.html noindex")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
