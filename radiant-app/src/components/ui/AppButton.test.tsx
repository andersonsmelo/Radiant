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

  it.each(['primary', 'galaxy', 'gold'] as const)(
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

  // Árvore de nós nativos (`toJSON`): a ordem dos filhos é a ordem de pintura.
  type HostNode = { type: string; props: Record<string, unknown>; children: (HostNode | string)[] | null };
  const asNodes = (tree: unknown): HostNode[] =>
    (Array.isArray(tree) ? tree : [tree]).filter(
      (node): node is HostNode => node != null && typeof node === 'object',
    );
  const findAllNodes = (tree: unknown, match: (node: HostNode) => boolean): HostNode[] =>
    asNodes(tree).flatMap((node) => [
      ...(match(node) ? [node] : []),
      ...findAllNodes(node.children ?? [], match),
    ]);
  const childTestIds = (node: HostNode) => asNodes(node.children ?? []).map((child) => child.props.testID);
  const parentOf = (tree: unknown, testID: string): HostNode => {
    const parents = findAllNodes(tree, (node) => childTestIds(node).includes(testID));
    expect(parents).toHaveLength(1);
    return parents[0];
  };

  beforeEach(() => {
    jest.useFakeTimers();
    withTiming.mockClear();
  });
  afterEach(() => {
    jest.useRealTimers();
  });

  it('desenha o lábio de 5 pt na cor do papel', () => {
    const { getByTestId } = render(<AppButton label="Continuar" onPress={jest.fn()} />);
    const relief = getByTestId('app-button-relief');
    const lip = within(relief).getByTestId('app-button-lip');
    const face = within(relief).getByTestId('app-button-face');

    expect(depth.lip).toBe(5);
    expect(styleOf(lip).backgroundColor).toBe('#1846C9');
    expect(styleOf(relief).paddingBottom).toBe(5);
    expect(styleOf(face).backgroundColor).not.toBe(styleOf(lip).backgroundColor);
  });

  it.each([
    ['primary', medalColors.unit.lip],
    ['galaxy', medalColors.unit.lip],
    ['gold', medalColors.gold.lip],
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

    for (const id of ['app-button-relief', 'app-button-lip', 'app-button-face']) {
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
    expect(queryByTestId('app-button-relief')).toBeNull();
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
    const relief = getByTestId('app-button-relief');
    const text = within(getByTestId('app-button-face')).getByText(longLabel);

    expect(longLabel).toHaveLength(40);
    expect(text).toBe(getByText(longLabel));
    expect(text.props.numberOfLines).toBeUndefined();
    expect(styleOf(relief).paddingBottom).toBe(depth.lip);
    expect(styleOf(relief).height).toBeUndefined();
    // O lábio acompanha o conjunto pelas bordas, sem altura própria.
    expect(styleOf(getByTestId('app-button-lip')).height).toBeUndefined();
    expect(styleOf(getByTestId('app-button-face')).height).toBeUndefined();
  });

  // Revisão final do plano 1, Important 1: o lábio era o `View` pai, pintado na
  // área toda. Ao pressionar, a face descia 4 pt e descobria no TOPO uma faixa
  // na cor do lábio, e o relevo aparecia invertido em todo toque.
  it('o lábio fica atrás da face e só começa depth.lip abaixo do topo', () => {
    const { getByTestId, toJSON } = render(<AppButton label="Continuar" onPress={jest.fn()} />);
    const lip = styleOf(getByTestId('app-button-lip'));
    const face = styleOf(getByTestId('app-button-face'));

    expect(lip).toMatchObject({
      position: 'absolute',
      top: depth.lip,
      bottom: 0,
      left: 0,
      right: 0,
      borderRadius: face.borderRadius,
    });

    // Atrás da face: irmão anterior a ela, no mesmo pai.
    const group = parentOf(toJSON(), 'app-button-face');
    const order = childTestIds(group);
    expect(order.indexOf('app-button-lip')).toBeGreaterThanOrEqual(0);
    expect(order.indexOf('app-button-lip')).toBeLessThan(order.indexOf('app-button-face'));
    // O pai não pinta nada: a faixa de cima, descoberta na pressão, é o fundo.
    expect(styleOf(group).backgroundColor).toBeUndefined();
    expect(styleOf(group).paddingBottom).toBe(depth.lip);
  });

  // Desabilitado legível: face neutra em vez de opacidade, então nada vaza
  // através da face e não há mais composição em grupo.
  const NEUTRAL_VARIANTS = ['primary', 'galaxy', 'gold', 'secondary', 'success', 'error'] as const;

  // Nós sem `style` (o spinner) não têm opacidade própria.
  const opacityOf = (node: { props: { style?: unknown } }) =>
    (StyleSheet.flatten(node.props.style as never) as { opacity?: number } | undefined)?.opacity ?? 1;

  it.each(NEUTRAL_VARIANTS)('desabilitado %s não aplica opacidade', (variant) => {
    const { toJSON } = render(<AppButton label="Continuar" variant={variant} disabled onPress={jest.fn()} />);
    const all = findAllNodes(toJSON(), () => true);
    expect(all.length).toBeGreaterThan(3);
    for (const node of all) {
      expect(opacityOf(node)).toBe(1);
      expect(node.props.needsOffscreenAlphaCompositing).toBeFalsy();
    }
  });

  it.each(['primary', 'galaxy'] as const)('carregando %s mantém a face da variante', (variant) => {
    const enabled = render(<AppButton label="Salvar" variant={variant} onPress={jest.fn()} />);
    const loading = render(<AppButton label="Salvar" variant={variant} loading onPress={jest.fn()} />);
    const faceOf = (v: typeof enabled) => styleOf(v.getByTestId('app-button-face'));
    expect(faceOf(loading).backgroundColor).toBe(faceOf(enabled).backgroundColor);
    expect(faceOf(loading).backgroundColor).not.toBe(galaxyColors.surfaceActive);
    expect(styleOf(loading.getByTestId('app-button-lip')).backgroundColor).toBe(
      styleOf(enabled.getByTestId('app-button-lip')).backgroundColor,
    );
    expect(styleOf(loading.getByText('Salvar')).color).toBe(styleOf(enabled.getByText('Salvar')).color);
  });

  it('carregando não aplica opacidade', () => {
    const { toJSON } = render(<AppButton label="Salvar" loading onPress={jest.fn()} />);
    for (const node of findAllNodes(toJSON(), () => true)) {
      expect(opacityOf(node)).toBe(1);
    }
  });

  it.each(NEUTRAL_VARIANTS)('alternar disabled não muda borderWidth nem minHeight da face (%s)', (variant) => {
    const faceOf = (disabled: boolean) => {
      const view = render(<AppButton label="Continuar" variant={variant} disabled={disabled} onPress={jest.fn()} />);
      return styleOf(view.getByTestId('app-button-face'));
    };
    const on = faceOf(false);
    const off = faceOf(true);
    expect(off.borderWidth).toBe(on.borderWidth);
    expect(off.minHeight).toBe(on.minHeight);
    expect(off.minHeight).toBe(56);
  });

  it.each(NEUTRAL_VARIANTS)('desabilitado %s usa a face neutra', (variant) => {
    const { getByTestId, getByText } = render(
      <AppButton label="Continuar" variant={variant} disabled onPress={jest.fn()} />,
    );
    const face = styleOf(getByTestId('app-button-face'));
    expect(face.backgroundColor).toBe(galaxyColors.surfaceActive);
    expect(face.borderWidth).toBe(1);
    expect(face.borderColor).toBe(galaxyColors.border);
    expect(styleOf(getByTestId('app-button-lip')).backgroundColor).toBe(galaxyColors.backgroundAlt);
    expect(styleOf(getByText('Continuar')).color).toBe(galaxyColors.textSecondary);
  });

  it('desabilitado ghost só troca o rótulo, sem opacidade', () => {
    const { getByTestId, getByText } = render(
      <AppButton label="Agora não" variant="ghost" disabled onPress={jest.fn()} />,
    );
    const face = styleOf(getByTestId('app-button-face'));
    expect(face.opacity ?? 1).toBe(1);
    expect(face.backgroundColor).toBe('transparent');
    expect(styleOf(getByText('Agora não')).color).toBe(galaxyColors.textTertiary);
  });

  it('desabilitado continua anunciado como desabilitado', () => {
    const { getByRole } = render(<AppButton label="Continuar" disabled onPress={jest.fn()} />);
    expect(getByRole('button', { name: 'Continuar' }).props.accessibilityState.disabled).toBe(true);
  });

  it('arrastar o dedo para fora cancela: a face volta ao lugar e o onPress não dispara', () => {
    const onPress = jest.fn();
    const { getByTestId } = render(<AppButton label="Continuar" onPress={onPress} />);

    fireEvent(getByTestId('app-button-face'), 'pressIn');
    act(() => {
      jest.advanceTimersByTime(500);
    });
    expect(translateYOf(getByTestId('app-button-face'))).toBe(depth.lip - 1);

    fireEvent(getByTestId('app-button-face'), 'pressOut');
    act(() => {
      jest.advanceTimersByTime(500);
    });

    expect(translateYOf(getByTestId('app-button-face'))).toBe(0);
    expect(onPress).not.toHaveBeenCalled();
  });

  // R11: sem lábio, o ghost ficava estático ao toque. O retorno é troca de
  // estado, não animação, e por isso vale igual sob "reduzir movimento".
  it.each([false, true])('ghost esmaece o rótulo enquanto pressionado (reduzir movimento: %s)', (reduced) => {
    mockReducedMotion = reduced;
    const { getByTestId, getByText } = render(
      <AppButton label="Agora não" variant="ghost" onPress={jest.fn()} />,
    );
    const opacityOfLabel = () => styleOf(getByText('Agora não')).opacity ?? 1;

    expect(opacityOfLabel()).toBe(1);
    fireEvent(getByTestId('app-button-face'), 'pressIn');
    expect(opacityOfLabel()).toBe(0.6);
    fireEvent(getByTestId('app-button-face'), 'pressOut');
    expect(opacityOfLabel()).toBe(1);
    expect(withTiming).not.toHaveBeenCalled();
  });

  it('o lábio continua fixo em 5 pt qualquer que seja o rótulo', () => {
    const short = render(<AppButton label="Ok" onPress={jest.fn()} />);
    const shortLip = styleOf(short.getByTestId('app-button-relief')).paddingBottom;
    short.unmount();

    mockWindow.fontScale = 3.1;
    const long = render(
      <AppButton label="Continuar a revisão de casos de tórax com prioridade" onPress={jest.fn()} />,
    );

    expect(styleOf(long.getByTestId('app-button-relief')).paddingBottom).toBe(shortLip);
    expect(shortLip).toBe(5);
  });
});


