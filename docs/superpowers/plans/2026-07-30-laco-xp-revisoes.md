# Laço de XP, sequência, revisão e meta diária — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Fazer o player de lição registrar a consequência de concluir um bloco, para que XP, sequência, revisões pendentes e meta diária deixem de ficar permanentemente em zero em produção.

**Architecture:** Um serviço de domínio novo em `lesson-flow` recebe o bloco concluído e as escolhas confirmadas, decide se a conclusão é premiável consultando o snapshot da jornada, e chama os escritores que hoje só existem no hook `useQuiz` inalcançável. A tela passa a acumular a escolha confirmada de cada passo interativo e a chamar o serviço antes de marcar o nó como concluído. Nenhuma tela nova, nenhum conteúdo novo, nenhuma mudança na jornada.

**Tech Stack:** React Native / Expo, TypeScript, Jest (preset `jest-expo`), `@testing-library/react-native`, AsyncStorage.

**Spec:** [`docs/superpowers/specs/2026-07-29-laco-xp-revisoes-design.md`](../specs/2026-07-29-laco-xp-revisoes-design.md)

**Status: CONCLUÍDO em 2026-07-30.** As seis tasks entregues em
`ab40bb1..056ffe1`, evidência em device obtida na mesma data
([`2026-07-30-laco-xp-device.md`](../../../radiant-app/docs/evidence/2026-07-30-laco-xp-device.md)):
`XP total: 18` no checkpoint e `TOTAL XP 36` no progresso, o valor previsto pela
§5 da spec.

**Duas coisas apareceram depois deste plano e não estavam nele:**

1. A **evidência em device** foi registrada como bloqueada por ausência de JDK no
   host. O bloqueio **não existia** — ver §4 do
   [status canônico](../../archive/EXECUTION_STATUS_2026-07-29.md).
2. A captura que provou o conserto expôs, na **mesma tela**, os cards `PRECISÃO`
   e `TÓPICOS` com a mesma classe de defeito que este plano corrigiu — leitor sem
   dado por trás. Corrigido em `233f4b0`, fora do escopo desta spec. A lição:
   quando uma classe de defeito é caracterizada, vale varrer a superfície inteira
   onde ela apareceu antes de declarar o trabalho fechado.

## Global Constraints

- Trabalhe sempre dentro de `radiant-app/`. O gate do projeto é `npm run quality`, rodado de `radiant-app/`.
- Toda escrita de estado é `AsyncStorage` ou rede e **nenhuma pode impedir o aluno de sair da lição**. Cada bloco de escrita em `try/catch` com `console.error`; a marcação do nó e a navegação rodam independente do resultado.
- **Ordem obrigatória:** a elegibilidade de premiação é consultada **antes** de `SpacedRepetitionService.recordQuizResult`. Gravar o recall avança o intervalo do SM-2 e o card deixa de estar vencido; na ordem inversa uma revisão vencida nunca pagaria.
- Regra de premiação (spec §3): nó de **lição** paga só na primeira conclusão (ausente de `completedNodeIds`); nó de **revisão** paga sempre que estava vencido (presente em `pendingReviewNodeIds`). O card do SM-2 é reavaliado **nos dois casos**, premiando ou não.
- Acurácia é a **escolha confirmada** — a seleção vigente no instante do "Continuar". Não é a primeira tentativa. Existe um teste que documenta essa decisão de produto (`LessonFlowScreen.flow.test.tsx`, "confirma a escolha corrente ao continuar"); **não o reescreva**.
- `LessonFlowService.validateBlock` exige **exatamente um** passo interativo por bloco, então `totalQuestions` é sempre 1 hoje e a acurácia é 0 ou 100%. XP por lição é 10 ou 18, e `BONUS_XP_80PCT` é inalcançável. Isso é esperado — não "corrija".
- Corações estão **fora de escopo** por decisão do dono. Não chame `loseHeart`, não crie gate, não toque em `canStartLesson`.
- Efeito colateral esperado, **não** um bug: `PushService` lê a meta diária para decidir notificação, e a meta passa a se mover. Com `PUSH_SHADOW_MODE: true` (`src/config/push.ts`) nada é agendado, então hoje isso só aparece em log. Não desligue o shadow mode nem mexa em push por causa disto.
- Não empurre nada para o remoto. Commite apenas o que cada task lista.

---

### Task 1: `LessonOutcomeService` — regra de premiação e registro do recall

**Files:**
- Create: `radiant-app/src/features/lesson-flow/services/LessonOutcomeService.ts`
- Test: `radiant-app/src/features/lesson-flow/services/LessonOutcomeService.test.ts`

