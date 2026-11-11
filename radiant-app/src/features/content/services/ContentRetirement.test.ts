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

// Contagem independente: lê as aulas-fonte direto do repositório, sem passar pelo gerador.
type SourceUnit = { unit: { id: string }; sources: unknown[]; lessons: { id: string; interactions: unknown[]; checkpoint: unknown[] }[] };
function readSourceUnits(): SourceUnit[] {
    const fs = jest.requireActual<typeof import('fs')>('fs');
    const path = jest.requireActual<typeof import('path')>('path');
    const dir = path.resolve(__dirname, '../../../../../content-manifest/rtg-2026/aulas');
    return (fs.existsSync(dir) ? fs.readdirSync(dir) : []).filter(name => name.endsWith('.json'))
        .map(name => JSON.parse(fs.readFileSync(path.join(dir, name), 'utf8')) as SourceUnit);
}
const sourceUnits = readSourceUnits();
const sum = (pick: (unit: SourceUnit) => number) => sourceUnits.reduce((total, unit) => total + pick(unit), 0);
const sourceActivityIds = sourceUnits.flatMap(unit => unit.lessons.map(lesson => `activity:rtg-2026:${unit.unit.id}:aula-${lesson.id.slice(-2)}`)).sort();

describe('retirada explícita do conteúdo', () => {
  beforeEach(() => jest.clearAllMocks());
  it('deixa vazias todas as fontes antigas, sem perder o marcador explícito, e só a trilha rtg-2026 entra', () => {
    expect(state).toEqual({ schemaVersion: 1, state: 'retired', audience: 'radiology-technologist', reason: 'content-restart-2026-11-02' });
    for (const values of [LESSONS, AI_LESSONS, LESSON_CATALOG.lessons, LESSON_CATALOG.tracks, DEFAULT_LESSON_BLOCKS, DEFAULT_JOURNEY_TRACK_DEFINITION.units, BENCH_LESSON_IDS]) expect(values).toEqual([]);
    // O catálogo de produção tem exatamente as unidades com aula-fonte, todas do contrato amplo: nada antigo voltou.
    expect(PRODUCTION_BATCHES.map(batch => batch.batchId).sort()).toEqual(sourceUnits.map(unit => `batch:rtg-2026:${unit.unit.id}`).sort());
    expect(PRODUCTION_BATCHES.every(batch => batch.wide !== undefined && batch.pilot === undefined)).toBe(true);
    expect(PRODUCTION_CATALOG_ENTRIES.map(entry => entry.batch)).toEqual([...PRODUCTION_BATCHES]);
    expect(PRODUCTION_BATCHES.flatMap(batch => batch.activities.map(activity => activity.id)).sort()).toEqual(sourceActivityIds);
    expect(LESSON_CATALOG.initialLessonId).toBeNull();
  });
  it('bootstrap e refresh não consultam remoto/cache nem migram dados do aluno', async () => {
    const sentinel = { version: 'stale', tracks: [], lessons: [{ id: 'old-remote' }], initialLessonId: 'old-remote' };
    (RemoteCatalogService.fetchManifest as jest.Mock).mockResolvedValue(sentinel);
    const manifest = await LessonCatalogService.bootstrap();
    await LessonCatalogService.refresh();
    expect(manifest.lessons.map(lesson => lesson.id).sort()).toEqual(sourceActivityIds);
    expect(manifest.lessons.some(lesson => lesson.id === 'old-remote')).toBe(false);
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
