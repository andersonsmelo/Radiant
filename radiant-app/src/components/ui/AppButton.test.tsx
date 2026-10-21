import React from 'react';
import { StyleSheet } from 'react-native';
import { act, fireEvent, render, within } from '@testing-library/react-native';
import { getAnimatedStyle } from 'react-native-reanimated';
import { AppButton } from './AppButton';
import { depth, feedbackColors, galaxyColors, medalColors } from '../../ui/theme';

// Tamanho de fonte do sistema simulado: `fontScale` é o que o iOS entrega a
// `useWindowDimensions` quando o aluno aumenta o texto (XXXL ≈ 1,35; AX5 ≈ 3,1).
const mockWindow = { width: 402, height: 874, scale: 3, fontScale: 1 };
jest.mock('react-native/Libraries/Utilities/useWindowDimensions', () => ({
  __esModule: true,
  default: () => mockWindow,
}));
afterEach(() => {
  mockWindow.fontScale = 1;
  mockReducedMotion = false;
});


let mockReducedMotion = false;
jest.mock('../../ui/accessibility/useReducedMotionPreference', () => ({
  useReducedMotionPreference: () => mockReducedMotion,
}));

// `withTiming` espiado, não trocado: o teste da pressão precisa saber se a troca
// passou por animação, e a animação real continua rodando nos demais.
jest.mock('react-native-reanimated', () => {
  const actual = jest.requireActual('react-native-reanimated');
  return {
    ...actual,
    __esModule: true,
    default: actual.default,
    withTiming: jest.fn(actual.withTiming),
  };
});

jest.mock('../../ui/feedback/haptics', () => ({
  hapticTap: jest.fn(),
}));

const { withTiming } = jest.requireMock('react-native-reanimated') as {
  withTiming: jest.Mock;
};

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