**Interfaces:**
- Consumes: `GamificationService.recordQuizCompletion(result) → { snapshot, award }`, `SpacedRepetitionService.recordQuizResult(result) → void`, `DailyGoalService.recordQuizCompletion(answeredAt) → snapshot`, `JourneyProgressService.getSnapshot() → JourneySnapshot`, tipos `LessonBlock` (`src/types/lessonFlow.ts`), `QuizResult` (`src/types/quiz.ts`), `XpAward` (`src/types/gamification.ts`).
- Produces: `LessonOutcomeService.recordCompletion(input: LessonOutcomeInput): Promise<LessonOutcome>`, com
  `LessonOutcomeInput = { block: LessonBlock; nodeId: string; confirmedAnswers: Record<string, boolean>; answeredAt?: Date }`
  e `LessonOutcome = { award: XpAward | null; rewarded: boolean }`. A Task 3 chama exatamente esta assinatura.

- [ ] **Step 1: Write the failing test**

Crie `radiant-app/src/features/lesson-flow/services/LessonOutcomeService.test.ts`:

```typescript
import type { LessonBlock } from '../../../types/lessonFlow';
import type { JourneySnapshot } from '../../../types/journey';
import { GamificationService } from '../../gamification/services/GamificationService';
import { SpacedRepetitionService } from '../../spaced-repetition/services/SpacedRepetitionService';
import { DailyGoalService } from '../../daily-goal/services/DailyGoalService';
import { JourneyProgressService } from '../../journey/services/JourneyProgressService';
import { LessonOutcomeService } from './LessonOutcomeService';

jest.mock('../../gamification/services/GamificationService', () => ({
    GamificationService: { recordQuizCompletion: jest.fn() },
}));

jest.mock('../../spaced-repetition/services/SpacedRepetitionService', () => ({
    SpacedRepetitionService: { recordQuizResult: jest.fn() },
}));

jest.mock('../../daily-goal/services/DailyGoalService', () => ({
    DailyGoalService: { recordQuizCompletion: jest.fn() },
}));

jest.mock('../../journey/services/JourneyProgressService', () => ({
    JourneyProgressService: { getSnapshot: jest.fn() },
}));

const mockedGamification = GamificationService as jest.Mocked<typeof GamificationService>;
const mockedSpacedRepetition = SpacedRepetitionService as jest.Mocked<typeof SpacedRepetitionService>;
const mockedDailyGoal = DailyGoalService as jest.Mocked<typeof DailyGoalService>;
const mockedJourney = JourneyProgressService as jest.Mocked<typeof JourneyProgressService>;

const block: LessonBlock = {
    id: 'block:lesson-1:intro',
    lessonId: 'lesson-1',
    steps: [
        {
            step: { type: 'context', payload: { title: 'Contexto', body: 'Corpo' } },
            contract: { id: 'lesson-1-context', type: 'context', completionRule: 'displayed', retryRule: 'allow_continue', branching: 'none' },
        },
        {
            step: {
                type: 'multiple-choice',
                payload: {
                    prompt: 'Pergunta?',
                    options: [{ id: 'a', label: 'A' }, { id: 'b', label: 'B' }],
                    correctOptionId: 'a',
                    explanation: 'Porque A.',
                },
            },
            contract: { id: 'lesson-1-question', type: 'multiple-choice', completionRule: 'answered', retryRule: 'allow_continue', branching: 'none' },
        },
    ],
};

function snapshotWith(overrides: {
    nodeId: string;
    nodeType: 'lesson' | 'review';
    completedNodeIds?: string[];
    pendingReviewNodeIds?: string[];
}): JourneySnapshot {
    return {
        track: {
            id: 'track-1',
            title: 'Trilha',
            initialUnitId: 'unit-1',
            units: [
                {
                    id: 'unit-1',
                    title: 'Unidade',
                    nodes: [
                        {
                            id: overrides.nodeId,
                            unitId: 'unit-1',
                            type: overrides.nodeType,
                            title: 'Nó',
                            lessonId: 'lesson-1',
                            blockId: block.id,
                            status: 'available',
                        },
                    ],
                },
            ],
        },
        progress: {
            schemaVersion: 'journey-progress.v2',
            activeTrackId: 'track-1',
            currentUnitId: 'unit-1',
            currentNodeId: null,
            completedNodeIds: overrides.completedNodeIds ?? [],
            pendingReviewNodeIds: overrides.pendingReviewNodeIds ?? [],
            lastUpdatedAt: '2026-07-30T00:00:00.000Z',
            pendingSyncEvents: [],
        },
        nextRecommendedNode: null,
        completedCount: 0,
        dueReviewCount: 0,
    };
}

describe('LessonOutcomeService', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        mockedGamification.recordQuizCompletion.mockResolvedValue({
            snapshot: { totalXp: 18, streakDays: 1, lastActiveDate: null, hearts: 5, maxHearts: 5, heartsNextRefillAt: null },
            award: { baseXp: 10, bonusXp: 8, totalXpAwarded: 18, reason: 'quiz_complete' },
        });
        mockedSpacedRepetition.recordQuizResult.mockResolvedValue(undefined);
        mockedDailyGoal.recordQuizCompletion.mockResolvedValue({
            goalPerDay: 3,
            completedToday: 1,
            isCompleted: false,
            dateKey: '2026-07-30',
        });
    });

    it('premia a primeira conclusão de um nó de lição e reavalia o card', async () => {
        mockedJourney.getSnapshot.mockResolvedValue(snapshotWith({ nodeId: 'node:lesson-1', nodeType: 'lesson' }));

        const outcome = await LessonOutcomeService.recordCompletion({
            block,
            nodeId: 'node:lesson-1',
            confirmedAnswers: { 'lesson-1-question': true },
        });

        expect(outcome.rewarded).toBe(true);
        expect(outcome.award?.totalXpAwarded).toBe(18);
        expect(mockedSpacedRepetition.recordQuizResult).toHaveBeenCalledTimes(1);
        expect(mockedGamification.recordQuizCompletion).toHaveBeenCalledTimes(1);
        expect(mockedDailyGoal.recordQuizCompletion).toHaveBeenCalledTimes(1);

        const result = mockedSpacedRepetition.recordQuizResult.mock.calls[0][0];
        expect(result.lessonId).toBe('lesson-1');
        expect(result.totalQuestions).toBe(1);
        expect(result.correctAnswers).toBe(1);
    });

    it('não premia uma lição já concluída, mas ainda reavalia o card', async () => {
        mockedJourney.getSnapshot.mockResolvedValue(
            snapshotWith({ nodeId: 'node:lesson-1', nodeType: 'lesson', completedNodeIds: ['node:lesson-1'] })
        );

        const outcome = await LessonOutcomeService.recordCompletion({
            block,
            nodeId: 'node:lesson-1',
            confirmedAnswers: { 'lesson-1-question': true },
        });

        expect(outcome.rewarded).toBe(false);
        expect(outcome.award).toBeNull();
        expect(mockedSpacedRepetition.recordQuizResult).toHaveBeenCalledTimes(1);
        expect(mockedGamification.recordQuizCompletion).not.toHaveBeenCalled();
        expect(mockedDailyGoal.recordQuizCompletion).not.toHaveBeenCalled();
    });

    it('premia uma revisão vencida', async () => {
        mockedJourney.getSnapshot.mockResolvedValue(
            snapshotWith({
                nodeId: 'node:review:lesson-1',
                nodeType: 'review',
                completedNodeIds: ['node:review:lesson-1'],
                pendingReviewNodeIds: ['node:review:lesson-1'],
            })
        );

        const outcome = await LessonOutcomeService.recordCompletion({
            block,
            nodeId: 'node:review:lesson-1',
            confirmedAnswers: { 'lesson-1-question': true },
        });

        expect(outcome.rewarded).toBe(true);
        expect(mockedGamification.recordQuizCompletion).toHaveBeenCalledTimes(1);
    });

    it('não premia uma revisão refeita fora de prazo, mas reavalia o card', async () => {
        mockedJourney.getSnapshot.mockResolvedValue(
            snapshotWith({ nodeId: 'node:review:lesson-1', nodeType: 'review', pendingReviewNodeIds: [] })
        );

        const outcome = await LessonOutcomeService.recordCompletion({
            block,
            nodeId: 'node:review:lesson-1',
            confirmedAnswers: { 'lesson-1-question': true },
        });

        expect(outcome.rewarded).toBe(false);
        expect(mockedSpacedRepetition.recordQuizResult).toHaveBeenCalledTimes(1);
        expect(mockedGamification.recordQuizCompletion).not.toHaveBeenCalled();
    });

    it('conta como errada a escolha confirmada incorreta', async () => {
        mockedJourney.getSnapshot.mockResolvedValue(snapshotWith({ nodeId: 'node:lesson-1', nodeType: 'lesson' }));

        await LessonOutcomeService.recordCompletion({
            block,
            nodeId: 'node:lesson-1',
            confirmedAnswers: { 'lesson-1-question': false },
        });

        const result = mockedSpacedRepetition.recordQuizResult.mock.calls[0][0];
        expect(result.totalQuestions).toBe(1);
        expect(result.correctAnswers).toBe(0);
    });

    it('consulta a elegibilidade antes de gravar o recall', async () => {
        const order: string[] = [];
        mockedJourney.getSnapshot.mockImplementation(async () => {
            order.push('snapshot');
            return snapshotWith({ nodeId: 'node:lesson-1', nodeType: 'lesson' });
        });
        mockedSpacedRepetition.recordQuizResult.mockImplementation(async () => {
            order.push('recall');
        });

        await LessonOutcomeService.recordCompletion({
            block,
            nodeId: 'node:lesson-1',
            confirmedAnswers: { 'lesson-1-question': true },
        });

        expect(order).toEqual(['snapshot', 'recall']);
    });

    it('não propaga falha de storage para o chamador', async () => {
        mockedJourney.getSnapshot.mockResolvedValue(snapshotWith({ nodeId: 'node:lesson-1', nodeType: 'lesson' }));
        mockedSpacedRepetition.recordQuizResult.mockRejectedValue(new Error('storage cheio'));
        mockedGamification.recordQuizCompletion.mockRejectedValue(new Error('storage cheio'));
        const errorSpy = jest.spyOn(console, 'error').mockImplementation(() => undefined);

        await expect(
            LessonOutcomeService.recordCompletion({
                block,
                nodeId: 'node:lesson-1',
                confirmedAnswers: { 'lesson-1-question': true },
            })
        ).resolves.toEqual({ award: null, rewarded: true });

        errorSpy.mockRestore();
    });

    it('não premia quando o nó não existe na trilha', async () => {
        mockedJourney.getSnapshot.mockResolvedValue(snapshotWith({ nodeId: 'node:outro', nodeType: 'lesson' }));

        const outcome = await LessonOutcomeService.recordCompletion({
            block,
            nodeId: 'node:inexistente',
            confirmedAnswers: { 'lesson-1-question': true },
        });

        expect(outcome.rewarded).toBe(false);
        expect(mockedGamification.recordQuizCompletion).not.toHaveBeenCalled();
    });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `cd radiant-app && EXPO_NO_DOTENV=1 CI=1 npx jest src/features/lesson-flow/services/LessonOutcomeService.test.ts --runInBand`
Expected: FAIL — `Cannot find module './LessonOutcomeService'`.

- [ ] **Step 3: Write minimal implementation**

Crie `radiant-app/src/features/lesson-flow/services/LessonOutcomeService.ts`:

```typescript
/**
 * LessonOutcomeService
 *
 * Registra a consequência de concluir um bloco de lição: reavalia o card de
 * repetição espaçada sempre, e concede XP, sequência e meta diária quando a
 * conclusão é premiável.
 *
 * Regra de premiação (spec §3): nó de lição paga só na primeira conclusão; nó de
 * revisão paga sempre que estava vencido. Quem decide se uma revisão está
 * vencida é o SM-2, não o usuário — por isso a revisão não é farmável.
 */

