# ADR — Nova versão de conteúdo preserva a data de revisão do item (A1)

**Data:** 2026-10-18 (America/Bahia).
**Estado:** aceita.
**Decisor:** Anderson Melo, nesta conversa, ao escolher "Preserva a data".
**Autoria do registro:** Claude Opus 5.5 (Anthropic, `claude-opus-5-5`).

## Contexto

[código] O G4 guarda a agenda de revisão por item, com uma chave que inclui a
`contentVersion` (`types/itemReview.ts:29-30`). A versão vale para o lote
inteiro (`EditorialBatchContract.ts:62`). Quando um lote ganha versão nova, a
lição sai da revisão e não volta: uma sonda mostrou fila e agenda vazias 60 dias
depois ([revisão, A1](../trilha/avaliacoes/2026-10-17-revisao-do-trabalho-do-codex.md)).
O teste `ItemReviewService.test.ts:71-78` fixa esse resultado como esperado.

A pergunta que faltava responder era o que fazer com o intervalo do aluno
quando o mesmo item muda numa versão nova.

## Decisão

1. **O item preserva a data já agendada (`dueAt`).** A reconciliação é por
   `(lessonId, itemId)`.
2. **A evidência não é herdada.** Tentativas, domínio e intervalo continuam
   presos à versão em que foram registrados. O item da versão nova começa sem
   histórico de acertos, mas vence na data herdada.
3. **Item removido** sai da agenda. **Item novo** é semeado como hoje.

## Consequências

- Uma atualização editorial não gera pico de revisões nem apaga a revisão do
  aluno.
- O teste novo exige as duas coisas: **diferença** (nenhuma evidência
  transferida) e **validade** (a lição volta à fila na data herdada). Ele
  precisa ser visto falhando no código atual (FILA 55).
- A alternativa recusada era reiniciar o intervalo, voltando o item para
  revisão em 1 dia. Ela é mais rigorosa, mas cada lote atualizado geraria um
  pico de revisões.
