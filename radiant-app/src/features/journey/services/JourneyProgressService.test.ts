import AsyncStorage from '@react-native-async-storage/async-storage';
import { STORAGE_KEYS } from '../../../constants/storageKeys';
import { JOURNEY_PROGRESS_SCHEMA_VERSION, type JourneyProgressStore, type JourneySnapshot } from '../../../types/journey';
import type { ContentLesson, LearningTrack, LessonCatalogSummary } from '../../content/content.types';
import { LessonCatalogService } from '../../content/services/LessonCatalogService';
import { SpacedRepetitionService } from '../../spaced-repetition/services/SpacedRepetitionService';
import { JourneyProgressService } from './JourneyProgressService';
import { computeSegmentPrimaryProgress } from './JourneyUnitProgress';

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
const mockedSpacedRepetitionService = SpacedRepetitionService as jest.Mocked<typeof SpacedRepetitionService>;
const mockedLessonCatalogService = LessonCatalogService as jest.Mocked<typeof LessonCatalogService>;

const trackFixtures: LearningTrack[] = [
    {
        id: 'track-radiology-foundations',
        slug: 'radiology-foundations',
        title: 'Fundamentos',
        description: 'Base inicial.',
        lessonIds: ['foundation-1', 'foundation-2'],
    },
    {
        id: 'track-thorax-patterns',
        slug: 'thorax-patterns',
        title: 'Tórax',
        description: 'Padrões de tórax.',
        lessonIds: ['thorax-1', 'thorax-2'],
    },
];

const lessonSummaries: LessonCatalogSummary[] = [
    {
        id: 'foundation-1',
        slug: 'foundation-1',
        title: 'Densidade',
        difficulty: 'beginner',
        trackId: 'track-radiology-foundations',
        order: 1,
    },
    {
        id: 'foundation-2',
        slug: 'foundation-2',
        title: 'Incidência',
        difficulty: 'beginner',
        trackId: 'track-radiology-foundations',
        order: 2,
    },
    {
        id: 'thorax-1',
        slug: 'thorax-1',
        title: 'Pulmão',
        difficulty: 'beginner',
        trackId: 'track-thorax-patterns',
        order: 1,
    },
    {
        id: 'thorax-2',
        slug: 'thorax-2',
        title: 'Pleura',
        difficulty: 'intermediate',
        trackId: 'track-thorax-patterns',
        order: 2,
    },
];

function createLesson(id: string, title: string): ContentLesson {
    return {
        id,
        title,
        difficulty: 'beginner',
        questions: [
            {
                id: `${id}-q1`,
                type: 'multiple-choice',
                prompt: `Pergunta de ${title}`,
                options: [{ label: 'A' }, { label: 'B' }],
                correctAnswerIndex: 0,
                explanation: 'Explicação curta.',
            },
        ],
    };
}

const lessonsById: Record<string, ContentLesson> = {
    'foundation-1': createLesson('foundation-1', 'Densidade'),
    'foundation-2': createLesson('foundation-2', 'Incidência'),
    'thorax-1': createLesson('thorax-1', 'Pulmão'),
    'thorax-2': createLesson('thorax-2', 'Pleura'),
};

function readStoredJourney(): JourneyProgressStore {
    const lastPayload = storage.setItem.mock.calls
        .filter(([key]) => key === STORAGE_KEYS.JOURNEY_PROGRESS)
        .at(-1)?.[1];

    if (!lastPayload) {
        throw new Error('Journey progress was not persisted');
    }

    return JSON.parse(lastPayload) as JourneyProgressStore;
}

