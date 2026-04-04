from __future__ import annotations

import importlib.util
import json
from pathlib import Path

import anthropic

REPO_ROOT = Path(__file__).resolve().parents[2]
CONTENT_ROOT = REPO_ROOT / "conteúdo"
GRAPH_PATH = CONTENT_ROOT / "governança" / "concept-graph.json"
CONFIDENCE_THRESHOLD = 0.85
BATCH_SIZE = 16

_reader_spec = importlib.util.spec_from_file_location(
    "concepts_reader", Path(__file__).with_name("concepts-reader.py")
)
_reader_module = importlib.util.module_from_spec(_reader_spec)
_reader_spec.loader.exec_module(_reader_module)
load_all_concepts = _reader_module.load_all_concepts

_SYSTEM_PROMPT = (
    "Você é um especialista em radiologia e pedagogia. "
    "Sua tarefa é identificar relações de pré-requisito entre conceitos de radiologia. "
    "Para cada relação, determine: qual conceito deve ser estudado primeiro (from) e qual depende dele (to), "
    "a confiança da relação (0.0 a 1.0) e uma justificativa em uma linha. "
    "Responda APENAS com JSON válido — um array de objetos, sem texto adicional fora do JSON."
)


def build_graph_nodes(graph: dict, concepts: list[dict]) -> dict:
    existing_ids = {n["id"] for n in graph["nodes"]}
    for concept in concepts:
        if concept["id"] not in existing_ids:
            graph["nodes"].append(
                {
                    "id": concept["id"],
                    "title": concept["title"],
                    "galaxyId": concept["galaxyId"],
                    "planetId": concept["planetId"],
                    "starId": concept["starId"],
                }
            )
    return graph


def apply_threshold(edge: dict) -> dict:
    status = "auto-accepted" if edge["confidence"] >= CONFIDENCE_THRESHOLD else "pending-review"
    return {**edge, "status": status}


def merge_edges(graph: dict, new_edges: list[dict]) -> dict:
    existing_pairs = {(e["from"], e["to"]) for e in graph["edges"]}
    for edge in new_edges:
        pair = (edge["from"], edge["to"])
        if pair not in existing_pairs:
            graph["edges"].append(apply_threshold(edge))
            existing_pairs.add(pair)
    return graph


def suggest_edges_for_batch(concepts: list[dict], client: anthropic.Anthropic) -> list[dict]:
    lines = "\n".join(
        f'- id: "{c["id"]}", título: "{c["title"]}", definição: "{c["definition"]}"'
        for c in concepts
    )
    prompt = (
        f"Analise os conceitos de radiologia abaixo e identifique todas as relações de pré-requisito entre eles.\n\n"
        f"{lines}\n\n"
        f'Retorne um array JSON. Cada objeto: "from" (id pré-requisito), "to" (id do conceito dependente), '
        f'"confidence" (0.0–1.0), "reason" (justificativa em uma linha). '
        f"Se não houver relações, retorne []."
    )
    message = client.messages.create(
        model="claude-haiku-4-5-20251001",
        max_tokens=2048,
        system=_SYSTEM_PROMPT,
        messages=[{"role": "user", "content": prompt}],
    )
    return json.loads(message.content[0].text)


def run() -> None:
    client = anthropic.Anthropic()
    concepts = load_all_concepts()
    graph = json.loads(GRAPH_PATH.read_text(encoding="utf-8"))
    graph = build_graph_nodes(graph, concepts)

    all_new_edges: list[dict] = []
    for i in range(0, len(concepts), BATCH_SIZE):
        batch = concepts[i : i + BATCH_SIZE]
        print(f"Batch {i // BATCH_SIZE + 1}: {len(batch)} concepts...")
        edges = suggest_edges_for_batch(batch, client)
        all_new_edges.extend(edges)

    graph = merge_edges(graph, all_new_edges)
    GRAPH_PATH.write_text(json.dumps(graph, indent=2, ensure_ascii=False), encoding="utf-8")

    auto = sum(1 for e in all_new_edges if e["confidence"] >= CONFIDENCE_THRESHOLD)
    pending = len(all_new_edges) - auto
    print(f"Done: {len(all_new_edges)} edges ({auto} auto-accepted, {pending} pending-review)")
    print(f"Graph: {len(graph['nodes'])} nodes, {len(graph['edges'])} edges total")


if __name__ == "__main__":
    run()