import type { LessonBlock } from '../../../types/lessonFlow';
import type { QuizResult } from '../../../types/quiz';
import type { XpAward } from '../../../types/gamification';
import { GamificationService } from '../../gamification/services/GamificationService';
import { SpacedRepetitionService } from '../../spaced-repetition/services/SpacedRepetitionService';
import { DailyGoalService } from '../../daily-goal/services/DailyGoalService';
import { JourneyProgressService } from '../../journey/services/JourneyProgressService';

export type LessonOutcomeInput = {
    block: LessonBlock;
    nodeId: string;
    /** stepId do passo interativo → a escolha confirmada estava correta */
    confirmedAnswers: Record<string, boolean>;
    answeredAt?: Date;
};

export type LessonOutcome = {
    award: XpAward | null;
    rewarded: boolean;
};

class LessonOutcomeServiceImpl {
    async recordCompletion(input: LessonOutcomeInput): Promise<LessonOutcome> {
        // A elegibilidade vem PRIMEIRO: gravar o recall avança o intervalo do
        // SM-2 e o card deixa de estar vencido, então na ordem inversa uma
        // revisão vencida nunca pagaria.
        const rewarded = await this.isRewardable(input.nodeId);
        const result = this.toQuizResult(input);

        await this.recordRecall(result);

        if (!rewarded) {
            return { award: null, rewarded: false };
        }

        const award = await this.recordReward(result);
        return { award, rewarded: true };
    }

