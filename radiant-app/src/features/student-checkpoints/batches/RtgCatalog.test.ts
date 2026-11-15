import { execFileSync } from 'child_process';
import { existsSync, readdirSync, readFileSync } from 'fs';
import { resolve } from 'path';
import { RTG_2026_BATCHES } from './index';
import { RTG_2026_PRESENTATIONS } from './entries';
import { buildRtgBatch, RTG_UNIT_ORDER, type RtgUnitSource } from './rtgBatchFactory';
import { validatePromotedProductionBatch, type ProductionBatchV1 } from '../ProductionBatch';
import { createProductionCurriculumCatalog, type ProductionCatalogEntry } from '../createProductionCurriculumCatalog';
import { ProductionCurriculumCatalog } from '../ProductionCurriculumCatalog';
import { AssessmentAttemptRepository } from '../AssessmentAttemptRepository';
import { MemoryKeyValueStorage } from '../storage';
import { LessonCatalogService } from '../../content/services/LessonCatalogService';
import { isLearningContentMissing, isResumeContentAvailable } from '../../content/services/ContentAvailability';
import { JourneyCurriculumService } from '../../journey/services/JourneyCurriculumService';
import { JourneyProgressService } from '../../journey/services/JourneyProgressService';
import type { JourneyTrackDefinition } from '../../../types/journey';

jest.mock('@react-native-async-storage/async-storage', () =>
    require('@react-native-async-storage/async-storage/jest/async-storage-mock'));
jest.mock('../../telemetry/TelemetryService', () => ({ TelemetryService: { track: jest.fn().mockResolvedValue(undefined) } }));
// Só os serviços do app enxergam a unidade de teste. As conferências do índice
// gerado, abaixo, leem os módulos reais com `jest.requireActual`.
jest.mock('../production-catalog-entries', () => {
    const { readFileSync: read } = jest.requireActual('fs');
    const { resolve: join } = jest.requireActual('path');
    const { buildRtgBatch: build } = jest.requireActual('./rtgBatchFactory');
    return { PRODUCTION_CATALOG_ENTRIES: [build(JSON.parse(read(join(process.cwd(), '../scripts/content/fixtures/rtg-unit-fixture.json'), 'utf8')))] };
});

const repo = resolve(__dirname, '../../../../..');
const sourceDir = resolve(repo, 'content-manifest/rtg-2026/aulas');
/** Leitura direta das aulas-fonte: a contagem independente, sem passar pelo gerador. */
const sources: RtgUnitSource[] = (existsSync(sourceDir) ? readdirSync(sourceDir) : []).filter(name => name.endsWith('.json'))
    .map(name => JSON.parse(readFileSync(resolve(sourceDir, name), 'utf8')) as RtgUnitSource)
    .sort((a, b) => RTG_UNIT_ORDER.indexOf(a.unit.id as never) - RTG_UNIT_ORDER.indexOf(b.unit.id as never));
const interactionCount = (batch: ProductionBatchV1) => batch.activities.reduce(
    (sum, activity) => sum + activity.steps.filter(step => step.kind === 'interaction').length, 0);

