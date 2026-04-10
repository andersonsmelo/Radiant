import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import type { ReinforcePayload } from '../../../types/lessonFlow';
import { colors } from '../../../ui/theme';
import { radius, space, typography } from '../../../ui/styles';

type ReinforceStepRendererProps = {
    payload: ReinforcePayload;
    answeredCorrectly?: boolean;
    explanation?: string;
};

export function ReinforceStepRenderer({
    payload,
    answeredCorrectly,
    explanation,
}: ReinforceStepRendererProps) {
    const backgroundColor =
        answeredCorrectly === true
            ? colors.successSoft
            : answeredCorrectly === false
                ? colors.warningSoft
                : colors.surfaceMuted;

    return (
        <View style={[styles.card, { backgroundColor }]}>
            <Text style={styles.title}>
                {answeredCorrectly === true
                    ? 'Resposta correta'
                    : answeredCorrectly === false
                        ? 'Vamos reforçar'
                        : payload.title}
            </Text>
            <Text style={styles.body}>{explanation ?? payload.body}</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    card: {
        borderRadius: radius.rLg,
        padding: space.s4,
        gap: space.s2,
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
