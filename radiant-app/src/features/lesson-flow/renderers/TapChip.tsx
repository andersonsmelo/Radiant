import React, { useEffect, type ReactNode } from 'react';
import { Animated, Pressable, StyleSheet, Text } from 'react-native';
import { galaxyColors } from '../../../ui/theme';
import { semanticColors } from '../../../ui/semantic-colors';
import { useCardEnter, usePressScale, useScalePop } from '../../../ui/motion';
import { radius, space, typography } from '../../../ui/styles';

/**
 * Durações das microinterações das famílias da 1.6, em milissegundos: pressionar
 * (80 a 120), confirmar (120 a 180) e entrada de etapa (160 a 240). Os hooks de
 * `ui/motion` já trocam o movimento por estado final quando o aluno pede menos
 * movimento (`useReducedMotionPreference`).
 */
export const F2_MOTION = { press: 100, confirm: 150, enter: 200 } as const;

export type TapChipVerdict = 'correct' | 'incorrect';

type TapChipProps = {
    label: string;
    accessibilityLabel: string;
    accessibilityHint?: string;
    onPress?: () => void;
    selected?: boolean;
    /** Depois de conferir: a marca vem em texto (✓ ou ✗), não só na cor. */
    verdict?: TapChipVerdict;
    disabled?: boolean;
    role?: 'button' | 'checkbox';
    testID?: string;
};

/** Botão de toque das famílias novas: alvo de 44 pt, ouro como evidência da escolha. */
export function TapChip({ label, accessibilityLabel, accessibilityHint, onPress, selected = false, verdict, disabled = false, role = 'button', testID }: TapChipProps) {
    const press = usePressScale(F2_MOTION.press);
    const pop = useScalePop(F2_MOTION.confirm);
    const { animateIn } = pop;
    useEffect(() => { if (verdict) animateIn(); }, [animateIn, verdict]);
    const mark = verdict === 'correct' ? '✓ ' : verdict === 'incorrect' ? '✗ ' : '';

    return (
        <Animated.View style={verdict ? pop.style : press.animatedStyle}>
            <Pressable
                testID={testID}
                onPress={disabled ? undefined : onPress}
                onPressIn={disabled ? undefined : press.onPressIn}
                onPressOut={press.onPressOut}
                disabled={disabled}
                accessibilityRole={role}
                accessibilityLabel={accessibilityLabel}
                accessibilityHint={accessibilityHint}
                accessibilityState={role === 'checkbox' ? { checked: selected, disabled } : { selected, disabled }}
                style={[styles.chip, selected && styles.selected,
                    verdict === 'correct' && styles.correct, verdict === 'incorrect' && styles.incorrect]}
            >
                <Text style={styles.label}>{mark}{label}</Text>
            </Pressable>
        </Animated.View>
    );
}

/** Entrada da etapa (ou de uma afirmação nova) com o mesmo vocabulário do resto da aula. */
export function EnterView({ children }: { children: ReactNode }) {
    const { animatedStyle, animateIn } = useCardEnter(F2_MOTION.enter);
    useEffect(() => { animateIn(); }, [animateIn]);
    return <Animated.View style={[styles.enter, animatedStyle]}>{children}</Animated.View>;
}

const galaxy = semanticColors.galaxy;

export const f2Styles = StyleSheet.create({
    activity: { gap: space.s3 },
    prompt: { ...typography.h3, color: galaxy.textPrimary },
    section: { ...typography.bodyStrong, color: galaxy.textPrimary },
    body: { ...typography.bodyRegular, color: galaxy.textPrimary },
    secondary: { ...typography.bodyRegular, color: galaxy.textSecondary },
    wrap: { flexDirection: 'row', flexWrap: 'wrap', gap: space.s2 },
    column: { gap: space.s2 },
    gold: { ...typography.bodyStrong, color: galaxy.reward },
});

const styles = StyleSheet.create({
    enter: { gap: space.s3 },
    chip: {
        minHeight: 44,
        minWidth: 44,
        paddingHorizontal: space.s3,
        paddingVertical: space.s2,
        borderRadius: radius.rMd,
        borderWidth: 1,
        borderColor: galaxy.border,
        backgroundColor: galaxyColors.surface,
        justifyContent: 'center',
    },
    selected: { borderColor: galaxy.reward, borderWidth: 2 },
    correct: { borderColor: galaxy.statusSuccess, borderWidth: 2 },
    incorrect: { borderColor: galaxy.statusError, borderWidth: 2 },
    label: { ...typography.bodyRegular, color: galaxy.textPrimary },
});
