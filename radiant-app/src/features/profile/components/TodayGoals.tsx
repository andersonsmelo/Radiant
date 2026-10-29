import React from 'react';
import { StyleSheet, Text, View, useWindowDimensions } from 'react-native';
import type { DailyGoalSnapshot } from '../../../types/dailyGoal';
import { ListRow } from '../../../ui/components/ListRow';
import { radius, space, typography } from '../../../ui/styles';
import { galaxyColors } from '../../../ui/theme';

type TodayGoalsProps = {
  goal: DailyGoalSnapshot | null;
  dueCount: number | null;
  goalLoading?: boolean;
  dueLoading?: boolean;
};

/** XP é uma meta. Pendências de revisão são uma contagem, sem alvo diário inventado. */
export function TodayGoals({ goal, dueCount, goalLoading = false, dueLoading = false }: TodayGoalsProps): React.ReactElement {
  const { fontScale } = useWindowDimensions();
  const value = goal?.earnedXpToday ?? goal?.completedToday;
  const target = goal?.goalXp ?? goal?.goalPerDay;
  const validGoal = typeof value === 'number' && Number.isFinite(value) && value >= 0
    && typeof target === 'number' && Number.isFinite(target) && target > 0;
  const validDue = typeof dueCount === 'number' && Number.isInteger(dueCount) && dueCount >= 0;

  return <View style={styles.section}>
    <Text key={`heading-${fontScale}`} style={styles.heading} accessibilityRole="header">Hoje</Text>
    {goalLoading ? <Text key={`loading-${fontScale}`} style={styles.detail}>Carregando meta…</Text>
      : validGoal ? <View style={styles.goal}>
        <ListRow title={`Ganhe ${target} XP`} detail={`${value} de ${target}`} />
        <View testID="daily-xp-track" style={styles.track} accessible accessibilityRole="progressbar" accessibilityLabel="Meta de XP"
          accessibilityValue={{ min: 0, max: target, now: Math.min(value, target) }}>
          <View testID="daily-xp-fill" style={[styles.fill, { width: `${Math.min(1, value / target) * 100}%` }]} />
        </View>
      </View> : <Text key={`unavailable-${fontScale}`} style={styles.detail}>Meta diária indisponível</Text>}
    {dueLoading ? <Text key={`due-loading-${fontScale}`} style={styles.detail}>Carregando revisões…</Text>
      : validDue ? <ListRow title={`Revisões pendentes: ${dueCount}`} />
        : <Text key={`due-unavailable-${fontScale}`} style={styles.detail}>Revisões indisponíveis</Text>}
  </View>;
}
const styles = StyleSheet.create({
  section: { gap: space.s2 },
  heading: { ...typography.bodyStrong, lineHeight: undefined, color: galaxyColors.textPrimary },
  goal: { gap: space.s1 },
  detail: { ...typography.bodyRegular, lineHeight: undefined, color: galaxyColors.textSecondary },
  track: { height: 6, borderRadius: radius.rMd / 4, backgroundColor: galaxyColors.surfaceMuted, overflow: 'hidden' },
  fill: { height: 6, borderRadius: radius.rMd / 4, backgroundColor: galaxyColors.navBlue },
});
