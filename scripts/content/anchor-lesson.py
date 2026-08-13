from __future__ import annotations

import argparse
import json
import math
import sys
from pathlib import Path


def cosine(a: list[float], b: list[float]) -> float:
    numerador = sum(x * y for x, y in zip(a, b))
    norma = math.sqrt(sum(x * x for x in a)) * math.sqrt(sum(y * y for y in b))
    return 0.0 if norma == 0 else numerador / norma


def best_anchor(claim_vector, excerpt_vectors):
    melhor_id, melhor_sim = None, 0.0
    for excerpt_id, vetor in excerpt_vectors.items():
        similaridade = cosine(claim_vector, vetor)
        if similaridade > melhor_sim:
            melhor_id, melhor_sim = excerpt_id, similaridade
    return melhor_id, melhor_sim


def anchor_report(claims, excerpt_vectors, allowed):
    permitidos = {k: v for k, v in excerpt_vectors.items() if k in allowed}
    linhas, sem_ancora = [], 0
    for claim in claims:
        excerpt_id, similaridade = best_anchor(claim["vector"], permitidos)
        if excerpt_id is None:
            sem_ancora += 1
        linhas.append(
            {
                "claim": claim["claim"],
                "excerptId": excerpt_id,
                "hash": allowed.get(excerpt_id) if excerpt_id else None,
                "similarity": similaridade,
            }
        )
    return {"claims": linhas, "unanchored": sem_ancora}


def load_allowed(manifest_lines: list[dict]) -> dict[str, str]:
    return {linha["id"]: linha["hash"] for linha in manifest_lines}


def resolve_anchors(claims: list[dict], allowed: dict[str, str]) -> dict:
    linhas, sem_ancora = [], 0
    for claim in claims:
        excerpt_id = claim["excerptId"]
        hash_vigente = allowed.get(excerpt_id)
        if hash_vigente is None:
            sem_ancora += 1
        linhas.append(
            {"claim": claim["claim"], "excerptId": excerpt_id, "hash": hash_vigente}
        )
    return {"claims": linhas, "unanchored": sem_ancora}


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--claims", required=True)
    parser.add_argument("--manifest", required=True)
    parser.add_argument("--out", required=True)
    args = parser.parse_args()

    aula = json.loads(Path(args.claims).read_text(encoding="utf-8"))
    linhas = [
        json.loads(l)
        for l in Path(args.manifest).read_text(encoding="utf-8").splitlines()
        if l.strip()
    ]
    relatorio = resolve_anchors(aula["claims"], load_allowed(linhas))

    saida = {"lessonId": aula["lessonId"], **relatorio}
    destino = Path(args.out)
    destino.parent.mkdir(parents=True, exist_ok=True)
    destino.write_text(json.dumps(saida, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")

    print(
        json.dumps(
            {
                "lessonId": aula["lessonId"],
                "claims": len(relatorio["claims"]),
                "unanchored": relatorio["unanchored"],
            },
            ensure_ascii=False,
        )
    )
    return 0 if relatorio["unanchored"] == 0 else 1


if __name__ == "__main__":
    sys.exit(main())
