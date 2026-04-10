import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import type { AdvancePayload } from '../../../types/lessonFlow';
import { colors } from '../../../ui/theme';
import { space, typography } from '../../../ui/styles';

export function AdvanceStepRenderer({ payload }: { payload: AdvancePayload }) {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>{payload.title}</Text>
            {payload.body ? <Text style={styles.body}>{payload.body}</Text> : null}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        gap: space.s2,
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
