import React from 'react';
import { Animated } from 'react-native';
import { render, screen } from '@testing-library/react-native';
import { ComboBadge } from './ComboBadge';

let mockReducedMotion = false;
jest.mock('../../../ui/accessibility/useReducedMotionPreference', () => ({
    useReducedMotionPreference: () => mockReducedMotion,
    useReducedMotionPreferenceState: () => ({ reducedMotionEnabled: mockReducedMotion, resolved: true }),
}));

describe('ComboBadge', () => {
    let timing: jest.SpyInstance;

    beforeEach(() => {
        mockReducedMotion = false;
        timing = jest.spyOn(Animated, 'timing');
    });

    afterEach(() => timing.mockRestore());

    it.each([[3, '3 seguidas'], [5, '5 seguidas'], [10, '10 seguidas']] as const)('no marco de %i, escreve "%s"', (marco, texto) => {
        render(<ComboBadge milestone={marco} />);

        expect(screen.getByText(texto)).toBeTruthy();
        expect(screen.getByLabelText(`${marco} respostas certas seguidas`).props.accessibilityRole).toBe('text');
    });

    it('entra com um salto curto, de 180 ms', () => {
        render(<ComboBadge milestone={3} />);

        expect(timing).toHaveBeenCalledTimes(1);
        expect(timing.mock.calls[0][1].duration).toBe(180);
    });

    it('com "Reduzir movimento", o selo aparece parado e o texto é o mesmo', () => {
        mockReducedMotion = true;
        render(<ComboBadge milestone={5} />);

        expect(timing).not.toHaveBeenCalled();
        expect(screen.getByText('5 seguidas')).toBeTruthy();
    });
});
