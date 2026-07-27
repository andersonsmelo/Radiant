import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { StarfieldBackground } from '../../ui/components/StarfieldBackground';
import { AppButton } from '../../components/ui/AppButton';
import { space } from '../../ui/styles';
import { LessonCatalogService } from '../../features/content/services/LessonCatalogService';
import { DailyGoalService } from '../../features/daily-goal/services/DailyGoalService';

type TrackPreview = {
  id: string;
  title: string;
  lessonCount: number;
  emoji: string;
};

const TRACK_EMOJI: Record<string, string> = {
  'track-radiology-foundations': '🩻',
  'track-thorax-patterns': '🫁',
  'track-abdomen-essentials': '🫀',
};

export default function OnboardGoalScreen() {
  const [tracks, setTracks] = useState<TrackPreview[]>([]);
  const [goalPerDay, setGoalPerDay] = useState<number | null>(null);

  useEffect(() => {
    let active = true;

    void (async () => {
      try {
        await LessonCatalogService.bootstrap();
        const goal = await DailyGoalService.getSnapshot();
        if (!active) return;

        setTracks(
          LessonCatalogService.listTracks().map((track) => ({
            id: track.id,
            title: track.title,
            lessonCount: track.lessonIds?.length ?? 0,
            emoji: TRACK_EMOJI[track.id] ?? '🧠',
          }))
        );
        setGoalPerDay(goal.goalPerDay);
      } catch (error) {
        console.error('[OnboardGoalScreen] Failed to load catalog preview:', error);
      }
    })();

    return () => {
      active = false;
    };
  }, []);

  return (
    <View style={styles.root}>
      <StarfieldBackground starCount={40} />
      <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>

          <View style={styles.header}>
            <Text style={styles.eyebrow}>PASSO 3 DE 3</Text>
            <Text style={styles.headline}>O que te espera{'\n'}na sua jornada</Text>
            <Text style={styles.subtext}>
              Você começa pelos fundamentos e pode trocar de trilha quando quiser.
            </Text>
          </View>

          <View style={styles.trackList}>
            {tracks.map((track, index) => (
              <View
                key={track.id}
                style={[styles.trackItem, index === 0 && styles.trackItemFirst]}
                accessibilityRole="text"
                accessibilityLabel={
                  index === 0
                    ? `${track.title}, ${track.lessonCount} ${track.lessonCount === 1 ? 'lição' : 'lições'}. Você começa por aqui.`
                    : `${track.title}, ${track.lessonCount} ${track.lessonCount === 1 ? 'lição' : 'lições'}.`
                }
              >
                <View style={[styles.trackEmoji, index === 0 && styles.trackEmojiFirst]}>
                  <Text style={{ fontSize: 20 }}>{track.emoji}</Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.trackLabel}>{track.title}</Text>
                  <Text style={styles.trackSub}>
                    {track.lessonCount} {track.lessonCount === 1 ? 'lição' : 'lições'}
                  </Text>
                </View>
                {index === 0 && (
                  <View style={styles.startHereBadge}>
                    <Text style={styles.startHereText}>COMEÇA AQUI</Text>
                  </View>
                )}
              </View>
            ))}
          </View>

          {goalPerDay !== null && (
            <View style={styles.goalCard}>
              <Text style={styles.goalLabel}>SUA META DIÁRIA</Text>
              <Text style={styles.goalValue}>
                {goalPerDay === 1 ? '1 quiz por dia' : `${goalPerDay} quizzes por dia`}
              </Text>
              <Text style={styles.goalSub}>
                É o suficiente para manter a sequência viva. Leva cerca de cinco minutos.
              </Text>
            </View>
          )}

          <AppButton
            label="Começar a estudar"
            onPress={() => router.replace('/(tabs)')}
            variant="galaxy"
            style={{ marginTop: 24 }}
          />

          <View style={[styles.dots, { marginTop: 16, alignSelf: 'center' }]}>
            {[0,1,2].map(i => (
              <View key={i} style={[styles.dot, i === 2 && styles.dotActive]} />
            ))}
          </View>

        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#03030d' },
  safe: { flex: 1 },
  content: { padding: 20, paddingBottom: 56 },
  header: { marginBottom: 20 },
  eyebrow: {
    fontSize: 11, fontWeight: '800', color: '#3DCAE8',
    letterSpacing: 0.18, textTransform: 'uppercase',
  },
  headline: {
    fontSize: 26, fontWeight: '800', color: '#fff',
    letterSpacing: -0.02, lineHeight: 30, marginTop: 4,
  },
  subtext: {
    fontSize: 13, fontWeight: '500',
    color: 'rgba(255,255,255,0.55)', marginTop: 6,
  },
  trackList: { gap: 8, marginBottom: 24 },
  trackItem: {
    backgroundColor: 'rgba(255,255,255,0.04)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.10)',
    borderRadius: 16,
    padding: 12,
    paddingHorizontal: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  trackItemFirst: {
    backgroundColor: 'rgba(33,85,255,0.18)',
    borderColor: '#3DCAE8',
    shadowColor: '#3DCAE8',
    shadowOpacity: 0.5,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 0 },
  },
  trackEmoji: {
    width: 40, height: 40, borderRadius: 11,
    backgroundColor: 'rgba(255,255,255,0.06)',
    alignItems: 'center', justifyContent: 'center',
  },
  trackEmojiFirst: {
    backgroundColor: 'rgba(61,202,232,0.18)',
  },
  trackLabel: { fontSize: 15, fontWeight: '700', color: '#fff' },
  trackSub: { fontSize: 12, fontWeight: '500', color: 'rgba(255,255,255,0.5)', marginTop: 1 },
  startHereBadge: {
    backgroundColor: 'rgba(61,202,232,0.18)',
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  startHereText: {
    fontSize: 10, fontWeight: '800', color: '#3DCAE8', letterSpacing: 0.5,
  },
  goalCard: {
    backgroundColor: 'rgba(255,255,255,0.04)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.10)',
    borderRadius: 16,
    padding: 16,
  },
  goalLabel: {
    fontSize: 11, fontWeight: '800', color: 'rgba(255,255,255,0.5)',
    letterSpacing: 0.1, textTransform: 'uppercase', marginBottom: space.s1,
  },
  goalValue: { fontSize: 20, fontWeight: '800', color: '#fff' },
  goalSub: {
    fontSize: 12, fontWeight: '500',
    color: 'rgba(255,255,255,0.55)', marginTop: 4, lineHeight: 17,
  },
  dots: { flexDirection: 'row', gap: 6 },
  dot: { width: 6, height: 6, borderRadius: 3, backgroundColor: 'rgba(255,255,255,0.2)' },
  dotActive: { width: 22, backgroundColor: '#3DCAE8' },
});
