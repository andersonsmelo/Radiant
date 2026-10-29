import React, { useCallback, useRef, useState } from 'react';
import { Modal, Pressable, ScrollView, StyleSheet, Text, View, useWindowDimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useFocusEffect } from 'expo-router';
import { IconSymbol } from '../../../../components/ui/icon-symbol';
import { AppConfig } from '../../../config';
import { AppButton } from '../../../components/ui/AppButton';
import { DAILY_GOAL_TIERS, type DailyGoalTierId } from '../../../constants/dailyGoal';
import type { DailyGoalSnapshot } from '../../../types/dailyGoal';
import { DailyGoalService } from '../../daily-goal/services/DailyGoalService';
import WelcomeFlowScreen from '../../first-run/screens/WelcomeFlowScreen';
import { FeedbackPreferencesCard } from '../../profile/components/FeedbackPreferencesCard';
import { AccountSyncCard } from '../../progress/components/AccountSyncCard';
import { LegalLinksCard } from '../../progress/components/LegalLinksCard';
import { ICloudBackupCard } from '../../progress-sync/components/ICloudBackupCard';
import { CloudKitPrivateAdapter, resolvePrivateCloudAdapter } from '../../progress-sync/CloudKitPrivateAdapter';
import { progressSyncService } from '../../progress-sync/ProgressSyncService';
import type { BackupState } from '../../progress-sync/progressSync.types';
import { ReminderRow } from '../../push/components/ReminderRow';
import { SubscriptionCard } from '../../subscription/components/SubscriptionCard';
import { subscriptionService } from '../../subscription/SubscriptionService';
import type { SubscriptionStatus } from '../../subscription/subscription.types';
import { GroupedList } from '../../../ui/components/GroupedList';
import { StarfieldBackground } from '../../../ui/components/StarfieldBackground';
import { readFeedbackPreferences, writeFeedbackPreferences, type FeedbackPreferences } from '../../../ui/feedback/feedbackPreferences';
import { galaxyColors } from '../../../ui/theme';
import { space, typography } from '../../../ui/styles';

type Reading<T> = { state: 'loading' } | { state: 'ready'; data: T } | { state: 'unavailable' };

