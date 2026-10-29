import React, { useState } from 'react';
import { Pressable, StyleSheet, Text, View, useWindowDimensions } from 'react-native';
import type { DailyGoalSnapshot } from '../../../types/dailyGoal';
import { DAILY_GOAL_TIERS, type DailyGoalTierId } from '../../../constants/dailyGoal';
import { ListRow } from '../../../ui/components/ListRow';
import { radius, space, typography } from '../../../ui/styles';
import { galaxyColors } from '../../../ui/theme';

type TodayGoalsProps = {
  goal: DailyGoalSnapshot | null;
  dueCount: number | null;
  goalLoading?: boolean;
  dueLoading?: boolean;
  saving?: boolean;
  saveError?: boolean;
  onSelectTier: (tier: DailyGoalTierId) => void;
};

/** XP é uma meta. Pendências de revisão são uma contagem, sem alvo diário inventado. */
export function TodayGoals({ goal, dueCount, goalLoading = false, dueLoading = false, saving = false, saveError = false, onSelectTier }: TodayGoalsProps): React.ReactElement {
  const { fontScale } = useWindowDimensions();
  const [expanded, setExpanded] = useState(false);
  const value = goal?.earnedXpToday ?? goal?.completedToday;
  const target = goal?.goalXp ?? goal?.goalPerDay;
  const validGoal = typeof value === 'number' && Number.isFinite(value) && value >= 0
    && typeof target === 'number' && Number.isFinite(target) && target > 0;
  const tier = DAILY_GOAL_TIERS.find(entry => entry.id === goal?.tierId);
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
    {!goalLoading && validGoal ? <>
      <Pressable accessibilityRole="button" accessibilityLabel={`Meta diária: ${tier?.label ?? 'nível sem registro'}`}
        accessibilityState={{ expanded, disabled: saving, busy: saving }} disabled={saving}
        onPress={() => setExpanded(previous => !previous)} style={styles.edit}>
        <Text key={`edit-${fontScale}`} style={styles.editTitle}>Meta diária</Text>
        <Text key={`tier-${fontScale}`} style={styles.detail}>{tier?.label ?? 'Nível sem registro'}</Text>
      </Pressable>
      {expanded ? <View accessibilityRole="radiogroup" accessibilityLabel="Escolha sua meta diária" style={styles.options}>
        {DAILY_GOAL_TIERS.map(option => <Pressable key={option.id} accessibilityRole="radio"
          accessibilityLabel={`${option.label}, ${option.xp} XP`}
          accessibilityState={{ checked: goal?.tierId === option.id, disabled: saving }} disabled={saving}
          onPress={() => onSelectTier(option.id)} style={[styles.option, goal?.tierId === option.id && styles.selected]}>
          <Text key={`option-${fontScale}`} style={styles.optionText}>{option.label} · {option.xp} XP</Text>
        </Pressable>)}
      </View> : null}
      {saving ? <Text key={`saving-${fontScale}`} style={styles.detail} accessibilityLiveRegion="polite">Salvando meta…</Text> : null}
    </> : null}
    {saveError ? <Text key={`error-${fontScale}`} style={styles.detail} accessibilityRole="alert">Não foi possível salvar a meta. Tente novamente.</Text> : null}
  </View>;
}
const styles = StyleSheet.create({
  section: { gap: space.s2 },
  heading: { ...typography.bodyStrong, lineHeight: undefined, color: galaxyColors.textPrimary },
  goal: { gap: space.s1 },
  detail: { ...typography.bodyRegular, lineHeight: undefined, color: galaxyColors.textSecondary },
  track: { height: 6, borderRadius: radius.rMd / 4, backgroundColor: galaxyColors.surfaceMuted, overflow: 'hidden' },
  fill: { height: 6, borderRadius: radius.rMd / 4, backgroundColor: galaxyColors.navBlue },
  edit: { minHeight: 48, gap: space.s0, justifyContent: 'center', paddingVertical: space.s1 },
  editTitle: { ...typography.bodyStrong, lineHeight: undefined, color: galaxyColors.navBlue },
  options: { gap: space.s1 },
  option: { minHeight: 48, padding: space.s2, justifyContent: 'center', borderBottomWidth: 1, borderBottomColor: galaxyColors.border },
  selected: { backgroundColor: galaxyColors.surface },
  optionText: { ...typography.bodyRegular, lineHeight: undefined, color: galaxyColors.textPrimary },
});
