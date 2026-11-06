import type { LearningInteractionV2 } from '../../../types/learningActivity';
import { benchDirection } from '../renderers/InteractionAnswerValue';

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
        default:
            return interaction.feedback.incorrect;
    }
}
