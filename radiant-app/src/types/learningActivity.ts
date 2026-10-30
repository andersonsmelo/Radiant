/**
 * Contrato de atividade v2 do motor de aprendizagem.
 *
 * Substitui gradualmente o `LessonBlock` legado, que exige exatamente uma
 * múltipla escolha por bloco. Aqui a interação é uma união discriminada dos nove
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

import { ILLUSTRATION_THEMES, type IllustrationTheme } from '../ui/illustrations/illustrationPlayback';
import type { ExposureInput } from '../features/bench/exposureModel';

export type ValidationIssue = {
    path: string;
    rule: string;
};

/**
 * Os quatro métodos de evidência que o currículo planeja. Espelham exatamente
 * `evidenceMethods` do grafo de competências, em `conteúdo/governança` — se as
 * duas listas divergirem, a evidência produzida deixa de casar com o domínio
 * medido, e isso só apareceria ao calcular domínio, tarde demais.
 */
export type AuthoredEvidenceKind =
    | 'guided-practice'
    | 'independent-recall'
    | 'applied-transfer'
    | 'delayed-retention';

/**
 * Marcador de migração, **fora** do vocabulário do currículo de propósito.
 * Conteúdo legado nunca foi escrito contra uma competência, então a evidência
 * que ele produz não é nenhum dos quatro métodos acima — é apenas "acertou uma
 * questão de lição antiga". Manter isto separado obriga o cálculo de domínio a
 * decidir explicitamente o que fazer com evidência legada, em vez de absorvê-la
 * por engano como se fosse prática deliberada.
 */
export type LegacyEvidenceKind = 'legacy-lesson-recall';

export type EvidenceKind = AuthoredEvidenceKind | LegacyEvidenceKind;

export const AUTHORED_EVIDENCE_KINDS: readonly AuthoredEvidenceKind[] = [
    'guided-practice',
    'independent-recall',
    'applied-transfer',
    'delayed-retention',
];

