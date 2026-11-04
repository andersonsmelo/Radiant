import React from 'react';
import { StyleSheet, View } from 'react-native';
import Svg, { Path } from 'react-native-svg';

import { galaxyColors, medalColors } from '../../../ui/theme';
import {
  MEDAL_RADIUS,
  TRAIL_PATH_DASH,
  TRAIL_PATH_STROKE,
  incomingPath,
  outgoingPath,
} from './trailLayout';

type JourneyPathSegmentProps = {
  /** Deslocamento do nó de onde o trecho sai, a partir do centro da trilha. */
  fromX: number;
  /** Deslocamento do nó aonde o trecho chega, a partir do centro da trilha. */
  toX: number;
  height: number;
  /** O aluno já passou por aqui: o trecho chega a um nó até a posição dele. */
  traveled: boolean;
  /**
   * Um trecho entre dois nós vem em duas partes, uma em cada linha da lista:
   * `out` sai da lateral da medalha de cima e desce até a borda da linha; `in`
   * continua a descida no topo da linha de baixo até perto da medalha.
   */
  part: 'out' | 'in';
  /** Raio da medalha de onde o trecho sai (só `out`). */
  fromRadius?: number;
};

/**
 * O pontilhado que liga uma medalha à seguinte, como o `seg()` da prancheta:
 * sai da lateral de um nó e desce até o topo do seguinte. As duas partes se
 * encontram na mesma vertical e com o mesmo passo de pontos (`trailLayout`).
 *
 * Sinal visual, não conteúdo: o rótulo de cada medalha já diz o estado, e o
 * leitor de tela não deve ler o caminho.
 */
export function JourneyPathSegment({
  fromX,
  toX,
  height,
  traveled,
  part,
  fromRadius = MEDAL_RADIUS,
}: JourneyPathSegmentProps): React.ReactElement {
  const geometry = part === 'out'
    ? outgoingPath(fromX, toX, fromRadius, height)
    : incomingPath(toX, height);

  return (
    <View
      testID={`journey-path-${part}`}
      pointerEvents="none"
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
      style={[styles.box, { height: geometry.height }]}
    >
      <Svg
        width={geometry.width}
        height={geometry.height}
        style={[styles.svg, { marginLeft: geometry.left }]}
      >
        <Path
          d={geometry.d}
          fill="none"
          stroke={traveled ? medalColors.unit.face : galaxyColors.surfaceMuted}
          strokeWidth={TRAIL_PATH_STROKE}
          strokeLinecap="round"
          strokeDasharray={TRAIL_PATH_DASH}
          strokeDashoffset={geometry.dashOffset}
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
