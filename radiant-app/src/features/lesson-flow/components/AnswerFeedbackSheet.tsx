import React, { useContext, useEffect, useRef } from 'react';
import { AccessibilityInfo, Animated, ScrollView, StyleSheet, Text, View, findNodeHandle, useWindowDimensions } from 'react-native';
import { SafeAreaInsetsContext } from 'react-native-safe-area-context';
import { AppButton } from '../../../components/ui/AppButton';
import { CastAvatar } from '../../../ui/characters/cast/CastAvatar';
import { castExpressionFor } from '../../../ui/characters/cast/castExpressionFor';
import { motionMsFor } from '../../../ui/feedback/lessonFeedback';
import { useCardEnter } from '../../../ui/motion';
import { semanticColors } from '../../../ui/semantic-colors';
import { space, typography } from '../../../ui/styles';
import { feedbackColors, galaxyColors } from '../../../ui/theme';
import { HeartLossNotice } from '../../hearts/components/HeartLossNotice';

type AnswerFeedbackSheetProps = {
    correct: boolean;
    /** O retorno autoral do item, que vem de `feedbackFor`. */
    message: string;
    /** A resposta certa em texto, mostrada só no erro. */
    correctLabel?: string;
    /** A confirmação gastou uma vida: "Menos 1 vida" vai na linha do título. */
    heartLost?: boolean;
    /** Vidas depois da perda, para o leitor de tela ouvir quantas restam. */
    heartsLeft?: { current: number; max: number };
    actionLabel: string;
    onAction: () => void;
    /** `ENABLE_RICH_FEEDBACK`: elenco da F7, retrato médio, entrada de 150 ms e incentivo. */
    rich?: boolean;
    /** O acerto fecha um marco (sequência): o Pixel comemora. Só com `rich`. */
    celebrate?: boolean;
    /** Reforço curto do marco (`encouragementFor`). Só com `rich`. */
    encouragement?: string;
    /** A tela usa a altura medida como folga no fim da rolagem. */
    onHeightChange?: (height: number) => void;
};

/** Teto da folha: dois terços da janela. Acima disso a explicação rola por dentro e o botão fica fixo. */
export function feedbackSheetMaxHeight(windowHeight: number): number {
    return Math.floor((windowHeight * 2) / 3);
}

/**
 * Para onde rolar para que a alternativa escolhida (de `top` a `bottom`, nas
 * coordenadas do conteúdo) fique entre o topo da rolagem e a folha. `null`
 * quando já está; senão, o mínimo, e o começo dela quando não cabe inteira.
 */
export function revealOffset({ top, bottom, scrollY, viewportHeight, sheetHeight, margin }: {
    top: number; bottom: number; scrollY: number; viewportHeight: number; sheetHeight: number; margin: number;
}): number | null {
    const visible = viewportHeight - sheetHeight;
    if (top - margin >= scrollY && bottom + margin <= scrollY + visible) return null;
    const toTop = top - margin;
    const target = bottom + margin > scrollY + visible ? Math.min(bottom + margin - visible, toTop) : toTop;
    return Math.max(0, target);
}

function pixelLabel(correct: boolean, celebrate: boolean, rich: boolean): string {
    // O Pixel preocupado é desenhado pensando: o rótulo diz o que se vê, e acolhe.
    if (!correct) return 'Pixel pensando com você';
    return !rich || celebrate ? 'Pixel comemorando o acerto' : 'Pixel feliz com o acerto';
}

/**
 * Folha de retorno fixa no rodapé da aula (spec 2026-11-16, 7.1). O resultado é
 * dito por três canais: o título em texto, a expressão do Pixel e a superfície
 * de acerto ou de erro. O botão de seguir mora aqui, fora da área que rola.
 */
