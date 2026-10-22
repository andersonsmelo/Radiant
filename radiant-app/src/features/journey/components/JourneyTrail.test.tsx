import React from 'react';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { act, fireEvent, render } from '@testing-library/react-native';
import { Path } from 'react-native-svg';
import { depth, galaxyColors, medalColors } from '../../../ui/theme';
import { JourneyTrail } from './JourneyTrail';
import { JourneyMedal } from './JourneyMedal';
import { JourneyPathSegment } from './JourneyPathSegment';
import {
  MEDAL_RADIUS,
  NEXT_MEDAL_RADIUS,
  TRAIL_LEAD,
  TRAIL_MEDAL_TOP,
  TRAIL_SEAM_PHASE,
  TRAIL_SIDE_GAP,
  outgoingPath,
} from './trailLayout';
import { TRAIL_MOMENT_MS } from '../../../ui/motion';
import { readMotionStyle as getAnimatedStyle } from '../../../test/readMotionStyle';
import { space } from '../../../ui/styles';
import { useReducedMotionPreferenceState } from '../../../ui/accessibility/useReducedMotionPreference';
import type { CurriculumSegment } from '../services/JourneyCurriculumService';
import type { JourneyNode, JourneyNodeStatus, JourneyUnit } from '../../../types/journey';
import type { LessonStars } from '../../quiz/services/resolveLessonStars';

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

jest.mock('../../../components/ui/DecorativeIcon', () => ({ DecorativeIcon: () => null }));
// O Jest não rasteriza Skia nem toca Lottie: a ilustração da medalha é um dublê.
jest.mock('../../../ui/illustrations/ThemeIllustration', () => ({ ThemeIllustration: () => null }));
// A preferência de "reduzir movimento" resolve depois do primeiro quadro; aqui
// ela já nasce resolvida, para o anel da próxima não atualizar fora do `act`.
jest.mock('../../../ui/accessibility/useReducedMotionPreference', () => ({
  useReducedMotionPreference: jest.fn(() => false),
  useReducedMotionPreferenceState: jest.fn(() => ({ reducedMotionEnabled: false, resolved: true })),
}));

// O rótulo do título fica fora da árvore de acessibilidade (a medalha já o
// diz), e a biblioteca de testes, por padrão, não acha o que está escondido.
const HIDDEN = { includeHiddenElements: true };

function unit(id: string, title: string, statuses: JourneyNodeStatus[], extra: Partial<JourneyUnit> = {}) {
  return {
    id,
    title,
    ...extra,
    nodes: statuses.map((status, index): JourneyNode => ({
      id: `${id}-node-${index}`,
      unitId: id,
      type: 'lesson' as const,
      title: `${title} — nó ${index + 1}`,
      status,
    })),
  };
}

function segment(
  trackId: string,
  trackTitle: string,
  units: ReturnType<typeof unit>[],
  overrides: Partial<CurriculumSegment> = {},
): CurriculumSegment {
  return {
    trackId,
    trackTitle,
    order: 0,
    unlocked: true,
    completed: false,
    units,
    ...overrides,
  };
}

const onNodePress = jest.fn();
const isNodeDisabled = (node: { status: JourneyNodeStatus }) => node.status === 'locked';

type TrailProps = Partial<React.ComponentProps<typeof JourneyTrail>>;

function renderTrail(segments: CurriculumSegment[], recommendedNodeId?: string, props: TrailProps = {}) {
  return render(
    <JourneyTrail
      segments={segments}
      recommendedNodeId={recommendedNodeId}
      onNodePress={onNodePress}
      isNodeDisabled={isNodeDisabled as never}
      {...props}
    />,
  );
}

/** A lista mede 400 de largura: meia-largura 200, medalhas a ±70 do centro. */
function medirLargura(screen: ReturnType<typeof render>, width = 400) {
  fireEvent(screen.getByTestId('journey-trail'), 'layout', {
    nativeEvent: { layout: { x: 0, y: 0, width, height: 800 } },
  });
}

/** O trecho que sai de cada nó precisa da altura da linha, que o Jest não mede. */
function medirLinhas(screen: ReturnType<typeof render>, height = 180) {
  for (const row of screen.queryAllByTestId(/^journey-trail-row-/u, HIDDEN)) {
    fireEvent(row, 'layout', { nativeEvent: { layout: { x: 0, y: 0, width: 400, height } } });
  }
}

type SegmentProps = React.ComponentProps<typeof JourneyPathSegment>;

function pathPieces(screen: ReturnType<typeof render>, part: SegmentProps['part']): SegmentProps[] {
  return screen.UNSAFE_queryAllByType(JourneyPathSegment)
    .map((element) => element.props as SegmentProps)
    .filter((props) => props.part === part);
}

/** O estado de cada trecho entre nós, de cima para baixo, conferindo as duas partes. */
function traveledStates(screen: ReturnType<typeof render>): boolean[] {
  medirLinhas(screen);
  const outgoing = pathPieces(screen, 'out').map((props) => props.traveled);
  const incoming = pathPieces(screen, 'in').map((props) => props.traveled);
  expect(outgoing).toEqual(incoming);
  return incoming;
}

function medalProps(screen: ReturnType<typeof render>, nodeId: string) {
  const medal = screen.UNSAFE_getAllByType(JourneyMedal).find((element) => element.props.node.id === nodeId);
  if (!medal) throw new Error(`medalha ${nodeId} não encontrada`);
  return medal.props as React.ComponentProps<typeof JourneyMedal>;
}

function offsetOf(screen: ReturnType<typeof render>, nodeId: string): number {
  const style = StyleSheet.flatten(screen.getByTestId(`journey-anchor-${nodeId}`, HIDDEN).props.style);
  const transform = (style.transform ?? []) as { translateX?: number }[];
  return transform.find((entry) => entry.translateX !== undefined)?.translateX ?? 0;
}

