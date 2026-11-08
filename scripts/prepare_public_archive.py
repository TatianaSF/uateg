"""Prepare deduplicated, source-derived public media from the ignored archive.

This one-time source preparation tool copies only the original PDF and the
review WebP derivatives into the public asset tree. The complete extraction
archive, contact sheets, page previews and inventory remain private.
"""
from __future__ import annotations

import hashlib
import json
import shutil
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
PRIVATE = ROOT / "source-private"
EXTRACTED = PRIVATE / "extracted"
PUBLIC = ROOT / "public"
PDF_SOURCE = PRIVATE / "Angels of Ukraine_eu_15_10_2025.pdf"
PDF_TARGET = PUBLIC / "archive" / "angels-of-ukraine-source-2025-10-15.pdf"
EVENTS_PATH = ROOT / "src" / "content" / "events.json"
CATALOG_PATH = ROOT / "src" / "content" / "media.json"
INVENTORY_PATH = PRIVATE / "source_inventory.json"
MANIFEST_PATH = EXTRACTED / "extraction_manifest.json"
DERIVATIVES = EXTRACTED / "web-review-derivatives"
ASSET_DIR = PUBLIC / "images" / "archive"
APPROVED_MEDIA = ROOT / "scripts" / "approved_public_media.txt"
REPORT_PATH = ROOT / "MEDIA_COVERAGE.md"
PDF_SHA256 = "48e6f594751de93204491e78f451610231ddf798d29d4b7e71ed1db037d8dc7b"

