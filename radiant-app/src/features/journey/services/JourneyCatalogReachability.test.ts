import { LessonCatalogService } from '../../content/services/LessonCatalogService';
import { JourneyDefinitionService } from './JourneyDefinitionService';
import { LessonFlowService } from '../../lesson-flow/services/LessonFlowService';
import { ProductionCurriculumCatalog } from '../../student-checkpoints/ProductionCurriculumCatalog';
import { auditJourneyCatalog } from './JourneyCatalogAudit';

// Apenas a fronteira de storage/rede é substituída. Os compositores, a montagem
// da jornada, a adaptação e a resolução são os mesmos consumidos pelo app.
jest.mock('../../content/services/LessonCatalogService', () => {
    const { LESSON_CATALOG } = jest.requireActual('../../../data/catalog');
    const { LESSONS } = jest.requireActual('../../../data/lessons');
    const { AI_LESSONS } = jest.requireActual('../../../data/ai-lessons');
    const { composeCurriculumCatalog } = jest.requireActual('../../content/services/composeCurriculumCatalog');
    const { ProductionCurriculumCatalog: production } = jest.requireActual('../../student-checkpoints/ProductionCurriculumCatalog');
    const manifest = composeCurriculumCatalog(LESSON_CATALOG, production);
    const lessons = new Map([...AI_LESSONS, ...LESSONS].map(lesson => [lesson.id, lesson]));
    return { LessonCatalogService: {
        listTracks: () => manifest.tracks,
        listLessonSummaries: () => manifest.lessons,
        getLessonById: (id: string) => lessons.get(id) ?? null,
    } };
});

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

it('resolve todos os nós do catálogo local pelo mesmo caminho usado em Estude', () => {
    const report = auditJourneyCatalog({
        tracks: LessonCatalogService.listTracks(), summaries: LessonCatalogService.listLessonSummaries(),
        getJourney: id => JourneyDefinitionService.getTrackDefinition(id),
        getActivity: id => LessonFlowService.getActivityById(id),
        getCheckpoint: id => ProductionCurriculumCatalog.getCheckpointByNodeId(id),
    });
    expect(report.issues).toEqual([]);
    expect(jest.requireActual('../../../data/curriculum-state.json').state).toBe('retired');
    // Por unidade: um nó de aula e um de conferência por aula-fonte, mais a conquista.
    expect(report.tracks).toHaveLength(sourceUnits.length);
    expect(report.tracks.reduce((total, track) => total + track.nodes, 0)).toBe(sum(unit => unit.lessons.length * 2 + 1));
    expect(report.tracks.reduce((total, track) => total + track.resolvedActivityNodes, 0)).toBe(sum(unit => unit.lessons.length));
    expect(report.tracks.reduce((total, track) => total + track.resolvedCheckpointNodes, 0)).toBe(sum(unit => unit.lessons.length));
    expect(report.tracks.every(track => track.nodes === track.structurallyReachableNodes)).toBe(true);
});

it('o inventário executável publica a cobertura separando legado de fonte editorial', () => {
    const { execFileSync } = jest.requireActual<typeof import('node:child_process')>('node:child_process');
    const { resolve } = jest.requireActual<typeof import('node:path')>('node:path');
    const root = resolve(__dirname, '../../../../..');
    const report = JSON.parse(execFileSync(process.execPath, ['scripts/qa/trilha-structural-inventory.cjs', '--check'], { cwd: root, encoding: 'utf8', maxBuffer: 256 * 1024 * 1024 }));
    expect(report.schemaVersion).toBe(3);
    // As contagens saem das aulas-fonte: toda interação, todo item de conferência e de recuperação tem proveniência ligada.
    expect(report.coverage.summary).toMatchObject({
        promotedPracticeItems: sum(unit => unit.lessons.reduce((total, lesson) => total + lesson.interactions.length, 0)),
        promotedCheckpointItems: sum(unit => unit.lessons.reduce((total, lesson) => total + lesson.checkpoint.length, 0)),
        promotedRecoveryItems: sum(unit => unit.lessons.length * 2),
        checkpointItemsWithNodes: sum(unit => unit.lessons.reduce((total, lesson) => total + lesson.checkpoint.length, 0)),
        legacyItems: 0, declaredSources: sum(unit => unit.sources.length),
    });
    expect(report.coverage.summary.matchedClaims).toBe(report.coverage.summary.expectedClaims);
    expect(report.coverage.gaps.filter((gap: { code: string }) => gap.code === 'unsupported-claim-binding')).toEqual([]);
    expect(report.coverage.issues).toEqual([]);
    expect(report.coverage.items.filter((item: { provenance: string }) => item.provenance === 'legacy-unmapped')).toHaveLength(0);
});