describe('JourneyTrail — um caminho só, do começo ao fim do currículo', () => {
  // O JourneyMap que este componente substituiu quebrava o percurso em seções:
  // uma por unidade, cada uma com título próprio e trilho próprio. O aluno via
  // trechos separados, não um caminho.

  it('renderiza os nós de todos os segmentos, na ordem', () => {
    const screen = renderTrail([
      segment('t1', 'Fundamentos', [unit('u1', 'Unidade 1', ['completed', 'available'])]),
      segment('t2', 'Tórax', [unit('u2', 'Unidade 2', ['locked'])], { unlocked: false, order: 1 }),
    ]);

    const titles = screen.getAllByText(/— nó \d$/u, HIDDEN).map((text) => text.props.children);
    expect(titles).toEqual(['Unidade 1 — nó 1', 'Unidade 1 — nó 2', 'Unidade 2 — nó 1']);
  });

  it('não acrescenta navegação de unidades ao percurso legado de uma unidade por área', () => {
    const screen = renderTrail([
      segment('t1', 'Fundamentos', [
        unit('u1', 'Unidade 1', ['completed']),
      ]),
    ]);

    expect(screen.queryByText('Unidade 1')).toBeNull();
    expect(screen.queryByText('Unidade 2')).toBeNull();
  });

  it('mostra a faixa de próximo nível entre segmentos, e não depois do último', () => {
    const screen = renderTrail([
      segment('t1', 'Fundamentos', [unit('u1', 'Unidade 1', ['completed'])]),
      segment('t2', 'Tórax', [unit('u2', 'Unidade 2', ['locked'])], { unlocked: false, order: 1 }),
    ]);

    expect(screen.getByText('Tórax')).toBeTruthy();
    expect(screen.getAllByTestId(/^journey-level-band-/)).toHaveLength(1);
    expect(screen.queryByTestId('journey-level-band-t1')).toBeNull();
  });

  it('a faixa fechada nomeia a trilha anterior como o que falta', () => {
    const screen = renderTrail([
      segment('t1', 'Fundamentos', [unit('u1', 'Unidade 1', ['available'])]),
      segment('t2', 'Tórax', [unit('u2', 'Unidade 2', ['locked'])], { unlocked: false, order: 1 }),
    ]);

    expect(screen.getByText('Abre ao concluir Fundamentos')).toBeTruthy();
  });

  it('não desenha faixa nenhuma quando há um único segmento', () => {
    const screen = renderTrail([
      segment('t1', 'Fundamentos', [unit('u1', 'Unidade 1', ['completed'])]),
    ]);

    expect(screen.queryAllByTestId(/^journey-level-band-/)).toHaveLength(0);
  });

  it('usa uma lista virtualizada como superfície rolável', () => {
    const screen = renderTrail([
      segment('t1', 'Fundamentos', [unit('u1', 'Unidade 1', ['completed', 'available'])]),
    ]);

    expect(screen.UNSAFE_getByType(FlatList)).toBeTruthy();
  });
});

describe('JourneyTrail — o zigue-zague', () => {
  it('alterna as medalhas entre esquerda e direita, a 35% da meia-largura medida', () => {
    const screen = renderTrail([
      segment('t1', 'Fundamentos', [unit('u1', 'Unidade 1', ['completed', 'completed', 'available', 'locked', 'locked'])]),
    ], 'u1-node-2');
    medirLargura(screen);

    expect([0, 1, 2, 3, 4].map((index) => offsetOf(screen, `u1-node-${index}`)))
      .toEqual([-70, 70, -70, 70, -70].map((value) => expect.closeTo(value, 6)));
  });

  it('segue o índice do percurso inteiro, sem reiniciar a cada unidade', () => {
    // Duas unidades de um nó cada. Se o índice reiniciasse por unidade, os dois
    // nós cairiam do mesmo lado; num caminho só, o segundo alterna.
    const screen = renderTrail([
      segment('t1', 'Fundamentos', [
        unit('u1', 'Unidade 1', ['completed']),
        unit('u2', 'Unidade 2', ['available']),
      ]),
    ]);
    medirLargura(screen);

    expect(offsetOf(screen, 'u1-node-0')).toBeCloseTo(-70, 6);
    expect(offsetOf(screen, 'u2-node-0')).toBeCloseTo(70, 6);
  });

  it('cada trecho sai da lateral de um nó e a descida continua no topo do seguinte, na mesma vertical', () => {
    const screen = renderTrail([
      segment('t1', 'Fundamentos', [unit('u1', 'Unidade 1', ['completed', 'completed', 'available', 'locked', 'locked'])]),
    ], 'u1-node-2');
    medirLargura(screen);
    medirLinhas(screen, 180);

    const outgoing = pathPieces(screen, 'out');
    const incoming = pathPieces(screen, 'in');
    expect(outgoing.map(({ fromX, toX }) => [Math.round(fromX), Math.round(toX)]))
      .toEqual([[-70, 70], [70, -70], [-70, 70], [70, -70]]);
    expect(incoming.map(({ toX }) => Math.round(toX))).toEqual([70, -70, 70, -70]);
    // A parte que sai começa no centro da medalha (meio traço acima, para a
    // ponta redonda) e vai até a borda de baixo da linha.
    expect(outgoing[0].fromRadius).toBe(34);
    expect(outgoing[1].fromRadius).toBe(34);
    expect(outgoing[2].fromRadius).toBe(40);
    expect(outgoing[0].height).toBe(180 - (25 + 34 - 5));
    expect(outgoing[2].height).toBe(180 - (25 + 40 - 5));
  });

  it('o trecho que sai só aparece depois de a linha ser medida', () => {
    const screen = renderTrail([segment('t1', 'Fundamentos', [unit('u1', 'Unidade 1', ['completed', 'available'])])], 'u1-node-1');

    expect(pathPieces(screen, 'out')).toHaveLength(0);
    medirLinhas(screen);
    expect(pathPieces(screen, 'out')).toHaveLength(1);
  });
});

describe('JourneyTrail — o caminho percorrido', () => {
  it('com cinco nós desenha quatro trechos, os dois primeiros percorridos quando o recomendado é o terceiro', () => {
    const screen = renderTrail(
      [segment('t1', 'Fundamentos', [unit('u1', 'Unidade 1', ['completed', 'completed', 'available', 'locked', 'locked'])])],
      'u1-node-2',
    );

    expect(traveledStates(screen)).toEqual([true, true, false, false]);
  });

  it('não listra o caminho quando um nó pendente aparece no meio do trecho já andado', () => {
    // O defeito que este caso trava, visto no simulador em 2026-08-21: colorir
    // cada trecho pelo estado do nó vizinho produzia aceso-apagado-aceso,
    // porque revisões bloqueadas se intercalam entre lições concluídas. A
    // informação está na FRONTEIRA, e duas fronteiras não são fronteira nenhuma.
    const screen = renderTrail(
      [segment('t1', 'Fundamentos', [unit('u1', 'Unidade 1', ['completed', 'locked', 'completed', 'available', 'locked'])])],
      'u1-node-3',
    );

    const estados = traveledStates(screen);
    expect(estados).toEqual([true, true, true, false]);
    expect(estados.filter((estado, i) => i > 0 && estado !== estados[i - 1])).toHaveLength(1);
  });

  it('sem nó recomendado, acende até o último concluído', () => {
    const screen = renderTrail([
      segment('t1', 'Fundamentos', [unit('u1', 'Unidade 1', ['completed', 'completed', 'locked'])]),
    ]);

    expect(traveledStates(screen)).toEqual([true, false]);
  });

  it('não desenha caminho nenhum num percurso de um nó só', () => {
    const screen = renderTrail([
      segment('t1', 'Fundamentos', [unit('u1', 'Unidade 1', ['available'])]),
    ]);

    medirLinhas(screen);
    expect(screen.UNSAFE_queryAllByType(JourneyPathSegment)).toHaveLength(0);
  });

  it('liga o caminho ATRAVÉS da fronteira entre trilhas e entre unidades', () => {
    // A costura entre segmentos é onde o percurso mais corre risco de voltar a
    // parecer dois pedaços.
    const screen = renderTrail(
      [
        segment('t1', 'Fundamentos', [unit('u1', 'Unidade 1', ['completed']), unit('u3', 'Unidade 3', ['completed'])]),
        segment('t2', 'Tórax', [unit('u2', 'Unidade 2', ['available'])], { order: 1 }),
      ],
      'u2-node-0',
    );

    expect(traveledStates(screen)).toEqual([true, true]);
  });
});

