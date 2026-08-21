import React from 'react';
import { StyleSheet, View } from 'react-native';

import { galaxyColors } from '../../../ui/theme';

const DOT_COUNT = 4;
const DOTS = Array.from({ length: DOT_COUNT }, (_, index) => index);

type JourneyTrailConnectorProps = {
  /** O trecho já foi percorrido — o nó acima dele está concluído. */
  traveled: boolean;
};

/**
 * O trecho de caminho entre dois nós.
 *
 * A trilha desenhava âncoras soltas: cada nó lia como um cartão avulso, e nada
 * na tela dizia que eles formavam um percurso. Ligar um ao outro é metade do
 * conserto; a outra metade é a **cor**, que responde "onde eu estou" sem que
 * nenhum rótulo precise ser lido — o caminho vem preenchido de cima até a
 * posição do aluno e apagado dali para baixo.
 *
 * A fronteira entre as duas cores é a informação. Ela repete, na linha, o que a
 * âncora preenchida do `JourneyNodeCard` já faz no ponto: dois canais para o
 * mesmo fato, porque cor sozinha nunca carrega informação neste projeto — o
 * rótulo de cada nó continua dizendo "Concluído" ou "Bloqueado" por escrito.
 *
 * Pontilhado, e não linha cheia, por dois motivos: é o traçado da referência, e
 * uma linha cheia entre cartões alternados leria como borda de tabela.
 */
export function JourneyTrailConnector({ traveled }: JourneyTrailConnectorProps) {
  const color = traveled ? galaxyColors.nodeCompletedAccent : galaxyColors.spine;

  return (
    <View
      testID="journey-connector"
      style={styles.track}
      // Sinal visual, não conteúdo: a cor repete o rótulo do nó, e anunciá-la
      // faria o leitor de tela dizer "concluído" duas vezes por etapa.
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
    >
      {DOTS.map((index) => (
        <View
          key={index}
          testID={`journey-connector-dot-${index}`}
          style={[styles.dot, { backgroundColor: color }]}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  track: {
    position: 'absolute',
    left: '50%',
    marginLeft: -3,
    top: 0,
    bottom: 0,
    width: 6,
    alignItems: 'center',
    justifyContent: 'space-evenly',
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 999,
  },
});