describe('JourneyProgressService', () => {
    const storageState: Record<string, string> = {};

    beforeEach(() => {
        jest.clearAllMocks();
        Object.keys(storageState).forEach((key) => {
            delete storageState[key];
        });

        storage.getItem.mockImplementation(async (key) => storageState[key] ?? null);
        storage.setItem.mockImplementation(async (key, value) => {
            storageState[key] = value;
        });
        storage.removeItem.mockImplementation(async (key) => {
            delete storageState[key];
        });

        mockedSpacedRepetitionService.getTrackedLessonIds.mockResolvedValue([]);
        mockedSpacedRepetitionService.getDueLessons.mockResolvedValue([]);
        mockedSpacedRepetitionService.getDueReviewSchedule.mockResolvedValue([]);
        mockedLessonCatalogService.listTracks.mockReturnValue(trackFixtures);
        mockedLessonCatalogService.listLessonSummaries.mockReturnValue(lessonSummaries);
        mockedLessonCatalogService.getLessonById.mockImplementation((lessonId) => lessonsById[lessonId] ?? null);
    });

    it('bootstraps the default catalog track into a versioned multi-track store', async () => {
        const snapshot = await JourneyProgressService.bootstrap();
        const stored = readStoredJourney();

        expect(snapshot.progress.activeTrackId).toBe('track-radiology-foundations');
        expect(snapshot.nextRecommendedNode?.id).toBe('node:foundation-1');
        expect(stored.schemaVersion).toBe(JOURNEY_PROGRESS_SCHEMA_VERSION);
        expect(stored.activeTrackId).toBe('track-radiology-foundations');
        expect(Object.keys(stored.tracks)).toEqual(['track-radiology-foundations']);
    });

    it('switches tracks while preserving progress already earned on another track', async () => {
        await JourneyProgressService.bootstrap();
        await JourneyProgressService.markNodeCompleted('node:foundation-1');

        const thoraxSnapshot = await JourneyProgressService.selectTrack('track-thorax-patterns');
        let stored = readStoredJourney();

        expect(thoraxSnapshot.progress.activeTrackId).toBe('track-thorax-patterns');
        expect(thoraxSnapshot.nextRecommendedNode?.id).toBe('node:thorax-1');
        expect(stored.activeTrackId).toBe('track-thorax-patterns');
        expect(stored.tracks['track-radiology-foundations'].completedNodeIds).toContain('node:foundation-1');
        expect(stored.tracks['track-thorax-patterns'].completedNodeIds).toEqual([]);

        const foundationSnapshot = await JourneyProgressService.selectTrack('track-radiology-foundations');
        stored = readStoredJourney();

        expect(foundationSnapshot.progress.activeTrackId).toBe('track-radiology-foundations');
        expect(foundationSnapshot.progress.completedNodeIds).toContain('node:foundation-1');
        expect(stored.activeTrackId).toBe('track-radiology-foundations');
    });

    it('migrates legacy single-track progress into the default track bucket', async () => {
        storageState[STORAGE_KEYS.JOURNEY_PROGRESS] = JSON.stringify({
            schemaVersion: 'journey-progress.v1',
            activeTrackId: 'learning-road-v2',
            currentUnitId: 'unit-radiology-foundations-1',
            currentNodeId: null,
            completedNodeIds: ['node:foundation-1'],
            pendingReviewNodeIds: [],
            lastUpdatedAt: '2026-04-09T12:00:00.000Z',
            lastCompletedNodeId: 'node:foundation-1',
            pendingSyncEvents: [],
        });

        const snapshot = await JourneyProgressService.bootstrap();
        const stored = readStoredJourney();

        expect(snapshot.progress.activeTrackId).toBe('track-radiology-foundations');
        expect(snapshot.progress.completedNodeIds).toContain('node:foundation-1');
        expect(stored.schemaVersion).toBe(JOURNEY_PROGRESS_SCHEMA_VERSION);
        expect(stored.tracks['track-radiology-foundations'].completedNodeIds).toContain('node:foundation-1');
    });

    it('persiste o passo retomável e o devolve na decisão sem quebrar o nó legado', async () => {
        const snapshot = await JourneyProgressService.setResumableNode('node:foundation-1', 2);
        const stored = readStoredJourney();

        expect(stored.tracks['track-radiology-foundations'].resumableStepIndex).toBe(2);
        expect(snapshot.nextDecision).toMatchObject({
            nodeId: 'node:foundation-1',
            reason: 'paused-lesson',
            resumeStepIndex: 2,
        });
        expect(snapshot.nextRecommendedNode?.id).toBe('node:foundation-1');
    });

    // Defeito 1 do E2E (2026-09-24), opção A da ADR de 2026-09-25: o concluído
    // vence o retomável e o atual. Reabrir uma lição concluída e sair no meio
    // não pode mudar a trilha: nem o status do nó, nem a contagem do
    // cabeçalho, nem a recomendação, nem a unidade em foco.
    describe('reabrir e abandonar uma lição concluída não muda a trilha', () => {
        let antes: JourneySnapshot;
        let depois: JourneySnapshot;

        beforeEach(async () => {
            await JourneyProgressService.bootstrap();
            antes = await JourneyProgressService.markNodeCompleted('node:foundation-1');

            // O que a LessonFlowScreen faz ao abrir a lição e ao sair no meio.
            await JourneyProgressService.setCurrentNode('node:foundation-1');
            await JourneyProgressService.setResumableNode('node:foundation-1');
            depois = await JourneyProgressService.setResumableNode('node:foundation-1', 2);
        });

        it('o nó continua concluído', () => {
            expect(nodeStatus(depois, 'node:foundation-1')).toBe('completed');
        });

        it('a contagem do cabeçalho não cai', () => {
            expect(computeSegmentPrimaryProgress(depois.track.units)).toEqual(
                computeSegmentPrimaryProgress(antes.track.units),
            );
        });

        it('a recomendação não volta para a lição concluída', () => {
            expect(depois.nextRecommendedNode?.id).toBe(antes.nextRecommendedNode?.id);
        });

        // A unidade em foco está em JourneyRecommendationService.test.ts: esta
        // trilha de teste tem uma unidade só, e o foco não teria para onde ir.
    });

    it('reabrir uma lição concluída não apaga a retomada de outra lição em andamento', async () => {
        await JourneyProgressService.bootstrap();
        await JourneyProgressService.markNodeCompleted('node:foundation-1');
        await JourneyProgressService.markNodeCompleted('node:checkpoint:foundations');
        await JourneyProgressService.setResumableNode('node:foundation-2', 1);

        await JourneyProgressService.setCurrentNode('node:foundation-1');
        await JourneyProgressService.setResumableNode('node:foundation-1');
        const depois = await JourneyProgressService.setResumableNode('node:foundation-1', 2);

        expect(depois.progress.resumableNodeId).toBe('node:foundation-2');
        expect(depois.progress.resumableStepIndex).toBe(1);
    });
});

