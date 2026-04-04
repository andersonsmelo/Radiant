from __future__ import annotations

import importlib.util
import json
import math
from pathlib import Path

from openai import OpenAI

REPO_ROOT = Path(__file__).resolve().parents[2]
CONTENT_ROOT = REPO_ROOT / "conteúdo"
EMBEDDINGS_DIR = CONTENT_ROOT / "governança" / "embeddings"
DEDUP_THRESHOLD = 0.88

_reader_spec = importlib.util.spec_from_file_location(
    "concepts_reader", Path(__file__).with_name("concepts-reader.py")
)
_reader_module = importlib.util.module_from_spec(_reader_spec)
_reader_spec.loader.exec_module(_reader_module)
load_all_concepts = _reader_module.load_all_concepts


def safe_filename(concept_id: str) -> str:
    return concept_id.replace(":", "_")


def is_embedded(concept_id: str, embeddings_dir: Path = EMBEDDINGS_DIR) -> bool:
    return (embeddings_dir / f"{safe_filename(concept_id)}.json").exists()


def save_embedding(
    concept_id: str, embedding: list[float], embeddings_dir: Path = EMBEDDINGS_DIR
) -> None:
    embeddings_dir.mkdir(parents=True, exist_ok=True)
    path = embeddings_dir / f"{safe_filename(concept_id)}.json"
    path.write_text(
        json.dumps({"conceptId": concept_id, "embedding": embedding}, ensure_ascii=False),
        encoding="utf-8",
    )


def cosine_similarity(v1: list[float], v2: list[float]) -> float:
    dot = sum(a * b for a, b in zip(v1, v2))
    mag1 = math.sqrt(sum(a * a for a in v1))
    mag2 = math.sqrt(sum(b * b for b in v2))
    if mag1 == 0 or mag2 == 0:
        return 0.0
    return dot / (mag1 * mag2)


def find_duplicate(
    embedding: list[float],
    exclude_id: str,
    embeddings_dir: Path = EMBEDDINGS_DIR,
    threshold: float = DEDUP_THRESHOLD,
) -> str | None:
    """Return concept_id of existing embedding with similarity >= threshold, or None."""
    for path in embeddings_dir.glob("*.json"):
        data = json.loads(path.read_text(encoding="utf-8"))
        if data["conceptId"] == exclude_id:
            continue
        if cosine_similarity(embedding, data["embedding"]) >= threshold:
            return data["conceptId"]
    return None


def embed_concept(concept: dict, client: OpenAI) -> list[float]:
    text = f"{concept['title']}: {concept['definition']}"
    response = client.embeddings.create(model="text-embedding-3-small", input=text)
    return response.data[0].embedding


def run() -> None:
    client = OpenAI()
    concepts = load_all_concepts()
    skipped = 0
    duplicates: list[tuple[str, str]] = []

    for concept in concepts:
        if is_embedded(concept["id"]):
            skipped += 1
            continue
        embedding = embed_concept(concept, client)
        duplicate = find_duplicate(embedding, concept["id"])
        if duplicate:
            duplicates.append((concept["id"], duplicate))
            print(f"  DUPLICATE {concept['id']} ≈ {duplicate}")
        else:
            save_embedding(concept["id"], embedding)
            print(f"  embedded {concept['id']}")

    processed = len(concepts) - skipped - len(duplicates)
    print(f"Done: {processed} embedded, {skipped} skipped, {len(duplicates)} duplicates detected")
    if duplicates:
        print("Duplicates (merge manually):")
        for new_id, existing_id in duplicates:
            print(f"  {new_id} → {existing_id}")


if __name__ == "__main__":
    run()
