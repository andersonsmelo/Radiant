# Evidência da frente F2 da 1.6 — famílias de interação

Decisão: [`ADR-2026-11-13-familias-de-interacao-da-1-6.md`](../../adr/ADR-2026-11-13-familias-de-interacao-da-1-6.md).

| Arquivo | O que sustenta |
| --- | --- |
| [`tdd-red.log`](tdd-red.log) | Cada asserção nova vista falhando antes da implementação (RED 1 a 11), com o defeito que ela nomeia. Onde o comportamento já existia, o vermelho veio de mutação declarada no próprio log. |
| [`gates.log`](gates.log) | `EXPO_NO_DOTENV=1 npm run quality` no Node 20 em `a8c09de` (234 suítes, 3149 testes). A medição final, de 2026-11-15 sobre `0842d32` mais as correções do simulador, deu 234 suítes e 3151 testes, saída 0, no Node 20.20.2. |
| [`maestro.log`](maestro.log) | Os três roteiros de `radiant-app/.maestro/f2-formatos/` rodando inteiros no simulador, sem passo reprovado. |

## O que os roteiros cobrem

- `m01.yaml` (M01.03): retomada no meio, categorização com acerto e múltipla seleção com erro.
- `m02.yaml` (M02.01): retomada no meio, true-false com acerto e cloze com erro.
- `m03.yaml` (M03.02): retomada no meio, cloze com acerto e true-false com erro.

A aula abre por link (`radiantapp://learn?blockId=…`), sem nó da trilha, porque M02
e M03 ficam travadas para um aluno novo. A retomada encerra o app depois da i1,
relança sem limpar o estado e abre a aula com `resumeCursorId=step-6`; o tocador
volta à primeira interação. É o mesmo cursor que a trilha passa, mas não o caminho
completo pela trilha.

## O que não foi visto

- VoiceOver de verdade: os rótulos foram lidos pela árvore do Maestro, não ouvidos.
- Texto ampliado (AX2): não houve rodada com fonte aumentada.
- Som e vibração: não medidos; continuam saindo só de `lessonFeedback`, sem mudança.
- A tela de conclusão depois de "Concluir e voltar": o roteiro toca o botão e para.
- iPhone físico e Android.
