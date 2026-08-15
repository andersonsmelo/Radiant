import { JourneyCurriculumService } from './JourneyCurriculumService';
import { LessonCatalogService } from '../../content/services/LessonCatalogService';
import { JourneyDefinitionService } from './JourneyDefinitionService';
import { JourneyProgressService } from './JourneyProgressService';
import type { JourneyNodeStatus, JourneySnapshot } from '../../../types/journey';

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

function track(id: string, title: string, order?: number) {
  return { id, slug: id, title, description: '', lessonIds: [], order } as never;
}

function snapshot(
  trackId: string,
  title: string,
  statuses: JourneyNodeStatus[],
  nextRecommendedNodeId?: string,
): JourneySnapshot {
  return {
    track: {
      id: trackId,
      title,
      initialUnitId: `${trackId}-unit`,
      units: [
        {
          id: `${trackId}-unit`,
          title: `${title} — unidade`,
          nodes: statuses.map((status, index) => ({
            id: `${trackId}-node-${index}`,
            unitId: `${trackId}-unit`,
            type: 'lesson',
            title: `Lição ${index + 1}`,
            status,
          })),
        },
      ],
    },
    nextRecommendedNode: nextRecommendedNodeId ? { id: nextRecommendedNodeId } : undefined,
  } as never;
}

function snapshotsFor(map: Record<string, JourneySnapshot>) {
  mockedProgress.getSnapshot.mockImplementation(async (definition) =>
    map[(definition as { id: string }).id],
  );
}

describe('JourneyCurriculumService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (JourneyDefinitionService.getTrackDefinition as jest.Mock).mockImplementation(
      (trackId: string) => ({ id: trackId }),
    );
  });

  it('devolve percurso vazio quando não há catálogo, sem lançar', async () => {
    mockedCatalog.listTracks.mockReturnValue([]);

    await expect(JourneyCurriculumService.getCurriculumTrail()).resolves.toEqual({ segments: [] });
  });

  it('encadeia as trilhas na ordem do percurso, e não na ordem do catálogo', async () => {
    // `sortTracks` já resolve isto; o teste existe para garantir que este
    // serviço a consome em vez de reordenar por conta própria.
    mockedCatalog.listTracks.mockReturnValue([
      track('b', 'Segunda', 2),
      track('a', 'Primeira', 1),
    ] as never);
    snapshotsFor({
      a: snapshot('a', 'Primeira', ['available']),
      b: snapshot('b', 'Segunda', ['available']),
    });

    const { segments } = await JourneyCurriculumService.getCurriculumTrail();

    expect(segments.map((segment) => segment.trackId)).toEqual(['a', 'b']);
  });

  it('mantém bloqueada a trilha seguinte enquanto a anterior não fecha', async () => {
    // O snapshot de cada trilha é computado isoladamente, então a primeira
    // lição da trilha seguinte lê como `available` — ela é a primeira DAQUELA
    // trilha. No percurso contínuo isso mentiria.
    mockedCatalog.listTracks.mockReturnValue([
      track('a', 'Primeira', 1),
      track('b', 'Segunda', 2),
    ] as never);
    snapshotsFor({
      a: snapshot('a', 'Primeira', ['completed', 'available']),
      b: snapshot('b', 'Segunda', ['available', 'available']),
    });

    const { segments } = await JourneyCurriculumService.getCurriculumTrail();

    expect(segments[1].unlocked).toBe(false);
    expect(segments[1].units[0].nodes.map((node) => node.status)).toEqual(['locked', 'locked']);
  });

  it('abre a trilha seguinte quando todos os nós da anterior estão concluídos', async () => {
    mockedCatalog.listTracks.mockReturnValue([
      track('a', 'Primeira', 1),
      track('b', 'Segunda', 2),
    ] as never);
    snapshotsFor({
      a: snapshot('a', 'Primeira', ['completed', 'completed']),
      b: snapshot('b', 'Segunda', ['available'], 'b-node-0'),
    });

    const { segments, recommendedNodeId } = await JourneyCurriculumService.getCurriculumTrail();

    expect(segments[0].completed).toBe(true);
    expect(segments[1].unlocked).toBe(true);
    expect(segments[1].units[0].nodes[0].status).toBe('available');
    expect(recommendedNodeId).toBe('b-node-0');
  });

  it('preserva conclusões antigas dentro de uma trilha fechada', async () => {
    // Uma trilha pode estar atrás do cadeado e conter conclusões anteriores.
    // Rebaixá-las reescreveria o passado do aluno.
    mockedCatalog.listTracks.mockReturnValue([
      track('a', 'Primeira', 1),
      track('b', 'Segunda', 2),
    ] as never);
    snapshotsFor({
      a: snapshot('a', 'Primeira', ['available']),
      b: snapshot('b', 'Segunda', ['completed', 'available']),
    });

    const { segments } = await JourneyCurriculumService.getCurriculumTrail();

    expect(segments[1].unlocked).toBe(false);
    expect(segments[1].units[0].nodes.map((node) => node.status)).toEqual(['completed', 'locked']);
  });

  it('não trata trilha sem nó nenhum como concluída', async () => {
    // Um catálogo que ainda não produziu conteúdo abriria a trilha seguinte de
    // graça, e o cadeado existe para impedir pular adiante.
    mockedCatalog.listTracks.mockReturnValue([
      track('a', 'Primeira', 1),
      track('b', 'Segunda', 2),
    ] as never);
    snapshotsFor({
      a: snapshot('a', 'Primeira', []),
      b: snapshot('b', 'Segunda', ['available']),
    });

    const { segments } = await JourneyCurriculumService.getCurriculumTrail();

    expect(segments[0].completed).toBe(false);
    expect(segments[1].unlocked).toBe(false);
  });

  it('deixa o percurso navegável quando uma trilha falha na leitura', async () => {
    const errorSpy = jest.spyOn(console, 'error').mockImplementation(() => undefined);
    mockedCatalog.listTracks.mockReturnValue([
      track('a', 'Primeira', 1),
      track('b', 'Segunda', 2),
    ] as never);
    mockedProgress.getSnapshot.mockImplementation(async (definition) => {
      if ((definition as { id: string }).id === 'a') {
        throw new Error('storage corrompido');
      }
      return snapshot('b', 'Segunda', ['available'], 'b-node-0');
    });

    try {
      const { segments } = await JourneyCurriculumService.getCurriculumTrail();

      expect(segments.map((segment) => segment.trackId)).toEqual(['b']);
    } finally {
      errorSpy.mockRestore();
    }
  });
});
