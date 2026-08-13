import { LessonFlowService } from './LessonFlowService';
import type {
    LearningActivityV2,
    LearningInteractionV2,
    LearningStepV2,
    PresentationRole,
} from '../../../types/learningActivity';
import { validateLearningActivity } from '../../../types/learningActivity';

// O serviço legado alcança AsyncStorage por JourneyDefinitionService →
// LessonCatalogService → TelemetryService. A validação v2 é pura e não depende
// disso; o mock isola o contrato sob teste da árvore de persistência.
jest.mock('../../journey/services/JourneyDefinitionService', () => ({
    JourneyDefinitionService: { getBlockById: jest.fn(() => null) },
}));

function presentation(id: string, role: PresentationRole): LearningStepV2 {
    return {
        kind: 'presentation',
        id,
        role,
        payload: { title: `Título ${id}`, body: `Corpo de ${id}.` },
    };
}

function multipleChoice(overrides: Partial<LearningInteractionV2> = {}): LearningInteractionV2 {
    return {
        type: 'multiple-choice',
        id: 'interaction:mc-1',
        competencyIds: ['competency:protecao-radiologica:tempo-distancia-e-blindagem'],
        evidenceKind: 'independent-recall',
        completionRule: 'answered',
        criticalSafety: true,
        feedback: { correct: 'Isso mesmo.', incorrect: 'Reveja a relação de distância.' },
        accessibility: { label: 'Questão de múltipla escolha sobre blindagem' },
        payload: {
            prompt: 'Qual medida reduz mais a dose recebida pela equipe?',
            options: [
                { id: 'a', label: 'Aumentar a distância' },
                { id: 'b', label: 'Aumentar o tempo de exposição' },
            ],
            correctOptionId: 'a',
        },
        ...overrides,
    } as LearningInteractionV2;
}

function interactionStep(interaction: LearningInteractionV2): LearningStepV2 {
    return { kind: 'interaction', interaction };
}

function activity(overrides: Partial<LearningActivityV2> = {}): LearningActivityV2 {
    return {
        id: 'activity:protecao-1',
        competencyIds: ['competency:protecao-radiologica:tempo-distancia-e-blindagem'],
        provenance: { contentVersion: 'foundations-safety-2026-08-01', sourceIds: ['source:apostila-1'] },
        steps: [
            presentation('step:hook', 'hook'),
            interactionStep(multipleChoice()),
            presentation('step:closing', 'closing'),
        ],
        ...overrides,
    };
}

function rulesFor(issues: { path: string; rule: string }[], path: string): string[] {
    return issues.filter((issue) => issue.path === path).map((issue) => issue.rule);
}

