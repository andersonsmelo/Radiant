# ADR — Motor da lição híbrida nas lições legadas, com o conteúdo que já existe

**Data:** 2026-10-18 (America/Bahia).
**Estado:** aceita.
**Decisor:** Anderson Melo, nesta conversa: escopo "Motor híbrido agora", vidas
"Primeiro contato sem custo" e ideia-chave "Tirar o passo de molde".
**Autoria do registro:** Claude Opus 5.5 (Anthropic, `claude-opus-5-5`).
**Relaciona-se com:** a [ADR da lição híbrida e do custo de vida](ADR-2026-09-23-licao-hibrida-e-custo-de-vida.md),
de 2026-09-23, e a [ADR da evolução global sem pilotos](ADR-2026-10-16-evolucao-global-da-trilha-sem-pilotos.md).

## Contexto

Medido em 2026-10-18 no código e no simulador iOS, no estado integrado das PRs
#39 e #40:

- [código] Cada lição legada usa **uma** pergunta (`buildIntroBlock`, índice
  0). A revisão usa a de índice 1. As 16 lições de IA têm **2 perguntas cada** e
  as 2 manuais têm 3.
- [código] Em 16 das 18 lições, o passo "Ideia-chave" mostra só o molde "O
  objetivo desta etapa é consolidar o conceito central de X antes do quiz."
  Nas 2 lições com texto autoral, o texto entrega a resposta da pergunta
  seguinte. [visto]
- [código] Na lição legada, todo erro fora da revisão gasta uma vida
  (`LessonFlowScreen.tsx`, `heartsRepository.spend`). A ADR de 2026-09-23 só
  isentava o primeiro contato "a partir das lições híbridas".
- [visto] A explicação aparece num passo separado, depois da pergunta, sem
  mostrar o que o aluno marcou. O resumo diz "Refazer agora é o caminho mais
  curto", mas não existe botão "Refazer".

A ADR de 2026-09-23 já definia o formato de destino: de 10 a 15 itens,
explicação no feedback, item errado voltando no fim e primeiro contato sem custo
de vida. Esse volume de itens depende de produção de conteúdo (FILA 45).

## Decisão

1. **O motor da lição híbrida entra agora nas lições legadas**, usando todas as
   perguntas que cada lição já tem: 2 ou 3. Os 10 a 15 itens virão depois, pelo
   mesmo motor, quando houver conteúdo aprovado.
2. **Feedback junto de cada resposta:** o aluno vê o que marcou, a resposta
   certa e a explicação antes de seguir.
3. **O item errado volta no fim da lição**, sem variação, porque ainda não há
   variantes.
4. **Custo de vida pela regra híbrida, que passa a valer para essas lições:**
   errar no primeiro contato com o item não tira vida. Errar o item que voltou no
   fim tira uma, assim como o checkpoint. A revisão continua sem custo.
5. **Sem passo de molde.** Onde não há ideia-chave autoral, a lição vai direto
   às perguntas. As 2 lições com texto próprio mantêm o passo.
6. **Botão "Refazer" no resumo** quando o resultado não foi completo, coerente
   com a copy de 0 estrela.

## Consequências

- **A régua de estrelas precisa mudar.** A aprovação exige 70% de acerto
  (`QUIZ_THRESHOLDS.PASSING_SCORE`), então com 2 perguntas um acerto vale 0
  estrela, e com 3 perguntas dois acertos também. O pacote propõe a régua para
  N perguntas, e o dono aprova na PR.
- **Oito roteiros Maestro respondem perguntas de lição** e supõem uma por lição.
  Todos precisam ser atualizados, e não só o caminho 1 que o contrato estático
  confere.
- **XP, sequência e recompensa** passam a vir de uma lição com várias perguntas.
  A idempotência do G4 e o journal precisam continuar valendo por item.
- A revisão do nó de revisão (`buildReviewBlock`) não pode repetir, na mesma
  sessão, item já respondido.
- **Fica de fora:** conteúdo novo, variantes, imagens e mudança de currículo.
