import React from 'react';
import { DecorativeIcon, type DecorativeIconName } from '../../../components/ui/DecorativeIcon';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import type { JourneyNode } from '../../../types/journey';
import { colors, shadows } from '../../../ui/theme';
import { radius, space, typography } from '../../../ui/styles';

type MaterialIconName = DecorativeIconName;

function getNodeCopy(node: JourneyNode): { icon: MaterialIconName; label: string } {
  switch (node.type) {
    case 'review':
      return { icon: 'refresh', label: 'Revisão' };
    case 'checkpoint':
      return { icon: 'verified', label: 'Checkpoint' };
    case 'reward':
      return { icon: 'emoji-events', label: 'Conquista' };
    default:
      return { icon: 'menu-book', label: 'Lição' };
  }
}

function getStatusCopy(node: JourneyNode) {
  switch (node.status) {
    case 'completed':
      return 'Concluído';
    case 'active':
      return 'Em andamento';
    case 'resumable':
      return 'Retomar';
    case 'due-review':
      return 'Revisar';
    case 'available':
      return 'Disponível';
    default:
      return 'Bloqueado';
  }
}

type JourneyNodeCardProps = {
  node: JourneyNode;
  nodeIndex: number;
  isRecommended: boolean;
  onPress: (node: JourneyNode) => void;
  disabled?: boolean;
};

export function JourneyNodeCard({
  node,
  nodeIndex,
  isRecommended,
  onPress,
  disabled = false,
}: JourneyNodeCardProps) {
  const meta = getNodeCopy(node);
  const alignRight = nodeIndex % 2 === 1;

  return (
    <View style={[styles.row, alignRight && styles.rowRight]}>
      <View style={styles.anchorColumn}>
        <View style={[styles.anchor, isRecommended && styles.recommendedRing, disabled && styles.anchorDisabled]} />
      </View>

      <Pressable
        onPress={() => onPress(node)}
        disabled={disabled}
        accessibilityRole="button"
        accessibilityLabel={`${node.title}. ${getStatusCopy(node)}.`}
        style={({ pressed }) => [
          styles.card,
          alignRight ? styles.cardRight : styles.cardLeft,
          isRecommended && styles.cardRecommended,
          disabled && styles.cardDisabled,
          pressed && !disabled && styles.cardPressed,
        ]}
      >
        <View style={styles.iconTile}>
          <DecorativeIcon name={meta.icon} size={22} color={colors.primary} />
        </View>

        <View style={styles.content}>
          <Text style={styles.typeLabel}>{meta.label}</Text>
          <Text style={styles.title}>{node.title}</Text>
          <Text style={styles.metaText}>{isRecommended ? 'Próximo passo' : getStatusCopy(node)}</Text>
        </View>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    minHeight: 122,
  },
  rowRight: {
    justifyContent: 'flex-end',
  },
  anchorColumn: {
    position: 'absolute',
    left: '50%',
    marginLeft: -10,
    top: 0,
    bottom: 0,
    width: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  anchor: {
    width: 18,
    height: 18,
    borderRadius: 999,
    backgroundColor: colors.surface,
    borderWidth: 4,
    borderColor: colors.primary,
    ...shadows.glow,
  },
  recommendedRing: {
    borderColor: colors.primary,
    shadowColor: colors.primary,
    shadowOpacity: 0.18,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 8 },
    elevation: 8,
  },
  anchorDisabled: {
    opacity: 0.45,
  },
  card: {
    width: '43%',
    minHeight: 96,
    backgroundColor: colors.surfaceGlass,
    borderRadius: radius.rLg,
    borderWidth: 1,
    borderColor: colors.borderSoft,
    padding: space.s2,
    gap: space.s2,
    flexDirection: 'row',
    alignItems: 'center',
  },
  cardLeft: {
    marginRight: '57%',
  },
  cardRight: {
    marginLeft: '57%',
  },
  cardRecommended: {
    borderColor: colors.primary,
    borderWidth: 2,
    backgroundColor: colors.surface,
    shadowColor: colors.primary,
    shadowOpacity: 0.12,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 12 },
    elevation: 12,
  },
  cardDisabled: {
    opacity: 0.5,
  },
  cardPressed: {
    transform: [{ scale: 0.98 }],
  },
  iconTile: {
    width: 44,
    height: 44,
    borderRadius: radius.rMd,
    backgroundColor: colors.surfaceStrong,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    flex: 1,
    gap: 2,
  },
  typeLabel: {
    ...typography.micro,
    color: colors.textTertiary,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  title: {
    ...typography.body,
    color: colors.textPrimary,
    fontWeight: '800',
  },
  metaText: {
    ...typography.caption,
    color: colors.textSecondary,
  },
});