describe('índice gerado da trilha rtg-2026', () => {
    it('tem um lote por aula-fonte, na ordem da trilha, com as mesmas contagens da leitura direta', () => {
        expect(RTG_2026_BATCHES.map(batch => batch.batchId)).toEqual(sources.map(source => `batch:rtg-2026:${source.unit.id}`));
        expect(RTG_2026_BATCHES.map(batch => batch.trackId)).toEqual(sources.map(source => `track:rtg-2026:${source.unit.id}`));
        expect(RTG_2026_BATCHES.map(batch => ({
            aulas: batch.activities.length, interacoes: interactionCount(batch), conferencia: batch.checkpoint.items.length, recuperacao: (batch.wide?.recovery.length ?? 0) * 2,
        }))).toEqual(sources.map(source => ({
            aulas: source.lessons.length,
            interacoes: source.lessons.reduce((sum, lesson) => sum + lesson.interactions.length, 0),
            conferencia: source.lessons.reduce((sum, lesson) => sum + lesson.checkpoint.length, 0),
            recuperacao: source.lessons.length * 2,
        })));
        // Os ramos nunca vêm antes do fim do núcleo.
        const positions = RTG_2026_BATCHES.map(batch => RTG_UNIT_ORDER.indexOf(batch.unitId.split(':').at(-1) as never));
        expect(positions.every(position => position >= 0)).toBe(true);
        expect(positions).toEqual([...positions].sort((a, b) => a - b));
    });

    it('cada lote gerado passa na mesma validação do lote promovido e tem apresentação', () => {
        for (const batch of RTG_2026_BATCHES) {
            expect({ batchId: batch.batchId, issues: validatePromotedProductionBatch(batch) }).toEqual({ batchId: batch.batchId, issues: [] });
            expect(batch.approvals.every(approval => approval.reviewerRole === 'ai-review-delegated')).toBe(true);
        }
        expect(Object.keys(RTG_2026_PRESENTATIONS)).toEqual(RTG_2026_BATCHES.map(batch => batch.batchId));
        expect(sources.map(source => RTG_2026_PRESENTATIONS[`batch:rtg-2026:${source.unit.id}`]?.title)).toEqual(sources.map(source => source.unit.title));
    });

    it('o catálogo de produção é exatamente o índice gerado, uma trilha por unidade', () => {
        const { PRODUCTION_BATCHES } = jest.requireActual<typeof import('../production-batches')>('../production-batches');
        const { PRODUCTION_CATALOG_ENTRIES } = jest.requireActual<typeof import('../production-catalog-entries')>('../production-catalog-entries');
        expect(PRODUCTION_BATCHES).toBe(RTG_2026_BATCHES);
        expect(PRODUCTION_CATALOG_ENTRIES.map((entry: ProductionCatalogEntry) => entry.batch.batchId)).toEqual(sources.map(source => `batch:rtg-2026:${source.unit.id}`));
        const catalog = createProductionCurriculumCatalog(PRODUCTION_CATALOG_ENTRIES);
        expect(catalog.listTracks().map(track => track.id)).toEqual(sources.map(source => `track:rtg-2026:${source.unit.id}`));
        expect(catalog.listLessonSummaries()).toHaveLength(sources.reduce((sum, source) => sum + source.lessons.length, 0));
        expect(jest.requireActual('../../../data/curriculum-state.json').state).toBe('retired');
    });

    it('o gerador confirma que os arquivos versionados estão em dia', () => {
        const output = execFileSync(process.execPath, ['scripts/content/build-rtg-batches.mjs', '--check'], { cwd: repo, encoding: 'utf8' });
        expect(JSON.parse(output).units.map((entry: { unit: string }) => entry.unit)).toEqual(sources.map(source => source.unit.id));
    });
});

describe('trilha nova para quem já usava o app (foco de revisão 1)', () => {
    const fixture = buildRtgBatch(JSON.parse(readFileSync(resolve(repo, 'scripts/content/fixtures/rtg-unit-fixture.json'), 'utf8')));
    const OLD_TRACK: JourneyTrackDefinition = {
        id: 'track-fundamentos', title: 'Fundamentos', initialUnitId: 'unit-radiology-foundations-1',
        units: [{ id: 'unit-radiology-foundations-1', title: 'Fundamentos', theme: 'base', nodes: [
            { id: 'node:lesson-1', unitId: 'unit-radiology-foundations-1', type: 'lesson', title: 'Aula retirada', lessonId: 'lesson-1', blockId: 'block:lesson-1:intro' },
            { id: 'node:lesson-2', unitId: 'unit-radiology-foundations-1', type: 'lesson', title: 'Outra aula retirada', lessonId: 'lesson-2', blockId: 'block:lesson-2:intro',
                unlockRule: { requiresNodeIds: ['node:lesson-1'] } },
        ] }],
    };

    it('com progresso de aula retirada gravado, a trilha nova aparece aberta e o ponto antigo aciona o aviso', async () => {
        await LessonCatalogService.bootstrap();
        // O aluno antigo: uma aula concluída e outra parada no meio, ambas de conteúdo retirado.
        await JourneyProgressService.markNodeCompleted('node:lesson-1', OLD_TRACK);
        await JourneyProgressService.setResumableNode('node:lesson-2', 3, OLD_TRACK);
        expect((await JourneyProgressService.getSnapshot(OLD_TRACK)).progress.completedNodeIds).toEqual(['node:lesson-1']);

        const trail = await JourneyCurriculumService.getCurriculumTrail();
        expect(trail.segments.map(segment => segment.trackId)).toEqual([fixture.batch.trackId]);
        const nodes = trail.segments[0].units.flatMap(unit => unit.nodes);
        expect(trail.segments[0].unlocked).toBe(true);
        expect(nodes).toHaveLength(fixture.batch.activities.length * 2 + 1);
        // Sem tela vazia: a primeira aula está liberada e nada da trilha nova nasce concluído.
        expect(nodes[0]).toMatchObject({ id: `node:${fixture.batch.activities[0].id}`, type: 'lesson' });
        expect(['available', 'active']).toContain(nodes[0].status);
        expect(nodes.filter(node => node.status === 'completed')).toEqual([]);
        expect(trail.recommendedNodeId).toBe(nodes[0].id);

        // É esta resposta que faz a Estude mostrar o aviso de conteúdo atualizado em vez de retomar.
        expect(isLearningContentMissing('block:lesson-2:intro')).toBe(true);
        expect(isResumeContentAvailable({ surface: 'lesson', flowId: 'lesson:block:lesson-2:intro', journeyNodeId: 'node:lesson-2' })).toBe(false);
        // Controle: uma aula da trilha nova é conteúdo disponível, então a recusa acima não é cegueira do resolvedor.
        expect(isLearningContentMissing(fixture.batch.activities[0].id)).toBe(false);
        expect(isResumeContentAvailable({ surface: 'lesson', flowId: `lesson:${fixture.batch.activities[0].id}` })).toBe(true);
        // O que o aluno fez antes continua gravado.
        expect((await JourneyProgressService.getSnapshot(OLD_TRACK)).progress.completedNodeIds).toEqual(['node:lesson-1']);
    });
});

