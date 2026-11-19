import type { LearningInteractionV2 } from '../../../types/learningActivity';
import { benchDirection, decodeCategorizeValue, decodeInteractionIdSequence } from '../renderers/InteractionAnswerValue';

function filled(text: string | undefined): text is string {
    return typeof text === 'string' && text.trim().length > 0;
}

/**
 * Retorno de quem marca um conjunto: o que faltou marcar e o que sobrou, e a
 * explicação da primeira divergência na ordem da tela; sem ela, o retorno de
 * erro autoral.
 */
function markedFeedback(entries: { id: string; label: string; explanation?: string }[], correctIds: string[], value: string | undefined, fallback: string): string {
    const chosen = new Set(decodeInteractionIdSequence(value));
    const correct = new Set(correctIds);
    const missing = entries.filter(entry => correct.has(entry.id) && !chosen.has(entry.id));
    const extra = entries.filter(entry => !correct.has(entry.id) && chosen.has(entry.id));
    const list = (found: typeof entries) => found.map(entry => entry.label).join('; ');
    const first = entries.find(entry => missing.includes(entry) || extra.includes(entry));
    return [missing.length ? `Faltou marcar: ${list(missing)}.` : '', extra.length ? `Marcou a mais: ${list(extra)}.` : '',
        filled(first?.explanation) ? first.explanation : fallback].filter(Boolean).join(' ');
}

/**
 * O texto do retorno depois de "Conferir". O acerto sempre usa `feedback.correct`.
 * No erro, quanto mais específico o que o conteudista escreveu, melhor:
 * - bancada: a dica do lado em que o aluno errou (`hints.tooLow`/`hints.tooHigh`);
 * - escolha: a `explanation` da alternativa marcada;
 * - qualquer outro caso, ou dica/explicação ausente: `feedback.incorrect`.
 */
export function feedbackFor(
    interaction: LearningInteractionV2,
    value: string | undefined,
    correct: boolean,
): string {
    if (correct) {
        return interaction.feedback.correct;
    }

    switch (interaction.type) {
        case 'bench': {
            const direction = benchDirection(interaction, value);
            const hint = direction === 'tooLow'
                ? interaction.payload.hints?.tooLow
                : direction === 'tooHigh'
                    ? interaction.payload.hints?.tooHigh
                    : undefined;
            return filled(hint) ? hint : interaction.feedback.incorrect;
        }
        case 'multiple-choice':
        case 'comparison':
        case 'case-decision': {
            const explanation = interaction.payload.options.find((option) => option.id === value)?.explanation;
            return filled(explanation) ? explanation : interaction.feedback.incorrect;
        }
        // true-false: cada afirmação já mostrou e anunciou a própria explicação; o
        // retorno final usa o de erro autoral, para não repetir o que foi lido.
        case 'multi-select':
            return markedFeedback(interaction.payload.options, interaction.payload.correctOptionIds, value, interaction.feedback.incorrect);
        case 'risk-hunt':
            return markedFeedback(interaction.payload.regions, interaction.payload.riskRegionIds, value, interaction.feedback.incorrect);
        case 'label': {
            // O primeiro ponto errado, na ordem dos pontos, diz qual era o rótulo certo.
            const assigned = decodeCategorizeValue(value);
            const { points, labels } = interaction.payload;
            const at = points.findIndex(point => assigned[point.id] !== point.correctLabelId);
            const right = labels.find(entry => entry.id === points[at]?.correctLabelId)?.label;
            return at >= 0 && filled(right) ? `${interaction.feedback.incorrect} Ponto ${at + 1} é ${right}.` : interaction.feedback.incorrect;
        }
        default:
            return interaction.feedback.incorrect;
    }
}