describe('JourneyTrail — a medalha de cada nó', () => {
  it('o recomendado pulsa, mede 40 e diz "<título>. Próximo passo."', () => {
    const screen = renderTrail(
      [segment('t1', 'Fundamentos', [unit('u1', 'Unidade 1', ['completed', 'available', 'locked'])])],
      'u1-node-1',
    );

    const next = medalProps(screen, 'u1-node-1');
    expect(next.pulsing).toBe(true);
    expect(next.state).toBe('next');
    expect(next.size).toBe(40);
    expect(screen.getByRole('button', { name: 'Unidade 1 — nó 2. Próximo passo.' })).toBeTruthy();
    expect(medalProps(screen, 'u1-node-0').pulsing).toBe(false);
    expect(medalProps(screen, 'u1-node-2').pulsing).toBe(false);
    expect(medalProps(screen, 'u1-node-0').state).toBe('done');
    expect(medalProps(screen, 'u1-node-2').state).toBe('locked');
  });

  it('o rótulo da revisão devida continua "Revisar <título>. Revisão devida · 2 devidas."', () => {
    const review = unit('u1', 'Unidade 1', ['completed', 'due-review']);
    review.nodes[1] = { ...review.nodes[1], type: 'review', title: 'Revisar Fundamentos de Radiologia' };
    const screen = renderTrail([segment('t1', 'Fundamentos', [review])], 'u1-node-1', {
      recommendationReason: 'due-review',
      dueReviewCount: 2,
    });

    expect(screen.getByRole('button', { name: 'Revisar Fundamentos de Radiologia. Revisão devida · 2 devidas.' })).toBeTruthy();
  });

  it('explica a retomada sem substituir o título da lição', () => {
    const screen = renderTrail(
      [segment('t1', 'Fundamentos', [unit('u1', 'Unidade 1', ['completed', 'resumable'])])],
      'u1-node-1',
      { recommendationReason: 'paused-lesson' },
    );

    expect(screen.getByRole('button', { name: 'Unidade 1 — nó 2. Continuar de onde parou.' })).toBeTruthy();
  });

  it('mostra o instante da revisão futura ao leitor de tela e mantém o botão desativado', () => {
    const clock = jest.spyOn(Date, 'now').mockReturnValue(new Date(2026, 9, 12, 23, 59).getTime());
    try {
      const pending = unit('u1', 'Unidade 1', ['completed', 'locked']);
      pending.nodes[1] = {
        ...pending.nodes[1],
        type: 'review',
        title: 'Revisar Fundamentos de Radiologia',
        reviewAvailableAtMs: new Date(2026, 9, 13, 0, 5).getTime(),
      };
      const screen = renderTrail([segment('t1', 'Fundamentos', [pending])]);
      const button = screen.getByRole('button', {
        name: 'Revisar Fundamentos de Radiologia. Disponível em 13/10/2026 às 00:05.',
      });

      expect(button.props.accessibilityState.disabled).toBe(true);
    } finally {
      clock.mockRestore();
    }
  });

  it('cada nó é um botão só: o título, o caminho e o encaixe do Pixel ficam fora do leitor de tela', () => {
    const screen = renderTrail(
      [segment('t1', 'Fundamentos', [unit('u1', 'Unidade 1', ['completed', 'available', 'locked'])])],
      'u1-node-1',
      { pixelSlot: (nodeId) => (nodeId === 'u1-node-1' ? <View testID="pixel-no-encaixe" /> : null) },
    );

    medirLinhas(screen);
    expect(screen.getAllByRole('button')).toHaveLength(3);
    expect(screen.queryByText('Unidade 1 — nó 1')).toBeNull();
    expect(screen.getByText('Unidade 1 — nó 1', HIDDEN)).toBeTruthy();
    expect(screen.queryByTestId(/^journey-path-/u)).toBeNull();
    expect(screen.getAllByTestId('journey-path-in', HIDDEN)).toHaveLength(2);
    expect(screen.getAllByTestId('journey-path-out', HIDDEN)).toHaveLength(2);
    expect(screen.queryByTestId('pixel-no-encaixe')).toBeNull();
    expect(screen.getByTestId('pixel-no-encaixe', HIDDEN)).toBeTruthy();
  });

  it('não dispara navegação a partir de um nó bloqueado, e dispara do liberado', () => {
    onNodePress.mockClear();
    const screen = renderTrail(
      [segment('t1', 'Fundamentos', [unit('u1', 'Unidade 1', ['available', 'locked'])])],
      'u1-node-0',
    );

    const locked = screen.getByRole('button', { name: 'Unidade 1 — nó 2. Bloqueado.' });
    expect(locked.props.accessibilityState.disabled).toBe(true);
    fireEvent.press(locked);
    expect(onNodePress).not.toHaveBeenCalled();

    fireEvent.press(screen.getByRole('button', { name: 'Unidade 1 — nó 1. Próximo passo.' }));
    expect(onNodePress).toHaveBeenCalledWith(expect.objectContaining({ id: 'u1-node-0' }));
  });

  it('não apaga o título do nó bloqueado com opacidade global', () => {
    // `opacity` apagaria o título junto, e o contrato de contraste não pega
    // isso porque calcula tokens, não runtime. O título continua legível: é o
    // que permite decidir se vale a pena destravar aquele ponto.
    const screen = renderTrail([segment('t1', 'Fundamentos', [unit('u1', 'Unidade 1', ['available', 'locked'])])]);
    const title = screen.getByText('Unidade 1 — nó 2', HIDDEN);

    for (let node: typeof title | null = title; node; node = node.parent) {
      const style = StyleSheet.flatten(node.props.style);
      expect(style?.opacity).toBeUndefined();
    }
    expect(StyleSheet.flatten(title.props.style).color).toBe(galaxyColors.textSecondary);
  });

  it('dá a cada medalha o tema do nó e, sem ele, o da unidade', () => {
    const themed = unit('u1', 'Unidade 1', ['completed', 'available'], { theme: 'tubo' });
    themed.nodes[1] = { ...themed.nodes[1], theme: 'tomografia' };
    const screen = renderTrail([segment('t1', 'Fundamentos', [themed])]);

    expect(medalProps(screen, 'u1-node-0').theme).toBe('tubo');
    expect(medalProps(screen, 'u1-node-1').theme).toBe('tomografia');
  });

  it('o checkpoint traz o número da unidade dentro da área', () => {
    const second = unit('u2', 'Segunda', ['available']);
    second.nodes[0] = { ...second.nodes[0], type: 'checkpoint' };
    const screen = renderTrail([segment('t1', 'Área', [unit('u1', 'Primeira', ['completed']), second])]);

    expect(medalProps(screen, 'u2-node-0').unitNumber).toBe(2);
  });
});

