import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { colors } from '../../../ui/theme';
import { space, typography } from '../../../ui/styles';

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
                <Text style={styles.title}>{title}</Text>
                <Text style={styles.badge}>
                    {currentStep}/{totalSteps}
                </Text>
            </View>
            <View style={styles.track}>
                <View style={[styles.fill, { width: `${Math.max(10, progressPercent)}%` }]} />
            </View>
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
        color: colors.textPrimary,
        flex: 1,
    },
    badge: {
        ...typography.caption,
        color: colors.textSecondary,
    },
    track: {
        height: 10,
        borderRadius: 999,
        backgroundColor: colors.surfaceMuted,
        overflow: 'hidden',
    },
    fill: {
        height: '100%',
        borderRadius: 999,
        backgroundColor: colors.primary,
    },
});
