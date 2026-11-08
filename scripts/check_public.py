"""Fail when private source files or likely contact details enter a Pages build."""
from __future__ import annotations

import re
import fnmatch
import hashlib
import json
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
AUTHORIZED_PDF = "archive/angels-of-ukraine-source-2025-10-15.pdf"
AUTHORIZED_PDF_SHA256 = "48e6f594751de93204491e78f451610231ddf798d29d4b7e71ed1db037d8dc7b"
AUTHORIZED_CONTACTS = (b"+421 940 261 128", b"+421 904 020 704", b"peshterianu@gmail.com", b"mitsonata4@gmail.com")
AUTHORIZED_PHONE_DIGITS = (b"421940261128", b"421904020704")

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
        if path.suffix.lower() in {".pdf", ".doc", ".docx"} and relative != AUTHORIZED_PDF:
            findings.append(f"unapproved source document in public output: {relative}")
        if relative == AUTHORIZED_PDF:
            digest = hashlib.sha256(data).hexdigest()
            if digest != AUTHORIZED_PDF_SHA256:
                findings.append("authorized source PDF checksum mismatch")
            continue
        lowered = data.lower()
        for marker in FORBIDDEN_TEXT:
            if marker in lowered:
                findings.append(f"private source reference in {relative}: {marker.decode('utf-8')}")
                break
        for label, pattern in (("email", EMAIL), ("phone", PHONE)):
            unauthorized = False
            for match in pattern.finditer(data):
                value = match.group(0)
                if label == "phone" and re.sub(rb"\D", b"", value) in AUTHORIZED_PHONE_DIGITS:
                    continue
                if label == "email" and value.lower() in {item.lower() for item in AUTHORIZED_CONTACTS if b"@" in item}:
                    continue
                unauthorized = True
                break
            if unauthorized:
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
