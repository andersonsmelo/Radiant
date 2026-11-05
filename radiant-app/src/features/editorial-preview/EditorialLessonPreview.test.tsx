import React from 'react';
import { AccessibilityInfo } from 'react-native';
import { act, fireEvent, render, screen } from '@testing-library/react-native';
import { realEditorialPreview } from '../../test/fixtures/realEditorialPreview';
import { EditorialLessonPreview } from './EditorialLessonPreview';

jest.mock('@expo/vector-icons/MaterialIcons', () => 'MaterialIcons');
jest.mock('../../ui/accessibility/useReducedMotionPreference', () => ({ useReducedMotionPreference: () => true }));

const material = () => realEditorialPreview();
const next = () => fireEvent.press(screen.getByRole('button', { name: 'Continuar' }));
function reachPractice() { next(); next(); }
function select(id: string) { fireEvent.press(screen.getByTestId(`lesson-option-${id}`)); }
function practiceInteraction() {
    const step = material().candidate.activities[0].steps.find(step => step.kind === 'interaction');
    if (step?.kind !== 'interaction' || step.interaction.type !== 'multiple-choice') throw Error('Expected choice');
    return step.interaction;
}

describe('PC06-A isolated editorial preview', () => {
    it('requests a fresh accessibility announcement on the next step without motion', () => {
        const announce = jest.spyOn(AccessibilityInfo, 'announceForAccessibility');
        render(<EditorialLessonPreview material={material()} />);
        const layout = { nativeEvent: { layout: { x: 0, y: 0, width: 320, height: 24 } } };
        fireEvent(screen.getByRole('progressbar'), 'layout', layout);
        expect(announce).toHaveBeenLastCalledWith('Etapa 1 de 4');
        next();
        fireEvent(screen.getByRole('progressbar'), 'layout', layout);
        expect(announce).toHaveBeenLastCalledWith('Etapa 2 de 4');
        announce.mockRestore();
    });
    it('renders preparation without injected material and rejects incomplete attachments', () => {
        const ui = render(<EditorialLessonPreview />);
        expect(screen.getByText('Conteúdo em preparação')).toBeTruthy();
        ui.rerender(<EditorialLessonPreview material={{ candidate: {} }} />);
        expect(screen.getByText('Não foi possível abrir esta prévia.')).toBeTruthy();
    });

    it('requires selection and confirmation before revealing the exact practice feedback', () => {
        const onObservation = jest.fn();
        render(<EditorialLessonPreview material={material()} onObservation={onObservation} />);
        reachPractice();
        const interaction = practiceInteraction();
        const option = interaction.payload.options[0];
        expect(screen.getByRole('button', { name: 'Confirmar resposta' })).toBeDisabled();
        select(option.id);
        expect(screen.queryByText(option.explanation!)).toBeNull();
        expect(onObservation).not.toHaveBeenCalled();
        fireEvent.press(screen.getByRole('button', { name: 'Confirmar resposta' }));
        expect(screen.getByText(option.explanation!)).toBeTruthy();
        expect(onObservation).toHaveBeenCalledWith(expect.objectContaining({
            kind: 'answer-confirmed', targetId: material().candidate.activities[0].id,
            value: option.id, correct: false, helpUsed: false, stage: 'lesson',
        }));
        expect(screen.getByTestId(`lesson-option-${option.id}`).props.accessibilityState).toMatchObject({ disabled: true, selected: true });
    });

    it('records help once and marks the first confirmation as assisted', () => {
        const onObservation = jest.fn();
        render(<EditorialLessonPreview material={material()} onObservation={onObservation} />);
        reachPractice();
        const help = screen.getByRole('button', { name: 'Ver ajuda' });
        act(() => { fireEvent.press(help); fireEvent.press(help); });
        expect(screen.getByText(material().optionalHelp.text)).toBeTruthy();
        select(practiceInteraction().payload.correctOptionId);
        fireEvent.press(screen.getByRole('button', { name: 'Confirmar resposta' }));
        expect(onObservation.mock.calls.filter(([event]) => event.kind === 'help-opened')).toHaveLength(1);
        expect(onObservation.mock.calls.filter(([event]) => event.kind === 'answer-confirmed')).toEqual([
            [expect.objectContaining({ correct: true, helpUsed: true, assisted: true })],
        ]);
    });

    it('keeps confirmation idempotent and never submits again when continuing feedback', () => {
        const onObservation = jest.fn();
        render(<EditorialLessonPreview material={material()} onObservation={onObservation} />);
        reachPractice(); select(practiceInteraction().payload.correctOptionId);
        const confirm = screen.getByRole('button', { name: 'Confirmar resposta' });
        act(() => { fireEvent.press(confirm); fireEvent.press(confirm); });
        expect(onObservation.mock.calls.filter(([event]) => event.kind === 'answer-confirmed')).toHaveLength(1);
    });

    it('shows the checkpoint return belonging to the selected alternative and clears the next choice', () => {
        const input = material();
        const onObservation = jest.fn();
        render(<EditorialLessonPreview material={input} stage="checkpoint" onObservation={onObservation} />);
        next();
        const first = input.candidate.checkpoint.items[0];
        const selected = first.options[1];
        select(selected.id);
        const explanation = input.checkpointOptionFeedback[0].byOptionId[selected.id];
        expect(screen.queryByText(explanation)).toBeNull();
        fireEvent.press(screen.getByRole('button', { name: 'Confirmar resposta' }));
        expect(screen.getByText(explanation)).toBeTruthy();
        expect(onObservation).toHaveBeenLastCalledWith(expect.objectContaining({ targetId: first.id, stage: 'checkpoint', correct: false }));
        next();
        expect(screen.getByRole('button', { name: 'Confirmar resposta' })).toBeDisabled();
        input.candidate.checkpoint.items[1].options.forEach(option => {
            expect(screen.getByTestId(`lesson-option-${option.id}`).props.accessibilityState).toMatchObject({ selected: false });
        });
    });

    it.each(['guided-recovery', 'different-context-retry'] as const)('uses the separate %s context and evidence', stage => {
        const input = material();
        const index = stage === 'guided-recovery' ? 0 : 1;
        const recovery = input.recoveryActivities[index];
        const step = recovery.steps.find(step => step.kind === 'interaction');
        if (step?.kind !== 'interaction' || step.interaction.type !== 'multiple-choice') throw Error('Expected choice');
        const onObservation = jest.fn();
        render(<EditorialLessonPreview material={input} stage={stage} onObservation={onObservation} />);
        next();
        expect(screen.getByText(step.interaction.payload.prompt)).toBeTruthy();
        select(step.interaction.payload.correctOptionId);
        fireEvent.press(screen.getByRole('button', { name: 'Confirmar resposta' }));
        expect(onObservation).toHaveBeenCalledWith(expect.objectContaining({
            targetId: recovery.id, stage, assisted: stage === 'guided-recovery',
            evidenceKind: stage === 'guided-recovery' ? 'guided-practice' : 'applied-transfer',
        }));
    });

    it('does not reuse selection or a stale confirmed answer when the stage changes', () => {
        const input = material();
        const ui = render(<EditorialLessonPreview material={input} />);
        reachPractice(); select(practiceInteraction().payload.correctOptionId);
        ui.rerender(<EditorialLessonPreview material={input} stage="checkpoint" />);
        expect(screen.getByText('Avaliação')).toBeTruthy();
        next();
        expect(screen.getByRole('button', { name: 'Confirmar resposta' })).toBeDisabled();
    });

    it('resets the ephemeral session when authored help changes under the same IDs', () => {
        const input = material();
        const ui = render(<EditorialLessonPreview material={input} />);
        reachPractice(); select(practiceInteraction().payload.correctOptionId);
        ui.rerender(<EditorialLessonPreview material={{ ...input, optionalHelp: { ...input.optionalHelp, text: 'Ajuda revisada para o teste.' } }} />);
        expect(screen.getByText('Antes da imagem')).toBeTruthy();
        reachPractice();
        expect(screen.getByRole('button', { name: 'Confirmar resposta' })).toBeDisabled();
    });

    it('finishes only once and reports original first answers without granting completion or rewards', () => {
        const onFinish = jest.fn();
        render(<EditorialLessonPreview material={material()} onFinish={onFinish} />);
        reachPractice(); select(practiceInteraction().payload.correctOptionId);
        fireEvent.press(screen.getByRole('button', { name: 'Confirmar resposta' }));
        next();
        const finish = screen.getByRole('button', { name: 'Encerrar prévia' });
        act(() => { fireEvent.press(finish); fireEvent.press(finish); });
        expect(onFinish).toHaveBeenCalledTimes(1);
        expect(onFinish).toHaveBeenCalledWith(expect.objectContaining({
            stage: 'lesson', firstConfirmedAnswers: { [practiceInteraction().id]: true },
        }));
        expect(screen.getByText('Prévia encerrada')).toBeTruthy();
    });
});
