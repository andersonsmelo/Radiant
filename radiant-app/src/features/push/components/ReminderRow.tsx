import React, { useCallback, useRef, useState } from 'react';
import { Pressable, StyleSheet, Switch, Text, View, useWindowDimensions } from 'react-native';
import { useFocusEffect } from 'expo-router';
import { galaxyColors } from '../../../ui/theme';
import { space, typography } from '../../../ui/styles';
import { isLargeTextScale } from '../../../ui/accessibility/useLargeTextLayout';
import { PushService } from '../services/PushService';

type ReminderRowProps = { /** O consumidor decide a visibilidade; não muda a elegibilidade do serviço. */ visible: boolean };

/** Porta manual da preferência; o serviço escolhe a hora na janela existente. */
export function ReminderRow({ visible }: ReminderRowProps): React.ReactElement | null {
  const { fontScale } = useWindowDimensions();
  const [enabled, setEnabled] = useState<boolean | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [settled, setSettled] = useState(false);
  const generation = useRef(0);
  const busyRef = useRef(false);
  const pending = useRef<Promise<void>>(Promise.resolve());

  useFocusEffect(useCallback(() => {
    const ownGeneration = ++generation.current;
    if (!visible) return () => { generation.current++; };
    setSettled(false);
    setError(null);
    const active = () => generation.current === ownGeneration;
    // Uma gravação iniciada no foco anterior continua. Releitura espera seu fim;
    // invalidar publicação nunca cancela permissão, persistência ou agendamento.
    void pending.current.then(() => PushService.getOptIn()).then(decision => {
      if (active()) setEnabled(decision === true);
    }, () => {
      if (active()) { setEnabled(null); setError('Não foi possível consultar o lembrete.'); }
    }).finally(() => { if (active()) { setSettled(true); setBusy(false); } });
    return () => { generation.current++; };
  }, [visible]));

  const handleChange = useCallback((next: boolean) => {
    if (busyRef.current) return;
    busyRef.current = true;
    setEnabled(next);
    setError(null);
    setBusy(true);
    const ownGeneration = generation.current;
    const active = () => generation.current === ownGeneration;
    pending.current = (async () => {
      try {
        const decision = await PushService.changeReminderPreference(next);
        if (active()) setEnabled(decision === true);
      } catch (cause) {
        console.error('[ReminderRow] Falha ao atualizar o lembrete:', cause);
        if (active()) setError('Não foi possível atualizar o lembrete.');
        try {
          const decision = await PushService.getOptIn();
          if (active()) setEnabled(decision === true);
        } catch (readCause) {
          console.error('[ReminderRow] Falha ao reconciliar o lembrete:', readCause);
          if (active()) setEnabled(null);
        }
      } finally {
        busyRef.current = false;
        if (active()) setBusy(false);
      }
    })();
  }, []);

  const retryRead = useCallback(() => {
    if (busyRef.current) return;
    busyRef.current = true;
    setBusy(true);
    const ownGeneration = generation.current;
    const active = () => generation.current === ownGeneration;
    pending.current = PushService.getOptIn().then(decision => {
      if (active()) { setEnabled(decision === true); setError(null); }
    }, () => { if (active()) setError('Não foi possível consultar o lembrete.'); }).finally(() => {
      busyRef.current = false;
      if (active()) setBusy(false);
    });
  }, []);

  if (!visible) return null;
  if (!settled) return <Text key={`loading-${fontScale}`} style={styles.message}>Carregando lembrete…</Text>;
  return <View>
    <View style={[styles.row, isLargeTextScale(fontScale) && styles.stacked]}>
      <Text key={`label-${fontScale}`} style={styles.text}>Lembrete diário</Text>
      {enabled !== null ? <Switch accessibilityLabel="Lembrete diário" value={enabled} onValueChange={handleChange} disabled={busy}
        trackColor={{ true: galaxyColors.nodeCompletedAccent, false: galaxyColors.surfaceActive }} /> : null}
    </View>
    {error ? <Text key={`error-${fontScale}`} accessibilityRole="alert" style={styles.message}>{error}</Text> : null}
    {enabled === null ? <Pressable accessibilityRole="button" disabled={busy} onPress={retryRead} style={styles.retry}>
      <Text key={`retry-${fontScale}`} style={styles.text}>Tentar novamente</Text>
    </Pressable> : null}
  </View>;
}
const styles = StyleSheet.create({
  retry: { minHeight: 48, justifyContent: 'center', paddingVertical: space.s2 },
  row: { minHeight: 56, paddingVertical: space.s2, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: space.s2 },
  stacked: { flexDirection: 'column', alignItems: 'flex-start' },
  text: { ...typography.bodyRegular, lineHeight: undefined, color: galaxyColors.textPrimary, flexShrink: 1 },
  message: { ...typography.bodyRegular, lineHeight: undefined, color: galaxyColors.textSecondary, paddingVertical: space.s2 },
});
