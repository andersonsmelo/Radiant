import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import type { ContextPayload } from '../../../types/lessonFlow';
import { galaxyColors } from '../../../ui/theme';
import { semanticColors } from '../../../ui/semantic-colors';
import { layout, typography } from '../../../ui/styles';

const galaxy = semanticColors.galaxy;

export function ContextStepRenderer({ payload }: { payload: ContextPayload }) {
    return (
        <View style={layout.stackSm}>
            {payload.eyebrow ? <Text style={styles.eyebrow}>{payload.eyebrow}</Text> : null}
            <Text style={styles.title}>{payload.title}</Text>
            {/* Na abertura em diálogo o corpo vem depois das falas, fora daqui. */}
            {payload.body ? <Text style={styles.body}>{payload.body}</Text> : null}
        </View>
    );
}

const styles = StyleSheet.create({
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
