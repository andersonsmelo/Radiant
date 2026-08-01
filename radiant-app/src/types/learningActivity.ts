/**
 * Contrato de atividade v2 do motor de aprendizagem.
 *
 * Substitui gradualmente o `LessonBlock` legado, que exige exatamente uma
 * múltipla escolha por bloco. Aqui a interação é uma união discriminada dos oito
 * tipos da biblioteca, e os jogos são renderizadores destes tipos — não um
 * produto paralelo com catálogo próprio.
 *
 * A validação é **pura e devolve uma lista**, em vez de lançar como a legada.
 * Conteúdo educacional é validado em lote antes da promoção editorial, e um
 * validador que lança na primeira violação esconde as outras vinte do revisor.
 * O formato `{ path, rule }` é o mesmo dos validadores de conteúdo em
 * `scripts/content/`, para que uma violação signifique a mesma coisa dos dois
 * lados do pipeline.
 */

export type ValidationIssue = {
    path: string;
    rule: string;
};

/** Mesmo vocabulário do grafo de competências, em `conteúdo/governança`. */
export type EvidenceKind =
    | 'guided-practice'
    | 'independent-recall'
    | 'applied-transfer'
    | 'delayed-retention';

export const EVIDENCE_KINDS: readonly EvidenceKind[] = [
    'guided-practice',
    'independent-recall',
    'applied-transfer',
    'delayed-retention',
];

/** Vocabulário herdado do contrato legado, preservado de propósito. */
export type CompletionRule = 'displayed' | 'answered' | 'confirmed';

export type PresentationRole = 'hook' | 'concept' | 'closing';

export type InteractionType =
    | 'multiple-choice'
    | 'hotspot'
    | 'comparison'
    | 'matching'
    | 'ordering'
    | 'parameter-lab'
    | 'risk-hunt'
    | 'case-decision';

export type InteractionFeedback = {
    correct: string;
    incorrect: string;
};

export type InteractionAccessibility = {
    label: string;
    hint?: string;
};

export type ActivityProvenance = {
    contentVersion: string;
    sourceIds: string[];
};

/** Coordenadas normalizadas em 0–1, como no manifesto de mídia. */
export type NormalizedRegion = {
    id: string;
    label: string;
    x: number;
    y: number;
    width: number;
    height: number;
};

export type ChoiceOption = { id: string; label: string; imageRef?: string };

export type MultipleChoiceV2Payload = {
    prompt: string;
    options: ChoiceOption[];
    correctOptionId: string;
};

export type HotspotPayload = {
    prompt: string;
    imageRef: string;
    regions: NormalizedRegion[];
    correctRegionIds: string[];
};

export type ComparisonPayload = {
    prompt: string;
    options: ChoiceOption[];
    correctOptionId: string;
};

export type MatchingPayload = {
    prompt: string;
    pairs: { id: string; left: string; right: string }[];
};

export type OrderingPayload = {
    prompt: string;
    items: { id: string; label: string }[];
    correctOrder: string[];
};

export type ParameterLabPayload = {
    prompt: string;
    parameters: { id: string; label: string; min: number; max: number; step: number }[];
    expectedOutcome: string;
};

export type RiskHuntPayload = {
    prompt: string;
    imageRef: string;
    risks: NormalizedRegion[];
};

export type CaseDecisionPayload = {
    prompt: string;
    options: ChoiceOption[];
    correctOptionId: string;
};

type InteractionBase = {
    id: string;
    /** Ao menos uma. É o que liga a evidência produzida ao domínio medido. */
    competencyIds: string[];
    evidenceKind: EvidenceKind;
    completionRule: CompletionRule;
    /** Erro nesta interação tem consequência de segurança, não só lacuna. */
    criticalSafety: boolean;
    feedback: InteractionFeedback;
    accessibility: InteractionAccessibility;
};

