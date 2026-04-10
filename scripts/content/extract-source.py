from __future__ import annotations

import argparse
import json
import re
import unicodedata
from pathlib import Path

from pypdf import PdfReader


def normalize_source_slug(filename: str) -> str:
    stem = Path(filename).stem
    stem = unicodedata.normalize("NFD", stem)
    stem = "".join(ch for ch in stem if unicodedata.category(ch) != "Mn")
    stem = re.sub(r"^\d+[.\-_ ]*", "", stem)
    stem = re.sub(r"autor[-_ ]*", "", stem, flags=re.IGNORECASE)
    stem = re.sub(r"[^a-zA-Z0-9]+", "-", stem).strip("-").lower()
    return stem


def chunk_text(text: str, max_chars: int = 1400) -> list[str]:
    words = text.split()
    if not words:
        return []

    chunks: list[str] = []
    current: list[str] = []

    for word in words:
        candidate = " ".join(current + [word]).strip()
        if current and len(candidate) > max_chars:
            chunks.append(" ".join(current))
            current = [word]
        else:
            current.append(word)

    if current:
        chunks.append(" ".join(current))

    return chunks


def extract_pages(source_path: Path) -> list[dict]:
    reader = PdfReader(str(source_path))
    pages: list[dict] = []

    for index, page in enumerate(reader.pages, start=1):
        raw_text = page.extract_text() or ""
        text = " ".join(raw_text.split())
        if not text:
            continue
        pages.append(
            {
                "pageNumber": index,
                "text": text,
                "charCount": len(text),
            }
        )

    return pages


def build_excerpts(source_slug: str, pages: list[dict], max_chars: int = 1400) -> list[dict]:
    excerpts: list[dict] = []

    for page in pages:
        chunks = chunk_text(page["text"], max_chars=max_chars)
        for chunk_index, chunk in enumerate(chunks, start=1):
            excerpts.append(
                {
                    "id": f"excerpt:{source_slug}:p{page['pageNumber']}:c{chunk_index}",
                    "sourceSlug": source_slug,
                    "pageStart": page["pageNumber"],
                    "pageEnd": page["pageNumber"],
                    "text": chunk,
                    "charCount": len(chunk),
                }
            )

    return excerpts


def write_json(path: Path, payload: dict) -> None:
    path.write_text(json.dumps(payload, ensure_ascii=False, indent=2), encoding="utf-8")


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--source", required=True)
    parser.add_argument("--output-dir", required=True)
    args = parser.parse_args()

    source_path = Path(args.source)
    output_dir = Path(args.output_dir)
    output_dir.mkdir(parents=True, exist_ok=True)

    source_slug = normalize_source_slug(source_path.name)
    pages = extract_pages(source_path)
    excerpts = build_excerpts(source_slug, pages)

    write_json(output_dir / "pages.json", {"sourceSlug": source_slug, "pages": pages})
    write_json(output_dir / "excerpts.json", {"sourceSlug": source_slug, "excerpts": excerpts})

    print(
        json.dumps(
            {
                "sourceSlug": source_slug,
                "pageCount": len(pages),
                "excerptCount": len(excerpts),
            },
            ensure_ascii=False,
        )
    )


if __name__ == "__main__":
    main()