export const EVIDENCE_KINDS: readonly EvidenceKind[] = [
    ...AUTHORED_EVIDENCE_KINDS,
    'legacy-lesson-recall',
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
    | 'bench'
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

export type ChoiceOption = {
    id: string;
    label: string;
    imageRef?: string;
    /** Por que esta opção está certa ou errada. Aparece no retorno quando o aluno a marca. */
    explanation?: string;
};

/** Imagem simulada de leitura, sem controles nem resposta embutida no rótulo. */
export type ExposureReadingImage = { input: ExposureInput; label: string };

export type MultipleChoiceV2Payload = {
    exposureImage?: ExposureReadingImage;
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

/** Os simuladores da bancada: exposição (kV e mAs) e colimação (o campo). */
export type BenchSimulator = 'exposure' | 'collimation';

/**
 * Os controles que cada simulador aceita. Um controle de colimação numa
 * bancada de exposição, ou o contrário, não move nada na imagem: a validação
 * o recusa (`invalid-controls`).
 */
export const BENCH_SIMULATOR_CONTROLS = {
    exposure: ['kv', 'mas'],
    collimation: ['fieldWidth', 'fieldHeight'],
} as const satisfies Record<BenchSimulator, readonly string[]>;

export type BenchControlId = (typeof BENCH_SIMULATOR_CONTROLS)[BenchSimulator][number];

/**
 * Um controle numérico da bancada, com sua faixa e ponto de partida: kV e mAs
 * na exposição; largura e altura do campo, em cm, na colimação.
 */
export type BenchControl = {
    id: BenchControlId;
    label: string;
    unit: string;
    min: number;
    max: number;
    step: number;
    initial: number;
};

/**
 * O que o aluno precisa alcançar na bancada.
 * - `reach`: um controle passa de um limite (`atLeast`) ou fica sob ele (`atMost`);
 * - `match`: a imagem simulada iguala a da referência. Compara o contraste entre
 *   osso e partes moles (`subjectContrast`) e o fundo (`background`) de
 *   `exposureModel`, cada um dentro de `tolerance`. O mAs só muda o ruído, então
 *   não entra na comparação. Só vale na exposição: a colimação não muda o
 *   contraste, e um `match` nela é `invalid-goal`.
 */
export type BenchGoal =
    | { kind: 'reach'; control: BenchControlId; atLeast?: number; atMost?: number }
    | { kind: 'match'; reference: ExposureInput; tolerance: number };

export type BenchPayload = {
    prompt: string;
    simulator: BenchSimulator;
    mode: 'explore' | 'challenge' | 'correct';
    controls: BenchControl[];
    goal: BenchGoal;
    /** Rótulo do fantoma na tela: ele é simulado, nunca uma incidência real. */
    phantomLabel: string;
    /** Para que lado o aluno errou: valor baixo demais ou alto demais. */
    hints: { tooLow: string; tooHigh: string };
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
    | (InteractionBase & { type: 'bench'; payload: BenchPayload })
    | (InteractionBase & { type: 'risk-hunt'; payload: RiskHuntPayload })
    | (InteractionBase & { type: 'case-decision'; payload: CaseDecisionPayload });

export type PresentationPayload = {
    title: string;
    /**
     * Opcional: uma tela de fechamento pode ser só título ("Avance"), e o
     * contrato legado já permite isso. Exigir corpo aqui reprovaria conteúdo
     * legítimo que o adaptador precisa converter sem inventar texto.
     */
    body?: string;
    eyebrow?: string;
    imageRef?: string;
    tone?: 'positive' | 'neutral' | 'corrective';
};

export type LearningStepV2 =
    | { kind: 'presentation'; id: string; role: PresentationRole; payload: PresentationPayload }
    | { kind: 'interaction'; interaction: LearningInteractionV2 };

export type LearningActivityV2 = {
    /** Tema explícito para aulas de exemplo que não pertencem a um nó da trilha. */
    theme?: IllustrationTheme;
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

/** Número finito dentro de [min, max]; NaN e infinito ficam de fora. */
function isWithinRange(value: unknown, min: number, max: number): boolean {
    return typeof value === 'number' && Number.isFinite(value) && value >= min && value <= max;
}

/**
 * A referência de um `match` precisa trazer kV e mAs numéricos finitos. Sem ela
 * o "Conferir" lançaria `TypeError` (ou, com um campo só, compararia contra
 * `NaN`), então a validação a recusa e os leitores da resposta a conferem de novo.
 */
export function isExposureReference(reference: unknown): reference is ExposureInput {
    if (typeof reference !== 'object' || reference === null) {
        return false;
    }
    const { kv, mas } = reference as Partial<Record<keyof ExposureInput, unknown>>;
    return typeof kv === 'number' && Number.isFinite(kv) && typeof mas === 'number' && Number.isFinite(mas);
}

/** O simulador, se for um que a bancada conhece; `null` para qualquer outro valor. */
function benchSimulatorOf(value: unknown): BenchSimulator | null {
    return typeof value === 'string' && Object.prototype.hasOwnProperty.call(BENCH_SIMULATOR_CONTROLS, value)
        ? (value as BenchSimulator)
        : null;
}

function isSimulatorControl(simulator: BenchSimulator, id: unknown): boolean {
    return (BENCH_SIMULATOR_CONTROLS[simulator] as readonly unknown[]).includes(id);
}

/**
 * O `goal` da bancada é o "pronto" da lição, e um alvo defeituoso não aparece
 * em lugar nenhum: vira lição impossível (controle que não existe, limite fora
 * da faixa, tolerância que nunca é cumprida) ou que se responde sozinha (`reach`
 * sem limite). Como o conteúdo é escrito à mão, este é o único portão.
 */
function isBenchGoalValid(
    goal: BenchGoal | undefined,
    controls: BenchControl[],
    simulator: BenchSimulator | null,
): boolean {
    if (goal === undefined || goal === null) {
        return false;
    }
    if (goal.kind === 'match') {
        // O `match` compara o contraste da exposição. Com simulador desconhecido
        // o defeito já é `invalid-simulator`, e não se repete aqui.
        return simulator !== 'collimation'
            && isExposureReference(goal.reference)
            && typeof goal.tolerance === 'number' && Number.isFinite(goal.tolerance) && goal.tolerance > 0;
    }
    if (goal.kind !== 'reach') {
        return false;
    }

    const target = controls.find((control) => control.id === goal.control);
    if (target === undefined || (goal.atLeast === undefined && goal.atMost === undefined)) {
        return false;
    }
    // O alvo olha um controle de outro simulador: mesmo presente na lista (e
    // apontado por `invalid-controls`), ele não move a imagem desta bancada.
    if (simulator !== null && !isSimulatorControl(simulator, goal.control)) {
        return false;
    }
    // Faixa inválida do controle já é apontada por `invalid-controls`; sem
    // faixa não há como dizer se o limite cabe nela.
    if (!(target.min < target.max)) {
        return true;
    }
    return (goal.atLeast === undefined || isWithinRange(goal.atLeast, target.min, target.max))
        && (goal.atMost === undefined || isWithinRange(goal.atMost, target.min, target.max));
}

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
        case 'multiple-choice': {
            validateChoice(issues, interaction, interaction.payload.options, interaction.payload.correctOptionId);
            const image = interaction.payload.exposureImage;
            if (image !== undefined && (!image || typeof image !== 'object'
                || !isFilled(image.label) || !isExposureReference(image.input)
                || !isWithinRange(image.input.kv, 40, 120) || !isWithinRange(image.input.mas, 1, 40))) {
                push(issues, path, 'invalid-exposure-image');
            }
            break;
        }
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
        case 'bench': {
            const controls = Array.isArray(interaction.payload.controls) ? interaction.payload.controls : [];
            const simulator = benchSimulatorOf(interaction.payload.simulator);
            if (simulator === null) {
                push(issues, path, 'invalid-simulator');
            }
            // `!(min < max)` também reprova NaN, que `min >= max` deixaria passar.
            // Um controle de outro simulador não move a imagem desta bancada. Com
            // simulador desconhecido não há lista a conferir: o defeito é o simulador.
            if (controls.length === 0
                || controls.some((control) => !(control.min < control.max))
                || (simulator !== null && controls.some((control) => !isSimulatorControl(simulator, control.id)))) {
                push(issues, path, 'invalid-controls');
            }
            // Só confere o ponto de partida onde a faixa é válida: a faixa
            // inválida já foi apontada, e repetir o defeito em outra regra
            // esconderia qual dos dois o conteudista precisa corrigir.
            if (controls.some((control) => control.min < control.max
                && !(control.initial >= control.min && control.initial <= control.max))) {
                push(issues, path, 'invalid-initial');
            }
            if (!isFilled(interaction.payload.hints?.tooLow) || !isFilled(interaction.payload.hints?.tooHigh)) {
                push(issues, path, 'missing-hints');
            }
            if (!isBenchGoalValid(interaction.payload.goal, controls, simulator)) {
                push(issues, path, 'invalid-goal');
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
    if (activity?.theme !== undefined && !(ILLUSTRATION_THEMES as readonly unknown[]).includes(activity.theme)) {
        push(issues, path, 'invalid-theme');
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
            if (!isFilled(step.payload?.title)) {
                push(issues, stepId, 'incomplete-presentation');
            }
        } else {
            validateInteraction(issues, step.interaction);
        }
    }

    return issues;
}

const CHOICE_TYPES = new Set<string>(['multiple-choice', 'comparison', 'case-decision']);

/**
 * Avisos editoriais: o que o conteudista deveria corrigir, mas que **não**
 * reprova a atividade. Ficam fora de `validateLearningActivity` de propósito:
 * `ValidationIssue` não tem severidade, e quem chama a validação (catálogo de
 * produção, auditoria da jornada, lote editorial) trata qualquer item como
 * reprovação. O conteúdo de produção existente não tem explicação por
 * alternativa, e passar a recusá-lo derrubaria o catálogo inteiro.
 *
 * - `missing-option-explanation`: escolha com alguma alternativa errada sem
 *   `explanation`. O player, então, cai na frase genérica de `feedback.incorrect`.
 */
export function learningActivityWarnings(activity: LearningActivityV2): ValidationIssue[] {
    const issues: ValidationIssue[] = [];
    const steps = Array.isArray(activity?.steps) ? activity.steps : [];

    for (const step of steps) {
        if (step.kind !== 'interaction' || !CHOICE_TYPES.has(step.interaction.type)) {
            continue;
        }
        const { options, correctOptionId } = step.interaction.payload as {
            options?: ChoiceOption[];
            correctOptionId?: string;
        };
        if (Array.isArray(options) && options.some((option) => option.id !== correctOptionId && !isFilled(option.explanation))) {
            push(issues, step.interaction.id, 'missing-option-explanation');
        }
    }

    return issues;
}
