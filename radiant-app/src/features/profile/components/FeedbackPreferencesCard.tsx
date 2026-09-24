import React from 'react';
import { StyleSheet, Switch, Text, View } from 'react-native';
import { DEFAULT_FEEDBACK_PREFERENCES, type FeedbackPreferences } from '../../../ui/feedback/feedbackPreferences';
import { galaxyColors } from '../../../ui/theme';
import { radius, space, typography } from '../../../ui/styles';

type Props = Readonly<{ preferences: FeedbackPreferences | null; onChange: (next: FeedbackPreferences) => void }>;

function Row({ label, hint, value, onValueChange }: Readonly<{ label: string; hint: string; value: boolean; onValueChange: (value: boolean) => void }>) {
  return (
    <View style={styles.row}>
      <View style={styles.copy}>
        <Text style={styles.label}>{label}</Text>
        <Text style={styles.detail}>{hint}</Text>
      </View>
      <Switch
        accessibilityLabel={label}
        accessibilityHint={hint}
        value={value}
        onValueChange={onValueChange}
        trackColor={{ true: galaxyColors.nodeCompletedAccent, false: galaxyColors.surfaceActive }}
      />
    </View>
  );
}

export function FeedbackPreferencesCard({ preferences, onChange }: Props) {
  const value = preferences ?? DEFAULT_FEEDBACK_PREFERENCES;
  return (
    <View style={styles.card}>
      <Text style={styles.eyebrow}>LIÇÃO</Text>
      <Text style={styles.headline} accessibilityRole="header">Sons e vibração</Text>
      <Row label="Sons" hint="Acerto, erro e fim de lição. O modo silencioso do iPhone também desliga." value={value.sounds} onValueChange={(sounds) => onChange({ ...value, sounds })} />
      <Row label="Vibração" hint="Vibra ao responder e ao concluir a lição, no iPhone." value={value.haptics} onValueChange={(haptics) => onChange({ ...value, haptics })} />
    </View>
  );
}

const styles = StyleSheet.create({
  card: { backgroundColor: galaxyColors.surface, borderRadius: radius.rLg, borderWidth: 1, borderColor: galaxyColors.border, padding: space.s3, gap: space.s2 },
  eyebrow: { ...typography.label, color: galaxyColors.textTertiary },
  headline: { ...typography.h3, color: galaxyColors.textPrimary },
  row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: space.s2, minHeight: 44 },
  copy: { flex: 1, gap: space.s0 },
  label: { ...typography.bodyStrong, color: galaxyColors.textPrimary },
  detail: { ...typography.caption, color: galaxyColors.textSecondary },
});
