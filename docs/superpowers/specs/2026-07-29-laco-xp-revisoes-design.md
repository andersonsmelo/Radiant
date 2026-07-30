# Spec de design — O laço de XP, sequência, revisão e meta diária

- **Data:** 2026-07-29 (investigação e decisões de escopo) / 2026-07-30 (redação
  e a correção da §5) — a sessão atravessou a virada do dia
- **Decisor:** Anderson (product owner), em sessão de brainstorming assistida
- **Status:** **implementada em 2026-07-30** (commits `ab40bb1..056ffe1`), gate
  completo verde. **Evidência em device pendente** — ver §8 e a ressalva 1 da §4
  do status canônico
- **Plano:** [2026-07-30-laco-xp-revisoes.md](../plans/2026-07-30-laco-xp-revisoes.md)
- **Relacionados:** [status canônico 2026-07-29](../../EXECUTION_STATUS_2026-07-29.md) (§4, ressalva 1),
  [roadmap de lançamento](../../plans/2026-07-27-radiant-launch-roadmap.md)

## 1. Problema

Os screenshots de loja capturados em 2026-07-29 saem com `XP total: 0` e
`REVISÕES 0`, mesmo com o roteiro de captura percorrendo lição, checkpoint e uma
segunda lição antes de fotografar a home. O status canônico registrou isso como
ressalva de vitrine, com a causa não investigada.

A causa é estrutural e não é cosmética: **em produção o laço de gamificação não
tem escritor alcançável.**

Os três escritores de estado vivem no hook `useQuiz`
(`src/features/quiz/hooks/useQuiz.ts`), que só roda dentro de `QuizScreen`,
servida pela rota `/quiz`. **Nada no app navega para `/quiz`.** Nós de jornada do
tipo `review` roteiam para `/learn`
(`src/features/journey/services/JourneyNodeRouting.ts`), não para a tela dedicada
de revisão; e o único `router.push('/review')` do código está em
`src/features/home/screens/HomeScreen.tsx`, a tela que só renderiza quando
`ENABLE_LEARNING_ROAD` está desligado — ou seja, nunca em produção.

O player que os usuários realmente percorrem,
`src/features/lesson-flow/screens/LessonFlowScreen.tsx`, ao concluir chama apenas
`JourneyProgressService`. Não há uma única referência a gamificação, repetição
espaçada ou meta diária em todo `src/features/lesson-flow/`.

| Escritor | Alcançável hoje? | Consequência |
| --- | --- | --- |
| `GamificationService.recordQuizCompletion` | não | XP fica em 0 **e** a sequência fica travada em 1 — `updateStreak` só roda dentro dele |
| `SpacedRepetitionService.recordQuizResult` | não | nenhum card nasce → `REVISÕES` fica em 0 → nó de revisão nunca vence |
| `DailyGoalService.recordQuizCompletion` | não | a meta diária nunca avança — lida por `MissionsScreen`, `JourneyHomeScreen` e por `PushService`, que decide notificação com ela |

Contra isso há **doze** call sites de `GamificationService.getSnapshot()`, dos
quais três estão em código inalcançável (`QuizScreen`, `useQuiz`, `ReviewScreen`)
— ou seja, **nove leitores em telas alcançáveis**. A assimetria é o que faz a
feature parecer viva: nove telas em produção leem o valor de verdade, então o zero
se apresenta como "ainda não acumulou" em vez de "nunca vai acumular".

Um aprendizado validado de 2026-07-27 registra a reescrita da `MissionsScreen`
para consumir apenas dados reais. Consertou-se o lado do leitor; o dado real é
zero.

### O que já existe e não precisa ser construído

A porta da revisão **já existe**, na própria trilha — separada da tela `/review`
órfã. Verificado no código:

- `JourneyDefinitionService` gera, para cada lição, um nó pareado
  `node:review:<lessonId>` com `blockId: block:review:<lessonId>`, destravado por
  concluir a lição.
- `src/data/journey/defaultBlocks.ts` contém `block:review:lesson-1` e
  `block:review:lesson-2`, cada um com contexto, questão e reforço. Conteúdo
  real, não stub.
- `JourneyProgressService.withFreshReviewState` re-deriva `pendingReviewNodeIds`
  de `SpacedRepetitionService.getDueLessons()` a cada carga.
- `JourneyRecommendationService.resolveNodeStatus` converte isso no status
  `due-review`, e `JourneyHomeScreen` prioriza esse nó.
- `JourneyProgressService.markNodeCompleted` remove o nó de `pendingReviewNodeIds`
  e emite o evento `review_completed`. Como o pendente é re-derivado do
  agendador, o nó **volta** quando o card vencer de novo: a marcação já é
  idempotente.

O laço inteiro está construído e parado numa chamada que ninguém faz.

