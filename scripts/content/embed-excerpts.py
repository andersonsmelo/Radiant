from __future__ import annotations

import json
from pathlib import Path


def safe_filename(excerpt_id: str) -> str:
    return excerpt_id.replace(":", "_")


def embedding_path(excerpt_id: str, root: Path) -> Path:
    return root / f"{safe_filename(excerpt_id)}.json"


def save_excerpt_embedding(
    excerpt_id: str, text_hash: str, embedding: list[float], root: Path
) -> None:
    root.mkdir(parents=True, exist_ok=True)
    payload = {"excerptId": excerpt_id, "hash": text_hash, "embedding": embedding}
    embedding_path(excerpt_id, root).write_text(
        json.dumps(payload, ensure_ascii=False), encoding="utf-8"
    )


def needs_embedding(excerpt_id: str, text_hash: str, root: Path) -> bool:
    caminho = embedding_path(excerpt_id, root)
    if not caminho.exists():
        return True
    gravado = json.loads(caminho.read_text(encoding="utf-8"))
    return gravado.get("hash") != text_hash
