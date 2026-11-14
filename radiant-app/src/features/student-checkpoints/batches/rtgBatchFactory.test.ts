import { readFileSync } from 'fs';
import { resolve } from 'path';
import { buildRtgBatch, seededDisplayOrder, RTG_REVIEW, RTG_UNIT_ORDER, type RtgUnitSource } from './rtgBatchFactory';
import { fingerprintProductionBatchMaterial, validatePromotedProductionBatch, PRODUCTION_BATCH_APPROVAL_GATES } from '../ProductionBatch';
import { createProductionCurriculumCatalog } from '../createProductionCurriculumCatalog';
import type { EditorialCandidate } from '../EditorialCurriculumCandidate';
import { validateLearningActivity, type LearningActivityV2, type LearningStepV2 } from '../../../types/learningActivity';

const fixture = (): RtgUnitSource => JSON.parse(readFileSync(resolve(__dirname, '../../../../../scripts/content/fixtures/rtg-unit-fixture.json'), 'utf8'));
const source = fixture();
const { batch, presentation } = buildRtgBatch(source);
const interactionsOf = (steps: readonly LearningStepV2[]) => steps.flatMap(step => step.kind === 'interaction' ? [step.interaction] : []);
const rules = (activity: LearningActivityV2) => validateLearningActivity(activity).map(issue => `${issue.path}|${issue.rule}`);
const copy = (): LearningActivityV2 => JSON.parse(JSON.stringify(batch.activities[0]));

