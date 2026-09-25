import React from 'react';
import { StyleSheet } from 'react-native';
import { fireEvent, render } from '@testing-library/react-native';
import { AppButton } from './AppButton';

// Tamanho de fonte do sistema simulado: `fontScale` é o que o iOS entrega a
// `useWindowDimensions` quando o aluno aumenta o texto (XXXL ≈ 1,35; AX5 ≈ 3,1).
const mockWindow = { width: 402, height: 874, scale: 3, fontScale: 1 };
jest.mock('react-native/Libraries/Utilities/useWindowDimensions', () => ({
  __esModule: true,
  default: () => mockWindow,
}));
afterEach(() => {
  mockWindow.fontScale = 1;
});


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

// Achado 2 do gate H4 (2026-09-24): no AX5 o CTA da trilha virava "Continuar i",
// porque o botão tinha altura fixa de 56 pt e o rótulo não tinha para onde ir.
// A altura passa a ser mínima: o rótulo quebra linha e o botão cresce.
describe('AppButton — texto grande', () => {
  it('não fixa a altura, mas mantém o alvo de toque mínimo', () => {
    mockWindow.fontScale = 3.1;
    const { getByRole } = render(<AppButton label="Continuar jornada" onPress={jest.fn()} />);
    const style = StyleSheet.flatten(getByRole('button').props.style);

    expect(style.height).toBeUndefined();
    expect(style.minHeight).toBeGreaterThanOrEqual(44);
  });

  // Em AX5 o rótulo a 3,1× partia "checkpoint" em "checkpoi / nt". Rótulo de
  // botão é curto e cresce até 2×; o botão acompanha em altura.
  it('deixa o rótulo crescer além do cromo, mas não mais que 2×', () => {
    mockWindow.fontScale = 3.1;
    const { getByText } = render(<AppButton label="Iniciar checkpoint" onPress={jest.fn()} />);
    const multiplier = getByText('Iniciar checkpoint').props.maxFontSizeMultiplier;

    expect(multiplier).toBeGreaterThan(1.35);
    expect(multiplier).toBeLessThanOrEqual(2);
  });
});
