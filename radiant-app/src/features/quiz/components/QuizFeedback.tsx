import React, { useEffect } from 'react';
import { Animated, StyleSheet, Text, View } from 'react-native';
import { SurfaceCard } from '../../../components/ui/SurfaceCard';
import { FEEDBACK_MESSAGES } from '../../../constants/quiz';
import { useScalePop, useShakeError } from '../../../ui/motion';
import { PixelIllustration } from '../../../ui/characters/PixelIllustration';
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
          {/* O mascote reage à resposta. Ele existia só nos resumos: nos
              momentos em que um personagem de aprendizado importa — acertar e
              errar — a tela não tinha ninguém. */}
          <PixelIllustration
            state={isCorrect ? 'happy' : 'oops'}
            size="sm"
            tier="intermediate"
            accessibilityLabel={
              isCorrect ? 'Pixel comemorando o acerto' : 'Pixel acompanhando o erro'
            }
          />
          <View style={styles.headerCopy}>
            <Text style={[styles.title, isCorrect ? styles.correctText : styles.incorrectText]}>
              {isCorrect ? FEEDBACK_MESSAGES.CORRECT : FEEDBACK_MESSAGES.INCORRECT}
            </Text>
          </View>
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
    backgroundColor: '#FCEAEF',
    borderColor: '#D8506F',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.s2,
  },
  headerCopy: {
    flex: 1,
  },
  title: {
    ...typography.body,
    fontWeight: '800',
  },
  correctText: {
    color: colors.success,
  },
  incorrectText: {
    color: '#9E2E48',
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
    backgroundColor: 'rgba(216,80,111,0.12)',
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
