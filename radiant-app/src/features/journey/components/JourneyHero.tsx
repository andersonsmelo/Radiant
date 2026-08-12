import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { PixelHeroSplit } from '../../../components/ui/PixelHeroSplit';
import { galaxyColors } from '../../../ui/theme';
import { radius, space, typography } from '../../../ui/styles';
import type { PixelExpression } from '../../../ui/characters/pixelExpressions';

type JourneyHeroProps = {
  unitTitle: string;
  dailyGoalCompleted: number;
  dailyGoalTarget: number;
  message: string;
  expression?: PixelExpression;
  trackLabel?: string;
};

export function JourneyHero({
  unitTitle,
  dailyGoalCompleted,
  dailyGoalTarget,
  message,
  expression,
  trackLabel = 'Jornada de Radiologia',
}: JourneyHeroProps) {
  return (
    <View style={styles.card}>
      <View style={styles.glowPrimary} />
      <View style={styles.glowSecondary} />
      <PixelHeroSplit
        eyebrow={trackLabel}
        message={message}
        ringValue={dailyGoalCompleted}
        ringTotal={dailyGoalTarget}
        ringLabel="Meta do dia"
        state="guide"
        tier="intermediate"
        accessibilityLabel="Pixel guiando a jornada"
        expression={expression}
      />
      <View style={styles.footerRow}>
        <Text style={styles.footerLabel}>Unidade ativa</Text>
        <Text style={styles.footerValue}>{unitTitle}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: galaxyColors.surface,
    borderRadius: radius.rLg,
    borderWidth: 1,
    borderColor: galaxyColors.border,
    padding: space.s3,
    paddingTop: space.s4,
    paddingBottom: space.s4,
    gap: space.s3,
    overflow: 'hidden',
  },
  glowPrimary: {
    position: 'absolute',
    top: -30,
    left: -30,
    width: 180,
    height: 180,
    borderRadius: 999,
    backgroundColor: galaxyColors.ctaGradientEnd,
    opacity: 0.08,
  },
  glowSecondary: {
    position: 'absolute',
    top: 10,
    right: -40,
    width: 220,
    height: 220,
    borderRadius: 999,
    backgroundColor: '#7B61FF',
    opacity: 0.06,
  },
  footerRow: {
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderRadius: radius.rLg,
    paddingHorizontal: space.s3,
    paddingVertical: space.s2,
    gap: 4,
  },
  footerLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: galaxyColors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  footerValue: {
    ...typography.h3,
    color: galaxyColors.textPrimary,
    fontSize: 22,
  },
});
