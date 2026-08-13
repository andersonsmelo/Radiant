import React, { useEffect, useMemo, useState } from 'react';
import { DecorativeIcon } from '../../../components/ui/DecorativeIcon';
import { ActivityIndicator, Alert, Animated, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { AppButton } from '../../../components/ui/AppButton';
import { PixelHeroSplit } from '../../../components/ui/PixelHeroSplit';
import { ProgressRing } from '../../../components/ui/ProgressRing';
import { StarfieldBackground } from '../../../ui/components/StarfieldBackground';
import { HUD } from '../../../ui/components/HUD';
import { GalaxyStatRow } from '../../../ui/components/GalaxyStatRow';
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

const SCREEN_MAX_WIDTH = 720;
const ICON_BUTTON_SIZE = space.s6 + space.s4;

type ReviewScreenProps = {
  resumeCheckpointId?: string;
  resumeCursorId?: string;
};

export default function ReviewScreen({ resumeCheckpointId, resumeCursorId }: ReviewScreenProps) {
  const { state, queue, currentItem, currentIndex, totalItems, sessionXp, loading, startReview, submitRating } = useReview({
    resumeCursorId: resumeCheckpointId ? resumeCursorId : undefined,
  });
  const fadeAnim = useFadeInUp(duration.ui);
  const [showPushOptIn, setShowPushOptIn] = useState(false);
  const [gamification, setGamification] = useState<GamificationSnapshot | null>(null);

  useEffect(() => {
    void GamificationService.getSnapshot().then(setGamification);
  }, []);

  useEffect(() => {
    if (state === 'start' || state === 'finished') {
      fadeAnim.animateIn();
    }
  }, [fadeAnim, state]);

  useEffect(() => {
    if (state === 'finished') {
      void checkPushOptIn();
      void RatingPromptService.maybePromptForReview({
        trigger: 'review_complete',
        entrySurface: 'review_summary',
        itemsCount: totalItems,
      });
    }
  }, [state, totalItems]);

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
    router.replace('/(tabs)');
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
            hearts={gamification?.hearts ?? 5}
            maxHearts={gamification?.maxHearts ?? 5}
          />
          <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
            <View style={styles.headerRow}>
              <Pressable
                onPress={() => router.replace('/(tabs)')}
                accessibilityRole="button"
                accessibilityLabel="Fechar revisão"
                style={styles.iconButton}
              >
                <DecorativeIcon name="close" size={22} color={galaxyColors.textPrimary} />
              </Pressable>
              <Text style={styles.headerLabel}>Revisão</Text>
              <View style={styles.iconSpacer} />
            </View>

            <Animated.View style={fadeAnim.style}>
              <View style={styles.heroCard}>
                <PixelHeroSplit
                  eyebrow="Repetição espaçada"
                  message={hasItems ? 'Você tem uma fila curta e objetiva. Fecha isso agora e mantém a curva de retenção saudável.' : 'Sem pendências críticas. Sua trilha está limpa por enquanto.'}
                  ringValue={0}
                  ringTotal={Math.max(queue.length, 1)}
                  ringLabel={hasItems ? `${queue.length} itens na fila` : 'Nenhum item agora'}
                  state={hasItems ? 'guide' : 'idle'}
                  tier={hasItems ? 'intermediate' : 'starter'}
                  accessibilityLabel="Pixel guiando a revisão"
                />
              </View>
            </Animated.View>

            <View style={styles.sectionCard}>
              <Text style={styles.sectionTitle} accessibilityRole="header">Como essa sessão funciona</Text>
              <View style={styles.statsList}>
                <GalaxyStatRow
                  icon={<DecorativeIcon name="flash-on" size={20} color={galaxyColors.ctaGradientEnd} />}
                  label="Formato"
                  value="Uma pergunta por item, resposta rápida e rating direto"
                />
                <GalaxyStatRow
                  icon={<DecorativeIcon name="timeline" size={20} color={galaxyColors.ctaGradientEnd} />}
                  label="Objetivo"
                  value="Consolidar memória antes de puxar conteúdo novo"
                />
                <GalaxyStatRow
                  icon={<DecorativeIcon name="workspace-premium" size={20} color={galaxyColors.ctaGradientEnd} />}
                  label="Recompensa"
                  value="XP só entra quando você realmente acerta"
                />
              </View>
            </View>

            <View style={styles.actionCard}>
              <Text style={styles.actionTitle}>{hasItems ? 'Pronto para limpar a fila?' : 'Nenhuma revisão pendente'}</Text>
              <Text style={styles.actionBody}>
                {hasItems
                  ? 'A sessão está curta o suficiente para caber agora. Não vale adiar uma fila desse tamanho.'
                  : 'Você pode voltar para a jornada e continuar o próximo nó recomendado.'}
              </Text>
              {hasItems ? (
                <AppButton onPress={startReview} style={styles.fullWidthButton}>
                  Começar revisão
                </AppButton>
              ) : (
                <AppButton onPress={() => router.replace('/(tabs)')} style={styles.fullWidthButton}>
                  Voltar para jornada
                </AppButton>
              )}
            </View>
          </ScrollView>
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
            hearts={gamification?.hearts ?? 5}
            maxHearts={gamification?.maxHearts ?? 5}
          />
          <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
            <View style={styles.headerRow}>
              <Pressable
                onPress={() => router.replace('/(tabs)')}
                accessibilityRole="button"
                accessibilityLabel="Fechar revisão"
                style={styles.iconButton}
              >
                <DecorativeIcon name="close" size={22} color={galaxyColors.textPrimary} />
              </Pressable>
              <Text style={styles.headerLabel}>Revisão</Text>
              <View style={styles.iconSpacer} />
            </View>

            <Animated.View style={fadeAnim.style}>
              <View style={styles.heroCard}>
                <PixelHeroSplit
                  eyebrow="Sessão concluída"
                  message="Boa. Você fechou a fila de revisão e devolveu estabilidade para a trilha."
                  ringValue={totalItems}
                  ringTotal={Math.max(totalItems, 1)}
                  ringLabel="Fila encerrada"
                  state="celebrate"
                  tier="advanced"
                  accessibilityLabel="Pixel celebrando a revisão"
                />
              </View>
            </Animated.View>

            <View style={styles.sectionCard}>
              <Text style={styles.sectionTitle} accessibilityRole="header">Resultado da sessão</Text>
              <View style={styles.statsList}>
                <GalaxyStatRow
                  icon={<DecorativeIcon name="task-alt" size={20} color={galaxyColors.ctaGradientEnd} />}
                  label="Itens"
                  value={`${totalItems} concluídos nesta rodada`}
                />
                <GalaxyStatRow
                  icon={<DecorativeIcon name="stars" size={20} color={galaxyColors.ctaGradientEnd} />}
                  label="XP"
                  value={`+${sessionXp} XP confirmado`}
                />
                <GalaxyStatRow
                  icon={<DecorativeIcon name="sync" size={20} color={galaxyColors.ctaGradientEnd} />}
                  label="Estado"
                  value="Cards já atualizados no fluxo local-first"
                />
              </View>
            </View>

            {showPushOptIn ? (
              <View style={styles.pushCard}>
                <PushOptInCard onDismiss={() => setShowPushOptIn(false)} />
              </View>
            ) : null}

            <View style={styles.actionCard}>
              <Text style={styles.actionTitle}>Fila limpa</Text>
              <Text style={styles.actionBody}>
                A próxima decisão agora volta para a jornada principal. Revise só quando realmente estiver devido.
              </Text>
              <AppButton onPress={() => router.replace('/(tabs)')} style={styles.fullWidthButton}>
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
          hearts={gamification?.hearts ?? 5}
          maxHearts={gamification?.maxHearts ?? 5}
          compact
        />
        <View style={[layout.container, styles.activeLayout]}>
          <View style={styles.headerRow}>
            <Pressable
              onPress={() => router.replace('/(tabs)')}
              accessibilityRole="button"
              accessibilityLabel="Fechar revisão"
              style={styles.iconButton}
            >
              <DecorativeIcon name="close" size={22} color={galaxyColors.textPrimary} />
            </Pressable>
            <Text style={styles.headerLabel}>Revisão</Text>
            <Text style={styles.headerProgressText}>{progressValue}/{Math.max(totalItems, 1)}</Text>
          </View>

          <View style={styles.activeHeroCard}>
            <View style={styles.activeHeroHeader}>
              <View style={styles.activeHeroCopy}>
                <Text style={styles.activeTitle}>Sessão ativa</Text>
                <Text style={styles.activeBody}>
                  Responda rápido, revele a resposta e classifique sem hesitar. O objetivo aqui é retenção, não exploração.
                </Text>
              </View>
              <ProgressRing
                value={progressValue}
                total={Math.max(totalItems, 1)}
                label="Progresso"
                size={space.s6 * 3}
              />
            </View>
          </View>

          <View style={styles.focusArea}>
            {currentItem ? <ReviewCard question={currentItem.question} onRate={submitRating} /> : null}
          </View>
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: galaxyColors.background },
  safe: { flex: 1 },
  centered: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  content: { padding: space.s3, gap: space.s3, paddingBottom: space.s5 },
  activeLayout: { flex: 1, padding: space.s3, gap: space.s3, maxWidth: SCREEN_MAX_WIDTH },
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
    fontSize: 13,
    fontWeight: '800',
    color: 'rgba(255,255,255,0.35)',
    letterSpacing: 3,
    textTransform: 'uppercase',
  },
  headerProgressText: {
    ...typography.caption,
    color: galaxyColors.textSecondary,
    width: ICON_BUTTON_SIZE,
    textAlign: 'right',
  },
  heroCard: {
    backgroundColor: galaxyColors.surface,
    borderRadius: radius.rLg,
    borderWidth: 1,
    borderColor: galaxyColors.border,
    padding: space.s3,
    gap: space.s3,
    overflow: 'hidden',
  },
  sectionCard: {
    backgroundColor: galaxyColors.surface,
    borderRadius: radius.rLg,
    borderWidth: 1,
    borderColor: galaxyColors.border,
    padding: space.s3,
    gap: space.s2,
  },
  sectionTitle: { ...typography.h3, color: galaxyColors.textPrimary },
  statsList: { gap: space.s2, marginTop: space.s1 },
  actionCard: {
    backgroundColor: 'rgba(255,255,255,0.03)',
    borderRadius: radius.rLg,
    borderWidth: 1,
    borderColor: galaxyColors.border,
    padding: space.s3,
    gap: space.s2,
  },
  actionTitle: { ...typography.h3, color: galaxyColors.textPrimary },
  actionBody: { ...typography.bodyRegular, color: galaxyColors.textSecondary },
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
  activeHeroCopy: { flex: 1, gap: space.s1 },
  activeTitle: { ...typography.h3, color: galaxyColors.textPrimary },
  activeBody: { ...typography.bodyRegular, color: galaxyColors.textSecondary },
  focusArea: { flex: 1, justifyContent: 'center' },
});
