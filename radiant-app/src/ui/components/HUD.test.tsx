import React from 'react';
import { render } from '@testing-library/react-native';
import { HUD } from './HUD';
import { XpIcon } from './HudIcons';
import { useReducedMotionPreference } from '../accessibility/useReducedMotionPreference';

jest.mock('../accessibility/useReducedMotionPreference', () => ({
  useReducedMotionPreference: jest.fn(() => false),
}));

jest.mock('react-native-reanimated', () => {
  const ReactActual = jest.requireActual('react') as typeof React;
  const actual = jest.requireActual('react-native-reanimated/mock');
  const animated = actual.default ?? actual;
  const createAnimatedComponent = (Component: React.ComponentType<Record<string, unknown>>) =>
    (props: Record<string, unknown>) => {
      const { animatedProps, ...rest } = props;
      return ReactActual.createElement(Component, { ...rest, ...(animatedProps as object) });
    };
  return {
    ...actual,
    __esModule: true,
    default: { ...animated, createAnimatedComponent },
    interpolateColor: (value: number, _input: number[], colors: string[]) =>
      value >= 1 ? colors[1] : colors[0],
    withDelay: jest.fn((_delay: number, animation: unknown) => animation),
    withSequence: jest.fn((...animations: unknown[]) => animations.at(-1)),
    withTiming: jest.fn((value: unknown) => value),
  };
});

const reanimated = jest.requireMock('react-native-reanimated') as {
  withDelay: jest.Mock;
  withSequence: jest.Mock;
  withTiming: jest.Mock;
};

const mockedReducedMotion = useReducedMotionPreference as jest.MockedFunction<
  typeof useReducedMotionPreference
>;

// Contrato de acessibilidade do HUD (item 4 da 2ª auditoria de design).
// O HUD aparece em 9 telas; antes cada tela lia "coração vermelho" 5x e os
// emojis decorativos de XP/streak. Aqui travamos o anúncio consolidado.

describe('HUD — acessibilidade', () => {
  it('expõe as vidas como um único rótulo, não um emoji por coração', () => {
    const { getByLabelText, queryByLabelText } = render(
      <HUD totalXp={1234} streakDays={3} hearts={2} maxHearts={5} />,
    );

    // Um nó único e legível em vez de cinco "coração vermelho".
    expect(getByLabelText('2 de 5 vidas')).toBeTruthy();
    // O emoji cru não vira rótulo de acessibilidade.
    expect(queryByLabelText('❤️')).toBeNull();
    expect(queryByLabelText('🤍')).toBeNull();
  });

  it('rotula os pills de XP e streak sem ler o emoji decorativo', () => {
    const { getByLabelText } = render(
      <HUD totalXp={1234} streakDays={3} hearts={5} maxHearts={5} />,
    );

    // Separador de milhar depende do locale do runtime; casamos só o sufixo.
    expect(getByLabelText(/XP$/)).toBeTruthy();
    expect(getByLabelText('3 dias de sequência')).toBeTruthy();
  });

  it('usa o singular quando a sequência é de um dia', () => {
    const { getByLabelText } = render(
      <HUD totalXp={0} streakDays={1} hearts={5} maxHearts={5} />,
    );

    expect(getByLabelText('1 dia de sequência')).toBeTruthy();
  });

  it('no modo compact mostra as vidas e omite os pills de XP/streak', () => {
    const { getByLabelText, queryByLabelText } = render(
      <HUD totalXp={1234} streakDays={3} hearts={4} maxHearts={5} compact />,
    );

    expect(getByLabelText('4 de 5 vidas')).toBeTruthy();
    expect(queryByLabelText(/XP$/)).toBeNull();
    expect(queryByLabelText(/de sequência$/)).toBeNull();
  });
});

