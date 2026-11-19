import { writeFileSync } from 'fs';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { LearningActivityV2 } from '../../../types/learningActivity';
import { STORAGE_KEYS } from '../../../constants/storageKeys';
import { LessonOutcomeService } from '../../lesson-flow/services/LessonOutcomeService';
import { assessmentAttemptRepository } from '../../student-checkpoints/AssessmentAttemptRepository';
import { ItemReviewCoordinator, reviewCatalog } from '../services/ItemReviewService';
import { ItemReviewRepository, itemReviewRepository } from './ItemReviewRepository';
import { memoryStorage } from './itemReviewBenchFixtures';

// Trilha dobrada (fase B): mede o valor único `@radiant:item_review_v1` com uma
// trilha sintética de 310 aulas (e até 500, para achar onde cruza 1,9 MiB).
// Fora da suíte, como o vizinho `capacity.bench.ts`; roda com
//   BENCH_OUT=<arquivo.json> npx jest --runInBand \
//     --testMatch '**/*.doubledTrail.bench.ts' src/features/spaced-repetition
// Caminho real: `LessonOutcomeService.recordActivityCompletion` (tentativas de
// estudo e cartões), `AssessmentAttemptRepository.submit` (conferência, e a
// recuperação semeada na reprovação) e `ItemReviewCoordinator.loadQueue`
// (o `reconcile`), sobre o AsyncStorage de teste. Sintéticos: o catálogo (mock de
// `ProductionCurriculumCatalog` com os mesmos formatos de id do lote rtg-2026) e
// o snapshot da jornada. Mede o Node, não o CursorWindow do Android.

const LIMIT_BYTES = Math.round(1.9 * 1024 * 1024);
const MAX_LESSONS = 500;
const STEP = 10;
const TARGET = 310;

const mockCatalogData = {
    activities: new Map<string, unknown>(), checkpoints: new Map<string, unknown>(),
    batches: new Map<string, unknown>(), recoveries: new Map<string, unknown>(),
};
jest.mock('../../student-checkpoints/ProductionCurriculumCatalog', () => ({
    ProductionCurriculumCatalog: {
        getActivityById: (id: string) => mockCatalogData.activities.get(id) ?? null,
        getCheckpointByNodeId: (id: string) => mockCatalogData.checkpoints.get(id) ?? null,
        getBatchByCheckpointNodeId: (id: string) => mockCatalogData.batches.get(id) ?? null,
        getRecoveryByCheckpointNodeId: (id: string) => mockCatalogData.recoveries.get(id) ?? null,
    },
}));
// eslint-disable-next-line @typescript-eslint/no-require-imports -- fábrica do jest.mock, como nos testes vizinhos
jest.mock('@react-native-async-storage/async-storage', () => require('@react-native-async-storage/async-storage/jest/async-storage-mock'));
jest.mock('../../gamification/services/GamificationService', () => ({
    GamificationService: { recordQuizCompletion: jest.fn().mockResolvedValue({ snapshot: { totalXp: 18, streakDays: 1, lastActiveDate: null },
        award: { baseXp: 10, bonusXp: 8, totalXpAwarded: 18, reason: 'quiz_complete' } }) },
}));
jest.mock('../../spaced-repetition/services/SpacedRepetitionService', () => ({
    SpacedRepetitionService: { recordQuizResult: jest.fn(), getCardState: jest.fn() },
}));
jest.mock('../../daily-goal/services/DailyGoalService', () => ({ DailyGoalService: { recordXp: jest.fn() } }));
jest.mock('../../hearts/HeartsRepository', () => ({ heartsRepository: { rewardReview: jest.fn().mockResolvedValue(undefined) } }));
jest.mock('../../journey/services/JourneyProgressService', () => ({
    JourneyProgressService: { getSnapshotForNode: jest.fn((nodeId: string) => Promise.resolve({
        track: { id: 'track-1', title: 'Trilha', initialUnitId: 'unit-1', units: [{ id: 'unit-1', title: 'Unidade',
            nodes: [{ id: nodeId, unitId: 'unit-1', type: 'lesson', title: 'Aula', lessonId: nodeId, blockId: nodeId, status: 'available' }] }] },
        progress: { schemaVersion: 'journey-progress.v2', activeTrackId: 'track-1', currentUnitId: 'unit-1', currentNodeId: null,
            completedNodeIds: [], pendingReviewNodeIds: [], lastUpdatedAt: '2026-10-01T00:00:00.000Z', pendingSyncEvents: [] },
        nextRecommendedNode: null, completedCount: 0, dueReviewCount: 0, recommendationReason: 'next-new' })) },
}));
jest.mock('../../sync/SyncQueueService', () => ({
    SyncQueueService: { enqueueLessonProgressFromQuizResult: jest.fn(), enqueueReviewCard: jest.fn(), flush: jest.fn() },
}));
jest.mock('../../progress/services/LearningAttemptsRepository', () => ({ LearningAttemptsRepository: { append: jest.fn() } }));
jest.mock('../../mastery/repositories/LearningEvidenceRepository', () => ({ LearningEvidenceRepository: { append: jest.fn() } }));
jest.mock('../../spaced-repetition/services/CompetencyReviewService', () => ({ CompetencyReviewService: { observeExposure: jest.fn(), recordReview: jest.fn() } }));

