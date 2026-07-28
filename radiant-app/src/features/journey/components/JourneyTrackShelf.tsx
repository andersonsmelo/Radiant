import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import type { LearningTrack, LessonCatalogSummary } from '../../content/content.types';
import { SurfaceCard } from '../../../components/ui/SurfaceCard';
import { galaxyColors } from '../../../ui/theme';
import { semanticColors } from '../../../ui/semantic-colors';
import { space, typography } from '../../../ui/styles';
import { JourneyTrackCard } from './JourneyTrackCard';

type JourneyTrackShelfProps = {
  tracks: LearningTrack[];
  lessons: LessonCatalogSummary[];
  activeTrackId: string;
  activeProgressPercent: number;
  onTrackPress: (track: LearningTrack) => void;
};

function countLessonsForTrack(track: LearningTrack, lessons: LessonCatalogSummary[]): number {
  const summaryCount = lessons.filter((lesson) => lesson.trackId === track.id).length;
  return summaryCount || track.lessonIds.length;
}

export function JourneyTrackShelf({
  tracks,
  lessons,
  activeTrackId,
  activeProgressPercent,
  onTrackPress,
}: JourneyTrackShelfProps) {
  if (tracks.length === 0) {
    return null;
  }

  return (
    <SurfaceCard variant="galaxy" contentStyle={styles.cardContent}>
      <View style={styles.header}>
        <Text style={styles.eyebrow}>Catálogo Radiant</Text>
        <Text style={styles.title}>Trilhas disponíveis</Text>
        <Text style={styles.subtitle}>
          A expansão já está organizada em trilhas. Continue a base ou explore os próximos blocos prontos.
        </Text>
      </View>

      <ScrollView
        testID="journey-track-shelf"
        horizontal
        showsHorizontalScrollIndicator={false}
        accessibilityLabel="Trilhas disponíveis do catálogo Radiant"
        contentContainerStyle={styles.trackList}
      >
        {tracks.map((track) => (
          <JourneyTrackCard
            key={track.id}
            track={track}
            lessonCount={countLessonsForTrack(track, lessons)}
            progressPercent={track.id === activeTrackId ? activeProgressPercent : 100}
            state={track.id === activeTrackId ? 'active' : 'available'}
            onPress={onTrackPress}
          />
        ))}
      </ScrollView>
    </SurfaceCard>
  );
}

const styles = StyleSheet.create({
  cardContent: {
    gap: space.s3,
  },
  header: {
    gap: space.s1,
  },
  eyebrow: {
    ...typography.micro,
    color: semanticColors.galaxy.statusInformation,
    fontWeight: '800',
    letterSpacing: 0.8,
    textTransform: 'uppercase',
  },
  title: {
    ...typography.h3,
    color: galaxyColors.textPrimary,
  },
  subtitle: {
    ...typography.bodyRegular,
    color: galaxyColors.textSecondary,
  },
  trackList: {
    gap: space.s2,
    paddingRight: space.s1,
  },
});
