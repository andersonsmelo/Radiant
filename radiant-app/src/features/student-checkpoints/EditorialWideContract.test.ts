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

/** A aula de teste com as quatro famílias da 1.6 no lugar de i2 a i5 (i1 continua múltipla escolha). */
function newFamiliesSource(): RtgUnitSource {
    const doc = JSON.parse(JSON.stringify(source));
    const [, ...old] = doc.lessons[0].interactions;
    const keep = (index: number) => ({ id: old[index].id, role: old[index].role, help: old[index].help, sourceIds: old[index].sourceIds,
        ...(old[index].criticalSafety ? { criticalSafety: true } : {}) });
    doc.lessons[0].interactions.splice(1, 4,
        { ...keep(0), type: 'cloze', prompt: 'Complete a frase com as palavras do banco.', text: 'O {{1}} reduz a dose no {{2}}.',
            answers: ['avental', 'tronco'], distractors: ['relógio', 'cabelo'],
            feedbackCorrect: 'Você completou: o avental protege o tronco, como no conceito.',
            feedbackIncorrect: 'Releia o conceito: o avental cobre o tronco, onde estão os órgãos mais sensíveis.' },
        { ...keep(1), type: 'true-false', prompt: 'Julgue cada afirmação sobre a proteção.',
            statements: [
                { text: 'A distância da fonte reduz a dose recebida.', correct: true, feedback: 'Certo: quanto mais longe da fonte, menor a dose.' },
                { text: 'O dosímetro reduz a dose de quem o usa.', correct: false, feedback: 'Errado: o dosímetro mede a dose, não protege.' },
                { text: 'O avental cobre o tronco durante o exame.', correct: true, feedback: 'Certo: o avental cobre a região do tronco.' },
            ],
            feedbackCorrect: 'Você julgou as três afirmações como a fonte descreve.',
            feedbackIncorrect: 'Releia o conceito e compare cada afirmação com ele.' },
        { ...keep(2), type: 'categorize', prompt: 'Classifique cada ação no grupo certo.', categories: ['Tarefa técnica', 'Decisão clínica'],
            items: [
                { label: 'Posicionar o paciente', category: 'Tarefa técnica' }, { label: 'Ajustar o campo', category: 'Tarefa técnica' },
                { label: 'Escrever o laudo', category: 'Decisão clínica' }, { label: 'Indicar o exame', category: 'Decisão clínica' },
            ],
            feedbackCorrect: 'Você separou o que produz a imagem do que decide sobre ela.',
            feedbackIncorrect: 'Pergunte de cada ação: ela produz a imagem ou decide algo a partir dela?' },
        { ...keep(3), type: 'multi-select', prompt: 'Marque todas as medidas que reduzem a dose.',
            options: [
                { label: 'Usar o dosímetro', correct: false, feedback: 'O dosímetro mede a dose; não reduz.' },
                { label: 'Aumentar a distância', correct: true, feedback: 'A distância reduz a dose recebida.' },
                { label: 'Apressar o paciente', correct: false, feedback: 'Pressa não é medida de proteção.' },
                { label: 'Vestir o avental', correct: true, feedback: 'O avental reduz a dose no tronco.' },
            ],
            feedbackCorrect: 'Você marcou as duas medidas de proteção e deixou de fora as outras.',
            feedbackIncorrect: 'Releia o conceito: proteção é o que diminui a dose, não o que a mede.' },
    );
    return doc;
}
function newFamiliesCandidate(): EditorialWideCandidateV1 {
    const built = buildRtgBatch(newFamiliesSource()).batch;
    return JSON.parse(JSON.stringify({
        schemaVersion: 1, promotionState: 'human-gates-pending', trackId: built.trackId, unitId: built.unitId,
        contentVersion: built.contentVersion, competencyIds: built.competencyIds, sources: built.sources,
        activities: built.activities, checkpoint: built.checkpoint, reinforcement: built.reinforcement,
        claimProvenance: built.claimProvenance, wide: built.wide,
        approvals: { technical: 'pending', editorial: 'pending', accessibility: 'pending', rights: 'pending', schema: 'pending', product: 'pending' },
    }));
}
const NEW = (index: number) => `interaction:rtg-2026:m01:aula-01:i${index}`;
function newFamilyIssuesAfter(id: string, mutate: (interaction: Mutable<import('../../types/learningActivity').LearningInteractionV2>) => void) {
    const value = newFamiliesCandidate();
    const step = value.activities[0].steps.find(entry => entry.kind === 'interaction' && entry.interaction.id === id);
    if (step?.kind !== 'interaction') throw new Error(`sem ${id}`);
    mutate(step.interaction as Mutable<import('../../types/learningActivity').LearningInteractionV2>);
    return validateEditorialCurriculumCandidate(value);
}

