import {
    MATERIA_ENERGIA_E_RADIACAO_CANDIDATE,
    validateEditorialCurriculumCandidate,
    type EditorialCurriculumCandidateV1,
} from './EditorialCurriculumCandidate';

const competencyIds = [
    'competency:materia-energia-e-radiacao:estrutura-atomica-e-ionizacao',
    'competency:materia-energia-e-radiacao:ionizante-e-nao-ionizante',
    'competency:materia-energia-e-radiacao:frequencia-comprimento-e-energia',
    'competency:materia-energia-e-radiacao:raios-x-no-espectro',
    'competency:materia-energia-e-radiacao:atenuacao-como-ponte',
];

describe('candidato editorial H4 — Matéria, energia e radiação', () => {
    it('preserva um candidato v2 completo, rastreável e não promovível', () => {
        const candidate = MATERIA_ENERGIA_E_RADIACAO_CANDIDATE;

        expect(validateEditorialCurriculumCandidate(candidate)).toEqual([]);
        expect(candidate.promotionState).toBe('human-gates-pending');
        expect(candidate.approvals).toEqual({
            technical: 'pending',
            editorial: 'pending',
            accessibility: 'pending',
            rights: 'pending',
            schema: 'pending',
            product: 'pending',
        });
        expect(candidate.unitId).toBe('unit:materia-energia-e-radiacao');
        expect(candidate.trackId).toBe('track:fundamentos-e-seguranca-radiologica');
        expect(candidate.competencyIds).toEqual(competencyIds);

        expect(candidate.sources).toHaveLength(8);
        candidate.sources.forEach((source) => {
            expect(source.license).toEqual({ label: 'CC BY 4.0', url: 'https://creativecommons.org/licenses/by/4.0/' });
            expect(source.accessedAt).toBe('2026-08-13');
            expect(source.retrievedMaterialSha256).toMatch(/^[a-f0-9]{64}$/);
            expect(source.adaptationNotice).toContain('Tradução/adaptação');
        });

        expect(candidate.activities).toHaveLength(12);
        candidate.activities.forEach((activity) => {
            expect(activity.steps).toHaveLength(3);
            expect(activity.steps.filter((step) => step.kind === 'interaction')).toHaveLength(1);
        });

        const evidenceByCompetency = new Map<string, Set<string>>();
        candidate.activities.forEach((activity) => {
            const interaction = activity.steps.find((step) => step.kind === 'interaction');
            if (!interaction || interaction.kind !== 'interaction') throw new Error('interaction missing from fixture');
            expect(interaction.interaction.criticalSafety).toBe(false);
            const competencyId = interaction.interaction.competencyIds[0];
            evidenceByCompetency.set(
                competencyId,
                new Set([...(evidenceByCompetency.get(competencyId) ?? []), interaction.interaction.evidenceKind]),
            );
        });
        competencyIds.slice(0, 4).forEach((competencyId) => {
            expect(evidenceByCompetency.get(competencyId)).toEqual(new Set(['guided-practice', 'independent-recall']));
        });
        expect(evidenceByCompetency.get(competencyIds[4])).toEqual(new Set(['guided-practice', 'applied-transfer']));

        expect(candidate.checkpoint.targetScoreBasisPoints).toBe(8000);
        expect(candidate.checkpoint.items).toHaveLength(10);
        competencyIds.forEach((competencyId) => {
            expect(candidate.checkpoint.items.filter((item) => item.competencyIds.includes(competencyId))).toHaveLength(2);
        });
        candidate.claimProvenance.forEach((claim) => {
            expect(['prompt', 'correct-answer', 'distractor', 'feedback']).toContain(claim.claimKind);
            if (claim.claimKind === 'distractor') {
                expect(claim.provenanceKind).toBe('authorial-distractor');
                expect(claim.sourceIds).toEqual([]);
            } else {
                expect(claim.provenanceKind).toBe('source-backed');
                expect(claim.sourceIds.length).toBeGreaterThan(0);
            }
        });

        expect(candidate.reinforcement.cycles).toEqual([
            { cycle: 1, mode: 'guided-recovery' },
            { cycle: 2, mode: 'different-context-retry' },
        ]);
    });

    it('evita gabarito posicional e mantém distinções físicas críticas no artefato executável', () => {
        const candidate = MATERIA_ENERGIA_E_RADIACAO_CANDIDATE;
        const correctPositions = candidate.checkpoint.items.map((item) =>
            item.options.findIndex((option) => option.id === item.correctOptionId),
        );

        expect(new Set(correctPositions)).toEqual(new Set([0, 1, 2, 3]));

        const photonCountActivity = candidate.activities.find((activity) =>
            activity.id.endsWith(':05'),
        );
        const photonCountInteraction = photonCountActivity?.steps.find((step) => step.kind === 'interaction');
        if (!photonCountInteraction || photonCountInteraction.kind !== 'interaction' || photonCountInteraction.interaction.type !== 'multiple-choice') {
            throw new Error('activity 05 must expose a multiple-choice interaction');
        }
        const photonCountMultipleChoice = photonCountInteraction.interaction as Extract<
            typeof photonCountInteraction.interaction,
            { type: 'multiple-choice' }
        >;
        const photonCountOptions = photonCountMultipleChoice.payload.options;
        const photonCountCorrect = photonCountOptions.find(
            (option) => option.id === photonCountMultipleChoice.payload.correctOptionId,
        );
        expect(photonCountCorrect?.label).toBe('Não — a quantidade de fótons não altera a energia de cada fóton.');

        const spectrumQuestion = candidate.checkpoint.items.find((item) => item.id.endsWith(':07'));
        const spectrumCorrect = spectrumQuestion?.options.find((option) => option.id === spectrumQuestion.correctOptionId);
        expect(spectrumCorrect?.label).toContain('processo de produção');

        const detectorBridge = candidate.activities.find((activity) => activity.id.endsWith(':12'));
        expect(detectorBridge?.provenance.sourceIds).toContain('source:h4:s8');
        expect(candidate.checkpoint.items.filter((item) => item.id.endsWith(':09') || item.id.endsWith(':10')).every(
            (item) => item.sourceIds.includes('source:h4:s8'),
        )).toBe(true);
    });

    it('rejeita metadado que mantém o rótulo CC BY 4.0 com URL de licença divergente', () => {
        const candidate = MATERIA_ENERGIA_E_RADIACAO_CANDIDATE;
        const invalidLicenseCandidate = {
            ...candidate,
            sources: candidate.sources.map((source, index) => index === 0
                ? { ...source, license: { ...source.license, url: 'https://example.invalid/license' } }
                : source),
        } as unknown as EditorialCurriculumCandidateV1;

        expect(validateEditorialCurriculumCandidate(invalidLicenseCandidate)).toContain('invalid-source-metadata');
    });
});
