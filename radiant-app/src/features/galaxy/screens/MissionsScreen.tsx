import React, { useEffect, useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import Svg, { Circle, Path } from 'react-native-svg';

import { GamificationService } from '@/src/features/gamification/services/GamificationService';
import type { GamificationSnapshot } from '@/src/types/gamification';

// ─── Data ────────────────────────────────────────────────────────────────────

const DAILY_MISSIONS = [
  { id: 'd1', title: 'Earn 100 XP today',    cur: 65, goal: 100, xp: 30,  icon: '⚡' },
  { id: 'd2', title: 'Answer 3 in a row',     cur: 3,  goal: 3,  xp: 15,  icon: '🎯', done: true },
  { id: 'd3', title: 'Complete 1 lesson',     cur: 0,  goal: 1,  xp: 25,  icon: '🧠' },
];

const WEEKLY_MISSIONS = [
  { id: 'w1', title: 'Maintain a 7-day streak', cur: 6, goal: 7, xp: 100, icon: '🔥' },
  { id: 'w2', title: 'Master 3 new topics',     cur: 1, goal: 3, xp: 150, icon: '⭐' },
];

// ─── HeartRefillTimer (preserved) ────────────────────────────────────────────

function HeartRefillTimer({ hearts, maxHearts }: { hearts: number; maxHearts: number }) {
  const [secondsLeft, setSecondsLeft] = useState<number | null>(null);

  useEffect(() => {
    if (hearts >= maxHearts) {
      setSecondsLeft(null);
      return;
    }
    const REFILL_MS = 30 * 60 * 1000;
    const tick = () => {
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
      <Text style={styles.refillTimerText}>💗 Next heart in {padded}</Text>
    </View>
  );
}

// ─── XP Badge (shared) ───────────────────────────────────────────────────────

function XpBadge({ xp }: { xp: number }) {
  return (
    <View style={styles.xpBadge}>
      <Text style={styles.xpBadgeText}>+{xp}</Text>
    </View>
  );
}

// ─── MissionCard ─────────────────────────────────────────────────────────────

type Mission = {
  id: string;
  title: string;
  cur: number;
  goal: number;
  xp: number;
  icon: string;
  done?: boolean;
};

function MissionCard({ title, cur, goal, xp, icon, done }: Mission) {
  const isDone = done === true || cur >= goal;
  const fillRatio = Math.min(cur / goal, 1);

  return (
    <View style={[styles.missionCard, isDone && { opacity: 0.7 }]}>
      {/* Left icon box */}
      <View style={[styles.missionIconBox, isDone ? styles.missionIconBoxDone : styles.missionIconBoxPending]}>
        <Text style={styles.missionIconText}>{isDone ? '✓' : icon}</Text>
      </View>

      {/* Right content */}
      <View style={styles.missionContent}>
        {/* Title row */}
        <View style={styles.missionTitleRow}>
          <Text
            style={[
              styles.missionTitle,
              isDone && styles.missionTitleDone,
            ]}
            numberOfLines={1}
          >
            {title}
          </Text>
          <XpBadge xp={xp} />
        </View>

        {/* Progress bar */}
        <View style={styles.progressTrack}>
          <View style={{ flex: fillRatio, borderRadius: 4, overflow: 'hidden', height: 8 }}>
            <LinearGradient
              colors={isDone ? ['#1A9C71', '#20B484'] : ['#2155FF', '#3DCAE8']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={{ flex: 1 }}
            />
          </View>
          {fillRatio < 1 && (
            <View style={{ flex: 1 - fillRatio }} />
          )}
        </View>

        {/* Progress label */}
        <Text style={styles.progressLabel}>{cur} / {goal}</Text>
      </View>
    </View>
  );
}

// ─── Screen ──────────────────────────────────────────────────────────────────

export default function MissionsScreen() {
  const [snapshot, setSnapshot] = useState<GamificationSnapshot | null>(null);

  useEffect(() => {
    GamificationService.getSnapshot().then(setSnapshot);
  }, []);

  const hearts = snapshot?.hearts ?? 5;
  const maxHearts = snapshot?.maxHearts ?? 5;

  const dailyDoneCount = DAILY_MISSIONS.filter(
    (m) => m.done === true || m.cur >= m.goal,
  ).length;

  return (
    <View style={styles.root}>
      <SafeAreaView style={styles.safe} edges={['top']}>
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* ── Header ── */}
          <View style={styles.headerRow}>
            <View>
              <Text style={styles.headerLabel}>MISSIONS</Text>
              <Text style={styles.headerTitle}>Desafios de hoje</Text>
            </View>
            {/* Clock badge */}
            <View style={styles.clockBadge}>
              <Svg width={11} height={11} viewBox="0 0 11 11">
                <Circle cx="5.5" cy="5.5" r="4.5" stroke="#2155FF" strokeWidth="1.4" fill="none" />
                <Path d="M5.5 3v3l2 1" stroke="#2155FF" strokeWidth="1.4" strokeLinecap="round" fill="none" />
              </Svg>
              <Text style={styles.clockText}>14h 22m</Text>
            </View>
          </View>

          {/* ── Streak banner ── */}
          <View style={styles.streakShadowWrapper}>
            <LinearGradient
              colors={['#FF8A4C', '#FF6B2C']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.streakBanner}
            >
              <View style={styles.streakIconBox}>
                <Text style={styles.streakEmoji}>🔥</Text>
              </View>
              <View style={styles.streakTextCol}>
                <Text style={styles.streakTitle}>Complete all 3 to keep your streak</Text>
                <Text style={styles.streakSubtitle}>Streak shield expires at midnight</Text>
              </View>
            </LinearGradient>
          </View>

          {/* ── Daily section header ── */}
          <View style={styles.sectionHeaderRow}>
            <Text style={styles.sectionLabel}>
              DAILY · {dailyDoneCount}/{DAILY_MISSIONS.length} DONE
            </Text>
            <View style={styles.xpBadge}>
              <Text style={styles.xpBadgeText}>+70 XP TOTAL</Text>
            </View>
          </View>

          {/* ── Daily missions ── */}
          <View style={styles.missionList}>
            {DAILY_MISSIONS.map((m) => (
              <MissionCard key={m.id} {...m} />
            ))}
          </View>

          {/* ── Weekly section header ── */}
          <View style={styles.sectionHeaderRow}>
            <Text style={styles.sectionLabel}>THIS WEEK</Text>
            <Text style={styles.sectionRight}>3d left</Text>
          </View>

          {/* ── Weekly missions ── */}
          <View style={styles.missionList}>
            {WEEKLY_MISSIONS.map((m) => (
              <MissionCard key={m.id} {...m} />
            ))}
          </View>

          {/* ── Hearts footer (preserved) ── */}
          <View style={styles.heartsSection}>
            <View style={styles.heartsSectionHeader}>
              <Text style={styles.heartsSectionTitle}>❤️ Lives</Text>
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
                  No lives left! Wait for a refill or complete reviews to continue.
                </Text>
              </View>
            )}
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#F5FAFF' },
  safe: { flex: 1 },
  scroll: { flex: 1 },
  scrollContent: { paddingHorizontal: 20, paddingBottom: 120 },

  // Header
  headerRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  headerLabel: {
    fontSize: 11,
    fontWeight: '800',
    color: '#93A0B8',
    letterSpacing: 0.08 * 11,
    textTransform: 'uppercase',
  },
  headerTitle: {
    fontSize: 26,
    fontWeight: '800',
    color: '#14233F',
    letterSpacing: -0.02 * 26,
    marginTop: 2,
  },
  clockBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#E3ECF7',
    paddingHorizontal: 10,
    paddingVertical: 6,
    marginTop: 4,
  },
  clockText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#5B6B85',
  },

  // Streak banner
  streakShadowWrapper: {
    marginTop: 14,
    borderRadius: 18,
    shadowColor: '#FF6B2C',
    shadowOpacity: 0.55,
    shadowRadius: 30,
    shadowOffset: { width: 0, height: 14 },
    elevation: 12,
  },
  streakBanner: {
    borderRadius: 18,
    overflow: 'hidden',
    paddingVertical: 14,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  streakIconBox: {
    width: 48,
    height: 48,
    borderRadius: 14,
    backgroundColor: 'rgba(255,255,255,0.22)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  streakEmoji: { fontSize: 28 },
  streakTextCol: { flex: 1 },
  streakTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: -0.01 * 16,
  },
  streakSubtitle: {
    fontSize: 12,
    fontWeight: '600',
    color: 'rgba(255,255,255,0.85)',
    marginTop: 1,
  },

  // Section headers
  sectionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 18,
    marginBottom: 8,
  },
  sectionLabel: {
    fontSize: 11,
    fontWeight: '800',
    color: '#93A0B8',
    textTransform: 'uppercase',
    letterSpacing: 0.08 * 11,
  },
  sectionRight: {
    fontSize: 11,
    fontWeight: '600',
    color: '#5B6B85',
  },

  // XP badge (reused for both section badge and card badge)
  xpBadge: {
    backgroundColor: 'rgba(245,166,35,0.12)',
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderWidth: 1,
    borderColor: 'rgba(245,166,35,0.25)',
  },
  xpBadgeText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#F5A623',
  },

  // Mission cards
  missionList: { gap: 10 },
  missionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: '#E3ECF7',
    shadowColor: '#14233F',
    shadowOpacity: 0.06,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  missionIconBox: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  missionIconBoxDone: {
    backgroundColor: '#1A9C71',
    borderColor: '#1A9C71',
  },
  missionIconBoxPending: {
    backgroundColor: 'rgba(33,85,255,0.10)',
    borderColor: 'rgba(33,85,255,0.18)',
  },
  missionIconText: { fontSize: 20 },
  missionContent: { flex: 1 },
  missionTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
    marginBottom: 6,
  },
  missionTitle: {
    flex: 1,
    fontSize: 14,
    fontWeight: '700',
    color: '#14233F',
  },
  missionTitleDone: {
    textDecorationLine: 'line-through',
    textDecorationColor: '#93A0B8',
  },

  // Progress bar
  progressTrack: {
    flexDirection: 'row',
    height: 8,
    borderRadius: 4,
    backgroundColor: '#EAF2FF',
    overflow: 'hidden',
  },
  progressLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: '#5B6B85',
    marginTop: 4,
  },

  // Hearts (preserved)
  heartsSection: {
    backgroundColor: 'rgba(20,35,63,0.04)',
    borderRadius: 16,
    padding: 16,
    marginTop: 24,
    borderWidth: 1,
    borderColor: '#E3ECF7',
  },
  heartsSectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  heartsSectionTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#14233F',
  },
  heartsRow: {
    flexDirection: 'row',
    gap: 8,
  },
  heartIcon: { fontSize: 22 },
  refillTimer: {
    backgroundColor: 'rgba(255,59,48,0.10)',
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
    backgroundColor: 'rgba(255,59,48,0.08)',
    borderRadius: 10,
    padding: 10,
  },
  heartsWarningText: {
    fontSize: 12,
    color: '#FF6B6B',
    lineHeight: 18,
  },
});
