import React, { useEffect, useState } from 'react';
import { Animated, StyleSheet, Text, View } from 'react-native';
import { AppButton } from '../../../components/ui/AppButton';
import { SurfaceCard } from '../../../components/ui/SurfaceCard';
import { useCardEnter, useShakeError } from '../../../ui/motion';
import { galaxyColors } from '../../../ui/theme';
import { semanticColors } from '../../../ui/semantic-colors';

const galaxy = semanticColors.galaxy;
import { radius, space, typography } from '../../../ui/styles';
import type { QuizQuestion } from '../../../types/quiz';

interface ReviewCardProps {
  question: QuizQuestion;
  onRate: (isCorrect: boolean) => void;
}

export function ReviewCard({ question, onRate }: ReviewCardProps) {
  const [revealed, setRevealed] = useState(false);
  const enterAnim = useCardEnter();
  const shakeAnim = useShakeError();

  useEffect(() => {
    setRevealed(false);
    enterAnim.reset();
    enterAnim.animateIn();
  }, [enterAnim, question.id]);

  const handleRate = (correct: boolean) => {
    if (!correct) {
      shakeAnim.animateIn();
      setTimeout(() => onRate(false), 500);
      return;
    }

    setTimeout(() => onRate(true), 300);
  };

  return (
    <Animated.View style={[styles.container, enterAnim.animatedStyle, shakeAnim.style]}>
      <SurfaceCard variant="elevated" style={styles.card}>
        <View style={styles.header}>
          <Text style={styles.eyebrow}>Micro revisão</Text>
          <Text style={styles.prompt}>{question.prompt}</Text>
        </View>

        <View style={styles.contentArea}>
          {!revealed ? (
            <View style={styles.optionsPreview}>
              {question.options.map((option, index) => (
                <View key={`${question.id}:${index}:${option.label}`} style={styles.optionRow}>
                  <View style={styles.optionBullet} />
                  <Text style={styles.optionText}>{option.label}</Text>
                </View>
              ))}
            </View>
          ) : (
            <View style={styles.answerShell}>
              <Text style={styles.answerLabel}>Resposta correta</Text>
              <Text style={styles.answerText}>{question.options[question.correctAnswerIndex].label}</Text>
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
            <View style={styles.ratingRow}>
              <View style={styles.ratingButton}>
                <AppButton
                  onPress={() => handleRate(false)}
                  variant="secondary"
                  style={styles.attentionButton}
                  textStyle={styles.attentionButtonText}
                >
                  Revisar depois
                </AppButton>
              </View>
              <View style={styles.ratingButton}>
                <AppButton onPress={() => handleRate(true)} style={styles.successButton}>
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
    gap: space.s3,
    minHeight: 360,
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
    flex: 1,
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
  attentionButton: {
    backgroundColor: 'rgba(245,166,35,0.16)',
    borderColor: galaxyColors.xpColor,
  },
  attentionButtonText: {
    color: galaxyColors.textPrimary,
  },
  successButton: {
    backgroundColor: galaxy.statusSuccess,
  },
});
