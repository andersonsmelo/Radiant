// src/features/quiz/components/QuizFeedback.tsx

/**
 * QuizFeedback Component
 * Displays feedback after the user answers a question
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { FEEDBACK_MESSAGES } from '../../../constants/quiz';

interface QuizFeedbackProps {
    isCorrect: boolean;
    explanation: string;
}

export function QuizFeedback({ isCorrect, explanation }: QuizFeedbackProps) {
    return (
        <View style={[styles.container, isCorrect ? styles.correct : styles.incorrect]}>
            <Text style={styles.title}>
                {isCorrect ? FEEDBACK_MESSAGES.CORRECT : FEEDBACK_MESSAGES.INCORRECT}
            </Text>
            <Text style={styles.explanation} numberOfLines={3}>
                {explanation}
            </Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: 16,
        borderRadius: 12,
        marginHorizontal: 20,
        marginBottom: 20,
    },
    correct: {
        backgroundColor: '#1E4620',
        borderWidth: 1,
        borderColor: '#34C759',
    },
    incorrect: {
        backgroundColor: '#3A3A3C',
        borderWidth: 1,
        borderColor: '#8E8E93',
    },
    title: {
        fontSize: 18,
        fontWeight: '700',
        color: '#FFFFFF',
        marginBottom: 8,
    },
    explanation: {
        fontSize: 14,
        fontWeight: '400',
        color: '#E5E5EA',
        lineHeight: 20,
    },
});