    private async isRewardable(nodeId: string): Promise<boolean> {
        try {
            const snapshot = await JourneyProgressService.getSnapshot();
            const node = snapshot.track.units
                .flatMap((unit) => unit.nodes)
                .find((entry) => entry.id === nodeId);

            if (!node) {
                console.warn(`[LessonOutcomeService] Nó desconhecido "${nodeId}"; nada será premiado.`);
                return false;
            }

            if (node.type === 'review') {
                return snapshot.progress.pendingReviewNodeIds.includes(nodeId);
            }

            return !snapshot.progress.completedNodeIds.includes(nodeId);
        } catch (error) {
            // Falhar para "não premiar" é o lado seguro: nunca paga duas vezes.
            console.error('[LessonOutcomeService] Falha ao resolver elegibilidade:', error);
            return false;
        }
    }

    private toQuizResult({ block, confirmedAnswers, answeredAt }: LessonOutcomeInput): QuizResult {
        const choiceStepIds = block.steps
            .filter((definition) => definition.step.type === 'multiple-choice')
            .map((definition) => definition.contract.id);

        return {
            lessonId: block.lessonId,
            totalQuestions: choiceStepIds.length,
            correctAnswers: choiceStepIds.filter((stepId) => confirmedAnswers[stepId] === true).length,
            answeredAt: answeredAt ?? new Date(),
        };
    }

    private async recordRecall(result: QuizResult): Promise<void> {
        try {
            await SpacedRepetitionService.recordQuizResult(result);
        } catch (error) {
            console.error('[LessonOutcomeService] Falha ao registrar recall:', error);
        }
    }

