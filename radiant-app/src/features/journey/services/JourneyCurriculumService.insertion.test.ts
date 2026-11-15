import { JourneyCurriculumService } from './JourneyCurriculumService';
import { LessonCatalogService } from '../../content/services/LessonCatalogService';
import { JourneyDefinitionService } from './JourneyDefinitionService';
import { JourneyProgressService } from './JourneyProgressService';
import { currentUnit } from '../../profile/screens/ProfileScreen';
import { completedCelebrationUnits } from '../components/UnitCompleteCelebration';
import type { JourneyNodeStatus, JourneySnapshot } from '../../../types/journey';

/**
 * O percurso da Estude com uma unidade inserida atrás do aluno. Regra em
 * `docs/evidence/2026-11-13-rtg-2026-expansao/motor.md`: a inserida abre sem
 * virar a ativa, e Home, Estude e Perfil apontam para a mesma trilha.
 */

jest.mock('@react-native-async-storage/async-storage', () => require('@react-native-async-storage/async-storage/jest/async-storage-mock'));
jest.mock('@expo/vector-icons/MaterialIcons', () => 'MaterialIcons');
jest.mock('react-native-reanimated', () => require('react-native-reanimated/mock'));
jest.mock('expo-router', () => ({ router: { push: jest.fn() }, useFocusEffect: jest.fn() }));

jest.mock('../../content/services/LessonCatalogService', () => ({
    LessonCatalogService: { listTracks: jest.fn() },
}));

jest.mock('./JourneyDefinitionService', () => ({
    JourneyDefinitionService: { getTrackDefinition: jest.fn((trackId: string) => ({ id: trackId })) },
}));

jest.mock('./JourneyProgressService', () => ({
    JourneyProgressService: { getSnapshot: jest.fn() },
}));

const mockedCatalog = LessonCatalogService as jest.Mocked<typeof LessonCatalogService>;
const mockedProgress = JourneyProgressService as jest.Mocked<typeof JourneyProgressService>;

function track(id: string) {
    return { id, slug: id, title: id, description: '', lessonIds: [] } as never;
}

function snapshot(trackId: string, statuses: JourneyNodeStatus[], nextRecommendedNodeId?: string): JourneySnapshot {
    return {
        track: {
            id: trackId,
            title: trackId,
            initialUnitId: `${trackId}-unit`,
            units: [{
                id: `${trackId}-unit`,
                title: `${trackId} — unidade`,
                nodes: statuses.map((status, index) => ({
                    id: `${trackId}-node-${index}`,
                    unitId: `${trackId}-unit`,
                    type: 'lesson',
                    title: `Lição ${index + 1}`,
                    status,
                })),
            }],
        },
        nextRecommendedNode: nextRecommendedNodeId ? { id: nextRecommendedNodeId } : null,
    } as never;
}

/** Concluiu `a` e `b`, está no meio de `c`; `nova` entrou entre `b` e `c`. */
function alunoNoMeioDeC(recomendado: string | null = 'c-node-1') {
    mockedCatalog.listTracks.mockReturnValue(['a', 'b', 'nova', 'c', 'd'].map(track));
    const map: Record<string, JourneySnapshot> = {
        a: snapshot('a', ['completed', 'completed']),
        b: snapshot('b', ['completed', 'completed']),
        nova: snapshot('nova', ['available', 'locked'], 'nova-node-0'),
        c: snapshot('c', ['completed', 'available'], recomendado ?? undefined),
        d: snapshot('d', ['available', 'locked'], 'd-node-0'),
    };
    mockedProgress.getSnapshot.mockImplementation(async (definition) => map[(definition as { id: string }).id]);
}

describe('JourneyCurriculumService com unidade inserida atrás do aluno', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        (JourneyDefinitionService.getTrackDefinition as jest.Mock).mockImplementation((trackId: string) => ({ id: trackId }));
    });

    it('mantém abertas as concluídas e a em andamento, abre a inserida e não a torna ativa', async () => {
        alunoNoMeioDeC();

        const trail = await JourneyCurriculumService.getCurriculumTrail();
        const byId = Object.fromEntries(trail.segments.map((segment) => [segment.trackId, segment]));

        expect(byId.a.unlocked && byId.b.unlocked).toBe(true);
        expect(byId.c.unlocked).toBe(true);
        expect(byId.c.units[0].nodes.map((node) => node.status)).toEqual(['completed', 'available']);
        expect(byId.nova.unlocked).toBe(true);
        expect(byId.nova.units[0].nodes[0].status).toBe('available');
        expect(byId.d.unlocked).toBe(false);
        expect(trail.activeTrackId).toBe('c');
        expect(trail.recommendedNodeId).toBe('c-node-1');
        // Abrir não é concluir: a comemoração de unidade só vê as concluídas.
        expect(completedCelebrationUnits(trail.segments).map((unit) => unit.id)).toEqual(['a', 'b']);
    });

    it('o Perfil mostra a unidade da trilha ativa mesmo sem nó recomendado', async () => {
        // Sem `recommendedNodeId` o Perfil caía na sua cópia da régua
        // ("primeira aberta e não concluída") e mostrava a inserida.
        alunoNoMeioDeC(null);

        const trail = await JourneyCurriculumService.getCurriculumTrail();

        expect(trail.activeTrackId).toBe('c');
        expect(currentUnit(trail)?.id).toBe('c-unit');
    });
});
