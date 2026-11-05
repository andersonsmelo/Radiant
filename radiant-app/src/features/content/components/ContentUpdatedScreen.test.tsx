import React from 'react';
import { AccessibilityInfo } from 'react-native';
import { fireEvent, render, screen } from '@testing-library/react-native';
import { CONTENT_UPDATED_BODY, CONTENT_UPDATED_TITLE, ContentUpdatedScreen } from './ContentUpdatedScreen';

jest.mock('expo-router', () => ({ router: { replace: jest.fn() } }));
jest.mock('@expo/vector-icons/MaterialIcons', () => 'MaterialIcons');
jest.mock('../../../ui/accessibility/useReducedMotionPreference', () => ({ useReducedMotionPreference: () => true }));
const reviewBody = 'Seus dados e conquistas foram preservados. Não há itens de revisão disponíveis no catálogo atual. Conheça a nova trilha.';
const dimensions = { width: 402, height: 874, scale: 3 };
afterEach(() => jest.restoreAllMocks());

// Native regression: retaining either Text node leaves its old measurement on a font update.
it.each([
    { review: false, target: 'title' }, { review: false, target: 'body' },
    { review: true, target: 'title' }, { review: true, target: 'body' },
])('invalidates $target measurement in the mounted notice, review=$review', ({ review, target }) => {
    const window = jest.spyOn(require('react-native'), 'useWindowDimensions');
    window.mockReturnValue({ ...dimensions, fontScale: 1 });
    const onOpenTrail = jest.fn();
    const view = render(<ContentUpdatedScreen review={review} onOpenTrail={onOpenTrail} />);
    const getText = () => screen.getByText(target === 'title' ? CONTENT_UPDATED_TITLE : review ? reviewBody : CONTENT_UPDATED_BODY);
    let previous = getText();
    const scroll = screen.getByTestId('content-updated-screen');
    const action = screen.getByRole('button', { name: 'Ver a nova trilha' });
    for (const fontScale of [3.1, 2.76, 3.1, 1]) {
        window.mockReturnValue({ ...dimensions, fontScale });
        view.rerender(<ContentUpdatedScreen review={review} onOpenTrail={onOpenTrail} />);
        expect(getText()).not.toBe(previous);
        previous = getText();
        expect(screen.getByTestId('content-updated-screen')).toBe(scroll);
        expect(screen.getByRole('button', { name: 'Ver a nova trilha' })).toBe(action);
        expect(onOpenTrail).not.toHaveBeenCalled();
    }
    fireEvent.press(screen.getByRole('button', { name: 'Ver a nova trilha' }));
    expect(onOpenTrail).toHaveBeenCalledTimes(1);
});

it('retains the one-time focus and announcement when the native title is remeasured', () => {
    const window = jest.spyOn(require('react-native'), 'useWindowDimensions');
    const announce = jest.spyOn(AccessibilityInfo, 'announceForAccessibility');
    const focus = jest.spyOn(AccessibilityInfo, 'setAccessibilityFocus');
    jest.spyOn(require('react-native'), 'findNodeHandle').mockReturnValue(123);
    window.mockReturnValue({ ...dimensions, fontScale: 1 });
    const view = render(<ContentUpdatedScreen />);
    const layout = { nativeEvent: { layout: { x: 0, y: 0, width: 354, height: 76 } } };
    fireEvent(screen.getByText(CONTENT_UPDATED_TITLE), 'layout', layout);
    window.mockReturnValue({ ...dimensions, fontScale: 3.1 });
    view.rerender(<ContentUpdatedScreen />);
    fireEvent(screen.getByText(CONTENT_UPDATED_TITLE), 'layout', layout);
    expect(announce).toHaveBeenCalledTimes(1);
    expect(announce).toHaveBeenCalledWith(CONTENT_UPDATED_TITLE);
    expect(focus).toHaveBeenCalledTimes(1);
    expect(focus).toHaveBeenCalledWith(123);
});
