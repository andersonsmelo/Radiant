import React, { useEffect, useRef, useState } from 'react';
import { AccessibilityInfo, Animated, Pressable, StyleSheet, Text, View } from 'react-native';
import { AppButton } from '../../../components/ui/AppButton';
import { useCardEnter } from '../../../ui/motion';
import { feedbackColors, galaxyColors } from '../../../ui/theme';
import { semanticColors } from '../../../ui/semantic-colors';
import { layout, radius, space, typography } from '../../../ui/styles';
import type { QuizQuestion } from '../../../types/quiz';
import { LABEL_MAX_FONT_SCALE } from '../../../ui/accessibility/useLargeTextLayout';
const galaxy = semanticColors.galaxy;
export type ReviewAnswerFeedback = { correct: boolean; assisted: boolean };
const feedbackLabel = (feedback: ReviewAnswerFeedback) =>
  feedback.assisted ? 'Resposta consultada' : feedback.correct ? 'Resposta correta' : 'Vamos revisar este ponto';
interface ReviewCardProps {
  question: QuizQuestion;
  onAnswer: (answerIndex: number | null) => void | Promise<void>;
  onContinue: () => void | Promise<void>;
  feedback: ReviewAnswerFeedback | null;
  saving: boolean;
}
export function ReviewCard({ question, onAnswer, onContinue, feedback, saving }: ReviewCardProps) {
  const [selected, setSelected] = useState<number | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const locked = useRef(false);
  const enterAnim = useCardEnter();
  const { reset, animateIn } = enterAnim;
  useEffect(() => { setSelected(null); setSubmitted(false); locked.current = false; reset(); animateIn(); }, [question.id, reset, animateIn]);
  // O resultado é anunciado nas duas plataformas, como na lição: o
  // `accessibilityLiveRegion` que havia aqui só existe no Android, e o VoiceOver
  // não ouvia nada (FILA 54). Uma vez por item, mesmo que o feedback rerenderize.
  const announcedFor = useRef<string | null>(null);
  useEffect(() => {
    if (!feedback || announcedFor.current === question.id) return;
    announcedFor.current = question.id;
    AccessibilityInfo.announceForAccessibility(
      `${feedbackLabel(feedback)}. Resposta certa: ${question.options[question.correctAnswerIndex]?.label}. ${question.explanation}`,
    );
  }, [feedback, question]);
  const confirm = (index: number | null) => {
    if (locked.current || saving || feedback) return;
    locked.current = true;
    setSubmitted(true);
    void Promise.resolve(onAnswer(index)).finally(() => { locked.current = false; });
  };
  return (
    <Animated.View style={[layout.container, enterAnim.animatedStyle]}>
      {/* Sem moldura: a pergunta fica direto sobre o grafite, e só o retorno tem superfície. */}
      <View style={styles.cardContent}>
        <Text style={styles.prompt} maxFontSizeMultiplier={LABEL_MAX_FONT_SCALE}>{question.prompt}</Text>
        {!feedback ? <View accessibilityRole="radiogroup" style={styles.optionsPreview}>
          {question.options.map((option, index) => <Pressable key={`${question.id}:${index}`} testID={`review-option-${index}`} accessibilityRole="radio"
            accessibilityLabel={option.label} accessibilityState={{ selected: selected === index, disabled: submitted || saving }}
            disabled={submitted || saving} onPress={() => setSelected(index)}
            style={[styles.optionRow, selected === index && { borderColor: galaxyColors.borderActive }]}>
            <Text style={styles.optionText} maxFontSizeMultiplier={LABEL_MAX_FONT_SCALE}>{option.label}</Text>
          </Pressable>)}
        </View> : <View
          testID="review-feedback-shell"
          style={[
            styles.answerShell,
            feedback.assisted
              ? styles.answerShellAssisted
              : feedback.correct
                ? styles.answerShellCorrect
                : styles.answerShellIncorrect,
          ]}
        >
          <Text
            testID="review-feedback-label"
            style={[
              styles.answerLabel,
              feedback.assisted
                ? styles.answerLabelAssisted
                : feedback.correct
                  ? styles.answerLabelCorrect
                  : styles.answerLabelIncorrect,
            ]}
          >
            {feedbackLabel(feedback)}
          </Text>
          <Text style={styles.answerText}>{question.options[question.correctAnswerIndex]?.label}</Text>
          <Text style={styles.explanation}>{question.explanation}</Text>
        </View>}
        <View style={styles.footer}>
          {feedback ? <AppButton onPress={() => { void onContinue(); }} disabled={saving}>Continuar</AppButton> : <>
            <AppButton onPress={() => { if (selected !== null) confirm(selected); }} disabled={selected === null || saving}>
              {saving ? 'Salvando resposta…' : 'Confirmar resposta'}
            </AppButton>
            <AppButton variant="secondary" onPress={() => confirm(null)} disabled={submitted || saving}>Ver resposta com ajuda</AppButton>
          </>}
        </View>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  cardContent: {
    gap: space.s3,
  },
  prompt: {
    ...typography.h3,
    color: galaxyColors.textPrimary,
  },
  optionsPreview: {
    gap: space.s2,
  },
  optionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.s2,
    minHeight: space.s6,
    paddingHorizontal: space.s3,
    borderRadius: radius.rLg,
    backgroundColor: galaxyColors.surfaceMuted,
    borderWidth: 1,
    borderColor: galaxyColors.border,
  },
  optionText: {
    ...typography.bodyRegular,
    color: galaxyColors.textSecondary,
    flex: 1,
  },
  answerShell: {
    gap: space.s2,
    padding: space.s3,
    borderRadius: radius.rLg,
    borderWidth: 1,
  },
  answerShellCorrect: {
    backgroundColor: feedbackColors.success.surface,
    borderColor: feedbackColors.success.fill,
  },
  // Âmbar não tem superfície própria: grafite ativo com a borda na cor cheia.
  answerShellAssisted: {
    backgroundColor: galaxyColors.surfaceActive,
    borderColor: galaxy.statusWarning,
  },
  answerShellIncorrect: {
    backgroundColor: feedbackColors.error.surface,
    borderColor: feedbackColors.error.fill,
  },
  answerLabel: {
    ...typography.bodyStrong,
    color: galaxy.statusSuccess,
  },
  answerLabelCorrect: {
    color: galaxy.statusSuccess,
  },
  answerLabelAssisted: {
    color: galaxy.statusWarning,
  },
  answerLabelIncorrect: {
    color: galaxy.statusError,
  },
  answerText: {
    ...typography.body,
    color: galaxyColors.textPrimary,
    fontWeight: '800',
  },
  explanation: {
    ...typography.bodyRegular,
    color: galaxyColors.textSecondary,
  },
  footer: {
    gap: space.s2,
  },
});