type Shape = 'A' | 'B' | 'C';
const TYPES: Record<'A' | 'B', [string, string][]> = {
    // [tipo, evidenceKind], na ordem i1..i5 do lote real (i1 recall, i2-i4 guiada, i5 transferência).
    A: [['multiple-choice', 'independent-recall'], ['multiple-choice', 'guided-practice'], ['matching', 'guided-practice'],
        ['ordering', 'guided-practice'], ['case-decision', 'applied-transfer']],
    B: [['case-decision', 'independent-recall'], ['matching', 'guided-practice'], ['ordering', 'guided-practice'],
        ['categorize', 'guided-practice'], ['case-decision', 'applied-transfer']],
};
const pad = (value: number) => String(value).padStart(2, '0');
const question = (id: string, competency: string) => ({
    id, competencyIds: [competency], prompt: `Pergunta ${id}`,
    options: ['a', 'b', 'c', 'd'].map(letter => ({ id: `option:${id}:${letter}`, label: `Alternativa ${letter} da pergunta.` })),
    correctOptionId: `option:${id}:c`, feedback: { correct: 'Correto.', incorrect: 'Ainda não.' },
});

function registerLesson(index: number, shape: Shape) {
    const module = `rtg-2026:m${pad(Math.floor(index / 6) + 1)}`;
    const slug = `aula-${pad((index % 6) + 1)}`;
    const base = `${module}:${slug}`;
    const contentVersion = `rtg-2026-m${pad(Math.floor(index / 6) + 1)}-v1`;
    const competency = `competency:${base}`;
    const activityId = `activity:${base}`;
    const nodeId = `node:checkpoint:${base}`;
    const kinds = TYPES[shape === 'B' ? 'B' : 'A'];
    const steps = kinds.map(([type, evidenceKind], i) => ({ kind: 'interaction', interaction: {
        id: `interaction:${base}:i${i + 1}`, competencyIds: [competency], evidenceKind, type,
        feedback: { correct: 'Correto.' }, payload: { prompt: 'x', options: [], correctOptionId: '' } } }));
    const activity = { id: activityId, competencyIds: [competency], provenance: { contentVersion }, steps };
    const items = ['c1', 'c2'].map(c => question(`checkpoint-item:${base}:${c}`, competency));
    mockCatalogData.activities.set(activityId, activity);
    mockCatalogData.checkpoints.set(nodeId, { id: nodeId.slice(5), items });
    mockCatalogData.batches.set(nodeId, { batchId: `batch:${module}`, contentVersion, activities: [activity] });
    mockCatalogData.recoveries.set(nodeId, { competencyId: competency,
        guided: question(`recovery-item:${base}:guiada`, competency), transfer: question(`recovery-item:${base}:transferencia`, competency) });
    return { activity: activity as unknown as LearningActivityV2, nodeId, activityId, contentVersion, competency, items, module, base };
}

async function runLesson(index: number, shape: Shape) {
    const lesson = registerLesson(index, shape);
    const answeredAt = new Date(Date.UTC(2026, 9, 1) + index * 3_600_000);
    await LessonOutcomeService.recordActivityCompletion({
        activity: lesson.activity, nodeId: `node:${lesson.activityId}`, attemptId: `study:${lesson.base}:${String(index).padStart(6, '0')}`,
        confirmedAnswers: Object.fromEntries(lesson.activity.steps.map(step => [step.kind === 'interaction' ? step.interaction.id : '', true])),
        answeredAt,
    });
    const outcome = shape === 'C' ? 'incorrect' as const : 'correct' as const;
    await assessmentAttemptRepository.submit({
        operationId: `operation:${lesson.base}`, checkpointId: lesson.nodeId.slice(5), flowId: 'flow:assessment',
        attemptId: `attempt:${lesson.base}:${String(index).padStart(6, '0')}`, checkpointDefinitionId: `definition:${lesson.base}`,
        unitId: `unit:${lesson.module}`, journeyNodeId: lesson.nodeId, activityId: `batch:${lesson.module}`,
        contentVersion: lesson.contentVersion, curriculumKind: 'v2', committedAt: new Date(answeredAt.getTime() + 60_000).toISOString(),
        itemOutcomes: lesson.items.map(item => ({ itemId: item.id, activityId: lesson.activityId, competencyIds: [lesson.competency],
            evidenceKind: 'independent-recall' as const, outcome, isCriticalError: false, hintUsed: false, durationBucket: 'unknown' as const })),
    }, [lesson.activity]);
}

