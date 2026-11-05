import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react-native';
import { realEditorialPilotEnvelope } from '../../test/fixtures/realEditorialPreview';
import { AbstractCollimationRenderer } from './AbstractCollimationRenderer';

const bench = () => {
    const activity = realEditorialPilotEnvelope().activities.find(activity => activity.steps.some(step => step.kind === 'interaction' && step.interaction.type === 'bench'))!;
    const step = activity.steps.find(step => step.kind === 'interaction');
    if (step?.kind !== 'interaction') throw Error('Expected bench');
    return step.interaction;
};

describe('PC06-B abstract collimation renderer', () => {
    it('emits only its initial encoded control and draws the actual scene coordinates', () => {
        const onChange = jest.fn();
        render(<AbstractCollimationRenderer interaction={bench()} value={JSON.stringify({ fieldWidth: 21 })} onChange={onChange} />);
        expect(screen.getByTestId('abstract-field', { includeHiddenElements: true }).props).toMatchObject({ x: 30, width: 210, height: 330 });
        expect(screen.getByTestId('abstract-target', { includeHiddenElements: true }).props).toMatchObject({ x: 45, width: 180 });
        expect(onChange).not.toHaveBeenCalled();
    });

    it('initializes the control and exposes decrement/increment and spatial text without the answer interval', () => {
        const onChange = jest.fn();
        render(<AbstractCollimationRenderer interaction={bench()} value={undefined} onChange={onChange} />);
        expect(onChange).toHaveBeenCalledWith(JSON.stringify({ fieldWidth: 27 }));
        expect(screen.getByText(/As margens laterais juntas/).props.children).toContain('33%');
        expect(screen.queryByText(/18–20|18 cm/)).toBeNull();
        fireEvent.press(screen.getByRole('button', { name: 'Diminuir Largura do campo' }));
        expect(onChange).toHaveBeenLastCalledWith(JSON.stringify({ fieldWidth: 26 }));
    });

    it('updates the drawn geometry and equivalent text after a controlled update', () => {
        const ui = render(<AbstractCollimationRenderer interaction={bench()} value={JSON.stringify({ fieldWidth: 27 })} onChange={jest.fn()} />);
        ui.rerender(<AbstractCollimationRenderer interaction={bench()} value={JSON.stringify({ fieldWidth: 17 })} onChange={jest.fn()} />);
        expect(screen.getByTestId('abstract-field', { includeHiddenElements: true }).props.width).toBe(170);
        expect(screen.getByText(/Parte do alvo está fora do campo/)).toBeTruthy();
    });

    it('discards a fractional drag preview once the snapped answer is confirmed', () => {
        const interaction = bench();
        const ui = render(<AbstractCollimationRenderer interaction={interaction} value={JSON.stringify({ fieldWidth: 21 })} onChange={jest.fn()} />);
        fireEvent(screen.getByTestId('bench-slider-fieldWidth', { includeHiddenElements: true }), 'valueChange', 20.4);
        expect(screen.getByTestId('abstract-field', { includeHiddenElements: true }).props.width).toBeCloseTo(204);
        ui.rerender(<AbstractCollimationRenderer interaction={interaction} value={JSON.stringify({ fieldWidth: 20 })} onChange={jest.fn()} submitted />);
        expect(screen.getByTestId('abstract-field', { includeHiddenElements: true }).props.width).toBe(200);
    });

    it('locks both buttons and accessibility adjustments after confirmation', () => {
        const onChange = jest.fn();
        render(<AbstractCollimationRenderer interaction={bench()} value={JSON.stringify({ fieldWidth: 20 })} onChange={onChange} submitted />);
        const button = screen.getByRole('button', { name: 'Diminuir Largura do campo' });
        expect(button).toBeDisabled();
        fireEvent.press(button);
        expect(onChange).not.toHaveBeenCalled();
    });
});
