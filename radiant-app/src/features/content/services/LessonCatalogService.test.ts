import { LessonCatalogService } from './LessonCatalogService';
import { RemoteCatalogService } from './RemoteCatalogService';
import { TelemetryService } from '../../telemetry/TelemetryService';

jest.mock('./RemoteCatalogService', () => ({
  RemoteCatalogService: {
    fetchManifest: jest.fn(),
  },
}));

jest.mock('../../telemetry/TelemetryService', () => ({
  TelemetryService: {
    track: jest.fn().mockResolvedValue(undefined),
  },
}));

const fetchManifest = RemoteCatalogService.fetchManifest as jest.MockedFunction<
  typeof RemoteCatalogService.fetchManifest
>;

describe('LessonCatalogService', () => {
  beforeEach(async () => {
    jest.clearAllMocks();
    fetchManifest.mockResolvedValue(null);
    await LessonCatalogService.refresh();
    jest.clearAllMocks();
    fetchManifest.mockResolvedValue(null);
  });

  it('keeps the local catalog when no remote manifest is available', async () => {
    const manifest = await LessonCatalogService.bootstrap();

    expect(fetchManifest).toHaveBeenCalledTimes(1);
    expect(manifest.source).toBe('local');
    expect(LessonCatalogService.getCatalogSource()).toBe('local');
    expect(LessonCatalogService.getInitialLessonId()).toBe('lesson-1');
  });

  it('adopts the remote manifest when the payload is valid', async () => {
    fetchManifest.mockResolvedValueOnce({
      version: 'v1-remote-seed',
      initialLessonId: 'lesson-2',
      tracks: [
        {
          id: 'track-radiology-foundations',
          slug: 'radiology-foundations',
          title: 'Fundamentos de Radiologia',
          description: 'Base inicial para raciocínio radiológico e introdução à TC.',
          lessonIds: ['lesson-1', 'lesson-2'],
        },
      ],
      lessons: [
        {
          id: 'lesson-1',
          slug: 'fundamentos-de-radiologia',
          title: 'Fundamentos de Radiologia',
          difficulty: 'beginner',
          trackId: 'track-radiology-foundations',
          order: 1,
          payload: {
            id: 'lesson-1',
            title: 'Fundamentos de Radiologia',
            difficulty: 'beginner',
            journey: {
              intro: {
                questionIndex: 0,
                contextBody: 'Contexto remoto de introdução',
                teachBody: 'Ensino remoto principal',
                reinforceBody: 'Reforço remoto principal',
              },
            },
            questions: [
              {
                id: 'remote-q1',
                type: 'multiple-choice',
                prompt: 'Pergunta remota 1',
                options: [{ label: 'A' }, { label: 'B' }],
                correctAnswerIndex: 0,
                explanation: 'Explicação remota 1',
              },
            ],
          },
        },
        {
          id: 'lesson-2',
          slug: 'principios-de-tomografia-computadorizada',
          title: 'Princípios de Tomografia Computadorizada',
          difficulty: 'beginner',
          trackId: 'track-radiology-foundations',
          order: 2,
          payload: {
            id: 'lesson-2',
            title: 'Princípios de Tomografia Computadorizada',
            difficulty: 'beginner',
            questions: [
              {
                id: 'remote-q2',
                type: 'multiple-choice',
                prompt: 'Pergunta remota 2',
                options: [{ label: 'A' }, { label: 'B' }],
                correctAnswerIndex: 1,
                explanation: 'Explicação remota 2',
              },
            ],
          },
        },
      ],
      source: 'remote',
      refreshedAtIso: '2026-04-03T00:00:00.000Z',
    });

    const manifest = await LessonCatalogService.bootstrap();

    expect(manifest.source).toBe('remote');
    expect(LessonCatalogService.getCatalogSource()).toBe('remote');
    expect(LessonCatalogService.getCatalogVersion()).toBe('v1-remote-seed');
    expect(LessonCatalogService.getInitialLessonId()).toBe('lesson-2');
    expect(LessonCatalogService.listTracks()).toHaveLength(1);
    expect(LessonCatalogService.listLessonSummaries()).toHaveLength(2);
    expect(LessonCatalogService.getLessonById('lesson-1')?.questions[0]?.id).toBe('remote-q1');
    expect(LessonCatalogService.getLessonById('lesson-1')?.journey?.intro?.contextBody).toBe(
      'Contexto remoto de introdução'
    );
    expect(LessonCatalogService.getLessonById('lesson-2')?.questions[0]?.id).toBe('remote-q2');
  });

  it('filters remote lessons that are not available in the local payload set', async () => {
    fetchManifest.mockResolvedValueOnce({
      version: 'v2-remote-seed',
      initialLessonId: 'lesson-999',
      tracks: [
        {
          id: 'track-radiology-foundations',
          slug: 'radiology-foundations',
          title: 'Fundamentos de Radiologia',
          description: 'Base inicial para raciocínio radiológico e introdução à TC.',
          lessonIds: ['lesson-1', 'lesson-999'],
        },
      ],
      lessons: [
        {
          id: 'lesson-1',
          slug: 'fundamentos-de-radiologia',
          title: 'Fundamentos de Radiologia',
          difficulty: 'beginner',
          trackId: 'track-radiology-foundations',
          order: 1,
          payload: {
            id: 'lesson-1',
            title: 'Fundamentos de Radiologia',
            difficulty: 'beginner',
            questions: [
              {
                id: 'remote-q1',
                type: 'multiple-choice',
                prompt: 'Pergunta remota 1',
                options: [{ label: 'A' }, { label: 'B' }],
                correctAnswerIndex: 0,
                explanation: 'Explicação remota 1',
              },
            ],
          },
        },
        {
          id: 'lesson-999',
          slug: 'nao-existe-localmente',
          title: 'Lição remota ainda não publicada no app',
          difficulty: 'advanced',
          trackId: 'track-radiology-foundations',
          order: 99,
        },
      ],
      source: 'remote',
      refreshedAtIso: '2026-04-03T00:00:00.000Z',
    });

    const manifest = await LessonCatalogService.bootstrap();

    expect(manifest.source).toBe('remote');
    expect(manifest.initialLessonId).toBe('lesson-1');
    expect(manifest.lessons).toEqual([
      expect.objectContaining({
        id: 'lesson-1',
      }),
    ]);
    expect(manifest.tracks[0].lessonIds).toEqual(['lesson-1']);
    expect(LessonCatalogService.getLessonById('lesson-1')?.questions[0]?.id).toBe('remote-q1');
  });

  it('emits telemetry for bootstrap and fallback flows', async () => {
    await LessonCatalogService.bootstrap();

    expect(TelemetryService.track).toHaveBeenCalledWith(
      'catalog_bootstrap',
      expect.objectContaining({ source: 'local' })
    );
    expect(TelemetryService.track).toHaveBeenCalledWith(
      'catalog_remote_fallback',
      expect.objectContaining({ source: 'local' })
    );
  });
});
