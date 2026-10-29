import React, { useCallback, useRef, useState } from 'react';
import { ScrollView, StyleSheet, Text, View, useWindowDimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useFocusEffect } from 'expo-router';
import { GamificationService } from '../../gamification/services/GamificationService';
import { DailyGoalService } from '../../daily-goal/services/DailyGoalService';
import { JourneyCurriculumService, type CurriculumTrail } from '../../journey/services/JourneyCurriculumService';
import { JourneyStarsService } from '../../journey/services/JourneyStarsService';
import { SpacedRepetitionService } from '../../spaced-repetition/services/SpacedRepetitionService';
import type { GamificationSnapshot } from '../../../types/gamification';
import type { DailyGoalSnapshot } from '../../../types/dailyGoal';
import type { JourneyUnit } from '../../../types/journey';
import type { LessonStars } from '../../quiz/services/resolveLessonStars';
import type { DailyGoalTierId } from '../../../constants/dailyGoal';
import { StarfieldBackground } from '../../../ui/components/StarfieldBackground';
import { galaxyColors } from '../../../ui/theme';
import { space, tabBarClearance, typography } from '../../../ui/styles';
import { ProfileIdentityHeader } from '../components/ProfileIdentityHeader';
import { MedalShelf } from '../components/MedalShelf';
import { StreakWeek } from '../components/StreakWeek';
import { TodayGoals } from '../components/TodayGoals';

type Reading<T> = { state: 'loading' } | { state: 'ready'; data: T } | { state: 'unavailable' };

function currentUnit(trail: CurriculumTrail): JourneyUnit | null {
  const units = trail.segments.flatMap(segment => segment.units);
  const recommended = units.find(unit => unit.nodes.some(node => node.id === trail.recommendedNodeId));
  if (recommended) return recommended;
  const active = trail.segments.find(segment => segment.unlocked && !segment.completed);
  if (active) return active.units.find(unit => unit.nodes.some(node => node.type === 'lesson' && node.status !== 'completed')) ?? active.units[0] ?? null;
  const completed = trail.segments.filter(segment => segment.completed).flatMap(segment => segment.units);
  return completed[completed.length - 1] ?? null;
}

/** Identidade e evidência local. Contador, última data, currículo e metas mantêm suas fontes. */
export default function ProfileScreen() {
  const { fontScale } = useWindowDimensions();
  const [gamification, setGamification] = useState<Reading<GamificationSnapshot>>({ state: 'loading' });
  const [goal, setGoal] = useState<Reading<DailyGoalSnapshot>>({ state: 'loading' });
  const [curriculum, setCurriculum] = useState<Reading<CurriculumTrail>>({ state: 'loading' });
  const [stars, setStars] = useState<Reading<Record<string, LessonStars>>>({ state: 'loading' });
  const [due, setDue] = useState<Reading<number>>({ state: 'loading' });
  const [today, setToday] = useState(() => new Date());
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState(false);
  const generation = useRef(0);
  const savingRef = useRef(false);

  useFocusEffect(useCallback(() => {
    const ownGeneration = ++generation.current;
    setToday(new Date());
    setGamification({ state: 'loading' });
    setGoal({ state: 'loading' });
    setCurriculum({ state: 'loading' });
    setStars({ state: 'loading' });
    setDue({ state: 'loading' });
    savingRef.current = false;
    setSaving(false);
    setSaveError(false);
    const read = <T,>(producer: () => Promise<T>, publish: (value: Reading<T>) => void) => {
      void Promise.resolve().then(producer).then(data => {
        if (generation.current === ownGeneration) publish({ state: 'ready', data });
      }, () => {
        if (generation.current === ownGeneration) publish({ state: 'unavailable' });
      });
    };
    read(() => GamificationService.getSnapshot(), setGamification);
    read(() => DailyGoalService.getSnapshot(), setGoal);
    read(() => JourneyCurriculumService.getCurriculumTrail(), setCurriculum);
    read(() => JourneyStarsService.getRecordStarsByLessonId(), setStars);
    read(() => SpacedRepetitionService.getDueCount(), setDue);
    return () => { generation.current++; };
  }, []));

  const selectTier = useCallback((tier: DailyGoalTierId) => {
    if (savingRef.current) return;
    savingRef.current = true;
    setSaving(true);
    setSaveError(false);
    const ownGeneration = generation.current;
    void DailyGoalService.setTier(tier).then(snapshot => {
      if (generation.current === ownGeneration) setGoal({ state: 'ready', data: snapshot });
    }, () => {
      if (generation.current === ownGeneration) setSaveError(true);
    }).finally(() => {
      if (generation.current === ownGeneration) {
        savingRef.current = false;
        setSaving(false);
      }
    });
  }, []);

  const snapshot = gamification.state === 'ready' ? gamification.data : null;
  const totalXp = snapshot?.totalXp;
  const validXp = typeof totalXp === 'number' && Number.isFinite(totalXp) && totalXp >= 0;
  return <View style={styles.root}>
    <StarfieldBackground backgroundColor={galaxyColors.background} />
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView style={styles.scroll} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <ProfileIdentityHeader email={null} onOpenSettings={() => router.push('/settings')} />
        <MedalShelf unit={curriculum.state === 'ready' ? currentUnit(curriculum.data) : null}
          starsByLessonId={stars.state === 'ready' ? stars.data : null} loading={curriculum.state === 'loading'} starsLoading={stars.state === 'loading'} />
        <StreakWeek lastActiveDate={snapshot?.lastActiveDate ?? null} streakDays={snapshot?.streakDays ?? null}
          today={today} loading={gamification.state === 'loading'} />
        <TodayGoals goal={goal.state === 'ready' ? goal.data : null} dueCount={due.state === 'ready' ? due.data : null}
          goalLoading={goal.state === 'loading'} dueLoading={due.state === 'loading'}
          saving={saving} saveError={saveError} onSelectTier={selectTier} />
        {gamification.state !== 'loading' ? <Text key={`total-${fontScale}`} style={styles.total}>
          {validXp ? `${totalXp} XP no total` : 'XP total indisponível'}
        </Text> : null}
      </ScrollView>
    </SafeAreaView>
  </View>;
}
const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: galaxyColors.background },
  safe: { flex: 1 },
  scroll: { flex: 1 },
  content: { paddingHorizontal: space.s3, paddingTop: space.s2, gap: space.s5, paddingBottom: tabBarClearance },
  total: { ...typography.caption, lineHeight: undefined, color: galaxyColors.textSecondary, paddingBottom: space.s2 },
});
