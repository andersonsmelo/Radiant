import React from 'react';
import { Pressable, StyleSheet, Text } from 'react-native';

import { AppConfig } from '../../../config';
import { LABEL_MAX_FONT_SCALE } from '../../../ui/accessibility/useLargeTextLayout';
import { space, typography } from '../../../ui/styles';
import { galaxyColors } from '../../../ui/theme';

type LeagueProfileRowProps = { onPress: () => void; enabled?: boolean };

/**
 * Entrada da liga no Perfil, no molde da linha das missões. Não lê o Game
 * Center ao abrir o Perfil: a posição aparece na tela da liga. Com a liga
 * desligada, não existe.
 */
export function LeagueProfileRow({ onPress, enabled = AppConfig.ENABLE_LEAGUE }: LeagueProfileRowProps): React.ReactElement | null {
  if (!enabled) return null;
  return (
    <Pressable accessibilityRole="button" accessibilityLabel="Liga da semana. Ver sua posição." onPress={onPress} style={styles.row}
      testID="league-profile-row">
      <Text style={styles.text} maxFontSizeMultiplier={LABEL_MAX_FONT_SCALE}>Liga da semana</Text>
      <Text style={styles.status} maxFontSizeMultiplier={LABEL_MAX_FONT_SCALE}>Sua posição entre os alunos</Text>
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
