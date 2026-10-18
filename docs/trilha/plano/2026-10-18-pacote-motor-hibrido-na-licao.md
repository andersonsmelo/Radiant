# Pacote: motor da lição híbrida nas lições legadas — 2026-10-18

**Autoria:** Claude Opus 5.5 (Anthropic, `claude-opus-5-5`), coordenador.
**Executor:** OpenAI Codex, com revisão do Claude antes de marcar como feito.
Escolha de Anderson em 2026-10-18.
**Decisões que valem:**
- [ADR do motor híbrido](../../adr/ADR-2026-10-18-motor-hibrido-nas-licoes-legadas.md);
- [ADR do A1](../../adr/ADR-2026-10-18-a1-nova-versao-preserva-a-data.md);
- [ADR da lição híbrida, de 2026-09-23](../../adr/ADR-2026-09-23-licao-hibrida-e-custo-de-vida.md).

**Base:** branch `claude/motor-hibrido-e-decisoes-2026-10-18`, empilhada sobre as
PRs #40 e #39.

**Grau:** [código] conferido nesta data no estado integrado; [visto] observado
no simulador iOS em 2026-10-18; [inferido] critério ou proposta.

## 1. Por que este pacote

[visto] No simulador:
- a lição legada tem quatro passos e uma pergunta;
- a "Ideia-chave" é molde, ou entrega a resposta;
- a explicação aparece num passo separado e não mostra o que o aluno marcou;
- o resumo manda refazer, mas não há botão para isso.

[inferido] O motor certo, aplicado às 2 ou 3 perguntas que cada lição já tem,
dobra ou triplica a prática por lição sem conteúdo novo e deixa pronto o caminho
para os 10 a 15 itens da ADR de 2026-09-23.

## 2. Escopo

| # | Mudança | Onde começa [código] |
| --- | --- | --- |
| M1 | A lição usa **todas** as perguntas da lição, e não só a de índice 0 | `JourneyDefinitionService.buildIntroBlock` (`resolveQuestionIndex`, linha 50) e `buildMultipleChoiceStep` (linha 14) |
| M2 | Feedback **junto de cada resposta**: a opção marcada, a certa e a explicação, antes de seguir | Hoje a explicação está no passo `reinforce`, num renderizador separado (`ReinforceStepRenderer`, prop `explanation`). As respostas por interação já ficam em `useLearningActivity` (`confirmedAnswers`, linha 82) |
| M3 | O item errado **volta no fim** da lição, uma vez, sem variação | `LessonFlowService` e `useLearningActivity`: montar a fila da sessão |
| M4 | **Vidas pela regra híbrida:** o primeiro contato não custa; o item que voltou custa uma; a revisão continua grátis | `LessonFlowScreen.tsx`: o débito em `heartsRepository.spend`, perto da linha 278, hoje cobra todo erro fora da revisão |
| M5 | **Sem passo de molde:** sem `journey.intro.teachBody`, a lição não monta o passo "Ideia-chave" | `buildIntroBlock`: o fallback do `teach` é o molde "O objetivo desta etapa é consolidar…" |
| M6 | **"Refazer" no resumo** quando o resultado não foi completo | `LessonSummary.tsx` e o fluxo de volta da lição. Hoje não existe caminho de refazer |
| M7 | **Régua de estrelas para N perguntas.** O Codex propõe; o dono aprova na PR | `resolveLessonStars.ts` (acurácia) e `QUIZ_THRESHOLDS.PASSING_SCORE = 70` (`constants/quiz.ts:60`). Com 2 perguntas, 1 acerto hoje vale 0 estrela |
| M8 | O nó de revisão **não repete na mesma sessão** item já respondido | `buildReviewBlock` (índice 1, linha 127) |

**Fora do escopo:** conteúdo novo, variantes, imagens, currículo e mudança da
revisão espaçada (G4). A correção do A1 é o pacote seguinte (seção 5).

## 3. Quem será afetado — enumerar antes de mexer

O AGENTS.md pede enumerar os chamadores antes de combinar a condição de pronto.
A partir daqui:

- **Roteiros Maestro que respondem pergunta de lição** (8, por `grep
  lesson-option-`): `learning-critical-path`, `radiant-1-4-primeira-execucao`,
  `radiant-1-4-vidas-esgotadas`, `offline-relaunch`, `radiant-1-4-segundo-dia`,
  `reward-unlock`, `store-capture` e `student-checkpoint-no-duplicate-effect`.
  Todos supõem uma pergunta. `maestro-contract.test.mjs:1184-1188` confere só o
  caminho 1. **Atualize os oito**, e o `vidas-esgotadas` muda de sentido com a
  M4. [código]
- **Estrelas, XP e sequência** de `LessonOutcomeService`: com várias perguntas,
  a idempotência por item do G4 e o journal precisam continuar valendo. Nada pode
  ser creditado duas vezes, nem no item que volta.
- **`LegacyLessonAdapter`** e **`ActivityRendererRegistry`**: o caminho das
  atividades promovidas (V2) não pode quebrar.
- **Acessibilidade:** a leitura do feedback por item pelo leitor de tela e o
  texto ampliado.

## 4. Critérios de pronto

1. **Testes vistos falhando antes**, pelo motivo previsto, para M1 a M8. O
   vermelho de cada um fica registrado na evidência. Toda asserção de ausência
   ou diferença vem acompanhada de uma de validade.
2. **Gate completo** `EXPO_NO_DOTENV=1 npm run quality` no Node 20 e
   `loop validate` com 15/15.
3. **Prova nativa no simulador iOS**, com capturas na evidência:
   - lição de IA com 2 perguntas, acertando uma e errando outra;
   - o item errado voltando no fim;
   - as vidas debitadas só no retorno;
   - o resumo com a régua nova e o botão "Refazer";
   - uma lição sem o passo de molde.

   Rode pelo menos o roteiro `radiant-1-4-vidas-esgotadas` atualizado.
4. **Relatório com auditoria de citações:** cada arquivo, símbolo, linha e
   número citado precisa existir, conferido com `grep` antes de escrever. A
   revisão do coordenador vai conferir isso.
5. **FILA 58 reservada ao começar e marcada ao terminar.** O STATUS é editado
   se o estado mudar.

## 5. Pacote seguinte: correção do A1 (FILA 55)

Decisão já tomada: a nova versão **preserva a data**
([ADR](../../adr/ADR-2026-10-18-a1-nova-versao-preserva-a-data.md)).

- Reconciliar por `(lessonId, itemId)`.
- O teste novo exige nenhuma evidência transferida **e** a lição de volta à fila
  na data herdada.
- Ele precisa falhar no código atual, que é `ItemReviewService.test.ts:71-78`.

O A1 pode correr em paralelo com este pacote, numa worktree própria, porque toca
outros arquivos (`ItemReviewService.ts` e `ItemReviewRepository.ts`). A ordem
de merge é do coordenador.