function nodeStatus(snapshot: JourneySnapshot, nodeId: string): string | undefined {
    return snapshot.track.units.flatMap((unit) => unit.nodes).find((node) => node.id === nodeId)?.status;
}

describe('JourneyProgressService — avanço sequencial de trilha', () => {
    const storageState: Record<string, string> = {};

    beforeEach(() => {
        jest.clearAllMocks();
        Object.keys(storageState).forEach((key) => delete storageState[key]);

        storage.getItem.mockImplementation(async (key) => storageState[key] ?? null);
        storage.setItem.mockImplementation(async (key, value) => {
            storageState[key] = value;
        });
        storage.removeItem.mockImplementation(async (key) => {
            delete storageState[key];
        });

        mockedSpacedRepetitionService.getTrackedLessonIds.mockResolvedValue([]);
        mockedSpacedRepetitionService.getDueLessons.mockResolvedValue([]);
        mockedLessonCatalogService.listTracks.mockReturnValue(trackFixtures);
        mockedLessonCatalogService.listLessonSummaries.mockReturnValue(lessonSummaries);
        mockedLessonCatalogService.getLessonById.mockImplementation((lessonId) => lessonsById[lessonId] ?? null);
    });

    async function completeEveryNodeOfActiveTrack() {
        const snapshot = await JourneyProgressService.bootstrap();
        const nodeIds = snapshot.track.units.flatMap((unit) => unit.nodes.map((node) => node.id));

        for (const nodeId of nodeIds) {
            await JourneyProgressService.markNodeCompleted(nodeId);
        }

        return nodeIds;
    }

    it('permanece na trilha atual enquanto ela não terminou', async () => {
        const snapshot = await JourneyProgressService.bootstrap();
        await JourneyProgressService.markNodeCompleted(snapshot.track.units[0].nodes[0].id);

        const next = await JourneyProgressService.bootstrap();

        expect(next.progress.activeTrackId).toBe('track-radiology-foundations');
    });

    it('avança para a trilha seguinte quando a atual é concluída por inteiro', async () => {
        // É a promessa que a Galáxia faz por escrito: "a trilha seguinte abre
        // quando esta terminar". Antes de 2026-08-14 nada movia o aluno, porque
        // a trilha ativa era lida direto do store em vez de derivada da regra.
        await completeEveryNodeOfActiveTrack();

        const next = await JourneyProgressService.bootstrap();

        expect(next.progress.activeTrackId).toBe('track-thorax-patterns');
    });

    it('não avança por conclusão parcial, mesmo faltando um único nó', async () => {
        // O caso que separa "terminou" de "quase terminou". Uma regra que
        // avançasse com quase tudo feito deixaria conteúdo para trás em
        // silêncio, e o aluno nunca saberia o que pulou.
        const snapshot = await JourneyProgressService.bootstrap();
        const nodeIds = snapshot.track.units.flatMap((unit) => unit.nodes.map((node) => node.id));

        for (const nodeId of nodeIds.slice(0, -1)) {
            await JourneyProgressService.markNodeCompleted(nodeId);
        }

        const next = await JourneyProgressService.bootstrap();

        expect(next.progress.activeTrackId).toBe('track-radiology-foundations');
    });

    it('fica na última trilha quando todas terminaram, em vez de ficar sem trilha', async () => {
        await completeEveryNodeOfActiveTrack();
        await completeEveryNodeOfActiveTrack();

        const next = await JourneyProgressService.bootstrap();

        expect(next.progress.activeTrackId).toBe('track-thorax-patterns');
    });
});