UKRAINIAN_TRANSLATIONS: dict[int, str] = {
    5: "У 2022 році Ольга Arakelyan уперше запросила Янголів до міста, організувавши захід до Дня Незалежності України. У війні загинуло 363 дитини. Війна триває.",
    6: "Благодійний захід відбувся до третьої річниці повномасштабного вторгнення Російської Федерації. Захід організували UA HUB і Plast Warsaw. За Янголами доглядала Olga Kasian.",
    7: "Захід відбувся за день до дня Святого Миколая, на вшанування пам’яті в межах «Янголів України». Велика подяка голові об’єднання Rusíni-Ukrajinci SR, Mr. Pavlа Bohdana, та Vitalia Tuzhelyak за сприяння й допомогу.",
    8: "Olga Kasian\n«1000 днів незламності».",
    9: "Над небом босоніж ідуть маленькі розгублені янголята. Підіймаються, наче сходинками, крізь хмари вгору до Бога. Захід відбувся під час щорічного заходу в Кошицях «DAYS OF UKRAINE 2024» — Veteran’s Mile. Sofia Yehorova прочитала вірш «Little Angel» Hleb Babich. Plast-Stanytsia Kosice брала активну участь.",
    10: "Зворушливий захід «Янголи України», організований Українською шкільною радою Торонто та Конґресом українців Канади, відбувся в Центральному парку Торонто. Офіційне вшанування відбулося під час відкриття Дня Незалежності та об’єднало учнів, батьків і небайдужих мешканців Торонто, щоб ушанувати пам’ять невинних жертв війни. Візит Янголів до Канади став можливим завдяки Tatyana Sunak.",
    11: "Ukrainian People's Fund Desjardins у Монреалі (Caise populaire Desjardins ukrainienne de Montréal) долучився до марафону пам’яті й виставляв Янголів протягом двох тижнів. Це була чудова нагода нагадати місцевим мешканцям про тривалу війну та її жахіття в Україні. За проведення заходів у Монреалі та Квебеку дякуємо Nataliya Khrushch.",
    12: "Захід відбувся перед благодійним концертом танцювального ансамблю Barvinok.",
    13: "У центрі Монреаля, у провінції Квебек, на площі Phillips українська громада вийшла на протест і засудила напад Росії на дитячу лікарню «Okhmadit» у Києві 8 липня 2025 року.",
    14: "Учні курсів українознавства Ivan Franko при українській школі вшанували пам’ять юних українських дітей, які загинули внаслідок російської агресії. Акцію організувала Liliya Sukhy.",
    15: "Вінніпег став першим містом Канади, де відбувся захід «Янголи України». Його підтримали Конґрес українців Канади та Провінційна рада Манітоби. До Канади Янголів запросила Tatiana Sunak, голова Національної української освітньої ради КУК. Організаторки: Nataliya Sovinska та Susan Zuk.",
    16: "Захід відбувся в межах подій до другої річниці початку повномасштабної російської агресії, організованих Mier Ukraine спільно з іншими організаціями. Безпосередньо за нашими Янголами доглядали SME SPOLU.",
    17: "Українсько-словацький хаб долучив це чудове туристичне місто до марафону пам’яті.",
    18: "Ініціаторка Olena Chaplytska виготовила 20-метровий прапор.",
    19: "Захід відбувся одночасно із самітом щодо української «формули миру» на Мальті за участю 66 країн. Ініціаторка — Olena Chaplytska.",
    20: "Акція відбулася під час дев’ятого щорічного заходу «DAYS OF UKRAINE 2023» — Veteran’s Mile у Кошицях. Організатор заходу — Eduard Buras. Plast-Stanytsia Kosice брала активну участь.",
    21: "Янголи долучилися до демонстрації, організованої Nordic Ukraine Forum. Подяка Oksana Dudarko та Inna Volchkova. Вірш Glib Babich «Little Angel» точно відображає нинішню ситуацію в Україні.",
    22: "Захід організувала Oksana Dudarko. Підтримку надали A. Plahotnyuk, повноважний посол України у Швеції, Українська греко-католицька церква у Стокгольмі та O. Andriy. Окрасою заходу стала Favorit Studio, Olena Bryl.",
    23: "Дякуємо Nataliia Buhrii-Shramk за організацію заходу. Також дякуємо Dewbury та West Berkshire Ukraine Support Group за підтримку.",
    24: "Підтримку надали Ukrainische Botschaft in Berlin / Посольство України в Берліні — Alisa Podolyak та Iryna Samchenko — Heinrich Böll Foundation.",
    25: "Захід у Katholische Propstei St. Trinitatis організували й провели Anna Logachova та Olga Kashchuk.",
    26: "Фотографії надав Borys Bukhman (Одеса, Україна). Церква Святого Миколая. Усі три акції в Німеччині відбулися завдяки активній позиції Daria Kostyukova.",
    27: "",
    28: "",
    29: "Це результат співпраці Svitlana Dzedzey з організацією Ludlow Supports Refugees.",
    30: "Заходи підтримали українці на Кіпрі, Plast Cyprus і душпастирство Української греко-католицької церкви в Республіці Кіпр. Ініціаторка — Lyolya Filimonova.",
    31: "Заходи підтримали українці на Кіпрі та Obiimy Cyprusi. Ініціаторка — Lyolya Filimonova.",
    32: "Ми вшанували пам’ять загиблих і долучилися до Veteran’s Mile під час Днів України 2022 у Кошицях.",
    33: "У межах благодійного концерту, який підтримала OZ Zdielaj. Організаторка: Lucia Salzerova.",
    34: "Акція розпочалася в межах Фестивалю української культури в Banska Bystrica. Організаторка фестивалю — Olia Arakelian. Координаторка акції — Evnika Pochapska.",
    35: "Меморіальний захід «Янголи України» відбувся разом із виставкою дитячих малюнків. Дякуємо за підтримку голові об’єднання Rusíni-Ukrainci SR Mr.Pavol Bohdan і Mr.Ivan Tuželjak, а також за участь Vitalya Tuželjak.",
    36: "Акцію організувала Українська спілка в місті Zhilina за ініціативи Inna Onyshchenko.",
    37: "Перша акція відбулася в Кошицях на День захисту дітей і тривала тиждень. Українки, які знайшли прихисток у Словаччині разом із дітьми, зв’язали 243 янголи з жовтої та синьої ниток і повісили їх у центрі міста. Відтоді Янголи почали подорожувати містами різних країн.",
}


