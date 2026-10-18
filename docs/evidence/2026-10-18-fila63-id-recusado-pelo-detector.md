# FILA 63 — o id da tentativa recusado pelo detector de dado sensível

Medido em 2026-10-18, à noite, numa worktree limpa sobre a `main` em `d7bd696`,
com Node v20.20.2. Branch `claude/fila63-checkpoint-instavel`.

## O que a FILA dizia, e o que o log mostrou

A FILA 63 registrava uma falha única do caso
`CheckpointScreen flow › XP da aprovação › a celebração mostra o ganho e o total
depois dele` no job `quality` da PR #51 (`0cb5441`), com a hipótese, marcada como
inferida, de que a cadeia depois de "Enviar checkpoint" passava dos 1000 ms do
`findByText` no CI.

O log completo das duas tentativas do mesmo job ainda estava no GitHub
([comparação](2026-10-18-fila63-id-recusado-pelo-detector/ci-falha-vs-reenvio.txt)):

- a árvore da falha, que o extrato anterior omitia, mostra a tela no erro
  "Nao foi possivel registrar o checkpoint agora. Suas respostas não foram
  presumidas como concluídas.". O `+18 XP` não ia aparecer em prazo nenhum;
- o arquivo da tentativa que falhou tem três erros de console; o reenvio
  aprovado tem dois. O terceiro, `assessment-journal-unavailable`, é o da falha.

A hipótese de tempo foi refutada. As três execuções com `taskpolicy -b` não
reproduziam a falha porque o gatilho é um sorteio, não a velocidade da CPU.

## A causa

1. A `CheckpointScreen` monta o `attemptId` da avaliação com um sufixo
   `Math.random().toString(36).slice(2, 8)`. A `LessonFlowScreen` monta o id de
   estudo com `Math.random().toString(36).slice(2)`.
2. O journal por item valida o id com o validador de evidência
   (`ItemReviewRepository.ts`, `attemptValid`), que passa todo valor pelo
   detector `SENSITIVE_VALUE` de `learningEvidence.ts`.
3. O detector reprova `rg`, `cpf`, `pacs`, `dicom` e outras siglas cercadas de
   caracteres que não são letras. Um sufixo como `-rg9hyh` ou `410rg6` casa.
4. Com o id recusado, `recordBatch` devolve `accepted: false`, o repositório da
   avaliação lança `assessment-journal-unavailable`, e a tela mostra o erro.

Taxa medida em 2 milhões de sorteios, com o detector copiado do código:

| Id | Formato | Recusados |
| --- | --- | --- |
| Avaliação | `attempt:assessment:<ms>-<6 em base 36>` | 1 em 1.613 |
| Estudo da lição | `study:<ms>:<fração em base 36>` | 1 em 1.061 |

A nova tentativa da avaliação reaproveita a submissão pendente, com o mesmo id,
e a lição reaproveita `completion.identity`. A falha, portanto, se repetiria no
mesmo envio [inferido do código, não medido no app].

**Alcance.** O journal entrou na `main` em `a1f26f6` (2026-10-17). O arquivo
`ItemReviewRepository.ts` não existe no `221e2ec`, de onde saiu a `1.4.0`
publicada; o aluno da loja não é afetado. Uma build da `main` antes deste
conserto levaria o defeito.

**Os outros geradores em base 36** (`SyncQueueService`, `TelemetryService`,
`BetaService`, `UpgradeInterestService`) não passam pelo validador de evidência.
O filtro da telemetria olha **chaves** proibidas, não valores.

## O conserto

Escolhido pelo dono: gerador seguro nos dois chamadores e detector intacto.

- `radiant-app/src/features/spaced-repetition/attemptIds.ts` reúne os dois
  geradores e sorteia em hexadecimal. Toda sigla do detector tem ao menos uma
  letra fora de `a–f`, então nenhum sorteio a compõe. O sufixo da avaliação tem
  8 dígitos (32 bits, como os 6 em base 36) e o do estudo, 13 (52 bits).
- `CheckpointScreen.tsx` e `LessonFlowScreen.tsx` chamam o helper; nada mais
  mudou neles.

## As guardas e o passo vermelho

O gerador foi primeiro extraído **sem alteração** para o helper, e as guardas
foram escritas contra ele ([vermelho](2026-10-18-fila63-id-recusado-pelo-detector/vermelho.txt)):

- `attemptIds.test.ts`: o journal real aceita a avaliação e o estudo com o
  sorteio que compunha `rg`; nenhum de 20 mil sorteios de uma sequência fixa é
  recusado pelo validador de evidência. As três reprovaram contra o gerador
  antigo, e a amostra listou 34 ids recusados;
- `CheckpointScreen.flow.test.tsx`: com o `Math.random` no valor do CI, a
  aprovação mostra `+18 XP`, não mostra o erro e grava os itens no journal.
  Reprovou com "Unable to find an element with text: +18 XP" e
  `assessment-journal-unavailable`, o sintoma do CI;
- a guarda de formato e unicidade, que não acusa o detector, foi vista falhando
  por duas injeções sobre o conserto: sufixo constante e hexadecimal maiúsculo.

Depois do conserto ([verde](2026-10-18-fila63-id-recusado-pelo-detector/verde.txt)),
as suítes focadas passaram: 9 suítes, 183 testes, incluindo o fluxo da lição.

O gate do app, `EXPO_NO_DOTENV=1 npm run quality` em `radiant-app/` no Node
v20.20.2, sob `caffeinate -i` e com carga de 4,07: exit 0, **175 suítes, 1.792
testes, 1 snapshot**, Visual QA estrito aprovado. A base do CI da PR #51 tinha 174
suítes e 1.787 testes. A diferença é a suíte nova, com 4 testes, mais o caso novo
do checkpoint.

## O que não foi provado

- o comportamento da lição com o id recusado não foi medido na tela, só lido no
  código;
- nenhum aparelho, simulador ou build Release rodou este conserto;
- não há migração: um id antigo só foi gravado se já tinha passado pelo mesmo
  validador, que a leitura reaplica (`attemptValid` na quarentena), então os
  registros antigos continuam válidos [lido no código, sem teste novo].
