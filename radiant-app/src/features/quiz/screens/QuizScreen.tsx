// src/features/quiz/screens/QuizScreen.tsx

/**
 * QuizScreen — Main quiz interface
 * Orchestrates the quiz flow using useQuiz hook
 */

import React from 'react';
import { View, Text, StyleSheet, Pressable, SafeAreaView, ScrollView } from 'react-native';
import { useQuiz } from '../hooks/useQuiz';
import { QuizQuestion } from '../components/QuizQuestion';
import { QuizFeedback } from '../components/QuizFeedback';
import type { QuizLesson } from '../../../types/quiz';

// Temporary mock lesson for development
const MOCK_LESSON: QuizLesson = {
    id: 'lesson-1',
    title: 'Fundamentos de Radiologia',
    difficulty: 'beginner',
    questions: [
        {
            id: 'q1',
            type: 'multiple-choice',
            prompt: 'Qual é a principal função dos raios-X na radiologia diagnóstica?',
            options: [
                { label: 'Tratamento de tumores' },
                { label: 'Visualização de estruturas internas' },
                { label: 'Esterilização de equipamentos' },
                { label: 'Aquecimento de tecidos' },
            ],
            correctAnswerIndex: 1,
            explanation: 'Os raios-X são usados principalmente para criar imagens de estruturas internas do corpo, permitindo o diagnóstico de diversas condições médicas.',
        },
        {
            id: 'q2',
            type: 'multiple-choice',
            prompt: 'Qual estrutura é mais radiopaca em uma radiografia?',
            options: [
                { label: 'Ar' },
                { label: 'Gordura' },
                { label: 'Osso' },
                { label: 'Músculo' },
            ],
            correctAnswerIndex: 2,
            explanation: 'O osso é a estrutura mais radiopaca (aparece mais branca) devido à sua alta densidade e conteúdo de cálcio, que absorve mais raios-X.',
        },
        {
            id: 'q3',
            type: 'multiple-choice',
            prompt: 'O que significa o termo "contraste" em radiologia?',
            options: [
                { label: 'Brilho da imagem' },
                { label: 'Diferença de densidade entre estruturas' },
                { label: 'Tamanho da imagem' },
                { label: 'Velocidade do exame' },
            ],
            correctAnswerIndex: 1,
            explanation: 'Contraste refere-se à diferença de densidade entre diferentes estruturas, permitindo distingui-las na imagem radiográfica.',
        },
    ],
};

export default function QuizScreen() {
    const {
        currentQuestion,
        progress,
        selectedAnswerIndex,
        isAnswered,
        correctAnswers,
        feedback,
        isFinished,
        result,
        selectAnswer,
        next,
        reset,
    } = useQuiz(MOCK_LESSON);

    if (isFinished && result) {
        const scorePercentage = Math.round((result.correctAnswers / result.totalQuestions) * 100);
        const passed = scorePercentage >= 70;

        return (
            <SafeAreaView style={styles.container}>
                <View style={styles.summaryContainer}>
                    <Text style={styles.summaryTitle}>Quiz Concluído!</Text>

                    <View style={styles.scoreCard}>
                        <Text style={styles.scoreLabel}>Sua Pontuação</Text>
                        <Text style={[styles.scoreValue, passed ? styles.scorePassed : styles.scoreFailed]}>
                            {scorePercentage}%
                        </Text>
                        <Text style={styles.scoreDetails}>
                            {result.correctAnswers} de {result.totalQuestions} corretas
                        </Text>
                    </View>

                    <Text style={[styles.resultMessage, passed ? styles.passedMessage : styles.failedMessage]}>
                        {passed ? '✓ Aprovado!' : '✗ Não aprovado'}
                    </Text>

                    <Pressable style={styles.primaryButton} onPress={reset}>
                        <Text style={styles.primaryButtonText}>Reiniciar Quiz</Text>
                    </Pressable>

                    <Pressable style={styles.secondaryButton} onPress={() => { }}>
                        <Text style={styles.secondaryButtonText}>Sair</Text>
                    </Pressable>
                </View>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.lessonTitle}>{MOCK_LESSON.title}</Text>
                <Text style={styles.progressText}>
                    Questão {progress.currentQuestionIndex + 1} de {progress.totalQuestions}
                </Text>
            </View>

            <ScrollView style={styles.content} contentContainerStyle={styles.contentContainer}>
                {currentQuestion && (
                    <QuizQuestion
                        question={currentQuestion}
                        selectedAnswerIndex={selectedAnswerIndex}
                        isAnswered={isAnswered}
                        onSelectAnswer={selectAnswer}
                    />
                )}

                {feedback.visible && (
                    <QuizFeedback isCorrect={feedback.isCorrect} explanation={feedback.explanation} />
                )}
            </ScrollView>

            {isAnswered && (
                <View style={styles.footer}>
                    <Pressable style={styles.nextButton} onPress={next}>
                        <Text style={styles.nextButtonText}>Próxima</Text>
                    </Pressable>
                </View>
            )}
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000000',
    },
    header: {
        padding: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#2C2C2E',
    },
    lessonTitle: {
        fontSize: 24,
        fontWeight: '700',
        color: '#FFFFFF',
        marginBottom: 8,
    },
    progressText: {
        fontSize: 14,
        fontWeight: '500',
        color: '#8E8E93',
    },
    content: {
        flex: 1,
    },
    contentContainer: {
        flexGrow: 1,
    },
    footer: {
        padding: 20,
        borderTopWidth: 1,
        borderTopColor: '#2C2C2E',
    },
    nextButton: {
        height: 56,
        borderRadius: 12,
        backgroundColor: '#0A84FF',
        justifyContent: 'center',
        alignItems: 'center',
    },
    nextButtonText: {
        fontSize: 18,
        fontWeight: '600',
        color: '#FFFFFF',
    },
    summaryContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    summaryTitle: {
        fontSize: 32,
        fontWeight: '700',
        color: '#FFFFFF',
        marginBottom: 40,
    },
    scoreCard: {
        width: '100%',
        backgroundColor: '#1C1C1E',
        borderRadius: 16,
        padding: 32,
        alignItems: 'center',
        marginBottom: 24,
    },
    scoreLabel: {
        fontSize: 16,
        fontWeight: '500',
        color: '#8E8E93',
        marginBottom: 12,
    },
    scoreValue: {
        fontSize: 64,
        fontWeight: '700',
        marginBottom: 8,
    },
    scorePassed: {
        color: '#34C759',
    },
    scoreFailed: {
        color: '#FF453A',
    },
    scoreDetails: {
        fontSize: 16,
        fontWeight: '500',
        color: '#FFFFFF',
    },
    resultMessage: {
        fontSize: 20,
        fontWeight: '600',
        marginBottom: 40,
    },
    passedMessage: {
        color: '#34C759',
    },
    failedMessage: {
        color: '#FF453A',
    },
    primaryButton: {
        width: '100%',
        height: 56,
        borderRadius: 12,
        backgroundColor: '#0A84FF',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 12,
    },
    primaryButtonText: {
        fontSize: 18,
        fontWeight: '600',
        color: '#FFFFFF',
    },
    secondaryButton: {
        width: '100%',
        height: 56,
        borderRadius: 12,
        backgroundColor: '#2C2C2E',
        justifyContent: 'center',
        alignItems: 'center',
    },
    secondaryButtonText: {
        fontSize: 18,
        fontWeight: '600',
        color: '#FFFFFF',
    },
});
