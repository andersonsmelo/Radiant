import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import type { ReinforcePayload } from '../../../types/lessonFlow';
import { feedbackColors, galaxyColors } from '../../../ui/theme';
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
    // Superfícies opacas: acerto na superfície verde; reforço em âmbar, que não
    // tem superfície própria, vai no grafite ativo com a borda na cor cheia.
    const backgroundColor =
        answeredCorrectly === true
            ? feedbackColors.success.surface
            : answeredCorrectly === false
                ? galaxyColors.surfaceActive
                : galaxyColors.surface;
    const borderColor =
        answeredCorrectly === true
            ? feedbackColors.success.fill
            : answeredCorrectly === false
                ? galaxyColors.xpColor
                : galaxyColors.border;

    const hasQuestionContext = Boolean(payload.prompt || payload.correctAnswerLabel);

    return (
        <View style={[styles.card, { backgroundColor, borderColor }]}>
            <Text style={styles.title}>
                {answeredCorrectly === true
                    ? 'Resposta correta'
                    : answeredCorrectly === false
                        ? 'Vamos reforçar'
                        : payload.title}
            </Text>
            {hasQuestionContext ? (
                <View testID="reinforce-question-context" style={styles.recapBox}>
                    {payload.prompt ? (
                        <Text testID="reinforce-question-recap" style={styles.recapPrompt}>
                            {`Pergunta: ${payload.prompt}`}
                        </Text>
                    ) : null}
                    {payload.correctAnswerLabel ? (
                        <Text testID="reinforce-correct-answer" style={styles.recapAnswer}>
                            {`Gabarito: ${payload.correctAnswerLabel}`}
                        </Text>
                    ) : null}
                </View>
            ) : null}
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
    recapBox: {
        borderRadius: radius.rMd,
        backgroundColor: galaxyColors.surface,
        borderWidth: 1,
        borderColor: galaxyColors.border,
        padding: space.s3,
        gap: space.s1,
    },
    recapPrompt: {
        ...typography.caption,
        color: galaxyColors.textSecondary,
    },
    recapAnswer: {
        ...typography.bodyStrong,
        color: galaxyColors.textPrimary,
    },
    body: {
        ...typography.bodyRegular,
        color: galaxyColors.textSecondary,
    },
});