describe('fábrica de lotes rtg-2026', () => {
    it('promove um lote válido, com identidades do espaço da unidade', () => {
        expect(validatePromotedProductionBatch(batch)).toEqual([]);
        expect(batch).toMatchObject({ state: 'promoted', batchId: 'batch:rtg-2026:m01', trackId: 'track:rtg-2026:m01', unitId: 'unit:rtg-2026:m01' });
        expect(batch.competencyIds).toEqual(source.lessons.map((_, index) => `competency:rtg-2026:m01:aula-0${index + 1}`));
        expect(presentation).toMatchObject({ slug: 'rtg-2026-m01', title: source.unit.title, description: source.unit.summary });
    });

    it('cada aula vira uma atividade: cena, conceito, cinco interações com ajuda e fecho', () => {
        expect(batch.activities).toHaveLength(source.lessons.length);
        batch.activities.forEach((activity, index) => {
            const lesson = source.lessons[index];
            expect(validateLearningActivity(activity)).toEqual([]);
            expect(activity.steps.map(step => step.kind === 'presentation' ? step.role : step.interaction.type)).toEqual([
                'hook', 'concept', ...lesson.interactions.map(interaction => interaction.type), 'closing',
            ]);
            const [hook, concept] = activity.steps;
            const closing = activity.steps.at(-1)!;
            if (hook.kind !== 'presentation' || concept.kind !== 'presentation' || closing.kind !== 'presentation') throw new Error('passos fora de ordem');
            expect(hook.payload).toMatchObject({ title: lesson.title, body: lesson.objective, dialogue: lesson.scene });
            expect(concept.payload).toMatchObject({ title: lesson.concept.title, body: lesson.concept.body, keyPoints: lesson.concept.keyPoints });
            expect(closing.payload.dialogue).toEqual({ lines: [lesson.closing.line] });
            const interactions = interactionsOf(activity.steps);
            expect(interactions).toHaveLength(5);
            expect(interactions.map(interaction => interaction.help)).toEqual(lesson.interactions.map(interaction => interaction.help));
            expect(interactions.map(interaction => interaction.criticalSafety)).toEqual(lesson.interactions.map(interaction => interaction.role === 'safety'));
        });
    });

    it('cada alternativa carrega o próprio retorno, e a correta é a marcada na aula-fonte', () => {
        const lesson = source.lessons[0];
        const first = interactionsOf(batch.activities[0].steps)[0];
        if (first.type !== 'multiple-choice' || lesson.interactions[0].type !== 'multiple-choice') throw new Error('fixture mudou');
        const authored = lesson.interactions[0].options;
        expect(first.payload.options.map(option => [option.label, option.explanation])).toEqual(authored.map(option => [option.label, option.feedback]));
        expect(first.payload.options.findIndex(option => option.id === first.payload.correctOptionId)).toBe(authored.findIndex(option => option.correct));
        expect(first.feedback.correct).toBe(authored.find(option => option.correct)!.feedback);
    });

    it('a ordenação chega embaralhada, sem perder nem repetir item, e a resposta é a ordem da aula-fonte', () => {
        for (const [index, activity] of batch.activities.entries()) {
            const ordering = interactionsOf(activity.steps).find(interaction => interaction.type === 'ordering');
            const authored = source.lessons[index].interactions.find(interaction => interaction.type === 'ordering');
            if (ordering?.type !== 'ordering' || authored?.type !== 'ordering') throw new Error('fixture sem ordenação');
            const labelOf = new Map(ordering.payload.items.map(item => [item.id, item.label]));
            const shown = ordering.payload.items.map(item => item.id);
            expect(ordering.payload.correctOrder.map(id => labelOf.get(id))).toEqual(authored.items);
            expect(shown).not.toEqual(ordering.payload.correctOrder);
            expect([...shown].sort()).toEqual([...ordering.payload.correctOrder].sort());
        }
        // A ordem depende só da semente e nunca é a original, nem no menor caso.
        expect(seededDisplayOrder(['a', 'b'], 'semente')).toEqual(['b', 'a']);
        expect(seededDisplayOrder(['a', 'b', 'c', 'd'], 'x')).toEqual(seededDisplayOrder(['a', 'b', 'c', 'd'], 'x'));
        for (const seed of ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h']) {
            const order = seededDisplayOrder([1, 2, 3, 4, 5], seed);
            expect(order).not.toEqual([1, 2, 3, 4, 5]);
            expect([...order].sort()).toEqual([1, 2, 3, 4, 5]);
        }
        expect(seededDisplayOrder(['só'], 'semente')).toEqual(['só']);
    });

    it('registra os seis aceites como revisão por IA sob a ADR, presos ao hash do material', () => {
        expect(RTG_REVIEW).toEqual({ reviewerRole: 'ai-review-delegated', reviewerRef: 'claude-fable-5.1:ADR-2026-11-05', decidedAt: '2026-11-06T00:00:00.000Z' });
        expect(batch.approvals.map(approval => approval.gate)).toEqual([...PRODUCTION_BATCH_APPROVAL_GATES]);
        for (const approval of batch.approvals) {
            expect(approval).toMatchObject({ decision: 'approved', ...RTG_REVIEW, materialSha256: batch.materialSha256 });
        }
        expect(batch.materialSha256).toMatch(/^[a-f0-9]{64}$/);
        expect(batch.promotedAt).toBe('2026-11-06T00:00:00.000Z');
    });

    it('a fonte de consulta leva url, editora, data de acesso e nota de licença, sem hash de corpo', () => {
        expect(batch.sources).toEqual(source.sources.map(entry => ({ ...entry, id: `source:rtg-2026:m01:${entry.id}` })));
        for (const entry of batch.sources) expect(Object.keys(entry).sort()).toEqual(['accessedAt', 'id', 'licenseNote', 'publisher', 'title', 'url', 'use']);
    });

    it('a conferência vem de `checkpoint` e a recuperação fica disponível por nó de conferência', () => {
        expect(batch.checkpoint.items.map(item => item.prompt)).toEqual(source.lessons.flatMap(lesson => lesson.checkpoint.map(item => item.prompt)));
        const catalog = createProductionCurriculumCatalog([{ batch, presentation }]);
        source.lessons.forEach((lesson, index) => {
            const nodeId = `node:checkpoint:rtg-2026:m01:aula-0${index + 1}`;
            expect(catalog.getCheckpointByNodeId(nodeId)?.items.map(item => item.prompt)).toEqual(lesson.checkpoint.map(item => item.prompt));
            const recovery = catalog.getRecoveryByCheckpointNodeId(nodeId);
            expect(recovery).toMatchObject({ competencyId: batch.competencyIds[index], hook: lesson.recovery.guided.hook,
                guided: { prompt: lesson.recovery.guided.item.prompt }, transfer: { prompt: lesson.recovery.transfer.item.prompt } });
            for (const item of [recovery!.guided, recovery!.transfer]) {
                expect(item.options).toHaveLength(4);
                expect(item.options.filter(option => option.id === item.correctOptionId)).toHaveLength(1);
            }
        });
        expect(catalog.getRecoveryByCheckpointNodeId('node:checkpoint:rtg-2026:m01:aula-99')).toBeNull();
        const journey = catalog.getJourneyTrackDefinition(batch.trackId)!;
        expect(journey.units[0].nodes.map(node => node.type)).toEqual([...source.lessons.flatMap(() => ['lesson', 'checkpoint']), 'reward']);
    });

    it('é reprodutível e recusa unidade fora do mapa', () => {
        expect(JSON.stringify(buildRtgBatch(fixture()))).toBe(JSON.stringify({ batch, presentation }));
        expect(fingerprintProductionBatchMaterial({ ...batch, schemaVersion: 1, promotionState: 'human-gates-pending',
            approvals: { technical: 'pending', editorial: 'pending', accessibility: 'pending', rights: 'pending', schema: 'pending', product: 'pending' } } as EditorialCandidate)).toBe(batch.materialSha256);
        expect(() => buildRtgBatch({ ...fixture(), unit: { ...source.unit, id: 'm99' } })).toThrow('rtg-batch-unknown-unit:m99');
        // Núcleo na ordem da ementa, com as unidades da 1.6 na posição pedagógica (mapa de 2026-11-13).
        expect(RTG_UNIT_ORDER).toEqual(['m01', 'm02', 'm03', 'm15', 'm04', 'm05', 'm06', 'm07', 'm08', 'm09', 'm16', 'm10', 'm11', 'm12', 'm13', 'm14',
            's-tc', 's-rm', 's-md', 's-mn', 's-rt', 's-ir', 's-od', 's-us']);
    });
});

