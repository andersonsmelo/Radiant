import React, { useCallback, useRef, useState } from 'react';
import { StyleSheet, Switch, Text, View, useWindowDimensions } from 'react-native';
import { useFocusEffect } from 'expo-router';
import { AppConfig } from '../../../config';
import { galaxyColors } from '../../../ui/theme';
import { space, typography } from '../../../ui/styles';
import { isLargeTextScale } from '../../../ui/accessibility/useLargeTextLayout';
import type { NotificationPreferences, ReminderPreferenceId } from '../personalized/composeReminder';
import { readNotificationPreferences, setNotificationPreference } from '../personalized/notificationPreferences';

const ROWS: readonly { id: ReminderPreferenceId; label: string }[] = [
  { id: 'sequencia', label: 'Sequência de estudo' },
  { id: 'revisao', label: 'Revisões devidas' },
  { id: 'aula', label: 'Próxima aula e retorno' },
  { id: 'meta', label: 'Meta do dia' },
  { id: 'liga', label: 'Liga da semana' },
];

/** Do que o lembrete pode falar (F6). O liga-desliga geral continua no `ReminderRow`. */
export function NotificationTypeRows(): React.ReactElement | null {
  const enabled = AppConfig.ENABLE_PERSONALIZED_NOTIFICATIONS;
  const { fontScale } = useWindowDimensions();
  const [prefs, setPrefs] = useState<NotificationPreferences | null>(null);
  const writes = useRef<Promise<unknown>>(Promise.resolve());

  useFocusEffect(useCallback(() => {
    if (!enabled) return;
    let active = true;
    void writes.current.then(readNotificationPreferences).then(value => { if (active) setPrefs(value); });
    return () => { active = false; };
  }, [enabled]));

  const change = useCallback((id: ReminderPreferenceId, value: boolean) => {
    setPrefs(current => current && { ...current, [id]: value });
    // Em fila: dois toques rápidos não gravam um sobre o outro.
    writes.current = writes.current.then(() => setNotificationPreference(id, value)).then(setPrefs, () => undefined);
  }, []);

  if (!enabled || prefs === null) return null;
  return <View>
    <Text key={`caption-${fontScale}`} style={styles.caption}>Do que o lembrete pode falar</Text>
    {ROWS.map(row => <View key={row.id} style={[styles.row, isLargeTextScale(fontScale) && styles.stacked]}>
      <Text key={`${row.id}-${fontScale}`} style={styles.text}>{row.label}</Text>
      <Switch accessibilityLabel={row.label} value={prefs[row.id]} onValueChange={value => change(row.id, value)}
        trackColor={{ true: galaxyColors.nodeCompletedAccent, false: galaxyColors.surfaceActive }} />
    </View>)}
  </View>;
}
const styles = StyleSheet.create({
  caption: { ...typography.caption, lineHeight: undefined, color: galaxyColors.textSecondary, paddingTop: space.s2 },
  row: { minHeight: 56, paddingVertical: space.s2, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: space.s2 },
  stacked: { flexDirection: 'column', alignItems: 'flex-start' },
  text: { ...typography.bodyRegular, lineHeight: undefined, color: galaxyColors.textPrimary, flexShrink: 1 },
});
