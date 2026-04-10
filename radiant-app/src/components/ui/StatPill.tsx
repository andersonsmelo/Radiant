// src/components/ui/StatPill.tsx

import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';

interface StatPillProps {
    label: string;
    value: string | number;
    style?: ViewStyle;
}

const COLORS = {
    cardBackground: '#1C1C1E',
    primaryText: '#FFFFFF',
    secondaryText: '#8E8E93',
};

const SPACING = {
    xs: 4,
    lg: 16,
};

const RADIUS = {
    medium: 12,
};

export function StatPill({ label, value, style }: StatPillProps) {
    return (
        <View style={[styles.container, style]}>
            <Text style={styles.label}>{label}</Text>
            <Text style={styles.value}>{value}</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: COLORS.cardBackground,
        borderRadius: RADIUS.medium,
        padding: SPACING.lg,
        alignItems: 'center',
    },
    label: {
        fontSize: 14,
        fontWeight: '500',
        color: COLORS.secondaryText,
        marginBottom: SPACING.xs,
    },
    value: {
        fontSize: 20,
        fontWeight: '700',
        color: COLORS.primaryText,
    },
});
