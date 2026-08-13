import type { LearningInteractionV2 } from '../../../types/learningActivity';

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
        default:
            return false;
    }
}
