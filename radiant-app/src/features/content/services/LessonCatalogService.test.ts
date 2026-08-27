import AsyncStorage from '@react-native-async-storage/async-storage';
import { LessonCatalogService } from './LessonCatalogService';
import { RemoteCatalogService } from './RemoteCatalogService';
import { TelemetryService } from '../../telemetry/TelemetryService';

jest.mock('@react-native-async-storage/async-storage', () => ({ getItem: jest.fn(), setItem: jest.fn() }));

const storage = AsyncStorage as jest.Mocked<typeof AsyncStorage>;

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
  let storageValues: Map<string, string>;
  beforeEach(async () => {
    jest.resetAllMocks();
    storageValues = new Map();
    storage.getItem.mockImplementation(async (key) => storageValues.get(key) ?? null);
    storage.setItem.mockImplementation(async (key, value) => { storageValues.set(key, value); });
    fetchManifest.mockResolvedValue(null);
    await LessonCatalogService.refresh();
    jest.clearAllMocks();
    fetchManifest.mockResolvedValue(null);
  });

  it('initializes legacy authority before a single shared catalog refresh, without preparing V3', async () => {
    let releaseRead!: (value: null) => void;
    storage.getItem.mockReturnValueOnce(new Promise((resolve) => { releaseRead = resolve; }));
    const first = LessonCatalogService.bootstrap();
    const second = LessonCatalogService.bootstrap();
    expect(fetchManifest).not.toHaveBeenCalled();
    releaseRead(null);
    const results = await Promise.all([first, second]);
    expect(results[0]).toBe(results[1]);
    expect(results[0].initialLessonId).toBe('lesson-1');
    expect(fetchManifest).toHaveBeenCalledTimes(1);
    expect([...storageValues.entries()]).toEqual([[
      '@radiant:curriculum_runtime_v1',
      JSON.stringify({ schemaVersion: 'curriculum-runtime.v1', activeCurriculumId: 'curriculum:legacy', preparedCurriculumIds: ['curriculum:legacy'] }),
    ]]);
    expect(storage.getItem).toHaveBeenCalledTimes(1);
  });

  it('allows startup retry after storage failure without refreshing a partially initialized catalog', async () => {
    storage.setItem.mockRejectedValueOnce(new Error('storage unavailable'));
    await expect(LessonCatalogService.bootstrap()).rejects.toThrow('storage unavailable');
    expect(fetchManifest).not.toHaveBeenCalled();
    expect(storageValues.size).toBe(0);
    expect((await LessonCatalogService.bootstrap()).source).toBe('local');
    expect(fetchManifest).toHaveBeenCalledTimes(1);
    expect(JSON.parse(storageValues.get('@radiant:curriculum_runtime_v1')!).activeCurriculumId).toBe('curriculum:legacy');
  });

  it.each(['{broken', JSON.stringify({ schemaVersion: 'curriculum-runtime.v2', activeCurriculumId: 'curriculum:v3' })])(
    'keeps legacy catalog and unknown runtime bytes (%#)', async (raw) => {
      storageValues.set('@radiant:curriculum_runtime_v1', raw);
      expect((await LessonCatalogService.bootstrap()).initialLessonId).toBe('lesson-1');
      expect(storageValues.get('@radiant:curriculum_runtime_v1')).toBe(raw);
      expect(storage.setItem).not.toHaveBeenCalled();
    }
  );

  it('keeps the local catalog when no remote manifest is available', async () => {
    const manifest = await LessonCatalogService.bootstrap();

    expect(fetchManifest).toHaveBeenCalledTimes(1);
    expect(manifest.source).toBe('local');
    expect(LessonCatalogService.getCatalogSource()).toBe('local');
    expect(LessonCatalogService.getInitialLessonId()).toBe('lesson-1');
  });

  it('inclui o lote curricular v2 promovido no catálogo local sem convertê-lo em quiz legado', () => {
    const track = LessonCatalogService.listTracks().find(
      (entry) => entry.id === 'track:fundamentos-e-seguranca-radiologica'
    );
    const summaries = LessonCatalogService.listLessonSummaries().filter(
      (entry) => entry.trackId === track?.id
    );

    expect(track?.lessonIds).toHaveLength(12);
    expect(summaries).toHaveLength(12);
    expect(summaries[0]).toMatchObject({
      id: 'activity:materia-energia-e-radiacao:01',
      title: 'Estrutura e carga',
      order: 1,
    });
    expect(LessonCatalogService.getLessonById(summaries[0].id)).toBeNull();
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
    expect(LessonCatalogService.listTracks()).toHaveLength(2);
    expect(LessonCatalogService.listLessonSummaries()).toHaveLength(14);
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
    expect(manifest.lessons.filter((lesson) => !lesson.id.startsWith('activity:materia-energia-e-radiacao:'))).toEqual([
      expect.objectContaining({
        id: 'lesson-1',
      }),
    ]);
    expect(manifest.lessons.filter((lesson) => lesson.id.startsWith('activity:materia-energia-e-radiacao:'))).toHaveLength(12);
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