describe('contrato amplo: famílias da 1.6', () => {
    it('as quatro famílias entram no contrato, e o lote gerado com elas é válido', () => {
        expect(WIDE_ACTIVITY_FAMILIES).toEqual(expect.arrayContaining(['cloze', 'true-false', 'categorize', 'multi-select']));
        const value = newFamiliesCandidate();
        expect(validateEditorialCurriculumCandidate(value)).toEqual([]);
        expect(interactionsOf(value.activities[0].steps).map(interaction => interaction.type))
            .toEqual(['multiple-choice', 'cloze', 'true-false', 'categorize', 'multi-select']);
    });

    it('o gerador embaralha o banco do cloze e intercala os grupos da categorização, sem perder a validade', () => {
        const [, cloze, , categorize] = interactionsOf(newFamiliesCandidate().activities[0].steps);
        if (cloze.type !== 'cloze' || categorize.type !== 'categorize') throw new Error('famílias fora do lugar');
        const answers = cloze.payload.blanks.map(blank => blank.correctTokenId);
        expect(cloze.payload.tokens.slice(0, answers.length).map(token => token.id)).not.toEqual(answers);
        expect(cloze.payload.tokens).toHaveLength(4);
        const changes = categorize.payload.items.slice(1).filter((item, index) => item.categoryId !== categorize.payload.items[index].categoryId).length;
        expect(changes).toBeGreaterThan(categorize.payload.categories.length - 1);
        expect(new Set(categorize.payload.items.map(item => item.id)).size).toBe(4);
    });

    it('proveniência por afirmação: distrator do banco e alternativa errada são autorais, o resto cita a fonte', () => {
        const value = newFamiliesCandidate();
        const claims = new Map(value.claimProvenance.map(claim => [claim.claimId, claim]));
        const [, cloze, trueFalse, categorize, multi] = interactionsOf(value.activities[0].steps);
        if (cloze.type !== 'cloze' || multi.type !== 'multi-select' || trueFalse.type !== 'true-false' || categorize.type !== 'categorize') throw new Error('famílias fora do lugar');
        const answers = new Set(cloze.payload.blanks.map(blank => blank.correctTokenId));
        cloze.payload.tokens.forEach(token => expect(claims.get(token.id)?.provenanceKind).toBe(answers.has(token.id) ? 'source-backed' : 'authorial-distractor'));
        multi.payload.options.forEach(option => expect(claims.get(option.id)?.provenanceKind)
            .toBe(multi.payload.correctOptionIds.includes(option.id) ? 'source-backed' : 'authorial-distractor'));
        [...trueFalse.payload.statements, ...categorize.payload.items].forEach(entry => expect(claims.get(entry.id)?.sourceIds.length).toBeGreaterThan(0));
    });

    it('cloze: wide-answer-position-bias', () => {
        expect(newFamilyIssuesAfter(NEW(2), interaction => {
            if (interaction.type !== 'cloze') throw new Error();
            const answers = interaction.payload.blanks.map(blank => blank.correctTokenId);
            interaction.payload.tokens.sort((a, b) => Number(answers.includes(b.id)) - Number(answers.includes(a.id))
                || answers.indexOf(a.id) - answers.indexOf(b.id));
        })).toEqual([`wide-answer-position-bias:${NEW(2)}`]);
    });

    it('cloze: wide-longest-is-correct', () => {
        expect(newFamilyIssuesAfter(NEW(2), interaction => {
            if (interaction.type !== 'cloze') throw new Error();
            const answer = interaction.payload.tokens.find(token => token.id === interaction.payload.blanks[0].correctTokenId)!;
            answer.label = 'avental plumbífero de corpo inteiro';
        })).toEqual([`wide-longest-is-correct:${NEW(2)}`]);
    });

    it('cloze: invalid-wide-shape', () => {
        expect(newFamilyIssuesAfter(NEW(2), interaction => {
            if (interaction.type !== 'cloze') throw new Error();
            const answers = interaction.payload.blanks.map(blank => blank.correctTokenId);
            interaction.payload.tokens = interaction.payload.tokens.filter(token => answers.includes(token.id) || token.label === 'cabelo');
        })).toContain(`invalid-wide-shape:${NEW(2)}`);
    });

    it('true-false: wide-constant-answer', () => {
        expect(newFamilyIssuesAfter(NEW(3), interaction => {
            if (interaction.type !== 'true-false') throw new Error();
            interaction.payload.statements.forEach(statement => { statement.isTrue = true; });
        })).toEqual([`wide-constant-answer:${NEW(3)}`]);
    });

    it('true-false: wide-longest-is-correct', () => {
        expect(newFamilyIssuesAfter(NEW(3), interaction => {
            if (interaction.type !== 'true-false') throw new Error();
            interaction.payload.statements[0].text = 'A distância da fonte reduz a dose recebida, porque a radiação se espalha e perde intensidade.';
        })).toEqual([`wide-longest-is-correct:${NEW(3)}`]);
    });

    it('categorize: wide-answer-position-bias', () => {
        expect(newFamilyIssuesAfter(NEW(4), interaction => {
            if (interaction.type !== 'categorize') throw new Error();
            const order = interaction.payload.categories.map(category => category.id);
            interaction.payload.items.sort((a, b) => order.indexOf(a.categoryId) - order.indexOf(b.categoryId));
        })).toEqual([`wide-answer-position-bias:${NEW(4)}`]);
    });

    it('categorize: wide-label-gives-answer', () => {
        expect(newFamilyIssuesAfter(NEW(4), interaction => {
            if (interaction.type !== 'categorize') throw new Error();
            interaction.payload.items[0].label = `${interaction.payload.items[0].label} (decisão clínica)`;
        })).toEqual([`wide-label-gives-answer:${NEW(4)}`]);
    });

    it('categorize: invalid-wide-shape', () => {
        expect(newFamilyIssuesAfter(NEW(4), interaction => {
            if (interaction.type !== 'categorize') throw new Error();
            interaction.payload.items.forEach(item => { item.categoryId = interaction.payload.categories[0].id; });
        })).toContain(`invalid-wide-shape:${NEW(4)}`);
    });

    it('multi-select: wide-constant-answer', () => {
        expect(newFamilyIssuesAfter(NEW(5), interaction => {
            if (interaction.type !== 'multi-select') throw new Error();
            interaction.payload.correctOptionIds = interaction.payload.correctOptionIds.slice(0, 1);
        })).toContain(`wide-constant-answer:${NEW(5)}`);
    });

    it('multi-select: wide-answer-position-bias', () => {
        expect(newFamilyIssuesAfter(NEW(5), interaction => {
            if (interaction.type !== 'multi-select') throw new Error();
            const correct = interaction.payload.correctOptionIds;
            interaction.payload.options.sort((a, b) => Number(correct.includes(b.id)) - Number(correct.includes(a.id)));
        })).toEqual([`wide-answer-position-bias:${NEW(5)}`]);
    });

    it('multi-select: wide-longest-is-correct', () => {
        expect(newFamilyIssuesAfter(NEW(5), interaction => {
            if (interaction.type !== 'multi-select') throw new Error();
            const option = interaction.payload.options.find(entry => entry.id === interaction.payload.correctOptionIds[0])!;
            option.label = 'Aumentar a distância entre a fonte e quem está na sala';
        })).toEqual([`wide-longest-is-correct:${NEW(5)}`]);
    });

    it('nas quatro famílias, o retorno do erro precisa ser diferente do retorno do acerto', () => {
        for (const index of [2, 3, 4, 5]) {
            expect(newFamilyIssuesAfter(NEW(index), interaction => { interaction.feedback.incorrect = interaction.feedback.correct; }))
                .toEqual([`wide-feedback-not-distinct:${NEW(index)}`]);
        }
    });
});