// §8 do handoff de CloudKit: `backupNow()` existia sem caller de produção. O
// funil é `markNodeCompleted` — lição, revisão, checkpoint e recompensa passam
// todos por aqui —, então é aqui que "uma chamada por conclusão lógica" pode
// ser afirmada de uma vez só. Conclusão lógica é a que MUDA o conjunto de
// concluídos: guarda que recusa e toque repetido não são conclusão, e por isso
// não pagam backup.
describe('JourneyProgressService — backup best-effort na conclusão de nó', () => {
    const storageState: Record<string, string> = {};
    const { progressSyncService } = jest.requireMock('../../progress-sync/ProgressSyncService');
    const backupNow = progressSyncService.backupNow as jest.Mock;

    // Solta a microtask do backup, que é disparado sem `await` de propósito: a
    // conclusão não pode esperar a rede.
    const soltarBackup = () => new Promise((resolve) => setImmediate(resolve));

    beforeEach(() => {
        jest.clearAllMocks();
        Object.keys(storageState).forEach((key) => delete storageState[key]);

        storage.getItem.mockImplementation(async (key) => storageState[key] ?? null);
        storage.setItem.mockImplementation(async (key, value) => {
            storageState[key] = value;
        });
        storage.removeItem.mockImplementation(async (key) => {
            delete storageState[key];
        });

        mockedSpacedRepetitionService.getTrackedLessonIds.mockResolvedValue([]);
        mockedSpacedRepetitionService.getDueLessons.mockResolvedValue([]);
        mockedSpacedRepetitionService.getDueReviewSchedule.mockResolvedValue([]);
        mockedLessonCatalogService.listTracks.mockReturnValue(trackFixtures);
        mockedLessonCatalogService.listLessonSummaries.mockReturnValue(lessonSummaries);
        mockedLessonCatalogService.getLessonById.mockImplementation((lessonId) => lessonsById[lessonId] ?? null);

        backupNow.mockResolvedValue({ enabled: false, lastBackupAt: null, lastError: null });
    });

    it('dispara um backup por conclusão nova', async () => {
        await JourneyProgressService.bootstrap();
        await JourneyProgressService.markNodeCompleted('node:foundation-1');
        await soltarBackup();

        expect(backupNow).toHaveBeenCalledTimes(1);
        expect(backupNow).toHaveBeenCalledWith(expect.any(Number));
    });

    it('não dispara backup quando a guarda recusa um nó travado', async () => {
        await JourneyProgressService.bootstrap();
        await JourneyProgressService.markNodeCompleted('node:foundation-2');
        await soltarBackup();

        expect(readStoredJourney().tracks['track-radiology-foundations'].completedNodeIds)
            .not.toContain('node:foundation-2');
        expect(backupNow).not.toHaveBeenCalled();
    });

    it('não dispara backup quando o nó não existe', async () => {
        await JourneyProgressService.bootstrap();
        await JourneyProgressService.markNodeCompleted('node:inexistente');
        await soltarBackup();

        expect(backupNow).not.toHaveBeenCalled();
    });

    // P2-1 da revisão do PR #14. O gancho disparava só quando o nó ENTRAVA em
    // `completedNodeIds`, e uma revisão que vence DE NOVO já está lá desde a
    // primeira vez. A partir da segunda, a revisão atualizava a agenda SM-2 e
    // concedia XP sem backup, e a nuvem ficava velha indefinidamente até o aluno
    // concluir algum nó inédito.
    //
    // O discriminador correto já existia no estado: a fila
    // `pendingReviewNodeIds`. Revisão legítima sai da fila — mudança real.
    // Toque repetido não sai de nada, porque já saiu.

    /** Deixa a revisão de `foundation-1` concluída uma vez e vencida de novo. */
    async function revisaoVencidaDeNovo() {
        mockedSpacedRepetitionService.getDueLessons.mockResolvedValue(['foundation-1']);
        await JourneyProgressService.bootstrap();
        await JourneyProgressService.markNodeCompleted('node:foundation-1');
        await JourneyProgressService.markNodeCompleted('node:review:foundation-1');
        await soltarBackup();

        // Vence outra vez: a hidratação repõe a fila a partir das lições
        // devidas, independentemente do que já foi concluído.
        const snapshot = await JourneyProgressService.bootstrap();
        expect(snapshot.progress.completedNodeIds).toContain('node:review:foundation-1');
        expect(snapshot.progress.pendingReviewNodeIds).toContain('node:review:foundation-1');
        backupNow.mockClear();
    }

    it('dispara backup ao concluir uma revisão vencida que já fora concluída antes', async () => {
        await revisaoVencidaDeNovo();

        await JourneyProgressService.markNodeCompleted('node:review:foundation-1');
        await soltarBackup();

        expect(backupNow).toHaveBeenCalledTimes(1);
    });

    it('não duplica o backup ao repetir a conclusão da mesma revisão', async () => {
        await revisaoVencidaDeNovo();
        await JourneyProgressService.markNodeCompleted('node:review:foundation-1');
        await soltarBackup();

        // Concluir a revisão reagenda o cartão: a lição deixa de estar vencida,
        // e a hidratação seguinte não a repõe na fila. Sem isto o dublê
        // afirmaria que ela vence para sempre, e o segundo toque pareceria uma
        // revisão nova — cenário que o SM-2 real não produz.
        mockedSpacedRepetitionService.getDueLessons.mockResolvedValue([]);
        backupNow.mockClear();

        // Segundo toque: já concluído E já fora da fila. Nada muda.
        await JourneyProgressService.markNodeCompleted('node:review:foundation-1');
        await soltarBackup();

        expect(backupNow).not.toHaveBeenCalled();
    });

    it('a conclusão da revisão não espera a rede', async () => {
        await revisaoVencidaDeNovo();
        backupNow.mockReturnValue(new Promise(() => undefined));

        const snapshot = await JourneyProgressService.markNodeCompleted('node:review:foundation-1');

        expect(snapshot.progress.completedNodeIds).toContain('node:review:foundation-1');
        expect(backupNow).toHaveBeenCalledTimes(1);
    });

    it('não duplica o backup quando a mesma conclusão é repetida', async () => {
        await JourneyProgressService.bootstrap();
        await JourneyProgressService.markNodeCompleted('node:foundation-1');
        await JourneyProgressService.markNodeCompleted('node:foundation-1');
        await soltarBackup();

        expect(backupNow).toHaveBeenCalledTimes(1);
    });

    it('conclui o nó mesmo quando o backup remoto falha', async () => {
        backupNow.mockRejectedValue(new Error('CloudKit fora do ar'));
        const erro = jest.spyOn(console, 'error').mockImplementation(() => undefined);

        await JourneyProgressService.bootstrap();
        const snapshot = await JourneyProgressService.markNodeCompleted('node:foundation-1');
        await soltarBackup();

        expect(snapshot.progress.completedNodeIds).toContain('node:foundation-1');
        expect(readStoredJourney().tracks['track-radiology-foundations'].completedNodeIds)
            .toContain('node:foundation-1');
        erro.mockRestore();
    });

    it('não espera a rede: a conclusão resolve com o backup ainda pendente', async () => {
        backupNow.mockReturnValue(new Promise(() => undefined));

        await JourneyProgressService.bootstrap();
        const snapshot = await JourneyProgressService.markNodeCompleted('node:foundation-1');

        expect(snapshot.progress.completedNodeIds).toContain('node:foundation-1');
        expect(backupNow).toHaveBeenCalledTimes(1);
    });
});
