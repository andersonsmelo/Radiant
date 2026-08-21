import React from 'react';
import { StyleSheet } from 'react-native';
import { render } from '@testing-library/react-native';
import { JourneyTrailSpine } from './JourneyTrailSpine';
import { galaxyColors } from '../../../ui/theme';

function styleOf(screen: ReturnType<typeof render>) {
  return StyleSheet.flatten(
    screen.getByTestId('journey-spine', { includeHiddenElements: true }).props.style,
  );
}

describe('JourneyTrailSpine — os segmentos se encostam e formam uma linha só', () => {
  // O que este componente substitui: trechos pontilhados desenhados APENAS nas
  // folgas entre os nós. Mesmo sólidos, eles nasciam cortados — nas alturas dos
  // cartões não havia trecho nenhum. Aqui cada nó carrega o seu segmento, que
  // cobre a altura do cartão E transborda para dentro da folga seguinte. É o
  // transbordo que costura um segmento no outro: sem ele a linha volta a ser
  // uma sequência de tracinhos.

  it('transborda para a folga seguinte, para encostar no segmento de baixo', () => {
    expect(styleOf(render(<JourneyTrailSpine traveled position="middle" gap={12} />)).bottom).toBe(
      -12,
    );
  });

  it('começa na âncora do primeiro nó, e não acima dele', () => {
    // Sem isto a linha nasce um pedaço acima do primeiro cartão, solta.
    expect(styleOf(render(<JourneyTrailSpine traveled position="first" gap={12} />)).top).toBe('50%');
  });

  it('termina na âncora do último nó, e não abaixo dele', () => {
    const style = styleOf(render(<JourneyTrailSpine traveled={false} position="last" gap={12} />));

    expect(style.bottom).toBe('50%');
    expect(style.top).toBe(0);
  });

  it('um percurso de um nó só não desenha linha nenhuma', () => {
    // Não há o que ligar. Um segmento aqui seria um traço atravessando o único
    // cartão, sem começo nem fim.
    const screen = render(<JourneyTrailSpine traveled position="only" gap={12} />);

    expect(screen.queryByTestId('journey-spine', { includeHiddenElements: true })).toBeNull();
  });

  it('usa a cor de concluído no trecho andado e a do trilho no que falta', () => {
    expect(styleOf(render(<JourneyTrailSpine traveled position="middle" gap={12} />)).backgroundColor)
      .toBe(galaxyColors.nodeCompletedAccent);
    expect(
      styleOf(render(<JourneyTrailSpine traveled={false} position="middle" gap={12} />))
        .backgroundColor,
    ).toBe(galaxyColors.spine);
  });

  it('fica fora da árvore de acessibilidade — é sinal visual, não conteúdo', () => {
    const screen = render(<JourneyTrailSpine traveled position="middle" gap={12} />);
    const spine = screen.getByTestId('journey-spine', { includeHiddenElements: true });

    expect(spine.props.accessibilityElementsHidden).toBe(true);
    expect(spine.props.importantForAccessibility).toBe('no-hide-descendants');
  });
});
