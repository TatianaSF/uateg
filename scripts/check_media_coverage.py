"""Check the committed public media catalog and archive PDF integrity."""
from __future__ import annotations

import hashlib
import json
import sys
from collections import Counter
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
OUT = Path(sys.argv[1]) if len(sys.argv) > 1 else ROOT / "out"
catalog = json.loads((ROOT / "src/content/media.json").read_text(encoding="utf-8"))
events = json.loads((ROOT / "src/content/events.json").read_text(encoding="utf-8"))
errors: list[str] = []
if catalog.get("assetCount") != 83 or len(catalog.get("assets", [])) != 83:
    errors.append("expected exactly 83 unique public image assets")
if catalog.get("placementCount") != 126 or len(catalog.get("placements", [])) != 126:
    errors.append("expected exactly 126 source image placements")
if {p.get("pdfPage") for p in catalog.get("placements", [])} != set(range(1, 42)):
    errors.append("media placement map must cover all 41 source pages")
for item in catalog.get("assets", []):
    file_path = OUT / item["src"].lstrip("/")
    if not file_path.is_file():
        errors.append(f"missing public image asset: {item['src']}")
types = Counter(item.get("assetType") for item in catalog.get("assets", []))
if types.get("photograph", 0) + types.get("portrait", 0) != 71 or sum(types.get(kind, 0) for kind in ("emblem", "logo", "document-graphic", "qr-code")) != 12:
    errors.append(f"expected 71 photographs/portraits and 12 source graphics, found {dict(types)}")
for event in events:
    if not any(next((item.get("assetType") in {"photograph", "portrait"} for item in catalog.get("assets", []) if item["id"] == asset_id), False) for asset_id in event.get("media", [])):
        errors.append(f"event {event['id']} has no photographic media")
    for asset_id in event.get("media", []):
        if not any(item["id"] == asset_id for item in catalog.get("assets", [])):
            errors.append(f"event {event['id']} references unknown media {asset_id}")
pdf = OUT / catalog["sourcePdf"].lstrip("/")
if not pdf.is_file():
    errors.append("public source PDF is missing")
else:
    digest = hashlib.sha256(pdf.read_bytes()).hexdigest()
    if digest != catalog["sourcePdfSha256"]:
        errors.append("public source PDF checksum differs from the reviewed source")
if errors:
    print(f"FAIL: {len(errors)} media coverage issue(s)")
    print("\n".join(f"- {item}" for item in errors[:40]))
    raise SystemExit(1)
print("PASS: 83/83 unique media assets (71 photos, 12 source graphics), 126/126 placements across 41 pages, all 33 events illustrated, all references and original PDF checksum")