describe('JourneyTrail — estrelas', () => {
  function withLessons() {
    const lessons = unit('u1', 'Unidade 1', ['completed', 'completed', 'available']);
    lessons.nodes = lessons.nodes.map((node, index) => ({ ...node, lessonId: `lesson-${index + 1}` as never }));
    return [segment('t1', 'Fundamentos', [lessons])];
  }

  it('passa o recorde só às lições concluídas', () => {
    const stars: Record<string, LessonStars> = { 'lesson-1': 2, 'lesson-3': 3 };
    const screen = renderTrail(withLessons(), 'u1-node-2', { starsByLessonId: stars });

    expect(medalProps(screen, 'u1-node-0').stars).toBe(2);
    // Concluída sem tentativa registrada: ouro sem estrela, nunca zero estrelas.
    expect(medalProps(screen, 'u1-node-1').stars).toBeUndefined();
    // Não concluída: o recorde de uma tentativa antiga não aparece.
    expect(medalProps(screen, 'u1-node-2').stars).toBeUndefined();
  });

  it('sem o mapa, nenhuma medalha desenha estrela', () => {
    const screen = renderTrail(withLessons(), 'u1-node-2');

    expect(medalProps(screen, 'u1-node-0').stars).toBeUndefined();
  });
});

describe('JourneyTrail — o encaixe do Pixel', () => {
  it('pergunta pelo encaixe de cada nó e desenha o que vier ao lado da medalha', () => {
    const pixelSlot = jest.fn((nodeId: string) => (nodeId === 'u1-node-1' ? <View testID="pixel-no-encaixe" /> : null));
    const screen = renderTrail(
      [segment('t1', 'Fundamentos', [unit('u1', 'Unidade 1', ['completed', 'available'])])],
      'u1-node-1',
      { pixelSlot },
    );

    expect(pixelSlot.mock.calls.map(([nodeId]) => nodeId)).toEqual(expect.arrayContaining(['u1-node-0', 'u1-node-1']));
    const pixel = screen.getByTestId('pixel-no-encaixe', HIDDEN);
    let insideAnchor = false;
    for (let node = pixel.parent; node; node = node.parent) {
      if (node.props.testID === 'journey-anchor-u1-node-1') insideAnchor = true;
    }
    expect(insideAnchor).toBe(true);
  });

  it('fica do lado de fora da trilha, porque do lado de dentro corre o pontilhado', () => {
    const slot = (nodeId: string) => <View testID={`pixel-${nodeId}`} />;
    const screen = renderTrail(
      [segment('t1', 'Fundamentos', [unit('u1', 'Unidade 1', ['completed', 'available'])])],
      'u1-node-1',
      { pixelSlot: slot },
    );
    medirLargura(screen);
    // O estilo do encaixe que envolve o que a tela passou.
    const side = (nodeId: string) => {
      for (let node = screen.getByTestId(`pixel-${nodeId}`, HIDDEN).parent; node; node = node.parent) {
        const style = StyleSheet.flatten(node.props.style);
        if (style?.position === 'absolute') return style;
      }
      throw new Error(`encaixe de ${nodeId} sem posição`);
    };

    // u1-node-0 está à esquerda: o encaixe vai à esquerda dela; u1-node-1, à direita.
    expect(side('u1-node-0').right).toBe('100%');
    expect(side('u1-node-1').left).toBe('100%');
  });
});

describe('JourneyTrail — a ação sob a medalha recomendada', () => {
  const trilha = () => [segment('t1', 'Fundamentos', [unit('u1', 'Unidade 1', ['completed', 'available', 'locked'])])];
  const acao = <Pressable testID="acao" accessibilityRole="button" accessibilityLabel="Continuar jornada" />;

  it('fica sob a medalha recomendada, e só nela', () => {
    const screen = renderTrail(trilha(), 'u1-node-1', { recommendedAction: acao });

    const action = screen.getByTestId('acao');
    let anchor: string | undefined;
    for (let node = action.parent; node; node = node.parent) {
      if (/^journey-anchor-/u.test(node.props.testID ?? '')) { anchor = node.props.testID; break; }
    }
    expect(anchor).toBe('journey-anchor-u1-node-1');
    expect(screen.getAllByTestId('acao', HIDDEN)).toHaveLength(1);
  });

  it('o leitor de tela alcança o botão, fora do bloco escondido do Pixel', () => {
    const screen = renderTrail(trilha(), 'u1-node-1', {
      recommendedAction: acao,
      pixelSlot: (nodeId) => (nodeId === 'u1-node-1' ? <View testID="pixel" /> : null),
    });

    // Sem `includeHiddenElements`: o que está escondido não é achado.
    expect(screen.getByRole('button', { name: 'Continuar jornada' })).toBeTruthy();
    expect(screen.queryByTestId('pixel')).toBeNull();
  });

  it('sem recomendado, não há ação', () => {
    const screen = renderTrail(trilha(), undefined, { recommendedAction: acao });

    expect(screen.queryByTestId('acao', HIDDEN)).toBeNull();
  });
});

