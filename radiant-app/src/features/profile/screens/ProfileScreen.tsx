import React, { useCallback, useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useFocusEffect } from 'expo-router';

import { AppConfig } from '../../../config';
import { AppButton } from '../../../components/ui/AppButton';
import { GamificationService } from '../../gamification/services/GamificationService';
import MissionsScreen from '../../missions/screens/MissionsScreen';
import ProgressScreen from '../../progress/screens/ProgressScreen';
import { ICloudBackupCard } from '../../progress-sync/components/ICloudBackupCard';
import { progressSyncService } from '../../progress-sync/ProgressSyncService';
import type { BackupState } from '../../progress-sync/progressSync.types';
import { SubscriptionCard } from '../../subscription/components/SubscriptionCard';
import { subscriptionService } from '../../subscription/SubscriptionService';
import type { SubscriptionStatus } from '../../subscription/subscription.types';
import { StarfieldBackground } from '../../../ui/components/StarfieldBackground';
import { galaxyColors } from '../../../ui/theme';
import { space, tabBarClearance } from '../../../ui/styles';
import { ProfileIdentityHeader } from '../components/ProfileIdentityHeader';

/**
 * A aba Perfil — a segunda e última da barra.
 *
 * Agrega o que eram três abas separadas: a identidade do aluno como cabeçalho,
 * as Missões inteiras e o Progresso inteiro. A ordem não é arbitrária: quem é o
 * aluno, o que ele tem para fazer hoje, e como ele vem indo. Do mais imediato
 * para o mais retrospectivo.
 *
 * **A rolagem é daqui.** As duas telas agregadas entram em modo embutido,
 * porque duas `ScrollView` aninhadas na vertical brigam pelo gesto — a de dentro
 * consome o arrasto e a de fora trava, e o aluno não alcança o que está embaixo.
 *
 * **Os controles do console não entram, e nunca podem entrar.** Learning Road,
 * Beta Gate, reset de estado local — tudo isso saiu da `ProgressScreen` para
 * rota própria antes desta agregação existir, e a ordem foi essa de propósito.
 *
 * O que entra é uma **porta**, não os controles: até 2026-08-21 a rota
 * `/dev-console` não tinha nenhuma entrada in-app e só abria por deep link,
 * embora o checklist de release registre que a homologação em aparelho depende
 * dela. A porta fica atrás de `SHOW_DEV_TOOLS` — que é `__DEV__ ||
 * EXPO_PUBLIC_ENABLE_DEV_TOOLS` —, então no build do aluno ela não existe. Não
 * é um botão desabilitado, que ainda contaria uma história a quem não deveria
 * ouvi-la.
 *
 * **Sem conta própria (spec 1.4 §1.2, decisão 4).** O cabeçalho não recebe
 * e-mail de sessão: guardar progresso é o cartão Backup no iCloud, e assinar
 * é o cartão Assinatura. Nenhum dos dois pede login, e nenhuma palavra de
 * infraestrutura chega à tela do aluno.
 */
export default function ProfileScreen() {
  const [streakDays, setStreakDays] = useState(0);
  const [totalXp, setTotalXp] = useState(0);
  const [subscription, setSubscription] = useState<SubscriptionStatus | null>(null);
  const [backup, setBackup] = useState<BackupState | null>(null);
  const [backupBusy, setBackupBusy] = useState(false);

  useFocusEffect(
    useCallback(() => {
      void GamificationService.getSnapshot().then((snapshot) => {
        setStreakDays(snapshot.streakDays);
        setTotalXp(snapshot.totalXp);
      });
      void subscriptionService.getStatus(Date.now())
        .then(setSubscription)
        .catch((cause) => {
          console.error('[ProfileScreen] Falha ao ler a assinatura:', cause);
          setSubscription({ kind: 'none' });
        });
      void progressSyncService.getState()
        .then(setBackup)
        .catch((cause) => {
          console.error('[ProfileScreen] Falha ao ler o backup:', cause);
          // A leitura falhou, então não se sabe se existe decisão: `decided`
          // fica falso, que é o estado honesto e não induz o serviço a nada —
          // este objeto só alimenta o cartão.
          setBackup({ enabled: false, decided: false, lastBackupAt: null, lastError: 'failed' });
        });
    }, []),
  );

  const toggleBackup = useCallback((enabled: boolean) => {
    setBackupBusy(true);
    void progressSyncService.setEnabled(enabled, Date.now())
      .then(setBackup)
      .catch((cause) => {
        console.error('[ProfileScreen] Falha ao alterar o backup:', cause);
        // Aqui o dono mexeu no interruptor: houve decisão, mesmo que a
        // gravação tenha falhado.
        setBackup((current) => ({ enabled, decided: true, lastBackupAt: current?.lastBackupAt ?? null, lastError: 'failed' }));
      })
      .finally(() => setBackupBusy(false));
  }, []);

  return (
    <View style={styles.root}>
      <StarfieldBackground backgroundColor={galaxyColors.background} starCount={120} />
      <SafeAreaView style={styles.safe} edges={['top']}>
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
        >
          <ProfileIdentityHeader email={null} streakDays={streakDays} totalXp={totalXp} />
          <MissionsScreen embedded />
          <SubscriptionCard status={subscription} onOpen={() => router.push('/subscription')} />
          <ICloudBackupCard state={backup} onToggle={toggleBackup} busy={backupBusy} />
          <ProgressScreen embedded />

          {AppConfig.SHOW_DEV_TOOLS ? (
            <AppButton
              variant="ghost"
              onPress={() => router.push('/dev-console')}
              accessibilityLabel="Abrir o console de desenvolvimento"
              accessibilityHint="Ferramentas de homologação. Não aparece no build do aluno."
            >
              Console de desenvolvimento
            </AppButton>
          ) : null}
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: galaxyColors.background },
  safe: { flex: 1 },
  scroll: { flex: 1 },
  content: {
    paddingHorizontal: space.s3,
    gap: space.s3,
    // A tab bar é cartão flutuante e cobre o fim do conteúdo sem esta reserva.
    paddingBottom: tabBarClearance,
  },
});