export type LearningInteractionV2 =
    | (InteractionBase & { type: 'multiple-choice'; payload: MultipleChoiceV2Payload })
    | (InteractionBase & { type: 'hotspot'; payload: HotspotPayload })
    | (InteractionBase & { type: 'comparison'; payload: ComparisonPayload })
    | (InteractionBase & { type: 'matching'; payload: MatchingPayload })
    | (InteractionBase & { type: 'ordering'; payload: OrderingPayload })
    | (InteractionBase & { type: 'parameter-lab'; payload: ParameterLabPayload })
    | (InteractionBase & { type: 'risk-hunt'; payload: RiskHuntPayload })
    | (InteractionBase & { type: 'case-decision'; payload: CaseDecisionPayload });

export type PresentationPayload = {
    title: string;
    body: string;
    imageRef?: string;
};

export type LearningStepV2 =
    | { kind: 'presentation'; id: string; role: PresentationRole; payload: PresentationPayload }
    | { kind: 'interaction'; interaction: LearningInteractionV2 };

export type LearningActivityV2 = {
    id: string;
    competencyIds: string[];
    provenance: ActivityProvenance;
    /** Sessão de 3 a 6 passos, dos quais 1 a 4 são interações. */
    steps: LearningStepV2[];
};

const MIN_STEPS = 3;
const MAX_STEPS = 6;
const MIN_INTERACTIONS = 1;
const MAX_INTERACTIONS = 4;
const PRESENTATION_ROLES = new Set<string>(['hook', 'concept', 'closing']);
const COMPLETION_RULES = new Set<string>(['displayed', 'answered', 'confirmed']);

function push(issues: ValidationIssue[], path: string, rule: string): void {
    if (!issues.some((issue) => issue.path === path && issue.rule === rule)) {
        issues.push({ path, rule });
    }
}

function isFilled(value: unknown): boolean {
    return typeof value === 'string' && value.trim().length > 0;
}

function hasCompetency(value: unknown): boolean {
    return Array.isArray(value) && value.length > 0 && value.every(isFilled);
}

function isWithinFrame(region: NormalizedRegion): boolean {
    const bounds = [region.x, region.y, region.width, region.height];
    return bounds.every((value) => typeof value === 'number' && Number.isFinite(value) && value >= 0 && value <= 1)
        && region.x + region.width <= 1
        && region.y + region.height <= 1;
}

function validateRegions(issues: ValidationIssue[], interactionId: string, regions: NormalizedRegion[]): void {
    regions.forEach((region, index) => {
        if (!isWithinFrame(region)) {
            push(issues, `${interactionId}/regions[${index}]`, 'hotspot-out-of-bounds');
        }
    });
}

function validateChoice(
    issues: ValidationIssue[],
    interaction: LearningInteractionV2,
    options: ChoiceOption[],
    correctOptionId: string,
): void {
    if (!Array.isArray(options) || options.length < 2) {
        push(issues, interaction.id, 'invalid-options');
        return;
    }
    if (!options.some((option) => option.id === correctOptionId)) {
        push(issues, interaction.id, 'invalid-correct-option');
    }
}

