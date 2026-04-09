import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { PixelHeroSplit } from '../../../components/ui/PixelHeroSplit';
import { SurfaceCard } from '../../../components/ui/SurfaceCard';
import { colors } from '../../../ui/theme';
import { radius, space, typography } from '../../../ui/styles';

type JourneyHeroProps = {
  unitTitle: string;
  dailyGoalCompleted: number;
  dailyGoalTarget: number;
  message: string;
  trackLabel?: string;
};

export function JourneyHero({
  unitTitle,
  dailyGoalCompleted,
  dailyGoalTarget,
  message,
  trackLabel = 'Radiology Journey',
}: JourneyHeroProps) {
  return (
    <SurfaceCard variant="glass" style={styles.card}>
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
      />

      <View style={styles.footerRow}>
        <Text style={styles.footerLabel}>Unidade ativa</Text>
        <Text style={styles.footerValue}>{unitTitle}</Text>
      </View>
    </SurfaceCard>
  );
}

const styles = StyleSheet.create({
  card: {
    overflow: 'hidden',
    gap: space.s3,
    paddingTop: space.s4,
    paddingBottom: space.s4,
  },
  glowPrimary: {
    position: 'absolute',
    top: -30,
    left: -30,
    width: 180,
    height: 180,
    borderRadius: 999,
    backgroundColor: colors.highlight,
    opacity: 0.75,
  },
  glowSecondary: {
    position: 'absolute',
    top: 10,
    right: -40,
    width: 220,
    height: 220,
    borderRadius: 999,
    backgroundColor: colors.accent,
    opacity: 0.18,
  },
  footerRow: {
    backgroundColor: 'rgba(255,255,255,0.58)',
    borderRadius: radius.rLg,
    paddingHorizontal: space.s3,
    paddingVertical: space.s2,
    gap: 4,
  },
  footerLabel: {
    ...typography.caption,
    color: colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  footerValue: {
    ...typography.h3,
    color: colors.textPrimary,
    fontSize: 22,
  },
});
