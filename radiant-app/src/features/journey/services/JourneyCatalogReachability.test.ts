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

it('resolve todos os nós do catálogo local pelo mesmo caminho usado em Estude', () => {
    const report = auditJourneyCatalog({
        tracks: LessonCatalogService.listTracks(), summaries: LessonCatalogService.listLessonSummaries(),
        getJourney: id => JourneyDefinitionService.getTrackDefinition(id),
        getActivity: id => LessonFlowService.getActivityById(id),
        getCheckpoint: id => ProductionCurriculumCatalog.getCheckpointByNodeId(id),
    });
    expect(report.issues).toEqual([]);
    expect(report.tracks).toHaveLength(4);
    expect(report.tracks.reduce((sum, track) => sum + track.nodes, 0)).toBe(57);
    expect(report.tracks.reduce((sum, track) => sum + track.resolvedActivityNodes, 0)).toBe(48);
    expect(report.tracks.reduce((sum, track) => sum + track.resolvedCheckpointNodes, 0)).toBe(5);
    expect(report.tracks.every(track => track.nodes === track.structurallyReachableNodes)).toBe(true);
});

it('o inventário executável publica a cobertura separando legado de fonte editorial', () => {
    const { execFileSync } = jest.requireActual<typeof import('node:child_process')>('node:child_process');
    const { resolve } = jest.requireActual<typeof import('node:path')>('node:path');
    const root = resolve(__dirname, '../../../../..');
    const report = JSON.parse(execFileSync(process.execPath, ['scripts/qa/trilha-structural-inventory.cjs', '--check'], { cwd: root, encoding: 'utf8' }));
    expect(report.schemaVersion).toBe(3);
    // Ocorrências por atividade: todas as perguntas no introdutório e na revisão.
    // O catálogo não recebeu conteúdo novo.
    expect(report.coverage.summary).toMatchObject({ promotedPracticeItems: 12, promotedCheckpointItems: 10, legacyItems: 76, declaredSources: 8, checkpointItemsWithNodes: 10 });
    expect(report.coverage.issues).toEqual([]);
    expect(report.coverage.items.filter((item: { provenance: string }) => item.provenance === 'legacy-unmapped')).toHaveLength(76);
});
