import React from 'react';
import { StyleSheet, View } from 'react-native';

import type { JourneyNode } from '../../../types/journey';
import type { CurriculumSegment } from '../services/JourneyCurriculumService';
import { galaxyColors } from '../../../ui/theme';
import { space } from '../../../ui/styles';
import { JourneyLevelBand } from './JourneyLevelBand';
import { JourneyNodeCard } from './JourneyNodeCard';

type JourneyTrailProps = {
  segments: CurriculumSegment[];
  recommendedNodeId?: string;
  onNodePress: (node: JourneyNode) => void;
  isNodeDisabled: (node: JourneyNode) => boolean;
};

/**
 * O currículo inteiro como UM caminho.
 *
 * Substitui o `JourneyMap`, que era `units.map(unit => <título> + <trilho
 * próprio>)` dentro de um card com borda: trechos separados, um por unidade,
 * com o título quebrando entre eles. Três coisas mudam, e nenhuma é cosmética:
 *
 * 1. **Um caminho só.** O título de unidade some do fluxo; o marco de trilha
 *    vira a `JourneyLevelBand`, que vive ao longo do caminho em vez de parti-lo.
 * 2. **O card sai.** O caminho fica direto sobre o fundo, sem moldura.
 * 3. **O índice de alternância é contínuo.** No `JourneyMap` ele reiniciava a
 *    cada unidade, então a primeira lição de toda unidade caía à esquerda e a
 *    costura entre unidades ficava visível. Aqui ele corre pelo percurso todo.
 *
 * **Gatilho de virtualização, para não voltar a ser decidido por palpite:**
 * quando o percurso passar de ~150 nós, ou quando a rolagem medir queda de
 * frame no simulador, troque o container por lista virtualizada e registre a
 * medição junto. Em 2026-08-21 o currículo tinha 30 lições.
 */
export function JourneyTrail({
  segments,
  recommendedNodeId,
  onNodePress,
  isNodeDisabled,
}: JourneyTrailProps) {
  // O índice atravessa unidades E segmentos: é o que faz o caminho ler como um
  // percurso só, e não como trechos costurados.
  let nodeIndex = -1;

  return (
    <View style={styles.trail} testID="journey-trail">
      {segments.map((segment, segmentIndex) => (
        <View key={segment.trackId} style={styles.segment}>
          {segmentIndex > 0 && (
            <JourneyLevelBand
              trackId={segment.trackId}
              trackTitle={segment.trackTitle}
              unlocked={segment.unlocked}
            />
          )}

          {segment.units.map((unit) => (
            <View key={unit.id} style={styles.unit}>
              {unit.nodes.map((node) => {
                nodeIndex += 1;
                const alignRight = nodeIndex % 2 === 1;

                return (
                  <View
                    key={node.id}
                    testID={`journey-trail-row-${node.id}`}
                    // O lado é dado de teste e de leitor de tela ao mesmo tempo:
                    // sem ele, a continuidade da alternância só seria verificável
                    // por snapshot de estilo, que quebra a cada ajuste visual.
                    accessibilityValue={{ text: alignRight ? 'direita' : 'esquerda' }}
                  >
                    <JourneyNodeCard
                      node={node}
                      nodeIndex={nodeIndex}
                      isRecommended={node.id === recommendedNodeId}
                      onPress={onNodePress}
                      disabled={isNodeDisabled(node)}
                    />
                  </View>
                );
              })}
            </View>
          ))}
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  trail: {
    // Sem card, sem borda: o caminho vive direto sobre o fundo.
    position: 'relative',
  },
  segment: {
    position: 'relative',
  },
  unit: {
    position: 'relative',
    gap: space.s1,
  },
  // O trilho reto central do JourneyMap não sobrevive: no caminho serpenteado a
  // ligação é feita pelo próprio alinhamento alternado dos nós e pela âncora que
  // cada `JourneyNodeCard` desenha na coluna central.
  spine: {
    backgroundColor: galaxyColors.spine,
  },
});
