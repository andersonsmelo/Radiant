// src/features/quiz/screens/QuizScreen.tsx

/**
 * QuizScreen — Main quiz interface
 * Orchestrates the quiz flow using useQuiz hook
 * Supports both normal and review modes
 */

import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Pressable, SafeAreaView, ScrollView, ActivityIndicator } from 'react-native';
import { useQuiz } from '../hooks/useQuiz';
import { QuizQuestion } from '../components/QuizQuestion';
import { QuizFeedback } from '../components/QuizFeedback';
import type { QuizLesson, QuizLessonId } from '../../../types/quiz';

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

interface QuizScreenProps {
    mode?: 'normal' | 'review';
    lessonIds?: QuizLessonId[];
}

export default function QuizScreen({ mode = 'normal', lessonIds = [] }: QuizScreenProps) {
    const [currentLessonIndex, setCurrentLessonIndex] = useState(0);
    const [currentLesson, setCurrentLesson] = useState<QuizLesson | null>(null);
    const [loading, setLoading] = useState(mode === 'review');
    const [allReviewsComplete, setAllReviewsComplete] = useState(false);

    // Load lesson data (in review mode, fetch from lessonIds)
    useEffect(() => {
        if (mode === 'review' && lessonIds.length > 0) {
            // TODO: Load lesson data from lessonIds[currentLessonIndex]
            // For now, use mock lesson
            setCurrentLesson(MOCK_LESSON);
            setLoading(false);
        } else {
            setCurrentLesson(MOCK_LESSON);
            setLoading(false);
        }
    }, [mode, lessonIds, currentLessonIndex]);

    const handleNextLesson = () => {
        if (currentLessonIndex < lessonIds.length - 1) {
            setCurrentLessonIndex(currentLessonIndex + 1);
            setLoading(true);
            // Reset will happen automatically when QuizUI remounts with new key
        }
    };

    const handleFinishReview = () => {
        // TODO: Navigate back to HomeScreen
        console.log('Review complete! Returning to home...');
    };

    if (loading) {
        return (
            <SafeAreaView style={styles.container}>
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color="#0A84FF" />
                    <Text style={styles.loadingText}>Carregando lição...</Text>
                </View>
            </SafeAreaView>
        );
    }

    if (allReviewsComplete) {
        return (
            <SafeAreaView style={styles.container}>
                <View style={styles.summaryContainer}>
                    <Text style={styles.summaryTitle}>Revisão Concluída!</Text>

                    <View style={styles.scoreCard}>
                        <Text style={styles.scoreLabel}>Lições Revisadas</Text>
                        <Text style={styles.scoreValue}>{lessonIds.length}</Text>
                    </View>

                    <Text style={styles.resultMessage}>
                        ✓ Todas as revisões foram concluídas
                    </Text>

                    <Pressable style={styles.primaryButton} onPress={handleFinishReview}>
                        <Text style={styles.primaryButtonText}>Voltar ao Início</Text>
                    </Pressable>
                </View>
            </SafeAreaView>
        );
    }

    // Wrap quiz UI in a keyed component to force remount when lesson changes
    const quizKey = mode === 'review' ? `review-${currentLessonIndex}` : 'normal';

    return (
        <QuizUI
            key={quizKey}
            lesson={currentLesson || MOCK_LESSON}
            mode={mode}
            currentLessonIndex={currentLessonIndex}
            totalLessons={lessonIds.length}
            onNextLesson={handleNextLesson}
            onFinishReview={handleFinishReview}
        />
    );
}

interface QuizUIProps {
    lesson: QuizLesson;
    mode: 'normal' | 'review';
    currentLessonIndex: number;
    totalLessons: number;
    onNextLesson: () => void;
    onFinishReview: () => void;
}

function QuizUI({ lesson, mode, currentLessonIndex, totalLessons, onNextLesson, onFinishReview }: QuizUIProps) {
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
    } = useQuiz(lesson);

    // Render lesson completion screen
    if (isFinished && result) {
        const scorePercentage = Math.round((result.correctAnswers / result.totalQuestions) * 100);
        const passed = scorePercentage >= 70;
        const hasMoreLessons = mode === 'review' && currentLessonIndex < totalLessons - 1;

        return (
            <SafeAreaView style={styles.container}>
                <View style={styles.summaryContainer}>
                    <Text style={styles.summaryTitle}>
                        {mode === 'review' ? 'Lição Revisada!' : 'Quiz Concluído!'}
                    </Text>

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

                    {mode === 'review' && (
                        <Text style={styles.reviewProgress}>
                            Lição {currentLessonIndex + 1} de {totalLessons}
                        </Text>
                    )}

                    {hasMoreLessons ? (
                        <Pressable style={styles.primaryButton} onPress={onNextLesson}>
                            <Text style={styles.primaryButtonText}>Próxima Lição</Text>
                        </Pressable>
                    ) : (
                        <Pressable style={styles.primaryButton} onPress={mode === 'review' ? onFinishReview : reset}>
                            <Text style={styles.primaryButtonText}>
                                {mode === 'review' ? 'Finalizar Revisão' : 'Reiniciar Quiz'}
                            </Text>
                        </Pressable>
                    )}

                    {mode === 'normal' && (
                        <Pressable style={styles.secondaryButton} onPress={() => { }}>
                            <Text style={styles.secondaryButtonText}>Sair</Text>
                        </Pressable>
                    )}
                </View>
            </SafeAreaView>
        );
    }

    // Render active quiz

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.lessonTitle}>{lesson.title}</Text>
                <Text style={styles.progressText}>
                    Questão {progress.currentQuestionIndex + 1} de {progress.totalQuestions}
                </Text>
                {mode === 'review' && (
                    <Text style={styles.reviewModeLabel}>
                        Modo Revisão • Lição {currentLessonIndex + 1}/{totalLessons}
                    </Text>
                )}
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
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadingText: {
        fontSize: 16,
        fontWeight: '500',
        color: '#8E8E93',
        marginTop: 16,
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
    reviewModeLabel: {
        fontSize: 12,
        fontWeight: '600',
        color: '#0A84FF',
        marginTop: 4,
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
        marginBottom: 16,
        color: '#34C759',
    },
    passedMessage: {
        color: '#34C759',
    },
    failedMessage: {
        color: '#FF453A',
    },
    reviewProgress: {
        fontSize: 14,
        fontWeight: '500',
        color: '#8E8E93',
        marginBottom: 24,
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
