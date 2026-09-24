import React, { useMemo } from 'react';
import { FlatList, StyleSheet, View } from 'react-native';

import type { JourneyNode, NextNodeDecision } from '../../../types/journey';
import type { CurriculumSegment } from '../services/JourneyCurriculumService';
import { space } from '../../../ui/styles';
import { JourneyLevelBand } from './JourneyLevelBand';
import { JourneyNodeCard } from './JourneyNodeCard';
import { JourneyTrailSpine, type SpinePosition } from './JourneyTrailSpine';

const TRAIL_GAP = space.s3;

type JourneyTrailProps = {
  segments: CurriculumSegment[];
  recommendedNodeId?: string;
  recommendationReason?: NextNodeDecision['reason'];
  dueReviewCount?: number;
  onNodePress: (node: JourneyNode) => void;
  isNodeDisabled: (node: JourneyNode) => boolean;
  /** Rola junto com a trilha. A tela usa com texto grande (achado 2 do gate H4). */
  header?: React.ReactElement;
};

type TrailBandItem = {
  kind: 'band';
  key: string;
  segment: CurriculumSegment;
};

type TrailNodeItem = {
  kind: 'node';
  key: string;
  node: JourneyNode;
  nodeIndex: number;
  traveled: boolean;
  position: SpinePosition;
};

type TrailItem = TrailBandItem | TrailNodeItem;

function flattenTrail(segments: CurriculumSegment[], recommendedNodeId?: string): TrailItem[] {
  const flatNodes = segments.flatMap(segment => segment.units.flatMap(unit => unit.nodes));
  const lastIndex = flatNodes.length - 1;
  const recommendedIndex = flatNodes.findIndex(node => node.id === recommendedNodeId);
  const lastCompletedIndex = flatNodes.reduce(
    (last, node, index) => (node.status === 'completed' ? index : last),
    -1,
  );
  const reachedIndex = recommendedIndex >= 0 ? recommendedIndex : lastCompletedIndex;
  const items: TrailItem[] = [];
  let nodeIndex = 0;

  segments.forEach((segment, segmentIndex) => {
    if (segmentIndex > 0) {
      items.push({ kind: 'band', key: `band:${segment.trackId}`, segment });
    }

    segment.units.forEach(unit => {
      unit.nodes.forEach(node => {
        const position: SpinePosition = lastIndex === 0
          ? 'only'
          : nodeIndex === 0
            ? 'first'
            : nodeIndex === lastIndex
              ? 'last'
              : 'middle';
        items.push({
          kind: 'node',
          key: `node:${node.id}`,
          node,
          nodeIndex,
          traveled: nodeIndex <= reachedIndex,
          position,
        });
        nodeIndex += 1;
      });
    });
  });

  return items;
}

/**
 * Percurso único e virtualizado. Bandas e nós compartilham a mesma lista para
 * preservar a ordem e as chaves estáveis mesmo quando o currículo crescer.
 */
export function JourneyTrail({
  segments,
  recommendedNodeId,
  recommendationReason,
  dueReviewCount = 0,
  onNodePress,
  isNodeDisabled,
  header,
}: JourneyTrailProps) {
  const items = useMemo(
    () => flattenTrail(segments, recommendedNodeId),
    [segments, recommendedNodeId],
  );

  return (
    <FlatList
      testID="journey-trail"
      data={items}
      keyExtractor={item => item.key}
      initialNumToRender={12}
      windowSize={7}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.trail}
      ListHeaderComponent={header}
      renderItem={({ item }) => {
        if (item.kind === 'band') {
          return (
            <JourneyLevelBand
              trackId={item.segment.trackId}
              trackTitle={item.segment.trackTitle}
              unlocked={item.segment.unlocked}
            />
          );
        }

        const alignRight = item.nodeIndex % 2 === 1;
        return (
          <View
            testID={`journey-trail-row-${item.node.id}`}
            style={styles.row}
            accessibilityValue={{ text: alignRight ? 'direita' : 'esquerda' }}
          >
            <JourneyTrailSpine
              traveled={item.traveled}
              position={item.position}
              gap={TRAIL_GAP}
            />
            <JourneyNodeCard
              node={item.node}
              nodeIndex={item.nodeIndex}
              isRecommended={item.node.id === recommendedNodeId}
              recommendationReason={recommendationReason}
              dueReviewCount={dueReviewCount}
              onPress={onNodePress}
              disabled={isNodeDisabled(item.node)}
            />
          </View>
        );
      }}
    />
  );
}

const styles = StyleSheet.create({
  trail: {
    position: 'relative',
    gap: TRAIL_GAP,
    paddingBottom: space.s3,
  },
  row: { position: 'relative' },
});
