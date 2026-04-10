import React, { useEffect, useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';

import { GamificationService } from '@/src/features/gamification/services/GamificationService';
import { StarfieldBackground } from '@/src/ui/components/StarfieldBackground';
import { HUD } from '@/src/ui/components/HUD';
import type { GamificationSnapshot } from '@/src/types/gamification';


const DAILY_QUESTS = [
  { id: 'q1', icon: '⚡', title: 'Completar 3 lições', xp: 30, target: 3, current: 1 },
  { id: 'q2', icon: '🔥', title: 'Manter sequência de 5 dias', xp: 50, target: 5, current: 3 },
  { id: 'q3', icon: '🎯', title: 'Acertar 10 questões seguidas', xp: 40, target: 10, current: 0 },
  { id: 'q4', icon: '🌌', title: 'Explorar um novo planeta', xp: 60, target: 1, current: 0 },
];

function HeartRefillTimer({ hearts, maxHearts }: { hearts: number; maxHearts: number }) {
  const [secondsLeft, setSecondsLeft] = useState<number | null>(null);

  useEffect(() => {
    if (hearts >= maxHearts) {
      setSecondsLeft(null);
      return;
    }
    // 30 min refill interval
    const REFILL_MS = 30 * 60 * 1000;
    const tick = () => {
      // We just show a countdown from 30 min for demo purposes
      // In prod, GamificationService.applyPassiveHeartRefill tracks real time
      setSecondsLeft((prev) => {
        if (prev === null) return REFILL_MS / 1000;
        if (prev <= 1) return REFILL_MS / 1000;
        return prev - 1;
      });
    };
    tick();
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, [hearts, maxHearts]);

  if (hearts >= maxHearts || secondsLeft === null) return null;

  const mins = Math.floor(secondsLeft / 60);
  const secs = secondsLeft % 60;
  const padded = `${mins}:${secs.toString().padStart(2, '0')}`;

  return (
    <View style={styles.refillTimer}>
      <Text style={styles.refillTimerText}>💗 Próximo coração em {padded}</Text>
    </View>
  );
}

function QuestCard({
  icon,
  title,
  xp,
  target,
  current,
}: (typeof DAILY_QUESTS)[number]) {
  const progress = Math.min(current / target, 1);
  const done = progress >= 1;
  const glowOpacity = useSharedValue(done ? 0.6 : 0);

  useEffect(() => {
    if (done) {
      glowOpacity.value = withRepeat(
        withSequence(withTiming(0.9, { duration: 900 }), withTiming(0.4, { duration: 900 })),
        -1,
        true,
      );
    }
  }, [done]);

  const glowStyle = useAnimatedStyle(() => ({
    shadowOpacity: glowOpacity.value,
  }));

  return (
    <Animated.View style={[styles.questCard, done && styles.questCardDone, glowStyle]}>
      <Text style={styles.questIcon}>{icon}</Text>
      <View style={styles.questInfo}>
        <Text style={[styles.questTitle, done && styles.questTitleDone]}>{title}</Text>
        <View style={styles.progressBar}>
          <View style={[styles.progressFill, { width: `${progress * 100}%` }, done && styles.progressFillDone]} />
        </View>
        <Text style={styles.questCount}>
          {current}/{target}
        </Text>
      </View>
      <View style={[styles.xpBadge, done && styles.xpBadgeDone]}>
        <Text style={styles.xpBadgeText}>+{xp} XP</Text>
      </View>
    </Animated.View>
  );
}

export default function MissionsScreen() {
  const [snapshot, setSnapshot] = useState<GamificationSnapshot | null>(null);

  useEffect(() => {
    GamificationService.getSnapshot().then(setSnapshot);
  }, []);

  const hearts = snapshot?.hearts ?? 5;
  const maxHearts = snapshot?.maxHearts ?? 5;

  return (
    <View style={styles.root}>
      <StarfieldBackground backgroundColor="#03030d" starCount={120} />
      <SafeAreaView style={styles.safe} edges={['top']}>
        <HUD
          totalXp={snapshot?.totalXp ?? 0}
          streakDays={snapshot?.streakDays ?? 0}
          hearts={hearts}
          maxHearts={maxHearts}
        />

        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Header */}
          <Text style={styles.screenTitle}>Missões</Text>
          <Text style={styles.screenSubtitle}>Missões diárias — renovam à meia-noite</Text>

          {/* Hearts status */}
          <View style={styles.heartsSection}>
            <View style={styles.heartsSectionHeader}>
              <Text style={styles.sectionTitle}>❤️ Vidas</Text>
              <HeartRefillTimer hearts={hearts} maxHearts={maxHearts} />
            </View>
            <View style={styles.heartsRow}>
              {Array.from({ length: maxHearts }).map((_, i) => (
                <Text key={i} style={styles.heartIcon}>
                  {i < hearts ? '❤️' : '🤍'}
                </Text>
              ))}
            </View>
            {hearts === 0 && (
              <View style={styles.heartsWarning}>
                <Text style={styles.heartsWarningText}>
                  Sem vidas! Aguarde o recarregamento ou complete revisões para continuar.
                </Text>
              </View>
            )}
          </View>

          {/* Daily quests */}
          <Text style={styles.sectionTitle}>⚡ Missões diárias</Text>
          <View style={styles.questList}>
            {DAILY_QUESTS.map((q) => (
              <QuestCard key={q.id} {...q} />
            ))}
          </View>

          {/* Upcoming */}
          <View style={styles.upcomingSection}>
            <Text style={styles.sectionTitle}>🔮 Em breve</Text>
            <Text style={styles.upcomingText}>
              Desafios semanais, torneios entre galáxias e conquistas especiais estão chegando.
            </Text>
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#03030d' },
  safe: { flex: 1 },
  scroll: { flex: 1 },
  scrollContent: { paddingHorizontal: 20, paddingBottom: 120 },

  screenTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: '#FFFFFF',
    marginTop: 16,
  },
  screenSubtitle: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.45)',
    marginTop: 4,
    marginBottom: 24,
  },

  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: 'rgba(255,255,255,0.85)',
    marginBottom: 12,
  },

  // Hearts
  heartsSection: {
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 16,
    padding: 16,
    marginBottom: 28,
  },
  heartsSectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  heartsRow: {
    flexDirection: 'row',
    gap: 8,
  },
  heartIcon: { fontSize: 24 },
  refillTimer: {
    backgroundColor: 'rgba(255,59,48,0.15)',
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  refillTimerText: {
    fontSize: 12,
    color: '#FF6B6B',
    fontWeight: '600',
  },
  heartsWarning: {
    marginTop: 12,
    backgroundColor: 'rgba(255,59,48,0.10)',
    borderRadius: 10,
    padding: 10,
  },
  heartsWarningText: {
    fontSize: 12,
    color: '#FF6B6B',
    lineHeight: 18,
  },

  // Quests
  questList: { gap: 12, marginBottom: 32 },
  questCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 14,
    padding: 14,
    gap: 12,
    shadowColor: 'transparent',
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 0 },
  },
  questCardDone: {
    backgroundColor: 'rgba(80,220,100,0.08)',
    shadowColor: '#50DC64',
  },
  questIcon: { fontSize: 28, width: 36, textAlign: 'center' },
  questInfo: { flex: 1 },
  questTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: 'rgba(255,255,255,0.9)',
    marginBottom: 6,
  },
  questTitleDone: { color: '#50DC64' },
  progressBar: {
    height: 4,
    backgroundColor: 'rgba(255,255,255,0.10)',
    borderRadius: 2,
    overflow: 'hidden',
    marginBottom: 4,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#2155FF',
    borderRadius: 2,
  },
  progressFillDone: { backgroundColor: '#50DC64' },
  questCount: {
    fontSize: 11,
    color: 'rgba(255,255,255,0.40)',
  },
  xpBadge: {
    backgroundColor: 'rgba(245,166,35,0.15)',
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  xpBadgeDone: { backgroundColor: 'rgba(80,220,100,0.20)' },
  xpBadgeText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#F5A623',
  },

  // Upcoming
  upcomingSection: {
    backgroundColor: 'rgba(255,255,255,0.03)',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.06)',
  },
  upcomingText: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.45)',
    lineHeight: 20,
  },
});
