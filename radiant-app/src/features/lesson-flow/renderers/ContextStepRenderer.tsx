import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import type { ContextPayload } from '../../../types/lessonFlow';
import { galaxyColors } from '../../../ui/theme';
import { semanticColors } from '../../../ui/semantic-colors';
import { space, typography } from '../../../ui/styles';

const galaxy = semanticColors.galaxy;

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
        color: galaxy.statusInformation,
        textTransform: 'uppercase',
        letterSpacing: 1,
    },
    title: {
        ...typography.h2,
        color: galaxyColors.textPrimary,
    },
    body: {
        ...typography.bodyRegular,
        color: galaxyColors.textSecondary,
    },
});
