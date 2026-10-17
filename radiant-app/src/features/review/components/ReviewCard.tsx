import React, { useEffect, useRef, useState } from 'react';
import { Animated, Pressable, StyleSheet, Text, View } from 'react-native';
import { AppButton } from '../../../components/ui/AppButton';
import { SurfaceCard } from '../../../components/ui/SurfaceCard';
import { useCardEnter } from '../../../ui/motion';
import { galaxyColors } from '../../../ui/theme';
import { semanticColors } from '../../../ui/semantic-colors';
import { radius, space, typography } from '../../../ui/styles';
import type { QuizQuestion } from '../../../types/quiz';
import { LABEL_MAX_FONT_SCALE } from '../../../ui/accessibility/useLargeTextLayout';
const galaxy = semanticColors.galaxy;
export type ReviewAnswerFeedback = { correct: boolean; assisted: boolean };
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
  const confirm = (index: number | null) => {
    if (locked.current || saving || feedback) return;
    locked.current = true;
    setSubmitted(true);
    void Promise.resolve(onAnswer(index)).finally(() => { locked.current = false; });
  };
  return (
    <Animated.View style={[styles.container, enterAnim.animatedStyle]}>
      <SurfaceCard variant="galaxyElevated" style={styles.card} contentStyle={styles.cardContent}>
        <View style={styles.header}>
          <Text style={styles.eyebrow}>Revisão</Text>
          <Text style={styles.prompt} maxFontSizeMultiplier={LABEL_MAX_FONT_SCALE}>{question.prompt}</Text>
        </View>
        {!feedback ? <View accessibilityRole="radiogroup" style={styles.optionsPreview}>
          {question.options.map((option, index) => <Pressable key={`${question.id}:${index}`} testID={`review-option-${index}`} accessibilityRole="radio"
            accessibilityLabel={option.label} accessibilityState={{ selected: selected === index, disabled: submitted || saving }}
            disabled={submitted || saving} onPress={() => setSelected(index)}
            style={[styles.optionRow, selected === index && { borderColor: galaxyColors.borderActive }]}>
            <Text style={styles.optionText} maxFontSizeMultiplier={LABEL_MAX_FONT_SCALE}>{option.label}</Text>
          </Pressable>)}
        </View> : <View style={styles.answerShell} accessibilityLiveRegion="polite">
          <Text style={styles.answerLabel}>{feedback.assisted ? 'Resposta consultada' : feedback.correct ? 'Resposta correta' : 'Vamos revisar este ponto'}</Text>
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
      </SurfaceCard>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    maxWidth: 720,
    alignSelf: 'center',
  },
  card: {
    minHeight: 360,
  },
  cardContent: {
    gap: space.s3,
  },
  header: {
    gap: space.s1,
  },
  eyebrow: {
    ...typography.caption,
    color: galaxyColors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  prompt: {
    ...typography.h3,
    color: galaxyColors.textPrimary,
  },
  contentArea: {
    justifyContent: 'center',
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
  optionBullet: {
    width: space.s1,
    height: space.s1,
    borderRadius: radius.rSm,
    backgroundColor: galaxyColors.textTertiary,
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
    backgroundColor: 'rgba(93,227,174,0.16)',
    borderWidth: 1,
    borderColor: galaxyColors.borderActive,
  },
  answerLabel: {
    ...typography.caption,
    color: galaxy.statusSuccess,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
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
  button: {
    width: '100%',
  },
  ratingRow: {
    flexDirection: 'row',
    gap: space.s2,
  },
  ratingButton: {
    flex: 1,
  },
  ratingRowStacked: {
    flexDirection: 'column',
  },
  ratingButtonStacked: {
    flex: 0,
    width: '100%',
  },
  attentionButton: {
    backgroundColor: 'rgba(245,166,35,0.16)',
    borderColor: galaxyColors.xpColor,
  },
  attentionButtonText: {
    color: galaxyColors.textPrimary,
  },
});