/** Preferências e destinos existentes. Capacidade do binário não se confunde com falha de rede. */
export default function SettingsScreen() {
  const { fontScale } = useWindowDimensions();
  const [subscription, setSubscription] = useState<SubscriptionStatus | null>(null);
  const [backup, setBackup] = useState<BackupState | null>(null);
  const [backupAvailable] = useState(() => resolvePrivateCloudAdapter() instanceof CloudKitPrivateAdapter);
  const [backupBusy, setBackupBusy] = useState(false);
  const backupBusyRef = useRef(false);
  const backupPending = useRef<Promise<void>>(Promise.resolve());
  const [feedbackPreferences, setFeedbackPreferences] = useState<FeedbackPreferences | null>(null);
  const [feedbackError, setFeedbackError] = useState(false);
  const feedbackRevision = useRef(0);
  const feedbackQueue = useRef<Promise<unknown>>(Promise.resolve());
  const [goal, setGoal] = useState<Reading<DailyGoalSnapshot>>({ state: 'loading' });
  const [goalExpanded, setGoalExpanded] = useState(false);
  const [goalSaving, setGoalSaving] = useState(false);
  const [goalSaveError, setGoalSaveError] = useState(false);
  const goalSavingRef = useRef(false);
  const goalPending = useRef<Promise<void>>(Promise.resolve());
  const generation = useRef(0);
  const [showWelcomeReplay, setShowWelcomeReplay] = useState(false);

  useFocusEffect(useCallback(() => {
    const ownGeneration = ++generation.current;
    const ownFeedbackRevision = feedbackRevision.current;
    setGoal({ state: 'loading' });
    setGoalSaving(goalSavingRef.current);
    setGoalSaveError(false);
    setFeedbackError(false);
    const active = () => generation.current === ownGeneration;
    void subscriptionService.getStatus(Date.now()).then(value => { if (active()) setSubscription(value); }, () => { if (active()) setSubscription({ kind: 'none' }); });
    setBackupBusy(backupBusyRef.current);
    void backupPending.current.then(() => progressSyncService.getState()).then(value => { if (active()) setBackup(value); }, () => {
      if (active()) setBackup({ enabled: false, decided: false, lastBackupAt: null, lastError: 'failed' });
    }).finally(() => { if (active()) setBackupBusy(false); });
    // Aguarda as escritas já solicitadas; uma releitura não deve publicar um valor anterior a elas.
    void feedbackQueue.current.then(() => readFeedbackPreferences()).then(value => {
      if (active() && ownFeedbackRevision === feedbackRevision.current) setFeedbackPreferences(value);
    });
    void goalPending.current.then(() => DailyGoalService.getSnapshot()).then(data => { if (active()) setGoal({ state: 'ready', data }); }, () => { if (active()) setGoal({ state: 'unavailable' }); })
      .finally(() => { if (active()) setGoalSaving(false); });
    return () => { generation.current++; };
  }, []));

  const toggleBackup = useCallback((enabled: boolean) => {
    if (!backupAvailable || backupBusyRef.current) return;
    backupBusyRef.current = true;
    setBackupBusy(true);
    const ownGeneration = generation.current;
    backupPending.current = progressSyncService.setEnabled(enabled, Date.now()).then(value => {
      if (generation.current === ownGeneration) setBackup(value);
    }, () => {
      if (generation.current === ownGeneration) setBackup(current => ({ enabled, decided: true, lastBackupAt: current?.lastBackupAt ?? null, lastError: 'failed' }));
    }).finally(() => {
      backupBusyRef.current = false;
      if (generation.current === ownGeneration) setBackupBusy(false);
    });
  }, [backupAvailable]);

  const changeFeedbackPreferences = useCallback((next: FeedbackPreferences) => {
    feedbackRevision.current++;
    setFeedbackPreferences(next);
    setFeedbackError(false);
    const ownGeneration = generation.current;
    feedbackQueue.current = feedbackQueue.current.then(() => writeFeedbackPreferences(next)).catch(() => {
      if (generation.current === ownGeneration) setFeedbackError(true);
    });
  }, []);

  const selectTier = useCallback((tier: DailyGoalTierId) => {
    if (goalSavingRef.current) return;
    goalSavingRef.current = true;
    setGoalSaving(true);
    setGoalSaveError(false);
    const ownGeneration = generation.current;
    goalPending.current = DailyGoalService.setTier(tier).then(data => {
      if (generation.current === ownGeneration) setGoal({ state: 'ready', data });
    }, () => { if (generation.current === ownGeneration) setGoalSaveError(true); }).finally(() => {
      goalSavingRef.current = false;
      if (generation.current === ownGeneration) setGoalSaving(false);
    });
  }, []);

  const snapshot = goal.state === 'ready' ? goal.data : null;
  const goalTarget = snapshot?.goalXp ?? snapshot?.goalPerDay;
  const validGoal = typeof goalTarget === 'number' && Number.isFinite(goalTarget) && goalTarget > 0;
  const tier = DAILY_GOAL_TIERS.find(option => option.id === snapshot?.tierId);
  return <View style={styles.root}>
    <StarfieldBackground backgroundColor={galaxyColors.background} starCount={120} />
    <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} accessibilityRole="button" accessibilityLabel="Voltar ao Perfil" hitSlop={space.s1}
          style={({ pressed }) => [styles.back, pressed && styles.pressed]}>
          <IconSymbol name="chevron.left" size={20} color={galaxyColors.navBlue} />
          <Text key={`back-${fontScale}`} style={styles.backLabel}>Perfil</Text>
        </Pressable>
        <Text key={`title-${fontScale}`} style={styles.title} accessibilityRole="header">Ajustes</Text>
      </View>
      <ScrollView style={styles.scroll} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <SubscriptionCard status={subscription} onOpen={() => router.push('/subscription')} />
        <FeedbackPreferencesCard preferences={feedbackPreferences} onChange={changeFeedbackPreferences} />
        {feedbackError ? <Text key={`feedback-error-${fontScale}`} style={styles.detail} accessibilityRole="alert">Não foi possível salvar sons e vibração. Tente novamente.</Text> : null}
        <GroupedList header="Lembrete"><ReminderRow visible /></GroupedList>
        <GroupedList header="Meta diária">
          {goal.state === 'loading' ? <Text key={`goal-loading-${fontScale}`} style={styles.message}>Carregando meta…</Text>
            : !validGoal ? <Text key={`goal-unavailable-${fontScale}`} style={styles.message}>Meta diária indisponível</Text>
              : <View>
                <Pressable accessibilityRole="button" accessibilityLabel={`Meta diária: ${tier?.label ?? 'nível sem registro'}`}
                  accessibilityState={{ expanded: goalExpanded, disabled: goalSaving, busy: goalSaving }} disabled={goalSaving}
                  onPress={() => setGoalExpanded(previous => !previous)} style={styles.row}>
                  <View style={styles.copy}>
                    <Text key={`goal-label-${fontScale}`} style={styles.label}>Meta diária</Text>
                    <Text key={`goal-tier-${fontScale}`} style={styles.detail}>{tier ? `${tier.label} · ${goalTarget} XP` : 'Nível sem registro'}</Text>
                  </View>
                  <IconSymbol name="chevron.right" size={20} color={galaxyColors.textSecondary} />
                </Pressable>
                {goalExpanded ? <View accessibilityRole="radiogroup" accessibilityLabel="Escolha sua meta diária">
                  {DAILY_GOAL_TIERS.map(option => <Pressable key={option.id} accessibilityRole="radio" accessibilityLabel={`${option.label}, ${option.xp} XP`}
                    accessibilityState={{ checked: snapshot?.tierId === option.id, disabled: goalSaving }} disabled={goalSaving}
                    onPress={() => selectTier(option.id)} style={[styles.option, snapshot?.tierId === option.id && styles.selected]}>
                    <Text key={`option-${fontScale}`} style={styles.label}>{option.label} · {option.xp} XP</Text>
                  </Pressable>)}
                </View> : null}
                {goalSaving ? <Text key={`goal-saving-${fontScale}`} style={styles.message} accessibilityLiveRegion="polite">Salvando meta…</Text> : null}
              </View>}
          {goalSaveError ? <Text key={`goal-error-${fontScale}`} style={styles.message} accessibilityRole="alert">Não foi possível salvar a meta. Tente novamente.</Text> : null}
        </GroupedList>
        <ICloudBackupCard state={backup} available={backupAvailable} onToggle={toggleBackup} busy={backupBusy} />
        <LegalLinksCard footer={<Pressable accessibilityRole="button" accessibilityLabel="Rever a apresentação" onPress={() => setShowWelcomeReplay(true)} style={styles.row}>
          <Text key={`replay-${fontScale}`} style={[styles.label, styles.copy]}>Rever a apresentação</Text>
          <IconSymbol name="chevron.right" size={20} color={galaxyColors.textSecondary} />
        </Pressable>} />
        <AccountSyncCard />
        {AppConfig.SHOW_DEV_TOOLS ? <AppButton variant="ghost" onPress={() => router.push('/dev-console')}
          accessibilityLabel="Abrir o console de desenvolvimento" accessibilityHint="Ferramentas de homologação. Não aparece no build do aluno.">Console de desenvolvimento</AppButton> : null}
      </ScrollView>
    </SafeAreaView>
    <Modal visible={showWelcomeReplay} animationType="slide" onRequestClose={() => setShowWelcomeReplay(false)}>
      <WelcomeFlowScreen onFinish={() => setShowWelcomeReplay(false)} />
    </Modal>
  </View>;
}
const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: galaxyColors.background },
  safe: { flex: 1 },
  header: { paddingHorizontal: space.s3, paddingTop: space.s1, paddingBottom: space.s3, gap: space.s2 },
  back: { minHeight: 48, flexDirection: 'row', alignItems: 'center', alignSelf: 'flex-start', gap: space.s0 },
  pressed: { opacity: 0.7 },
  backLabel: { ...typography.bodyRegular, lineHeight: undefined, color: galaxyColors.navBlue },
  title: { ...typography.h2, lineHeight: undefined, color: galaxyColors.textPrimary },
  scroll: { flex: 1 },
  content: { paddingHorizontal: space.s3, gap: space.s5, paddingBottom: space.s6 },
  row: { minHeight: 56, flexDirection: 'row', alignItems: 'center', gap: space.s2, paddingVertical: space.s2 },
  copy: { flex: 1, minWidth: 0, gap: space.s0 },
  label: { ...typography.bodyRegular, lineHeight: undefined, color: galaxyColors.textPrimary, flexShrink: 1 },
  detail: { ...typography.bodyRegular, lineHeight: undefined, color: galaxyColors.textSecondary },
  message: { ...typography.bodyRegular, lineHeight: undefined, color: galaxyColors.textSecondary, paddingVertical: space.s2 },
  option: { minHeight: 48, paddingVertical: space.s2, borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: galaxyColors.border },
  selected: { backgroundColor: galaxyColors.surfaceActive },
});
