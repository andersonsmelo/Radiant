import React from 'react';
import { StyleSheet } from 'react-native';
import { fireEvent, render } from '@testing-library/react-native';
import { MultipleChoiceStepRenderer } from './MultipleChoiceStepRenderer';
import { feedbackColors, galaxyColors } from '../../../ui/theme';

const payload = {
    prompt: 'Qual?',
    options: [{ id: 'a', label: 'Alfa' }, { id: 'b', label: 'Beta' }, { id: 'c', label: 'Gama' }],
    correctOptionId: 'a',
    explanation: 'Alfa.',
};
const textColor = (view: ReturnType<typeof render>, label: string) =>
    (StyleSheet.flatten(view.getByText(label).props.style) as { color: string }).color;

describe('MultipleChoiceStepRenderer', () => {
    it('depois de conferir, a certa fica correct, a escolhida errada fica incorrect e as outras dimmed', () => {
        const view = render(<MultipleChoiceStepRenderer payload={payload} selectedOptionId="b" onSelect={jest.fn()} submitted correctOptionId="a" />);

        expect(view.getByTestId('lesson-option-a').props.accessibilityValue).toEqual({ text: 'certa' });
        expect(view.getByTestId('lesson-option-b').props.accessibilityValue).toEqual({ text: 'errada' });
        expect(view.getByTestId('lesson-option-c').props.accessibilityValue.text).toBeUndefined();
        expect(view.getByTestId('lesson-option-b').props.accessibilityState).toEqual({ selected: true, disabled: true });
        expect(textColor(view, 'Alfa')).toBe(feedbackColors.success.fill);
        expect(textColor(view, 'Beta')).toBe(feedbackColors.error.fill);
        expect(textColor(view, 'Gama')).toBe(galaxyColors.textTertiary);
        expect(view.getAllByTestId('verdict-icon-correct', { includeHiddenElements: true })).toHaveLength(1);
        expect(view.getAllByTestId('verdict-icon-incorrect', { includeHiddenElements: true })).toHaveLength(1);
    });

    it('acertando, só a certa recebe marca e nenhuma fica incorrect', () => {
        const view = render(<MultipleChoiceStepRenderer payload={payload} selectedOptionId="a" onSelect={jest.fn()} submitted correctOptionId="a" />);
        expect(view.getAllByTestId('verdict-icon-correct', { includeHiddenElements: true })).toHaveLength(1);
        expect(view.queryByTestId('verdict-icon-incorrect', { includeHiddenElements: true })).toBeNull();
    });

    it('antes de conferir, não há veredito: só a escolhida fica em destaque', () => {
        const view = render(<MultipleChoiceStepRenderer payload={payload} selectedOptionId="b" onSelect={jest.fn()} correctOptionId="a" />);
        expect(view.queryByTestId('verdict-icon-correct', { includeHiddenElements: true })).toBeNull();
        expect(view.queryByTestId('verdict-icon-incorrect', { includeHiddenElements: true })).toBeNull();
        expect(view.getByTestId('lesson-option-b').props.accessibilityState.selected).toBe(true);
    });

    it('o texto "Selecionada" não aparece mais', () => {
        const view = render(<MultipleChoiceStepRenderer payload={payload} selectedOptionId="b" onSelect={jest.fn()} />);
        expect(view.queryByText('Selecionada')).toBeNull();
    });

    it('lesson-option-<id> continua existindo e seleciona ao toque; conferida, não seleciona', () => {
        const onSelect = jest.fn();
        const view = render(<MultipleChoiceStepRenderer payload={payload} onSelect={onSelect} />);
        fireEvent.press(view.getByTestId('lesson-option-c'));
        expect(onSelect).toHaveBeenCalledWith('c');

        const done = render(<MultipleChoiceStepRenderer payload={payload} onSelect={onSelect} submitted />);
        fireEvent.press(done.getByTestId('lesson-option-c'));
        expect(onSelect).toHaveBeenCalledTimes(1);
    });
});
