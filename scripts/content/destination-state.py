from __future__ import annotations


def destination_state(taxonomy_id, mapped_taxonomy_ids: set[str]) -> str:
    if taxonomy_id is None:
        return "pending"
    return "mapped" if taxonomy_id in mapped_taxonomy_ids else "unknown"


def partition(classified: list[dict], mapped_taxonomy_ids: set[str]) -> dict:
    """Reparte itens classificados em duas listas, pelo estado de destino.

    O contrato de duas chaves vem do plano e nao muda aqui.
    """
    com_destino, pendentes = [], []
    for item in classified:
        estado = destination_state(item.get("taxonomyId"), mapped_taxonomy_ids)
        # ATENCAO — esta linha recolhe dois estados que `destination_state`
        # acabou de separar: "pending" (taxonomia ainda nao decidida, uma
        # decisao de escopo) e "unknown" (taxonomia preenchida mas ausente do
        # mapa, um erro de integridade de dado) caem os dois em
        # `pendingTaxonomy`. Quem le a lista nao consegue distinguir os dois, e
        # foi exatamente a confusao de condicoes distintas numa lista so que
        # custou duas correcoes de rumo na D4 — a premissa desta tarefa.
        # A divisao em tres vias esta registrada no plano como trabalho do
        # proximo plano, nao como conserto silencioso aqui.
        (com_destino if estado == "mapped" else pendentes).append(item)
    return {"withDestination": com_destino, "pendingTaxonomy": pendentes}
