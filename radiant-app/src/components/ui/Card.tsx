// src/components/ui/Card.tsx

import React from 'react';
import { View, StyleSheet, ViewStyle, StyleProp } from 'react-native';

interface CardProps {
    children: React.ReactNode;
    variant?: 'standard' | 'compact';
    style?: StyleProp<ViewStyle>;
}

const COLORS = {
    cardBackground: '#1C1C1E',
};

const SPACING = {
    compact: 16,
    standard: 32,
};

const RADIUS = {
    compact: 12,
    standard: 16,
};

export function Card({ children, variant = 'standard', style }: CardProps) {
    return (
        <View
            style={[
                styles.card,
                variant === 'compact' ? styles.compact : styles.standard,
                style,
            ]}
        >
            {children}
        </View>
    );
}

const styles = StyleSheet.create({
    card: {
        backgroundColor: COLORS.cardBackground,
    },
    standard: {
        borderRadius: RADIUS.standard,
        padding: SPACING.standard,
    },
    compact: {
        borderRadius: RADIUS.compact,
        padding: SPACING.compact,
    },
});
