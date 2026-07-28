import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import Svg, { Circle, Path } from 'react-native-svg';

import { GamificationService } from '@/src/features/gamification/services/GamificationService';
import { DailyGoalService } from '@/src/features/daily-goal/services/DailyGoalService';
import { SpacedRepetitionService } from '@/src/features/spaced-repetition/services/SpacedRepetitionService';
import type { GamificationSnapshot } from '@/src/types/gamification';
import type { DailyGoalSnapshot } from '@/src/types/dailyGoal';
import { formatLocalDateKey } from '@/src/constants/dailyGoal';
import { galaxyColors } from '@/src/ui/theme';
import { semanticColors } from '@/src/ui/semantic-colors';
import { space, tabBarClearance, typography } from '@/src/ui/styles';
import { AnimatedProgressBar } from '@/src/components/ui/AnimatedProgressBar';

const galaxy = semanticColors.galaxy;

// ─── Relógio real até o reset do dia ─────────────────────────────────────────

function msUntilMidnight(now: Date): number {
  const midnight = new Date(now);
  midnight.setHours(24, 0, 0, 0);
  return midnight.getTime() - now.getTime();
}

function formatHoursMinutes(ms: number): string {
  const totalMinutes = Math.max(0, Math.floor(ms / 60000));
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  return `${hours}h ${minutes.toString().padStart(2, '0')}m`;
}

function useDailyResetCountdown(): string {
  const [label, setLabel] = useState(() => formatHoursMinutes(msUntilMidnight(new Date())));

  useEffect(() => {
    const tick = () => setLabel(formatHoursMinutes(msUntilMidnight(new Date())));
    const interval = setInterval(tick, 60_000);
    return () => clearInterval(interval);
  }, []);

  return label;
}

// ─── HeartRefillTimer (recarga real do GamificationService) ──────────────────

