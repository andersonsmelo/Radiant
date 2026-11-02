import AsyncStorage from '@react-native-async-storage/async-storage';
import state from '../../../data/curriculum-state.json';
import { LESSONS } from '../../../data/lessons';
import { AI_LESSONS } from '../../../data/ai-lessons';
import { LESSON_CATALOG } from '../../../data/catalog';
import { DEFAULT_LESSON_BLOCKS } from '../../../data/journey/defaultBlocks';
import { DEFAULT_JOURNEY_TRACK_DEFINITION } from '../../../data/journey/defaultTrack';
import { PRODUCTION_BATCHES } from '../../student-checkpoints/production-batches';
import { PRODUCTION_CATALOG_ENTRIES } from '../../student-checkpoints/production-catalog-entries';
import { BENCH_LESSON_IDS } from '../../bench/lessons/BenchLessonCatalog';
import { LessonCatalogService } from './LessonCatalogService';
import { RemoteCatalogService } from './RemoteCatalogService';
import { LessonFlowService } from '../../lesson-flow/services/LessonFlowService';

jest.mock('@react-native-async-storage/async-storage', () => ({ getItem: jest.fn(), setItem: jest.fn(), removeItem: jest.fn() }));
jest.mock('./RemoteCatalogService', () => ({ RemoteCatalogService: { fetchManifest: jest.fn() } }));
jest.mock('../../telemetry/TelemetryService', () => ({ TelemetryService: { track: jest.fn().mockResolvedValue(undefined) } }));

describe('retirada explícita do conteúdo', () => {
  beforeEach(() => jest.clearAllMocks());
  it('deixa vazias todas as fontes ativas, sem perder o marcador explícito', () => {
    expect(state).toEqual({ schemaVersion: 1, state: 'retired', audience: 'radiology-technologist', reason: 'content-restart-2026-11-02' });
    for (const values of [LESSONS, AI_LESSONS, LESSON_CATALOG.lessons, LESSON_CATALOG.tracks, DEFAULT_LESSON_BLOCKS, DEFAULT_JOURNEY_TRACK_DEFINITION.units, PRODUCTION_BATCHES, PRODUCTION_CATALOG_ENTRIES, BENCH_LESSON_IDS]) expect(values).toEqual([]);
    expect(LESSON_CATALOG.initialLessonId).toBeNull();
  });
  it('bootstrap e refresh não consultam remoto/cache nem migram dados do aluno', async () => {
    const sentinel = { version: 'stale', tracks: [], lessons: [{ id: 'old-remote' }], initialLessonId: 'old-remote' };
    (RemoteCatalogService.fetchManifest as jest.Mock).mockResolvedValue(sentinel);
    const manifest = await LessonCatalogService.bootstrap();
    await LessonCatalogService.refresh();
    expect(manifest.lessons).toEqual([]);
    expect(LessonCatalogService.getInitialLessonId()).toBeNull();
    expect(RemoteCatalogService.fetchManifest).not.toHaveBeenCalled();
    expect(AsyncStorage.getItem).not.toHaveBeenCalled();
    expect(AsyncStorage.setItem).not.toHaveBeenCalled();
    expect(AsyncStorage.removeItem).not.toHaveBeenCalled();
  });
  it.each(['lesson-1', 'ai-lesson-qualidade-de-imagem', 'activity:materia-energia-e-radiacao:01', 'bancada:exposicao', 'bancada:colimacao'])('não resolve o link antigo %s', id => {
    expect(LessonCatalogService.getLessonById(id)).toBeNull();
    expect(LessonFlowService.getActivityById(id)).toBeNull();
  });
});