// O momento (spec, seção 4): ao voltar de uma aula concluída, o trecho até a
// próxima acende, o Pixel percorre o caminho e para ao lado da medalha, a
// medalha cresce e o botão aparece. Com "reduzir movimento", troca instantânea.
describe('JourneyTrail — o momento do Pixel', () => {
  const mockedPreference = useReducedMotionPreferenceState as jest.Mock;
  // A cabeça do Pixel no tamanho `sm`: 48 de largura, 46 de altura.
  const HEAD = { width: 48, height: 46 };
  const ROW = 180;
  /** Meia-largura 200: as medalhas ficam a ±70 do centro. */
  const OFFSET = 70;

  beforeEach(() => { jest.useFakeTimers(); });
  afterEach(() => {
    jest.useRealTimers();
    mockedPreference.mockReturnValue({ reducedMotionEnabled: false, resolved: true });
  });

  function trilha() {
    // u1-node-0 à esquerda, u1-node-1 à direita (acabou de ser concluído) e
    // u1-node-2 à esquerda, o novo recomendado.
    return [segment('t1', 'Fundamentos', [unit('u1', 'Unidade 1', ['completed', 'completed', 'available'])])];
  }

  function renderMoment(moment?: { fromNodeId: string; toNodeId: string }, onDone = jest.fn()) {
    const screen = renderTrail(trilha(), 'u1-node-2', {
      pixelSlot: (nodeId) => (nodeId === 'u1-node-2' ? <View testID="pixel" /> : null),
      recommendedAction: <Pressable testID="acao" accessibilityRole="button" accessibilityLabel="Continuar jornada" />,
      moment: moment ? { ...moment, onDone } : undefined,
    });
    medirLargura(screen);
    medirLinhas(screen, ROW);
    fireEvent(screen.getByTestId('journey-pixel-slot-u1-node-2', HIDDEN), 'layout', {
      nativeEvent: { layout: { x: 0, y: 0, ...HEAD } },
    });
    // O estilo animado chega à vista no quadro seguinte: o primeiro quadro do momento.
    act(() => { jest.advanceTimersByTime(16); });
    return { screen, onDone };
  }

  type Transform = { translateX?: number; translateY?: number; scale?: number }[];
  const styleOf = (screen: ReturnType<typeof render>, testID: string) =>
    getAnimatedStyle(screen.getByTestId(testID, HIDDEN)) as { opacity?: number; transform?: Transform };
  const transformOf = (screen: ReturnType<typeof render>, testID: string) => {
    const entries = styleOf(screen, testID).transform ?? [];
    return {
      x: entries.find((entry) => entry.translateX !== undefined)?.translateX ?? 0,
      y: entries.find((entry) => entry.translateY !== undefined)?.translateY ?? 0,
      scale: entries.find((entry) => entry.scale !== undefined)?.scale ?? 1,
    };
  };

  // Onde a cabeça descansa, em relação ao centro da trilha e ao topo da linha:
  // do lado de fora da medalha recomendada (à esquerda), centrada na caixa da
  // medalha com o lábio.
  const rest = {
    x: -OFFSET - (NEXT_MEDAL_RADIUS + space.s1 + HEAD.width / 2),
    y: TRAIL_MEDAL_TOP + (2 * NEXT_MEDAL_RADIUS + depth.medalLip) / 2,
  };
  /** O centro da cabeça agora, nas mesmas coordenadas. */
  const pixelCenter = (screen: ReturnType<typeof render>) => {
    const { x, y } = transformOf(screen, 'journey-pixel-slot-u1-node-2');
    return { x: rest.x + x, y: rest.y + y };
  };
  /** A linha do trecho que sai do nó concluído, na altura do centro dele. */
  const lineY = -ROW + TRAIL_MEDAL_TOP + MEDAL_RADIUS;
  const advance = (ms: number) => act(() => { jest.advanceTimersByTime(ms); });

  it('fora do momento, tudo está no estado final: o Pixel ao lado da medalha e o botão à vista', () => {
    const { screen } = renderMoment();

    expect(transformOf(screen, 'journey-pixel-slot-u1-node-2')).toMatchObject({ x: 0, y: 0 });
    expect(styleOf(screen, 'journey-action-u1-node-2').opacity).toBe(1);
    expect(screen.queryByTestId(/^journey-moment-segment-/u, HIDDEN)).toBeNull();
  });

  it('o Pixel parte do lado da medalha concluída, montado no pontilhado', () => {
    const { screen } = renderMoment({ fromNodeId: 'u1-node-1', toNodeId: 'u1-node-2' });
    const start = pixelCenter(screen);

    // Do lado de dentro da medalha concluída (à direita, em +70), virado para
    // a próxima, sem cobrir a medalha.
    expect(start.x).toBeCloseTo(OFFSET - (MEDAL_RADIUS + TRAIL_SIDE_GAP) - HEAD.width / 2, 1);
    // Em cima da linha: o centro acima dela, e a base encostando nela.
    expect(start.y).toBeLessThan(lineY);
    expect(start.y + HEAD.height / 2).toBeGreaterThanOrEqual(lineY);
  });

  it('percorre o caminho: corre na horizontal, desce a vertical da próxima e para ao lado dela', () => {
    const { screen, onDone } = renderMoment({ fromNodeId: 'u1-node-1', toNodeId: 'u1-node-2' });
    const start = pixelCenter(screen);
    const samples: { x: number; y: number }[] = [];
    // Até o último quadro antes do fim (o primeiro já passou em `renderMoment`).
    for (let elapsed = 16; elapsed < TRAIL_MOMENT_MS - 16; elapsed += 16) {
      advance(16);
      samples.push(pixelCenter(screen));
    }

    // A perna horizontal, na altura da linha, entre a concluída e a próxima.
    expect(samples.some(({ x, y }) => x < start.x - 20 && x > -OFFSET + 20 && Math.abs(y - start.y) < 1)).toBe(true);
    // A descida, na vertical da próxima, entre a linha e o topo da linha dela.
    expect(samples.some(({ x, y }) => Math.abs(x + OFFSET) < 1 && y > start.y + 20 && y < TRAIL_LEAD)).toBe(true);
    // Nunca volta para trás nem sai do caminho para o lado de dentro.
    for (const { x } of samples) {
      expect(x).toBeLessThanOrEqual(start.x + 0.5);
      expect(x).toBeGreaterThanOrEqual(rest.x - 0.5);
    }
    expect(pixelCenter(screen).x).toBeCloseTo(rest.x, 1);
    expect(pixelCenter(screen).y).toBeCloseTo(rest.y, 1);
    expect(onDone).not.toHaveBeenCalled();

    advance(50);
    expect(onDone).toHaveBeenCalledTimes(1);
  });

  it('em sequência: o trecho acende, o Pixel anda, a medalha cresce e volta, e o botão entra', () => {
    const { screen } = renderMoment({ fromNodeId: 'u1-node-1', toNodeId: 'u1-node-2' });
    const lit = () => screen.getAllByTestId(/^journey-moment-segment-/u, HIDDEN)
      .map((node) => (getAnimatedStyle(node) as { opacity: number }).opacity);

    // As duas partes do trecho: a que sai da concluída e a que chega à próxima.
    expect(screen.getByTestId('journey-moment-segment-out', HIDDEN)).toBeTruthy();
    expect(screen.getByTestId('journey-moment-segment-in', HIDDEN)).toBeTruthy();
    // O primeiro quadro: o trecho começa a acender, o botão ainda não entrou.
    for (const opacity of lit()) expect(opacity).toBeLessThan(0.3);
    expect(styleOf(screen, 'journey-action-u1-node-2').opacity).toBe(0);

    advance(304);
    expect(lit()).toEqual([1, 1]);
    expect(transformOf(screen, 'journey-medal-u1-node-2').scale).toBe(1);

    // O Pixel chega aos 750 ms; a medalha cresce até 1,08 e volta.
    let peak = 1;
    for (let elapsed = 336; elapsed <= 1136; elapsed += 16) {
      advance(16);
      peak = Math.max(peak, transformOf(screen, 'journey-medal-u1-node-2').scale);
    }
    expect(peak).toBeCloseTo(1.08, 2);
    expect(styleOf(screen, 'journey-action-u1-node-2').opacity).toBe(0);

    advance(TRAIL_MOMENT_MS - 1136 + 16);
    expect(transformOf(screen, 'journey-medal-u1-node-2').scale).toBe(1);
    expect(styleOf(screen, 'journey-action-u1-node-2').opacity).toBe(1);
    expect(transformOf(screen, 'journey-action-u1-node-2').y).toBe(0);
  });

  it('durante o momento, o trecho debaixo do aceso é o apagado', () => {
    const { screen } = renderMoment({ fromNodeId: 'u1-node-1', toNodeId: 'u1-node-2' });
    const lit = screen.getAllByTestId(/^journey-moment-segment-/u, HIDDEN)
      .flatMap((node) => node.findAllByType(JourneyPathSegment).map((piece: { props: SegmentProps }) => piece.props.traveled));

    expect(lit).toEqual([true, true]);
    // Em ordem: o trecho entre u1-node-0 e u1-node-1, andado há tempo, segue
    // percorrido; o do momento fica apagado embaixo, com a camada acesa por cima.
    expect(pathPieces(screen, 'out').map((props) => props.traveled)).toEqual([true, false, true]);
    expect(pathPieces(screen, 'in').map((props) => props.traveled)).toEqual([true, false, true]);
  });

  it('se o concluído não é o nó logo acima, o Pixel desce só o trecho que chega', () => {
    const { screen } = renderMoment({ fromNodeId: 'u1-node-0', toNodeId: 'u1-node-2' });
    const start = pixelCenter(screen);

    expect(start.x).toBeCloseTo(-OFFSET, 1);
    expect(start.y).toBeLessThan(TRAIL_LEAD);
    expect(screen.queryByTestId('journey-moment-segment-out', HIDDEN)).toBeNull();
    expect(screen.getByTestId('journey-moment-segment-in', HIDDEN)).toBeTruthy();
  });

  it('espera o destino virtualizado medir antes de consumir o tempo do momento', () => {
    const onDone = jest.fn();
    const screen = renderTrail(trilha(), 'u1-node-2', {
      pixelSlot: nodeId => nodeId === 'u1-node-2' ? <View testID="pixel" /> : null,
      recommendedAction: <Pressable testID="acao" />,
      moment: { fromNodeId: 'u1-node-1', toNodeId: 'u1-node-2', onDone },
    });
    medirLargura(screen);
    medirLinhas(screen, ROW);
    // Uma lista longa pode montar/medir o encaixe depois de toda a duração.
    advance(TRAIL_MOMENT_MS + 500);
    expect(onDone).not.toHaveBeenCalled();
    fireEvent(screen.getByTestId('journey-pixel-slot-u1-node-2', HIDDEN), 'layout', {
      nativeEvent: { layout: { x: 0, y: 0, ...HEAD } },
    });
    advance(16);
    expect(pixelCenter(screen).y).toBeLessThan(lineY);
    expect(styleOf(screen, 'journey-action-u1-node-2').opacity).toBe(0);
    advance(TRAIL_MOMENT_MS + 32);
    expect(onDone).toHaveBeenCalledTimes(1);
  });

  it('espera também a origem adjacente medir, mesmo com o destino já montado', () => {
    const onDone = jest.fn();
    const screen = renderTrail(trilha(), 'u1-node-2', {
      pixelSlot: nodeId => nodeId === 'u1-node-2' ? <View testID="pixel" /> : null,
      moment: { fromNodeId: 'u1-node-1', toNodeId: 'u1-node-2', onDone },
    });
    medirLargura(screen);
    fireEvent(screen.getByTestId('journey-pixel-slot-u1-node-2', HIDDEN), 'layout', {
      nativeEvent: { layout: { x: 0, y: 0, ...HEAD } },
    });
    advance(TRAIL_MOMENT_MS + 500);
    expect(onDone).not.toHaveBeenCalled();
    medirLinhas(screen, ROW);
    advance(16);
    expect(pixelCenter(screen).y).toBeLessThan(lineY);
    advance(TRAIL_MOMENT_MS + 32);
    expect(onDone).toHaveBeenCalledTimes(1);
  });

  it('uma nova medição da origem não reposiciona o Pixel depois da partida', () => {
    const { screen } = renderMoment({ fromNodeId: 'u1-node-1', toNodeId: 'u1-node-2' });
    // O trecho ainda acende: a cabeça espera no início, já com a rota fixada.
    advance(100);
    const before = pixelCenter(screen);
    fireEvent(screen.getByTestId('journey-trail-row-u1-node-1', HIDDEN), 'layout', {
      nativeEvent: { layout: { x: 0, y: 0, width: 400, height: ROW + 80 } },
    });
    // O estilo do novo layout chega à vista no próximo quadro.
    advance(16);
    expect(pixelCenter(screen)).toEqual(before);
  });

  it('com texto grande, parte da cauda desenhada depois do título e segue a coluna', () => {
    mockWindow.fontScale = 1.65;
    const { screen } = renderMoment({ fromNodeId: 'u1-node-1', toNodeId: 'u1-node-2' });
    const tail = screen.getByTestId('journey-moment-segment-out', HIDDEN);
    const tailHeight = tail.findByType(JourneyPathSegment).props.height as number;
    // Coordenada do primeiro ponto do traçado efetivamente entregue ao SVG,
    // não a borda da medalha nem um espelho da rota do Pixel.
    const d = tail.findByType(Path).props.d as string;
    const firstPoint = /^M([^,]+),([^ ]+)/u.exec(d);
    expect(firstPoint).not.toBeNull();
    const lineStartY = -tailHeight + Number(firstPoint![2]);
    const columnRest = {
      x: -(NEXT_MEDAL_RADIUS + space.s1 + HEAD.width / 2),
      y: rest.y,
    };
    const center = () => {
      const transform = transformOf(screen, 'journey-pixel-slot-u1-node-2');
      return { x: columnRest.x + transform.x, y: columnRest.y + transform.y };
    };
    const start = center();
    expect(start.x).toBeCloseTo(0, 1);
    // A base da cabeça apoia 4pt sobre a linha (mesmo apoio do zigue-zague).
    expect(start.y + HEAD.height / 2).toBeCloseTo(lineStartY + 4, 1);
    const samples: { x: number; y: number }[] = [];
    for (let elapsed = 16; elapsed < TRAIL_MOMENT_MS; elapsed += 16) {
      advance(16);
      samples.push(center());
    }
    // Nunca sobe para a região anterior à cauda (o bloco de título/estrelas).
    expect(samples.every(point => point.y >= start.y - 0.5)).toBe(true);
    expect(samples.some(point => Math.abs(point.x) < 1 && point.y > start.y + 10)).toBe(true);
    expect(center().x).toBeCloseTo(columnRest.x, 1);
    expect(center().y).toBeCloseTo(columnRest.y, 1);
  });

  it('com "reduzir movimento", o primeiro quadro já é o final e o momento acaba na hora', () => {
    mockedPreference.mockReturnValue({ reducedMotionEnabled: true, resolved: true });
    const { screen, onDone } = renderMoment({ fromNodeId: 'u1-node-1', toNodeId: 'u1-node-2' });

    expect(transformOf(screen, 'journey-pixel-slot-u1-node-2')).toMatchObject({ x: 0, y: 0 });
    expect(styleOf(screen, 'journey-pixel-slot-u1-node-2').opacity).toBe(1);
    expect(transformOf(screen, 'journey-medal-u1-node-2').scale).toBe(1);
    expect(styleOf(screen, 'journey-action-u1-node-2').opacity).toBe(1);
    for (const node of screen.getAllByTestId(/^journey-moment-segment-/u, HIDDEN)) {
      expect((getAnimatedStyle(node) as { opacity: number }).opacity).toBe(1);
    }
    expect(onDone).toHaveBeenCalledTimes(1);
  });
});

