import React from 'react';
import { StyleSheet, View } from 'react-native';

import type { JourneyNode } from '../../../types/journey';
import type { CurriculumSegment } from '../services/JourneyCurriculumService';
import { galaxyColors } from '../../../ui/theme';
import { space } from '../../../ui/styles';

/** Folga entre nós, e portanto altura do trecho de caminho que os liga. */
const TRAIL_GAP = space.s3;
import { JourneyLevelBand } from './JourneyLevelBand';
import { JourneyNodeCard } from './JourneyNodeCard';
import { JourneyTrailConnector } from './JourneyTrailConnector';

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

  /**
   * Até onde o caminho vem preenchido — **uma** fronteira, e não uma por nó.
   *
   * A primeira versão pintava cada trecho pelo estado do nó imediatamente
   * acima. No simulador isso saiu listrado — verde, cinza, verde, cinza —,
   * porque revisões bloqueadas se intercalam entre lições concluídas. E um
   * caminho listrado não responde "onde eu estou": a informação inteira está na
   * FRONTEIRA entre o percorrido e o pendente, e duas ou mais fronteiras não são
   * fronteira nenhuma.
   *
   * A posição é a do nó recomendado. Sem recomendação — trilha inteira
   * concluída, ou estado que o serviço não soube resolver —, cai no último nó
   * concluído, porque o caminho continua tendo que dizer até onde se chegou.
   */
  const flatNodes = segments.flatMap((segment) => segment.units.flatMap((unit) => unit.nodes));
  const recommendedIndex = flatNodes.findIndex((node) => node.id === recommendedNodeId);
  const lastCompletedIndex = flatNodes.reduce(
    (last, node, index) => (node.status === 'completed' ? index : last),
    -1,
  );
  const reachedIndex = recommendedIndex >= 0 ? recommendedIndex : lastCompletedIndex;

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
                // O trecho ACIMA deste nó já foi andado quando o nó está em cima
                // da posição alcançada, ou é ela própria.
                const traveled = nodeIndex <= reachedIndex;
                const connectorFor = nodeIndex > 0 ? node.id : null;

                return (
                  <View
                    key={node.id}
                    testID={`journey-trail-row-${node.id}`}
                    style={styles.row}
                    // O lado é dado de teste e de leitor de tela ao mesmo tempo:
                    // sem ele, a continuidade da alternância só seria verificável
                    // por snapshot de estilo, que quebra a cada ajuste visual.
                    accessibilityValue={{ text: alignRight ? 'direita' : 'esquerda' }}
                  >
                    {connectorFor ? (
                      <View
                        testID={`journey-connector-for-${connectorFor}`}
                        style={styles.connectorSlot}
                        accessibilityValue={{ text: traveled ? 'percorrido' : 'pendente' }}
                      >
                        <JourneyTrailConnector traveled={traveled} />
                      </View>
                    ) : null}

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
    gap: TRAIL_GAP,
  },
  row: {
    position: 'relative',
  },
  // O trecho de caminho ocupa a folga ACIMA do nó, na mesma coluna central onde
  // o `JourneyNodeCard` desenha a âncora. Reservar altura aqui, e não dentro do
  // conector, mantém o conector ignorante sobre o espaçamento da trilha.
  connectorSlot: {
    position: 'absolute',
    top: -TRAIL_GAP,
    left: 0,
    right: 0,
    height: TRAIL_GAP,
  },
});
