import AsyncStorage from '@react-native-async-storage/async-storage';
import { STORAGE_KEYS } from '../../../constants/storageKeys';
import type { JourneyProgressStore } from '../../../types/journey';
import type { ContentLesson, LearningTrack, LessonCatalogSummary } from '../../content/content.types';
import { LessonCatalogService } from '../../content/services/LessonCatalogService';
import { SpacedRepetitionService } from '../../spaced-repetition/services/SpacedRepetitionService';
import { JourneyDefinitionService } from './JourneyDefinitionService';
import { JourneyProgressService } from './JourneyProgressService';
import { isRequiredProgressionNode } from './trackCompletion';

/**
 * Unidade inserida no meio do percurso, pelo serviço de progresso com storage
 * simulado (mesmo arranjo de `JourneyProgressService.test.ts`). Regra em
 * `docs/evidence/2026-11-13-rtg-2026-expansao/motor.md`.
 */

jest.mock('@react-native-async-storage/async-storage', () => ({
    getItem: jest.fn(),
    setItem: jest.fn(),
    removeItem: jest.fn(),
}));

jest.mock('../../spaced-repetition/services/SpacedRepetitionService', () => ({
    SpacedRepetitionService: {
        getTrackedLessonIds: jest.fn(),
        getDueLessons: jest.fn(),
        getDueReviewSchedule: jest.fn(),
        getReviewSchedule: jest.fn(),
    },
}));

jest.mock('../../content/services/LessonCatalogService', () => ({
    LessonCatalogService: {
        listTracks: jest.fn(),
        listLessonSummaries: jest.fn(),
        getLessonById: jest.fn(),
    },
}));

jest.mock('../../progress-sync/ProgressSyncService', () => ({
    progressSyncService: { backupNow: jest.fn() },
}));

const storage = AsyncStorage as jest.Mocked<typeof AsyncStorage>;
const mockedSpacedRepetition = SpacedRepetitionService as jest.Mocked<typeof SpacedRepetitionService>;
const mockedCatalog = LessonCatalogService as jest.Mocked<typeof LessonCatalogService>;

const TRACK_IDS = ['trilha-a', 'trilha-b', 'trilha-nova', 'trilha-c'];

function lessonIdsOf(trackId: string): string[] {
    return [`${trackId}-1`, `${trackId}-2`];
}

const tracks: Record<string, LearningTrack> = Object.fromEntries(TRACK_IDS.map((id) => [id, {
    id, slug: id, title: id, description: '', lessonIds: lessonIdsOf(id),
}]));

const summaries: LessonCatalogSummary[] = TRACK_IDS.flatMap((trackId) => lessonIdsOf(trackId).map((id, index) => ({
    id, slug: id, title: id, difficulty: 'beginner' as const, trackId, order: index + 1,
})));

function lesson(id: string): ContentLesson {
    return {
        id,
        title: id,
        difficulty: 'beginner',
        questions: [{
            id: `${id}-q1`, type: 'multiple-choice', prompt: `Pergunta ${id}`,
            options: [{ label: 'A' }, { label: 'B' }], correctAnswerIndex: 0, explanation: 'Curta.',
        }],
    };
}

const ANTES = ['trilha-a', 'trilha-b', 'trilha-c'];
const DEPOIS = TRACK_IDS;

function catalogo(order: string[]) {
    mockedCatalog.listTracks.mockReturnValue(order.map((id) => tracks[id]));
}

function nodesOf(trackId: string) {
    return JourneyDefinitionService.getTrackDefinition(trackId).units.flatMap((unit) => unit.nodes);
}

function readStore(): JourneyProgressStore {
    return JSON.parse(storageState[STORAGE_KEYS.JOURNEY_PROGRESS]) as JourneyProgressStore;
}

const storageState: Record<string, string> = {};

/** Aluno da versão anterior: concluiu A e B e está no meio de C, com retomada salva. */
async function alunoNoMeioDeC() {
    catalogo(ANTES);
    for (const trackId of ['trilha-a', 'trilha-b']) {
        for (const node of nodesOf(trackId).filter(isRequiredProgressionNode)) {
            await JourneyProgressService.markNodeCompleted(node.id);
        }
    }
    const [primeiraDeC, segundaDeC] = nodesOf('trilha-c').filter((node) => node.type === 'lesson');
    await JourneyProgressService.markNodeCompleted(primeiraDeC.id);
    await JourneyProgressService.setCurrentNode(segundaDeC.id);
    await JourneyProgressService.setResumableNode(segundaDeC.id, 2);
    expect((await JourneyProgressService.getSnapshot()).track.id).toBe('trilha-c');
    return segundaDeC.id;
}

describe('JourneyProgressService com unidade inserida atrás do aluno', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        Object.keys(storageState).forEach((key) => delete storageState[key]);
        storage.getItem.mockImplementation(async (key) => storageState[key] ?? null);
        storage.setItem.mockImplementation(async (key, value) => { storageState[key] = value; });
        storage.removeItem.mockImplementation(async (key) => { delete storageState[key]; });
        mockedSpacedRepetition.getTrackedLessonIds.mockResolvedValue([]);
        mockedSpacedRepetition.getDueLessons.mockResolvedValue([]);
        mockedSpacedRepetition.getDueReviewSchedule.mockResolvedValue([]);
        mockedSpacedRepetition.getReviewSchedule.mockResolvedValue([]);
        mockedCatalog.listLessonSummaries.mockReturnValue(summaries);
        mockedCatalog.getLessonById.mockImplementation((id) => lesson(id));
    });

    it('a trilha ativa não volta para a unidade inserida atrás do aluno', async () => {
        await alunoNoMeioDeC();
        catalogo(DEPOIS);

        const snapshot = await JourneyProgressService.getSnapshot();

        expect(snapshot.track.id).toBe('trilha-c');
        // Validade: o destaque continua sendo a segunda lição de C, a retomada.
        expect(snapshot.nextRecommendedNode?.id).toBe(nodesOf('trilha-c').filter((node) => node.type === 'lesson')[1].id);
    });

    it('cursor e retomada de um nó da inserida vão para ela, e a retomada da ativa fica intacta', async () => {
        const retomadaDeC = await alunoNoMeioDeC();
        catalogo(DEPOIS);
        const primeiraDaNova = nodesOf('trilha-nova').find((node) => node.type === 'lesson')!.id;

        await JourneyProgressService.setCurrentNode(primeiraDaNova);
        await JourneyProgressService.setResumableNode(primeiraDaNova, 1);

        const store = readStore();
        expect(store.tracks['trilha-c'].resumableNodeId).toBe(retomadaDeC);
        expect(store.tracks['trilha-c'].resumableStepIndex).toBe(2);
        expect(store.tracks['trilha-c'].currentNodeId).toBe(retomadaDeC);
        expect(store.tracks['trilha-nova'].resumableNodeId).toBe(primeiraDaNova);
        expect(store.tracks['trilha-nova'].resumableStepIndex).toBe(1);
        expect(store.tracks['trilha-nova'].currentNodeId).toBe(primeiraDaNova);
    });
});
