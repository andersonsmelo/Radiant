from __future__ import annotations

import hashlib
import json
from pathlib import Path

MANIFEST_FIELDS = ("id", "sourceSlug", "pageStart", "pageEnd")


def excerpt_hash(text: str) -> str:
    return hashlib.sha256(text.encode("utf-8")).hexdigest()


def manifest_line(excerpt: dict, rights_class: str) -> dict:
    line = {field: excerpt[field] for field in MANIFEST_FIELDS}
    line["hash"] = excerpt_hash(excerpt["text"])
    line["rightsClass"] = rights_class
    return line


def write_manifest(lines: list[dict], path: Path) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    ordenadas = sorted(lines, key=lambda line: line["id"])
    corpo = "\n".join(json.dumps(line, ensure_ascii=False) for line in ordenadas)
    path.write_text(corpo + "\n", encoding="utf-8")
