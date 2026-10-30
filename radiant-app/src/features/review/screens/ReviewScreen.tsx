import React, { useEffect, useMemo, useRef, useState } from 'react';
import { DecorativeIcon } from '../../../components/ui/DecorativeIcon';
import { ActivityIndicator, Alert, Pressable, ScrollView, StyleSheet, Text, View, useWindowDimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { AppButton } from '../../../components/ui/AppButton';
import { StarfieldBackground } from '../../../ui/components/StarfieldBackground';
import { HUD } from '../../../ui/components/HUD';
import { ListRow } from '../../../ui/components/ListRow';
import { JourneyMedal } from '../../journey/components/JourneyMedal';
import { JourneyDefinitionService } from '../../journey/services/JourneyDefinitionService';
import { resolveNodeTheme } from '../../journey/services/resolveNodeTheme';
import { LessonCatalogService } from '../../content/services/LessonCatalogService';
import { ProductionCurriculumCatalog } from '../../student-checkpoints/ProductionCurriculumCatalog';
import { itemKey } from '../../../types/itemReview';
import type { ReviewItem } from '../hooks/useReview';
import { GamificationService } from '../../gamification/services/GamificationService';
import type { GamificationSnapshot } from '../../../types/gamification';
import { duration, useFadeInUp } from '../../../ui/motion';
import { galaxyColors } from '../../../ui/theme';
import { layout, radius, space, typography } from '../../../ui/styles';
import { PushOptInCard } from '../../push/components/PushOptInCard';
import { PushService } from '../../push/services/PushService';
import { ReviewCard } from '../components/ReviewCard';
import { useReview } from '../hooks/useReview';
import { RatingPromptService } from '../../../services/RatingPromptService';
import {
  STUDENT_CHECKPOINT_SHADOW_CONTENT_VERSION,
  useShadowCheckpoint,
} from '../../student-checkpoints/useShadowCheckpoint';
import { useActiveCheckpoint } from '../../student-checkpoints/useActiveCheckpoint';
import { heartsRepository } from '../../hearts/HeartsRepository';
import type { HeartsSnapshot } from '../../hearts/hearts.types';
import { useLargeTextLayout } from '../../../ui/accessibility/useLargeTextLayout';

const DEFAULT_HEARTS: HeartsSnapshot = {
  count: 5,
  status: 'full',
  nextRefillAt: null,
  unlimitedUntil: null,
};
const rewardedReviewQueues = new WeakSet<readonly unknown[]>();

const SCREEN_MAX_WIDTH = 720;
const ICON_BUTTON_SIZE = space.s6 + space.s4;

type ReviewScreenProps = {
  resumeCheckpointId?: string;
  resumeCursorId?: string;
};

function reviewHistory(item: ReviewItem, now: number): string {
  const reviewedAt = item.card?.lastReviewedAt ? Date.parse(item.card.lastReviewedAt) : NaN;
  if (!item.card?.lastAttemptId || !Number.isFinite(reviewedAt) || reviewedAt > now) {
    return 'Última revisão sem registro';
  }
  const reviewedDate = new Date(reviewedAt);
  const currentDate = new Date(now);
  const sameLocalDay = reviewedDate.getFullYear() === currentDate.getFullYear()
    && reviewedDate.getMonth() === currentDate.getMonth()
    && reviewedDate.getDate() === currentDate.getDate();
  if (sameLocalDay) return 'Revisado hoje';
  const days = Math.floor((now - reviewedAt) / 86400000);
  return days === 0 ? 'Revisado há menos de 1 dia' : `Revisado há ${days} ${days === 1 ? 'dia' : 'dias'}`;
}

function reviewRows(queue: ReviewItem[]) {
  const origins = LessonCatalogService.listTracks().flatMap(track =>
    JourneyDefinitionService.getTrackDefinition(track.id).units.flatMap(unit =>
      unit.nodes.filter(node => node.type === 'lesson' || node.type === 'checkpoint')
        .map(node => ({ node, unit, unitKey: `${track.id}:${unit.id}` }))));
  const now = Date.now();
  return queue.map(item => {
    const origin = origins.find(({ node }) => node.type === 'lesson' ? node.lessonId === item.lessonId
      : node.id === item.lessonId && ProductionCurriculumCatalog.getCheckpointByNodeId(item.lessonId) !== null);
    return {
      key: item.card ? itemKey(item.card.item) : JSON.stringify([item.lessonId, item.question.id]),
      origin,
      title: origin?.node.title ?? 'Origem desconhecida',
      detail: [origin?.unit.title, reviewHistory(item, now)].filter(Boolean).join(' · '),
    };
  });
}

export default function ReviewScreen({ resumeCheckpointId, resumeCursorId }: ReviewScreenProps) {
  const largeText = useLargeTextLayout();
  const { fontScale } = useWindowDimensions();
  const { state, queue, currentItem, currentIndex, totalItems, sessionXp, loading, startReview, submitAnswer, continueReview, answerFeedback, saving, persistenceError, retrySubmission } = useReview({
    resumeCursorId: resumeCheckpointId ? resumeCursorId : undefined,
  });
  const rows = useMemo(() => reviewRows(queue), [queue]);
  const originSummary = rows.every(row => !row.origin) ? 'origem desconhecida'
    : rows.every(row => row.origin?.unitKey === rows[0].origin?.unitKey) ? rows[0].origin!.unit.title
    : 'diferentes origens';
  const minutes = Math.round(queue.length * 40 / 60);
  const queueDescription = `${queue.length} ${queue.length === 1 ? 'item' : 'itens'} de ${originSummary}. Leva uns ${minutes} ${minutes === 1 ? 'minuto' : 'minutos'}.`;
  const retryRef = useRef(retrySubmission);
  retryRef.current = retrySubmission;
  useEffect(() => {
    if (persistenceError) Alert.alert('Revisão preservada', persistenceError, [
      { text: 'Tentar novamente', onPress: () => { void retryRef.current(); } },
      { text: 'Voltar à trilha', onPress: () => router.dismissTo('/(tabs)') },
    ]);
  }, [persistenceError]);
  const fadeAnim = useFadeInUp(duration.ui);
  const [showPushOptIn, setShowPushOptIn] = useState(false);
  const [gamification, setGamification] = useState<GamificationSnapshot | null>(null);
  const [hearts, setHearts] = useState<HeartsSnapshot>(DEFAULT_HEARTS);
  const rewardedReview = useRef(false);

  useEffect(() => {
    void GamificationService.getSnapshot().then(setGamification);
    void heartsRepository.getSnapshot(Date.now()).then(setHearts);
  }, []);

  useEffect(() => {
    if (state === 'start' || state === 'finished') {
      fadeAnim.animateIn();
    }
  }, [fadeAnim, state]);

  useEffect(() => {
    if (state === 'finished') {
      void GamificationService.getSnapshot().then(setGamification);
      void checkPushOptIn();
      void RatingPromptService.maybePromptForReview({
        trigger: 'review_complete',
        entrySurface: 'review_summary',
        itemsCount: totalItems,
      });
    }
  }, [state, totalItems]);

  useEffect(() => {
    if (state !== 'finished') {
      rewardedReview.current = false;
      return;
    }

    if (totalItems === 0 || rewardedReview.current || rewardedReviewQueues.has(queue)) return;
    rewardedReview.current = true;
    rewardedReviewQueues.add(queue);
    void heartsRepository.rewardReview(Date.now())
      .then(setHearts)
      .catch((cause) => {
        rewardedReview.current = false;
        rewardedReviewQueues.delete(queue);
        console.error('[ReviewScreen] Falha ao recompensar a revisão:', cause);
      });
  }, [queue, state, totalItems]);

  const checkPushOptIn = async () => {
    const canShow = await PushService.getOptIn();
    if (canShow === null) {
      setShowPushOptIn(true);
    }
  };

  const progressValue = useMemo(() => {
    if (totalItems === 0) {
      return 0;
    }

    if (state === 'finished') {
      return totalItems;
    }

    if (state === 'review') {
      return currentIndex + 1;
    }

    return 0;
  }, [currentIndex, state, totalItems]);

  const reviewCursorId = currentItem?.question.id ?? `review-${state}`;
  useShadowCheckpoint({
    surface: 'review',
    flowId: 'review-session-v1',
    contentVersion: STUDENT_CHECKPOINT_SHADOW_CONTENT_VERSION,
    cursorId: reviewCursorId,
    compatibleCursorIds: [
      'review-start',
      'review-finished',
      ...queue.map((item) => item.question.id),
    ],
    progressPercent: Math.round((progressValue / Math.max(totalItems, 1)) * 100),
    completedStepCount: progressValue,
    totalStepCount: Math.max(totalItems, 1),
    reviewCardId: currentItem?.question.id,
  });
  const handleRestoreFallback = React.useCallback(() => {
    Alert.alert(
      'Vamos continuar pela jornada',
      'Não foi possível retomar esse ponto com segurança. Seu progresso confirmado foi preservado.',
    );
    router.dismissTo('/(tabs)');
  }, []);
  const activeCheckpoint = useActiveCheckpoint({
    surface: 'review',
    flowId: 'review-session-v1',
    contentVersion: STUDENT_CHECKPOINT_SHADOW_CONTENT_VERSION,
    cursorId: reviewCursorId,
    compatibleCursorIds: ['review-start', ...queue.map((item) => item.question.id)],
    progressPercent: Math.round((progressValue / Math.max(totalItems, 1)) * 100),
    completedStepCount: progressValue,
    totalStepCount: Math.max(totalItems, 1),
    reviewCardId: currentItem?.question.id,
    enabled: !loading,
    resumeCheckpointId,
    onRestoreFallback: handleRestoreFallback,
  });

  useEffect(() => {
    if (state === 'finished') void activeCheckpoint.finish();
  }, [activeCheckpoint, state]);

  if (loading) {
    return (
      <View style={styles.root}>
        <StarfieldBackground backgroundColor={galaxyColors.background} starCount={120} />
        <SafeAreaView style={styles.safe}>
          <View style={styles.centered}>
            <ActivityIndicator size="large" color={galaxyColors.ctaGradientEnd} />
          </View>
        </SafeAreaView>
      </View>
    );
  }

  if (state === 'start') {
    const hasItems = queue.length > 0;

    return (
      <View style={styles.root}>
        <StarfieldBackground backgroundColor={galaxyColors.background} starCount={120} />
        <SafeAreaView style={styles.safe} edges={['top']}>
          <HUD
            totalXp={gamification?.totalXp ?? 0}
            streakDays={gamification?.streakDays ?? 0}
            hearts={hearts.count}
            maxHearts={5}
            heartsSnapshot={hearts}
          />
          <ScrollView key="review-start" contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
            <View style={styles.headerRow}>
              <Pressable
                onPress={() => router.dismissTo('/(tabs)')}
                accessibilityRole="button"
                accessibilityLabel="Fechar revisão"
                style={styles.iconButton}
              >
                <DecorativeIcon name="close" size={22} color={galaxyColors.textPrimary} />
              </Pressable>
              <Text key={`header-${fontScale}`} style={styles.headerLabel} accessibilityRole="header">Revisão</Text>
              <View style={styles.iconSpacer} />
            </View>

            {persistenceError ? (
              <View style={styles.message}>
                <Text key={`error-title-${fontScale}`} style={styles.sectionTitle} accessibilityRole="header">Revisão indisponível</Text>
                <Text key={`error-body-${fontScale}`} style={styles.actionBody}>{persistenceError}</Text>
              </View>
            ) : hasItems ? (
              <>
                <Text key={`count-${fontScale}`} style={styles.actionBody}>{queueDescription}</Text>
                <View>
                  {rows.map(row => <ListRow
                    key={row.key}
                    title={row.title}
                    detail={row.detail}
                    leading={row.origin ? <JourneyMedal
                      node={row.origin.node}
                      theme={resolveNodeTheme(row.origin.node, row.origin.unit)}
                      state="next"
                      pulsing={false}
                      visible={false}
                      size={17}
                      accessibilityLabel={row.title}
                    /> : undefined}
                  />)}
                </View>
                <Text key={`instructions-${fontScale}`} style={styles.actionBody}>
                  Escolha uma alternativa e confirme, ou consulte a resposta com ajuda
                </Text>
              </>
            ) : (
              <View style={styles.message}>
                <Text key={`empty-title-${fontScale}`} style={styles.sectionTitle} accessibilityRole="header">Nenhuma revisão pendente</Text>
                <Text key={`empty-body-${fontScale}`} style={styles.actionBody}>Sua fila está em dia. Continue sua jornada.</Text>
              </View>
            )}
          </ScrollView>
          <View style={styles.footer}>
            {persistenceError ? <AppButton onPress={() => { void retrySubmission(); }} style={styles.fullWidthButton}>Tentar novamente</AppButton>
              : hasItems ? <AppButton onPress={startReview} style={styles.fullWidthButton}>Começar</AppButton>
                : <AppButton onPress={() => router.dismissTo('/(tabs)')} style={styles.fullWidthButton}>Voltar para jornada</AppButton>}
          </View>
        </SafeAreaView>
      </View>
    );
  }

  if (state === 'finished') {
    return (
      <View style={styles.root}>
        <StarfieldBackground backgroundColor={galaxyColors.background} starCount={120} />
        <SafeAreaView style={styles.safe} edges={['top']}>
          <HUD
            totalXp={gamification?.totalXp ?? 0}
            streakDays={gamification?.streakDays ?? 0}
            hearts={hearts.count}
            maxHearts={5}
            heartsSnapshot={hearts}
          />
          <ScrollView key="review-finished" contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
            <View style={styles.headerRow}>
              <Pressable
                onPress={() => router.dismissTo('/(tabs)')}
                accessibilityRole="button"
                accessibilityLabel="Fechar revisão"
                style={styles.iconButton}
              >
                <DecorativeIcon name="close" size={22} color={galaxyColors.textPrimary} />
              </Pressable>
              <Text key={`header-${fontScale}`} style={styles.headerLabel} accessibilityRole="header">Revisão</Text>
              <View style={styles.iconSpacer} />
            </View>

            <View style={styles.sectionCard}>
              <Text key={`section-${fontScale}`} style={styles.sectionTitle} accessibilityRole="header">Resultado da sessão</Text>
              <View style={styles.statsList}>
                <ListRow title="Itens" detail={`${totalItems} ${totalItems === 1 ? 'concluído' : 'concluídos'} nesta rodada`} />
                <ListRow title="XP" detail={`+${sessionXp} XP confirmado`} />
                <ListRow title="Estado" detail="Revisão salva neste aparelho" />
              </View>
            </View>

            {showPushOptIn ? (
              <View style={styles.pushCard}>
                <PushOptInCard onDismiss={() => setShowPushOptIn(false)} />
              </View>
            ) : null}

            <View style={styles.actionCard}>
              <Text key={`action-title-${fontScale}`} style={styles.actionTitle}>Fila limpa</Text>
              <Text key={`action-body-${fontScale}`} style={styles.actionBody}>
                A próxima decisão agora volta para a jornada principal. Revise só quando realmente estiver devido.
              </Text>
              <AppButton onPress={() => router.dismissTo('/(tabs)')} style={styles.fullWidthButton}>
                Voltar para jornada
              </AppButton>
            </View>
          </ScrollView>
        </SafeAreaView>
      </View>
    );
  }

  return (
    <View style={styles.root}>
      <StarfieldBackground backgroundColor={galaxyColors.background} starCount={80} />
      <SafeAreaView style={styles.safe} edges={['top']}>
        <HUD
          totalXp={gamification?.totalXp ?? 0}
          streakDays={gamification?.streakDays ?? 0}
          hearts={hearts.count}
          maxHearts={5}
          heartsSnapshot={hearts}
          compact
        />
        <ScrollView
          key={`review-active:${currentItem?.question.id}`}
          style={layout.container}
          contentContainerStyle={styles.activeLayout}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.headerRow}>
            <Pressable
              onPress={() => router.dismissTo('/(tabs)')}
              accessibilityRole="button"
              accessibilityLabel="Fechar revisão"
              style={styles.iconButton}
            >
              <DecorativeIcon name="close" size={22} color={galaxyColors.textPrimary} />
            </Pressable>
            <Text key={`header-${fontScale}`} style={styles.headerLabel} accessibilityRole="header">Revisão</Text>
            <Text key={`progress-${fontScale}`} style={styles.headerProgressText}>{progressValue}/{Math.max(totalItems, 1)}</Text>
          </View>

          <View style={styles.activeHeroCard}>
            <View style={[styles.activeHeroHeader, largeText && styles.activeHeroHeaderStacked]}>
              <View style={[styles.activeHeroCopy, largeText && styles.activeHeroCopyStacked]}>
                <Text key={`active-title-${fontScale}`} style={styles.activeTitle}>Sessão ativa</Text>
                <Text key={`active-body-${fontScale}`} style={styles.activeBody}>
                  Escolha uma alternativa e confirme. Depois, confira a explicação no seu ritmo. Se precisar, consulte a resposta com ajuda.
                </Text>
              </View>

            </View>
          </View>

          <View style={styles.focusArea}>
            {currentItem ? <ReviewCard key={`${currentItem.lessonId}:${currentItem.question.id}`}
              question={currentItem.question} onAnswer={submitAnswer} onContinue={continueReview}
              feedback={answerFeedback ?? null} saving={saving ?? false} /> : null}
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: galaxyColors.background },
  safe: { flex: 1 },
  centered: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  content: { padding: space.s3, gap: space.s3, paddingBottom: space.s5, maxWidth: SCREEN_MAX_WIDTH, width: '100%', alignSelf: 'center' },
  footer: { padding: space.s3, paddingBottom: space.s5, maxWidth: SCREEN_MAX_WIDTH, width: '100%', alignSelf: 'center' },
  message: { gap: space.s2 },
  activeLayout: { flexGrow: 1, padding: space.s3, gap: space.s3, maxWidth: SCREEN_MAX_WIDTH, width: '100%', alignSelf: 'center' },
  headerRow: { ...layout.rowBetween, width: '100%' },
  iconButton: {
    width: ICON_BUTTON_SIZE,
    height: ICON_BUTTON_SIZE,
    borderRadius: radius.rXl,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.07)',
    borderWidth: 1,
    borderColor: galaxyColors.border,
  },
  iconSpacer: { width: ICON_BUTTON_SIZE, height: ICON_BUTTON_SIZE },
  headerLabel: {
    ...typography.h3,
    lineHeight: undefined,
    color: galaxyColors.textPrimary,
    flexShrink: 1,
  },
  headerProgressText: {
    ...typography.caption,
    color: galaxyColors.textSecondary,
    textAlign: 'right',
    flexShrink: 1,
    lineHeight: undefined,
  },
  sectionCard: {
    backgroundColor: galaxyColors.surface,
    borderRadius: radius.rLg,
    borderWidth: 1,
    borderColor: galaxyColors.border,
    padding: space.s3,
    gap: space.s2,
  },
  sectionTitle: { ...typography.h3, lineHeight: undefined, color: galaxyColors.textPrimary },
  statsList: { gap: space.s2, marginTop: space.s1 },
  actionCard: {
    backgroundColor: 'rgba(255,255,255,0.03)',
    borderRadius: radius.rLg,
    borderWidth: 1,
    borderColor: galaxyColors.border,
    padding: space.s3,
    gap: space.s2,
  },
  actionTitle: { ...typography.h3, lineHeight: undefined, color: galaxyColors.textPrimary },
  actionBody: { ...typography.bodyRegular, lineHeight: undefined, color: galaxyColors.textSecondary },
  fullWidthButton: { width: '100%' },
  pushCard: { width: '100%', maxWidth: SCREEN_MAX_WIDTH, alignSelf: 'center' },
  activeHeroCard: {
    backgroundColor: galaxyColors.surface,
    borderRadius: radius.rLg,
    borderWidth: 1,
    borderColor: galaxyColors.border,
    padding: space.s3,
    gap: space.s2,
  },
  activeHeroHeader: { flexDirection: 'row', alignItems: 'center', gap: space.s3 },
  activeHeroHeaderStacked: { flexDirection: 'column', alignItems: 'stretch' },
  activeHeroCopy: { flex: 1, gap: space.s1 },
  activeHeroCopyStacked: { flex: 0 },
  activeTitle: { ...typography.h3, lineHeight: undefined, color: galaxyColors.textPrimary },
  activeBody: { ...typography.bodyRegular, lineHeight: undefined, color: galaxyColors.textSecondary },
  focusArea: { width: '100%' },
});
