import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { colors } from '../../../ui/theme';
import { space, typography } from '../../../ui/styles';

type JourneyMapHeaderProps = {
    title: string;
    subtitle: string;
};

export function JourneyMapHeader({ title, subtitle }: JourneyMapHeaderProps) {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>{title}</Text>
            <Text style={styles.subtitle}>{subtitle}</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        gap: space.s1,
    },
    title: {
        ...typography.h3,
        color: colors.textPrimary,
    },
    subtitle: {
        ...typography.bodyRegular,
        color: colors.textSecondary,
    },
});