function HeartRefillTimer({
  nextRefillAt,
  onElapsed,
}: {
  nextRefillAt: string | null | undefined;
  onElapsed: () => void;
}) {
  const [secondsLeft, setSecondsLeft] = useState<number | null>(null);

  useEffect(() => {
    if (!nextRefillAt) {
      setSecondsLeft(null);
      return;
    }

    const target = new Date(nextRefillAt).getTime();
    let elapsedFired = false;

    const tick = () => {
      const remaining = Math.ceil((target - Date.now()) / 1000);
      if (remaining <= 0) {
        setSecondsLeft(0);
        if (!elapsedFired) {
          elapsedFired = true;
          onElapsed();
        }
        return;
      }
      setSecondsLeft(remaining);
    };

    tick();
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, [nextRefillAt, onElapsed]);

  if (!nextRefillAt || secondsLeft === null || secondsLeft <= 0) return null;

  const mins = Math.floor(secondsLeft / 60);
  const secs = secondsLeft % 60;
  const padded = `${mins}:${secs.toString().padStart(2, '0')}`;

  return (
    <View style={styles.refillTimer}>
      <Text style={styles.refillTimerText}>💗 Próximo coração em {padded}</Text>
    </View>
  );
}

// ─── MissionCard ─────────────────────────────────────────────────────────────

type Mission = {
  id: string;
  title: string;
  icon: string;
  done: boolean;
  /** Progresso numérico real; omitido para missões binárias */
  progress?: { cur: number; goal: number };
  /** Linha de detalhe quando não há fração de progresso */
  detail?: string;
};

function MissionCard({ title, icon, done, progress, detail }: Mission) {
  const fillRatio = progress ? Math.min(progress.cur / Math.max(progress.goal, 1), 1) : done ? 1 : 0;
  const progressLabel = progress ? `${progress.cur} / ${progress.goal}` : detail;

  return (
    <View
      style={[styles.missionCard, done && { opacity: 0.7 }]}
      accessibilityRole="text"
      accessibilityLabel={`${title}. ${done ? 'Concluída.' : progressLabel ?? 'Pendente.'}`}
    >
      {/* Left icon box */}
      <View style={[styles.missionIconBox, done ? styles.missionIconBoxDone : styles.missionIconBoxPending]}>
        <Text style={[styles.missionIconText, done && styles.missionCheckText]}>{done ? '✓' : icon}</Text>
      </View>

      {/* Right content */}
      <View style={styles.missionContent}>
        <Text
          style={[styles.missionTitle, done && styles.missionTitleDone]}
          numberOfLines={1}
        >
          {title}
        </Text>

        {/* Progresso da missão: anima ao avançar em vez de saltar. */}
        <AnimatedProgressBar
          ratio={fillRatio}
          colors={
            done
              ? ['#34C88F', galaxy.statusSuccess]
              : [galaxyColors.ctaGradientEnd, galaxy.statusInformation]
          }
          accessibilityLabel={progressLabel ? `${title}: ${progressLabel}` : title}
        />

        {/* Progress label */}
        {progressLabel ? <Text style={styles.progressLabel}>{progressLabel}</Text> : null}
      </View>
    </View>
  );
}

// ─── Screen ──────────────────────────────────────────────────────────────────

export default function MissionsScreen() {
  const [snapshot, setSnapshot] = useState<GamificationSnapshot | null>(null);
  const [dailyGoal, setDailyGoal] = useState<DailyGoalSnapshot | null>(null);
  const [dueCount, setDueCount] = useState<number | null>(null);

  const resetCountdown = useDailyResetCountdown();

  const load = useCallback(async () => {
    try {
      const [gamification, goal, due] = await Promise.all([
        GamificationService.getSnapshot(),
        DailyGoalService.getSnapshot(),
        SpacedRepetitionService.getDueCount(),
      ]);
      setSnapshot(gamification);
      setDailyGoal(goal);
      setDueCount(due);
    } catch (error) {
      console.error('[MissionsScreen] Failed to load mission data:', error);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  useFocusEffect(
    useCallback(() => {
      void load();
    }, [load])
  );

  const hearts = snapshot?.hearts ?? 5;
  const maxHearts = snapshot?.maxHearts ?? 5;
  const streakDays = snapshot?.streakDays ?? 0;

  const studiedToday = useMemo(() => {
    const todayKey = formatLocalDateKey(new Date());
    return (
      (dailyGoal?.completedToday ?? 0) > 0 ||
      snapshot?.lastActiveDate === todayKey
    );
  }, [dailyGoal?.completedToday, snapshot?.lastActiveDate]);

  const missions = useMemo<Mission[]>(() => {
    const list: Mission[] = [];

    if (dailyGoal) {
      list.push({
        id: 'daily-goal',
        title:
          dailyGoal.goalPerDay === 1
            ? 'Complete 1 quiz hoje'
            : `Complete ${dailyGoal.goalPerDay} quizzes hoje`,
        icon: '⚡',
        done: dailyGoal.isCompleted,
        progress: { cur: dailyGoal.completedToday, goal: dailyGoal.goalPerDay },
      });
    }

    if (dueCount !== null) {
      list.push({
        id: 'reviews',
        title: 'Deixe as revisões em dia',
        icon: '🎯',
        done: dueCount === 0,
        detail:
          dueCount === 0
            ? 'Nenhuma revisão pendente'
            : `${dueCount} ${dueCount === 1 ? 'revisão pendente' : 'revisões pendentes'} agora`,
      });
    }

    list.push({
      id: 'streak',
      title:
        streakDays > 1
          ? `Proteja a sequência de ${streakDays} dias`
          : 'Comece uma sequência hoje',
      icon: '🔥',
      done: studiedToday,
      detail: studiedToday
        ? 'Protegida por hoje'
        : 'Complete um quiz para proteger',
    });

    return list;
  }, [dailyGoal, dueCount, streakDays, studiedToday]);

  const doneCount = missions.filter((m) => m.done).length;

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
              <Text style={styles.headerLabel}>MISSÕES</Text>
              <Text style={styles.headerTitle} accessibilityRole="header">Desafios de hoje</Text>
            </View>
            {/* Tempo real até o reset diário (meia-noite local) */}
            <View
              style={styles.clockBadge}
              accessibilityLabel={`O dia reinicia em ${resetCountdown}`}
            >
              <Svg width={11} height={11} viewBox="0 0 11 11">
                <Circle cx="5.5" cy="5.5" r="4.5" stroke={galaxyColors.xpColor} strokeWidth="1.4" fill="none" />
                <Path d="M5.5 3v3l2 1" stroke={galaxyColors.xpColor} strokeWidth="1.4" strokeLinecap="round" fill="none" />
              </Svg>
              <Text style={styles.clockText}>{resetCountdown}</Text>
            </View>
          </View>

          {/* ── Streak banner (estado real) ── */}
          <View style={[styles.streakShadowWrapper, studiedToday && styles.streakShadowWrapperCalm]}>
            <LinearGradient
              colors={studiedToday ? ['#1535E8', '#3060FF'] : ['#FF8A4C', '#FF6B2C']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.streakBanner}
            >
              <View style={styles.streakIconBox}>
                <Text style={styles.streakEmoji}>{studiedToday ? '✨' : '🔥'}</Text>
              </View>
              <View style={styles.streakTextCol}>
                <Text style={styles.streakTitle}>
                  {studiedToday
                    ? streakDays > 1
                      ? `Sequência de ${streakDays} dias protegida por hoje`
                      : 'Você já estudou hoje'
                    : streakDays > 1
                      ? `Estude hoje para manter ${streakDays} dias de sequência`
                      : 'Comece uma sequência hoje'}
                </Text>
                <Text style={styles.streakSubtitle}>
                  {studiedToday
                    ? 'Volte amanhã para continuar de onde parou'
                    : `A sequência zera à meia-noite — faltam ${resetCountdown}`}
                </Text>
              </View>
            </LinearGradient>
          </View>

          {/* ── Daily section header ── */}
          <View style={styles.sectionHeaderRow}>
            <Text style={styles.sectionLabel}>
              HOJE · {doneCount}/{missions.length} CONCLUÍDAS
            </Text>
          </View>

          {/* ── Missões (dados reais) ── */}
          <View style={styles.missionList}>
            {missions.map((m) => (
              <MissionCard key={m.id} {...m} />
            ))}
          </View>

          {/* ── Hearts footer ── */}
          <View style={styles.heartsSection}>
            <View style={styles.heartsSectionHeader}>
              <Text style={styles.heartsSectionTitle}>❤️ Vidas</Text>
              <HeartRefillTimer
                nextRefillAt={snapshot?.heartsNextRefillAt}
                onElapsed={load}
              />
            </View>
            <View
              style={styles.heartsRow}
              accessibilityLabel={`${hearts} de ${maxHearts} vidas`}
            >
              {Array.from({ length: maxHearts }).map((_, i) => (
                <Text key={i} style={styles.heartIcon} importantForAccessibility="no">
                  {i < hearts ? '❤️' : '🤍'}
                </Text>
              ))}
            </View>
            {hearts === 0 && (
              <View style={styles.heartsWarning}>
                <Text style={styles.heartsWarningText}>
                  Sem vidas por agora. Aguarde a recarga ou faça revisões — elas nunca são bloqueadas.
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
  root: { flex: 1, backgroundColor: galaxyColors.background },
  safe: { flex: 1 },
  scroll: { flex: 1 },
  scrollContent: { paddingHorizontal: 20, paddingBottom: tabBarClearance },

  // Header
  headerRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  headerLabel: {
    ...typography.label,
    color: galaxyColors.textSecondary,
    letterSpacing: 0.08 * 11,
    textTransform: 'uppercase',
  },
  headerTitle: {
    ...typography.h3,
    color: galaxyColors.textPrimary,
    letterSpacing: -0.02 * 24,
    marginTop: 2,
  },
  clockBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: galaxyColors.hudPill,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: galaxyColors.hudPillBorder,
    paddingHorizontal: 10,
    paddingVertical: 6,
    marginTop: 4,
  },
  clockText: {
    ...typography.micro,
    color: galaxyColors.textSecondary,
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
  streakShadowWrapperCalm: {
    shadowColor: '#3060FF',
    shadowOpacity: 0.45,
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
    ...typography.bodyStrong,
    color: '#FFFFFF',
    letterSpacing: -0.01 * 16,
  },
  streakSubtitle: {
    ...typography.micro,
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
    ...typography.label,
    color: galaxyColors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.08 * 11,
  },

  // Mission cards
  missionList: { gap: 10 },
  missionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: galaxyColors.surface,
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: galaxyColors.border,
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
    backgroundColor: galaxy.statusSuccess,
    borderColor: galaxy.statusSuccess,
  },
  missionIconBoxPending: {
    backgroundColor: 'rgba(61,202,232,0.12)',
    borderColor: 'rgba(61,202,232,0.28)',
  },
  missionIconText: { fontSize: 20 },
  missionCheckText: {
    color: galaxyColors.background,
    fontWeight: '800',
  },
  missionContent: { flex: 1, gap: space.s1 },
  missionTitle: {
    ...typography.bodyStrong,
    color: galaxyColors.textPrimary,
  },
  missionTitleDone: {
    textDecorationLine: 'line-through',
    textDecorationColor: galaxyColors.textSecondary,
  },

  // Progress bar
  progressTrack: {
    flexDirection: 'row',
    height: 8,
    borderRadius: 4,
    backgroundColor: galaxyColors.spine,
    overflow: 'hidden',
  },
  progressLabel: {
    ...typography.micro,
    color: galaxyColors.textSecondary,
  },

  // Hearts
  heartsSection: {
    backgroundColor: galaxyColors.surface,
    borderRadius: 16,
    padding: 16,
    marginTop: 24,
    borderWidth: 1,
    borderColor: galaxyColors.border,
  },
  heartsSectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  heartsSectionTitle: {
    ...typography.bodyStrong,
    color: galaxyColors.textPrimary,
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
    ...typography.micro,
    color: galaxyColors.critical,
  },
  heartsWarning: {
    marginTop: 12,
    backgroundColor: 'rgba(255,59,48,0.08)',
    borderRadius: 10,
    padding: 10,
  },
  heartsWarningText: {
    ...typography.micro,
    color: galaxyColors.critical,
    lineHeight: 18,
  },
});
