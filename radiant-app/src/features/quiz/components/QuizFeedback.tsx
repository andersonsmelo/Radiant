import React, { useEffect } from 'react';
import { Animated, StyleSheet, Text, View } from 'react-native';
import { SurfaceCard } from '../../../components/ui/SurfaceCard';
import { FEEDBACK_MESSAGES } from '../../../constants/quiz';
import { useScalePop, useShakeError } from '../../../ui/motion';
import { PixelIllustration } from '../../../ui/characters/PixelIllustration';
import type { PixelExpression } from '../../../ui/characters/pixelExpressions';
import { galaxyColors } from '../../../ui/theme';
import { semanticColors } from '../../../ui/semantic-colors';
import { radius, space, typography } from '../../../ui/styles';

const galaxy = semanticColors.galaxy;

interface QuizFeedbackProps {
  isCorrect: boolean;
  explanation: string;
  moodPhrase?: string;
  moodExpression?: PixelExpression;
}

export function QuizFeedback({
  isCorrect,
  explanation,
  moodPhrase,
  moodExpression,
}: QuizFeedbackProps) {
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
      <SurfaceCard variant="galaxy" style={[styles.card, isCorrect ? styles.correctCard : styles.incorrectCard]}>
        <View style={styles.header}>
          {/* O mascote reage à resposta. Ele existia só nos resumos: nos
              momentos em que um personagem de aprendizado importa — acertar e
              errar — a tela não tinha ninguém. */}
          <PixelIllustration
            state={isCorrect ? 'happy' : 'oops'}
            size="sm"
            tier="intermediate"
            expression={moodExpression ?? (isCorrect ? 'feliz' : 'neutro')}
            accessibilityLabel={
              isCorrect ? 'Pixel comemorando o acerto' : 'Pixel acompanhando o erro'
            }
          />
          <View style={styles.headerCopy}>
            <Text style={[styles.title, isCorrect ? styles.correctText : styles.incorrectText]}>
              {moodPhrase ?? (isCorrect ? FEEDBACK_MESSAGES.CORRECT : FEEDBACK_MESSAGES.INCORRECT)}
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
    backgroundColor: 'rgba(93,227,174,0.14)',
    borderColor: galaxy.statusSuccess,
  },
  incorrectCard: {
    backgroundColor: 'rgba(255,130,152,0.14)',
    borderColor: galaxyColors.critical,
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
    color: galaxy.statusSuccess,
  },
  incorrectText: {
    color: galaxyColors.critical,
  },
  badge: {
    borderRadius: radius.rXl,
    paddingHorizontal: space.s2,
    paddingVertical: space.s1,
  },
  correctBadge: {
    backgroundColor: 'rgba(93,227,174,0.16)',
  },
  incorrectBadge: {
    backgroundColor: 'rgba(255,130,152,0.16)',
  },
  badgeText: {
    ...typography.micro,
    color: galaxyColors.textPrimary,
    textTransform: 'uppercase',
    letterSpacing: 0.6,
  },
  explanation: {
    ...typography.bodyRegular,
    color: galaxyColors.textSecondary,
  },
});
