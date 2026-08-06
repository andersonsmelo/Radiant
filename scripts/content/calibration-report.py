from __future__ import annotations

import statistics


def distribution(similarities: list[float], buckets: int = 10) -> dict[str, int]:
    faixas = {
        f"{i / buckets:.1f}-{(i + 1) / buckets:.1f}": 0 for i in range(buckets)
    }
    for valor in similarities:
        indice = min(int(valor * buckets), buckets - 1)
        faixas[f"{indice / buckets:.1f}-{(indice + 1) / buckets:.1f}"] += 1
    return faixas


def separation(anchored: list[float], orphan: list[float]) -> float:
    if not anchored or not orphan:
        return 0.0
    return statistics.median(anchored) - statistics.median(orphan)
