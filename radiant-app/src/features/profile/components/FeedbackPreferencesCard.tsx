import React, { useRef } from 'react';
import { StyleSheet, Switch, Text, View, useWindowDimensions } from 'react-native';
import { DEFAULT_FEEDBACK_PREFERENCES, type FeedbackPreferences } from '../../../ui/feedback/feedbackPreferences';
import { galaxyColors } from '../../../ui/theme';
import { space, typography } from '../../../ui/styles';
import { GroupedList } from '../../../ui/components/GroupedList';
import { isLargeTextScale } from '../../../ui/accessibility/useLargeTextLayout';

type Props = Readonly<{ preferences: FeedbackPreferences | null; onChange: (next: FeedbackPreferences) => void }>;

function Row({ label, hint, value, onValueChange, loading }: Readonly<{ label: string; hint: string; value: boolean; onValueChange: (value: boolean) => void; loading: boolean }>) {
  const { fontScale } = useWindowDimensions();
  return <View style={[styles.row, isLargeTextScale(fontScale) && styles.stacked]}>
    <Text key={`label-${fontScale}`} style={styles.label}>{label}</Text>
    <Switch accessibilityLabel={label} accessibilityHint={hint} value={value} onValueChange={onValueChange} disabled={loading} accessibilityState={{ disabled: loading, busy: loading }}
      trackColor={{ true: galaxyColors.nodeCompletedAccent, false: galaxyColors.surfaceActive }} />
  </View>;
}
export function FeedbackPreferencesCard({ preferences, onChange }: Props) {
  const latest = useRef(preferences ?? DEFAULT_FEEDBACK_PREFERENCES);
  latest.current = preferences ?? DEFAULT_FEEDBACK_PREFERENCES;
  const change = (patch: Partial<FeedbackPreferences>) => {
    if (preferences === null) return;
    latest.current = { ...latest.current, ...patch };
    onChange(latest.current);
  };
  return <GroupedList header="Durante a aula" footer="O modo silencioso do iPhone também desliga os sons.">
    <Row loading={preferences === null} label="Sons" hint="Acerto, erro e fim de lição. O modo silencioso do iPhone também desliga." value={latest.current.sounds} onValueChange={sounds => change({ sounds })} />
    <Row loading={preferences === null} label="Vibração" hint="Vibra ao responder e ao concluir a lição, no iPhone." value={latest.current.haptics} onValueChange={haptics => change({ haptics })} />
  </GroupedList>;
}
const styles = StyleSheet.create({
  row: { minHeight: 56, paddingVertical: space.s2, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: space.s2 },
  stacked: { flexDirection: 'column', alignItems: 'flex-start' },
  label: { ...typography.bodyRegular, lineHeight: undefined, color: galaxyColors.textPrimary, flexShrink: 1 },
});
