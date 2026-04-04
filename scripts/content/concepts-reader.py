from __future__ import annotations

import json
from pathlib import Path

REPO_ROOT = Path(__file__).resolve().parents[2]
CONTENT_ROOT = REPO_ROOT / "conteúdo"


def load_all_concepts() -> list[dict]:
    """Load all canonical concepts from every normalization job in conceitos/index.json."""
    index_path = CONTENT_ROOT / "conceitos" / "index.json"
    index = json.loads(index_path.read_text(encoding="utf-8"))

    concepts: list[dict] = []
    for job in index["jobs"]:
        artifacts_path = CONTENT_ROOT / job["artifacts"]["concepts"]
        data = json.loads(artifacts_path.read_text(encoding="utf-8"))
        concepts.extend(data["concepts"])

    return concepts


if __name__ == "__main__":
    all_concepts = load_all_concepts()
    print(f"Loaded {len(all_concepts)} concepts")
    for c in all_concepts:
        print(f"  {c['id']}")
