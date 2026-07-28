import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import type { ReinforcePayload } from '../../../types/lessonFlow';
import { galaxyColors } from '../../../ui/theme';
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
    // Tintas translúcidas sobre o fundo galaxy: as versões "soft" da paleta
    // clara viravam blocos brancos no meio da lição.
    const backgroundColor =
        answeredCorrectly === true
            ? 'rgba(93,227,174,0.12)'
            : answeredCorrectly === false
                ? 'rgba(245,166,35,0.12)'
                : galaxyColors.surface;
    const borderColor =
        answeredCorrectly === true
            ? 'rgba(93,227,174,0.30)'
            : answeredCorrectly === false
                ? 'rgba(245,166,35,0.30)'
                : galaxyColors.border;

    return (
        <View style={[styles.card, { backgroundColor, borderColor }]}>
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
        borderWidth: 1,
        padding: space.s4,
        gap: space.s2,
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