describe('JourneyPathSegment', () => {
  function strokeOf(traveled: boolean, part: SegmentProps['part'] = 'out') {
    const screen = render(<JourneyPathSegment part={part} fromX={-70} toX={70} height={120} traveled={traveled} />);
    return screen.UNSAFE_getByType(Path).props;
  }

  it('linha de 10 com traço 1 e intervalo 18 de ponta redonda: pontos redondos de 10 a cada 19', () => {
    const path = strokeOf(true);

    expect(path.strokeWidth).toBe(10);
    expect(path.strokeDasharray).toBe('1 18');
    expect(path.strokeLinecap).toBe('round');
  });

  it('o percorrido é da cor da unidade, e o restante, apagado, nas duas partes', () => {
    expect(strokeOf(true).stroke).toBe(medalColors.unit.face);
    expect(strokeOf(false).stroke).toBe(galaxyColors.surfaceMuted);
    expect(strokeOf(true, 'in').stroke).toBe(medalColors.unit.face);
    expect(strokeOf(false, 'in').stroke).toBe(galaxyColors.surfaceMuted);
  });

  it('a parte que sai acerta o passo dos pontos para a costura com a de baixo', () => {
    const screen = render(<JourneyPathSegment part="out" fromX={-70} toX={70} height={120} traveled />);
    const path = outgoingPath(-70, 70, 34, 120);

    expect(screen.UNSAFE_getByType(Path).props.d).toBe(path.d);
    expect(screen.UNSAFE_getByType(Path).props.strokeDashoffset).toBeCloseTo(path.dashOffset, 6);
    expect(strokeOf(true, 'in').strokeDashoffset).toBe(TRAIL_SEAM_PHASE);
  });

  it('ocupa a altura pedida e fica fora do leitor de tela', () => {
    const screen = render(<JourneyPathSegment part="in" fromX={70} toX={70} height={15} traveled={false} />);
    const view = screen.getByTestId('journey-path-in', HIDDEN);

    expect(StyleSheet.flatten(view.props.style).height).toBe(15);
    expect(view.props.accessibilityElementsHidden).toBe(true);
    expect(view.props.importantForAccessibility).toBe('no-hide-descendants');
  });
});