describe('conferência reprovada numa unidade ampla', () => {
    it('bloqueia nova tentativa até refazer a aula da competência, e expõe os itens de recuperação dela', async () => {
        const { batch } = buildRtgBatch(JSON.parse(readFileSync(resolve(repo, 'scripts/content/fixtures/rtg-unit-fixture.json'), 'utf8')));
        const nodeId = `node:${batch.checkpoint.id}:aula-02`;
        const checkpoint = ProductionCurriculumCatalog.getCheckpointByNodeId(nodeId)!;
        const lesson = batch.activities[1];
        expect(checkpoint.items).toHaveLength(2);
        const repository = new AssessmentAttemptRepository(new MemoryKeyValueStorage());
        const evaluation = await repository.submit({
            operationId: 'operation:rtg:1', checkpointId: 'checkpoint:rtg:1', flowId: 'flow:rtg', attemptId: 'attempt:rtg:1',
            checkpointDefinitionId: checkpoint.id, unitId: batch.unitId, journeyNodeId: nodeId, activityId: batch.batchId,
            contentVersion: batch.contentVersion, curriculumKind: 'v2', committedAt: '2026-11-06T12:00:00Z',
            itemOutcomes: checkpoint.items.map((item, index) => ({
                itemId: item.id, activityId: lesson.id, competencyIds: [...item.competencyIds], evidenceKind: 'independent-recall' as const,
                outcome: index === 0 ? 'incorrect' as const : 'correct' as const, isCriticalError: false, hintUsed: false, durationBucket: 'unknown' as const,
            })),
        }, batch.activities);
        expect(evaluation.attempt).toMatchObject({ passed: false, weakCompetencyIds: lesson.competencyIds, resultingSupportState: 'cycle-1-required' });
        expect(await repository.getState(nodeId)).toMatchObject({ blocked: true, remainingActivityIds: [lesson.id] });

        const recovery = ProductionCurriculumCatalog.getRecoveryByCheckpointNodeId(nodeId)!;
        expect(evaluation.attempt.weakCompetencyIds).toContain(recovery.competencyId);
        const checkpointIds = checkpoint.items.map(item => item.id);
        expect([recovery.guided.id, recovery.transfer.id].some(id => checkpointIds.includes(id))).toBe(false);
        expect(recovery.guided.prompt).not.toBe(recovery.transfer.prompt);

        const answers = Object.fromEntries(lesson.steps.flatMap(step => step.kind === 'interaction' ? [[step.interaction.id, true]] : []));
        expect(Object.keys(answers)).toHaveLength(5);
        await repository.completeActivity(lesson, answers);
        expect(await repository.getState(nodeId)).toMatchObject({ blocked: false, remainingActivityIds: [] });
    });
});

// Meta da 1.6 para M01 a M03 (ADR-2026-11-13): ao menos duas famílias novas por
// aula, nenhuma família três vezes seguidas, e a primeira interação continua
// múltipla escolha, que é o que a fila de revisão sabe mostrar.
describe('M01 a M03 com as famílias da 1.6', () => {
    const NEW = new Set(['cloze', 'true-false', 'categorize', 'multi-select']);
    const lessons = RTG_2026_BATCHES.filter(batch => /^batch:rtg-2026:(m01|m02|m03)$/.test(batch.batchId)).flatMap(batch => batch.activities);
    it('as três unidades têm 18 aulas', () => expect(lessons).toHaveLength(18));
    it.each(lessons.map(lesson => [lesson.id, lesson] as const))('%s: duas famílias novas, sem trinca, i1 múltipla escolha', (_id, lesson) => {
        const types = lesson.steps.flatMap(step => step.kind === 'interaction' ? [step.interaction.type] : []);
        expect(new Set(types.filter(type => NEW.has(type))).size).toBeGreaterThanOrEqual(2);
        expect(types.some((type, index) => index > 1 && type === types[index - 1] && type === types[index - 2])).toBe(false);
        expect(types[0]).toBe('multiple-choice');
    });
});
