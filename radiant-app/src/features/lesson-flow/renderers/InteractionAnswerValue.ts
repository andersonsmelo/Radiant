import type { BenchControl, LearningInteractionV2 } from '../../../types/learningActivity';
import { isExposureReference } from '../../../types/learningActivity';
import { exposureModel, subjectContrast } from '../../bench/exposureModel';

/**
 * O contrato do player transporta uma resposta como `string`. Interações com
 * mais de uma posição usam uma lista JSON de ids: é determinística, não depende
 * de texto visível e continua atravessando o mesmo contrato controlado dos
 * renderizadores simples.
 */
export function encodeInteractionIdSequence(ids: string[]): string {
    return JSON.stringify(ids);
}

export function decodeInteractionIdSequence(value: string | undefined): string[] {
    if (!value) {
        return [];
    }

    try {
        const parsed: unknown = JSON.parse(value);
        return Array.isArray(parsed) && parsed.every((item) => typeof item === 'string')
            ? parsed
            : [];
    } catch {
        return [];
    }
}

/** Os valores dos controles da bancada, indexados pelo id do controle. */
export type BenchValues = Record<string, number>;

/** A bancada transporta os controles como objeto JSON, ex.: `{"kv":70,"mas":10}`. */
export function encodeBenchValue(values: BenchValues): string {
    return JSON.stringify(values);
}

function parseBenchObject(value: string | undefined): Record<string, unknown> | null {
    if (!value) {
        return null;
    }

    try {
        const parsed: unknown = JSON.parse(value);
        return typeof parsed === 'object' && parsed !== null && !Array.isArray(parsed)
            ? (parsed as Record<string, unknown>)
            : null;
    } catch {
        return null;
    }
}

/**
 * Nunca lança. Cada controle ausente, não numérico ou fora de [min, max] volta
 * ao `initial`, e um valor que não é objeto JSON devolve todos os `initial`.
 */
export function decodeBenchValue(value: string | undefined, controls: BenchControl[]): BenchValues {
    const parsed = parseBenchObject(value);

    return Object.fromEntries(
        controls.map((control) => {
            const candidate = parsed?.[control.id];
            const usable = typeof candidate === 'number'
                && Number.isFinite(candidate)
                && candidate >= control.min
                && candidate <= control.max;
            return [control.id, usable ? candidate : control.initial];
        }),
    );
}

/** Contraste e fundo da imagem simulada, as duas medidas que o `match` compara. */
function benchImage(kv: number, mas: number): { contrast: number; background: number } {
    const out = exposureModel({ kv, mas });
    return { contrast: subjectContrast(out), background: out.background };
}

function isBenchGoalMet(interaction: Extract<LearningInteractionV2, { type: 'bench' }>, value: string): boolean {
    const { controls, goal } = interaction.payload;
    const values = decodeBenchValue(value, controls);

    if (goal.kind === 'reach') {
        const current = values[goal.control];
        return current !== undefined
            && (goal.atLeast === undefined || current >= goal.atLeast)
            && (goal.atMost === undefined || current <= goal.atMost);
    }

    // `match` sem referência válida é conteúdo defeituoso (`invalid-goal`): nunca
    // acerta, em vez de lançar ou comparar contra NaN.
    if (!isExposureReference(goal.reference)) {
        return false;
    }

    // Controle que a bancada não oferece fica na referência: só se compara o que o aluno ajusta.
    const student = benchImage(values.kv ?? goal.reference.kv, values.mas ?? goal.reference.mas);
    const target = benchImage(goal.reference.kv, goal.reference.mas);
    return Math.abs(student.contrast - target.contrast) <= goal.tolerance
        && Math.abs(student.background - target.background) <= goal.tolerance;
}

/**
 * Para que lado o aluno errou. Em `reach`, olha o controle do alvo. Em `match`,
 * olha o kV, que é quem move o contraste: abaixo da referência é `tooLow`.
 * Quem alcança o alvo, e qualquer interação que não seja a bancada, é `ok`.
 */
export function benchDirection(
    interaction: LearningInteractionV2,
    value: string | undefined,
): 'ok' | 'tooLow' | 'tooHigh' {
    if (interaction.type !== 'bench' || value === undefined || isBenchGoalMet(interaction, value)) {
        return 'ok';
    }

    const { controls, goal } = interaction.payload;
    const values = decodeBenchValue(value, controls);

    if (goal.kind === 'reach') {
        const current = values[goal.control];
        if (current !== undefined && goal.atLeast !== undefined && current < goal.atLeast) {
            return 'tooLow';
        }
        return 'tooHigh';
    }

    // Sem referência válida não há lado a indicar; o retorno cai no genérico.
    if (!isExposureReference(goal.reference)) {
        return 'ok';
    }

    const kv = values.kv ?? goal.reference.kv;
    return kv < goal.reference.kv ? 'tooLow' : 'tooHigh';
}

function isExactPermutation(actual: string[], expected: string[]): boolean {
    if (actual.length !== expected.length || new Set(actual).size !== actual.length) {
        return false;
    }

    const expectedIds = new Set(expected);
    return actual.every((id) => expectedIds.has(id));
}

export function isCompleteInteractionValue(
    interaction: LearningInteractionV2,
    value: string | undefined,
): boolean {
    if (value === undefined) {
        return false;
    }

    switch (interaction.type) {
        case 'multiple-choice':
        case 'comparison':
        case 'case-decision':
            return interaction.payload.options.some((option) => option.id === value);
        case 'hotspot':
            return interaction.payload.regions.some((region) => region.id === value);
        case 'matching':
            return isExactPermutation(
                decodeInteractionIdSequence(value),
                interaction.payload.pairs.map((pair) => pair.id),
            );
        case 'ordering':
            return isExactPermutation(
                decodeInteractionIdSequence(value),
                interaction.payload.items.map((item) => item.id),
            );
        case 'bench':
            return parseBenchObject(value) !== null;
        default:
            return false;
    }
}

export function isCorrectInteractionValue(
    interaction: LearningInteractionV2,
    value: string | undefined,
): boolean {
    if (!isCompleteInteractionValue(interaction, value) || value === undefined) {
        return false;
    }

    switch (interaction.type) {
        case 'multiple-choice':
        case 'comparison':
        case 'case-decision':
            return value === interaction.payload.correctOptionId;
        case 'hotspot':
            return interaction.payload.correctRegionIds.includes(value);
        case 'matching':
            return decodeInteractionIdSequence(value).every(
                (rightId, index) => rightId === interaction.payload.pairs[index]?.id,
            );
        case 'ordering':
            return decodeInteractionIdSequence(value).every(
                (itemId, index) => itemId === interaction.payload.correctOrder[index],
            );
        case 'bench':
            return isBenchGoalMet(interaction, value);
        default:
            return false;
    }
}
