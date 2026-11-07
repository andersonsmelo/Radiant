import { readFileSync } from 'fs';
import { resolve } from 'path';
import { validateEditorialCurriculumCandidate, type EditorialWideCandidateV1 } from './EditorialCurriculumCandidate';
import { WIDE_ACTIVITY_FAMILIES } from './EditorialWideContract';
import { fingerprintProductionBatchMaterial, validateProductionBatchDraft, type ProductionBatchDraftV1 } from './ProductionBatch';
import { buildRtgBatch, type RtgUnitSource } from './batches/rtgBatchFactory';
import type { LearningStepV2 } from '../../types/learningActivity';

const source = JSON.parse(readFileSync(resolve(__dirname, '../../../../scripts/content/fixtures/rtg-unit-fixture.json'), 'utf8')) as RtgUnitSource;
const { batch } = buildRtgBatch(source);
const ACTIVITY = 'activity:rtg-2026:m01:aula-01';

/** O material do lote de volta à forma de candidato, em cópia mutável. */
function candidate(): EditorialWideCandidateV1 {
    return JSON.parse(JSON.stringify({
        schemaVersion: 1, promotionState: 'human-gates-pending', trackId: batch.trackId, unitId: batch.unitId,
        contentVersion: batch.contentVersion, competencyIds: batch.competencyIds, sources: batch.sources,
        activities: batch.activities, checkpoint: batch.checkpoint, reinforcement: batch.reinforcement,
        claimProvenance: batch.claimProvenance, wide: batch.wide,
        approvals: { technical: 'pending', editorial: 'pending', accessibility: 'pending', rights: 'pending', schema: 'pending', product: 'pending' },
    }));
}
type Mutable<T> = { -readonly [K in keyof T]: Mutable<T[K]> };
function issuesAfter(mutate: (value: Mutable<EditorialWideCandidateV1>) => void): string[] {
    const value = candidate();
    mutate(value as Mutable<EditorialWideCandidateV1>);
    return validateEditorialCurriculumCandidate(value);
}
const interactionsOf = (steps: readonly LearningStepV2[]) => steps.flatMap(step => step.kind === 'interaction' ? [step.interaction] : []);

const IMAGE_A = 'image:rtg-2026:m01:radiografia-a';
const IMAGE_B = 'image:rtg-2026:m01:radiografia-b';
const licensedImage = (id: string) => ({
    id, file: `radiant-app/assets/content/rtg-2026/imagens/m01/${id.split(':').pop()}.jpg`,
    sourcePage: 'https://commons.wikimedia.org/wiki/File:Exemplo.jpg', author: 'Autoria de teste', license: 'CC0 1.0',
    licenseUrl: 'https://creativecommons.org/publicdomain/zero/1.0/', retrievedAt: '2026-11-07',
    sha256Original: 'a'.repeat(64), sha256Asset: 'b'.repeat(64), modification: 'redução',
    alt: 'Radiografia do tórax em tons de cinza.', width: 800, height: 1000,
});
/** A aula de teste com uma comparação entre duas imagens no lugar da segunda interação. */
function comparisonSource(): RtgUnitSource {
    const doc = JSON.parse(JSON.stringify(source));
    const old = doc.lessons[0].interactions[1];
    doc.lessons[0].interactions[1] = {
        id: old.id, type: 'comparison', role: 'practice', help: old.help, sourceIds: old.sourceIds,
        prompt: 'Qual destas duas radiografias foi feita em perfil?',
        options: [
            { label: 'Radiografia A', imageId: IMAGE_A, correct: false, feedback: 'Esta é a incidência de frente, ensinada no conceito.' },
            { label: 'Radiografia B', imageId: IMAGE_B, correct: true, feedback: 'Esta é a incidência em perfil, ensinada no conceito.' },
        ],
    };
    return doc;
}
function comparisonCandidate(): EditorialWideCandidateV1 {
    const built = buildRtgBatch(comparisonSource(), [licensedImage(IMAGE_A), licensedImage(IMAGE_B)]).batch;
    return JSON.parse(JSON.stringify({
        schemaVersion: 1, promotionState: 'human-gates-pending', trackId: built.trackId, unitId: built.unitId,
        contentVersion: built.contentVersion, competencyIds: built.competencyIds, sources: built.sources,
        activities: built.activities, checkpoint: built.checkpoint, reinforcement: built.reinforcement,
        claimProvenance: built.claimProvenance, wide: built.wide,
        approvals: { technical: 'pending', editorial: 'pending', accessibility: 'pending', rights: 'pending', schema: 'pending', product: 'pending' },
    }));
}
const comparisonIssuesAfter = (mutate: (value: Mutable<EditorialWideCandidateV1>) => void) => {
    const value = comparisonCandidate();
    mutate(value as Mutable<EditorialWideCandidateV1>);
    return validateEditorialCurriculumCandidate(value);
};
const COMPARISON = 'interaction:rtg-2026:m01:aula-01:i2';

