import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { LearningActivityV2, LearningStepV2 } from '../../../types/learningActivity';
import {
    isCompleteInteractionValue,
    isCorrectInteractionValue,
} from '../renderers/InteractionAnswerValue';

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
    firstConfirmedAnswers: Record<string, boolean>;
    showingFeedback: boolean;
    isRetry: boolean;
};

export function useLearningActivity(
    activity: LearningActivityV2 | null,
    initialStepIndex = 0,
    options: { feedbackPerItem?: boolean; repeatIncorrect?: boolean } = {},
): UseLearningActivity {
    const [stepIndex, setStepIndex] = useState(() => activity ? Math.max(0, initialStepIndex) : 0);
    const initialCursorAppliedRef = useRef(activity !== null);
    const [value, setValue] = useState<string | undefined>();
    const [confirmedAnswers, setConfirmedAnswers] = useState<Record<string, boolean>>({});
    const [lastFeedback, setLastFeedback] = useState<LearningActivityFeedback | null>(null);

    const [firstConfirmedAnswers, setFirstConfirmedAnswers] = useState<Record<string, boolean>>({});
    const [showingFeedback, setShowingFeedback] = useState(false);
    const [retries, setRetries] = useState<LearningStepV2[]>([]);
    const answeredRef = useRef(false);
    const baseSteps = activity?.steps ?? [];
    const steps = [...baseSteps, ...retries];
    const isRetry = stepIndex >= baseSteps.length && retries.length > 0;
    const { feedbackPerItem = false, repeatIncorrect = false } = options;
    const totalSteps = steps.length;
    const currentStep = steps[stepIndex] ?? null;
    const isLastStep = totalSteps > 0 && stepIndex === totalSteps - 1;
    const progress = totalSteps > 0 ? (stepIndex + 1) / totalSteps : 0;

    useEffect(() => {
        if (!activity || initialCursorAppliedRef.current) return;
        initialCursorAppliedRef.current = true;
        setStepIndex(Math.max(0, Math.min(initialStepIndex, activity.steps.length - 1)));
    }, [activity, initialStepIndex]);

    const canContinue = useMemo(() => {
        if (!currentStep) return false;
        if (showingFeedback) return true;
        // Passo de apresentação não produz evidência: nada a validar.
        if (currentStep.kind === 'presentation') return true;
        return isCompleteInteractionValue(currentStep.interaction, value);
    }, [currentStep, showingFeedback, value]);

    const confirm = useCallback((): Record<string, boolean> => {
        if (!currentStep || !canContinue) {
            return confirmedAnswers;
        }

        let nextConfirmed = confirmedAnswers;

        if (currentStep.kind === 'interaction' && !showingFeedback) {
            if (answeredRef.current) return confirmedAnswers;
            answeredRef.current = true;
            const { interaction } = currentStep;
            const correct = isCorrectInteractionValue(interaction, value);

            nextConfirmed = { ...confirmedAnswers, [interaction.id]: correct };
            setConfirmedAnswers(nextConfirmed);
            if (!Object.hasOwn(firstConfirmedAnswers, interaction.id)) {
                setFirstConfirmedAnswers({ ...firstConfirmedAnswers, [interaction.id]: correct });
            }
            if (repeatIncorrect && !isRetry && !correct) {
                setRetries(current => [...current, currentStep]);
            }
            setLastFeedback({
                correct,
                message: correct ? interaction.feedback.correct : interaction.feedback.incorrect,
            });
            if (feedbackPerItem) {
                setShowingFeedback(true);
                return nextConfirmed;
            }
        }

        if (!isLastStep) {
            setStepIndex((current) => current + 1);
            // Zerar aqui, e não ao entrar no passo, evita que a resposta da
            // interação anterior apareça pré-selecionada na próxima.
            setValue(undefined);
            setShowingFeedback(false);
            answeredRef.current = false;
        }

        return nextConfirmed;
    }, [canContinue, confirmedAnswers, currentStep, feedbackPerItem, firstConfirmedAnswers,
        isLastStep, isRetry, repeatIncorrect, showingFeedback, value]);

    const selectValue = useCallback((next: string) => {
        if (!showingFeedback && !answeredRef.current) setValue(next);
    }, [showingFeedback]);

    return {
        stepIndex,
        currentStep,
        totalSteps,
        isLastStep,
        progress,
        value,
        setValue: selectValue,
        canContinue,
        confirm,
        confirmedAnswers,
        lastFeedback,
        firstConfirmedAnswers,
        showingFeedback,
        isRetry,
    };
}