describe('validador de atividade: diálogo, pontos-chave e ajuda', () => {
    const hookId = 'step:rtg-2026:m01:aula-01:abertura';
    const conceptId = 'step:rtg-2026:m01:aula-01:conceito';
    const hookOf = (activity: LearningActivityV2) => {
        const step = activity.steps[0];
        if (step.kind !== 'presentation' || !step.payload.dialogue) throw new Error('abertura sem diálogo');
        return step.payload.dialogue;
    };

    it('aceita a atividade gerada, de oito passos e cinco interações', () => {
        const activity = copy();
        expect(activity.steps).toHaveLength(8);
        expect(rules(activity)).toEqual([]);
    });

    it('recusa falante fora do elenco', () => {
        const activity = copy();
        (hookOf(activity).lines[0] as { speaker: string }).speaker = 'narrador';
        expect(rules(activity)).toEqual([`${hookId}|invalid-dialogue`]);
    });

    it('recusa fala vazia e cena sem fala', () => {
        const empty = copy();
        hookOf(empty).lines[0].text = '   ';
        expect(rules(empty)).toEqual([`${hookId}|invalid-dialogue`]);
        const none = copy();
        hookOf(none).lines = [];
        expect(rules(none)).toEqual([`${hookId}|invalid-dialogue`]);
    });

    it('recusa paciente sem nome, e aceita o mesmo paciente com nome', () => {
        const activity = copy();
        const line = hookOf(activity).lines.find(entry => entry.speaker === 'paciente')!;
        expect(line.name).toBe('Dona Marta');
        delete line.name;
        expect(rules(activity)).toEqual([`${hookId}|invalid-dialogue`]);
        line.name = 'Seu Jorge';
        expect(rules(activity)).toEqual([]);
    });

    it('recusa pontos-chave vazios ou em branco', () => {
        for (const keyPoints of [[], ['Conferir vem antes.', ' ']]) {
            const activity = copy();
            const step = activity.steps[1];
            if (step.kind !== 'presentation') throw new Error('conceito fora de lugar');
            step.payload.keyPoints = keyPoints;
            expect(rules(activity)).toEqual([`${conceptId}|invalid-key-points`]);
        }
    });

    it('recusa ajuda em branco', () => {
        const activity = copy();
        const interaction = interactionsOf(activity.steps)[0];
        interaction.help = '  ';
        expect(rules(activity)).toEqual([`${interaction.id}|invalid-help`]);
    });

    it('os limites novos valem: doze passos e oito interações passam, treze e nove não', () => {
        const extra = (index: number): LearningStepV2 => {
            const step = JSON.parse(JSON.stringify(copy().steps[2])) as LearningStepV2;
            if (step.kind !== 'interaction') throw new Error('terceiro passo deveria ser interação');
            step.interaction.id = `${step.interaction.id}-extra-${index}`;
            return step;
        };
        const eight = copy();
        eight.steps.splice(7, 0, extra(1), extra(2), extra(3));
        expect(eight.steps).toHaveLength(11);
        expect(rules(eight)).toEqual([]);
        const nine = copy();
        nine.steps.splice(7, 0, extra(1), extra(2), extra(3), extra(4));
        expect(rules(nine)).toEqual([`${nine.id}|invalid-interaction-count`]);
        const thirteen = copy();
        thirteen.steps.splice(1, 0, ...Array.from({ length: 5 }, (_, index): LearningStepV2 => (
            { kind: 'presentation', id: `step:extra:${index}`, role: 'concept', payload: { title: `Conceito ${index + 1}` } })));
        expect(thirteen.steps).toHaveLength(13);
        expect(rules(thirteen)).toEqual([`${thirteen.id}|invalid-step-count`]);
    });
});
