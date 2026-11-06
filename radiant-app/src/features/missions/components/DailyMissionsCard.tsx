import React from 'react';
import { Pressable, StyleSheet, Text } from 'react-native';

import { LABEL_MAX_FONT_SCALE } from '../../../ui/accessibility/useLargeTextLayout';
import { space, typography } from '../../../ui/styles';
import { galaxyColors } from '../../../ui/theme';
import type { DailyMission } from '../services/DailyMissionsService';

type DailyMissionsCardProps = {
  /** `null` enquanto as missões não foram lidas: a entrada não aparece vazia. */
  missions: readonly Pick<DailyMission, 'done'>[] | null;
  onPress: () => void;
};

/** Entrada das missões do dia: uma linha que se toca, como a de revisão da trilha. */
export function DailyMissionsCard({ missions, onPress }: DailyMissionsCardProps): React.ReactElement | null {
  if (!missions || missions.length === 0) return null;
  const done = missions.filter(mission => mission.done).length;
  const status = done === missions.length ? 'Todas concluídas' : `${done} de ${missions.length} concluídas`;

  return (
    <Pressable accessibilityRole="button" accessibilityLabel={`Missões de hoje. ${status}. Ver.`} onPress={onPress} style={styles.row}>
      <Text style={styles.text} maxFontSizeMultiplier={LABEL_MAX_FONT_SCALE}>Missões de hoje</Text>
      <Text style={styles.status} maxFontSizeMultiplier={LABEL_MAX_FONT_SCALE}>{status}</Text>
      <Text style={styles.action} maxFontSizeMultiplier={LABEL_MAX_FONT_SCALE}>Ver</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap', columnGap: space.s2, minHeight: 44, paddingVertical: space.s1,
    borderTopWidth: StyleSheet.hairlineWidth, borderBottomWidth: StyleSheet.hairlineWidth, borderColor: galaxyColors.border,
  },
  text: { ...typography.bodyRegular, color: galaxyColors.textPrimary },
  status: { ...typography.caption, color: galaxyColors.textSecondary, flexShrink: 1 },
  action: { ...typography.label, textTransform: 'none', letterSpacing: 0, fontSize: 13, lineHeight: 18, marginLeft: 'auto', color: galaxyColors.navBlue, fontWeight: '700' },
});