## 2. Decisão

Introduzir um serviço de domínio que registra a consequência de concluir um
bloco de lição, e chamá-lo do `LessonFlowScreen` **antes** de marcar o nó como
concluído.

### Alternativas consideradas

- **Chamadas diretas no `handleContinue` da tela.** Menor diff, e descartada:
  põe regra de domínio numa tela que já passa de 200 linhas, e o teste da regra
  passaria a exigir renderizar a tela inteira — o oposto do que o
  `LessonFlowService` já faz com validação de bloco.
- **Registrar dentro de `JourneyProgressService.markNodeCompleted`.**
  Centralizaria tudo, e descartada por duas razões: acopla a jornada à
  gamificação e ao agendador, e **a acurácia não está disponível ali** — a
  primeira tentativa de cada passo é estado do player. Cairia em XP fixo.
- **XP fixo por lição, sem acurácia.** Descartada por criar uma segunda regra de
  XP no app e por exigir chamada separada para a sequência, que hoje só avança
  dentro de `recordQuizCompletion`.

## 3. A regra de premiação

`canOpenJourneyNode` só barra o status `locked`. Um nó concluído tem status
`completed`, portanto **é reabrível**. Premiar sem condição tornaria trivial
refazer a primeira lição e farmar XP e meta diária — os contadores voltariam a
mentir, agora para cima.

Gatear por "primeira conclusão", porém, quebraria a revisão: um nó de revisão é
concluído, sai de pendente e **volta** quando o SM-2 o vence. Se já estiver em
`completedNodeIds`, a segunda vez não premiaria, matando o incentivo que a
repetição espaçada existe para criar.

A regra é, então, **diferente por tipo de nó**:

| Nó | Premia XP + meta diária | Reavalia o card SM-2 |
| --- | --- | --- |
| **lição** | só na **primeira** conclusão (nó ausente de `completedNodeIds`) | **sempre** |
| **revisão** | sempre que estava **vencida** (status `due-review` ao abrir) | **sempre** |

A lição premia aprendizado novo, uma vez. A revisão premia recall, e não é
farmável porque quem decide se ela está vencida é o SM-2, não o usuário. Refazer
por vontade própria continua permitido e continua informando o agendador — só não
paga. O card é reavaliado nos dois casos porque acertar ou errar é informação
sobre memória, independente de pagar.

## 4. O serviço

`LessonOutcomeService`, em `src/features/lesson-flow/services/`.

```
recordCompletion({ block, nodeId, confirmedAnswers })
  → resolve elegibilidade consultando JourneyProgressService.getSnapshot()   (PRIMEIRO)
  → monta QuizResult { lessonId: block.lessonId, totalQuestions, correctAnswers, answeredAt }
  → SpacedRepetitionService.recordQuizResult                    (sempre)
  → se premia:
       GamificationService.recordQuizCompletion                 (XP + sequência)
       DailyGoalService.recordQuizCompletion
  → paridade de sincronização (§6)
  → devolve { award | null } para a tela decidir celebração
```

O tipo do nó e a condição de vencimento **não** são parâmetros: o serviço os
resolve do snapshot da jornada, para que a tela não precise conhecer a jornada
além do `nodeId` que já recebe.

**Ordem obrigatória:** a elegibilidade é consultada **antes** de
`recordQuizResult`. Gravar o recall avança o intervalo do SM-2 e o card deixa de
estar vencido; na ordem inversa, uma revisão vencida nunca pagaria.

`LessonBlock` já carrega `lessonId`, que é exatamente a chave usada por
`recordQuizResult` — nenhuma tradução de identidade precisa ser inventada.

`LessonFlowScreen.handleContinue` chama o serviço **antes** de
`markNodeCompleted`, porque a decisão de premiar lê `completedNodeIds` e o status
do nó, e a marcação muda os dois.

É a mesma sequência de chamadas que o `useQuiz` já faz, extraída de um hook para
um serviço — o que também dá à rota `/quiz` órfã um caminho de convergência, se
um dia ela voltar.

## 5. Acurácia pela escolha confirmada

**Esta seção foi corrigida em 2026-07-30, antes da implementação.** A redação
original media a **primeira** tentativa, justificada por um risco que não existe:
eu havia afirmado que o aluno pode trocar a resposta depois de ver a explicação.
Ele não pode. `answeredCorrectly` e `answerExplanation` são consumidos apenas pelo
`ReinforceStepRenderer`, que é um **passo seguinte**, renderizado após o
"Continuar"; o `MultipleChoiceStepRenderer` recebe só `payload`, `selectedOptionId`
e `onSelect`, sem nenhum sinal de correção. Re-tocar antes de confirmar é mudar de
ideia com zero informação nova, não farmar.