// Encenação da perda de vida. O evento mais pesado que o app cobra não tinha
// sinal próprio: o coração trocava de ❤️ para 🤍 e nada mais acontecia.
describe('HUD — perda de vida', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockedReducedMotion.mockReturnValue(false);
  });

  it('anima só o coração que acabou de ser perdido, e não os vizinhos', () => {
    const { rerender } = render(
      <HUD totalXp={0} streakDays={0} hearts={3} maxHearts={5} />,
    );
    reanimated.withDelay.mockClear();

    rerender(<HUD totalXp={0} streakDays={0} hearts={2} maxHearts={5} />);

    // Uma perda agenda exatamente três canais no único coração selecionado:
    // impacto, rachadura e drenagem. Vizinhos não agendam nada.
    expect(reanimated.withDelay).toHaveBeenCalledTimes(3);
  });

  it('não anima quando a pessoa GANHA vidas de volta', () => {
    const { rerender } = render(
      <HUD totalXp={0} streakDays={0} hearts={2} maxHearts={5} />,
    );
    reanimated.withDelay.mockClear();

    rerender(<HUD totalXp={0} streakDays={0} hearts={4} maxHearts={5} />);

    expect(reanimated.withDelay).not.toHaveBeenCalled();
  });

  it('recarregar solta o coração marcado, para o estilo não ficar num índice cheio', () => {
    const { rerender } = render(
      <HUD totalXp={0} streakDays={0} hearts={3} maxHearts={5} />,
    );

    reanimated.withDelay.mockClear();
    rerender(<HUD totalXp={0} streakDays={0} hearts={2} maxHearts={5} />);
    expect(reanimated.withDelay).toHaveBeenCalledTimes(3);

    reanimated.withDelay.mockClear();
    rerender(<HUD totalXp={0} streakDays={0} hearts={5} maxHearts={5} />);
    expect(reanimated.withDelay).not.toHaveBeenCalled();
  });

  it('sob reduced motion a perda segue legível pelo rótulo, que é o canal que não pode depender de animação', () => {
    mockedReducedMotion.mockReturnValue(true);

    const { getByLabelText, rerender } = render(
      <HUD totalXp={0} streakDays={0} hearts={3} maxHearts={5} />,
    );

    rerender(<HUD totalXp={0} streakDays={0} hearts={2} maxHearts={5} />);

    expect(getByLabelText('2 de 5 vidas')).toBeTruthy();
  });

  it('racha e drena somente o coração que acabou de esvaziar', () => {
    const { getByTestId, rerender } = render(
      <HUD totalXp={0} streakDays={0} hearts={3} maxHearts={5} />,
    );

    rerender(<HUD totalXp={0} streakDays={0} hearts={2} maxHearts={5} />);

    const crack = getByTestId('hud-heart-crack-2');
    expect(crack.props.d).toBe('M26 14 l-4 9 l6 4 l-4 8');
    expect(crack.props.stroke.payload).toBe(0xff03030d);
    expect(crack.props.strokeWidth).toBe(2.5);
    // react-native-svg normaliza `round` para o enum nativo 1.
    expect(crack.props.strokeLinecap).toBe(1);
    expect(getByTestId('hud-heart-crack-1').props.opacity).toBe(0);
    expect(getByTestId('hud-heart-crack-3').props.opacity).toBe(0);
    expect(getByTestId('hud-heart-fill-2').props.fill.payload).toBe(0x33ffffff);
    expect(reanimated.withDelay).toHaveBeenCalledTimes(3);
  });

  it('sob reduced motion esvazia direto, sem escala nem racha', () => {
    mockedReducedMotion.mockReturnValue(true);
    const { getByTestId, rerender } = render(
      <HUD totalXp={0} streakDays={0} hearts={3} maxHearts={5} />,
    );
    reanimated.withDelay.mockClear();

    rerender(<HUD totalXp={0} streakDays={0} hearts={2} maxHearts={5} />);

    expect(reanimated.withDelay).not.toHaveBeenCalled();
    expect(getByTestId('hud-heart-crack-2').props.opacity).toBe(0);
    expect(getByTestId('hud-heart-fill-2').props.fill.payload).toBe(0x33ffffff);
  });
});

// O emoji do sistema ignora token de cor, renderiza ao gosto do SO e era o
// objeto mais saturado da Home — mais forte que o CTA. O DESIGN.md o proíbe por
// escrito. Estes contratos travam a troca por vetor animado em código.
describe('HUD — identidade dos ícones', () => {
  const EMOJI = /[☀-➿\u{1F300}-\u{1F9FF}\u{FE0F}]/u;

  beforeEach(() => {
    jest.clearAllMocks();
    mockedReducedMotion.mockReturnValue(false);
  });

  it('não renderiza nenhum emoji do sistema', () => {
    const { toJSON } = render(<HUD totalXp={1234} streakDays={3} hearts={2} maxHearts={5} />);

    expect(EMOJI.test(JSON.stringify(toJSON()))).toBe(false);
  });

  it('desenha um ícone vetorial para cada vida, cheia ou vazia', () => {
    const { getByTestId } = render(<HUD totalXp={0} streakDays={1} hearts={2} maxHearts={5} />);

    for (let i = 0; i < 5; i += 1) {
      expect(getByTestId(`hud-heart-${i}`)).toBeTruthy();
    }
  });

  it('distingue vida cheia de vazia por preenchimento, não só por opacidade', () => {
    const { getByTestId } = render(<HUD totalXp={0} streakDays={1} hearts={2} maxHearts={5} />);

    // A cor é o canal que o leitor de tela não tem; o rótulo agregado cobre
    // aquele lado. Aqui garantimos que o canal visual existe de fato.
    // O nó `hud-heart-N` é o wrapper animado; o preenchimento vive no vetor
    // dentro dele. Separar os dois mantém o contrato de animação que já existia.
    expect(getByTestId('hud-heart-fill-0').props.fill)
      .not.toBe(getByTestId('hud-heart-fill-4').props.fill);
  });

  it('desenha as quatro fagulhas aprovadas ao redor do raio de XP', () => {
    const { getByTestId } = render(<HUD totalXp={0} streakDays={1} hearts={5} />);
    const expected = [
      { cx: '26', cy: '6' },
      { cx: '46', cy: '26' },
      { cx: '26', cy: '46' },
      { cx: '6', cy: '26' },
    ];

    expected.forEach(({ cx, cy }, index) => {
      const ray = getByTestId(`hud-xp-ray-${index}`);
      expect(String(ray.props.cx)).toBe(cx);
      expect(String(ray.props.cy)).toBe(cy);
      expect(String(ray.props.r)).toBe('2');
    });
  });

  it('dispara burst e fagulhas somente quando o XP aumenta', () => {
    const { rerender } = render(<XpIcon value={10} />);
    reanimated.withDelay.mockClear();

    rerender(<XpIcon value={20} />);

    expect(reanimated.withDelay).toHaveBeenCalledTimes(3);
    for (const [delay] of reanimated.withDelay.mock.calls) {
      expect(delay).toBeCloseTo(330);
    }
  });

  it('sob reduced motion troca o XP sem agendar burst ou fagulhas', () => {
    mockedReducedMotion.mockReturnValue(true);
    const { rerender } = render(<HUD totalXp={10} streakDays={1} hearts={5} />);
    reanimated.withDelay.mockClear();

    rerender(<HUD totalXp={20} streakDays={1} hearts={5} />);

    expect(reanimated.withDelay).not.toHaveBeenCalled();
  });
});
