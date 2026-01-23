// src/features/quiz/components/QuizQuestion.tsx

/**
 * QuizQuestion Component
 * Displays a quiz question with answer options
 */

import React from 'react';
import { View, Text, Pressable, Image, StyleSheet } from 'react-native';
import type { QuizQuestion } from '../../../types/quiz';
import { UI_CONFIG } from '../../../constants/quiz';

interface QuizQuestionProps {
    question: QuizQuestion;
    selectedAnswerIndex: number | null;
    isAnswered: boolean;
    onSelectAnswer: (answerIndex: number) => void;
}

export function QuizQuestion({
    question,
    selectedAnswerIndex,
    isAnswered,
    onSelectAnswer,
}: QuizQuestionProps) {
    return (
        <View style={styles.container}>
            <Text style={styles.prompt}>{question.prompt}</Text>

            {question.type === 'image' && question.imageUrl && (
                <Image
                    source={{ uri: question.imageUrl }}
                    style={styles.image}
                    resizeMode="contain"
                />
            )}

            <View style={styles.optionsContainer}>
                {question.options.map((option, index) => {
                    const isSelected = selectedAnswerIndex === index;

                    return (
                        <Pressable
                            key={index}
                            style={({ pressed }) => [
                                styles.optionButton,
                                isSelected && styles.optionButtonSelected,
                                pressed && !isAnswered && styles.optionButtonPressed,
                            ]}
                            onPress={() => !isAnswered && onSelectAnswer(index)}
                            disabled={isAnswered}
                        >
                            <Text
                                style={[
                                    styles.optionText,
                                    isSelected && styles.optionTextSelected,
                                ]}
                            >
                                {option.label}
                            </Text>
                        </Pressable>
                    );
                })}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
    },
    prompt: {
        fontSize: 20,
        fontWeight: '600',
        color: '#FFFFFF',
        marginBottom: 24,
        lineHeight: 28,
    },
    image: {
        width: '100%',
        height: UI_CONFIG.IMAGE_MAX_HEIGHT,
        marginBottom: 24,
        borderRadius: 12,
        backgroundColor: '#1C1C1E',
    },
    optionsContainer: {
        gap: 12,
    },
    optionButton: {
        height: UI_CONFIG.BUTTON_HEIGHT,
        borderRadius: UI_CONFIG.BUTTON_BORDER_RADIUS,
        backgroundColor: '#1C1C1E',
        borderWidth: 2,
        borderColor: '#2C2C2E',
        justifyContent: 'center',
        paddingHorizontal: 16,
    },
    optionButtonSelected: {
        backgroundColor: '#0A84FF',
        borderColor: '#0A84FF',
    },
    optionButtonPressed: {
        opacity: 0.7,
    },
    optionText: {
        fontSize: 16,
        fontWeight: '500',
        color: '#FFFFFF',
    },
    optionTextSelected: {
        color: '#FFFFFF',
        fontWeight: '600',
    },
});
