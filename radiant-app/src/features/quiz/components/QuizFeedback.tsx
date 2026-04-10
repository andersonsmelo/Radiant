import React, { useEffect } from 'react';
import { Animated, StyleSheet, Text, View } from 'react-native';
import { SurfaceCard } from '../../../components/ui/SurfaceCard';
import { FEEDBACK_MESSAGES } from '../../../constants/quiz';
import { useScalePop, useShakeError } from '../../../ui/motion';
import { colors } from '../../../ui/theme';
import { radius, space, typography } from '../../../ui/styles';

interface QuizFeedbackProps {
  isCorrect: boolean;
  explanation: string;
}

export function QuizFeedback({ isCorrect, explanation }: QuizFeedbackProps) {
  const scalePop = useScalePop();
  const shakeError = useShakeError();

  useEffect(() => {
    scalePop.animateIn();

    if (!isCorrect) {
      shakeError.animateIn();
    }
  }, [isCorrect, scalePop, shakeError]);

  return (
    <Animated.View
      style={[
        styles.wrapper,
        scalePop.style,
        !isCorrect && shakeError.style,
      ]}
    >
      <SurfaceCard variant="solid" style={[styles.card, isCorrect ? styles.correctCard : styles.incorrectCard]}>
        <View style={styles.header}>
          <Text style={[styles.title, isCorrect ? styles.correctText : styles.incorrectText]}>
            {isCorrect ? FEEDBACK_MESSAGES.CORRECT : FEEDBACK_MESSAGES.INCORRECT}
          </Text>
          <View style={[styles.badge, isCorrect ? styles.correctBadge : styles.incorrectBadge]}>
            <Text style={styles.badgeText}>{isCorrect ? 'Mantém' : 'Reforçar'}</Text>
          </View>
        </View>
        <Text style={styles.explanation}>{explanation}</Text>
      </SurfaceCard>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    marginTop: space.s2,
  },
  card: {
    gap: space.s2,
    borderWidth: 1,
    borderRadius: radius.rLg,
  },
  correctCard: {
    backgroundColor: colors.successSoft,
    borderColor: colors.success,
  },
  incorrectCard: {
    backgroundColor: colors.warningSoft,
    borderColor: colors.warning,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: space.s2,
  },
  title: {
    ...typography.body,
    fontWeight: '800',
  },
  correctText: {
    color: colors.success,
  },
  incorrectText: {
    color: colors.warning,
  },
  badge: {
    borderRadius: radius.rXl,
    paddingHorizontal: space.s2,
    paddingVertical: space.s1,
  },
  correctBadge: {
    backgroundColor: 'rgba(26, 156, 113, 0.12)',
  },
  incorrectBadge: {
    backgroundColor: 'rgba(215, 144, 34, 0.12)',
  },
  badgeText: {
    ...typography.micro,
    color: colors.textPrimary,
    textTransform: 'uppercase',
    letterSpacing: 0.6,
  },
  explanation: {
    ...typography.bodyRegular,
    color: colors.textSecondary,
  },
});
