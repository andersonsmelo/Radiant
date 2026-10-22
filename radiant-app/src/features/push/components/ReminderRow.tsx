import React, { useCallback, useEffect, useRef, useState } from 'react';
import { StyleSheet, Switch, Text, View } from 'react-native';

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
  const [enabled, setEnabled] = useState(false);
  const [busy, setBusy] = useState(false);
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
      .catch((cause) => console.error('[ReminderRow] Falha ao ler o lembrete:', cause))
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

    if (!next) {
      void TelemetryService.track('push_optin_declined');
      try {
        await PushService.setOptIn(false);
      } catch (cause) {
        console.error('[ReminderRow] Falha ao desligar o lembrete:', cause);
      }
      return;
    }

    setBusy(true);
    try {
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
      console.error('[ReminderRow] Falha ao ativar o lembrete:', cause);
      setEnabled(false);
    } finally {
      setBusy(false);
    }
  }, []);

  if (!visible || !settled) return null;

  return (
    <View style={styles.row}>
      <Text style={styles.text} maxFontSizeMultiplier={LABEL_MAX_FONT_SCALE}>Lembrete diário</Text>
      <Switch
        accessibilityLabel="Lembrete diário"
        value={enabled}
        onValueChange={(next) => void handleChange(next)}
        disabled={busy}
        trackColor={{ true: galaxyColors.nodeCompletedAccent, false: galaxyColors.surfaceActive }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
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