describe('AppButton — ouro funcional T11', () => {
  beforeEach(() => jest.useFakeTimers());
  afterEach(() => jest.useRealTimers());
  it('usa face e lábio ouro, rótulo escuro e preserva pressão, foco e bloqueio', () => {
    const onPress = jest.fn();
    const view = render(<AppButton label="Assinar anual" variant="gold" onPress={onPress} />);
    const face = view.getByRole('button', { name: 'Assinar anual' });
    expect(StyleSheet.flatten(face.props.style).backgroundColor).toBe(medalColors.gold.face);
    expect(StyleSheet.flatten(view.getByTestId('app-button-lip').props.style).backgroundColor).toBe(medalColors.gold.lip);
    expect(StyleSheet.flatten(view.getByText('Assinar anual').props.style).color).toBe(galaxyColors.background);
    fireEvent(face, 'focus');
    expect(StyleSheet.flatten(face.props.style).borderWidth).toBe(3);
    fireEvent(face, 'pressIn');
    act(() => { jest.advanceTimersByTime(500); });
    expect(getAnimatedStyle(view.getByTestId('app-button-face')).transform).toEqual([{ translateY: depth.lip - 1 }]);
    fireEvent.press(face);
    expect(onPress).toHaveBeenCalledTimes(1);
    view.rerender(<AppButton label="Assinar anual" variant="gold" onPress={onPress} disabled />);
    fireEvent.press(view.getByRole('button', { name: 'Assinar anual' }));
    expect(onPress).toHaveBeenCalledTimes(1);
  });
});
