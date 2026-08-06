from __future__ import annotations


def destination_state(taxonomy_id, mapped_taxonomy_ids: set[str]) -> str:
    if taxonomy_id is None:
        return "pending"
    return "mapped" if taxonomy_id in mapped_taxonomy_ids else "unknown"


def partition(classified: list[dict], mapped_taxonomy_ids: set[str]) -> dict:
    com_destino, pendentes = [], []
    for item in classified:
        estado = destination_state(item.get("taxonomyId"), mapped_taxonomy_ids)
        (com_destino if estado == "mapped" else pendentes).append(item)
    return {"withDestination": com_destino, "pendingTaxonomy": pendentes}