    private async recordReward(result: QuizResult): Promise<XpAward | null> {
        let award: XpAward | null = null;

        try {
            const granted = await GamificationService.recordQuizCompletion(result);
            award = granted.award;
        } catch (error) {
            console.error('[LessonOutcomeService] Falha ao registrar XP:', error);
        }

        try {
            await DailyGoalService.recordQuizCompletion(result.answeredAt);
        } catch (error) {
            console.error('[LessonOutcomeService] Falha ao registrar meta diária:', error);
        }

        return award;
    }
}

export const LessonOutcomeService = new LessonOutcomeServiceImpl();
```

- [ ] **Step 4: Run test to verify it passes**

Run: `cd radiant-app && EXPO_NO_DOTENV=1 CI=1 npx jest src/features/lesson-flow/services/LessonOutcomeService.test.ts --runInBand`
Expected: PASS — 8 testes.

- [ ] **Step 5: Commit**

```bash
git add radiant-app/src/features/lesson-flow/services/LessonOutcomeService.ts radiant-app/src/features/lesson-flow/services/LessonOutcomeService.test.ts
git commit -m "feat(lesson-flow): registra XP, sequencia, recall e meta diaria ao concluir bloco"
```

---

### Task 2: Paridade de sincronização

**Files:**
- Modify: `radiant-app/src/features/lesson-flow/services/LessonOutcomeService.ts`
- Test: `radiant-app/src/features/lesson-flow/services/LessonOutcomeService.test.ts`

**Interfaces:**
- Consumes: de `src/features/sync/SyncQueueService.ts` (atenção: **não** existe `sync/services/`) — `enqueueLessonProgressFromQuizResult(result: QuizResult): Promise<void>`, `enqueueReviewCard(card: SRCardState): Promise<void>`, `flush(): Promise<void>`; e `SpacedRepetitionService.getCardState(lessonId): Promise<SRCardState | null>`.
- Produces: nada novo na assinatura pública. `recordCompletion` passa a enfileirar sincronização como efeito adicional.

**Por que existe:** o `useQuiz` enfileirava progresso e card. Sem essa paridade, o card local e o remoto divergem no dia em que a API voltar. A API pública está em HTTP 502 hoje; o `flush` falhando **não pode** derrubar a conclusão da lição.

- [ ] **Step 1: Write the failing test**

Adicione os mocks abaixo ao topo de `LessonOutcomeService.test.ts`, junto dos que já existem:

```typescript
jest.mock('../../sync/SyncQueueService', () => ({
    SyncQueueService: {
        enqueueLessonProgressFromQuizResult: jest.fn(),
        enqueueReviewCard: jest.fn(),
        flush: jest.fn(),
    },
}));
```

Ajuste o mock de `SpacedRepetitionService` para incluir `getCardState`:

```typescript
jest.mock('../../spaced-repetition/services/SpacedRepetitionService', () => ({
    SpacedRepetitionService: { recordQuizResult: jest.fn(), getCardState: jest.fn() },
}));
```

Acrescente os imports, o handle e a fixture de card:

```typescript
import type { SRCardState } from '../../../types/spacedRepetition';
import { SyncQueueService } from '../../sync/SyncQueueService';

const mockedSyncQueue = SyncQueueService as jest.Mocked<typeof SyncQueueService>;

const cardFixture: SRCardState = {
    lessonId: 'lesson-1',
    easeFactor: 2.5,
    interval: 1,
    repetitions: 1,
    nextReviewAt: new Date('2026-07-31T00:00:00.000Z'),
    lastReviewedAt: new Date('2026-07-30T00:00:00.000Z'),
    createdAt: new Date('2026-07-30T00:00:00.000Z'),
};
```

E o novo bloco de testes, dentro do `describe` existente:

```typescript
    it('enfileira progresso e card e dá flush', async () => {
        mockedJourney.getSnapshot.mockResolvedValue(snapshotWith({ nodeId: 'node:lesson-1', nodeType: 'lesson' }));
        mockedSpacedRepetition.getCardState.mockResolvedValue(cardFixture);
        mockedSyncQueue.enqueueLessonProgressFromQuizResult.mockResolvedValue(undefined);
        mockedSyncQueue.enqueueReviewCard.mockResolvedValue(undefined);
        mockedSyncQueue.flush.mockResolvedValue(undefined);

        await LessonOutcomeService.recordCompletion({
            block,
            nodeId: 'node:lesson-1',
            confirmedAnswers: { 'lesson-1-question': true },
        });

        expect(mockedSyncQueue.enqueueLessonProgressFromQuizResult).toHaveBeenCalledTimes(1);
        expect(mockedSyncQueue.enqueueReviewCard).toHaveBeenCalledTimes(1);
        expect(mockedSyncQueue.flush).toHaveBeenCalledTimes(1);
    });

    it('não enfileira card quando não há card state', async () => {
        mockedJourney.getSnapshot.mockResolvedValue(snapshotWith({ nodeId: 'node:lesson-1', nodeType: 'lesson' }));
        mockedSpacedRepetition.getCardState.mockResolvedValue(null);
        mockedSyncQueue.enqueueLessonProgressFromQuizResult.mockResolvedValue(undefined);
        mockedSyncQueue.flush.mockResolvedValue(undefined);

        await LessonOutcomeService.recordCompletion({
            block,
            nodeId: 'node:lesson-1',
            confirmedAnswers: { 'lesson-1-question': true },
        });

        expect(mockedSyncQueue.enqueueReviewCard).not.toHaveBeenCalled();
    });

    it('falha de sincronização não propaga nem impede a premiação', async () => {
        mockedJourney.getSnapshot.mockResolvedValue(snapshotWith({ nodeId: 'node:lesson-1', nodeType: 'lesson' }));
        mockedSpacedRepetition.getCardState.mockResolvedValue(cardFixture);
        mockedSyncQueue.enqueueLessonProgressFromQuizResult.mockRejectedValue(new Error('API 502'));
        const errorSpy = jest.spyOn(console, 'error').mockImplementation(() => undefined);

        const outcome = await LessonOutcomeService.recordCompletion({
            block,
            nodeId: 'node:lesson-1',
            confirmedAnswers: { 'lesson-1-question': true },
        });

        expect(outcome.rewarded).toBe(true);
        expect(mockedGamification.recordQuizCompletion).toHaveBeenCalledTimes(1);

        errorSpy.mockRestore();
    });
