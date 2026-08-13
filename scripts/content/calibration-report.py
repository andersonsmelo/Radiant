from __future__ import annotations

import statistics


def distribution(similarities: list[float], buckets: int = 10) -> dict[str, int]:
    """Conta similaridades por faixa de largura `1 / buckets`.

    As faixas nomeadas cobrem `[0.0, 1.0]`, mas a entrada e **similaridade de
    cosseno**, cujo dominio e `[-1, 1]`. Valor negativo e legitimo e aparece na
    leva de calibracao, que alimenta a populacao crua — orfas incluidas. Por
    isso o indice e grampeado nos **dois** extremos: sem o `max(0, ...)`,
    `distribution([-0.5])` estourava `KeyError: '-0.5--0.4'` e derrubava a leva
    no meio. Valor fora de `[0, 1]` cai na faixa da ponta mais proxima; o
    relatorio conta, nao rejeita.
    """
    faixas = {
        f"{i / buckets:.1f}-{(i + 1) / buckets:.1f}": 0 for i in range(buckets)
    }
    for valor in similarities:
        indice = max(0, min(int(valor * buckets), buckets - 1))
        faixas[f"{indice / buckets:.1f}-{(indice + 1) / buckets:.1f}"] += 1
    return faixas


def separation(anchored: list[float], orphan: list[float]) -> float:
    """Mediana das ancoradas **menos** a mediana das orfas.

    O sinal e carga util, nao detalhe: este numero decide se o metodo funciona.
    Positivo e grande significa que a ancoragem distingue afirmacao sustentada
    de afirmacao orfa, e existe limiar que sirva. **Perto de zero — ou
    negativo — manda parar o plano**, porque nenhum limiar separa populacoes que
    se confundem; e achado sobre o metodo, nao tarefa a concluir. Inverter a
    ordem dos argumentos inverte o sinal e transforma um "pare" num "siga".

    Devolve `0.0` quando um dos lados esta vazio: sem as duas populacoes nao ha
    comparacao a fazer, e `0.0` cai no lado seguro (o que manda parar).
    """
    if not anchored or not orphan:
        return 0.0
    return statistics.median(anchored) - statistics.median(orphan)
