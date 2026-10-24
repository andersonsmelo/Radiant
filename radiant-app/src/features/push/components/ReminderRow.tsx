import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Pressable, StyleSheet, Switch, Text, View } from 'react-native';

import { galaxyColors } from '../../../ui/theme';
import { space, typography } from '../../../ui/styles';
import { LABEL_MAX_FONT_SCALE } from '../../../ui/accessibility/useLargeTextLayout';
import { TelemetryService } from '../../telemetry/TelemetryService';
import { PushService } from '../services/PushService';

type ReminderRowProps = {
  /** A tela só mostra a linha depois da primeira aula concluída. */
  visible: boolean;
};

/**
 * O lembrete diário como uma linha com interruptor, no lugar do cartão de
 * convite que ocupava o topo de Estude.
 *
 * O horário não aparece no texto: o `PushService` sorteia a hora dentro de uma
 * janela, e "às 19h" prometeria o que ele não faz.
 */
export function ReminderRow({ visible }: ReminderRowProps): React.ReactElement | null {
  const [enabled, setEnabled] = useState<boolean | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  // O interruptor só aparece depois da leitura do que o aluno já escolheu:
  // nascer desligado e virar ligado mostrava um salto na tela.
  const [settled, setSettled] = useState(false);
  // Uma escolha do aluno feita antes da leitura inicial terminar não pode ser
  // sobrescrita por ela.
  const touchedRef = useRef(false);

  useEffect(() => {
    if (!visible) return undefined;
    let active = true;
    void PushService.getOptIn()
      .then((decision) => {
        if (active && !touchedRef.current) setEnabled(decision === true);
      })
      .catch((cause) => {
        console.error('[ReminderRow] Falha ao ler o lembrete:', cause);
        if (active) setError('Não foi possível consultar o lembrete.');
      })
      .finally(() => {
        if (active) setSettled(true);
      });
    return () => {
      active = false;
    };
  }, [visible]);

  const handleChange = useCallback(async (next: boolean) => {
    touchedRef.current = true;
    setEnabled(next);
    setError(null);
    setBusy(true);
    try {
      if (!next) {
        void TelemetryService.track('push_optin_declined');
        await PushService.setOptIn(false);
        return;
      }
      await PushService.setOptIn(true);
      const permission = await PushService.requestPermissionIfNeeded();
      if (permission !== 'granted') {
        // O sistema recusou: sem permissão não há lembrete, e o interruptor
        // não pode ficar ligado prometendo um.
        await PushService.setOptIn(false);
        setEnabled(false);
        return;
      }
      void TelemetryService.track('push_optin_accepted');
      await PushService.scheduleDailyIfEligible({ reason: 'optin_immediate' });
    } catch (cause) {
      console.error('[ReminderRow] Falha ao atualizar o lembrete:', cause);
      setError('Não foi possível atualizar o lembrete.');
      // A gravação pode ter ocorrido antes da falha de permissão, cancelamento
      // ou agendamento. Releia a preferência que o próximo foco usará.
      try {
        setEnabled((await PushService.getOptIn()) === true);
      } catch (readCause) {
        console.error('[ReminderRow] Falha ao reconciliar o lembrete:', readCause);
        setEnabled(null);
      }
    } finally {
      setBusy(false);
    }
  }, []);

  const retryRead = useCallback(async () => {
    setBusy(true);
    try {
      setEnabled((await PushService.getOptIn()) === true);
      setError(null);
    } catch (cause) {
      console.error('[ReminderRow] Falha ao consultar o lembrete:', cause);
      setError('Não foi possível consultar o lembrete.');
    } finally {
      setBusy(false);
    }
  }, []);

  if (!visible || !settled) return null;

  return (
    <View>
      <View style={styles.row}>
        <Text style={styles.text} maxFontSizeMultiplier={LABEL_MAX_FONT_SCALE}>Lembrete diário</Text>
        {enabled !== null && (
          <Switch
            accessibilityLabel="Lembrete diário"
            value={enabled}
            onValueChange={(next) => void handleChange(next)}
            disabled={busy}
            trackColor={{ true: galaxyColors.nodeCompletedAccent, false: galaxyColors.surfaceActive }}
          />
        )}
      </View>
      {error && <Text accessibilityRole="alert" style={styles.text}>{error}</Text>}
      {enabled === null && (
        <Pressable accessibilityRole="button" disabled={busy} onPress={() => void retryRead()} style={styles.retry}>
          <Text style={styles.text}>Tentar novamente</Text>
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  retry: { minHeight: 48, justifyContent: 'center' },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: space.s2,
    minHeight: 44,
  },
  text: {
    ...typography.bodyRegular,
    color: galaxyColors.textSecondary,
    flexShrink: 1,
  },
});
