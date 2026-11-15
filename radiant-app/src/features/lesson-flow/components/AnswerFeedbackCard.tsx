import React, { useEffect } from 'react';
import { Animated, StyleSheet, Text, View, type LayoutChangeEvent } from 'react-native';
import { CastAvatar } from '../../../ui/characters/cast/CastAvatar';
import { castExpressionFor } from '../../../ui/characters/cast/castExpressionFor';
import { motionMsFor } from '../../../ui/feedback/lessonFeedback';
import { useCardEnter } from '../../../ui/motion';
import { semanticColors } from '../../../ui/semantic-colors';
import { radius, space, typography } from '../../../ui/styles';
import { galaxyColors } from '../../../ui/theme';

type AnswerFeedbackCardProps = {
    correct: boolean;
    /** O retorno autoral do item, que vem de `feedbackFor`. */
    message: string;
    /** Só na múltipla escolha: o que o aluno marcou e o gabarito, este só no erro. */
    chosenLabel?: string;
    correctLabel?: string;
    onLayout?: (event: LayoutChangeEvent) => void;
    /** `ENABLE_RICH_FEEDBACK`: elenco da F7, retrato médio, entrada de 150 ms e incentivo. */
    rich?: boolean;
    /** O acerto fecha um marco (sequência): o Pixel comemora. Só com `rich`. */
    celebrate?: boolean;
    /** Reforço curto do marco (`encouragementFor`). Só com `rich`. */
    encouragement?: string;
};

function pixelLabel(correct: boolean, celebrate: boolean, rich: boolean): string {
    // O Pixel preocupado é desenhado pensando: o rótulo diz o que se vê, e acolhe.
    if (!correct) return 'Pixel pensando com você';
    return !rich || celebrate ? 'Pixel comemorando o acerto' : 'Pixel feliz com o acerto';
}

/**
 * Retorno da resposta. O resultado é dito três vezes, por canais diferentes:
 * o título em texto, a expressão do Pixel e o tom da borda. Tirando a cor e o
 * movimento, o título e o texto continuam dizendo tudo.
 */
export function AnswerFeedbackCard({ correct, message, chosenLabel, correctLabel, onLayout, rich = false, celebrate = false, encouragement }: AnswerFeedbackCardProps) {
    const { animateIn, animatedStyle } = useCardEnter(rich ? motionMsFor('correct') : undefined);
    useEffect(() => { animateIn(); }, [animateIn]);

    return (
        <Animated.View testID="lesson-item-feedback" onLayout={onLayout}
            style={[styles.card, correct ? styles.cardCorrect : styles.cardIncorrect, animatedStyle]}>
            <View style={styles.header}>
                <CastAvatar speaker="pixel" size={rich ? 'md' : 'sm'}
                    expression={rich ? castExpressionFor({ kind: 'retorno', correct, celebrate }) : correct ? 'feliz' : 'pensando'}
                    accessibilityLabel={pixelLabel(correct, celebrate, rich)} />
                <Text style={[styles.title, correct ? styles.titleCorrect : styles.titleIncorrect]} accessibilityRole="header">
                    {correct ? 'Resposta correta' : 'Vamos reforçar'}
                </Text>
            </View>
            {chosenLabel !== undefined ? <Text style={styles.text}>{`Sua resposta: ${chosenLabel}`}</Text> : null}
            {!correct && correctLabel !== undefined ? <Text style={styles.text}>{`Resposta certa: ${correctLabel}`}</Text> : null}
            <Text style={styles.text}>{message}</Text>
            {rich && encouragement ? <Text style={styles.encouragement}>{encouragement}</Text> : null}
        </Animated.View>
    );
}

const styles = StyleSheet.create({
    card: {
        gap: space.s2, padding: space.s3, borderRadius: radius.rMd, borderWidth: 1,
        backgroundColor: semanticColors.galaxy.surfaceElevated,
    },
    // O tom segue o cartão da revisão G4: borda e título dizem o resultado, e o
    // texto continua em `textPrimary` para manter o contraste do corpo.
    cardCorrect: { borderColor: semanticColors.galaxy.statusSuccess },
    cardIncorrect: { borderColor: semanticColors.galaxy.statusError },
    header: { flexDirection: 'row', alignItems: 'center', gap: space.s2 },
    title: { ...typography.h3, flex: 1, color: galaxyColors.textPrimary },
    titleCorrect: { color: semanticColors.galaxy.statusSuccess },
    titleIncorrect: { color: semanticColors.galaxy.statusError },
    text: { ...typography.bodyRegular, color: galaxyColors.textPrimary },
    // Ouro é evidência de avanço (seção 10); o texto diz o marco sem depender da cor.
    encouragement: { ...typography.bodyStrong, color: semanticColors.galaxy.reward },
});
