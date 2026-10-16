import React, { useCallback, useState } from 'react';
import { Modal, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useFocusEffect } from 'expo-router';

import { IconSymbol } from '../../../../components/ui/icon-symbol';
import { AppConfig } from '../../../config';
import { AppButton } from '../../../components/ui/AppButton';
import WelcomeFlowScreen from '../../first-run/screens/WelcomeFlowScreen';
import { FeedbackPreferencesCard } from '../../profile/components/FeedbackPreferencesCard';
import { AccountSyncCard } from '../../progress/components/AccountSyncCard';
import { LegalLinksCard } from '../../progress/components/LegalLinksCard';
import { ICloudBackupCard } from '../../progress-sync/components/ICloudBackupCard';
import { progressSyncService } from '../../progress-sync/ProgressSyncService';
import type { BackupState } from '../../progress-sync/progressSync.types';
import { SubscriptionCard } from '../../subscription/components/SubscriptionCard';
import { subscriptionService } from '../../subscription/SubscriptionService';
import type { SubscriptionStatus } from '../../subscription/subscription.types';
import { StarfieldBackground } from '../../../ui/components/StarfieldBackground';
import { readFeedbackPreferences, writeFeedbackPreferences, type FeedbackPreferences } from '../../../ui/feedback/feedbackPreferences';
import { galaxyColors } from '../../../ui/theme';
import { space, typography } from '../../../ui/styles';

/**
 * Configuração — aberta pela engrenagem do cabeçalho do Perfil.
 *
 * Desde 2026-10-16 (FILA 32, decisão do dono) tudo o que é configuração saiu
 * da rolagem do Perfil e mora aqui: assinatura, backup no iCloud, sons e
 * vibração, conta e sincronização (só quando o sync remoto existe), ajuda e
 * informações, "Rever apresentação" e a porta do console de desenvolvimento.
 * O Perfil guarda o aluno: identidade, missões e progresso.
 *
 * A assinatura veio junto por decisão do dono: gerenciar o plano é
 * configuração. A oferta continua na folha de vidas da trilha.
 *
 * **A porta do console continua atrás de `SHOW_DEV_TOOLS`**, que é `__DEV__ ||
 * EXPO_PUBLIC_ENABLE_DEV_TOOLS`. No build do aluno ela não existe — não é um
 * botão desabilitado, que ainda contaria uma história a quem não deveria
 * ouvi-la.
 *
 * **Sem conta própria (spec 1.4 §1.2, decisão 4).** Guardar progresso é o
 * cartão Backup no iCloud, e assinar é o cartão Assinatura. Nenhum dos dois
 * pede login.
 */
export default function SettingsScreen() {
  const [subscription, setSubscription] = useState<SubscriptionStatus | null>(null);
  const [backup, setBackup] = useState<BackupState | null>(null);
  const [backupBusy, setBackupBusy] = useState(false);
  const [feedbackPreferences, setFeedbackPreferences] = useState<FeedbackPreferences | null>(null);
  const [showWelcomeReplay, setShowWelcomeReplay] = useState(false);

  useFocusEffect(
    useCallback(() => {
      void subscriptionService.getStatus(Date.now())
        .then(setSubscription)
        .catch((cause) => {
          console.error('[SettingsScreen] Falha ao ler a assinatura:', cause);
          setSubscription({ kind: 'none' });
        });
      void progressSyncService.getState()
        .then(setBackup)
        .catch((cause) => {
          console.error('[SettingsScreen] Falha ao ler o backup:', cause);
          // A leitura falhou, então não se sabe se existe decisão: `decided`
          // fica falso, que é o estado honesto e não induz o serviço a nada —
          // este objeto só alimenta o cartão.
          setBackup({ enabled: false, decided: false, lastBackupAt: null, lastError: 'failed' });
        });
      void readFeedbackPreferences().then(setFeedbackPreferences);
    }, []),
  );

  const toggleBackup = useCallback((enabled: boolean) => {
    setBackupBusy(true);
    void progressSyncService.setEnabled(enabled, Date.now())
      .then(setBackup)
      .catch((cause) => {
        console.error('[SettingsScreen] Falha ao alterar o backup:', cause);
        // Aqui o dono mexeu no interruptor: houve decisão, mesmo que a
        // gravação tenha falhado.
        setBackup((current) => ({ enabled, decided: true, lastBackupAt: current?.lastBackupAt ?? null, lastError: 'failed' }));
      })
      .finally(() => setBackupBusy(false));
  }, []);

  const changeFeedbackPreferences = useCallback((next: FeedbackPreferences) => {
    setFeedbackPreferences(next);
    void writeFeedbackPreferences(next).catch((cause) => {
      console.error('[SettingsScreen] Falha ao gravar sons e vibração:', cause);
    });
  }, []);

  return (
    <View style={styles.root}>
      <StarfieldBackground backgroundColor={galaxyColors.background} starCount={120} />
      <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
        <View style={styles.header}>
          <Pressable
            onPress={() => router.back()}
            accessibilityRole="button"
            accessibilityLabel="Voltar ao Perfil"
            hitSlop={space.s1}
            style={({ pressed }) => [styles.back, pressed && styles.backPressed]}
          >
            <IconSymbol name="chevron.left" size={20} color={galaxyColors.textSecondary} />
            <Text style={styles.backLabel}>Perfil</Text>
          </Pressable>
          <Text style={styles.title} accessibilityRole="header">
            Configuração
          </Text>
        </View>

        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
        >
          <SubscriptionCard status={subscription} onOpen={() => router.push('/subscription')} />
          <ICloudBackupCard state={backup} onToggle={toggleBackup} busy={backupBusy} />
          <FeedbackPreferencesCard preferences={feedbackPreferences} onChange={changeFeedbackPreferences} />
          <AccountSyncCard />
          <LegalLinksCard
            footer={
              <AppButton
                label="Rever apresentação"
                variant="ghost"
                onPress={() => setShowWelcomeReplay(true)}
              />
            }
          />

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

      <Modal
        visible={showWelcomeReplay}
        animationType="slide"
        onRequestClose={() => setShowWelcomeReplay(false)}
      >
        {/* Aqui `onFinish` só fecha: rever não pode reescrever o estado de primeiro uso. */}
        <WelcomeFlowScreen onFinish={() => setShowWelcomeReplay(false)} />
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: galaxyColors.background },
  safe: { flex: 1 },
  header: {
    paddingHorizontal: space.s3,
    paddingTop: space.s1,
    paddingBottom: space.s3,
    gap: space.s2,
  },
  back: { flexDirection: 'row', alignItems: 'center', alignSelf: 'flex-start', gap: space.s0 },
  backPressed: { opacity: 0.7 },
  backLabel: { ...typography.bodyRegular, color: galaxyColors.textSecondary },
  title: { ...typography.h2, color: galaxyColors.textPrimary, fontWeight: '800' },
  scroll: { flex: 1 },
  content: {
    paddingHorizontal: space.s3,
    gap: space.s3,
    paddingBottom: space.s6,
  },
});
