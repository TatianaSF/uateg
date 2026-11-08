"""Create a private, page-complete extraction and a sanitized public event catalog."""
from __future__ import annotations

import hashlib
import json
import re
from pathlib import Path

import pymupdf
from PIL import Image

ROOT = Path(__file__).resolve().parents[1]
PRIVATE = ROOT / "source-private"
PDF = PRIVATE / "Angels of Ukraine_eu_15_10_2025.pdf"
INVENTORY = PRIVATE / "source_inventory.json"
ARCHIVE = PRIVATE / "extracted"
PUBLIC = ROOT / "src" / "content"

COUNTRY_UK = {
    "Slovakia": "Словаччина", "Poland": "Польща", "Canada": "Канада",
    "Malta": "Мальта", "Sweden": "Швеція", "United Kingdom": "Велика Британія",
    "Germany": "Німеччина", "Cyprus": "Кіпр",
}
CITY_UK = {
    "Banská Bystrica": "Банська Бистриця", "Warsaw": "Варшава", "Prešov": "Пряшів", "Košice": "Кошице",
    "Toronto": "Торонто", "Montréal": "Монреаль", "Québec City": "Квебек", "Edmonton": "Едмонтон", "Winnipeg": "Вінніпег",
    "Bratislava": "Братислава", "Kežmarok": "Кежмарок", "Sliema": "Сліма", "Valletta": "Валлетта", "Stockholm": "Стокгольм",
    "Uppsala": "Уппсала", "Newbury": "Ньюбері", "Berlin": "Берлін", "Leipzig": "Лейпциг", "Potsdam": "Потсдам",
    "Shrewsbury": "Шрусбері", "Cleobury Mortimer": "Клебері-Мортімер", "Ludlow": "Ладлоу", "Limassol": "Лімасол",
    "Larnaca": "Ларнака", "Žilina": "Жиліна",
}

