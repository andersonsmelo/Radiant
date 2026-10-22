import React from 'react';
import { StyleSheet, View } from 'react-native';
import Svg, { Path } from 'react-native-svg';

import { galaxyColors, medalColors } from '../../../ui/theme';

type JourneyPathSegmentProps = {
  /** Deslocamento do nó anterior, a partir do centro da trilha. */
  fromX: number;
  /** Deslocamento deste nó, a partir do centro da trilha. */
  toX: number;
  height: number;
  /** O aluno já passou por aqui: o trecho chega a um nó até a posição dele. */
  traveled: boolean;
};

// O pontilhado da prancheta: traço 10, intervalo 18, ponta redonda. Com a
// ponta redonda, o traço de 1 vira um ponto do diâmetro da linha.
const STROKE_WIDTH = 10;
const DASH = '1 18';

/**
 * O trecho pontilhado que desce do nó anterior até o topo deste. A curva
 * nasce na vertical sob o nó de cima e chega na vertical à medalha de baixo,
 * para o caminho se ler como uma linha só de uma linha da lista para a outra.
 *
 * Sinal visual, não conteúdo: o rótulo de cada medalha já diz o estado, e o
 * leitor de tela não deve ler o caminho.
 */
export function JourneyPathSegment({ fromX, toX, height, traveled }: JourneyPathSegmentProps): React.ReactElement {
  const half = STROKE_WIDTH / 2;
  const left = Math.min(fromX, toX) - half;
  const width = Math.abs(toX - fromX) + STROKE_WIDTH;
  const startX = fromX - left;
  const endX = toX - left;
  const startY = half;
  const endY = Math.max(half, height - half);
  const middleY = height / 2;

  return (
    <View
      testID="journey-path-segment"
      pointerEvents="none"
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
      style={[styles.box, { height }]}
    >
      <Svg width={width} height={height} style={[styles.svg, { marginLeft: left }]}>
        <Path
          d={`M${startX},${startY} C${startX},${middleY} ${endX},${middleY} ${endX},${endY}`}
          fill="none"
          stroke={traveled ? medalColors.unit.face : galaxyColors.surfaceMuted}
          strokeWidth={STROKE_WIDTH}
          strokeLinecap="round"
          strokeDasharray={DASH}
        />
      </Svg>
    </View>
  );
}

const styles = StyleSheet.create({
  box: { alignSelf: 'stretch' },
  // O centro da trilha é o meio da linha da lista; o desenho se posiciona a
  // partir dele, sem precisar saber a largura medida.
  svg: { position: 'absolute', top: 0, left: '50%' },
});
