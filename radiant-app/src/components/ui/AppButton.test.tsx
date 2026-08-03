import React from 'react';
import { StyleSheet } from 'react-native';
import { fireEvent, render } from '@testing-library/react-native';
import { AppButton } from './AppButton';

jest.mock('../../ui/accessibility/useReducedMotionPreference', () => ({
  useReducedMotionPreference: () => false,
}));

jest.mock('../../ui/feedback/haptics', () => ({
  hapticTap: jest.fn(),
}));

const { hapticTap } = jest.requireMock('../../ui/feedback/haptics') as {
  hapticTap: jest.Mock;
};

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

// Retorno tátil por ênfase. `hapticTap` existia exportado e sem chamador; a
// saída errada seria vibrar em todo tocável, que é o *feedback overload* — se
// tudo vibra, a vibração deixa de significar.
describe('AppButton — retorno tátil', () => {
  beforeEach(() => {
    hapticTap.mockClear();
  });

  it.each(['primary', 'galaxy'] as const)(
    'vibra na variante %s, que é a ação principal da tela',
    (variant) => {
      const { getByRole } = render(
        <AppButton label="Continuar" variant={variant} onPress={jest.fn()} />,
      );

      fireEvent.press(getByRole('button', { name: 'Continuar' }));
      expect(hapticTap).toHaveBeenCalledTimes(1);
    },
  );

  it.each(['secondary', 'ghost'] as const)(
    'não vibra na variante %s, que é alternativa ou saída',
    (variant) => {
      const { getByRole } = render(
        <AppButton label="Agora não" variant={variant} onPress={jest.fn()} />,
      );

      fireEvent.press(getByRole('button', { name: 'Agora não' }));
      expect(hapticTap).not.toHaveBeenCalled();
    },
  );

  it('não vibra quando o botão está desabilitado', () => {
    const { getByRole } = render(
      <AppButton label="Continuar" disabled onPress={jest.fn()} />,
    );

    fireEvent.press(getByRole('button', { name: 'Continuar' }));
    expect(hapticTap).not.toHaveBeenCalled();
  });

  it('continua chamando o onPress de quem consome, e só uma vez', () => {
    const onPress = jest.fn();
    const { getByRole } = render(<AppButton label="Continuar" onPress={onPress} />);

    fireEvent.press(getByRole('button', { name: 'Continuar' }));
    expect(onPress).toHaveBeenCalledTimes(1);
  });
});
