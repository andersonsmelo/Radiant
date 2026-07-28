import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { galaxyColors } from '../../../ui/theme';
import { space, typography } from '../../../ui/styles';
import { AnimatedProgressBar } from '../../../components/ui/AnimatedProgressBar';

type LessonFlowProgressHeaderProps = {
    title: string;
    currentStep: number;
    totalSteps: number;
    progressPercent: number;
};

export function LessonFlowProgressHeader({
    title,
    currentStep,
    totalSteps,
    progressPercent,
}: LessonFlowProgressHeaderProps) {
    return (
        <View style={styles.container}>
            <View style={styles.topRow}>
                <Text style={styles.title} accessibilityRole="header">{title}</Text>
                <Text style={styles.badge}>
                    {currentStep}/{totalSteps}
                </Text>
            </View>
            {/* Antes era uma View com width em porcentagem: o avanço entre os
                passos da lição saltava em vez de animar. */}
            <AnimatedProgressBar
                ratio={Math.max(10, progressPercent) / 100}
                height={10}
                accessibilityLabel={`Passo ${currentStep} de ${totalSteps}`}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        gap: space.s2,
    },
    topRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: space.s2,
    },
    title: {
        ...typography.h3,
        color: galaxyColors.textPrimary,
        flex: 1,
    },
    badge: {
        ...typography.caption,
        color: galaxyColors.textSecondary,
    },
});