function validateInteraction(issues: ValidationIssue[], interaction: LearningInteractionV2): void {
    const path = interaction.id;

    if (!isFilled(interaction.id)) {
        push(issues, path, 'invalid-id');
    }
    if (!hasCompetency(interaction.competencyIds)) {
        push(issues, path, 'missing-competency');
    }
    if (interaction.evidenceKind === undefined || interaction.evidenceKind === null) {
        push(issues, path, 'missing-evidence-kind');
    } else if (!EVIDENCE_KINDS.includes(interaction.evidenceKind)) {
        push(issues, path, 'invalid-evidence-kind');
    }
    if (!COMPLETION_RULES.has(interaction.completionRule)) {
        push(issues, path, 'invalid-completion-rule');
    }
    if (typeof interaction.criticalSafety !== 'boolean') {
        push(issues, path, 'missing-critical-safety');
    }
    if (!isFilled(interaction.feedback?.correct) || !isFilled(interaction.feedback?.incorrect)) {
        push(issues, path, 'missing-feedback');
    }
    if (!isFilled(interaction.accessibility?.label)) {
        push(issues, path, 'missing-accessible-label');
    }
    if (!isFilled((interaction.payload as { prompt?: string })?.prompt)) {
        push(issues, path, 'missing-prompt');
    }

    switch (interaction.type) {
        case 'multiple-choice':
        case 'comparison':
        case 'case-decision':
            validateChoice(issues, interaction, interaction.payload.options, interaction.payload.correctOptionId);
            break;
        case 'hotspot': {
            const regions = interaction.payload.regions ?? [];
            if (regions.length === 0) {
                push(issues, path, 'missing-regions');
            }
            validateRegions(issues, path, regions);
            const regionIds = new Set(regions.map((region) => region.id));
            const correct = interaction.payload.correctRegionIds ?? [];
            if (correct.length === 0 || correct.some((id) => !regionIds.has(id))) {
                push(issues, path, 'invalid-correct-region');
            }
            break;
        }
        case 'risk-hunt': {
            const risks = interaction.payload.risks ?? [];
            if (risks.length === 0) {
                push(issues, path, 'missing-regions');
            }
            validateRegions(issues, path, risks);
            break;
        }
        case 'matching':
            if (!Array.isArray(interaction.payload.pairs) || interaction.payload.pairs.length < 2) {
                push(issues, path, 'invalid-pairs');
            }
            break;
        case 'ordering': {
            const items = interaction.payload.items ?? [];
            const order = interaction.payload.correctOrder ?? [];
            if (items.length < 2) {
                push(issues, path, 'invalid-items');
            }
            // A ordem correta precisa ser uma permutação exata dos itens: uma
            // ordem que repete ou omite um item aceita mais de uma resposta
            // "certa", e a evidência produzida deixa de significar algo.
            const itemIds = items.map((item) => item.id).sort();
            const orderIds = [...order].sort();
            if (orderIds.length !== itemIds.length
                || new Set(order).size !== order.length
                || itemIds.some((id, index) => id !== orderIds[index])) {
                push(issues, path, 'invalid-correct-order');
            }
            break;
        }
        case 'parameter-lab': {
            const parameters = interaction.payload.parameters ?? [];
            if (parameters.length === 0 || parameters.some((parameter) => parameter.min >= parameter.max)) {
                push(issues, path, 'invalid-parameters');
            }
            if (!isFilled(interaction.payload.expectedOutcome)) {
                push(issues, path, 'missing-expected-outcome');
            }
            break;
        }
    }
}

export function validateLearningActivity(activity: LearningActivityV2): ValidationIssue[] {
    const issues: ValidationIssue[] = [];
    const path = activity?.id ?? 'activity';
    const steps = Array.isArray(activity?.steps) ? activity.steps : [];
    const interactions = steps
        .filter((step): step is Extract<LearningStepV2, { kind: 'interaction' }> => step.kind === 'interaction')
        .map((step) => step.interaction);

    if (!isFilled(activity?.id)) {
        push(issues, path, 'invalid-id');
    }
    if (!hasCompetency(activity?.competencyIds)) {
        push(issues, path, 'missing-competency');
    }
    if (!isFilled(activity?.provenance?.contentVersion)) {
        push(issues, path, 'missing-provenance');
    }
    if (steps.length < MIN_STEPS || steps.length > MAX_STEPS) {
        push(issues, path, 'invalid-step-count');
    }
    if (interactions.length < MIN_INTERACTIONS || interactions.length > MAX_INTERACTIONS) {
        push(issues, path, 'invalid-interaction-count');
    }

    const seenIds = new Set<string>();
    for (const step of steps) {
        const stepId = step.kind === 'presentation' ? step.id : step.interaction.id;
        if (seenIds.has(stepId)) {
            push(issues, stepId, 'duplicate-id');
        } else {
            seenIds.add(stepId);
        }

        if (step.kind === 'presentation') {
            if (!PRESENTATION_ROLES.has(step.role)) {
                push(issues, stepId, 'invalid-presentation-role');
            }
            if (!isFilled(step.payload?.title) || !isFilled(step.payload?.body)) {
                push(issues, stepId, 'incomplete-presentation');
            }
        } else {
            validateInteraction(issues, step.interaction);
        }
    }

    return issues;
}
