import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import type { ContextPayload } from '../../../types/lessonFlow';
import { galaxyColors } from '../../../ui/theme';
import { layout, typography } from '../../../ui/styles';

export function ContextStepRenderer({ payload }: { payload: ContextPayload }) {
    return (
        <View style={layout.stackSm}>
            {/* `payload.eyebrow` não aparece: etiqueta acima do título saiu (spec 2026-11-16, 6). */}
            <Text style={styles.title}>{payload.title}</Text>
            {/* Na abertura em diálogo o corpo vem depois das falas, fora daqui. */}
            {payload.body ? <Text style={styles.body}>{payload.body}</Text> : null}
        </View>
    );
}

const styles = StyleSheet.create({
    title: {
        ...typography.h2,
        color: galaxyColors.textPrimary,
    },
    body: {
        ...typography.bodyRegular,
        color: galaxyColors.textSecondary,
    },
});
