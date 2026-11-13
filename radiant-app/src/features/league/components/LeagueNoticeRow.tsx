import React, { useCallback, useState } from 'react';
import { Pressable, StyleSheet, Text } from 'react-native';
import { useFocusEffect } from 'expo-router';

import { AppConfig } from '../../../config';
import { LABEL_MAX_FONT_SCALE } from '../../../ui/accessibility/useLargeTextLayout';
import { space, typography } from '../../../ui/styles';
import { galaxyColors } from '../../../ui/theme';
import { LeagueService, type LeagueNotice } from '../LeagueService';

type LeagueNoticeRowProps = { onPress: () => void; enabled?: boolean };

/** Texto do aviso: informa e convida, sem culpa. */
export function noticeText(notice: LeagueNotice): string {
  return notice.kind === 'summary'
    ? `Semana encerrada: você terminou em ${notice.rank}º de ${notice.totalPlayers}, com ${notice.xp} XP.`
    : `Alguém passou você na liga. Agora você está em ${notice.rank}º.`;
}

/**
 * Aviso da liga na Estude: o resumo da semana na primeira abertura depois da
 * virada, ou "alguém passou você", no máximo uma vez por dia (a regra mora no
 * `LeagueService.checkNotice`). Sem dado real, não aparece. Com a liga
 * desligada, não lê nada.
 */
export function LeagueNoticeRow({ onPress, enabled = AppConfig.ENABLE_LEAGUE }: LeagueNoticeRowProps): React.ReactElement | null {
  const [notice, setNotice] = useState<LeagueNotice | null>(null);

  useFocusEffect(useCallback(() => {
    if (!enabled) return;
    let alive = true;
    // Sem aviso novo, o anterior sai: a posição pode ter mudado desde então.
    void LeagueService.checkNotice().then(next => { if (alive) setNotice(next); });
    return () => { alive = false; };
  }, [enabled]));

  if (!enabled || !notice) return null;
  const text = noticeText(notice);
  return (
    <Pressable accessibilityRole="button" accessibilityLabel={`${text} Ver liga.`} onPress={onPress} style={styles.row}
      testID="league-notice-row">
      <Text style={styles.text} maxFontSizeMultiplier={LABEL_MAX_FONT_SCALE}>{text}</Text>
      <Text style={styles.action} maxFontSizeMultiplier={LABEL_MAX_FONT_SCALE}>Ver liga</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap', columnGap: space.s2, minHeight: 44, paddingVertical: space.s1,
    borderTopWidth: StyleSheet.hairlineWidth, borderBottomWidth: StyleSheet.hairlineWidth, borderColor: galaxyColors.border,
  },
  text: { ...typography.bodyRegular, color: galaxyColors.textPrimary, flexShrink: 1 },
  action: { ...typography.label, textTransform: 'none', letterSpacing: 0, fontSize: 13, lineHeight: 18, marginLeft: 'auto', color: galaxyColors.navBlue, fontWeight: '700' },
});