// Achado 2 do gate H4 (2026-09-24): com texto grande, o zigue-zague partia as
// palavras. Nos tamanhos grandes a trilha vira uma coluna centrada, sem
// deslocamento, com o título sem limite de linhas.
describe('JourneyTrail — texto grande', () => {
  const trilha = () => [segment('t1', 'Fundamentos', [unit('u1', 'Unidade 1', ['completed', 'available', 'locked'])])];

  it('vira coluna: nenhuma medalha sai do centro e o caminho desce reto', () => {
    mockWindow.fontScale = 1.65;
    const screen = renderTrail(trilha(), 'u1-node-1');
    medirLargura(screen);
    medirLinhas(screen);

    expect([0, 1, 2].map((index) => offsetOf(screen, `u1-node-${index}`))).toEqual([0, 0, 0]);
    const pieces = screen.UNSAFE_getAllByType(JourneyPathSegment).map((element) => element.props as SegmentProps);
    expect(pieces).toHaveLength(4);
    expect(pieces.every(({ fromX, toX }) => fromX === 0 && toX === 0)).toBe(true);
    expect(screen.getByText('Unidade 1 — nó 2', HIDDEN).props.numberOfLines).toBeUndefined();
  });

  it('mantém o zigue-zague e o limite de linhas no tamanho padrão', () => {
    const screen = renderTrail(trilha(), 'u1-node-1');
    medirLargura(screen);

    expect(offsetOf(screen, 'u1-node-1')).toBeCloseTo(70, 6);
    expect(screen.getByText('Unidade 1 — nó 2', HIDDEN).props.numberOfLines).toBe(2);
  });

  it('no zigue-zague o título vai até a meia-largura menos 16, em até duas linhas', () => {
    const screen = renderTrail(trilha(), 'u1-node-1');
    medirLargura(screen);
    const title = screen.getByText('Unidade 1 — nó 2', HIDDEN);

    expect(StyleSheet.flatten(title.props.style).maxWidth).toBe(200 - 16);
    expect(title.props.numberOfLines).toBe(2);
  });
});

// O cabeçalho que a tela passa à trilha rola junto com ela (achado 2 do gate H4:
// fixo acima, com texto grande, ele ocupava a tela e escondia a trilha).
describe('JourneyTrail — cabeçalho na rolagem', () => {
  it('renderiza o cabeçalho dentro da lista rolável', () => {
    const screen = render(
      <JourneyTrail
        segments={[segment('t1', 'Trilha', [unit('u1', 'Unidade', ['available'])])]}
        header={<Text>Cabeçalho do estágio</Text>}
        onNodePress={jest.fn()}
        isNodeDisabled={() => false}
      />,
    );
    let insideScroll = false;
    for (let node = screen.getByText('Cabeçalho do estágio').parent; node; node = node.parent) {
      if (node.type === 'RCTScrollView') insideScroll = true;
    }

    expect(insideScroll).toBe(true);
  });
});

