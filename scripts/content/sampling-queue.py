from __future__ import annotations

import hashlib

BUCKETS = 1000


def effective_rate(ceiling_written: bool) -> float:
    """Taxa de amostragem humana enquanto o teto de erro nao existe.

    Devolve `1.0` — tudo passa por revisao humana — ate que o teto de erro
    aceitavel esteja **escrito**. E a regra da spec virada em codigo: a
    amostragem nao cai por esquecimento.

    **Cuidado, o parametro morde ao contrario do que parece.** Passar
    `ceiling_written=True` devolve `0.0`, e `selected_for_review(ids, 0.0)`
    devolve lista vazia — **zero** revisao humana. Isso e correto so no mundo em
    que o teto ja existe e manda no lugar desta funcao. Virar a flag para `True`
    antes disso nao "liga o teto": desliga a amostragem inteira, que e
    exatamente a falha que esta funcao existe para impedir, com o sinal
    trocado. A tarefa que introduzir o teto substitui esta assinatura, e
    `test_com_teto_escrito_a_taxa_e_zero` e o teste que vai falhar avisando.
    """
    return 1.0 if not ceiling_written else 0.0


def _bucket(lesson_id: str) -> int:
    digest = hashlib.sha256(lesson_id.encode("utf-8")).hexdigest()
    return int(digest[:8], 16) % BUCKETS


def selected_for_review(lesson_ids: list[str], rate: float) -> list[str]:
    corte = round(rate * BUCKETS)
    return [lid for lid in lesson_ids if _bucket(lid) < corte]
