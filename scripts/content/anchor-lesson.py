from __future__ import annotations

import math


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
