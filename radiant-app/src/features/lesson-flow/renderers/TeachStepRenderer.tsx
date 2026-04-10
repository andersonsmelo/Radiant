import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import type { TeachPayload } from '../../../types/lessonFlow';
import { colors } from '../../../ui/theme';
import { space, typography } from '../../../ui/styles';

export function TeachStepRenderer({ payload }: { payload: TeachPayload }) {
    return (
        <View style={styles.card}>
            <Text style={styles.eyebrow}>Ideia-chave</Text>
            <Text style={styles.title}>{payload.title}</Text>
            <Text style={styles.body}>{payload.body}</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    card: {
        gap: space.s2,
    },
    eyebrow: {
        ...typography.caption,
        color: colors.primary,
        textTransform: 'uppercase',
        letterSpacing: 1,
    },
    title: {
        ...typography.body,
        color: colors.textPrimary,
        fontSize: 22,
    },
    body: {
        ...typography.bodyRegular,
        color: colors.textSecondary,
    },
});
