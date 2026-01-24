// src/features/home/screens/HomeScreen.tsx

/**
 * HomeScreen — Main home interface
 * Displays due lessons count and navigation to quiz/review
 */

import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Pressable, SafeAreaView, ActivityIndicator } from 'react-native';
import { SpacedRepetitionService } from '../../spaced-repetition/services/SpacedRepetitionService';

export default function HomeScreen() {
    const [dueCount, setDueCount] = useState<number>(0);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        loadDueLessons();
    }, []);

    const loadDueLessons = async () => {
        try {
            setLoading(true);
            const dueLessons = await SpacedRepetitionService.getDueLessons();
            setDueCount(dueLessons.length);
        } catch (error) {
            console.error('[HomeScreen] Error loading due lessons:', error);
            setDueCount(0);
        } finally {
            setLoading(false);
        }
    };

    const handleStartReview = () => {
        // TODO: Navigate to QuizScreen with due lessons
        // Example: navigation.navigate('QuizScreen', { mode: 'review' })
        console.log('Starting review with', dueCount, 'due lessons');
    };

    const handleContinueLearning = () => {
        // TODO: Navigate to QuizScreen with normal lesson flow
        // Example: navigation.navigate('QuizScreen', { mode: 'learn' })
        console.log('Continue learning');
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.content}>
                <Text style={styles.title}>Radiant</Text>

                {loading ? (
                    <View style={styles.loadingContainer}>
                        <ActivityIndicator size="large" color="#0A84FF" />
                    </View>
                ) : (
                    <>
                        <View style={styles.statsCard}>
                            <Text style={styles.statsLabel}>Revisões pendentes hoje</Text>
                            <Text style={styles.statsValue}>{dueCount}</Text>
                        </View>

                        <View style={styles.buttonsContainer}>
                            <Pressable
                                style={[
                                    styles.primaryButton,
                                    dueCount === 0 && styles.buttonDisabled,
                                ]}
                                onPress={handleStartReview}
                                disabled={dueCount === 0}
                            >
                                <Text
                                    style={[
                                        styles.primaryButtonText,
                                        dueCount === 0 && styles.buttonTextDisabled,
                                    ]}
                                >
                                    Iniciar revisão
                                </Text>
                            </Pressable>

                            <Pressable style={styles.secondaryButton} onPress={handleContinueLearning}>
                                <Text style={styles.secondaryButtonText}>Continuar aprendendo</Text>
                            </Pressable>
                        </View>
                    </>
                )}
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000000',
    },
    content: {
        flex: 1,
        padding: 20,
        justifyContent: 'center',
    },
    title: {
        fontSize: 48,
        fontWeight: '700',
        color: '#FFFFFF',
        textAlign: 'center',
        marginBottom: 60,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    statsCard: {
        backgroundColor: '#1C1C1E',
        borderRadius: 16,
        padding: 32,
        alignItems: 'center',
        marginBottom: 40,
    },
    statsLabel: {
        fontSize: 16,
        fontWeight: '500',
        color: '#8E8E93',
        marginBottom: 12,
    },
    statsValue: {
        fontSize: 64,
        fontWeight: '700',
        color: '#0A84FF',
    },
    buttonsContainer: {
        gap: 16,
    },
    primaryButton: {
        height: 56,
        borderRadius: 12,
        backgroundColor: '#0A84FF',
        justifyContent: 'center',
        alignItems: 'center',
    },
    primaryButtonText: {
        fontSize: 18,
        fontWeight: '600',
        color: '#FFFFFF',
    },
    secondaryButton: {
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
    buttonDisabled: {
        backgroundColor: '#2C2C2E',
        opacity: 0.5,
    },
    buttonTextDisabled: {
        color: '#8E8E93',
    },
});
