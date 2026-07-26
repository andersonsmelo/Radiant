import React from 'react';
import { DecorativeIcon, type DecorativeIconName } from '../../../components/ui/DecorativeIcon';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import type { LearningTrack } from '../../content/content.types';
import { colors, shadows } from '../../../ui/theme';
import { radius, space, typography } from '../../../ui/styles';

type MaterialIconName = DecorativeIconName;

type JourneyTrackState = 'active' | 'available';

type JourneyTrackCardProps = {
  track: LearningTrack;
  lessonCount: number;
  progressPercent: number;
  state: JourneyTrackState;
  onPress: (track: LearningTrack) => void;
};

function getTrackIcon(slug: string): MaterialIconName {
  if (slug.includes('torax')) {
    return 'air';
  }

  if (slug.includes('abdome')) {
    return 'center-focus-strong';
  }

  return 'auto-stories';
}

function getStateCopy(state: JourneyTrackState): string {
  return state === 'active' ? 'Em andamento' : 'Pronta';
}

export function JourneyTrackCard({ track, lessonCount, progressPercent, state, onPress }: JourneyTrackCardProps) {
  const isActive = state === 'active';

  return (
    <Pressable
      testID={`journey-track-${track.slug}`}
      onPress={() => onPress(track)}
      accessibilityRole="button"
      accessibilityLabel={`${track.title}. ${lessonCount} lições. ${getStateCopy(state)}. ${isActive ? `${progressPercent}% concluída.` : 'Catálogo pronto.'}`}
      accessibilityHint={isActive ? 'Abre o próximo passo elegível desta trilha.' : 'Troca para esta trilha e abre o próximo passo elegível.'}
      accessibilityState={{ selected: isActive }}
      style={({ pressed }) => [
        styles.card,
        isActive && styles.cardActive,
        pressed && styles.cardPressed,
      ]}
    >
      <View style={styles.header}>
        <View style={[styles.iconTile, isActive && styles.iconTileActive]}>
          <DecorativeIcon name={getTrackIcon(track.slug)} size={22} color={isActive ? '#FFFFFF' : colors.primary} />
        </View>
        <View style={[styles.badge, isActive ? styles.badgeActive : styles.badgeReady]}>
          <Text style={[styles.badgeText, isActive ? styles.badgeTextActive : styles.badgeTextReady]}>
            {getStateCopy(state)}
          </Text>
        </View>
      </View>

      <View style={styles.copy}>
        <Text style={styles.title}>{track.title}</Text>
        <Text style={styles.description} numberOfLines={2}>{track.description}</Text>
      </View>

      <View style={styles.footer}>
        <Text style={styles.meta}>{lessonCount} lições</Text>
        <Text style={styles.meta}>{isActive ? `${progressPercent}%` : 'catálogo pronto'}</Text>
      </View>

      <View style={styles.progressTrack}>
        <View
          style={[
            styles.progressFill,
            { width: `${isActive ? Math.max(8, progressPercent) : 100}%` },
            !isActive && styles.progressFillReady,
          ]}
        />
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    width: 250,
    minHeight: 188,
    borderRadius: radius.rXl,
    borderWidth: 1,
    borderColor: colors.borderSoft,
    backgroundColor: colors.surfaceGlass,
    padding: space.s3,
    gap: space.s3,
  },
  cardActive: {
    borderColor: colors.primary,
    backgroundColor: colors.surface,
    ...shadows.card,
  },
  cardPressed: {
    transform: [{ scale: 0.98 }],
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  iconTile: {
    width: 44,
    height: 44,
    borderRadius: radius.rMd,
    backgroundColor: colors.surfaceStrong,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconTileActive: {
    backgroundColor: colors.primary,
  },
  badge: {
    borderRadius: 999,
    paddingHorizontal: space.s2,
    paddingVertical: space.s0,
  },
  badgeActive: {
    backgroundColor: colors.highlight,
  },
  badgeReady: {
    backgroundColor: colors.successSoft,
  },
  badgeText: {
    ...typography.micro,
    fontWeight: '800',
  },
  badgeTextActive: {
    color: colors.primaryStrong,
  },
  badgeTextReady: {
    color: colors.success,
  },
  copy: {
    gap: space.s1,
  },
  title: {
    ...typography.h3,
    color: colors.textPrimary,
  },
  description: {
    ...typography.caption,
    color: colors.textSecondary,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: space.s2,
  },
  meta: {
    ...typography.micro,
    color: colors.textTertiary,
  },
  progressTrack: {
    height: 8,
    borderRadius: 999,
    backgroundColor: colors.surfaceStrong,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 999,
    backgroundColor: colors.primary,
  },
  progressFillReady: {
    backgroundColor: colors.success,
  },
});
