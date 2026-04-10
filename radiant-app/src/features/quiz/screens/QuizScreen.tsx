import React, { useEffect, useState } from 'react';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { ActivityIndicator, Animated, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { AppButton } from '../../../components/ui/AppButton';
import { PixelHeroSplit } from '../../../components/ui/PixelHeroSplit';
import { ProgressRing } from '../../../components/ui/ProgressRing';
import { StatItem } from '../../../components/ui/StatItem';
import { SurfaceCard } from '../../../components/ui/SurfaceCard';
import { HUD } from '../../../ui/components/HUD';
import { QUIZ_THRESHOLDS } from '../../../constants/quiz';
import type { QuizLesson, QuizLessonId } from '../../../types/quiz';
import { duration, useFadeInUp, useScalePop } from '../../../ui/motion';
import { colors } from '../../../ui/theme';
import { layout, radius, space, typography } from '../../../ui/styles';
import { LessonCatalogService } from '../../content/services/LessonCatalogService';
import { OnboardingService } from '../../onboarding/OnboardingService';
import { PushOptInCard } from '../../push/components/PushOptInCard';
import { PushService } from '../../push/services/PushService';
import { QuizFeedback } from '../components/QuizFeedback';
import { QuizQuestion } from '../components/QuizQuestion';
import { useQuiz } from '../hooks/useQuiz';
import { RatingPromptService } from '../../../services/RatingPromptService';
import { PaywallService, type PaywallOffer } from '../../paywall/PaywallService';
import { PaywallOfferCard } from '../../paywall/components/PaywallOfferCard';
import { UpgradeInterestService } from '../../paywall/UpgradeInterestService';

const SCREEN_MAX_WIDTH = 720;
const ICON_BUTTON_SIZE = space.s6 + space.s4;

interface QuizScreenProps {
  mode?: 'normal' | 'review';
  lessonIds?: QuizLessonId[];
  lessonId?: QuizLessonId;
}

export default function QuizScreen({ mode = 'normal', lessonIds = [], lessonId }: QuizScreenProps) {
  const [currentLessonIndex, setCurrentLessonIndex] = useState(0);
  const [currentLesson, setCurrentLesson] = useState<QuizLesson | null>(null);
  const [loading, setLoading] = useState(mode === 'review');

  useEffect(() => {
    OnboardingService.init().catch(console.error);

    const resolveLesson = () => {
      if (mode === 'review' && lessonIds.length > 0) {
        return LessonCatalogService.getLessonById(lessonIds[currentLessonIndex]);
      }

      if (mode === 'normal' && lessonId) {
        return LessonCatalogService.getLessonById(lessonId);
      }

      return LessonCatalogService.getInitialLesson();
    };

    const nextLesson = resolveLesson();
    setCurrentLesson(nextLesson);
    setLoading(false);
  }, [currentLessonIndex, lessonId, lessonIds, mode]);

  const handleNextLesson = () => {
    if (currentLessonIndex < lessonIds.length - 1) {
      setCurrentLessonIndex((value) => value + 1);
      setLoading(true);
    }
  };

  const handleFinishReview = () => {
    void OnboardingService.markAction('review_complete');
    router.replace('/(tabs)');
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.screen}>
        <View style={styles.centered}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={styles.loadingText}>Carregando lição...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!currentLesson) {
    return (
      <SafeAreaView style={styles.screen}>
        <View style={styles.centered}>
          <SurfaceCard variant="solid" style={styles.emptyCard}>
            <Text style={styles.emptyTitle}>Nenhuma lição disponível</Text>
            <Text style={styles.emptyBody}>Não existe conteúdo elegível para este quiz agora.</Text>
            <AppButton onPress={() => router.replace('/(tabs)')} style={styles.fullWidthButton}>
              Voltar para jornada
            </AppButton>
          </SurfaceCard>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <QuizSession
      key={`${mode}-${currentLessonIndex}`}
      lesson={currentLesson}
      mode={mode}
      currentLessonIndex={currentLessonIndex}
      totalLessons={lessonIds.length}
      onNextLesson={handleNextLesson}
      onFinishReview={handleFinishReview}
    />
  );
}

interface QuizSessionProps {
  lesson: QuizLesson;
  mode: 'normal' | 'review';
  currentLessonIndex: number;
  totalLessons: number;
  onNextLesson: () => void;
  onFinishReview: () => void;
}

function QuizSession({
  lesson,
  mode,
  currentLessonIndex,
  totalLessons,
  onNextLesson,
  onFinishReview,
}: QuizSessionProps) {
  const {
    currentQuestion,
    progress,
    selectedAnswerIndex,
    isAnswered,
    feedback,
    isFinished,
    result,
    selectAnswer,
    next,
    reset,
    xpAward,
    dailyGoalJustCompleted,
    hearts,
    maxHearts,
  } = useQuiz(lesson, {
    journeyCompletionMode: mode === 'review' ? 'review' : 'lesson',
  });

  const helperFade = useFadeInUp(duration.ui);
  const celebrationFade = useFadeInUp(duration.celebrate);
  const celebrationPop = useScalePop(duration.celebrate);
  const [summaryHelper, setSummaryHelper] = useState<{ message: string; type: 'habit' | 'consistency' } | null>(null);
  const [showPushOptIn, setShowPushOptIn] = useState(false);
  const [paywallOffer, setPaywallOffer] = useState<PaywallOffer | null>(null);
  const [paywallFeedback, setPaywallFeedback] = useState<string | null>(null);
  const [paywallSubmitting, setPaywallSubmitting] = useState(false);

  useEffect(() => {
    if (!isFinished || !result) {
      return;
    }

    void checkPushOptIn();

    if (mode !== 'normal') {
      return;
    }

    void (async () => {
      await OnboardingService.markAction('quiz_complete');
      setSummaryHelper(OnboardingService.getSummaryHelper());
      const scorePercentage = Math.round((result.correctAnswers / result.totalQuestions) * 100);
      if (scorePercentage < QUIZ_THRESHOLDS.PASSING_SCORE) {
        return;
      }

      const reviewShown = await RatingPromptService.maybePromptForReview({
        trigger: 'quiz_complete',
        entrySurface: 'quiz_summary',
        lessonId: result.lessonId,
        scorePercentage,
      });

      if (reviewShown) {
        return;
      }

      const offer = await PaywallService.maybePresentOffer({
        trigger: 'quiz_complete',
        entrySurface: 'quiz_summary',
        lessonId: result.lessonId,
      });
      setPaywallOffer(offer);
    })();
  }, [isFinished, mode, result]);

  useEffect(() => {
    if (summaryHelper || xpAward || dailyGoalJustCompleted) {
      helperFade.animateIn();
      celebrationFade.animateIn();
      celebrationPop.animateIn();
    }
  }, [celebrationFade, celebrationPop, dailyGoalJustCompleted, helperFade, summaryHelper, xpAward]);

  const checkPushOptIn = async () => {
    const canShow = await PushService.getOptIn();
    if (canShow === null) {
      setShowPushOptIn(true);
    }
  };

  if (isFinished && result) {
    const scorePercentage = Math.round((result.correctAnswers / result.totalQuestions) * 100);
    const passed = scorePercentage >= QUIZ_THRESHOLDS.PASSING_SCORE;
    const hasMoreLessons = mode === 'review' && currentLessonIndex < totalLessons - 1;
    const characterState = scorePercentage >= QUIZ_THRESHOLDS.EXCELLENT_SCORE || dailyGoalJustCompleted
      ? 'celebrate'
      : passed
        ? 'happy'
        : 'guide';

    return (
      <SafeAreaView style={styles.screen}>
        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          <View style={styles.headerRow}>
            <Pressable
              onPress={() => router.replace('/(tabs)')}
              accessibilityRole="button"
              accessibilityLabel="Fechar quiz"
              style={styles.iconButton}
            >
              <MaterialIcons name="close" size={24} color={colors.textPrimary} />
            </Pressable>
            <Text style={styles.headerLabel}>{mode === 'review' ? 'Review Quiz' : 'Quiz'}</Text>
            <View style={styles.iconSpacer} />
          </View>

          <SurfaceCard variant="glass" style={styles.heroCard}>
            <PixelHeroSplit
              eyebrow={mode === 'review' ? 'Consolidação' : 'Avaliação rápida'}
              message={passed
                ? 'Base consolidada. O aprendizado desta etapa foi registrado e a trilha já pode avançar.'
                : 'O resultado ainda não está estável. Vale repetir agora antes de acumular ruído.'}
              ringValue={scorePercentage}
              ringTotal={100}
              ringLabel="Aproveitamento"
              state={characterState}
              tier={characterState === 'celebrate' ? 'advanced' : 'intermediate'}
              accessibilityLabel="Pixel apresentando o resultado do quiz"
            />
          </SurfaceCard>

          <SurfaceCard variant="solid" style={styles.sectionCard}>
            <Text style={styles.sectionTitle}>Resumo da tentativa</Text>
            <View style={styles.statsList}>
              <StatItem
                icon={<MaterialIcons name="check-circle" size={20} color={colors.primary} />}
                label="Acerto"
                value={`${result.correctAnswers} de ${result.totalQuestions} corretas`}
              />
              <StatItem
                icon={<MaterialIcons name="workspace-premium" size={20} color={colors.primary} />}
                label="Estado"
                value={passed ? 'Checkpoint pedagógico aprovado' : 'Reforço recomendado antes de seguir'}
              />
              <StatItem
                icon={<MaterialIcons name="bolt" size={20} color={colors.primary} />}
                label="XP"
                value={xpAward ? `+${xpAward.totalXpAwarded} XP registrados` : 'Sem XP adicional nesta tentativa'}
              />
            </View>
          </SurfaceCard>

          {dailyGoalJustCompleted ? (
            <Animated.View style={[helperFade.style, celebrationFade.style, celebrationPop.style]}>
              <SurfaceCard variant="solid" style={styles.messageCard}>
                <Text style={styles.messageTitle}>Meta do dia concluída</Text>
                <Text style={styles.messageBody}>Esta tentativa fechou sua meta diária de módulos com sucesso.</Text>
              </SurfaceCard>
            </Animated.View>
          ) : null}

          {summaryHelper ? (
            <Animated.View style={helperFade.style}>
              <SurfaceCard variant="solid" style={styles.messageCard}>
                <Text style={styles.messageTitle}>Leitura do hábito</Text>
                <Text style={styles.messageBody}>{summaryHelper.message}</Text>
              </SurfaceCard>
            </Animated.View>
          ) : null}

          {showPushOptIn ? (
            <View style={styles.pushCard}>
              <PushOptInCard onDismiss={() => setShowPushOptIn(false)} />
            </View>
          ) : null}

          {paywallOffer ? (
            <PaywallOfferCard
              offer={paywallOffer}
              submitting={paywallSubmitting}
              onPrimary={() => {
                if (paywallSubmitting) {
                  return;
                }

                void (async () => {
                  try {
                    setPaywallSubmitting(true);
                    const interest = await UpgradeInterestService.captureInterest(paywallOffer, {
                      lessonId: result.lessonId,
                    });
                    await PaywallService.recordOutcome(paywallOffer, 'cta_tap', { lessonId: result.lessonId });
                    setPaywallFeedback(
                      interest.email
                        ? `Interesse registrado para ${interest.email}. Vamos avisar quando o Radiant Plus abrir.`
                        : 'Interesse registrado neste dispositivo. Vamos usar esse sinal para abrir o Radiant Plus no momento certo.'
                    );
                  } catch (cause) {
                    console.error('[QuizScreen] Failed to capture paywall interest:', cause);
                    setPaywallFeedback('Nao foi possivel registrar seu interesse agora. Tente novamente em outro momento.');
                  } finally {
                    setPaywallOffer(null);
                    setPaywallSubmitting(false);
                  }
                })();
              }}
              onDismiss={() => {
                if (paywallSubmitting) {
                  return;
                }
                void PaywallService.recordOutcome(paywallOffer, 'dismissed', { lessonId: result.lessonId });
                setPaywallOffer(null);
              }}
            />
          ) : null}

          {paywallFeedback ? (
            <SurfaceCard variant="solid" style={styles.messageCard}>
              <Text style={styles.messageTitle}>Radiant Plus</Text>
              <Text style={styles.messageBody}>{paywallFeedback}</Text>
            </SurfaceCard>
          ) : null}

          <SurfaceCard variant="elevated" style={styles.actionCard}>
            <Text style={styles.actionTitle}>
              {hasMoreLessons ? 'Existe mais revisão na fila' : mode === 'review' ? 'Revisão concluída' : 'Próxima decisão'}
            </Text>
            <Text style={styles.actionBody}>
              {hasMoreLessons
                ? `Você ainda tem ${totalLessons - currentLessonIndex - 1} lição${totalLessons - currentLessonIndex - 1 > 1 ? 'ões' : ''} nesta rodada de revisão.`
                : mode === 'review'
                  ? 'A rodada de revisão acabou. O próximo passo volta para a jornada principal.'
                  : 'Você pode repetir imediatamente ou voltar para a trilha com o estado já atualizado.'}
            </Text>

            {hasMoreLessons ? (
              <AppButton onPress={onNextLesson} style={styles.fullWidthButton}>
                Próxima lição
              </AppButton>
            ) : (
              <AppButton onPress={mode === 'review' ? onFinishReview : reset} style={styles.fullWidthButton}>
                {mode === 'review' ? 'Finalizar revisão' : 'Refazer quiz'}
              </AppButton>
            )}

            {mode === 'normal' ? (
              <AppButton
                onPress={() => router.replace('/(tabs)')}
                variant="secondary"
                style={styles.fullWidthButton}
              >
                Voltar para jornada
              </AppButton>
            ) : null}
          </SurfaceCard>
        </ScrollView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.screen}>
      <View style={[layout.container, styles.activeLayout]}>
        <HUD
          totalXp={0}
          streakDays={0}
          hearts={hearts}
          maxHearts={maxHearts}
          compact
        />
        <View style={styles.headerRow}>
          <Pressable
            onPress={() => router.replace('/(tabs)')}
            accessibilityRole="button"
            accessibilityLabel="Fechar quiz"
            style={styles.iconButton}
          >
            <MaterialIcons name="close" size={24} color={colors.textPrimary} />
          </Pressable>
          <Text style={styles.headerLabel}>{mode === 'review' ? 'Review Quiz' : 'Quiz'}</Text>
          <Text style={styles.headerProgressText}>
            {progress.currentQuestionIndex + 1}/{progress.totalQuestions}
          </Text>
        </View>

        <SurfaceCard variant="glass" style={styles.activeHeroCard}>
          <View style={styles.activeHeroHeader}>
            <View style={styles.activeHeroCopy}>
              <Text style={styles.activeTitle}>{lesson.title}</Text>
              <Text style={styles.activeBody}>
                {mode === 'review'
                  ? `Modo revisão${totalLessons > 0 ? ` • lição ${currentLessonIndex + 1}/${totalLessons}` : ''}`
                  : 'Selecione uma resposta e confirme a leitura da imagem ou do conceito.'}
              </Text>
            </View>
            <ProgressRing
              value={progress.currentQuestionIndex + 1}
              total={Math.max(progress.totalQuestions, 1)}
              label="Questões"
              size={space.s6 * 3}
            />
          </View>
        </SurfaceCard>

        <ScrollView style={styles.scrollArea} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          {currentQuestion ? (
            <QuizQuestion
              question={currentQuestion}
              selectedAnswerIndex={selectedAnswerIndex}
              isAnswered={isAnswered}
              onSelectAnswer={selectAnswer}
            />
          ) : null}

          {feedback.visible ? (
            <QuizFeedback isCorrect={feedback.isCorrect} explanation={feedback.explanation} />
          ) : null}
        </ScrollView>

        {isAnswered ? (
          <View style={styles.footer}>
            <AppButton onPress={next} style={styles.fullWidthButton}>
              Próxima
            </AppButton>
          </View>
        ) : null}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
  },
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: space.s3,
  },
  loadingText: {
    ...typography.caption,
    color: colors.textSecondary,
    marginTop: space.s2,
  },
  emptyCard: {
    width: '100%',
    maxWidth: SCREEN_MAX_WIDTH,
    gap: space.s3,
  },
  emptyTitle: {
    ...typography.h3,
    color: colors.textPrimary,
    textAlign: 'center',
  },
  emptyBody: {
    ...typography.bodyRegular,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  content: {
    padding: space.s3,
    gap: space.s3,
    paddingBottom: space.s5,
  },
  activeLayout: {
    flex: 1,
    maxWidth: SCREEN_MAX_WIDTH,
    padding: space.s3,
    gap: space.s3,
  },
  headerRow: {
    ...layout.rowBetween,
    width: '100%',
    maxWidth: SCREEN_MAX_WIDTH,
    alignSelf: 'center',
  },
  iconButton: {
    width: ICON_BUTTON_SIZE,
    height: ICON_BUTTON_SIZE,
    borderRadius: radius.rXl,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surfaceGlass,
    borderWidth: 1,
    borderColor: colors.borderSoft,
  },
  iconSpacer: {
    width: ICON_BUTTON_SIZE,
    height: ICON_BUTTON_SIZE,
  },
  headerLabel: {
    ...typography.body,
    color: colors.textPrimary,
    fontWeight: '800',
  },
  headerProgressText: {
    ...typography.caption,
    color: colors.textSecondary,
    width: ICON_BUTTON_SIZE,
    textAlign: 'right',
  },
  heroCard: {
    gap: space.s3,
  },
  sectionCard: {
    gap: space.s2,
  },
  sectionTitle: {
    ...typography.h3,
    color: colors.textPrimary,
  },
  statsList: {
    gap: space.s2,
  },
  pushCard: {
    width: '100%',
    maxWidth: SCREEN_MAX_WIDTH,
    alignSelf: 'center',
  },
  messageCard: {
    gap: space.s1,
  },
  messageTitle: {
    ...typography.body,
    color: colors.textPrimary,
    fontWeight: '800',
  },
  messageBody: {
    ...typography.bodyRegular,
    color: colors.textSecondary,
  },
  actionCard: {
    gap: space.s2,
  },
  actionTitle: {
    ...typography.h3,
    color: colors.textPrimary,
  },
  actionBody: {
    ...typography.bodyRegular,
    color: colors.textSecondary,
  },
  fullWidthButton: {
    width: '100%',
  },
  activeHeroCard: {
    gap: space.s2,
  },
  activeHeroHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.s3,
  },
  activeHeroCopy: {
    flex: 1,
    gap: space.s1,
  },
  activeTitle: {
    ...typography.h3,
    color: colors.textPrimary,
  },
  activeBody: {
    ...typography.bodyRegular,
    color: colors.textSecondary,
  },
  scrollArea: {
    flex: 1,
  },
  scrollContent: {
    gap: space.s2,
    paddingBottom: space.s2,
  },
  footer: {
    paddingBottom: space.s1,
  },
});