// Pedido do dono em 2026-10-16, conferido no simulador: a trilha abria sempre
// no topo, e o nó PRÓXIMO ficava abaixo da dobra. A Home precisa levar o aluno
// ao ponto em que ele está. Jest não faz layout, então a asserção é sobre o
// pedido de rolagem que a lista recebe, que é o que determina a posição.
describe('JourneyTrail — abre no ponto do aluno', () => {
  const trilhaComDuasTrilhas = () => [
    segment('t1', 'Fundamentos', [unit('u1', 'Unidade 1', ['completed', 'completed', 'completed'])]),
    segment('t2', 'Tórax', [unit('u2', 'Unidade 2', ['completed', 'available'])], { order: 1 }),
  ];

  let scrollToIndex: jest.SpyInstance;
  let scrollToOffset: jest.SpyInstance;

  beforeEach(() => {
    scrollToIndex = jest.spyOn(FlatList.prototype, 'scrollToIndex').mockImplementation(() => {});
    scrollToOffset = jest.spyOn(FlatList.prototype, 'scrollToOffset').mockImplementation(() => {});
  });

  afterEach(() => {
    scrollToIndex.mockRestore();
    scrollToOffset.mockRestore();
  });

  function medirConteudo(screen: ReturnType<typeof render>) {
    fireEvent(screen.getByTestId('journey-trail'), 'contentSizeChange', 402, 3000);
  }

  it('centraliza o nó recomendado quando o conteúdo é medido', () => {
    // Itens: 3 nós de t1, a faixa de Tórax, e os 2 nós de t2. O PRÓXIMO é o 6º.
    const screen = renderTrail(trilhaComDuasTrilhas(), 'u2-node-1');
    medirConteudo(screen);

    expect(scrollToIndex).toHaveBeenCalledTimes(1);
    expect(scrollToIndex).toHaveBeenCalledWith({ index: 5, viewPosition: 0.5, animated: false });
  });

  it('não volta a centralizar enquanto a recomendação é a mesma', () => {
    // O conteúdo muda de tamanho a cada lote virtualizado. Recentralizar a cada
    // medição arrancaria o aluno do lugar para onde ele rolou.
    const screen = renderTrail(trilhaComDuasTrilhas(), 'u2-node-1');
    medirConteudo(screen);
    medirConteudo(screen);

    expect(scrollToIndex).toHaveBeenCalledTimes(1);
  });

  it('não volta a centralizar quando a largura medida desloca as medalhas', () => {
    // A primeira medida da largura troca o zigue-zague estimado pelo real; isso
    // muda posições, não a recomendação.
    const screen = renderTrail(trilhaComDuasTrilhas(), 'u2-node-1');
    medirConteudo(screen);
    medirLargura(screen, 360);
    medirConteudo(screen);

    expect(scrollToIndex).toHaveBeenCalledTimes(1);
  });

  it('centraliza o novo PRÓXIMO quando a recomendação muda', () => {
    const screen = renderTrail(trilhaComDuasTrilhas(), 'u2-node-0');
    medirConteudo(screen);
    screen.rerender(
      <JourneyTrail
        segments={trilhaComDuasTrilhas()}
        recommendedNodeId="u2-node-1"
        onNodePress={onNodePress}
        isNodeDisabled={isNodeDisabled as never}
      />,
    );
    medirConteudo(screen);

    expect(scrollToIndex).toHaveBeenCalledTimes(2);
    expect(scrollToIndex).toHaveBeenLastCalledWith({ index: 5, viewPosition: 0.5, animated: false });
  });

  it('centraliza o novo PRÓXIMO mesmo quando o conteúdo não muda de tamanho', () => {
    // Concluir uma lição troca rótulos, não alturas: a lista já medida não
    // recebe nova medição, e a recomendação nova ficaria fora da tela.
    const screen = renderTrail(trilhaComDuasTrilhas(), 'u2-node-0');
    medirConteudo(screen);
    screen.rerender(
      <JourneyTrail
        segments={trilhaComDuasTrilhas()}
        recommendedNodeId="u2-node-1"
        onNodePress={onNodePress}
        isNodeDisabled={isNodeDisabled as never}
      />,
    );

    expect(scrollToIndex).toHaveBeenCalledTimes(2);
    expect(scrollToIndex).toHaveBeenLastCalledWith({ index: 5, viewPosition: 0.5, animated: false });
  });

  it('não centraliza antes de a lista ser medida', () => {
    // Sem medida, `scrollToIndex` falha e gasta as tentativas à toa.
    renderTrail(trilhaComDuasTrilhas(), 'u2-node-1');

    expect(scrollToIndex).not.toHaveBeenCalled();
  });

  it('sem nó recomendado, não rola', () => {
    const screen = renderTrail(trilhaComDuasTrilhas());
    medirConteudo(screen);

    expect(scrollToIndex).not.toHaveBeenCalled();
  });

  it('recomendação que não está na trilha não vira índice inválido', () => {
    // O snapshot e o currículo são lidos em paralelo; um id que o currículo não
    // tem daria `scrollToIndex(-1)`.
    const screen = renderTrail(trilhaComDuasTrilhas(), 'no-que-nao-existe');
    medirConteudo(screen);

    expect(scrollToIndex).not.toHaveBeenCalled();
  });

  it('quando o nó ainda não foi medido, aproxima pela altura média e tenta de novo', () => {
    // Fora da primeira janela virtualizada, `scrollToIndex` falha sem medida.
    jest.useFakeTimers();
    try {
      const screen = renderTrail(trilhaComDuasTrilhas(), 'u2-node-1');
      screen.UNSAFE_getByType(FlatList).props.onScrollToIndexFailed({
        index: 5,
        highestMeasuredFrameIndex: 2,
        averageItemLength: 200,
      });

      expect(scrollToOffset).toHaveBeenCalledWith({ offset: 1000, animated: false });
      expect(scrollToIndex).not.toHaveBeenCalled();
      act(() => {
        jest.runOnlyPendingTimers();
      });
      expect(scrollToIndex).toHaveBeenCalledWith({ index: 5, viewPosition: 0.5, animated: false });
    } finally {
      jest.useRealTimers();
    }
  });
});


describe('JourneyTrail — navegação por unidades compostas', () => {
  it('identifica as unidades e permite consultar a bloqueada sem disparar um nó', () => {
    const scroll = jest.spyOn(FlatList.prototype, 'scrollToIndex').mockImplementation(() => {});
    try {
      onNodePress.mockClear();
      const screen = renderTrail([segment('t', 'Área', [unit('u1', 'Primeira unidade', ['completed']), unit('u2', 'Segunda unidade', ['locked'])])]);
      expect(screen.getByRole('header', { name: /Unidade 1 de 2: Primeira unidade/ })).toBeTruthy();
      expect(screen.getByRole('header', { name: /Unidade 2 de 2: Segunda unidade/ })).toBeTruthy();
      fireEvent.press(screen.getByRole('button', { name: 'Ver unidade 2 de 2: Segunda unidade. Área' }));
      // Cabeçalho u1, nó u1, cabeçalho u2: os novos cabeçalhos entram no índice.
      expect(scroll).toHaveBeenLastCalledWith({ index: 2, viewPosition: 0, animated: false });
      expect(onNodePress).not.toHaveBeenCalled();
      expect(screen.getByText(/Bloqueada/)).toBeTruthy();
    } finally { scroll.mockRestore(); }
  });

  it('o cabeçalho da unidade abre pelo título, sem etiqueta acima dele', () => {
    const screen = renderTrail([segment('t', 'Área', [unit('u1', 'Primeira unidade', ['completed']), unit('u2', 'Segunda unidade', ['locked'])])]);
    const header = screen.getByRole('header', { name: /Unidade 1 de 2: Primeira unidade/ });
    const texts = header.findAllByType(Text).map((node: { props: { children?: unknown } }) => node.props.children);

    expect(texts[0]).toBe('Primeira unidade');
  });

  it('reinicia a recuperação de rolagem ao escolher outra unidade distante', async () => {
    jest.useFakeTimers();
    const scroll = jest.spyOn(FlatList.prototype, 'scrollToIndex').mockImplementation(() => {});
    const offset = jest.spyOn(FlatList.prototype, 'scrollToOffset').mockImplementation(() => {});
    try {
      const screen = renderTrail([segment('t', 'Área', [unit('u1', 'Primeira', ['completed']), unit('u2', 'Segunda', ['available'])])], 'u2-node-0');
      await act(async () => {});
      const main = screen.UNSAFE_getAllByType(FlatList).find(list => list.props.testID === 'journey-trail')!;
      fireEvent(screen.getByTestId('journey-trail'), 'contentSizeChange', 400, 3000);
      for (let i = 0; i < 3; i += 1) {
        main.props.onScrollToIndexFailed({ index: 3, averageItemLength: 100 });
        act(() => { jest.runOnlyPendingTimers(); });
      }
      fireEvent.press(screen.getByRole('button', { name: 'Ver unidade 2 de 2: Segunda. Área' }));
      const before = scroll.mock.calls.length;
      main.props.onScrollToIndexFailed({ index: 2, averageItemLength: 100 });
      act(() => { jest.runOnlyPendingTimers(); });
      expect(scroll).toHaveBeenCalledTimes(before + 1);
      expect(scroll).toHaveBeenLastCalledWith({ index: 2, viewPosition: 0, animated: false });
    } finally { scroll.mockRestore(); offset.mockRestore(); jest.useRealTimers(); }
  });

});