def main() -> None:
    PRIVATE.mkdir(exist_ok=True)
    ARCHIVE.mkdir(exist_ok=True)
    PUBLIC.mkdir(parents=True, exist_ok=True)
    inventory = json.loads(INVENTORY.read_text(encoding="utf-8"))
    digest = hashlib.sha256(PDF.read_bytes()).hexdigest()
    if digest != inventory["source_pdf_sha256"]:
        raise SystemExit(f"PDF hash mismatch: {digest}")

    doc = pymupdf.open(PDF)
    if len(doc) != 41 or len(inventory["source_pages"]) != 41:
        raise SystemExit(f"Expected 41 pages, got PDF={len(doc)} inventory={len(inventory['source_pages'])}")
    image_dir = ARCHIVE / "images"
    image_dir.mkdir(exist_ok=True)
    web_review_dir = ARCHIVE / "web-review-derivatives"
    web_review_dir.mkdir(exist_ok=True)
    web_variants: dict[str, str] = {}
    extracted = []
    for index, page in enumerate(doc, start=1):
        page_text = page.get_text("text", sort=True)
        draft_text = inventory["source_pages"][index-1]["raw_text"]
        (ARCHIVE / f"page-{index:02}-pdf-text.txt").write_text(page_text, encoding="utf-8")
        (ARCHIVE / f"page-{index:02}-inventory-text.txt").write_text(draft_text, encoding="utf-8")
        preview_dir = ARCHIVE / "page-previews"
        preview_dir.mkdir(exist_ok=True)
        page.get_pixmap(matrix=pymupdf.Matrix(1.0, 1.0), alpha=False).save(preview_dir / f"page-{index:02}.png")
        token = lambda value: sorted(re.findall(r"[\w]+", value.casefold(), flags=re.UNICODE))
        images = []
        for image_num, item in enumerate(page.get_images(full=True), start=1):
            xref = item[0]
            payload = doc.extract_image(xref)
            content = payload["image"]
            sha = hashlib.sha256(content).hexdigest()
            image_path = image_dir / f"page-{index:02}-xref-{xref}-{sha[:12]}.{payload['ext']}"
            if not image_path.exists():
                image_path.write_bytes(content)
            if sha not in web_variants:
                variant_path = web_review_dir / f"{sha}.webp"
                if not variant_path.exists():
                    with Image.open(image_path) as source_image:
                        source_image.thumbnail((1800, 1800), Image.Resampling.LANCZOS)
                        if source_image.mode not in ("RGB", "RGBA"):
                            source_image = source_image.convert("RGBA" if "transparency" in source_image.info else "RGB")
                        source_image.save(variant_path, "WEBP", quality=78, method=6)
                web_variants[sha] = str(variant_path.relative_to(ARCHIVE))
            images.append({"xref": xref, "file": str(image_path.relative_to(ARCHIVE)), "sha256": sha,
                           "width": payload["width"], "height": payload["height"], "extension": payload["ext"],
                           "private_web_review_derivative": web_variants[sha], "rights_approval_status": "pending",
                           "alt_text_review_needed": True})
        extracted.append({"page": index, "pdf_text_file": f"page-{index:02}-pdf-text.txt",
                          "inventory_draft_text_file": f"page-{index:02}-inventory-text.txt",
                          "preview_file": f"page-previews/page-{index:02}.png", "image_count": len(images),
                          "images": images, "same_word_multiset": token(page_text) == token(draft_text)})
    (ARCHIVE / "extraction_manifest.json").write_text(json.dumps({"pdf_sha256": digest, "page_count": len(doc),
        "pages": extracted}, ensure_ascii=False, indent=2), encoding="utf-8")

    events = []
    for source in inventory["events"]:
        city = source["city"]
        date_match = re.search(r"(?<!\d)(?:\d{1,2}\.\d{1,2}\.\d{4}|\d{1,2}\.\d{4})(?!\d)", source["source_raw_text"])
        date_original = date_match.group(0) if date_match else source["date_iso_partial"]
        events.append({
            "id": source["id"], "slug": source["id"], "sourcePageIds": source["source_page_ids"],
            "city": {"en": city, "uk": CITY_UK[city]}, "sourceCityLabel": source["city_in_source"],
            "country": {"en": source["country"], "uk": COUNTRY_UK[source["country"]]},
            "canonicalCityId": city.casefold().replace(" ", "-"),
            "countryCode": source["country_code"], "dateOriginal": date_original,
            "dateIsoPartial": source["date_iso_partial"],
            "datePrecision": source["date_precision"], "memorialAngelCount": source["memorial_angel_count_on_slide"],
            "memorialCountContext": "Historical memorial angel count printed on this event slide; not a current or independently verified casualty total.",
            "personIds": [], "organizationIds": [],
            "title": {"en": f"Angels of Ukraine in {city}", "uk": f"«Янголи України» у місті {city}"},
            "description": {
                "en": "A memorial gathering documented in the Angels of Ukraine source archive. This short description is an unpublished editorial draft.",
                "uk": "Меморіальну акцію задокументовано в архіві «Янголи України». Цей короткий опис є редакційною чернеткою.",
            },
            "translationStatus": {"en": "needs_review", "uk": "needs_review"},
            "editorialFlags": ["source_description_not_published", "translation_needs_review", "image_rights_pending", "coordinates_unverified"],
            "rawArchiveRef": f"archive-page:{source['source_page']:02}",
            "coordinates": None, "coordinateSourceUrl": None, "media": [], "publicationStatus": "public_safe_metadata_only",
        })
    (PUBLIC / "events.json").write_text(json.dumps(events, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(f"PDF_SHA256={digest}")
    print(f"PDF_PAGES={len(doc)}")
    print(f"EXTRACTED_IMAGES={sum(p['image_count'] for p in extracted)}")
    print(f"EVENTS={len(events)}")
    print(f"CANONICAL_CITIES={len({e['city']['en'] for e in events})}")
    print(f"COUNTRIES={len({e['countryCode'] for e in events})}")
    print(f"TEXT_WORD_MATCHES={sum(p['same_word_multiset'] for p in extracted)}/{len(extracted)}")

if __name__ == "__main__":
    main()
