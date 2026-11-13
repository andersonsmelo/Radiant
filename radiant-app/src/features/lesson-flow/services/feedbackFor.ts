import type { LearningInteractionV2 } from '../../../types/learningActivity';
import { benchDirection, decodeInteractionIdSequence } from '../renderers/InteractionAnswerValue';

function filled(text: string | undefined): text is string {
    return typeof text === 'string' && text.trim().length > 0;
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
        case 'multi-select': {
            const chosen = new Set(decodeInteractionIdSequence(value));
            const correct = new Set(interaction.payload.correctOptionIds);
            const { options } = interaction.payload;
            const missing = options.filter(option => correct.has(option.id) && !chosen.has(option.id));
            const extra = options.filter(option => !correct.has(option.id) && chosen.has(option.id));
            const list = (entries: typeof options) => entries.map(option => option.label).join('; ');
            // A explicação é da primeira divergência na ordem da tela; sem ela, o retorno de erro autoral.
            const first = options.find(option => missing.includes(option) || extra.includes(option));
            return [missing.length ? `Faltou marcar: ${list(missing)}.` : '', extra.length ? `Marcou a mais: ${list(extra)}.` : '',
                filled(first?.explanation) ? first.explanation : interaction.feedback.incorrect].filter(Boolean).join(' ');
        }
        default:
            return interaction.feedback.incorrect;
    }
}
