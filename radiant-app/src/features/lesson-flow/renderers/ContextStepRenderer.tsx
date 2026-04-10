import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import type { ContextPayload } from '../../../types/lessonFlow';
import { colors } from '../../../ui/theme';
import { space, typography } from '../../../ui/styles';

export function ContextStepRenderer({ payload }: { payload: ContextPayload }) {
    return (
        <View style={styles.container}>
            {payload.eyebrow ? <Text style={styles.eyebrow}>{payload.eyebrow}</Text> : null}
            <Text style={styles.title}>{payload.title}</Text>
            <Text style={styles.body}>{payload.body}</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        gap: space.s2,
    },
    eyebrow: {
        ...typography.caption,
        color: colors.primary,
        textTransform: 'uppercase',
        letterSpacing: 1,
    },
    title: {
        ...typography.h2,
        color: colors.textPrimary,
    },
    body: {
        ...typography.bodyRegular,
        color: colors.textSecondary,
    },
});
