import { act, renderHook } from '@testing-library/react-native';
import type { LearningActivityV2, LearningStepV2 } from '../../../types/learningActivity';
import { useLearningActivity } from './useLearningActivity';

function presentation(id: string, role: 'hook' | 'concept' | 'closing'): LearningStepV2 {
    return { kind: 'presentation', id, role, payload: { title: `Título ${id}`, body: 'Corpo.' } };
}

function interaction(id: string, correctOptionId = 'a'): LearningStepV2 {
    return {
        kind: 'interaction',
        interaction: {
            type: 'multiple-choice',
            id,
            competencyIds: ['competency:legacy:lesson-1'],
            evidenceKind: 'legacy-lesson-recall',
            completionRule: 'answered',
            criticalSafety: false,
            feedback: { correct: 'Isso mesmo.', incorrect: 'Reveja o conceito.' },
            accessibility: { label: 'Questão' },
            payload: {
                prompt: 'Qual?',
                options: [{ id: 'a', label: 'Osso' }, { id: 'b', label: 'Ar' }],
                correctOptionId,
            },
        },
    };
}

function activity(steps: LearningStepV2[]): LearningActivityV2 {
    return {
        id: 'activity:legacy:block:lesson-1:intro',
        competencyIds: ['competency:legacy:lesson-1'],
        provenance: { contentVersion: 'legacy-lesson-catalog', sourceIds: ['lesson-1'] },
        steps,
    };
}

const padrao = () => activity([
    presentation('step:hook', 'hook'),
    interaction('step:question'),
    presentation('step:closing', 'closing'),
]);

describe('useLearningActivity — navegação', () => {
    it('começa no primeiro passo e conhece o total', () => {
        const { result } = renderHook(() => useLearningActivity(padrao()));

        expect(result.current.stepIndex).toBe(0);
        expect(result.current.totalSteps).toBe(3);
        expect(result.current.isLastStep).toBe(false);
        expect(result.current.progress).toBeCloseTo(1 / 3);
    });

    it('avança em passo de apresentação sem exigir resposta', () => {
        const { result } = renderHook(() => useLearningActivity(padrao()));

        expect(result.current.canContinue).toBe(true);
        act(() => { result.current.confirm(); });

        expect(result.current.stepIndex).toBe(1);
    });

    it('devolve estado vazio e seguro quando não há atividade', () => {
        const { result } = renderHook(() => useLearningActivity(null));

        expect(result.current.currentStep).toBeNull();
        expect(result.current.totalSteps).toBe(0);
        expect(result.current.canContinue).toBe(false);
        expect(result.current.confirm()).toEqual({});
    });
});

describe('useLearningActivity — não avança sem evidência válida', () => {
    it('bloqueia o avanço enquanto a interação não tem resposta', () => {
        const { result } = renderHook(() => useLearningActivity(padrao()));

        act(() => { result.current.confirm(); });
        expect(result.current.stepIndex).toBe(1);

        expect(result.current.canContinue).toBe(false);
        act(() => { result.current.confirm(); });
        expect(result.current.stepIndex).toBe(1);
    });

    it('libera o avanço assim que há resposta escolhida', () => {
        const { result } = renderHook(() => useLearningActivity(padrao()));

        act(() => { result.current.confirm(); });
        act(() => { result.current.setValue('a'); });

        expect(result.current.canContinue).toBe(true);
        act(() => { result.current.confirm(); });
        expect(result.current.stepIndex).toBe(2);
    });
});

describe('useLearningActivity — resposta por etapa', () => {
    it('conserva a resposta de cada interação, indexada pelo id dela', () => {
        const { result } = renderHook(() => useLearningActivity(activity([
            presentation('step:hook', 'hook'),
            interaction('step:q1'),
            interaction('step:q2', 'b'),
        ])));

        act(() => { result.current.confirm(); });
        act(() => { result.current.setValue('a'); });
        act(() => { result.current.confirm(); });
        act(() => { result.current.setValue('a'); });
        act(() => { result.current.confirm(); });

        expect(result.current.confirmedAnswers).toEqual({
            'step:q1': true,
            'step:q2': false,
        });
    });

    it('limpa o valor corrente ao entrar numa interação nova', () => {
        const { result } = renderHook(() => useLearningActivity(activity([
            interaction('step:q1'),
            interaction('step:q2'),
        ])));

        act(() => { result.current.setValue('a'); });
        act(() => { result.current.confirm(); });

        expect(result.current.value).toBeUndefined();
        expect(result.current.canContinue).toBe(false);
    });

    it('trocar a alternativa antes de confirmar não penaliza', () => {
        const { result } = renderHook(() => useLearningActivity(activity([interaction('step:q1')])));

        act(() => { result.current.setValue('b') });
        act(() => { result.current.setValue('a') });

        let confirmed: Record<string, boolean> = {};
        act(() => { confirmed = result.current.confirm(); });

        expect(confirmed).toEqual({ 'step:q1': true });
    });
});

describe('useLearningActivity — entrega ao outcome', () => {
    /**
     * Este é o teste de corrida que o plano manda verificar por reversão:
     * trocando o retorno de `confirm()` pelo estado anterior, ele falha.
     * `setState` é assíncrono, então no último passo o estado ainda não conteria
     * a resposta que acabou de ser confirmada — e o outcome receberia um mapa
     * sem ela.
     */
    it('devolve a resposta confirmada no MESMO confirm, sem esperar o estado', () => {
        const { result } = renderHook(() => useLearningActivity(activity([
            presentation('step:hook', 'hook'),
            interaction('step:q1'),
        ])));

        act(() => { result.current.confirm(); });
        act(() => { result.current.setValue('a'); });

        let confirmed: Record<string, boolean> = {};
        act(() => { confirmed = result.current.confirm(); });

        expect(confirmed).toEqual({ 'step:q1': true });
        expect(result.current.isLastStep).toBe(true);
    });

    it('registra escolha errada como false', () => {
        const { result } = renderHook(() => useLearningActivity(activity([interaction('step:q1')])));

        act(() => { result.current.setValue('b'); });

        let confirmed: Record<string, boolean> = {};
        act(() => { confirmed = result.current.confirm(); });

        expect(confirmed).toEqual({ 'step:q1': false });
    });

    it('expõe o feedback da última interação confirmada, para o passo de reforço', () => {
        const { result } = renderHook(() => useLearningActivity(activity([
            interaction('step:q1'),
            presentation('step:closing', 'closing'),
        ])));

        act(() => { result.current.setValue('b'); });
        act(() => { result.current.confirm(); });

        expect(result.current.lastFeedback).toEqual({ correct: false, message: 'Reveja o conceito.' });
    });
});
