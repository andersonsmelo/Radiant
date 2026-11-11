import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import type { AdvancePayload } from '../../../types/lessonFlow';
import { galaxyColors } from '../../../ui/theme';
import { layout, typography } from '../../../ui/styles';

export function AdvanceStepRenderer({ payload }: { payload: AdvancePayload }) {
    return (
        <View style={layout.stackSm}>
            <Text style={styles.title}>{payload.title}</Text>
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
