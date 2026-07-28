import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import type { TeachPayload } from '../../../types/lessonFlow';
import { galaxyColors } from '../../../ui/theme';
import { semanticColors } from '../../../ui/semantic-colors';
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
        color: semanticColors.galaxy.statusInformation,
        textTransform: 'uppercase',
        letterSpacing: 1,
    },
    title: {
        ...typography.h3,
        color: galaxyColors.textPrimary,
    },
    body: {
        ...typography.bodyRegular,
        color: galaxyColors.textSecondary,
    },
});
