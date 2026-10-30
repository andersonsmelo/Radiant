import React from 'react';
import { StyleSheet, type StyleProp, type ViewStyle } from 'react-native';
import { render } from '@testing-library/react-native';
import { StarfieldBackground } from './StarfieldBackground';
import { galaxyColors } from '../theme';

// Plano 1 (fundação visual Medalhão), tarefa 3. O fundo do app passa a ser o
// grafite liso: sem estrelas, sem nebulosas e sem laço de animação (FILA 12 e
// 33, o custo de CPU do céu animado). O nome do componente fica por enquanto,
// para não tocar as nove telas que o usam; o plano 5 renomeia.
//
// O Jest não rasteriza, então a prova é a estrutura que o determina: a cor do
// contêiner e a contagem de nós. Estrela e nebulosa eram views nativas com
// `jestAnimatedStyle` (o Reanimated escreve nelas o quadro atual); o mesmo
// seletor que as contava antes conta agora, e deve achar zero.

type TestNode = {
  type: unknown;
  props: { style?: unknown; jestAnimatedStyle?: { value: Record<string, unknown> } };
  findAll: (predicate: (node: TestNode) => boolean) => TestNode[];
};

function hostNodes(screen: ReturnType<typeof render>): TestNode[] {
  const root: TestNode = screen.UNSAFE_root;
  return root.findAll((node) => typeof node.type === 'string');
}

/** Os nós que antes eram estrela ou nebulosa: view com estilo animado. */
function animatedNodes(screen: ReturnType<typeof render>): TestNode[] {
  return hostNodes(screen).filter((node) => node.props.jestAnimatedStyle !== undefined);
}

function styleOf(node: TestNode): ViewStyle {
  return StyleSheet.flatten(node.props.style as StyleProp<ViewStyle>) ?? {};
}

function backgroundOf(node: TestNode) {
  return styleOf(node).backgroundColor;
}

describe('StarfieldBackground: fundo grafite liso', () => {
  it('pinta o grafite e nenhuma estrela', () => {
    const screen = render(<StarfieldBackground />);
    const nodes = hostNodes(screen);

    // Validade: o contêiner existe e é o único nó. Sem isto, um componente que
    // devolvesse null passaria no "zero estrelas".
    expect(nodes).toHaveLength(1);
    expect(backgroundOf(nodes[0])).toBe(galaxyColors.background);
    expect(galaxyColors.background).toBe('#13151c');
    expect(animatedNodes(screen)).toHaveLength(0);
  });

  it('a variante focada e a contagem de estrelas não trazem estrela de volta', () => {
    for (const props of [
      { variant: 'focused' as const },
      { starCount: 120 },
      { variant: 'galaxy' as const, starCount: 90 },
    ]) {
      const screen = render(<StarfieldBackground {...props} />);

      expect(hostNodes(screen)).toHaveLength(1);
      expect(animatedNodes(screen)).toHaveLength(0);
    }
  });

  // Validade: o fundo continua configurável pelas telas que passam a cor.
  it('respeita o backgroundColor passado pela tela', () => {
    const screen = render(<StarfieldBackground backgroundColor="#abcdef" />);

    expect(backgroundOf(hostNodes(screen)[0])).toBe('#abcdef');
  });

  it('cobre a tela inteira e não captura toques', () => {
    const screen = render(<StarfieldBackground />);
    const container = hostNodes(screen)[0];

    expect(styleOf(container)).toMatchObject({
      position: 'absolute',
      top: 0,
      right: 0,
      bottom: 0,
      left: 0,
    });
    expect((container.props as { pointerEvents?: string }).pointerEvents).toBe('none');
  });
});
