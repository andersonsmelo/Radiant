import React from 'react';
import { fireEvent, render } from '@testing-library/react-native';
import { StyleSheet } from 'react-native';
import Svg from 'react-native-svg';
import type { HeartsSnapshot, HeartsStatus } from '../../features/hearts/hearts.types';
import { HUD } from './HUD';
import { HeartIcon, StreakIcon, XpIcon } from './HudIcons';
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
  it('resume vidas recuperando e abre a folha ao toque', () => {
    const onHeartsPress = jest.fn();
    const screen = render(
      <HUD
        totalXp={10}
        streakDays={1}
        hearts={3}
        heartsSnapshot={{
          count: 3,
          status: 'recovering',
          nextRefillAt: '2026-09-14T12:09:01.000Z',
          unlimitedUntil: null,
        }}
        nowMs={Date.parse('2026-09-14T12:00:00.000Z')}
        onHeartsPress={onHeartsPress}
      />,
    );

    expect(screen.getByText('3 · +1 em 10 min')).toBeTruthy();
    fireEvent.press(screen.getByRole('button', { name: /3 de 5 vidas/u }));
    expect(onHeartsPress).toHaveBeenCalledTimes(1);
  });

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

// Os quatro estados da tabela §5.1 da spec da 1.4. ILIMITADA diz "corações
// somem": o ∞ substitui as vidas, não se soma a elas. Mostrar os dois juntos
// sugere ao assinante que ainda há o que perder. Defeito medido em 2026-09-23.
describe('HUD — estados das vidas', () => {
  const NOW = Date.parse('2026-09-14T12:00:00.000Z');
  const REFILL = '2026-09-14T12:09:01.000Z';
  const snapshot = (count: number, status: HeartsStatus): HeartsSnapshot => ({
    count,
    status,
    nextRefillAt: status === 'recovering' || status === 'empty' ? REFILL : null,
    unlimitedUntil: status === 'unlimited' ? '2026-10-14T12:00:00.000Z' : null,
  });
  const renderHud = (
    heartsSnapshot: HeartsSnapshot,
    extra: { onHeartsPress?: () => void; compact?: boolean } = {},
  ) =>
    render(
      <HUD
        totalXp={10}
        streakDays={1}
        hearts={heartsSnapshot.count}
        heartsSnapshot={heartsSnapshot}
        nowMs={NOW}
        {...extra}
      />,
    );

  describe.each([
    { status: 'full' as const, count: 5, summary: '5', label: '5 de 5 vidas' },
    { status: 'recovering' as const, count: 3, summary: '3 · +1 em 10 min', label: '3 de 5 vidas; próxima em 10 minutos' },
    { status: 'empty' as const, count: 0, summary: '0 · +1 em 10 min', label: '0 de 5 vidas; próxima em 10 minutos' },
  ])('$status', ({ status, count, summary, label }) => {
    it('desenha os cinco corações e o resumo, sem ∞', () => {
      const screen = renderHud(snapshot(count, status));

      for (let i = 0; i < 5; i += 1) {
        expect(screen.getByTestId(`hud-heart-${i}`)).toBeTruthy();
      }
      expect(screen.getByText(summary)).toBeTruthy();
      expect(screen.queryByText('∞')).toBeNull();
    });

    it('anuncia a contagem no botão que abre a folha', () => {
      const onHeartsPress = jest.fn();
      const screen = renderHud(snapshot(count, status), { onHeartsPress });

      fireEvent.press(screen.getByRole('button', { name: label }));
      expect(onHeartsPress).toHaveBeenCalledTimes(1);
    });
  });

  // "Nenhum coração" pergunta o que está DESENHADO, não o que o leitor de tela
  // alcança: dentro do botão o `HeartsDisplay` fica oculto da acessibilidade, e
  // o RNTL 13 omite nós ocultos por padrão. Sem `includeHiddenElements`, o
  // guarda do botão passava com os cinco corações na tela — visto em 2026-09-23.
  const heartsDrawn = (screen: ReturnType<typeof render>) =>
    screen.queryByTestId('hud-heart-0', { includeHiddenElements: true });

  // `setUnlimited` preserva `count`: o assinante que zerou chega como
  // `{ count: 0, status: 'unlimited' }`. Quem decide é o status, nunca o número.
  describe.each([5, 0])('unlimited com count %i', (count) => {
    it('não desenha nenhum coração', () => {
      const screen = renderHud(snapshot(count, 'unlimited'));

      expect(heartsDrawn(screen)).toBeNull();
      expect(screen.getByText('∞')).toBeTruthy();
    });

    it('rotula o ∞ como "Vidas ilimitadas" também sem botão (Checkpoint e Revisão)', () => {
      const screen = renderHud(snapshot(count, 'unlimited'));

      expect(screen.getByLabelText('Vidas ilimitadas')).toBeTruthy();
    });

    it('não anuncia "N de 5 vidas" a quem não perde vida', () => {
      const screen = renderHud(snapshot(count, 'unlimited'));

      expect(screen.queryByLabelText(/de 5 vidas/u)).toBeNull();
    });

    it('mantém o botão que abre a folha, rotulado "Vidas ilimitadas", sem corações dentro', () => {
      const onHeartsPress = jest.fn();
      const screen = renderHud(snapshot(count, 'unlimited'), { onHeartsPress });

      fireEvent.press(screen.getByRole('button', { name: 'Vidas ilimitadas' }));
      expect(onHeartsPress).toHaveBeenCalledTimes(1);
      expect(heartsDrawn(screen)).toBeNull();
    });

    it('no modo compact também troca os corações pelo ∞', () => {
      const screen = renderHud(snapshot(count, 'unlimited'), { compact: true });

      expect(heartsDrawn(screen)).toBeNull();
      expect(screen.getByLabelText('Vidas ilimitadas')).toBeTruthy();
    });
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

  it('mantém os glifos legíveis na escala aprovada após inspeção no aparelho', () => {
    // Escala revista em 2026-08-14 após inspeção no simulador: a anterior
    // (18/18/22) foi julgada pequena demais para o HUD. Estes números não são
    // arbitrários — são a decisão que substitui a de 2026-07-28, e mudá-los
    // exige nova inspeção no aparelho, não só deixar o teste verde.
    const xp = render(<XpIcon />).UNSAFE_getByType(Svg);
    const streak = render(<StreakIcon />).UNSAFE_getByType(Svg);
    const heart = render(<HeartIcon filled />).UNSAFE_getByType(Svg);

    expect(xp.props.width).toBe(24);
    expect(xp.props.height).toBe(24);
    expect(streak.props.width).toBe(24);
    expect(streak.props.height).toBe(24);
    expect(heart.props.width).toBe(28);
    expect(heart.props.height).toBe(28);
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

// Defeito 3 do E2E de 2026-09-24: na trilha, com vidas em recarga, o resumo
// `0 · +1 em 24 min` ia na MESMA linha dos cinco corações e o HUD passava da
// borda direita do iPhone 17 (nó até x=443 em 402 pt). O Jest não mede layout,
// então a asserção fica no valor que decide a largura: a direção do contêiner
// comum aos corações e ao resumo. Em linha, as larguras se somam; em coluna, vale
// a maior delas.
describe('HUD — resumo de vidas cabe na largura da trilha', () => {
  type Node = ReturnType<ReturnType<typeof render>['getByText']>;

  const ancestors = (node: Node) => {
    const chain: Node[] = [];
    for (let current: Node | null = node.parent; current; current = current.parent) {
      chain.push(current);
    }
    return chain;
  };

  it('empilha o resumo sob os corações, e não ao lado deles', () => {
    const screen = render(
      <HUD
        totalXp={10}
        streakDays={1}
        hearts={0}
        heartsSnapshot={{
          count: 0,
          status: 'empty',
          nextRefillAt: '2026-09-14T12:24:00.000Z',
          unlimitedUntil: null,
        }}
        nowMs={Date.parse('2026-09-14T12:00:00.000Z')}
        onHeartsPress={jest.fn()}
      />,
    );

    const summary = screen.getByText('0 · +1 em 24 min', { includeHiddenElements: true });
    const heart = screen.getByTestId('hud-heart-0', { includeHiddenElements: true });
    for (let i = 1; i < 5; i += 1) {
      expect(screen.getByTestId(`hud-heart-${i}`, { includeHiddenElements: true })).toBeTruthy();
    }

    const heartAncestors = new Set(ancestors(heart));
    const shared = ancestors(summary).find(
      (node) => typeof node.type === 'string' && heartAncestors.has(node),
    );

    expect(shared).toBeDefined();
    expect(StyleSheet.flatten(shared?.props.style)?.flexDirection).toBe('column');
  });
});
