import React from 'react';
import { StyleSheet, View } from 'react-native';

import { galaxyColors } from '../../../ui/theme';

/** Onde o nó está no percurso inteiro — decide onde a linha começa e termina. */
export type SpinePosition = 'first' | 'middle' | 'last' | 'only';

type JourneyTrailSpineProps = {
  /** O trecho já foi andado: o nó é a posição do aluno ou está acima dela. */
  traveled: boolean;
  position: SpinePosition;
  /** Folga entre nós — o quanto o segmento transborda para encostar no próximo. */
  gap: number;
};

const WIDTH = 6;

/**
 * O segmento de linha que cada nó carrega.
 *
 * **Substitui os trechos pontilhados que existiam só nas folgas entre os nós.**
 * Mesmo sólidos, eles nasciam cortados: nas alturas dos cartões não havia trecho
 * nenhum. Aqui o segmento cobre a altura do próprio cartão e **transborda** para
 * dentro da folga seguinte — é o transbordo que costura um segmento no outro, e
 * sem ele a linha volta a ser uma sequência de tracinhos.
 *
 * Por que segmento e não uma linha única com altura em porcentagem: os cartões
 * têm alturas diferentes — um título de três linhas é bem mais alto que um de
 * uma. Numa linha única, a fronteira do preenchimento cairia numa fração da
 * ALTURA total, que não corresponde à posição do nó atual, e o verde terminaria
 * visivelmente fora do lugar. Com um segmento por nó, a fronteira cai sempre
 * exatamente onde o aluno está.
 *
 * As pontas param nas âncoras do primeiro e do último nó. Cobrindo o container
 * inteiro, a linha sobraria como um traço solto acima do primeiro cartão e
 * abaixo do último.
 */
export function JourneyTrailSpine({ traveled, position, gap }: JourneyTrailSpineProps) {
  // Percurso de um nó só não tem o que ligar: a linha seria um traço atravessando
  // o único cartão, sem começo nem fim.
  if (position === 'only') return null;

  return (
    <View
      testID="journey-spine"
      pointerEvents="none"
      // Sinal visual, não conteúdo: a linha repete o que o rótulo de cada nó já
      // diz, e anunciá-la faria o leitor de tela dizer o mesmo duas vezes.
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
      style={[
        styles.spine,
        { backgroundColor: traveled ? galaxyColors.nodeCompletedAccent : galaxyColors.spine },
        position === 'first' ? styles.fromAnchor : styles.fromTop,
        position === 'last' ? styles.toAnchor : { bottom: -gap },
      ]}
    />
  );
}

const styles = StyleSheet.create({
  spine: {
    position: 'absolute',
    left: '50%',
    marginLeft: -WIDTH / 2,
    width: WIDTH,
  },
  fromTop: { top: 0 },
  fromAnchor: { top: '50%' },
  toAnchor: { bottom: '50%' },
});