```

- [ ] **Step 2: Run test to verify it fails**

Run: `cd radiant-app && EXPO_NO_DOTENV=1 CI=1 npx jest src/features/lesson-flow/services/LessonOutcomeService.test.ts --runInBand`
Expected: FAIL — os três novos testes falham porque `SyncQueueService` nunca é chamado.

- [ ] **Step 3: Write minimal implementation**

Em `LessonOutcomeService.ts`, adicione o import:

```typescript
import { SyncQueueService } from '../../sync/SyncQueueService';
```

Adicione o método privado:

```typescript
    // Import no topo do arquivo: import { SyncQueueService } from '../../sync/SyncQueueService';
    private async enqueueSync(result: QuizResult): Promise<void> {
        // A API pública está em 502. Enfileirar mantém o card local e o remoto
        // convergentes quando ela voltar, e falhar aqui não pode derrubar a
        // conclusão da lição.
        try {
            await SyncQueueService.enqueueLessonProgressFromQuizResult(result);

            const cardState = await SpacedRepetitionService.getCardState(result.lessonId);
            if (cardState) {
                await SyncQueueService.enqueueReviewCard(cardState);
            }

            await SyncQueueService.flush();
        } catch (error) {
            console.error('[LessonOutcomeService] Falha ao enfileirar sincronização:', error);
        }
    }
```

E chame-o em `recordCompletion`, depois de `recordRecall` e antes do retorno não premiado:

```typescript
        await this.recordRecall(result);
        await this.enqueueSync(result);

        if (!rewarded) {
            return { award: null, rewarded: false };
        }
```

- [ ] **Step 4: Run test to verify it passes**

Run: `cd radiant-app && EXPO_NO_DOTENV=1 CI=1 npx jest src/features/lesson-flow/services/LessonOutcomeService.test.ts --runInBand`
Expected: PASS — 11 testes.

- [ ] **Step 5: Commit**

```bash
git add radiant-app/src/features/lesson-flow/services/LessonOutcomeService.ts radiant-app/src/features/lesson-flow/services/LessonOutcomeService.test.ts
git commit -m "feat(lesson-flow): paridade de sincronizacao no registro de conclusao"
```

---

### Task 3: Ligar o `LessonFlowScreen`

**Files:**
- Modify: `radiant-app/src/features/lesson-flow/screens/LessonFlowScreen.tsx` (estado novo perto da linha 33; `handleContinue` nas linhas 150-164)
- Test: `radiant-app/src/features/lesson-flow/screens/LessonFlowScreen.flow.test.tsx`

**Interfaces:**
- Consumes: `LessonOutcomeService.recordCompletion({ block, nodeId, confirmedAnswers })` da Task 1.
- Produces: nada para tasks seguintes.

**Armadilha de estado — leia antes de implementar:** `setConfirmedAnswers` é assíncrono. No último passo, a resposta que acabou de ser confirmada **não** estará em `confirmedAnswers` quando `recordCompletion` for chamado no mesmo `handleContinue`. Monte um valor local (`nextConfirmed`) e passe **esse** valor ao serviço. Usar o estado direto perde justamente a única resposta do bloco.

- [ ] **Step 1: Write the failing test**

Em `LessonFlowScreen.flow.test.tsx`, acrescente o mock do serviço junto dos mocks existentes:

```typescript
jest.mock('../services/LessonOutcomeService', () => ({
  LessonOutcomeService: {
    recordCompletion: jest.fn().mockResolvedValue({ award: null, rewarded: true }),
  },
}));
```

Importe os handles no topo, e acrescente `waitFor` ao import de
`@testing-library/react-native` (o arquivo hoje importa apenas `fireEvent` e
`screen`):

```typescript
import { fireEvent, screen, waitFor } from '@testing-library/react-native';
import { LessonOutcomeService } from '../services/LessonOutcomeService';
import { JourneyProgressService } from '../../journey/services/JourneyProgressService';

