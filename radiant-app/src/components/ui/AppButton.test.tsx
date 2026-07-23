import React from 'react';
import { StyleSheet } from 'react-native';
import { fireEvent, render } from '@testing-library/react-native';
import { AppButton } from './AppButton';

jest.mock('../../ui/accessibility/useReducedMotionPreference', () => ({
  useReducedMotionPreference: () => false,
}));

describe('AppButton accessibility contract', () => {
  it('exposes its label, hint, role and focus treatment to assistive technology', () => {
    const { getByRole } = render(
      <AppButton
        label="Iniciar sessão"
        accessibilityHint="Abre a próxima atividade recomendada."
        onPress={jest.fn()}
      />,
    );

    const button = getByRole('button', { name: 'Iniciar sessão' });
    expect(button.props.accessibilityHint).toBe('Abre a próxima atividade recomendada.');
    expect(button.props.accessibilityState).toEqual({ disabled: false, busy: false });

    fireEvent(button, 'focus');
    expect(StyleSheet.flatten(button.props.style)).toMatchObject({ borderWidth: 3 });
  });

  it('makes loading controls unavailable and announces the busy state', () => {
    const onPress = jest.fn();
    const { getByRole } = render(
      <AppButton label="Enviar interesse" loading onPress={onPress} />,
    );

    const button = getByRole('button', { name: 'Enviar interesse' });
    expect(button.props.accessibilityState).toEqual({ disabled: true, busy: true });

    fireEvent.press(button);
    expect(onPress).not.toHaveBeenCalled();
  });
});
