import React, { useEffect } from 'react';
import { Animated, Pressable, StyleSheet, Text, View } from 'react-native';
import { SurfaceCard } from '../../../components/ui/SurfaceCard';
import { XrayPanel } from '../../../components/ui/XrayPanel';
import { UI_CONFIG } from '../../../constants/quiz';
import type { QuizQuestion as QuizQuestionModel } from '../../../types/quiz';
import { useCardEnter } from '../../../ui/motion';
import { galaxyColors } from '../../../ui/theme';
import { semanticColors } from '../../../ui/semantic-colors';
import { radius, space, typography } from '../../../ui/styles';

const galaxy = semanticColors.galaxy;

interface QuizQuestionProps {
  question: QuizQuestionModel;
  selectedAnswerIndex: number | null;
  correctAnswerIndex?: number;
  isAnswered: boolean;
  onSelectAnswer: (answerIndex: number) => void;
}

export function QuizQuestion({
  question,
  selectedAnswerIndex,
  correctAnswerIndex,
  isAnswered,
  onSelectAnswer,
}: QuizQuestionProps) {
  const cardEnter = useCardEnter();

  useEffect(() => {
    cardEnter.reset();
    cardEnter.animateIn();
  }, [cardEnter, question.id]);

  return (
    <Animated.View style={cardEnter.animatedStyle}>
      <SurfaceCard variant="galaxy" style={styles.card}>
        <View style={styles.header}>
          <Text style={styles.eyebrow}>
            {question.type === 'image' ? 'Questão guiada por imagem' : 'Questão de múltipla escolha'}
          </Text>
          <Text style={styles.prompt}>{question.prompt}</Text>
        </View>

        {question.type === 'image' ? (
          <XrayPanel height={220} highlight={{ x: 230, y: 110, r: 18 }} />
        ) : null}

        <View style={styles.optionsContainer}>
          {question.options.map((option, index) => {
            const isSelectedOption = selectedAnswerIndex === index;
            const isCorrectOption = correctAnswerIndex !== undefined && correctAnswerIndex === index;
            const isWrongSelected = isAnswered && isSelectedOption && !isCorrectOption;
            const isCorrectHighlight = isAnswered && isCorrectOption;

            return (
              <Pressable
                key={`${question.id}:${index}:${option.label}`}
                onPress={() => !isAnswered && onSelectAnswer(index)}
                disabled={isAnswered}
                accessibilityRole="button"
                accessibilityLabel={option.label}
                accessibilityHint={isAnswered ? 'Resposta bloqueada após o envio.' : 'Seleciona esta resposta.'}
                accessibilityState={{ selected: isSelectedOption, disabled: isAnswered }}
                style={({ pressed }) => [
                  styles.optionButton,
                  isSelectedOption && !isAnswered && styles.optionButtonSelected,
                  isCorrectHighlight && styles.optionButtonCorrect,
                  isWrongSelected && styles.optionButtonWrong,
                  pressed && !isAnswered && styles.optionButtonPressed,
                ]}
              >
                <View style={[styles.optionMarker, isSelectedOption && styles.optionMarkerSelected]} />
                <Text style={[styles.optionText, isSelectedOption && styles.optionTextSelected]}>{option.label}</Text>
              </Pressable>
            );
          })}
        </View>
      </SurfaceCard>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  card: {
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
    ...typography.h2,
    color: galaxyColors.textPrimary,
    textAlign: 'center',
    marginVertical: space.s5,
  },
  image: {
    width: '100%',
    height: UI_CONFIG.IMAGE_MAX_HEIGHT,
    borderRadius: radius.rLg,
    backgroundColor: galaxyColors.surfaceMuted,
  },
  optionsContainer: {
    gap: space.s2,
  },
  optionButton: {
    minHeight: UI_CONFIG.BUTTON_HEIGHT,
    width: '100%',
    borderRadius: radius.rLg,
    backgroundColor: galaxyColors.surfaceMuted,
    borderWidth: 1,
    borderColor: galaxyColors.border,
    paddingHorizontal: space.s3,
    paddingVertical: space.s3,
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.s2,
  },
  optionButtonSelected: {
    backgroundColor: galaxyColors.ctaGradientStart,
    borderColor: galaxy.statusInformation,
  },
  optionButtonPressed: {
    opacity: 0.72,
  },
  // Tintas translúcidas: as versões sólidas viravam blocos claros na revelação.
  optionButtonCorrect: {
    backgroundColor: 'rgba(93,227,174,0.16)',
    borderColor: galaxy.statusSuccess,
  },
  optionButtonWrong: {
    backgroundColor: 'rgba(255,130,152,0.16)',
    borderColor: galaxyColors.critical,
  },
  optionMarker: {
    width: space.s2,
    height: space.s2,
    borderRadius: radius.rSm,
    borderWidth: 2,
    borderColor: galaxyColors.borderActive,
    backgroundColor: 'transparent',
  },
  optionMarkerSelected: {
    borderColor: '#FFFFFF',
    backgroundColor: '#FFFFFF',
  },
  optionText: {
    ...typography.bodyRegular,
    color: galaxyColors.textPrimary,
    flex: 1,
    textAlign: 'center',
  },
  optionTextSelected: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
});
