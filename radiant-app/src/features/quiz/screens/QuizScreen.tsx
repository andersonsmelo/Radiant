import React, { useEffect, useRef, useState } from 'react';
import { DecorativeIcon } from '../../../components/ui/DecorativeIcon';
import { ActivityIndicator, Animated, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { AppButton } from '../../../components/ui/AppButton';
import { PixelHeroSplit } from '../../../components/ui/PixelHeroSplit';
import { ProgressRing } from '../../../components/ui/ProgressRing';
import { StarfieldBackground } from '../../../ui/components/StarfieldBackground';
import { HUD } from '../../../ui/components/HUD';
import { GalaxyStatRow } from '../../../ui/components/GalaxyStatRow';
import { QUIZ_THRESHOLDS } from '../../../constants/quiz';
import type { QuizLesson, QuizLessonId } from '../../../types/quiz';
import { duration, useFadeInUp, useScalePop } from '../../../ui/motion';
import { galaxyColors } from '../../../ui/theme';
import { layout, radius, space, typography } from '../../../ui/styles';
import { LessonCatalogService } from '../../content/services/LessonCatalogService';
import { OnboardingService } from '../../onboarding/OnboardingService';
import { PushOptInCard } from '../../push/components/PushOptInCard';
import { PushService } from '../../push/services/PushService';
import { QuizFeedback } from '../components/QuizFeedback';
import { QuizQuestion } from '../components/QuizQuestion';
import { useQuiz } from '../hooks/useQuiz';
import { Confetti } from '../../../components/ui/Confetti';
import { AnimatedCounter } from '../../../components/ui/AnimatedCounter';
import { AnimatedProgressBar } from '../../../components/ui/AnimatedProgressBar';
import { hapticCelebrate } from '../../../ui/feedback/haptics';
import { RatingPromptService } from '../../../services/RatingPromptService';
import { PaywallService, type PaywallOffer } from '../../paywall/PaywallService';
import { PaywallOfferCard } from '../../paywall/components/PaywallOfferCard';
import { UpgradeInterestService } from '../../paywall/UpgradeInterestService';
import { GamificationService } from '../../gamification/services/GamificationService';
import type { GamificationSnapshot } from '../../../types/gamification';
import { PixelMood, type PixelMoodResult } from '../../pixel-mood/PixelMood';
import type { PixelMoment } from '../../pixel-mood/pixelPhrases';
import {
  STUDENT_CHECKPOINT_SHADOW_CONTENT_VERSION,
  useShadowCheckpoint,
} from '../../student-checkpoints/useShadowCheckpoint';

const SCREEN_MAX_WIDTH = 720;
const ICON_BUTTON_SIZE = 36;

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
      <View style={styles.root}>
        <StarfieldBackground backgroundColor={galaxyColors.background} starCount={120} />
        <SafeAreaView style={styles.safe}>
          <View style={styles.centered}>
            <ActivityIndicator size="large" color={galaxyColors.ctaGradientEnd} />
            <Text style={styles.loadingText}>Carregando lição...</Text>
          </View>
        </SafeAreaView>
      </View>
    );
  }

  if (!currentLesson) {
    return (
      <View style={styles.root}>
        <StarfieldBackground backgroundColor={galaxyColors.background} starCount={120} />
        <SafeAreaView style={styles.safe}>
          <View style={styles.centered}>
            <View style={styles.emptyCard}>
              <Text style={styles.emptyTitle}>Nenhuma lição disponível</Text>
              <Text style={styles.emptyBody}>Não existe conteúdo elegível para este quiz agora.</Text>
              <AppButton onPress={() => router.replace('/(tabs)')} style={styles.fullWidthButton}>
                Voltar para jornada
              </AppButton>
            </View>
          </View>
        </SafeAreaView>
      </View>
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

  const shadowCursorId = currentQuestion?.id ?? 'quiz-summary';
  useShadowCheckpoint({
    surface: 'legacy-quiz',
    flowId: `legacy-quiz:${lesson.id}`,
    contentVersion: STUDENT_CHECKPOINT_SHADOW_CONTENT_VERSION,
    cursorId: shadowCursorId,
    compatibleCursorIds: [...lesson.questions.map((question) => question.id), 'quiz-summary'],
    progressPercent: isFinished
      ? 100
      : Math.round((progress.currentQuestionIndex / Math.max(progress.totalQuestions, 1)) * 100),
    completedStepCount: isFinished ? progress.totalQuestions : progress.currentQuestionIndex,
    totalStepCount: Math.max(progress.totalQuestions, 1),
    lessonId: lesson.id,
  });

  const helperFade = useFadeInUp(duration.ui);
  const celebrationFade = useFadeInUp(duration.celebrate);
  const celebrationPop = useScalePop(duration.celebrate);
  const [summaryHelper, setSummaryHelper] = useState<{ message: string; type: 'habit' | 'consistency' } | null>(null);
  const [showPushOptIn, setShowPushOptIn] = useState(false);
  const [paywallOffer, setPaywallOffer] = useState<PaywallOffer | null>(null);
  const [paywallFeedback, setPaywallFeedback] = useState<string | null>(null);
  const [paywallSubmitting, setPaywallSubmitting] = useState(false);
  const [gamification, setGamification] = useState<GamificationSnapshot | null>(null);
  const [feedbackMood, setFeedbackMood] = useState<PixelMoodResult | null>(null);
  const acertosSeguidos = useRef<number>(0);
  const errosSeguidos = useRef<number>(0);
  const feedbackMoodGeneration = useRef(0);

  const handleSelectAnswer = (answerIndex: number) => {
    if (!currentQuestion || isAnswered) {
      return;
    }

    const moodGeneration = feedbackMoodGeneration.current + 1;
    feedbackMoodGeneration.current = moodGeneration;
    setFeedbackMood(null);

    const isCorrect = answerIndex === currentQuestion.correctAnswerIndex;
    let moment: PixelMoment | null = null;

    if (isCorrect) {
      acertosSeguidos.current += 1;
      errosSeguidos.current = 0;
      if (acertosSeguidos.current === 3) {
        moment = 'acertou-em-sequencia';
      }
    } else {
      errosSeguidos.current += 1;
      acertosSeguidos.current = 0;
      if (errosSeguidos.current === 2) {
        moment = 'errou-duas-vezes';
      }
    }

    selectAnswer(answerIndex);

    if (moment) {
      void PixelMood.resolve(moment)
        .then((mood) => {
          if (feedbackMoodGeneration.current === moodGeneration) {
            setFeedbackMood(mood);
          }
        })
        .catch(() => {
          // O mascote nunca pode impedir o feedback funcional do quiz.
        });
    }
  };

  const handleNextQuestion = () => {
    feedbackMoodGeneration.current += 1;
    setFeedbackMood(null);
    next();
  };

  useEffect(() => {
    void GamificationService.getSnapshot().then(setGamification);
  }, []);

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

  // O fim do quiz é o momento mais repetido do produto e era o único sem
  // nenhuma celebração: nem confete, nem contagem de XP, nem vibração.
  const quizPassed =
    isFinished && result
      ? Math.round((result.correctAnswers / result.totalQuestions) * 100) >= QUIZ_THRESHOLDS.PASSING_SCORE
      : false;

  useEffect(() => {
    if (quizPassed) {
      hapticCelebrate();
    }
  }, [quizPassed]);

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
      : passed ? 'happy' : 'guide';

    return (
      <View style={styles.root}>
        <StarfieldBackground backgroundColor={galaxyColors.background} starCount={120} />
        <Confetti count={40} run={passed} />
        <SafeAreaView style={styles.safe} edges={['top']}>
          <HUD
            totalXp={gamification?.totalXp ?? 0}
            streakDays={gamification?.streakDays ?? 0}
            hearts={hearts}
            maxHearts={maxHearts}
          />
          <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
            <View style={styles.headerRow}>
              <Pressable
                onPress={() => router.replace('/(tabs)')}
                accessibilityRole="button"
                accessibilityLabel="Fechar quiz"
                style={styles.iconButton}
              >
                <DecorativeIcon name="close" size={22} color={galaxyColors.textPrimary} />
              </Pressable>
              <Text style={styles.headerLabel}>{mode === 'review' ? 'Quiz de Revisão' : 'Quiz'}</Text>
              <View style={styles.iconSpacer} />
            </View>

            <View style={styles.heroCard}>
              <PixelHeroSplit
                eyebrow={mode === 'review' ? 'Revisão' : 'Quiz'}
                message={passed
                  ? 'Mandou bem! Você fixou essa etapa e já pode seguir em frente.'
                  : 'Faltou pouco. Errar faz parte de aprender a ler imagem — bora tentar de novo?'}
                ringValue={scorePercentage}
                ringTotal={100}
                ringLabel="Aproveitamento"
                state={characterState}
                tier={characterState === 'celebrate' ? 'advanced' : 'intermediate'}
                accessibilityLabel="Pixel apresentando o resultado do quiz"
              />
            </View>

            {xpAward && xpAward.totalXpAwarded > 0 ? (
              <View style={styles.xpCelebration}>
                <Text style={styles.xpCelebrationLabel}>XP CONQUISTADO</Text>
                <AnimatedCounter
                  value={xpAward.totalXpAwarded}
                  prefix="+"
                  suffix=" XP"
                  style={styles.xpCelebrationValue}
                  accessibilityLabel={`Você ganhou ${xpAward.totalXpAwarded} XP nesta tentativa`}
                />
              </View>
            ) : null}

            <View style={styles.sectionCard}>
              <Text style={styles.sectionTitle} accessibilityRole="header">Resumo da tentativa</Text>
              <View style={styles.statsList}>
                <GalaxyStatRow
                  icon={<DecorativeIcon name="check-circle" size={20} color={galaxyColors.ctaGradientEnd} />}
                  label="Acerto"
                  value={`${result.correctAnswers} de ${result.totalQuestions} corretas`}
                />
                <GalaxyStatRow
                  icon={<DecorativeIcon name="workspace-premium" size={20} color={galaxyColors.ctaGradientEnd} />}
                  label="Resultado"
                  value={passed ? 'Aprovado nesta etapa' : 'Vale reforçar antes de seguir'}
                />
                <GalaxyStatRow
                  icon={<DecorativeIcon name="bolt" size={20} color={galaxyColors.ctaGradientEnd} />}
                  label="XP"
                  value={xpAward ? `+${xpAward.totalXpAwarded} XP nesta tentativa` : 'Sem XP nesta tentativa'}
                />
              </View>
            </View>

            {dailyGoalJustCompleted ? (
              <Animated.View style={[helperFade.style, celebrationFade.style, celebrationPop.style]}>
                <View style={styles.messageCard}>
                  <Text style={styles.messageTitle}>Meta do dia concluída</Text>
                  <Text style={styles.messageBody}>Esta tentativa fechou sua meta diária de módulos com sucesso.</Text>
                </View>
              </Animated.View>
            ) : null}

            {summaryHelper ? (
              <Animated.View style={helperFade.style}>
                <View style={styles.messageCard}>
                  <Text style={styles.messageTitle}>Leitura do hábito</Text>
                  <Text style={styles.messageBody}>{summaryHelper.message}</Text>
                </View>
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
                  if (paywallSubmitting) { return; }
                  void (async () => {
                    try {
                      setPaywallSubmitting(true);
                      const interest = await UpgradeInterestService.captureInterest(paywallOffer, { lessonId: result.lessonId });
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
                  if (paywallSubmitting) { return; }
                  void PaywallService.recordOutcome(paywallOffer, 'dismissed', { lessonId: result.lessonId });
                  setPaywallOffer(null);
                }}
              />
            ) : null}

            {paywallFeedback ? (
              <View style={styles.messageCard}>
                <Text style={styles.messageTitle}>Radiant Plus</Text>
                <Text style={styles.messageBody}>{paywallFeedback}</Text>
              </View>
            ) : null}

            <View style={styles.actionCard}>
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
                  variant="ghost"
                  style={styles.fullWidthButton}
                  textStyle={{ color: galaxyColors.textSecondary }}
                >
                  Voltar para jornada
                </AppButton>
              ) : null}
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
          hearts={hearts}
          maxHearts={maxHearts}
          compact
        />
        <View style={[layout.container, styles.activeLayout]}>
          {/* Progresso do quiz: anima entre as questões em vez de saltar. */}
          <AnimatedProgressBar
            ratio={(progress.currentQuestionIndex + 1) / Math.max(1, progress.totalQuestions)}
            height={10}
            style={styles.progressTrack}
            accessibilityLabel={`Questão ${progress.currentQuestionIndex + 1} de ${progress.totalQuestions}`}
          />

          <View style={styles.headerRow}>
            <Pressable
              onPress={() => router.replace('/(tabs)')}
              accessibilityRole="button"
              accessibilityLabel="Fechar quiz"
              style={styles.iconButton}
            >
              <DecorativeIcon name="close" size={22} color={galaxyColors.textPrimary} />
            </Pressable>
            <Text style={styles.headerLabel}>{mode === 'review' ? 'Quiz de Revisão' : 'Quiz'}</Text>
            <Text style={styles.headerProgressText}>
              {progress.currentQuestionIndex + 1}/{progress.totalQuestions}
            </Text>
          </View>

          <View style={styles.activeHeroCard}>
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
          </View>

          <ScrollView style={styles.scrollArea} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
            {currentQuestion ? (
              <QuizQuestion
                question={currentQuestion}
                selectedAnswerIndex={selectedAnswerIndex}
                correctAnswerIndex={currentQuestion.correctAnswerIndex}
                isAnswered={isAnswered}
                onSelectAnswer={handleSelectAnswer}
              />
            ) : null}
            {feedback.visible ? (
              <QuizFeedback
                isCorrect={feedback.isCorrect}
                explanation={feedback.explanation}
                moodPhrase={feedbackMood?.phrase}
                moodExpression={feedbackMood?.expression}
              />
            ) : null}
          </ScrollView>

          {isAnswered ? (
            <View style={styles.footer}>
              <AppButton onPress={handleNextQuestion} style={styles.fullWidthButton}>
                Próxima
              </AppButton>
            </View>
          ) : null}
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: galaxyColors.background },
  safe: { flex: 1 },
  centered: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: space.s3 },
  loadingText: { ...typography.caption, color: galaxyColors.textSecondary, marginTop: space.s2 },
  emptyCard: {
    backgroundColor: galaxyColors.surface,
    borderRadius: radius.rLg,
    borderWidth: 1,
    borderColor: galaxyColors.border,
    padding: space.s3,
    gap: space.s3,
    width: '100%',
    maxWidth: SCREEN_MAX_WIDTH,
  },
  emptyTitle: { ...typography.h3, color: galaxyColors.textPrimary, textAlign: 'center' },
  emptyBody: { ...typography.bodyRegular, color: galaxyColors.textSecondary, textAlign: 'center' },
  content: { padding: space.s3, gap: space.s3, paddingBottom: space.s5 },
  activeLayout: { flex: 1, maxWidth: SCREEN_MAX_WIDTH, padding: space.s3, gap: space.s3 },
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
  pushCard: { width: '100%', maxWidth: SCREEN_MAX_WIDTH, alignSelf: 'center' },
  messageCard: {
    backgroundColor: galaxyColors.surface,
    borderRadius: radius.rLg,
    borderWidth: 1,
    borderColor: galaxyColors.border,
    padding: space.s3,
    gap: space.s1,
  },
  messageTitle: { ...typography.body, color: galaxyColors.textPrimary, fontWeight: '800' },
  messageBody: { ...typography.bodyRegular, color: galaxyColors.textSecondary },
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
  scrollArea: { flex: 1 },
  scrollContent: { gap: space.s2, paddingBottom: space.s2 },
  footer: { paddingBottom: space.s1 },
  xpCelebration: {
    alignItems: 'center',
    gap: space.s0,
    paddingVertical: space.s2,
  },
  xpCelebrationLabel: {
    ...typography.label,
    color: galaxyColors.textSecondary,
  },
  xpCelebrationValue: {
    ...typography.h1,
    color: galaxyColors.xpColor,
    textAlign: 'center',
  },
  progressTrack: {
    marginHorizontal: 20,
    marginBottom: 8,
  },
  progressBar: {
    height: 10,
    borderRadius: 999,
    alignSelf: 'flex-start',
  },
});