describe('contrato amplo (wide)', () => {

    describe('imagem licenciada na comparação', () => {
        it('aceita CC0 e CC BY registradas, e a alternativa leva a imagem e o texto alternativo', () => {
            const value = comparisonCandidate();
            expect(validateEditorialCurriculumCandidate(value)).toEqual([]);
            const comparison = interactionsOf(value.activities[0].steps).find(interaction => interaction.id === COMPARISON);
            if (comparison?.type !== 'comparison') throw new Error('sem comparação');
            expect(comparison.payload.options.map(option => [option.imageRef, option.imageAlt])).toEqual([
                [IMAGE_A, 'Radiografia do tórax em tons de cinza.'], [IMAGE_B, 'Radiografia do tórax em tons de cinza.'],
            ]);
            expect(comparison.payload.correctOptionId).toBe(comparison.payload.options[1].id);
            expect(value.wide.images?.map(image => image.id)).toEqual([IMAGE_A, IMAGE_B]);
            expect(comparisonIssuesAfter(candidate => { candidate.wide.images![0].license = 'CC BY 4.0'; })).toEqual([]);
        });

        it.each(['CC BY-SA 4.0', 'CC BY-NC 4.0', 'CC BY-ND 4.0', 'GFDL', ''])('recusa a licença "%s"', license => {
            expect(comparisonIssuesAfter(candidate => { candidate.wide.images![0].license = license; }))
                .toEqual([`invalid-licensed-image:${IMAGE_A}`]);
        });

        it.each(['author', 'sourcePage', 'licenseUrl', 'alt', 'sha256Asset', 'sha256Original', 'modification'] as const)('recusa imagem sem %s', field => {
            expect(comparisonIssuesAfter(candidate => { candidate.wide.images![1][field] = ''; }))
                .toEqual([`invalid-licensed-image:${IMAGE_B}`]);
        });

        it('recusa comparação com imagem fora do registro', () => {
            expect(comparisonIssuesAfter(candidate => { candidate.wide.images = [candidate.wide.images![0]]; }))
                .toEqual([`unregistered-licensed-image:${COMPARISON}`]);
        });

        it('recusa comparação sem imagem em alguma alternativa', () => {
            expect(comparisonIssuesAfter(candidate => {
                const step = candidate.activities[0].steps.find(entry => entry.kind === 'interaction' && entry.interaction.id === COMPARISON);
                if (step?.kind !== 'interaction' || step.interaction.type !== 'comparison') throw new Error('sem comparação');
                delete step.interaction.payload.options[0].imageRef;
            })).toEqual([`unregistered-licensed-image:${COMPARISON}`, `unused-licensed-image:${IMAGE_A}`]);
        });

        it('recusa imagem registrada que nenhuma comparação usa', () => {
            expect(comparisonIssuesAfter(candidate => { candidate.wide.images!.push({ ...candidate.wide.images![0], id: 'image:rtg-2026:m01:sobrando' }); }))
                .toEqual(['unused-licensed-image:image:rtg-2026:m01:sobrando']);
        });

        it('o gerador recusa imagem desconhecida e deixa fora do lote a imagem de outra unidade', () => {
            expect(() => buildRtgBatch(comparisonSource(), [licensedImage(IMAGE_A)])).toThrow(`rtg-unknown-image:${IMAGE_B}`);
            const built = buildRtgBatch(comparisonSource(), [licensedImage(IMAGE_A), licensedImage(IMAGE_B), licensedImage('image:rtg-2026:m08:outra')]).batch;
            expect(built.wide?.images?.map(image => image.id)).toEqual([IMAGE_A, IMAGE_B]);
        });
    });
    it('aceita aulas de cinco interações de três famílias, com fonte de consulta', () => {
        const value = candidate();
        expect(validateEditorialCurriculumCandidate(value)).toEqual([]);
        // Validade do que foi aceito: o controle só vale se o material for mesmo o do contrato amplo.
        for (const activity of value.activities) {
            const interactions = interactionsOf(activity.steps);
            expect(interactions).toHaveLength(5);
            expect(new Set(interactions.map(interaction => interaction.type)).size).toBeGreaterThanOrEqual(3);
            expect(interactions.every(interaction => (WIDE_ACTIVITY_FAMILIES as readonly string[]).includes(interaction.type))).toBe(true);
        }
        expect(value.sources.map(entry => (entry as { use?: string }).use).sort()).toEqual(['cc-by-4.0', 'factual-reference']);
    });

    it('sem `wide`, o mesmo material continua recusado pelo contrato v1', () => {
        const issues = issuesAfter(value => { delete (value as { wide?: unknown }).wide; });
        expect(issues).toContain(`unsupported-activity-family:${ACTIVITY}`);
        expect(issues).toContain('invalid-source-metadata');
    });

    it('recusa nove interações e também duas', () => {
        const nine = issuesAfter(value => {
            const steps = value.activities[0].steps;
            const first = steps.find(step => step.kind === 'interaction')!;
            const extras = Array.from({ length: 4 }, (_, index) => {
                const copy = JSON.parse(JSON.stringify(first));
                copy.interaction.id = `interaction:rtg-2026:m01:aula-01:extra-${index + 1}`;
                copy.interaction.payload.options.forEach((option: { id: string }, at: number) => { option.id = `option:rtg-2026:m01:aula-01:extra-${index + 1}:${at}`; });
                copy.interaction.payload.correctOptionId = copy.interaction.payload.options[0].id;
                return copy;
            });
            steps.splice(steps.length - 1, 0, ...extras);
            expect(interactionsOf(steps as LearningStepV2[])).toHaveLength(9);
        });
        expect(nine).toContain(`invalid-wide-interaction-count:${ACTIVITY}`);
        const two = issuesAfter(value => {
            const steps = value.activities[0].steps;
            const kept = steps.filter(step => step.kind === 'interaction').slice(0, 2);
            value.activities[0].steps = steps.filter(step => step.kind !== 'interaction' || kept.includes(step));
        });
        expect(two).toContain(`invalid-wide-interaction-count:${ACTIVITY}`);
    });

    it('recusa `hotspot`, que depende de ativo que esta etapa não tem', () => {
        const issues = issuesAfter(value => {
            const step = value.activities[0].steps.find(entry => entry.kind === 'interaction' && entry.interaction.type === 'ordering');
            if (step?.kind !== 'interaction') throw new Error('fixture sem ordenação');
            const { id, competencyIds, evidenceKind, completionRule, criticalSafety, feedback, accessibility } = step.interaction;
            (step as { interaction: unknown }).interaction = {
                id, competencyIds, evidenceKind, completionRule, criticalSafety, feedback, accessibility, type: 'hotspot',
                payload: { prompt: 'Toque na região indicada.', imageRef: 'https://example.org/sem-ativo.png',
                    regions: [{ id: 'region:rtg-2026:m01:aula-01:r1', label: 'Região', x: 0.1, y: 0.1, width: 0.2, height: 0.2 }],
                    correctRegionIds: ['region:rtg-2026:m01:aula-01:r1'] },
            };
        });
        expect(issues).toContain(`unsupported-activity-family:${ACTIVITY}`);
    });

    it('recusa fonte sem `use`, com `use` fora da lista e com hash de corpo recuperado', () => {
        const id = batch.sources[0].id;
        expect(issuesAfter(value => { delete (value.sources[0] as { use?: string }).use; })).toContain(`invalid-source-metadata:${id}`);
        expect(issuesAfter(value => { (value.sources[0] as { use: string }).use = 'cc-by-nc-4.0'; })).toContain(`invalid-source-metadata:${id}`);
        expect(issuesAfter(value => { (value.sources[0] as Record<string, unknown>).retrievedMaterialSha256 = 'a'.repeat(64); }))
            .toContain(`invalid-source-metadata:${id}`);
        expect(issuesAfter(value => { (value.sources[0] as { url: string }).url = 'http://example.org/sem-tls'; })).toContain(`invalid-source-metadata:${id}`);
    });

    it('recusa imagem em alternativa e interação que não exige confirmação', () => {
        const interaction = interactionsOf(batch.activities[0].steps)[0];
        expect(issuesAfter(value => {
            const target = interactionsOf(value.activities[0].steps as LearningStepV2[])[0];
            if (target.type === 'multiple-choice') target.payload.options[0].imageRef = 'https://example.org/figura.png';
        })).toContain(`unsupported-wide-payload:${interaction.id}`);
        expect(issuesAfter(value => { interactionsOf(value.activities[0].steps as LearningStepV2[])[0].completionRule = 'answered'; }))
            .toContain(`unconfirmed-wide-interaction:${interaction.id}`);
    });

    it('exige um par de recuperação por competência, com proveniência por afirmação', () => {
        const competency = batch.competencyIds[0];
        expect(issuesAfter(value => { value.wide!.recovery.shift(); })).toContain(`missing-wide-recovery:${competency}`);
        expect(issuesAfter(value => { value.wide!.recovery[0].guided.sourceIds = []; })).toContain(`invalid-wide-recovery:${competency}`);
        const guided = batch.wide!.recovery[0].guided;
        expect(issuesAfter(value => { value.claimProvenance = value.claimProvenance.filter(claim => claim.claimId !== `${guided.id}:prompt`); }))
            .toContain(`missing-claim-provenance:${guided.id}:prompt`);
        expect(issuesAfter(value => { value.wide!.recovery[0].transfer.id = value.checkpoint.items[0].id; }))
            .toContain(`duplicate-identity:${batch.checkpoint.items[0].id}`);
    });

    it('mantém identidade única, resposta constante e viés de posição do contrato genérico', () => {
        const competency = batch.competencyIds[0];
        expect(issuesAfter(value => {
            const items = value.checkpoint.items.filter(item => item.competencyIds.includes(competency));
            const label = (item: typeof items[number]) => item.options.find(option => option.id === item.correctOptionId)!;
            label(items[1]).label = label(items[0]).label;
        })).toContain(`checkpoint-constant-answer:${competency}`);
        expect(issuesAfter(value => {
            for (const item of value.checkpoint.items) {
                const at = item.options.findIndex(option => option.id === item.correctOptionId);
                item.options.unshift(...item.options.splice(at, 1));
            }
        })).toContain('checkpoint-answer-position-bias');
        expect(issuesAfter(value => { value.trackId = 'track:outro-espaco:m01'; })).toContain('invalid-wide-identity:track:outro-espaco:m01');
        expect(issuesAfter(value => { (value as { pilot?: unknown }).pilot = { schemaVersion: 1, namespace: 'rtg-2026', assets: [], evidence: [] }; }))
            .toContain('conflicting-contract-extensions');
    });

    it('o hash do material cobre a extensão, e o lote amplo exige batchId do espaço rtg-2026', () => {
        const base = candidate();
        const changed = candidate() as Mutable<EditorialWideCandidateV1>;
        changed.wide!.recovery[0].hook = `${changed.wide!.recovery[0].hook} Depois confira de novo.`;
        const hashes = [fingerprintProductionBatchMaterial(base), fingerprintProductionBatchMaterial(changed as EditorialWideCandidateV1)];
        expect(hashes[0]).toBe(batch.materialSha256);
        expect(hashes[1]).not.toBe(hashes[0]);
        expect(hashes.every(hash => /^[a-f0-9]{64}$/.test(hash))).toBe(true);
        const draft: ProductionBatchDraftV1 = {
            schemaVersion: 1, state: 'ready-for-promotion', batchId: 'batch:outro:m01', materialSha256: hashes[0],
            schemaRefs: batch.schemaRefs, media: [], candidate: base, approvals: batch.approvals,
        };
        expect(validateProductionBatchDraft(draft)).toEqual(['invalid-wide-batch-identity']);
        expect(validateProductionBatchDraft({ ...draft, batchId: batch.batchId })).toEqual([]);
    });
});
