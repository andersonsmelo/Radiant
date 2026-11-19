import { readFileSync } from 'fs';
import { resolve } from 'path';
import { validateEditorialCurriculumCandidate, type EditorialWideCandidateV1 } from './EditorialCurriculumCandidate';
import { WIDE_ACTIVITY_FAMILIES } from './EditorialWideContract';
import { fingerprintProductionBatchMaterial, validateProductionBatchDraft, type ProductionBatchDraftV1 } from './ProductionBatch';
import { buildRtgBatch, categorizeDisplayOrder, clozeBankOrder, labelBankOrder, seededDisplayOrder, type RtgUnitSource } from './batches/rtgBatchFactory';
import { isGroupOrderBiased } from './EditorialWideContract';
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

    describe('hotspot (fase B)', () => {
        const REGIONS = [
            { label: 'Fonte de raios X', x: 0.1, y: 0.1, width: 0.2, height: 0.2, correct: true as const },
            { label: 'Detector plano', x: 0.6, y: 0.1, width: 0.2, height: 0.2 },
            { label: 'Paciente', x: 0.1, y: 0.6, width: 0.2, height: 0.2 },
        ];
        function hotspotCandidate(figure: { imageId?: string; diagramId?: string }, images: ReturnType<typeof licensedImage>[] = []): EditorialWideCandidateV1 {
            const doc = JSON.parse(JSON.stringify(source));
            const old = doc.lessons[0].interactions[1];
            doc.lessons[0].interactions[1] = {
                id: old.id, type: 'hotspot', role: 'practice', help: old.help, sourceIds: old.sourceIds, ...figure, regions: REGIONS,
                prompt: 'Toque na parte que produz o feixe de raios X.',
                feedbackCorrect: 'Isso mesmo: o tubo é a fonte que produz o feixe.', feedbackIncorrect: 'Não é essa parte: procure onde o feixe nasce, no tubo.',
            };
            const built = buildRtgBatch(doc, images).batch;
            return JSON.parse(JSON.stringify({
                schemaVersion: 1, promotionState: 'human-gates-pending', trackId: built.trackId, unitId: built.unitId,
                contentVersion: built.contentVersion, competencyIds: built.competencyIds, sources: built.sources,
                activities: built.activities, checkpoint: built.checkpoint, reinforcement: built.reinforcement,
                claimProvenance: built.claimProvenance, wide: built.wide,
                approvals: { technical: 'pending', editorial: 'pending', accessibility: 'pending', rights: 'pending', schema: 'pending', product: 'pending' },
            }));
        }
        const hotspotOf = (value: EditorialWideCandidateV1) => interactionsOf(value.activities[0].steps).find(interaction => interaction.type === 'hotspot')!;
        const issuesOf = (value: EditorialWideCandidateV1, mutate: (value: Mutable<EditorialWideCandidateV1>) => void = () => {}) => {
            mutate(value as Mutable<EditorialWideCandidateV1>);
            return validateEditorialCurriculumCandidate(value);
        };

        it('aceita hotspot sobre imagem licenciada e conta a imagem como usada', () => {
            const value = hotspotCandidate({ imageId: IMAGE_A }, [licensedImage(IMAGE_A)]);
            expect(issuesOf(value)).toEqual([]);
            expect(value.wide.images?.map(image => image.id)).toEqual([IMAGE_A]);
        });

        it('aceita hotspot sobre diagrama, sem imagem no cadastro', () => {
            const value = hotspotCandidate({ diagramId: 'tubo-raios-x' });
            expect(issuesOf(value)).toEqual([]);
            expect(value.wide.images).toBeUndefined();
            expect((hotspotOf(value) as { payload: { imageRef: string } }).payload.imageRef).toBe('diagram:tubo-raios-x');
        });

        it('recusa imagem fora do cadastro e diagrama fora do registro', () => {
            const value = hotspotCandidate({ diagramId: 'tubo-raios-x' });
            const id = hotspotOf(value).id;
            expect(issuesOf((JSON.parse(JSON.stringify(value)) as EditorialWideCandidateV1), draft => {
                (hotspotOf(draft as EditorialWideCandidateV1) as { payload: { imageRef: string } }).payload.imageRef = 'https://example.org/sem-ativo.png';
            })).toContain(`unregistered-licensed-image:${id}`);
            expect(issuesOf((JSON.parse(JSON.stringify(value)) as EditorialWideCandidateV1), draft => {
                (hotspotOf(draft as EditorialWideCandidateV1) as { payload: { imageRef: string } }).payload.imageRef = 'diagram:nao-existe';
            })).toContain(`unregistered-diagram:${id}`);
        });

        it('mantém as chaves exatas do payload e exige rótulo em toda região', () => {
            const value = hotspotCandidate({ diagramId: 'tubo-raios-x' });
            const id = hotspotOf(value).id;
            expect(issuesOf((JSON.parse(JSON.stringify(value)) as EditorialWideCandidateV1), draft => {
                (hotspotOf(draft as EditorialWideCandidateV1) as { payload: Record<string, unknown> }).payload.visual = 'extra';
            })).toContain(`unsupported-wide-payload:${id}`);
            expect(issuesOf((JSON.parse(JSON.stringify(value)) as EditorialWideCandidateV1), draft => {
                (hotspotOf(draft as EditorialWideCandidateV1) as { payload: { regions: { label: string }[] } }).payload.regions[0].label = ' ';
            })).toContain(`unsupported-wide-payload:${id}`);
        });
    });

    describe('label (fase B)', () => {
        const POINTS = [
            { label: 'Cátodo com filamento', x: 0.28, y: 0.44, where: 'à esquerda, a espiral dentro da capa' }, { label: 'Ânodo', x: 0.72, y: 0.44, where: 'à direita, o bloco inclinado atingido pelos elétrons' },
            { label: 'Janela de saída', x: 0.68, y: 0.71, where: 'embaixo à direita, a abertura no vidro' }, { label: 'Ampola de vidro', x: 0.375, y: 0.71, where: 'a parede curva que envolve todo o conjunto' },
        ];
        function labelCandidate(): EditorialWideCandidateV1 {
            const doc = JSON.parse(JSON.stringify(source));
            const old = doc.lessons[0].interactions[1];
            doc.lessons[0].interactions[1] = {
                id: old.id, type: 'label', role: 'practice', help: old.help, sourceIds: old.sourceIds, diagramId: 'tubo-raios-x',
                points: POINTS, distractors: ['Fio de aterramento'], prompt: 'Rotule as quatro partes do tubo de raios X.',
                feedbackCorrect: 'Isso mesmo: cada parte do tubo tem a sua função.', feedbackIncorrect: 'Alguma parte está no lugar errado: releia o tubo.',
            };
            const built = buildRtgBatch(doc).batch;
            return JSON.parse(JSON.stringify({
                schemaVersion: 1, promotionState: 'human-gates-pending', trackId: built.trackId, unitId: built.unitId,
                contentVersion: built.contentVersion, competencyIds: built.competencyIds, sources: built.sources,
                activities: built.activities, checkpoint: built.checkpoint, reinforcement: built.reinforcement,
                claimProvenance: built.claimProvenance, wide: built.wide,
                approvals: { technical: 'pending', editorial: 'pending', accessibility: 'pending', rights: 'pending', schema: 'pending', product: 'pending' },
            }));
        }
        const ID = 'interaction:rtg-2026:m01:aula-01:i2';
        const labelOf = (value: EditorialWideCandidateV1) => {
            const found = interactionsOf(value.activities[0].steps).find(interaction => interaction.id === ID);
            if (found?.type !== 'label') throw new Error('sem label');
            return found as Mutable<typeof found>;
        };
        const issuesWith = (mutate: (interaction: ReturnType<typeof labelOf>) => void) => {
            const value = labelCandidate();
            mutate(labelOf(value));
            return validateEditorialCurriculumCandidate(value);
        };

        it('aceita rótulo sobre diagrama, com a figura em imageRef, e as fichas nunca na ordem dos pontos', () => {
            const value = labelCandidate();
            expect(validateEditorialCurriculumCandidate(value)).toEqual([]);
            const { payload } = labelOf(value);
            expect(payload.imageRef).toBe('diagram:tubo-raios-x');
            expect(payload.points).toHaveLength(4);
            expect(payload.labels).toHaveLength(5);
            const correct = new Set(payload.points.map(point => point.correctLabelId));
            expect(payload.labels.filter(entry => correct.has(entry.id)).map(entry => entry.id)).not.toEqual(payload.points.map(point => point.correctLabelId));
            expect(payload.points.every(point => Object.keys(point).sort().join() === 'correctLabelId,id,where,x,y')).toBe(true);
        });

        it('mantém as chaves exatas do payload e exige texto em todo rótulo', () => {
            expect(issuesWith(interaction => { (interaction.payload as Record<string, unknown>).visual = 'extra'; })).toContain(`unsupported-wide-payload:${ID}`);
            expect(issuesWith(interaction => { interaction.payload.labels[0].label = ' '; })).toContain(`unsupported-wide-payload:${ID}`);
        });

        it('wide-answer-position-bias: as fichas certas na ordem dos pontos entregam a resposta', () => {
            expect(issuesWith(interaction => {
                const order = interaction.payload.points.map(point => point.correctLabelId);
                const shown = interaction.payload.labels;
                interaction.payload.labels = [...order.map(id => shown.find(entry => entry.id === id)!), ...shown.filter(entry => !order.includes(entry.id))];
            })).toEqual([`wide-answer-position-bias:${ID}`]);
        });

        it('invalid-wide-shape: ficha repetida, ficha certa fora do banco, rótulo duplicado e distratores demais', () => {
            expect(issuesWith(interaction => { interaction.payload.labels[0].label = interaction.payload.labels[1].label; })).toContain(`invalid-wide-shape:${ID}`);
            expect(issuesWith(interaction => { interaction.payload.points[0].correctLabelId = 'label:rtg-2026:m01:fora'; })).toContain(`invalid-wide-shape:${ID}`);
            expect(issuesWith(interaction => { interaction.payload.points[1].correctLabelId = interaction.payload.points[0].correctLabelId; })).toContain(`invalid-wide-shape:${ID}`);
            expect(issuesWith(interaction => {
                interaction.payload.labels.push(...['Mola', 'Cabo'].map(label => ({ id: `label:rtg-2026:m01:aula-01:i2:${label}`, label })));
            })).toContain(`invalid-wide-shape:${ID}`);
            expect(issuesWith(interaction => { interaction.payload.points.splice(2); })).toContain(`invalid-wide-shape:${ID}`);
        });

        it('invalid-wide-shape: ponto sem where', () => {
            expect(issuesWith(interaction => { interaction.payload.points[0].where = ' '; })).toContain(`invalid-wide-shape:${ID}`);
        });

        it('wide-feedback-not-distinct: o retorno de erro precisa de explicação própria', () => {
            expect(issuesWith(interaction => { interaction.feedback.incorrect = interaction.feedback.correct; })).toEqual([`wide-feedback-not-distinct:${ID}`]);
        });

        it.each([[3, 0], [4, 1], [6, 2], [3, 2]])('o gerador nunca abre as fichas na ordem dos pontos: %i pontos e %i distratores', (points: number, extras: number) => {
            const ids = [...Array.from({ length: points }, (_, index) => `c${index}`), ...Array.from({ length: extras }, (_, index) => `d${index}`)];
            const labels = ids.map(id => ({ id, label: id }));
            const correct = ids.slice(0, points);
            for (let seed = 0; seed < 300; seed += 1) {
                const shown = labelBankOrder(labels, correct, `seed-${seed}`);
                expect(shown.map(entry => entry.id).sort()).toEqual([...ids].sort());
                expect(shown.map(entry => entry.id).filter(id => correct.includes(id))).not.toEqual(correct);
            }
        });
    });

    describe('risk-hunt (fase B)', () => {
        const REGIONS = [
            { label: 'Porta da sala aberta', x: 0.02, y: 0.08, width: 0.15, height: 0.82, risk: true, feedback: 'A porta aberta com a lâmpada acesa expõe o corredor.' },
            { label: 'Operador atrás do biombo', x: 0.7, y: 0.43, width: 0.17, height: 0.47, risk: false, feedback: 'Atrás do biombo o operador fica protegido.' },
            { label: 'Campo de luz sobre o paciente inteiro', x: 0.18, y: 0.26, width: 0.33, height: 0.4, risk: true, feedback: 'Um campo que cobre o paciente expõe tecido à toa.' },
            { label: 'Acompanhante ao lado da mesa', x: 0.56, y: 0.45, width: 0.1, height: 0.45, risk: true, feedback: 'Quem fica ao lado da mesa recebe radiação espalhada.' },
            { label: 'Avental no suporte', x: 0.85, y: 0.17, width: 0.11, height: 0.24, risk: false, feedback: 'O avental guardado no suporte não expõe ninguém.' },
        ];
        const ID = 'interaction:rtg-2026:m01:aula-01:i2';
        function riskCandidate(): EditorialWideCandidateV1 {
            const doc = JSON.parse(JSON.stringify(source));
            const old = doc.lessons[0].interactions[1];
            doc.lessons[0].interactions[1] = {
                id: old.id, type: 'risk-hunt', role: 'safety', criticalSafety: true, help: old.help, sourceIds: old.sourceIds, diagramId: 'sala-com-riscos',
                regions: REGIONS, prompt: 'Toque em todas as situações de risco da sala.',
                feedbackCorrect: 'Isso mesmo: você achou os riscos e deixou o que está certo.', feedbackIncorrect: 'Releia a cena: algum risco ficou de fora.',
            };
            const built = buildRtgBatch(doc).batch;
            return JSON.parse(JSON.stringify({
                schemaVersion: 1, promotionState: 'human-gates-pending', trackId: built.trackId, unitId: built.unitId,
                contentVersion: built.contentVersion, competencyIds: built.competencyIds, sources: built.sources,
                activities: built.activities, checkpoint: built.checkpoint, reinforcement: built.reinforcement,
                claimProvenance: built.claimProvenance, wide: built.wide,
                approvals: { technical: 'pending', editorial: 'pending', accessibility: 'pending', rights: 'pending', schema: 'pending', product: 'pending' },
            }));
        }
        const riskOf = (value: EditorialWideCandidateV1) => {
            const found = interactionsOf(value.activities[0].steps).find(interaction => interaction.id === ID);
            if (found?.type !== 'risk-hunt') throw new Error('sem risk-hunt');
            return found as Mutable<typeof found>;
        };
        const issuesWith = (mutate: (interaction: ReturnType<typeof riskOf>) => void) => {
            const value = riskCandidate();
            mutate(riskOf(value));
            return validateEditorialCurriculumCandidate(value);
        };

        it('aceita caça ao erro sobre diagrama, com a explicação em cada região e os riscos por id', () => {
            const value = riskCandidate();
            expect(validateEditorialCurriculumCandidate(value)).toEqual([]);
            const { payload } = riskOf(value);
            expect(payload.imageRef).toBe('diagram:sala-com-riscos');
            expect(payload.regions).toHaveLength(5);
            expect(payload.regions.every(region => region.explanation.length > 0)).toBe(true);
            expect(payload.riskRegionIds).toEqual(payload.regions.filter(region => ['Porta da sala aberta', 'Campo de luz sobre o paciente inteiro', 'Acompanhante ao lado da mesa'].includes(region.label)).map(region => region.id));
            expect(value.wide.images).toBeUndefined();
        });

        it('mantém as chaves exatas do payload, exige texto e figura registrada', () => {
            expect(issuesWith(interaction => { (interaction.payload as Record<string, unknown>).visual = 'extra'; })).toContain(`unsupported-wide-payload:${ID}`);
            expect(issuesWith(interaction => { interaction.payload.regions[0].label = ' '; })).toContain(`unsupported-wide-payload:${ID}`);
            expect(issuesWith(interaction => { interaction.payload.imageRef = 'diagram:nao-existe'; })).toContain(`unregistered-diagram:${ID}`);
            expect(issuesWith(interaction => { interaction.payload.imageRef = 'https://example.org/sem-ativo.png'; })).toContain(`unregistered-licensed-image:${ID}`);
        });

        it('wide-constant-answer: todas as regiões de risco, ou menos de duas', () => {
            expect(issuesWith(interaction => { interaction.payload.riskRegionIds = interaction.payload.regions.map(region => region.id); })).toContain(`wide-constant-answer:${ID}`);
            expect(issuesWith(interaction => { interaction.payload.riskRegionIds = interaction.payload.riskRegionIds.slice(0, 1); })).toContain(`wide-constant-answer:${ID}`);
        });

        it('invalid-wide-shape: região a menos, rótulo duplicado, explicação vazia ou repetida, risco fora das regiões', () => {
            expect(issuesWith(interaction => { interaction.payload.regions.splice(3); interaction.payload.riskRegionIds.splice(3); })).toContain(`invalid-wide-shape:${ID}`);
            expect(issuesWith(interaction => { interaction.payload.regions[1].label = interaction.payload.regions[0].label; })).toContain(`invalid-wide-shape:${ID}`);
            expect(issuesWith(interaction => { interaction.payload.regions[1].explanation = ' '; })).toContain(`invalid-wide-shape:${ID}`);
            expect(issuesWith(interaction => { interaction.payload.regions[1].explanation = interaction.payload.regions[0].explanation; })).toContain(`invalid-wide-shape:${ID}`);
            expect(issuesWith(interaction => { interaction.payload.riskRegionIds[0] = 'region:rtg-2026:m01:fora'; })).toContain(`invalid-wide-shape:${ID}`);
        });

        it('wide-answer-position-bias: os riscos todos no topo da lista entregam a resposta', () => {
            expect(issuesWith(interaction => {
                const risks = new Set(interaction.payload.riskRegionIds);
                interaction.payload.regions = [...interaction.payload.regions.filter(region => risks.has(region.id)), ...interaction.payload.regions.filter(region => !risks.has(region.id))];
            })).toEqual([`wide-answer-position-bias:${ID}`]);
        });

        it('wide-feedback-not-distinct: o retorno de erro precisa de explicação própria', () => {
            expect(issuesWith(interaction => { interaction.feedback.incorrect = interaction.feedback.correct; })).toEqual([`wide-feedback-not-distinct:${ID}`]);
        });
    });

    describe('conversation (fase B)', () => {
        const TURNS = [
            { line: 'Cheguei na sala e não sei onde prender o meu dosímetro individual. Onde ele fica?', options: [
                { label: 'Qualquer lugar serve, o importante é estar com você no turno.', correct: false, reply: 'Então fico tranquila e deixo no bolso.' },
                { label: 'Prenda na altura do tronco, como o plano do setor manda.', correct: true, reply: 'Entendi, vou prender aí agora.' },
                { label: 'Deixe guardado no armário durante todo o exame.', correct: false, reply: 'Mas eu queria conferir a leitura depois.' }] },
            { line: 'E se eu esquecer o dosímetro em casa? Posso entrar na sala assim mesmo?', options: [
                { label: 'Avise a supervisão antes: sem dosímetro, não entre.', correct: true, reply: 'Combinado, falo com a supervisão agora.' },
                { label: 'Entre sem ele e anote depois que esqueceu em casa.', correct: false, reply: 'Tá, então eu anoto no fim do turno.' },
                { label: 'Pegue o de um colega só por hoje, para não atrasar.', correct: false, reply: 'Vou pedir emprestado, então.' }] },
        ];
        const ID = 'interaction:rtg-2026:m01:aula-01:i2';
        function talkCandidate(extra: Record<string, unknown> = {}): EditorialWideCandidateV1 {
            const doc = JSON.parse(JSON.stringify(source));
            const old = doc.lessons[0].interactions[1];
            doc.lessons[0].interactions[1] = {
                id: old.id, type: 'conversation', role: 'practice', help: old.help, sourceIds: old.sourceIds, speaker: 'duda', turns: TURNS, ...extra,
                prompt: 'Duda está no primeiro dia de estágio. Ajude-a a conduzir o turno.',
                feedbackCorrect: 'Isso mesmo: o dosímetro fica no tronco, e sem ele você avisa antes de entrar.',
                feedbackIncorrect: 'Reveja o turno: o uso segue o plano do setor, e a falta do dosímetro se avisa antes.',
            };
            const built = buildRtgBatch(doc).batch;
            return JSON.parse(JSON.stringify({
                schemaVersion: 1, promotionState: 'human-gates-pending', trackId: built.trackId, unitId: built.unitId,
                contentVersion: built.contentVersion, competencyIds: built.competencyIds, sources: built.sources,
                activities: built.activities, checkpoint: built.checkpoint, reinforcement: built.reinforcement,
                claimProvenance: built.claimProvenance, wide: built.wide,
                approvals: { technical: 'pending', editorial: 'pending', accessibility: 'pending', rights: 'pending', schema: 'pending', product: 'pending' },
            }));
        }
        const talkOf = (value: EditorialWideCandidateV1) => {
            const found = interactionsOf(value.activities[0].steps).find(interaction => interaction.id === ID);
            if (found?.type !== 'conversation') throw new Error('sem conversation');
            return found as Mutable<typeof found>;
        };
        const issuesWith = (mutate: (interaction: ReturnType<typeof talkOf>) => void, extra: Record<string, unknown> = {}) => {
            const value = talkCandidate(extra);
            mutate(talkOf(value));
            return validateEditorialCurriculumCandidate(value);
        };

        it('aceita a conversa, com o id da correta de cada turno e a proveniência de cada resposta', () => {
            const value = talkCandidate();
            expect(validateEditorialCurriculumCandidate(value)).toEqual([]);
            const { payload } = talkOf(value);
            expect(payload.turns).toHaveLength(2);
            expect(payload.turns.map(turn => turn.options.findIndex(option => option.id === turn.correctOptionId))).toEqual([1, 0]);
            const claim = (id: string) => value.claimProvenance.find(entry => entry.claimId === id);
            expect(claim(payload.turns[0].correctOptionId)).toMatchObject({ claimKind: 'correct-answer', provenanceKind: 'source-backed' });
            expect(claim(payload.turns[0].options[0].id)).toMatchObject({ claimKind: 'distractor', provenanceKind: 'authorial-distractor' });
            expect(claim(payload.turns[1].id)).toMatchObject({ claimKind: 'prompt' });
        });

        it('paciente com nome passa, e o paciente sem nome e o Pixel reprovam', () => {
            expect(issuesWith(() => undefined, { speaker: 'paciente', name: 'Sr. Álvaro' })).toEqual([]);
            expect(issuesWith(interaction => { interaction.payload.speaker = 'paciente'; })).toContain(`invalid-wide-shape:${ID}`);
            expect(issuesWith(interaction => { (interaction.payload as { speaker: string }).speaker = 'pixel'; })).toContain(`invalid-wide-shape:${ID}`);
        });

        it('mantém as chaves exatas do payload e exige texto em toda fala, resposta e reação', () => {
            expect(issuesWith(interaction => { (interaction.payload as Record<string, unknown>).visual = 'extra'; })).toContain(`unsupported-wide-payload:${ID}`);
            expect(issuesWith(interaction => { interaction.payload.turns[0].line = ' '; })).toContain(`unsupported-wide-payload:${ID}`);
            expect(issuesWith(interaction => { interaction.payload.turns[0].options[0].reply = ' '; })).toContain(`invalid-wide-shape:${ID}`);
        });

        it('wide-answer-position-bias: a correta no mesmo lugar em todos os turnos', () => {
            expect(issuesWith(interaction => {
                const options = interaction.payload.turns[1].options;
                [options[0], options[1]] = [options[1], options[0]];
            })).toEqual([`wide-answer-position-bias:${ID}`]);
        });

        it('wide-longest-is-correct: a correta de algum turno é a mais longa', () => {
            expect(issuesWith(interaction => { interaction.payload.turns[1].options[0].label += ' com todo o cuidado do mundo, sem pressa'; })).toEqual([`wide-longest-is-correct:${ID}`]);
        });

        it('invalid-wide-shape: turnos e respostas fora de 2 a 3, correta fora das respostas, rótulos repetidos', () => {
            expect(issuesWith(interaction => { interaction.payload.turns.splice(1); })).toContain(`invalid-wide-shape:${ID}`);
            expect(issuesWith(interaction => { interaction.payload.turns[1].options.splice(1); })).toContain(`invalid-wide-shape:${ID}`);
            expect(issuesWith(interaction => { interaction.payload.turns[0].correctOptionId = 'option:rtg-2026:m01:fora'; })).toContain(`invalid-wide-shape:${ID}`);
            expect(issuesWith(interaction => { interaction.payload.turns[0].options[1].label = interaction.payload.turns[0].options[0].label; })).toContain(`invalid-wide-shape:${ID}`);
        });

        it('wide-feedback-not-distinct: o retorno de erro precisa de explicação própria', () => {
            expect(issuesWith(interaction => { interaction.feedback.incorrect = interaction.feedback.correct; })).toEqual([`wide-feedback-not-distinct:${ID}`]);
        });
    });

    describe('blitz (fase B)', () => {
        const STATEMENTS = [
            { text: 'Quanto maior a distância da fonte, menor é a dose recebida.', correct: true, feedback: 'Longe da fonte a dose cai, porque a radiação se espalha por uma área maior.' },
            { text: 'O dosímetro individual reduz a dose que a pessoa recebe.', correct: false, feedback: 'O dosímetro só registra a dose; quem a reduz é a distância, o tempo e a blindagem.' },
            { text: 'O avental de chumbo protege o tronco da radiação espalhada.', correct: true, feedback: 'O avental cobre o tronco e atenua a radiação que se espalha na sala.' },
            { text: 'Material com rachadura sai de uso e a supervisão é avisada.', correct: true, feedback: 'Material danificado não protege direito e o aviso evita que o problema se esconda.' },
            { text: 'Quanto mais tempo na sala durante a exposição, menor é a dose.', correct: false, feedback: 'Mais tempo de exposição aumenta a dose; reduzir o tempo reduz a dose.' },
            { text: 'Registrar o uso do dosímetro é opcional em turnos curtos.', correct: false, feedback: 'O registro vale em todo turno, porque mostra o uso e o desgaste do material.' },
        ];
        const ID = 'interaction:rtg-2026:m01:aula-01:i2';
        function blitzCandidate(): EditorialWideCandidateV1 {
            const doc = JSON.parse(JSON.stringify(source));
            const old = doc.lessons[0].interactions[1];
            doc.lessons[0].interactions[1] = {
                id: old.id, type: 'blitz', role: 'practice', help: old.help, sourceIds: old.sourceIds, statements: STATEMENTS,
                prompt: 'Responda verdadeiro ou falso a cada afirmação sobre a proteção no turno.',
                feedbackCorrect: 'Isso mesmo: você separou o que protege do que expõe, no ritmo da rodada.',
                feedbackIncorrect: 'Reveja as afirmações: cada uma tem a própria explicação no retorno.',
            };
            const built = buildRtgBatch(doc).batch;
            return JSON.parse(JSON.stringify({
                schemaVersion: 1, promotionState: 'human-gates-pending', trackId: built.trackId, unitId: built.unitId,
                contentVersion: built.contentVersion, competencyIds: built.competencyIds, sources: built.sources,
                activities: built.activities, checkpoint: built.checkpoint, reinforcement: built.reinforcement,
                claimProvenance: built.claimProvenance, wide: built.wide,
                approvals: { technical: 'pending', editorial: 'pending', accessibility: 'pending', rights: 'pending', schema: 'pending', product: 'pending' },
            }));
        }
        const blitzOf = (value: EditorialWideCandidateV1) => {
            const found = interactionsOf(value.activities[0].steps).find(interaction => interaction.id === ID);
            if (found?.type !== 'blitz') throw new Error('sem blitz');
            return found as Mutable<typeof found>;
        };
        const issuesWith = (mutate: (interaction: ReturnType<typeof blitzOf>) => void) => {
            const value = blitzCandidate();
            mutate(blitzOf(value));
            return validateEditorialCurriculumCandidate(value);
        };

        it('aceita a rodada com passCount de n menos 1 e a proveniência de cada afirmação', () => {
            const value = blitzCandidate();
            expect(validateEditorialCurriculumCandidate(value)).toEqual([]);
            const { payload } = blitzOf(value);
            expect(payload.statements).toHaveLength(6);
            expect(payload.passCount).toBe(5);
            const claim = (id: string) => value.claimProvenance.find(entry => entry.claimId === id);
            expect(claim(payload.statements[0].id)).toMatchObject({ claimKind: 'prompt', provenanceKind: 'source-backed' });
            expect(claim(payload.statements[1].id)).toMatchObject({ claimKind: 'distractor', provenanceKind: 'authorial-distractor' });
        });

        it('mantém as chaves exatas do payload e exige texto em toda afirmação', () => {
            expect(issuesWith(interaction => { (interaction.payload as Record<string, unknown>).tempo = 10; })).toContain(`unsupported-wide-payload:${ID}`);
            expect(issuesWith(interaction => { interaction.payload.statements[0].text = ' '; })).toContain(`unsupported-wide-payload:${ID}`);
        });

        it('invalid-wide-shape: de 6 a 8 afirmações, passCount fora de n menos 1, texto ou explicação repetidos ou vazios', () => {
            expect(issuesWith(interaction => { interaction.payload.statements.splice(5); interaction.payload.passCount = 4; })).toContain(`invalid-wide-shape:${ID}`);
            expect(issuesWith(interaction => { interaction.payload.passCount = 4; })).toContain(`invalid-wide-shape:${ID}`);
            expect(issuesWith(interaction => { interaction.payload.passCount = 6; })).toContain(`invalid-wide-shape:${ID}`);
            expect(issuesWith(interaction => { interaction.payload.statements[1].text = interaction.payload.statements[0].text; })).toContain(`invalid-wide-shape:${ID}`);
            expect(issuesWith(interaction => { interaction.payload.statements[1].explanation = interaction.payload.statements[0].explanation; })).toContain(`invalid-wide-shape:${ID}`);
            expect(issuesWith(interaction => { interaction.payload.statements[1].explanation = ' '; })).toContain(`invalid-wide-shape:${ID}`);
        });

        /** Quais afirmações são verdadeiras; a proveniência acompanha (verdadeira cita a fonte, falsa é distrator autoral), para só a forma reprovar. */
        const issuesWithTruths = (truths: number[]) => {
            const value = blitzCandidate();
            const { payload } = blitzOf(value);
            const sourceIds = value.claimProvenance.find(claim => claim.claimId === payload.statements[0].id)!.sourceIds;
            payload.statements.forEach((statement, index) => {
                statement.isTrue = truths.includes(index);
                Object.assign(value.claimProvenance.find(claim => claim.claimId === statement.id)!, statement.isTrue
                    ? { claimKind: 'prompt', provenanceKind: 'source-backed', sourceIds } : { claimKind: 'distractor', provenanceKind: 'authorial-distractor', sourceIds: [] });
            });
            return validateEditorialCurriculumCandidate(value);
        };

        it('wide-constant-answer: menos de duas verdadeiras ou menos de duas falsas', () => {
            expect(issuesWithTruths([1])).toContain(`wide-constant-answer:${ID}`);
            expect(issuesWithTruths([0, 2, 3, 4, 5])).toContain(`wide-constant-answer:${ID}`);
            expect(issuesWithTruths([0, 3])).toEqual([]);
            expect(issuesWithTruths([0, 1, 3, 5])).toEqual([]);
        });

        it('wide-answer-position-bias: as três primeiras afirmações com a mesma resposta', () => {
            expect(issuesWithTruths([0, 1, 2, 4])).toEqual([`wide-answer-position-bias:${ID}`]);
            expect(issuesWithTruths([3, 4, 5])).toEqual([`wide-answer-position-bias:${ID}`]);
            expect(issuesWithTruths([1, 3, 4, 5])).toEqual([]);
        });

        it('wide-answer-position-bias: a alternância perfeita do começo ao fim', () => {
            expect(issuesWithTruths([0, 2, 4])).toEqual([`wide-answer-position-bias:${ID}`]);
        });

        it('wide-feedback-not-distinct: o retorno de erro precisa de explicação própria', () => {
            expect(issuesWith(interaction => { interaction.feedback.incorrect = interaction.feedback.correct; })).toEqual([`wide-feedback-not-distinct:${ID}`]);
        });
    });

    describe('visual do conceito (fase B)', () => {
        const conceptOf = (value: EditorialWideCandidateV1) => {
            const step = value.activities[0].steps.find(entry => entry.kind === 'presentation' && entry.role === 'concept');
            if (step?.kind !== 'presentation') throw new Error('sem conceito');
            return step as Mutable<typeof step>;
        };
        it('aceita um diagrama do registro e recusa um id fora dele', () => {
            const ok = candidate();
            conceptOf(ok).payload.visual = 'colimador-abrindo';
            expect(validateEditorialCurriculumCandidate(ok)).toEqual([]);
            const bad = candidate();
            const concept = conceptOf(bad);
            concept.payload.visual = 'diagrama-que-nao-existe';
            expect(validateEditorialCurriculumCandidate(bad)).toEqual([`unregistered-diagram:${concept.id}`]);
        });
    });

    describe('bench (fase B)', () => {
        const ID = 'interaction:rtg-2026:m01:aula-01:i2';
        function benchCandidate(): EditorialWideCandidateV1 {
            const doc = JSON.parse(JSON.stringify(source));
            const old = doc.lessons[0].interactions[1];
            doc.lessons[0].interactions[1] = {
                id: old.id, type: 'bench', role: 'practice', help: old.help, sourceIds: old.sourceIds,
                prompt: 'Suba a tensão do tubo até 90 kV e veja o contraste do fantoma mudar.',
                simulator: 'exposure', mode: 'challenge',
                controls: [{ id: 'kv', label: 'Tensão', unit: 'kV', min: 40, max: 120, step: 10, initial: 60 }],
                goal: { kind: 'reach', control: 'kv', atLeast: 90 }, phantomLabel: 'Fantoma simulado',
                hints: { tooLow: 'Ainda falta tensão: suba o kV até o contraste aparecer.', tooHigh: 'Passou do ponto: desça o kV até o alvo.' },
                feedbackCorrect: 'Isso mesmo: com 90 kV o feixe atravessa o fantoma e o contraste aparece.',
                feedbackIncorrect: 'Ainda não chegou: observe a imagem enquanto muda o kV e compare com o alvo.',
            };
            const built = buildRtgBatch(doc).batch;
            return JSON.parse(JSON.stringify({
                schemaVersion: 1, promotionState: 'human-gates-pending', trackId: built.trackId, unitId: built.unitId,
                contentVersion: built.contentVersion, competencyIds: built.competencyIds, sources: built.sources,
                activities: built.activities, checkpoint: built.checkpoint, reinforcement: built.reinforcement,
                claimProvenance: built.claimProvenance, wide: built.wide,
                approvals: { technical: 'pending', editorial: 'pending', accessibility: 'pending', rights: 'pending', schema: 'pending', product: 'pending' },
            }));
        }
        const benchOf = (value: EditorialWideCandidateV1) => {
            const found = interactionsOf(value.activities[0].steps).find(interaction => interaction.id === ID);
            if (found?.type !== 'bench') throw new Error('sem bancada');
            return found as Mutable<typeof found>;
        };
        const issuesWith = (mutate: (interaction: ReturnType<typeof benchOf>) => void) => {
            const value = benchCandidate();
            mutate(benchOf(value));
            return validateEditorialCurriculumCandidate(value);
        };

        it('a bancada é família do contrato amplo, e o lote com ela é válido, com proveniência da interação', () => {
            expect(WIDE_ACTIVITY_FAMILIES).toContain('bench');
            const value = benchCandidate();
            expect(validateEditorialCurriculumCandidate(value)).toEqual([]);
            const claims = value.claimProvenance.filter(claim => claim.claimId.startsWith(ID)).map(claim => claim.claimId);
            expect(claims).toEqual(expect.arrayContaining([`${ID}:prompt`, `${ID}:answer`, `${ID}:feedback:correct`, `${ID}:feedback:incorrect`]));
        });

        it('mantém as chaves exatas do payload e exige texto no rótulo do controle e no do fantoma', () => {
            expect(issuesWith(interaction => { (interaction.payload as Record<string, unknown>).tempo = 10; })).toContain(`unsupported-wide-payload:${ID}`);
            expect(issuesWith(interaction => { interaction.payload.controls[0].label = ' '; })).toContain(`unsupported-wide-payload:${ID}`);
            expect(issuesWith(interaction => { interaction.payload.phantomLabel = ' '; })).toContain(`unsupported-wide-payload:${ID}`);
        });

        const MAS = { id: 'mas', label: 'Carga', unit: 'mAs', min: 1, max: 100, step: 1, initial: 10 } as const;
        it('invalid-wide-shape: dicas iguais ou vazias e controle ausente', () => {
            expect(issuesWith(interaction => { interaction.payload.hints.tooHigh = interaction.payload.hints.tooLow; })).toContain(`invalid-wide-shape:${ID}`);
            expect(issuesWith(interaction => { interaction.payload.hints.tooHigh = ' '; })).toContain(`invalid-wide-shape:${ID}`);
            expect(issuesWith(interaction => { interaction.payload.controls.splice(0); })).toContain(`invalid-wide-shape:${ID}`);
        });

        it('invalid-wide-shape: mais de dois controles, mesmo com ids distintos', () => {
            expect(issuesWith(interaction => { interaction.payload.controls.push({ ...MAS }, { ...MAS, id: 'fieldWidth' } as never); })).toContain(`invalid-wide-shape:${ID}`);
        });

        it('invalid-wide-shape: dois controles de mesmo id', () => {
            expect(issuesWith(interaction => { interaction.payload.controls.push({ ...interaction.payload.controls[0], label: 'Outra tensão' }); })).toContain(`invalid-wide-shape:${ID}`);
            expect(issuesWith(interaction => { interaction.payload.controls.push({ ...MAS }); })).toEqual([]);
        });

        const matchOf = (mode: 'explore' | 'challenge' | 'correct', reference = { kv: 80, mas: 10 }) => issuesWith(interaction => {
            interaction.payload.controls.push({ ...MAS });
            interaction.payload.mode = mode;
            interaction.payload.goal = { kind: 'match', reference, tolerance: 0.05 };
        });
        it('o match só vale no desafio, que é onde a tela mostra a referência', () => {
            expect(matchOf('challenge')).toEqual([]);
            expect(matchOf('explore')).toContain(`invalid-wide-shape:${ID}`);
            expect(matchOf('correct')).toContain(`invalid-wide-shape:${ID}`);
        });

        it('wide-constant-answer: o match já vale no ponto de partida', () => {
            expect(matchOf('challenge', { kv: 60, mas: 10 })).toContain(`wide-constant-answer:${ID}`);
        });

        it('wide-constant-answer: o alvo de alcance já vale no ponto de partida', () => {
            expect(issuesWith(interaction => { if (interaction.payload.goal.kind === 'reach') interaction.payload.goal.atLeast = 60; })).toContain(`wide-constant-answer:${ID}`);
            expect(issuesWith(interaction => { interaction.payload.goal = { kind: 'reach', control: 'kv', atMost: 90 }; })).toContain(`wide-constant-answer:${ID}`);
            expect(issuesWith(interaction => { interaction.payload.goal = { kind: 'reach', control: 'kv', atMost: 50 }; })).toEqual([]);
        });

        it('wide-feedback-not-distinct: o retorno de erro precisa de explicação própria', () => {
            expect(issuesWith(interaction => { interaction.feedback.incorrect = interaction.feedback.correct; })).toEqual([`wide-feedback-not-distinct:${ID}`]);
        });
    });

    describe('parameter-lab (fase B)', () => {
        const ID = 'interaction:rtg-2026:m01:aula-01:i2';
        function labCandidate(): EditorialWideCandidateV1 {
            const doc = JSON.parse(JSON.stringify(source));
            const old = doc.lessons[0].interactions[1];
            doc.lessons[0].interactions[1] = {
                id: old.id, type: 'parameter-lab', role: 'practice', help: old.help, sourceIds: old.sourceIds,
                prompt: 'Afaste a fonte até a intensidade cair a um quarto.',
                model: 'inverse-square', start: 1, goal: { atLeast: 2 },
                hints: { tooLow: 'Ainda perto demais: afaste mais a fonte.', tooHigh: 'Afastou além do necessário: aproxime um pouco.' },
                feedbackCorrect: 'Isso mesmo: dobrando a distância, a intensidade cai a um quarto.',
                feedbackIncorrect: 'Ainda não chegou: observe a leitura enquanto muda a distância.',
            };
            const built = buildRtgBatch(doc).batch;
            return JSON.parse(JSON.stringify({
                schemaVersion: 1, promotionState: 'human-gates-pending', trackId: built.trackId, unitId: built.unitId,
                contentVersion: built.contentVersion, competencyIds: built.competencyIds, sources: built.sources,
                activities: built.activities, checkpoint: built.checkpoint, reinforcement: built.reinforcement,
                claimProvenance: built.claimProvenance, wide: built.wide,
                approvals: { technical: 'pending', editorial: 'pending', accessibility: 'pending', rights: 'pending', schema: 'pending', product: 'pending' },
            }));
        }
        const labOf = (value: EditorialWideCandidateV1) => {
            const found = interactionsOf(value.activities[0].steps).find(interaction => interaction.id === ID);
            if (found?.type !== 'parameter-lab') throw new Error('sem laboratório');
            return found as Mutable<typeof found>;
        };
        const issuesWith = (mutate: (interaction: ReturnType<typeof labOf>) => void) => {
            const value = labCandidate();
            mutate(labOf(value));
            return validateEditorialCurriculumCandidate(value);
        };

        it('o laboratório é família do contrato amplo, e o lote com ele é válido, com proveniência da interação', () => {
            expect(WIDE_ACTIVITY_FAMILIES).toContain('parameter-lab');
            const value = labCandidate();
            expect(validateEditorialCurriculumCandidate(value)).toEqual([]);
            const claims = value.claimProvenance.filter(claim => claim.claimId.startsWith(ID)).map(claim => claim.claimId);
            expect(claims).toEqual(expect.arrayContaining([`${ID}:prompt`, `${ID}:answer`, `${ID}:feedback:correct`, `${ID}:feedback:incorrect`]));
        });

        it('mantém as chaves exatas do payload', () => {
            expect(issuesWith(interaction => { (interaction.payload as Record<string, unknown>).tempo = 10; })).toContain(`unsupported-wide-payload:${ID}`);
        });

        it('invalid-wide-shape: modelo desconhecido, partida ou limite fora da grade, meta sem limite, dicas iguais ou vazias', () => {
            expect(issuesWith(interaction => { (interaction.payload as { model: string }).model = 'refracao'; })).toContain(`invalid-wide-shape:${ID}`);
            expect(issuesWith(interaction => { interaction.payload.start = 1.2; })).toContain(`invalid-wide-shape:${ID}`);
            expect(issuesWith(interaction => { interaction.payload.goal = { atLeast: 2.2 }; })).toContain(`invalid-wide-shape:${ID}`);
            expect(issuesWith(interaction => { interaction.payload.goal = {}; })).toContain(`invalid-wide-shape:${ID}`);
            expect(issuesWith(interaction => { interaction.payload.goal = { atLeast: 3, atMost: 2 }; })).toContain(`invalid-wide-shape:${ID}`);
            expect(issuesWith(interaction => { interaction.payload.hints.tooHigh = interaction.payload.hints.tooLow; })).toContain(`invalid-wide-shape:${ID}`);
            expect(issuesWith(interaction => { interaction.payload.hints.tooHigh = ' '; })).toContain(`invalid-wide-shape:${ID}`);
        });

        it('wide-constant-answer: a meta já vale no ponto de partida', () => {
            expect(issuesWith(interaction => { interaction.payload.goal = { atLeast: 1 }; })).toContain(`wide-constant-answer:${ID}`);
            expect(issuesWith(interaction => { interaction.payload.goal = { atMost: 2 }; })).toContain(`wide-constant-answer:${ID}`);
            expect(issuesWith(interaction => { interaction.payload.start = 4; interaction.payload.goal = { atMost: 2 }; })).toEqual([]);
        });

        it('wide-feedback-not-distinct: o retorno de erro precisa de explicação própria', () => {
            expect(issuesWith(interaction => { interaction.feedback.incorrect = interaction.feedback.correct; })).toEqual([`wide-feedback-not-distinct:${ID}`]);
        });
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
        trueFalse.payload.statements.forEach(statement => expect(claims.get(statement.id)?.provenanceKind).toBe(statement.isTrue ? 'source-backed' : 'authorial-distractor'));
        categorize.payload.items.forEach(entry => expect(claims.get(entry.id)?.sourceIds.length).toBeGreaterThan(0));
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
        })).toContain(`wide-constant-answer:${NEW(3)}`);
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

