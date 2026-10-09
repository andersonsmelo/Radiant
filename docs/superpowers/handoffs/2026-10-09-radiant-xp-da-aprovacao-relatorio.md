# Relatório — o XP da aprovação das avaliações da V2 (FILA, 13), 2026-10-09

**Branch:** `feat/d4-decisoes-de-revisao` (PR #38). **Run do Loop:**
`run-1791566707916-353d50fd`.

## Decisão do dono (2026-10-09, nesta conversa)

Entre três propostas (a regra da lição, um valor fixo maior e nenhum XP), o
dono escolheu:
- **a regra da lição:** 10 XP de base, mais 5 com 80 % de acerto ou 8 com
  90 % ou mais. Conta para a sequência e para a meta diária, e paga **só na
  primeira aprovação**;
- **a celebração** mostra o ganho ("+18 XP") e o total já com ele. Sem crédito,
  ela mostra só o total.

Registrada como revisão na
[ADR de 2026-09-28](../../adr/ADR-2026-09-28-checkpoints-de-botao-saem-da-trilha.md).

## Causa (medida no código)

- Aprovar uma avaliação (`CheckpointScreen`, `handleProductionAnswer`) chamava
  só `JourneyProgressService.markNodeCompleted`. Nada creditava XP.
- A celebração mostrava o `totalXp` lido uma única vez, quando a tela abria.
  Mesmo com crédito, ela repetiria o número antigo.
- Consequência que o item não nomeava: um dia em que o aluno só fazia a
  avaliação não contava para a sequência nem para a meta diária.

## Conserto

- `LessonOutcomeService.recordAssessmentApproval`: reaproveita a régua de
  elegibilidade da lição (`resolveNode`: nó destravado e ainda não concluído) e
  o mesmo crédito (`recordReward`: XP, sequência e meta diária). Não grava
  recall, evidência nem sync, porque a tentativa já foi registrada pelo
  `UnitCheckpointService`.
- `CheckpointScreen`: na aprovação, credita **antes** de `markNodeCompleted`.
  A conclusão dispara o backup do iCloud, que leva o `totalXp`; na ordem
  inversa, a nuvem guardaria o total de antes. Depois, relê o total. Se a
  releitura falhar, a conclusão segue, porque o XP já foi pago e uma nova
  tentativa pagaria de novo.
- Na celebração entra a linha "+N XP", só quando houve crédito.

**Na prática, toda aprovação rende 18 XP.** A avaliação do estágio 1 tem 2
itens (asserção do teste da tela), e 80 % de 2 são os 2. A contagem dos outros
quatro estágios não foi conferida.

## Testes e guardas

8 testes novos, mais um mock ajustado:
- `LessonOutcomeService.test.ts`, 4: credita na primeira aprovação; não credita
  a já aprovada; não credita a bloqueada; não regrava a tentativa;
- `CheckpointScreen.flow.test.tsx`, 4: credita antes de concluir, com os
  acertos; a celebração mostra o ganho e o total novo; sem crédito, só o total;
  reprovar não credita;
- `JourneyNodeCompletionGuard.test.tsx`: o mock do `LessonOutcomeService`
  ganhou o método novo. Sem ele, a tela caía no erro de registro, e não no de
  conclusão recusada que o teste afirma.

**Vermelho, observado antes do conserto:**
- serviço, 4 de 4: `recordAssessmentApproval is not a function`, o motivo
  previsto para um método que não existia;
- tela, 2 de 4 pelo defeito: o crédito não era chamado, e
  `Unable to find an element with text: +18 XP`. Os outros 2 afirmam "não muda"
  e passavam, como deviam; foram provados por injeção.

**Injeção de defeito, uma por vez, com o arquivo restaurado e comparado byte a
byte no fim:**

| Defeito injetado | Guarda que falhou |
|---|---|
| a. paga sem olhar a elegibilidade | "não credita a já aprovada" e "não credita a bloqueada" |
| b. regrava a tentativa (recall) | "não regrava a tentativa" |
| c. mostra o ganho sem crédito | "sem crédito, só o total" |
| d. credita mesmo reprovando | "reprovar não credita" |
| e. credita depois de concluir | "credita antes de concluir", na asserção de ordem |
| f. não relê o total | "a celebração mostra o ganho e o total novo" |

Duas correções saíram da tabela:
- **(c) passou na primeira rodada.** O defeito gerava "+null XP", e a guarda
  procurava `^\+\d+ XP$`. A guarda foi ampliada para qualquer texto que comece
  com "+", e então falhou.
- **(e) passou na primeira rodada** porque a injeção estava errada: ela
  acrescentou uma segunda chamada depois da conclusão e deixou a primeira no
  lugar. Refeita movendo a chamada, a guarda falhou na asserção de ordem.

## Gate

`EXPO_NO_DOTENV=1 npm run quality`, em `radiant-app`, Node `v20.20.2`,
2026-10-09, às 14:31, com a árvore só com os arquivos do run: exit 0,
**155 suítes / 1490 testes** (8 a mais que a medição anterior, de 1482), lint
com 0 erros e 26 avisos (os mesmos de antes), visual QA sem regressão.

## O que não foi verificado

- **A tela no simulador ou no aparelho.** A linha "+18 XP" e o total novo foram
  vistos só pelo Jest; o layout não foi visto.
- **O backup do iCloud com o XP novo.** O teste afirma a ordem das chamadas, não
  o conteúdo que chega à nuvem.
- **Se uma avaliação já aprovada pode ser refeita pela trilha.** Se puder, o
  serviço não paga de novo (testado), e a celebração mostra só o total.

## Próximo

Pela FILA, o primeiro item do agente passa a ser o **35**: anunciar a perda de
vida nas avaliações da V2 (`CheckpointScreen.tsx:326`).
