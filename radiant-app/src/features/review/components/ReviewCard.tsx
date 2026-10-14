import React, { useEffect, useRef, useState } from 'react';
import { Animated, StyleSheet, Text, View } from 'react-native';
import { AppButton } from '../../../components/ui/AppButton';
import { SurfaceCard } from '../../../components/ui/SurfaceCard';
import { useCardEnter, useShakeError } from '../../../ui/motion';
import { galaxyColors } from '../../../ui/theme';
import { semanticColors } from '../../../ui/semantic-colors';
import { radius, space, typography } from '../../../ui/styles';
import type { QuizQuestion } from '../../../types/quiz';
import { LABEL_MAX_FONT_SCALE, useLargeTextLayout } from '../../../ui/accessibility/useLargeTextLayout';

const galaxy = semanticColors.galaxy;

interface ReviewCardProps {
  question: QuizQuestion;
  onRate: (isCorrect: boolean) => void;
}

export function ReviewCard({ question, onRate }: ReviewCardProps) {
  const largeText = useLargeTextLayout();
  const [revealed, setRevealed] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const pendingRating = useRef<ReturnType<typeof setTimeout> | null>(null);
  const enterAnim = useCardEnter();
  const { reset, animateIn } = enterAnim;
  const shakeAnim = useShakeError();

  useEffect(() => {
    setRevealed(false);
    setSubmitting(false);
    reset();
    animateIn();
    return () => {
      if (pendingRating.current !== null) clearTimeout(pendingRating.current);
      pendingRating.current = null;
    };
  }, [reset, animateIn, question.id]);

  const handleRate = (correct: boolean) => {
    if (pendingRating.current !== null) return;
    setSubmitting(true);
    if (!correct) {
      shakeAnim.animateIn();
    }
    pendingRating.current = setTimeout(() => onRate(correct), correct ? 300 : 500);
  };

  return (
    <Animated.View style={[styles.container, enterAnim.animatedStyle, shakeAnim.style]}>
      <SurfaceCard variant="galaxyElevated" style={styles.card} contentStyle={styles.cardContent}>
        <View style={styles.header}>
          <Text style={styles.eyebrow}>Micro revisão</Text>
          <Text style={styles.prompt} maxFontSizeMultiplier={LABEL_MAX_FONT_SCALE}>{question.prompt}</Text>
        </View>

        <View style={styles.contentArea}>
          {!revealed ? (
            <View style={styles.optionsPreview}>
              {question.options.map((option, index) => (
                <View key={`${question.id}:${index}:${option.label}`} style={styles.optionRow}>
                  <View style={styles.optionBullet} />
                  <Text style={styles.optionText} maxFontSizeMultiplier={LABEL_MAX_FONT_SCALE}>{option.label}</Text>
                </View>
              ))}
            </View>
          ) : (
            <View style={styles.answerShell}>
              <Text style={styles.answerLabel}>Resposta correta</Text>
              <Text style={styles.answerText} maxFontSizeMultiplier={LABEL_MAX_FONT_SCALE}>{question.options[question.correctAnswerIndex].label}</Text>
              <Text style={styles.explanation}>{question.explanation}</Text>
            </View>
          )}
        </View>

        <View style={styles.footer}>
          {!revealed ? (
            <AppButton onPress={() => setRevealed(true)} style={styles.button}>
              Mostrar resposta
            </AppButton>
          ) : (
            <View style={[styles.ratingRow, largeText && styles.ratingRowStacked]}>
              <View style={[styles.ratingButton, largeText && styles.ratingButtonStacked]}>
                <AppButton
                  onPress={() => handleRate(false)}
                  disabled={submitting}
                  variant="secondary"
                  style={styles.attentionButton}
                  textStyle={styles.attentionButtonText}
                >
                  Revisar depois
                </AppButton>
              </View>
              <View style={[styles.ratingButton, largeText && styles.ratingButtonStacked]}>
                <AppButton onPress={() => handleRate(true)} disabled={submitting}>
                  Acertei
                </AppButton>
              </View>
            </View>
          )}
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
