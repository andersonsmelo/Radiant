import React, { useEffect, type ReactNode } from 'react';
import { Animated, StyleSheet, Text, View } from 'react-native';
import { feedbackColors, galaxyColors, medalColors } from '../../../ui/theme';
import { semanticColors } from '../../../ui/semantic-colors';
import { MotionPressable, useCardEnter, usePressDescend, useScalePop } from '../../../ui/motion';
import { radius, space, typography } from '../../../ui/styles';
import { VerdictIcon } from '../../../ui/components/VerdictIcons';

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
    /** Depois de conferir: a marca é desenhada (`VerdictIcon`), não só a cor. */
    verdict?: TapChipVerdict;
    disabled?: boolean;
    role?: 'button' | 'checkbox';
    testID?: string;
};

// Mesmo relevo da `ChoiceOption`: lábio de 4 pt atrás, face que desce até 1 pt do fim dele.
const LIP = 4;
const PRESSED_OFFSET = LIP - 1;

/** Botão de toque das famílias novas: alvo de 44 pt, ouro como evidência da escolha. */
export function TapChip({ label, accessibilityLabel, accessibilityHint, onPress, selected = false, verdict, disabled = false, role = 'button', testID }: TapChipProps) {
    const pop = useScalePop(F2_MOTION.confirm);
    const descend = usePressDescend(PRESSED_OFFSET, disabled);
    const { animateIn } = pop;
    useEffect(() => { if (verdict) animateIn(); }, [animateIn, verdict]);
    const tone = verdict === 'correct'
        ? { face: feedbackColors.success.surface, border: galaxy.statusSuccess, lip: feedbackColors.success.lip, width: 2 }
        : verdict === 'incorrect'
        ? { face: feedbackColors.error.surface, border: galaxy.statusError, lip: feedbackColors.error.lip, width: 2 }
        : selected
        ? { face: galaxyColors.surface, border: galaxy.reward, lip: medalColors.unit.lip, width: 2 }
        : { face: galaxyColors.surface, border: galaxy.border, lip: galaxyColors.backgroundAlt, width: 1 };

    return (
        <Animated.View style={verdict ? pop.style : undefined}>
            <View style={styles.relief}>
                <View testID="tap-chip-lip" pointerEvents="none" style={[styles.lip, { backgroundColor: tone.lip }]} />
                <MotionPressable
                    testID={testID}
                    onPress={disabled ? undefined : onPress}
                    onPressIn={descend.onPressIn}
                    onPressOut={descend.onPressOut}
                    disabled={disabled}
                    accessibilityRole={role}
                    accessibilityLabel={accessibilityLabel}
                    accessibilityHint={accessibilityHint}
                    accessibilityState={role === 'checkbox' ? { checked: selected, disabled } : { selected, disabled }}
                    style={[styles.chip, { backgroundColor: tone.face, borderColor: tone.border, borderWidth: tone.width }, descend.style]}
                >
                    {verdict ? <VerdictIcon verdict={verdict} size={20} testID={`verdict-icon-${verdict}`} /> : null}
                    <Text style={styles.label}>{label}</Text>
                </MotionPressable>
            </View>
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
    relief: { paddingBottom: LIP },
    lip: { position: 'absolute', top: LIP, bottom: 0, left: 0, right: 0, borderRadius: radius.rMd },
    chip: {
        minHeight: 44,
        minWidth: 44,
        paddingHorizontal: space.s3,
        paddingVertical: space.s2,
        borderRadius: radius.rMd,
        flexDirection: 'row',
        alignItems: 'center',
        gap: space.s1,
    },
    label: { ...typography.bodyRegular, color: galaxy.textPrimary, flexShrink: 1 },
});