const mockedOutcome = LessonOutcomeService as jest.Mocked<typeof LessonOutcomeService>;
const mockedJourneyProgress = JourneyProgressService as jest.Mocked<typeof JourneyProgressService>;
```

**Fatos da fixture existente, já conferidos** — não invente valores: `blockFixture`
tem exatamente **dois** passos, `step-choice` (multiple-choice, correta é
`opt-b` / "Consolidação alveolar") e `step-reinforce`. Portanto o fluxo é: tocar a
alternativa → "Continuar" (confirma e avança para o reforço) → "Continuar"
(último passo, conclui). Dois "Continuar", nunca três.

Acrescente um `describe` novo no fim do arquivo:

```typescript
describe('LessonFlowScreen — registro da conclusão', () => {
  it('registra a conclusão com a escolha confirmada antes de marcar o nó', async () => {
    const order: string[] = [];
    mockedOutcome.recordCompletion.mockImplementation(async () => {
      order.push('outcome');
      return { award: null, rewarded: true };
    });
    // markNodeCompleted devolve JourneySnapshot na assinatura real, e a tela
    // ignora o retorno — daí o cast, que só existe para não montar um snapshot
    // inteiro num teste que mede ordem de chamada.
    mockedJourneyProgress.markNodeCompleted.mockImplementation(async () => {
      order.push('markNodeCompleted');
      return undefined as never;
    });

    renderWithProviders(<LessonFlowScreen blockId="block-1" nodeId="node-1" />);

    expect(await screen.findByText('Qual padrão radiográfico está presente?')).toBeTruthy();

    // Erra, corrige, e só então confirma: vale a escolha confirmada.
    fireEvent.press(screen.getByLabelText('Pneumotórax'));
    fireEvent.press(screen.getByLabelText('Consolidação alveolar'));
    fireEvent.press(screen.getByText('Continuar'));

    expect(await screen.findByText('Resposta correta')).toBeTruthy();
    fireEvent.press(screen.getByText('Continuar'));

    await waitFor(() => expect(mockedOutcome.recordCompletion).toHaveBeenCalledTimes(1));

    const input = mockedOutcome.recordCompletion.mock.calls[0][0];
    expect(input.nodeId).toBe('node-1');
    expect(input.block.lessonId).toBe('lesson-1');
    expect(input.confirmedAnswers).toEqual({ 'step-choice': true });

    // O serviço tem de rodar antes da marcação: a elegibilidade lê
    // completedNodeIds e pendingReviewNodeIds, que a marcação altera.
    expect(order).toEqual(['outcome', 'markNodeCompleted']);
  });

  it('registra escolha confirmada incorreta como incorreta', async () => {
    renderWithProviders(<LessonFlowScreen blockId="block-1" nodeId="node-1" />);

    expect(await screen.findByText('Qual padrão radiográfico está presente?')).toBeTruthy();

    // Confirma a alternativa errada e segue até o fim do bloco. A asserção é
    // sobre o que o serviço recebeu, não sobre o texto do reforço: o título de
    // erro do ReinforceStepRenderer ("Vamos reforçar") é igual ao
    // payload.title da fixture, então casá-lo não provaria nada.
    fireEvent.press(screen.getByLabelText('Pneumotórax'));
    fireEvent.press(screen.getByText('Continuar'));
    fireEvent.press(await screen.findByText('Continuar'));

    await waitFor(() => expect(mockedOutcome.recordCompletion).toHaveBeenCalledTimes(1));

    const input = mockedOutcome.recordCompletion.mock.calls[0][0];
    expect(input.confirmedAnswers).toEqual({ 'step-choice': false });
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `cd radiant-app && EXPO_NO_DOTENV=1 CI=1 npx jest src/features/lesson-flow/screens/LessonFlowScreen.flow.test.tsx --runInBand`
Expected: FAIL — `recordCompletion` nunca é chamado.

- [ ] **Step 3: Write minimal implementation**

Em `LessonFlowScreen.tsx`, adicione o import:

```typescript
import { LessonOutcomeService } from '../services/LessonOutcomeService';
```

Adicione o estado, junto dos outros `useState`:

```typescript
    const [confirmedAnswers, setConfirmedAnswers] = useState<Record<string, boolean>>({});
```

Substitua `handleContinue` por:

```typescript
    const handleContinue = async () => {
        if (!block || !currentStep || !canContinue) {
            return;
        }

        // A escolha vale no instante do "Continuar", não no toque: trocar de
        // alternativa antes de confirmar não penaliza. O valor local é
        // obrigatório — setConfirmedAnswers é assíncrono e no último passo o
        // estado ainda não conteria esta resposta.
        let nextConfirmed = confirmedAnswers;
        if (currentStep.step.type === 'multiple-choice') {
            const correct = selectedOptionId === currentStep.step.payload.correctOptionId;
            nextConfirmed = { ...confirmedAnswers, [currentStep.contract.id]: correct };
            setConfirmedAnswers(nextConfirmed);
        }

        if (!isLastStep) {
            setStepIndex((value) => value + 1);
            return;
        }

        await LessonOutcomeService.recordCompletion({
            block,
            nodeId,
            confirmedAnswers: nextConfirmed,
        });

        await JourneyProgressService.markNodeCompleted(nodeId);
        await JourneyProgressService.setCurrentNode(null);
        await JourneyProgressService.setResumableNode(undefined);
        router.replace('/(tabs)');
    };
```

- [ ] **Step 4: Run the full gate**

Run: `cd radiant-app && EXPO_NO_DOTENV=1 CI=1 npm run quality`
Expected: exit 0. Os dois testes que já existiam em `LessonFlowScreen.flow.test.tsx` continuam passando sem edição — se algum deles quebrar, a mudança está errada, não o teste.

- [ ] **Step 5: Commit**

```bash
git add radiant-app/src/features/lesson-flow/screens/LessonFlowScreen.tsx radiant-app/src/features/lesson-flow/screens/LessonFlowScreen.flow.test.tsx
git commit -m "feat(lesson-flow): tela registra conclusao antes de marcar o no"
```

---

### Task 4: Sinalizar o estado e medir a vitrine em device

**Files:**
- Modify: `docs/archive/EXECUTION_STATUS_2026-07-29.md` (§4, ressalva 1)
- Modify: `docs/superpowers/specs/2026-07-29-laco-xp-revisoes-design.md` (campo **Status:** do cabeçalho)

**Interfaces:** nenhuma — task de sinalização e evidência.

**Por que existe:** o contrato do `AGENTS.md` trata trabalho não sinalizado como não feito pelas próximas sessões. E a ressalva de vitrine só fecha com medição em device, não com teste verde.

**Fora da janela de edição:** build, instalação e Maestro **não** rodam dentro de um step do Loop. Feche o step de documentação antes, e execute a captura depois.

- [ ] **Step 1: Recapturar a vitrine**

Receita de build já registrada em `radiant-app/docs/evidence/2026-07-28-android-e2e-first-run.md`: exige `ANDROID_HOME`, `SENTRY_DISABLE_AUTO_UPLOAD=true` e as `EXPO_PUBLIC_*` do perfil **production** (não o de E2E — `APP_ENV=development` invalida a evidência).

O Gradle **não invalida cache por variável de ambiente**. Para forçar um bundle novo com as feature flags:

```bash
rm -rf radiant-app/android/app/build/generated/assets/createBundleReleaseJsAndAssets
```

Capture com a resolução corrigida — o screenshot nativo do emulador (1080×2424 = 2,24:1) excede o teto de 2:1 do Play e seria recusado:

```bash
adb shell wm size 1080x1920
```

Rode `.maestro/store-capture.yaml`, e devolva a resolução com `adb shell wm size reset` no fim. As capturas ficam em `~/.maestro/tests/<run>/.../takeScreenshot/` e sobrevivem entre sessões.

- [ ] **Step 2: Conferir os números**

Abra `shots/05-conquista` e `shots/06-progresso` e confirme que `XP total` e `REVISÕES` deixaram de ser zero. `XP total` deve ser 10 ou 18 por lição concluída (§5 da spec). `REVISÕES` só sai de zero **depois** que o SM-2 vencer o primeiro card — se a captura roda no mesmo instante da conclusão, zero ali continua correto, e a prova de revisão exige avançar o relógio ou uma segunda sessão.

- [ ] **Step 3: Atualizar a ressalva no status canônico**

Abra um step do Loop com os dois arquivos declarados. Na ressalva 1 da §4, troque "implementação pendente" pelo estado real: quais contadores foram medidos em device, com qual valor, e o que ficou pendente. No cabeçalho da spec, troque `Status: aprovada; implementação pendente` por `Status: implementada em <data>`.

Se `REVISÕES` continuar em zero por causa do relógio do SM-2, **diga isso** em vez de omitir — é a diferença entre "medido e correto" e "não medido".

- [ ] **Step 4: Validar e fechar**

Run: `loop validate --run <run-id>` e, com verde, `loop step finish`, `loop memory write`, `loop run close` — em chamadas separadas.

- [ ] **Step 5: Commit**

```bash
git add docs/archive/EXECUTION_STATUS_2026-07-29.md docs/superpowers/specs/2026-07-29-laco-xp-revisoes-design.md
git commit -m "docs(status): laco de XP e revisoes ligado, com evidencia em device"
```