describe('ordem de exibição das famílias da 1.6 (achados 1, 2 e 8 da revisão de 2026-11-13)', () => {
    it('categorize: recusa o ciclo ABAB, que entrega o resto da resposta pela posição', () => {
        expect(newFamilyIssuesAfter(NEW(4), interaction => {
            if (interaction.type !== 'categorize') throw new Error();
            const [a, b] = interaction.payload.categories.map(category => category.id);
            const byGroup = (id: string) => interaction.payload.items.filter(item => item.categoryId === id);
            const [a1, a2] = byGroup(a); const [b1, b2] = byGroup(b);
            interaction.payload.items = [a1, b1, a2, b2];
        })).toEqual([`wide-answer-position-bias:${NEW(4)}`]);
    });

    it.each([[[1, 3]], [[2, 2]], [[3, 1]], [[1, 1, 4]], [[2, 2, 2]], [[1, 2, 3]], [[4, 1, 1]]])('o gerador nunca produz ordem que o contrato recusa: grupos %p', (sizes: number[]) => {
        const items = sizes.flatMap((size, group) => Array.from({ length: size }, (_, index) => ({ id: `${group}-${index}`, group: String(group) })));
        for (let seed = 0; seed < 200; seed += 1) {
            const order = categorizeDisplayOrder(items, item => item.group, `seed-${seed}`);
            expect(order.map(item => item.id).sort()).toEqual(items.map(item => item.id).sort());
            expect(isGroupOrderBiased(order.map(item => item.group), sizes.length)).toBe(false);
        }
    });

    it('cloze: quando a semente abre o banco com as respostas na ordem das lacunas, o gerador desfaz', () => {
        const tokens = ['a1', 'a2', 'd1', 'd2'].map(id => ({ id, label: id }));
        const seed = Array.from({ length: 2000 }, (_, index) => `seed-${index}`)
            .find(candidate => seededDisplayOrder(tokens, candidate).slice(0, 2).map(token => token.id).join() === 'a1,a2');
        expect(seed).toBeDefined();
        const shown = clozeBankOrder(tokens, ['a1', 'a2'], seed!);
        expect(shown.slice(0, 2).map(token => token.id)).not.toEqual(['a1', 'a2']);
        expect(shown.map(token => token.id).sort()).toEqual(['a1', 'a2', 'd1', 'd2']);
    });
});
