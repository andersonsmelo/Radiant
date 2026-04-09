import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import type { JourneyNode, JourneyUnit } from '../../../types/journey';
import { SurfaceCard } from '../../../components/ui/SurfaceCard';
import { colors } from '../../../ui/theme';
import { space } from '../../../ui/styles';
import { JourneyNodeCard } from './JourneyNodeCard';
import { JourneyMapHeader } from './JourneyMapHeader';

type JourneyMapProps = {
  units: JourneyUnit[];
  recommendedNodeId?: string;
  onNodePress: (node: JourneyNode) => void;
  isNodeDisabled: (node: JourneyNode) => boolean;
};

export function JourneyMap({ units, recommendedNodeId, onNodePress, isNodeDisabled }: JourneyMapProps) {
  return (
    <SurfaceCard variant="elevated" style={styles.card}>
      <JourneyMapHeader
        title="Seu próximo trecho"
        subtitle="A trilha prioriza clareza no mobile e sempre destaca a melhor próxima ação."
      />

      {units.map((unit) => (
        <View key={unit.id} style={styles.unitSection}>
          <Text style={styles.unitTitle}>{unit.title}</Text>
          <View style={styles.mapShell}>
            <View style={styles.rail} />
            {unit.nodes.map((node, index) => (
              <JourneyNodeCard
                key={node.id}
                node={node}
                nodeIndex={index}
                isRecommended={node.id === recommendedNodeId}
                onPress={onNodePress}
                disabled={isNodeDisabled(node)}
              />
            ))}
          </View>
        </View>
      ))}
    </SurfaceCard>
  );
}

const styles = StyleSheet.create({
  card: {
    gap: space.s3,
  },
  unitSection: {
    gap: space.s2,
  },
  unitTitle: {
    fontSize: 16,
    lineHeight: 24,
    color: colors.textPrimary,
    fontWeight: '800',
  },
  mapShell: {
    position: 'relative',
    gap: space.s1,
    paddingVertical: space.s2,
  },
  rail: {
    position: 'absolute',
    left: '50%',
    top: 0,
    bottom: 0,
    width: 8,
    marginLeft: -4,
    borderRadius: 999,
    backgroundColor: colors.rail,
  },
});
