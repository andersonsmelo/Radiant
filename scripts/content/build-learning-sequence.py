from __future__ import annotations

import json
from collections import defaultdict, deque
from datetime import datetime, timezone
from pathlib import Path

REPO_ROOT = Path(__file__).resolve().parents[2]
CONTENT_ROOT = REPO_ROOT / "conteúdo"
GRAPH_PATH = CONTENT_ROOT / "governança" / "concept-graph.json"
SEQUENCE_PATH = CONTENT_ROOT / "governança" / "learning-sequence.json"

_ACTIVE_STATUSES = {"auto-accepted", "human-validated"}


def topological_sort(nodes: list[dict], edges: list[dict]) -> tuple[list[str], list[str]]:
    """Kahn's algorithm on active edges only. Returns (ordered_ids, cycle_ids)."""
    node_ids = {n["id"] for n in nodes}
    in_degree: dict[str, int] = defaultdict(int)
    adj: dict[str, list[str]] = defaultdict(list)

    for edge in edges:
        if edge["status"] in _ACTIVE_STATUSES:
            frm, to = edge["from"], edge["to"]
            if frm in node_ids and to in node_ids:
                adj[frm].append(to)
                in_degree[to] += 1

    queue = deque(sorted(n for n in node_ids if in_degree[n] == 0))
    ordered: list[str] = []

    while queue:
        node = queue.popleft()
        ordered.append(node)
        for neighbor in sorted(adj[node]):
            in_degree[neighbor] -= 1
            if in_degree[neighbor] == 0:
                queue.append(neighbor)

    cycles = sorted(n for n in node_ids if n not in ordered)
    return ordered, cycles


def detect_gaps(nodes: list[dict], edges: list[dict]) -> list[str]:
    """Concept IDs referenced as prerequisites but absent from nodes."""
    node_ids = {n["id"] for n in nodes}
    return sorted({e["from"] for e in edges if e["from"] not in node_ids})


def group_by_planet(nodes: list[dict], ordered: list[str]) -> list[dict]:
    node_map = {n["id"]: n for n in nodes}
    planet_sequences: dict[str, list[str]] = defaultdict(list)
    planet_meta: dict[str, dict] = {}

    for concept_id in ordered:
        if concept_id not in node_map:
            continue
        node = node_map[concept_id]
        key = f"{node['galaxyId']}:{node['planetId']}"
        planet_sequences[key].append(concept_id)
        if key not in planet_meta:
            planet_meta[key] = {"galaxyId": node["galaxyId"], "planetId": node["planetId"]}

    return [
        {**planet_meta[key], "sequence": seqs}
        for key, seqs in planet_sequences.items()
    ]


def run() -> None:
    graph = json.loads(GRAPH_PATH.read_text(encoding="utf-8"))
    ordered, cycles = topological_sort(graph["nodes"], graph["edges"])
    gaps = detect_gaps(graph["nodes"], graph["edges"])
    sequences = group_by_planet(graph["nodes"], ordered)

    output = {
        "version": 1,
        "generatedAt": datetime.now(timezone.utc).isoformat(),
        "sequences": sequences,
        "gaps": gaps,
        "cycles": cycles,
    }

    SEQUENCE_PATH.write_text(json.dumps(output, indent=2, ensure_ascii=False), encoding="utf-8")

    total = sum(len(s["sequence"]) for s in sequences)
    print(f"Done: {total} concepts across {len(sequences)} planets")
    if gaps:
        print(f"Gaps (prerequisites missing from graph): {gaps}")
    if cycles:
        print(f"WARNING — cycles detected (resolve before promoting): {cycles}")


if __name__ == "__main__":
    run()