def sha256(path: Path) -> str:
    digest = hashlib.sha256()
    with path.open("rb") as source:
        for block in iter(lambda: source.read(1024 * 1024), b""):
            digest.update(block)
    return digest.hexdigest()


def write_json(path: Path, value: object) -> None:
    path.write_text(json.dumps(value, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")


def main() -> None:
    if not PDF_SOURCE.is_file() or not MANIFEST_PATH.is_file() or not INVENTORY_PATH.is_file():
        raise SystemExit("Private source PDF, extraction manifest and inventory are required locally.")
    if sha256(PDF_SOURCE) != PDF_SHA256:
        raise SystemExit("The source PDF checksum differs from the reviewed source inventory.")

    events = json.loads(EVENTS_PATH.read_text(encoding="utf-8"))
    inventory = json.loads(INVENTORY_PATH.read_text(encoding="utf-8"))
    manifest = json.loads(MANIFEST_PATH.read_text(encoding="utf-8"))
    pages_by_number = {item["page"]: item for item in manifest["pages"]}
    inventory_pages = {item["page"]: item for item in inventory["source_pages"]}
    events_by_page = {event["sourcePageIds"][0]: event for event in events}
    assets: dict[str, dict[str, object]] = {}
    placements: list[dict[str, object]] = []
    event_media: dict[int, list[str]] = {page: [] for page in events_by_page}

    for page_number in range(1, 42):
        source_page = pages_by_number[page_number]
        event = events_by_page.get(page_number)
        for occurrence, item in enumerate(source_page["images"], start=1):
            asset_id = item["sha256"]
            source_webp = EXTRACTED / item["private_web_review_derivative"]
            target_webp = ASSET_DIR / f"{asset_id}.webp"
            if not source_webp.is_file():
                raise SystemExit(f"Missing private WebP derivative for page {page_number} ({asset_id}).")
            if asset_id not in assets:
                target_webp.parent.mkdir(parents=True, exist_ok=True)
                shutil.copy2(source_webp, target_webp)
                assets[asset_id] = {
                    "id": asset_id,
                    "src": f"/images/archive/{asset_id}.webp",
                    "width": item["width"],
                    "height": item["height"],
                    "webpBytes": target_webp.stat().st_size,
                    "assetType": "source-image",
                }
            if asset_id == "8ce30b02eea734e2509a02042c790f1f240c7332696808f1816828f2bf9a3696":
                alt_en = "The Ukrainian trident emblem shown in the source document."
                alt_uk = "Тризуб — емблема України, зображена в першоджерелі."
                assets[asset_id]["assetType"] = "emblem"
            elif page_number == 40 and item["width"] == 410:
                person = "Nataliia Mitso" if occurrence == 2 else "Svitlana Peshterianu"
                alt_en = f"Portrait of {person}, identified on source page 40."
                alt_uk = f"Портрет {person}, зазначеної на сторінці 40 першоджерела."
                assets[asset_id]["assetType"] = "portrait"
            elif page_number == 41 and item["width"] == 555:
                alt_en = "QR code printed on source page 41, beside the social media contact section."
                alt_uk = "QR-код зі сторінки 41 першоджерела поруч із розділом соціальних мереж."
                assets[asset_id]["assetType"] = "qr-code"
            else:
                if event:
                    city_en = event["city"]["en"]
                    city_uk = event["city"]["uk"]
                    country_en = event["country"]["en"]
                    country_uk = event["country"]["uk"]
                    alt_en = f"Archival image accompanying the Angels of Ukraine record for {city_en}, {country_en}, source page {page_number}."
                    alt_uk = f"Архівне зображення до запису «Янголи України» про місто {city_uk}, {country_uk}, сторінка {page_number} першоджерела."
                else:
                    alt_en = f"Archival image from page {page_number} of the Angels of Ukraine source PDF."
                    alt_uk = f"Архівне зображення зі сторінки {page_number} PDF «Янголи України»."
            placement = {
                "id": f"p{page_number:02d}-xref-{item['xref']}-occurrence-{occurrence}",
                "pdfPage": page_number,
                "occurrence": occurrence,
                "assetId": asset_id,
                "alt": {"en": alt_en, "uk": alt_uk},
                "eventId": event["id"] if event else None,
                "eventSlug": event["slug"] if event else None,
                "sourceXref": item["xref"],
            }
            placements.append(placement)
            if event and asset_id not in event_media[page_number]:
                event_media[page_number].append(asset_id)

    for event in events:
        page = event["sourcePageIds"][0]
        source_page = inventory_pages[page]
        event["sourceTranscription"] = source_page["raw_text"].strip()
        event["historicalDescription"] = {
            "en": "" if page in (27, 28) else " ".join(UKRAINIAN_TRANSLATIONS[page] for _ in ()),
            "uk": UKRAINIAN_TRANSLATIONS[page],
        }
        event["media"] = event_media[page]
        if page == 13:
            event["sourceDiscrepancy"] = {
                "en": "The source slide dates the gathering 12.07.2024 and also refers to an incident on 8 July 2025. Both statements are preserved as printed; this archive does not reconcile them.",
                "uk": "На слайді датою акції вказано 12.07.2024, а також згадано подію 8 липня 2025 року. Обидва твердження збережено без змін; цей архів не узгоджує розбіжність.",
            }

    # The English source narrative is retained in the public transcription. For
    # English UX use the transcription's narrative text below; translations are
    # intentionally a separate human-readable field.
    english_narratives = {
        5: "The Angels were first invited to the city by Olga Arakelyan in 2022, organizing the Independence Day of Ukraine. There were 363 children killed in the war. The war continues.",
        6: "A charity event was held for the 3rd anniversary of the full-scale invasion of the Russian Federation. The event was organized by UA HUB and Plast Warsaw. The angels were taken care of by Olga Kasian.",
        7: "The event was held a day before the St. Nickolas day, in memory of the “Angels of Ukraine”. Big thanks to the chairman of the Rusíni-Ukrajinci SR association, Mr. Pavlа Bohdana, and Vitalia Tuzhelyak for your assistance and help.",
        8: "Olga Kasian · 1000 Days of Unbreaking.",
        9: "Little angels, barefoot and bewildered, walk in the sky. They rise, as if climbing steps, through the clouds toward God. The event took place during the annual event in Košice “DAYS OF UKRAINE 2024” — Veteran’s Mile. Sofia Yehorova recited the poem “Little Angel” by Hleb Babich. Plast-Stanytsia Kosice actively participated.",
        10: "Organized by the Ukrainian-Canadian School Council of Toronto and the Congress of Ukrainians of Canada, a touching “Angels of Ukraine” event was held in Central Park in Toronto. The official commemoration took place at the opening of Independence Day, bringing together students, parents and caring citizens of Toronto to honor the memory of the innocent victims of war. The Angels' visit to Canada was made possible thanks to Tatyana Sunak.",
        11: "The Ukrainian People's Fund Desjardins in Montreal (Caise populaire Desjardins ukrainienne de Montréal) joined the memory marathon and exhibited the Engels for 2 weeks. It was a great opportunity to remind locals about the long war and its horrors in Ukraine. Events in Montreal and Quebec were held thanks to Nataliya Khrushch.",
        12: "The event took place before the charity concert of the Barvinok dance ensemble.",
        13: "In the center of Montreal, Quebec province, on Phillips Square, the Ukrainian community came out for a protest/condemnation against Russia's attack on the “Okhmadit” children's hospital in Kyiv on July 8, 2025.",
        14: "Pupils of the Ivan Franko Ukrainian Studies Courses of the Ukrainian school honored the young Ukrainian children who died because of Russian aggression. This campaign was organized by Liliya Sukhy.",
        15: "Winnipeg became the first Canadian city where the “Angels of Ukraine” event took place. It received support from the Congress of Ukrainians in Canada and the Provincial Council of Manitoba. Angels were invited to Canada by Tatiana Sunak, the Head of the National Ukrainian Educational Council of the KUK. Organizers: Nataliya Sovinska and Susan Zuk.",
        16: "As part of the events dedicated to the second anniversary of the beginning of large-scale Russian aggression, conducted by Mier Ukraine together with other organizations. Our Angels were directly “looked after” by SME SPOLU.",
        17: "The Ukrainian-Slovakian Hub involved this gorgeous, tourist city in the memory marathon.",
        18: "The initiator — Olena Chaplytska — made the 20-meter flag.",
        19: "The event was held at the same time as the summit on the Ukrainian “peace formula” in Malta, with the participation of 66 countries. The initiator is Olena Chaplytska.",
        20: "The action occured during the 9th annual event “DAYS OF UKRAINE 2023” — “Veteran`s MilLE” in Košice. Event organizer Eduard Buras. Plast-Stanytsia Kosice actively participated.",
        21: "Angels visited the demonstration held by the Nordic Ukraine Forum. Appreciations to Oksana Dudarko and Inna Volchkova. Glib Babich's poem “Little Angel” precisely reflects the current situating in Ukraine.",
        22: "The event was organized by Oksana Dudarko. Supported by A. Plahotnyuk, the Plenipotentiary Ambassador of Ukraine in Sweden, the Ukrainian Greek Catholic Church in Stockholm, and O. Andriy. The adornment of the event was Favorit Studio, Olena Bryl.",
        23: "Thanks for the organization of the event to Nataliia Buhrii-Shramk. We also thank Dewbury and West Berkshire Ukraine Support Group for all the support.",
        24: "The support of Ukrainische Botschaft in Berlin / Embassy of Ukraine in Berlin — Alisa Podolyak and Iryna Samchenko — Heinrich Böll Foundation.",
        25: "The event at Katholische Propstei St. Trinitatis was organized and held by Anna Logachova and Olga Kashchuk.",
        26: "Photos provided by Borys Bukhman (Odessa UA). St. Nicholas' Church. All three Actions in Germany took place thanks to the active position of Daria Kostyukova.",
        27: "",
        28: "",
        29: "This is the result of Svitlana Dzedzey's cooperation with the Ludlow Supports Refugees organization.",
        30: "The events were supported by Ukrainians in Cyprus, Plast Cyprus, and the Pastoral Ministry of the Ukrainian Greek-Catholic Church in the Republic of Cyprus. Initiator — Lyolya Filimonova.",
        31: "The events were supported by Ukrainians in Cyprus and Obiimy Cyprusi. Initiator — Lyolya Filimonova.",
        32: "We honored the memory of those who died, and we joined the “Veteran`s MilLE” during the Days of Ukraine 2022 in Kosice.",
        33: "During the Charity Concert supported by OZ Zdielaj. Organizer: Lucia Salzerova.",
        34: "The action started as part of the Festival of Ukrainian Culture in Banska Bystrica. Festival organizer Olia Arakelian. Action coordinator Evnika Pochapska.",
        35: "The “Angels of Ukraine” memorial event was held together with an exhibition of children`s drawings. Thanks for the support of the head of the Rusíni-Ukrainci SR union Mr.Pavol Bohdan and Mr.Ivan Tuželjak, with the participation of Vitalya Tuželjak.",
        36: "The action was held on the initiative of the Ukrainian Union in the city of Zhilina, carried out a promotion by Inna Onyshchenko.",
        37: "The first event took place in Kosice on Children`s Day and lasted a week. Ukrainian women who found refuge with their children in Slovakia knitted 243 angels from yellow and blue threads and hung them in the city center. Since then, the Angels began to travel through the cities of different countries.",
    }
    for event in events:
        page = event["sourcePageIds"][0]
        event["historicalDescription"]["en"] = english_narratives[page]
        if event["historicalDescription"]["uk"] == "":
            event["historicalDescription"]["uk"] = "На слайді немає додаткового описового абзацу."
        event["description"] = {
            "en": (english_narratives[page] or f"Historical archive entry for {event['city']['en']}.")[:280],
            "uk": (UKRAINIAN_TRANSLATIONS[page] or "Запис з історичного архіву.")[:280],
        }
        event["translationStatus"] = {"en": "source-transcription", "uk": "owner-authorized-editorial-translation"}
        event["publicationStatus"] = "owner-authorized-public-release"
        if page == 13:
            event["sourceDiscrepancy"] = {
                "en": "The source prints the event date as 12 July 2024, while its description refers to the 8 July 2025 attack on the Okhmadit children’s hospital. Both source statements are preserved without choosing which date is correct.",
                "uk": "У джерелі надруковано дату події 12 липня 2024 року, тоді як опис згадує напад на дитячу лікарню «Охматдит» 8 липня 2025 року. Обидва твердження джерела збережено без припущень, яка дата правильна.",
            }
        event["editorialFlags"] = [flag for flag in event["editorialFlags"] if flag not in {"image_rights_pending", "coordinates_unverified"}]
        event["editorialFlags"].append("historical-source-discrepancies-preserved")

    ASSET_DIR.mkdir(parents=True, exist_ok=True)
    PDF_TARGET.parent.mkdir(parents=True, exist_ok=True)
    shutil.copy2(PDF_SOURCE, PDF_TARGET)
    catalog = {
        "sourcePdf": "/archive/angels-of-ukraine-source-2025-10-15.pdf",
        "sourcePdfSha256": PDF_SHA256,
        "assetCount": len(assets),
        "placementCount": len(placements),
        "assets": list(assets.values()),
        "placements": placements,
    }
    write_json(CATALOG_PATH, catalog)
    write_json(EVENTS_PATH, events)

    approved = ["# One exact public-output path per reviewed source-derived image."]
    approved.extend(f"images/archive/{asset_id}.webp" for asset_id in sorted(assets))
    approved.extend([
        "_next/static/media/layers*.png",
        "_next/static/media/marker-icon*.png",
    ])
    APPROVED_MEDIA.write_text("\n".join(approved) + "\n", encoding="utf-8")

    lines = [
        "# Public media coverage report",
        "",
        f"- Original PDF: `archive/angels-of-ukraine-source-2025-10-15.pdf` ({PDF_TARGET.stat().st_size:,} bytes; SHA-256 `{PDF_SHA256}`).",
        f"- Source image placements represented: **{len(placements)}/126**.",
        f"- Unique source image assets published once: **{len(assets)}/83**.",
        "- The image files are the private review WebP derivatives; no contact sheets, page previews, inventories or temporary extraction files are copied to the site.",
        "- Image placement alt text is source-page based and bilingual. People and partner names follow the source text; no new captions or photographer credits are invented.",
        "",
        "| PDF page | Event / section | Placements | Published asset references |",
        "|---:|---|---:|---|",
    ]
    for page_number in range(1, 42):
        items = [placement for placement in placements if placement["pdfPage"] == page_number]
        event = events_by_page.get(page_number)
        label = f"{event['city']['en']} · {event['dateOriginal']}" if event else {
            1: "Memorial title and purpose", 2: "War context", 3: "Public awareness", 4: "Installation and symbolism",
            38: "Organizer invitation", 39: "Organizer requirements", 40: "Initiative founders", 41: "Contact and social media",
        }.get(page_number, "Source page")
        refs = ", ".join(f"`{p['assetId'][:12]}`" for p in items) or "—"
        lines.append(f"| {page_number} | {label} | {len(items)} | {refs} |")
    lines += ["", "The full occurrence-level mapping is available in `src/content/media.json`. Repeated placements reference one deduplicated WebP asset. The source PDF remains byte-for-byte unchanged.", ""]
    REPORT_PATH.write_text("\n".join(lines), encoding="utf-8")
    print(f"Prepared {len(assets)} unique assets covering {len(placements)} placements and copied the unchanged source PDF.")


if __name__ == "__main__":
    main()