const bytes = (raw: string | null) => Buffer.byteLength(raw ?? '', 'utf8');
const mib = (value: number) => Math.round((value / 1048576) * 1000) / 1000;
function describeStore(raw: string) {
    const parsed = JSON.parse(raw) as { cards: Record<string, unknown>; attempts: unknown[] };
    const total = bytes(raw);
    return { cards: Object.keys(parsed.cards).length, attempts: parsed.attempts.length, bytes: total, mib: mib(total),
        marginMib: mib(LIMIT_BYTES - total), over: total > LIMIT_BYTES };
}
/** O `reconcile` real, no snapshot dado: o coordenador roda `loadQueue` sobre um storage próprio. */
async function reconciled(raw: string) {
    const storage = memoryStorage(raw);
    const coordinator = new ItemReviewCoordinator(new ItemReviewRepository(storage), reviewCatalog);
    await coordinator.loadQueue([], new Date('2027-06-01T00:00:00.000Z'));
    return describeStore(storage.data.get(STORAGE_KEYS.ITEM_REVIEW) as string);
}

jest.setTimeout(3_000_000);

const results: Record<string, unknown> = {};
it.each(['A', 'B', 'C'] as Shape[])('caso %s: store de revisão com a trilha de 310 aulas', async shape => {
    await AsyncStorage.clear();
    await itemReviewRepository.clear();
    const snapshots = new Map<number, string>();
    for (let index = 0; index < MAX_LESSONS; index += 1) {
        await runLesson(index, shape);
        jest.clearAllMocks(); // o mock do AsyncStorage guardaria cada valor gravado (~MB) nos argumentos das chamadas
        if ((index + 1) % STEP === 0 || index + 1 === TARGET || index + 1 === 157) {
            snapshots.set(index + 1, await AsyncStorage.getItem(STORAGE_KEYS.ITEM_REVIEW) as string);
        }
    }
    const curve: { lessons: number; before: ReturnType<typeof describeStore>; after: ReturnType<typeof describeStore> }[] = [];
    for (const [lessons, raw] of [...snapshots].sort((a, b) => a[0] - b[0])) {
        curve.push({ lessons, before: describeStore(raw), after: await reconciled(raw) });
    }
    const at310 = curve.find(point => point.lessons === TARGET)!;
    const firstOver = (key: 'before' | 'after') => curve.find(point => point[key].over)?.lessons ?? null;
    const phantom = (lessons: number) => (curve.find(point => point.lessons === lessons)!.before.cards - curve.find(point => point.lessons === lessons)!.after.cards) / lessons;
    results[shape] = {
        at310, firstLessonsOverBefore: firstOver('before'), firstLessonsOverAfter: firstOver('after'),
        orphanCardsPerLesson: phantom(TARGET),
        assessmentAttemptsKeyBytesAt500: bytes(await AsyncStorage.getItem(STORAGE_KEYS.ASSESSMENT_ATTEMPTS)),
        curve: curve.map(point => ({ lessons: point.lessons, beforeBytes: point.before.bytes, afterBytes: point.after.bytes,
            beforeCards: point.before.cards, afterCards: point.after.cards })),
    };
    expect(at310.before.cards).toBeGreaterThan(0);
});

afterAll(() => {
    const report = { measuredAt: new Date().toISOString(), node: process.version, limitBytes: LIMIT_BYTES, results };
    if (process.env.BENCH_OUT) writeFileSync(process.env.BENCH_OUT, `${JSON.stringify(report, null, 2)}\n`);
    const summary = Object.fromEntries(Object.entries(results).map(([shape, value]) => {
        const { curve: _curve, ...rest } = value as { curve: unknown } & Record<string, unknown>;
        return [shape, rest];
    }));
    console.log(JSON.stringify(summary, null, 2));
});