// Relevo do Medalhão: o botão é uma face sobre um lábio de 5 pt. A face é o
// próprio `Pressable` (papel `button`), então o fundo e o foco continuam nela.
describe('AppButton — relevo', () => {
  const styleOf = (node: { props: { style?: unknown } }) =>
    StyleSheet.flatten(node.props.style as never) as Record<string, unknown>;

  // O estilo animado não chega a `props.style` em jest: o Reanimated o guarda à
  // parte, e `getAnimatedStyle` devolve o valor corrente.
  const translateYOf = (node: Parameters<typeof getAnimatedStyle>[0]) =>
    (getAnimatedStyle(node) as { transform: { translateY: number }[] }).transform[0].translateY;

  beforeEach(() => {
    jest.useFakeTimers();
    withTiming.mockClear();
  });
  afterEach(() => {
    jest.useRealTimers();
  });

  it('desenha o lábio de 5 pt na cor do papel', () => {
    const { getByTestId } = render(<AppButton label="Continuar" onPress={jest.fn()} />);
    const lip = getByTestId('app-button-lip');
    const face = within(lip).getByTestId('app-button-face');

    expect(depth.lip).toBe(5);
    expect(styleOf(lip).backgroundColor).toBe('#1846C9');
    expect(styleOf(lip).paddingBottom).toBe(5);
    expect(styleOf(face).backgroundColor).not.toBe(styleOf(lip).backgroundColor);
  });

  it.each([
    ['primary', medalColors.unit.lip],
    ['galaxy', medalColors.unit.lip],
    ['secondary', galaxyColors.backgroundAlt],
    ['success', feedbackColors.success.lip],
    ['error', feedbackColors.error.lip],
  ] as const)('a variante %s usa o lábio %s', (variant, lipColor) => {
    const { getByTestId } = render(
      <AppButton label="Continuar" variant={variant} onPress={jest.fn()} />,
    );

    expect(styleOf(getByTestId('app-button-lip')).backgroundColor).toBe(lipColor);
  });

  it('success e error pintam a face com o preenchimento e o rótulo com o texto escuro', () => {
    const success = render(<AppButton label="Certo" variant="success" onPress={jest.fn()} />);
    expect(styleOf(success.getByTestId('app-button-face')).backgroundColor).toBe(
      feedbackColors.success.fill,
    );
    expect(styleOf(success.getByText('Certo')).color).toBe(feedbackColors.success.onFill);
    success.unmount();

    const error = render(<AppButton label="Errado" variant="error" onPress={jest.fn()} />);
    expect(styleOf(error.getByTestId('app-button-face')).backgroundColor).toBe(
      feedbackColors.error.fill,
    );
    expect(styleOf(error.getByText('Errado')).color).toBe(feedbackColors.error.onFill);
  });

  it('não simula o relevo com sombra', () => {
    const { getByTestId } = render(<AppButton label="Continuar" onPress={jest.fn()} />);

    for (const id of ['app-button-lip', 'app-button-face']) {
      const style = styleOf(getByTestId(id));
      expect(style.shadowOpacity).toBeUndefined();
      expect(style.shadowRadius).toBeUndefined();
      expect(style.elevation).toBeUndefined();
    }
  });

  it('pressionado, a face desce até o lábio', () => {
    const { getByTestId } = render(<AppButton label="Continuar" onPress={jest.fn()} />);
    const face = getByTestId('app-button-face');

    expect(translateYOf(face)).toBe(0);

    fireEvent(face, 'pressIn');
    expect(withTiming).toHaveBeenCalledWith(depth.lip - 1, expect.anything());
    expect(withTiming).toHaveBeenCalledTimes(1);

    // O estilo animado só chega às props quando o relógio da animação corre.
    act(() => {
      jest.advanceTimersByTime(500);
    });
    expect(translateYOf(getByTestId('app-button-face'))).toBe(depth.lip - 1);
  });

  it('ghost não tem lábio', () => {
    const { queryByTestId, getByRole } = render(
      <AppButton label="Ver detalhes" variant="ghost" onPress={jest.fn()} />,
    );

    expect(queryByTestId('app-button-lip')).toBeNull();
    expect(getByRole('button', { name: 'Ver detalhes' })).toBeTruthy();
  });

  it('com reduzir movimento, a pressão não anima', () => {
    mockReducedMotion = true;
    const { getByTestId } = render(<AppButton label="Continuar" onPress={jest.fn()} />);
    const face = getByTestId('app-button-face');

    fireEvent(face, 'pressIn');
    fireEvent(face, 'pressOut');

    expect(withTiming).not.toHaveBeenCalled();
    expect(translateYOf(getByTestId('app-button-face'))).toBe(0);
  });

  it('com reduzir movimento, a face ainda desce na pressão, só que sem transição', () => {
    mockReducedMotion = true;
    const { getByTestId } = render(<AppButton label="Continuar" onPress={jest.fn()} />);
    const face = getByTestId('app-button-face');

    fireEvent(face, 'pressIn');
    act(() => {
      jest.advanceTimersByTime(16);
    });

    expect(withTiming).not.toHaveBeenCalled();
    expect(translateYOf(getByTestId('app-button-face'))).toBe(depth.lip - 1);
  });

  // Foco da revisão 1: o relevo não pode estourar nem cortar o rótulo no
  // Dynamic Type máximo. A altura de um `View` em RN vem dos filhos: o lábio só
  // soma o `paddingBottom` fixo, e o `Text` sem `numberOfLines` quebra e empurra.
  it('rótulo longo com texto grande quebra dentro da face', () => {
    mockWindow.fontScale = 3.1;
    const longLabel = 'Continuar a revisão dos casos de pulmões';
    const { getByTestId, getByText } = render(
      <AppButton label={longLabel} onPress={jest.fn()} />,
    );
    const lip = getByTestId('app-button-lip');
    const text = within(getByTestId('app-button-face')).getByText(longLabel);

    expect(longLabel).toHaveLength(40);
    expect(text).toBe(getByText(longLabel));
    expect(text.props.numberOfLines).toBeUndefined();
    expect(styleOf(lip).paddingBottom).toBe(depth.lip);
    expect(styleOf(lip).height).toBeUndefined();
    expect(styleOf(getByTestId('app-button-face')).height).toBeUndefined();
  });

  it('o lábio continua fixo em 5 pt qualquer que seja o rótulo', () => {
    const short = render(<AppButton label="Ok" onPress={jest.fn()} />);
    const shortLip = styleOf(short.getByTestId('app-button-lip')).paddingBottom;
    short.unmount();

    mockWindow.fontScale = 3.1;
    const long = render(
      <AppButton label="Continuar a revisão de casos de tórax com prioridade" onPress={jest.fn()} />,
    );

    expect(styleOf(long.getByTestId('app-button-lip')).paddingBottom).toBe(shortLip);
    expect(shortLip).toBe(5);
  });
});
