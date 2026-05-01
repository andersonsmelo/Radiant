import React, { useEffect } from 'react';
import { Animated, Pressable, StyleSheet, Text, View } from 'react-native';
import { SurfaceCard } from '../../../components/ui/SurfaceCard';
import { XrayPanel } from '../../../components/ui/XrayPanel';
import { UI_CONFIG } from '../../../constants/quiz';
import type { QuizQuestion as QuizQuestionModel } from '../../../types/quiz';
import { useCardEnter } from '../../../ui/motion';
import { colors } from '../../../ui/theme';
import { radius, space, typography } from '../../../ui/styles';

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
      <SurfaceCard variant="elevated" style={styles.card}>
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
    color: colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  prompt: {
    ...typography.h3,
    color: colors.textPrimary,
  },
  image: {
    width: '100%',
    height: UI_CONFIG.IMAGE_MAX_HEIGHT,
    borderRadius: radius.rLg,
    backgroundColor: colors.surfaceMuted,
  },
  optionsContainer: {
    gap: space.s2,
  },
  optionButton: {
    minHeight: UI_CONFIG.BUTTON_HEIGHT,
    borderRadius: radius.rLg,
    backgroundColor: colors.surfaceMuted,
    borderWidth: 1,
    borderColor: colors.borderSoft,
    paddingHorizontal: space.s3,
    paddingVertical: space.s2,
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.s2,
  },
  optionButtonSelected: {
    backgroundColor: colors.primary,
    borderColor: colors.primaryStrong,
  },
  optionButtonPressed: {
    opacity: 0.72,
  },
  optionButtonCorrect: {
    backgroundColor: '#E5F7EF',
    borderColor: '#1A9C71',
  },
  optionButtonWrong: {
    backgroundColor: '#FCEAEF',
    borderColor: '#D8506F',
  },
  optionMarker: {
    width: space.s2,
    height: space.s2,
    borderRadius: radius.rSm,
    borderWidth: 2,
    borderColor: colors.borderStrong,
    backgroundColor: colors.surface,
  },
  optionMarkerSelected: {
    borderColor: '#FFFFFF',
    backgroundColor: colors.highlight,
  },
  optionText: {
    ...typography.bodyRegular,
    color: colors.textPrimary,
    flex: 1,
  },
  optionTextSelected: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
});