export function AnswerFeedbackSheet({
    correct, message, correctLabel, heartLost = false, heartsLeft, actionLabel, onAction,
    rich = false, celebrate = false, encouragement, onHeightChange,
}: AnswerFeedbackSheetProps) {
    const { height } = useWindowDimensions();
    // A tela não aplica a borda de baixo da área segura: a cor da folha desce até
    // a borda, e o inset vira padding interno. Sem provider (testes), é 0.
    const bottomInset = useContext(SafeAreaInsetsContext)?.bottom ?? 0;
    // Entra sempre pelo gancho da base: 220 ms sem a chave, 150 ms com ela (ADR do
    // retorno rico); sob "reduzir movimento", o gancho a põe no lugar.
    const { animateIn, animatedStyle } = useCardEnter(rich ? motionMsFor('correct') : undefined);
    useEffect(() => { animateIn(); }, [animateIn]);
    const title = useRef<Text>(null);
    const focused = useRef(false);
    const tone = correct ? feedbackColors.success : feedbackColors.error;

    return (
        <Animated.View testID="lesson-item-feedback"
            onLayout={event => onHeightChange?.(event.nativeEvent.layout.height)}
            style={[styles.sheet, { backgroundColor: tone.surface, borderTopColor: tone.lip, maxHeight: feedbackSheetMaxHeight(height),
                paddingBottom: space.s3 + bottomInset },
                animatedStyle]}>
            <ScrollView testID="lesson-item-feedback-body" style={styles.body} contentContainerStyle={styles.bodyContent}
                bounces={false} showsVerticalScrollIndicator={false}>
                <View style={styles.header}>
                    <CastAvatar speaker="pixel" size={rich ? 'md' : 'sm'}
                        expression={rich ? castExpressionFor({ kind: 'retorno', correct, celebrate }) : correct ? 'feliz' : 'pensando'}
                        accessibilityLabel={pixelLabel(correct, celebrate, rich)} />
                    <Text ref={title} style={[styles.title, { color: correct ? semanticColors.galaxy.statusSuccess : semanticColors.galaxy.statusError }]}
                        accessibilityRole="header" onLayout={() => {
                            if (focused.current) return;
                            focused.current = true;
                            const target = findNodeHandle(title.current);
                            if (target != null) AccessibilityInfo.setAccessibilityFocus(target);
                        }}>
                        {correct ? 'Resposta correta' : 'Vamos reforçar'}
                    </Text>
                    {heartLost ? (
                        // Um nó só para o leitor de tela: o aviso visível diz "Menos 1 vida", e o rótulo diz quantas restam.
                        <View testID="lesson-feedback-heart-loss-group" accessible accessibilityRole="text"
                            accessibilityLabel={`Você perdeu uma vida.${heartsLeft ? ` Restam ${heartsLeft.current} de ${heartsLeft.max}.` : ''}`}>
                            <HeartLossNotice testID="lesson-feedback-heart-loss" />
                        </View>
                    ) : null}
                </View>
                {!correct && correctLabel !== undefined ? <Text style={styles.text}>{`Resposta certa: ${correctLabel}`}</Text> : null}
                <Text style={styles.text}>{message}</Text>
                {rich && encouragement ? <Text style={styles.encouragement}>{encouragement}</Text> : null}
            </ScrollView>
            <AppButton variant={correct ? 'success' : 'error'} onPress={onAction}>{actionLabel}</AppButton>
        </Animated.View>
    );
}

const styles = StyleSheet.create({
    // Presa ao rodapé da página, por cima do fim da rolagem, que ganha a altura dela como folga.
    sheet: {
        position: 'absolute', left: 0, right: 0, bottom: 0,
        gap: space.s3, paddingHorizontal: space.s3, paddingTop: space.s3, paddingBottom: space.s3,
        borderTopWidth: 2,
    },
    // Encolhe dentro do teto da folha; o botão abaixo nunca sai da janela.
    body: { flexGrow: 0, flexShrink: 1 },
    bodyContent: { gap: space.s2 },
    // Com texto ampliado, a linha quebra e "Menos 1 vida" desce em vez de comprimir o título.
    header: { flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', gap: space.s2 },
    title: { ...typography.h3, flexShrink: 1 },
    text: { ...typography.bodyRegular, color: galaxyColors.textPrimary },
    // Ouro é evidência de avanço (seção 10); o texto diz o marco sem depender da cor.
    encouragement: { ...typography.bodyStrong, color: semanticColors.galaxy.reward },
});
