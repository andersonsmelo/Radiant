# ADR — Régua de estrelas para N perguntas e a última vida no último retorno

**Data:** 2026-10-18 (America/Bahia).
**Estado:** aceita.
**Decisor:** Anderson Melo, nesta conversa, na revisão da PR #42. Ele escolheu
"Aprovar a régua", "A lição conclui" e "Manter como está".
**Autoria do registro:** Claude Opus 5.5 (Anthropic, `claude-opus-5-5`).
**Relaciona-se com:** a [ADR do motor híbrido](ADR-2026-10-18-motor-hibrido-nas-licoes-legadas.md)
e a [ADR da lição híbrida e do custo de vida](ADR-2026-09-23-licao-hibrida-e-custo-de-vida.md).

## Contexto

A PR #42 (FILA 58) aplicou o motor híbrido às lições legadas. Ela deixou três
pontos para o dono decidir:

1. A régua de estrelas que o Codex propôs (M7). `resolveLessonStars` é
   compartilhada, então a régua também recalcula estrelas e recordes antigos.
2. [código] Quem perdia a última vida no último retorno via a folha de vidas, e
   a lição não era registrada. Na lição legada, perder a última vida na última
   pergunta ainda concluía.
3. [código] Com 0 vidas, o primeiro contato continua grátis: o aluno faz todas
   as perguntas e só é barrado quando um item errado volta.

## Decisão

1. **Régua aprovada.** Zero acertos valem 0 estrela. Algum acerto vale 1. A
   partir de 2/3 de acertos valem 2. Acertar tudo vale 3. A régua conta a
   primeira resposta de cada item. Recordes antigos nunca descem. De 70% a 84%
   de acerto, passam de 1 para 2 estrelas. De 2/3 a 69%, passam de 0 para 2.
   Abaixo de 2/3, com algum acerto, passam de 0 para 1. O
   corte de 70% (`QUIZ_THRESHOLDS.PASSING_SCORE`) continua decidindo o som de
   conclusão da lição.
2. **A última vida perdida no último retorno conclui a lição.** O aluno lê o
   feedback, a lição é registrada e o resumo aparece. Sem vidas, o bloqueio vem
   **antes de responder** um item que custa vida, e nunca depois do feedback de
   um débito. Se a última vida acaba num retorno que não é o último, a lição
   pausa antes do retorno seguinte.
3. **Com 0 vidas, nada muda.** O primeiro contato não custa vida, como manda a
   ADR de 2026-09-23. Quem acerta tudo conclui. Quem erra encontra a folha ao
   conferir o retorno.

## Consequências

- `LessonFlowScreen` perdeu a guarda que abria a folha depois do feedback de um
  débito. O teste "M4 a última vida perdida no último retorno conclui a lição"
  foi visto falhando antes da mudança.
- O roteiro `radiant-1-4-vidas-esgotadas` passou a ter uma 6ª sessão, a que
  encontra a folha. O contrato estático exige a conclusão na 5ª sessão e o
  bloqueio no retorno da 6ª.
- Sem vidas, um aluno que nunca erra estuda sem limite. Isso já decorria da ADR
  de 2026-09-23, e o dono manteve.
