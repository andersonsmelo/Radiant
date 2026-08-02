import { useCallback, useMemo, useState } from 'react';
import type { LearningActivityV2, LearningStepV2 } from '../../../types/learningActivity';

/**
 * Estado do player de uma atividade v2.
 *
 * Concentra aqui o que a tela vinha guardando em cinco `useState` soltos e em
 * ramos por tipo de passo. A tela passa a renderizar; o percurso vive neste
 * hook, e por isso pode ser testado sem montar a árvore de UI.
 *
 * Duas regras vêm do contrato legado e continuam valendo para qualquer tipo
 * futuro:
 *
 * - **selecionar não confirma.** Enquanto o passo está na tela a resposta é
 *   trocável e nada foi commitado; quem confirma é o `confirm()`;
 * - **`confirm()` devolve o mapa novo em vez de deixar quem chamou ler o
 *   estado.** `setState` é assíncrono: no último passo, ler o estado logo
 *   depois entregaria ao outcome um mapa **sem** a resposta que acabou de ser
 *   confirmada. O valor local é obrigatório, não uma preferência de estilo.
 */

export type LearningActivityFeedback = {
    correct: boolean;
    message: string;
};

export type UseLearningActivity = {
    stepIndex: number;
    currentStep: LearningStepV2 | null;
    totalSteps: number;
    isLastStep: boolean;
    progress: number;
    value: string | undefined;
    setValue: (value: string) => void;
    canContinue: boolean;
    confirm: () => Record<string, boolean>;
    confirmedAnswers: Record<string, boolean>;
    lastFeedback: LearningActivityFeedback | null;
};

export function useLearningActivity(activity: LearningActivityV2 | null): UseLearningActivity {
    const [stepIndex, setStepIndex] = useState(0);
    const [value, setValue] = useState<string | undefined>();
    const [confirmedAnswers, setConfirmedAnswers] = useState<Record<string, boolean>>({});
    const [lastFeedback, setLastFeedback] = useState<LearningActivityFeedback | null>(null);

    const steps = activity?.steps ?? [];
    const totalSteps = steps.length;
    const currentStep = steps[stepIndex] ?? null;
    const isLastStep = totalSteps > 0 && stepIndex === totalSteps - 1;
    const progress = totalSteps > 0 ? (stepIndex + 1) / totalSteps : 0;

    const canContinue = useMemo(() => {
        if (!currentStep) return false;
        // Passo de apresentação não produz evidência: nada a validar.
        if (currentStep.kind === 'presentation') return true;
        return value !== undefined;
    }, [currentStep, value]);

    const confirm = useCallback((): Record<string, boolean> => {
        if (!currentStep || !canContinue) {
            return confirmedAnswers;
        }

        let nextConfirmed = confirmedAnswers;

        if (currentStep.kind === 'interaction') {
            const { interaction } = currentStep;
            const correct = value === resolveExpectedValue(currentStep);

            nextConfirmed = { ...confirmedAnswers, [interaction.id]: correct };
            setConfirmedAnswers(nextConfirmed);
            setLastFeedback({
                correct,
                message: correct ? interaction.feedback.correct : interaction.feedback.incorrect,
            });
        }

        if (!isLastStep) {
            setStepIndex((current) => current + 1);
            // Zerar aqui, e não ao entrar no passo, evita que a resposta da
            // interação anterior apareça pré-selecionada na próxima.
            setValue(undefined);
        }

        return nextConfirmed;
    }, [canContinue, confirmedAnswers, currentStep, isLastStep, value]);

    return {
        stepIndex,
        currentStep,
        totalSteps,
        isLastStep,
        progress,
        value,
        setValue,
        canContinue,
        confirm,
        confirmedAnswers,
        lastFeedback,
    };
}

/**
 * Qual valor conta como acerto, por tipo de interação.
 *
 * Fica isolado porque é o único ponto que precisa crescer quando um jogo novo
 * entra — e mantê-lo fora do fluxo de estado é o que impede que "como se
 * avalia" e "como se navega" voltem a se misturar, que era o defeito do player
 * anterior.
 */
function resolveExpectedValue(step: Extract<LearningStepV2, { kind: 'interaction' }>): string | undefined {
    const { interaction } = step;

    switch (interaction.type) {
        case 'multiple-choice':
        case 'comparison':
        case 'case-decision':
            return interaction.payload.correctOptionId;
        default:
            return undefined;
    }
}
