import React, { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { AppButton } from '../../../components/ui/AppButton';
import { StarfieldBackground } from '../../../ui/components/StarfieldBackground';
import { QUIZ_THRESHOLDS } from '../../../constants/quiz';
import type { QuizLesson, QuizLessonId } from '../../../types/quiz';
import { galaxyColors } from '../../../ui/theme';
import { layout, radius, space, typography } from '../../../ui/styles';
import { LessonCatalogService } from '../../content/services/LessonCatalogService';
import { OnboardingService } from '../../onboarding/OnboardingService';
import { QuizFeedback } from '../components/QuizFeedback';
import { QuizQuestion } from '../components/QuizQuestion';
import { QuizTopBar } from '../components/QuizTopBar';
import { useQuiz } from '../hooks/useQuiz';
import { Confetti } from '../../../components/ui/Confetti';
import { hapticCelebrate } from '../../../ui/feedback/haptics';
import { RatingPromptService } from '../../../services/RatingPromptService';
import { PixelMood, type PixelMoodResult } from '../../pixel-mood/PixelMood';
import type { PixelMoment } from '../../pixel-mood/pixelPhrases';
import {
  STUDENT_CHECKPOINT_SHADOW_CONTENT_VERSION,
  useShadowCheckpoint,
} from '../../student-checkpoints/useShadowCheckpoint';
import { LessonSummary } from '../components/LessonSummary';
import { resolveBestLessonStars, resolveLessonStars, type LessonStars } from '../services/resolveLessonStars';
import { pickSummaryPhrase } from '../constants/lessonSummaryPhrases';
import { LessonRatingService } from '../services/LessonRatingService';
import { LearningAttemptsRepository } from '../../progress/services/LearningAttemptsRepository';
import { JourneyProgressService } from '../../journey/services/JourneyProgressService';
import { computeUnitPrimaryProgress } from '../../journey/services/JourneyUnitProgress';

const SCREEN_MAX_WIDTH = 720;

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

  const [summaryHelper, setSummaryHelper] = useState<{ message: string; type: 'habit' | 'consistency' } | null>(null);
  const [summary, setSummary] = useState<{
    stars: LessonStars;
    improved: boolean;
    phrase: string;
    rating: number | null;
  } | null>(null);
  const [unitProgress, setUnitProgress] = useState<{ completed: number; total: number }>({ completed: 0, total: 0 });
  const [feedbackMood, setFeedbackMood] = useState<PixelMoodResult | null>(null);
  const acertosSeguidos = useRef<number>(0);
  const errosSeguidos = useRef<number>(0);
  const feedbackMoodGeneration = useRef(0);

  const handleSelectAnswer = (answerIndex: number) => {
    if (!currentQuestion || isAnswered) {
      return;
    }

    const moodGeneration = feedbackMoodGeneration.current;

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
    if (!isFinished || !result || mode !== 'normal') {
      return;
    }

    void (async () => {
      await OnboardingService.markAction('quiz_complete');
      setSummaryHelper(OnboardingService.getSummaryHelper());
      const scorePercentage = Math.round((result.correctAnswers / result.totalQuestions) * 100);
      if (scorePercentage < QUIZ_THRESHOLDS.PASSING_SCORE) {
        return;
      }

      await RatingPromptService.maybePromptForReview({
        trigger: 'quiz_complete',
        entrySurface: 'quiz_summary',
        lessonId: result.lessonId,
        scorePercentage,
      });
    })();
  }, [isFinished, mode, result]);

  // Resolve estrelas, frase e nota antes de renderizar o resumo: attempts vem
  // do LearningAttemptsRepository, e resolveBestLessonStars exclui a própria
  // tentativa atual comparando completedAt — por isso precisa ser
  // exatamente result.answeredAt.toISOString().
  //
  // A tela inteira de conclusão fica atrás de `summary`, então uma leitura
  // que rejeita (attempts ou nota) não pode deixar `summary` em null para
  // sempre — o estudante tem que sempre chegar no Continuar. Se
  // LearningAttemptsRepository ou LessonRatingService falharem, cai para
  // as estrelas só desta tentativa (resolveLessonStars, sem comparação com
  // o histórico) e nota null, em vez de travar a tela.
  useEffect(() => {
    if (!result) {
      return;
    }

    let cancelado = false;
    void (async () => {
      try {
        const attempts = await LearningAttemptsRepository.getAll();
        const { stars, improved } = resolveBestLessonStars(result.lessonId, attempts, {
          correctAnswers: result.correctAnswers,
          totalQuestions: result.totalQuestions,
          completedAt: result.answeredAt.toISOString(),
        });
        const rating = await LessonRatingService.getRating(result.lessonId);
        if (cancelado) {
          return;
        }
        setSummary({ stars, improved, phrase: pickSummaryPhrase(stars, null), rating });
      } catch (cause) {
        console.error('[QuizScreen] Falha ao resolver o resumo da lição:', cause);
        if (cancelado) {
          return;
        }
        const stars = resolveLessonStars(result.correctAnswers, result.totalQuestions);
        setSummary({ stars, improved: false, phrase: pickSummaryPhrase(stars, null), rating: null });
      }
    })();

    return () => {
      cancelado = true;
    };
  }, [result]);

  // unitCompleted/unitTotal reaproveitam a MESMA regra que o RewardScreen
  // usa (completedPrimaryNodes/totalPrimaryNodes), extraída para
  // computeUnitPrimaryProgress justamente para não manter duas cópias do
  // mesmo par de filtros. Aqui só localizamos a unidade ativa, pelo nó cujo
  // lessonId bate com a lição concluída.
  useEffect(() => {
    if (!result) {
      return;
    }

    let cancelado = false;
    void JourneyProgressService.getSnapshot()
      .then((snapshot) => {
        if (cancelado) {
          return;
        }

        const activeUnit = snapshot.track.units.find((unit) =>
          unit.nodes.some((node) => node.lessonId === result.lessonId)
        ) ?? null;

        setUnitProgress(computeUnitPrimaryProgress(activeUnit));
      })
      .catch((cause) => {
        // Progresso da unidade é informação secundária no resumo — uma
        // falha aqui não pode impedir a tela de conclusão de aparecer.
        console.error('[QuizScreen] Falha ao resolver o progresso da unidade:', cause);
      });

    return () => {
      cancelado = true;
    };
  }, [result]);

  // Fusão, numa única linha, do que antes eram o card de meta diária e o de
  // "Leitura do hábito". Sem nenhum dos dois, não há o que dizer.
  const habitLine = dailyGoalJustCompleted
    ? summaryHelper
      ? `Meta do dia concluída. ${summaryHelper.message}`
      : 'Esta tentativa fechou sua meta diária de módulos com sucesso.'
    : summaryHelper
      ? summaryHelper.message
      : null;

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

  // A fila de revisão (mode='review' com várias lessonIds) é endereçável por
  // deep link (`/quiz?mode=review&lessonIds=...`) mesmo sem nenhum caller
  // interno hoje — continuar precisa avançar para a próxima lição da fila,
  // ou fechar a revisão (o único lugar que dispara review_complete/
  // OnboardingService, base do marco firstReviewAt), em vez de sempre voltar
  // para as tabs.
  const hasMoreLessons = mode === 'review' && currentLessonIndex < totalLessons - 1;

  if (isFinished && result) {
    return (
      <View style={styles.root}>
        <StarfieldBackground backgroundColor={galaxyColors.background} starCount={120} />
        <Confetti count={40} run={quizPassed} />
        <SafeAreaView style={styles.safe} edges={['top']}>
          {summary ? (
            <LessonSummary
              stars={summary.stars}
              starsImproved={summary.improved}
              phrase={summary.phrase}
              xpAwarded={xpAward?.totalXpAwarded ?? 0}
              correctAnswers={result.correctAnswers}
              totalQuestions={result.totalQuestions}
              unitCompleted={unitProgress.completed}
              unitTotal={unitProgress.total}
              habitLine={habitLine}
              currentRating={summary.rating}
              onRate={(nota) => {
                void LessonRatingService.rate(result.lessonId, nota);
                setSummary((atual) => (atual ? { ...atual, rating: nota } : atual));
              }}
              onContinue={() => {
                if (mode === 'review') {
                  if (hasMoreLessons) {
                    onNextLesson();
                  } else {
                    onFinishReview();
                  }
                  return;
                }
                router.replace('/(tabs)');
              }}
            />
          ) : null}
        </SafeAreaView>
      </View>
    );
  }

  return (
    <View style={styles.root}>
      <StarfieldBackground backgroundColor={galaxyColors.background} starCount={80} />
      <SafeAreaView style={styles.safe} edges={['top']}>
        <View style={[layout.container, styles.activeLayout]}>
          <QuizTopBar
            questionIndex={progress.currentQuestionIndex}
            totalQuestions={progress.totalQuestions}
            hearts={hearts}
            maxHearts={maxHearts}
            onClose={() => router.replace('/(tabs)')}
          />

          <Text style={styles.questionCounter}>
            Pergunta {progress.currentQuestionIndex + 1} de {progress.totalQuestions}
          </Text>

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
  activeLayout: { flex: 1, maxWidth: SCREEN_MAX_WIDTH, padding: space.s3, gap: space.s3 },
  fullWidthButton: { width: '100%' },
  questionCounter: {
    ...typography.caption,
    color: galaxyColors.textSecondary,
    textAlign: 'center',
  },
  scrollArea: { flex: 1 },
  scrollContent: { gap: space.s2, paddingBottom: space.s2 },
  footer: { paddingBottom: space.s1 },
  progressBar: {
    height: 10,
    borderRadius: 999,
    alignSelf: 'flex-start',
  },
});