Havia também uma decisão de produto deliberada em sentido contrário, já coberta
por teste em `LessonFlowScreen.flow.test.tsx` ("confirma a escolha corrente ao
continuar"): *a alternativa valendo é a última selecionada, não a primeira
tocada*. Medir a primeira tentativa penalizaria exatamente quem esse teste
protege.

A regra é a **escolha confirmada** — a seleção vigente no instante do "Continuar":

- `totalQuestions` = número de passos `multiple-choice` do bloco;
- `correctAnswers` = passos cuja escolha confirmada estava correta.

Hoje `handleSelectOption` sobrescreve `answeredCorrectly` a cada toque e o valor
morre no fim do passo. Passa a existir um acumulador `stepId → escolha confirmada
foi correta`, gravado no "Continuar" de cada passo interativo.

A proteção contra farm **não depende desta seção**: ela vem inteira da regra de
premiação da §3. O comportamento visível da tela não muda, e nem o E2E nem os
screenshots de loja precisam ser refeitos por causa daqui.

**Consequência de escala, verificada em `LessonFlowService.validateBlock`:** o
contrato de bloco exige **exatamente um** passo interativo, então hoje
`totalQuestions` é sempre 1 e a acurácia é 0 ou 100%. O XP por lição é 10 (base)
ou 18 (base + bônus de 90%), e o tier `BONUS_XP_80PCT` é inalcançável enquanto o
contrato mantiver uma questão por bloco. Não é defeito; é o que uma questão só
permite.

## 6. Sincronização

O `useQuiz` também enfileirava progresso e card no `SyncQueueService`
(`enqueueLessonProgressFromQuizResult`, `enqueueReviewCard`, `flush`). O serviço
faz a mesma paridade, porque sem ela o card local e o remoto divergem no dia em
que a API voltar.

A API pública está em HTTP 502. O `flush` falhando não pode derrubar a conclusão
da lição — cai no tratamento da §7.

## 7. Erro e degradação

Toda escrita é `AsyncStorage` ou rede, e nenhuma pode impedir o aluno de sair da
lição. Cada bloco em `try/catch` com log; `markNodeCompleted` e a navegação rodam
**independente** do resultado. Progresso da trilha nunca fica preso atrás de
gamificação — é a mesma postura de `recover()` que o `HomeDashboardService` já
adota.

## 8. Verificação

Unitários do `LessonOutcomeService`, todos em Jest, dentro do `npm run quality` —
sem device e sem emulador:

- lição nova premia XP, sequência e meta diária;
- lição repetida **não** premia, mas reavalia o card;
- revisão vencida premia;
- revisão refeita fora de prazo **não** premia, mas reavalia o card;
- acurácia usa a escolha confirmada, e trocar de alternativa antes do "Continuar"
  não penaliza;
- falha de storage não propaga para o chamador.

Mais um teste de fluxo do `LessonFlowScreen` provando que a conclusão chama o
serviço **antes** da marcação do nó.

Encerramento real da ressalva de vitrine: recapturar os screenshots de loja
depois disso e conferir que `XP total` e `REVISÕES` deixaram de ser zero. Isso é
evidência em device, posterior e separada dos testes.

## 9. Fora de escopo

- **Corações.** `canStartLesson()` tem zero call sites no app; `loseHeart` só
  existe dentro do `useQuiz` inalcançável e `refillHearts` não é chamado em lugar
  nenhum. Corações ficam em 5 para sempre, exibidos em seis telas alcançáveis
  (`ReviewScreen` também os exibe, e é inalcançável), sem forma de perder e sem
  nada que bloqueiem. Ligá-los é uma feature inteira —
  gate ao abrir o nó, mensagem de bloqueio, caminho de recuperação — e fica
  registrado como pendência própria, por decisão do dono nesta sessão.
- **Rotas órfãs `/quiz` e `/review`.** Decisão de higiene, sem bloquear nada.
- **`HomeScreen` morta.** Decisão pendente do dono, com um acoplamento a
  registrar: ela é hoje o único `router.push('/review')` do código.
- **`src/features/gamification/services/xp 2.ts`.** Arquivo duplicado; entra na
  decisão de higiene já registrada no cérebro.

## 10. Consequências

- Quatro contadores saem de zero por uma chamada: XP, sequência, revisões
  pendentes e meta diária.
- `PushService` passa a ler uma meta diária que se move. Com
  `PUSH_SHADOW_MODE: true` nada é agendado, então o efeito hoje é apenas de log —
  mas isso deixa de ser inócuo no dia em que o shadow mode for desligado.
- A vitrine da loja passa a ter números reais, e a recaptura dos screenshots
  passa a fazer sentido.
- O closed test de 12 testadores por 14 dias consecutivos deixa de começar com um
  sistema de progresso que não se move — que é o que os testadores encontrariam
  no dia 1.
