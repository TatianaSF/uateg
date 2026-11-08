"""Fail when private source files or likely contact details enter a Pages build."""
from __future__ import annotations

import re
import fnmatch
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
TARGET = Path(sys.argv[1]) if len(sys.argv) > 1 else ROOT / "out"
EMAIL = re.compile(rb"[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}", re.I)
PHONE = re.compile(rb"\+\d[\d ()-]{7,}\d")
FORBIDDEN_NAMES = ("source_inventory.json", "Angels of Ukraine_eu_15_10_2025.pdf", "source-private")
FORBIDDEN_TEXT = tuple(item.encode("utf-8").lower() for item in FORBIDDEN_NAMES)
RASTER_SUFFIXES = {".jpg", ".jpeg", ".png", ".webp", ".gif"}
APPROVED_MEDIA_FILE = ROOT / "scripts" / "approved_public_media.txt"

def main() -> int:
    if not TARGET.exists():
        print(f"FAIL: public artifact folder not found: {TARGET}")
        return 1
    findings: list[str] = []
    approved_media = {
        line.strip()
        for line in APPROVED_MEDIA_FILE.read_text(encoding="utf-8").splitlines()
        if line.strip() and not line.lstrip().startswith("#")
    } if APPROVED_MEDIA_FILE.is_file() else set()
    for path in TARGET.rglob("*"):
        if not path.is_file():
            continue
        relative = path.relative_to(TARGET).as_posix()
        if path.suffix.lower() in RASTER_SUFFIXES and not any(fnmatch.fnmatchcase(relative, pattern) for pattern in approved_media):
            findings.append(f"unapproved raster media in public output: {relative}")
        if path.name in FORBIDDEN_NAMES or any(secret in relative for secret in FORBIDDEN_NAMES):
            findings.append(f"private filename: {relative}")
            continue
        try:
            data = path.read_bytes()
        except OSError as error:
            findings.append(f"unreadable: {relative} ({error})")
            continue
        if path.suffix.lower() in {".pdf", ".doc", ".docx"}:
            findings.append(f"source document in public output: {relative}")
        lowered = data.lower()
        for marker in FORBIDDEN_TEXT:
            if marker in lowered:
                findings.append(f"private source reference in {relative}: {marker.decode('utf-8')}")
                break
        for label, pattern in (("email", EMAIL), ("phone", PHONE)):
            match = pattern.search(data)
            if match:
                findings.append(f"possible {label} in {relative} (value withheld from logs)")
    if findings:
        print("FAIL: review public output before publication")
        print("\n".join(f"- {item}" for item in findings))
        return 1
    size = sum(path.stat().st_size for path in TARGET.rglob("*") if path.is_file())
    print(f"PASS: public output contains no source files or likely contact details ({size:,} bytes)")
    return 0

if __name__ == "__main__":
    raise SystemExit(main())