describe('validateLearningActivity', () => {
    it('aceita uma atividade íntegra de três passos com uma interação', () => {
        expect(validateLearningActivity(activity())).toEqual([]);
    });

    it('aceita os oito tipos de interação da biblioteca', () => {
        const payloads: LearningInteractionV2[] = [
            multipleChoice(),
            multipleChoice({
                type: 'hotspot',
                id: 'interaction:hotspot-1',
                payload: {
                    prompt: 'Toque no colimador.',
                    imageRef: 'media:unidade-3:tubo',
                    regions: [{ id: 'colimador', label: 'Colimador', x: 0.1, y: 0.2, width: 0.3, height: 0.2 }],
                    correctRegionIds: ['colimador'],
                },
            } as Partial<LearningInteractionV2>),
            multipleChoice({
                type: 'comparison',
                id: 'interaction:comparison-1',
                payload: {
                    prompt: 'Qual imagem tem melhor colimação?',
                    options: [
                        { id: 'esq', label: 'Imagem A', imageRef: 'media:unidade-5:a' },
                        { id: 'dir', label: 'Imagem B', imageRef: 'media:unidade-5:b' },
                    ],
                    correctOptionId: 'esq',
                },
            } as Partial<LearningInteractionV2>),
            multipleChoice({
                type: 'matching',
                id: 'interaction:matching-1',
                payload: {
                    prompt: 'Ligue parâmetro e efeito.',
                    pairs: [
                        { id: 'p1', left: 'kVp', right: 'energia do feixe' },
                        { id: 'p2', left: 'mAs', right: 'quantidade de fótons' },
                    ],
                },
            } as Partial<LearningInteractionV2>),
            multipleChoice({
                type: 'ordering',
                id: 'interaction:ordering-1',
                payload: {
                    prompt: 'Ordene a produção dos raios X.',
                    items: [
                        { id: 'i1', label: 'Emissão termiônica' },
                        { id: 'i2', label: 'Aceleração' },
                        { id: 'i3', label: 'Desaceleração' },
                    ],
                    correctOrder: ['i1', 'i2', 'i3'],
                },
            } as Partial<LearningInteractionV2>),
            multipleChoice({
                type: 'parameter-lab',
                id: 'interaction:lab-1',
                payload: {
                    prompt: 'Ajuste e preveja o resultado.',
                    parameters: [{ id: 'kvp', label: 'kVp', min: 40, max: 120, step: 5 }],
                    expectedOutcome: 'contraste-menor',
                },
            } as Partial<LearningInteractionV2>),
            multipleChoice({
                type: 'risk-hunt',
                id: 'interaction:risk-1',
                payload: {
                    prompt: 'Encontre os riscos na sala.',
                    imageRef: 'media:unidade-1:sala',
                    risks: [{ id: 'porta', label: 'Porta aberta', x: 0.5, y: 0.5, width: 0.2, height: 0.2 }],
                },
            } as Partial<LearningInteractionV2>),
            multipleChoice({
                type: 'case-decision',
                id: 'interaction:case-1',
                payload: {
                    prompt: 'A gestante chega para exame não urgente. O que fazer?',
                    options: [
                        { id: 'a', label: 'Interromper e escalar' },
                        { id: 'b', label: 'Prosseguir sem avisar' },
                    ],
                    correctOptionId: 'a',
                },
            } as Partial<LearningInteractionV2>),
        ];

        for (const interaction of payloads) {
            const issues = validateLearningActivity(
                activity({
                    steps: [
                        presentation('step:hook', 'hook'),
                        interactionStep(interaction),
                        presentation('step:closing', 'closing'),
                    ],
                }),
            );
            expect(issues).toEqual([]);
        }
    });

    it('recusa menos de três passos', () => {
        const issues = validateLearningActivity(
            activity({ steps: [presentation('step:hook', 'hook'), interactionStep(multipleChoice())] }),
        );

        expect(rulesFor(issues, 'activity:protecao-1')).toContain('invalid-step-count');
    });

    it('recusa mais de seis passos', () => {
        const steps: LearningStepV2[] = [
            presentation('step:1', 'hook'),
            presentation('step:2', 'concept'),
            presentation('step:3', 'concept'),
            presentation('step:4', 'concept'),
            presentation('step:5', 'concept'),
            presentation('step:6', 'concept'),
            interactionStep(multipleChoice()),
        ];

        expect(rulesFor(validateLearningActivity(activity({ steps })), 'activity:protecao-1'))
            .toContain('invalid-step-count');
    });

    it('exige ao menos uma interação', () => {
        const issues = validateLearningActivity(
            activity({
                steps: [
                    presentation('step:1', 'hook'),
                    presentation('step:2', 'concept'),
                    presentation('step:3', 'closing'),
                ],
            }),
        );

        expect(rulesFor(issues, 'activity:protecao-1')).toContain('invalid-interaction-count');
    });

    it('recusa mais de quatro interações', () => {
        const steps: LearningStepV2[] = [
            presentation('step:hook', 'hook'),
            interactionStep(multipleChoice({ id: 'interaction:1' })),
            interactionStep(multipleChoice({ id: 'interaction:2' })),
            interactionStep(multipleChoice({ id: 'interaction:3' })),
            interactionStep(multipleChoice({ id: 'interaction:4' })),
            interactionStep(multipleChoice({ id: 'interaction:5' })),
        ];

        expect(rulesFor(validateLearningActivity(activity({ steps })), 'activity:protecao-1'))
            .toContain('invalid-interaction-count');
    });

    it('recusa ids repetidos entre passo e interação', () => {
        const steps: LearningStepV2[] = [
            presentation('step:duplicado', 'hook'),
            interactionStep(multipleChoice({ id: 'step:duplicado' })),
            presentation('step:closing', 'closing'),
        ];

        expect(rulesFor(validateLearningActivity(activity({ steps })), 'step:duplicado'))
            .toContain('duplicate-id');
    });

    it('exige competência na atividade e na interação', () => {
        expect(rulesFor(validateLearningActivity(activity({ competencyIds: [] })), 'activity:protecao-1'))
            .toContain('missing-competency');

        const issues = validateLearningActivity(
            activity({
                steps: [
                    presentation('step:hook', 'hook'),
                    interactionStep(multipleChoice({ competencyIds: [] })),
                    presentation('step:closing', 'closing'),
                ],
            }),
        );
        expect(rulesFor(issues, 'interaction:mc-1')).toContain('missing-competency');
    });

    it('exige um tipo de evidência válido em cada interação', () => {
        const semEvidencia = validateLearningActivity(
            activity({
                steps: [
                    presentation('step:hook', 'hook'),
                    interactionStep(multipleChoice({ evidenceKind: undefined as never })),
                    presentation('step:closing', 'closing'),
                ],
            }),
        );
        expect(rulesFor(semEvidencia, 'interaction:mc-1')).toContain('missing-evidence-kind');

        const evidenciaInvalida = validateLearningActivity(
            activity({
                steps: [
                    presentation('step:hook', 'hook'),
                    interactionStep(multipleChoice({ evidenceKind: 'achismo' as never })),
                    presentation('step:closing', 'closing'),
                ],
            }),
        );
        expect(rulesFor(evidenciaInvalida, 'interaction:mc-1')).toContain('invalid-evidence-kind');
    });

    it('exige feedback para acerto e para erro', () => {
        const issues = validateLearningActivity(
            activity({
                steps: [
                    presentation('step:hook', 'hook'),
                    interactionStep(multipleChoice({ feedback: { correct: 'Boa.', incorrect: '  ' } })),
                    presentation('step:closing', 'closing'),
                ],
            }),
        );

        expect(rulesFor(issues, 'interaction:mc-1')).toContain('missing-feedback');
    });

    it('exige criticalSafety explicitamente booleano', () => {
        const issues = validateLearningActivity(
            activity({
                steps: [
                    presentation('step:hook', 'hook'),
                    interactionStep(multipleChoice({ criticalSafety: 'true' as never })),
                    presentation('step:closing', 'closing'),
                ],
            }),
        );

        expect(rulesFor(issues, 'interaction:mc-1')).toContain('missing-critical-safety');
    });

    it('exige rótulo acessível em cada interação', () => {
        const issues = validateLearningActivity(
            activity({
                steps: [
                    presentation('step:hook', 'hook'),
                    interactionStep(multipleChoice({ accessibility: { label: '' } })),
                    presentation('step:closing', 'closing'),
                ],
            }),
        );

        expect(rulesFor(issues, 'interaction:mc-1')).toContain('missing-accessible-label');
    });

    it('recusa hotspot fora do quadro normalizado', () => {
        const foraDoQuadro = multipleChoice({
            type: 'hotspot',
            id: 'interaction:hotspot-1',
            payload: {
                prompt: 'Toque no colimador.',
                imageRef: 'media:unidade-3:tubo',
                regions: [{ id: 'colimador', label: 'Colimador', x: 0.8, y: 0.2, width: 0.5, height: 0.2 }],
                correctRegionIds: ['colimador'],
            },
        } as Partial<LearningInteractionV2>);

        const issues = validateLearningActivity(
            activity({
                steps: [
                    presentation('step:hook', 'hook'),
                    interactionStep(foraDoQuadro),
                    presentation('step:closing', 'closing'),
                ],
            }),
        );

        expect(issues.some((issue) => issue.rule === 'hotspot-out-of-bounds')).toBe(true);
    });

    it('recusa múltipla escolha cuja resposta correta não está entre as opções', () => {
        const issues = validateLearningActivity(
            activity({
                steps: [
                    presentation('step:hook', 'hook'),
                    interactionStep(
                        multipleChoice({
                            payload: {
                                prompt: 'Qual medida reduz mais a dose?',
                                options: [
                                    { id: 'a', label: 'Distância' },
                                    { id: 'b', label: 'Tempo' },
                                ],
                                correctOptionId: 'z',
                            },
                        } as Partial<LearningInteractionV2>),
                    ),
                    presentation('step:closing', 'closing'),
                ],
            }),
        );

        expect(rulesFor(issues, 'interaction:mc-1')).toContain('invalid-correct-option');
    });

    it('recusa ordenação cuja ordem correta não cobre exatamente os itens', () => {
        const issues = validateLearningActivity(
            activity({
                steps: [
                    presentation('step:hook', 'hook'),
                    interactionStep(
                        multipleChoice({
                            type: 'ordering',
                            id: 'interaction:ordering-1',
                            payload: {
                                prompt: 'Ordene.',
                                items: [
                                    { id: 'i1', label: 'Um' },
                                    { id: 'i2', label: 'Dois' },
                                ],
                                correctOrder: ['i1', 'i1'],
                            },
                        } as Partial<LearningInteractionV2>),
                    ),
                    presentation('step:closing', 'closing'),
                ],
            }),
        );

        expect(rulesFor(issues, 'interaction:ordering-1')).toContain('invalid-correct-order');
    });

    it('exige proveniência com versão de conteúdo', () => {
        const issues = validateLearningActivity(
            activity({ provenance: { contentVersion: '', sourceIds: [] } }),
        );

        expect(rulesFor(issues, 'activity:protecao-1')).toContain('missing-provenance');
    });
});

describe('LessonFlowService — contrato legado preservado', () => {
    it('expõe a validação v2 sem alterar o caminho legado', () => {
        expect(LessonFlowService.validateActivity(activity())).toEqual([]);
        expect(typeof LessonFlowService.getBlockById).toBe('function');
    });

    it('devolve null para bloco legado inexistente, como antes', () => {
        expect(LessonFlowService.getBlockById('bloco-que-nao-existe')).toBeNull();
    });

    it('resolve atividade nativa somente a partir de lote v2 promovido', () => {
        const promoted = LessonFlowService.getActivityById('activity:materia-energia-e-radiacao:01');

        expect(promoted).toMatchObject({
            id: 'activity:materia-energia-e-radiacao:01',
            provenance: { contentVersion: 'h4-materia-energia-e-radiacao-candidate-2026-08-13' },
        });
        expect(LessonFlowService.getBlockById('activity:materia-energia-e-radiacao:01')).toBeNull();
    });
});
