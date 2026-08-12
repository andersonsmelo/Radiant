// src/ui/motion.ts
/**
 * Radiant Motion Referential Layer
 * Aligned with RADIANT_UI_KIT.md motion tokens
 */

import { useCallback, useEffect, useRef } from 'react';
import { Animated, Easing } from 'react-native';
import {
    default as Reanimated,
    Easing as ReanimatedEasing,
    interpolateColor,
    useAnimatedProps,
    useAnimatedStyle,
    useSharedValue,
    withDelay,
    withRepeat,
    withSequence,
    withTiming,
} from 'react-native-reanimated';
import { G, Path } from 'react-native-svg';
import { useReducedMotionPreference } from './accessibility/useReducedMotionPreference';

// ============================================================================
// DURATION TOKENS (milliseconds)
// ============================================================================
export const duration = {
    micro: 180,     // 150-200ms: micro-interactions
    ui: 220,        // 200-250ms: standard UI transitions
    celebrate: 600, // 450-650ms: success, rewards
};

// ============================================================================
// EASING FUNCTIONS
// ============================================================================
export const easing = {
    out: Easing.bezier(0.22, 1, 0.36, 1),
    spring: Easing.bezier(0.34, 1.56, 0.64, 1),
    inOut: Easing.bezier(0.4, 0, 0.2, 1),
};

export const motionPreset = {
    journeyEnter: {
        translateY: 10,
        duration: duration.ui,
    },
    lessonStepEnter: {
        translateY: 12,
        duration: duration.ui,
    },
    celebration: {
        scaleFrom: 0.96,
        duration: duration.celebrate,
    },
} as const;

export function resolveMotionValue<T>(animatedValue: T, reducedMotionValue: T, reducedMotionEnabled: boolean): T {
    return reducedMotionEnabled ? reducedMotionValue : animatedValue;
}

// ============================================================================
// ANIMATION HELPERS
// ============================================================================

/**
 * Fade in with upward slide
 * Initial: opacity=0, translateY=8
 * Final: opacity=1, translateY=0
 */
export function useFadeInUp(customDuration?: number) {
    const opacity = useRef(new Animated.Value(0)).current;
    const translateY = useRef(new Animated.Value(8)).current;
    const reducedMotionEnabled = useReducedMotionPreference();

    const animateIn = useCallback(() => {
        if (reducedMotionEnabled) {
            opacity.setValue(1);
            translateY.setValue(0);
            return;
        }

        Animated.parallel([
            Animated.timing(opacity, {
                toValue: 1,
                duration: customDuration ?? duration.ui,
                easing: easing.out,
                useNativeDriver: true,
            }),
            Animated.timing(translateY, {
                toValue: 0,
                duration: customDuration ?? duration.ui,
                easing: easing.out,
                useNativeDriver: true,
            }),
        ]).start();
    }, [customDuration, opacity, reducedMotionEnabled, translateY]);

    const style = {
        opacity,
        transform: [{ translateY }],
    };

    return { opacity, translateY, style, animateIn };
}

/**
 * Scale pop animation
 * Initial: scale=0.98
 * Final: scale=1
 */
export function useScalePop(customDuration?: number) {
    const scale = useRef(new Animated.Value(0.98)).current;
    const reducedMotionEnabled = useReducedMotionPreference();

    const animateIn = useCallback(() => {
        if (reducedMotionEnabled) {
            scale.setValue(1);
            return;
        }

        Animated.timing(scale, {
            toValue: 1,
            duration: customDuration ?? duration.micro,
            easing: easing.out,
            useNativeDriver: true,
        }).start();
    }, [customDuration, reducedMotionEnabled, scale]);

    const style = {
        transform: [{ scale }],
    };

    return { scale, style, animateIn };
}

/**
 * Shake error animation
 * Sequence: 0 -> -6 -> 6 -> -4 -> 4 -> 0
 * Subtle horizontal shake for error feedback
 */
export function useShakeError() {
    const translateX = useRef(new Animated.Value(0)).current;
    const reducedMotionEnabled = useReducedMotionPreference();

    const animateIn = useCallback(() => {
        if (reducedMotionEnabled) {
            translateX.setValue(0);
            return;
        }

        const shakeDuration = duration.micro * 2;
        const step = shakeDuration / 6;

        Animated.sequence([
            Animated.timing(translateX, {
                toValue: -6,
                duration: step,
                easing: easing.inOut,
                useNativeDriver: true,
            }),
            Animated.timing(translateX, {
                toValue: 6,
                duration: step,
                easing: easing.inOut,
                useNativeDriver: true,
            }),
            Animated.timing(translateX, {
                toValue: -4,
                duration: step,
                easing: easing.inOut,
                useNativeDriver: true,
            }),
            Animated.timing(translateX, {
                toValue: 4,
                duration: step,
                easing: easing.inOut,
                useNativeDriver: true,
            }),
            Animated.timing(translateX, {
                toValue: 0,
                duration: step * 2,
                easing: easing.out,
                useNativeDriver: true,
            }),
        ]).start();
    }, [reducedMotionEnabled, translateX]);

    const style = {
        transform: [{ translateX }],
    };

    return { translateX, style, animateIn };
}

/**
 * Press scale interaction
 * Press In: scale -> 0.98
 * Press Out: scale -> 1.0
 */
export function usePressScale(customDuration?: number) {
    const scale = useRef(new Animated.Value(1)).current;
    const reducedMotionEnabled = useReducedMotionPreference();

    const onPressIn = useCallback(() => {
        if (reducedMotionEnabled) {
            return;
        }

        Animated.timing(scale, {
            toValue: 0.98,
            duration: customDuration ?? duration.micro,
            easing: easing.out,
            useNativeDriver: true,
        }).start();
    }, [customDuration, reducedMotionEnabled, scale]);

    const onPressOut = useCallback(() => {
        if (reducedMotionEnabled) {
            scale.setValue(1);
            return;
        }

        Animated.timing(scale, {
            toValue: 1,
            duration: customDuration ?? duration.micro,
            easing: easing.out,
            useNativeDriver: true,
        }).start();
    }, [customDuration, reducedMotionEnabled, scale]);

    const reset = useCallback(() => {
        scale.setValue(1);
    }, [scale]);

    const animatedStyle = {
        transform: [{ scale }],
    };

    return { scale, animatedStyle, onPressIn, onPressOut, reset };
}

/**
 * Card entry animation (Subtle Fade In Up)
 * Initial: opacity=0, translateY=6
 * Final: opacity=1, translateY=0
 */
export function useCardEnter(customDuration?: number) {
    const opacity = useRef(new Animated.Value(0)).current;
    const translateY = useRef(new Animated.Value(6)).current;
    const reducedMotionEnabled = useReducedMotionPreference();

    const reset = useCallback(() => {
        opacity.setValue(0);
        translateY.setValue(6);
    }, [opacity, translateY]);

    const animateIn = useCallback(() => {
        if (reducedMotionEnabled) {
            opacity.setValue(1);
            translateY.setValue(0);
            return;
        }

        Animated.parallel([
            Animated.timing(opacity, {
                toValue: 1,
                duration: customDuration ?? duration.ui,
                easing: easing.out,
                useNativeDriver: true,
            }),
            Animated.timing(translateY, {
                toValue: 0,
                duration: customDuration ?? duration.ui,
                easing: easing.out,
                useNativeDriver: true,
            }),
        ]).start();
    }, [customDuration, opacity, reducedMotionEnabled, translateY]);

    const animatedStyle = {
        opacity,
        transform: [{ translateY }],
    };

    return { opacity, translateY, animatedStyle, animateIn, reset };
}

/**
 * Pulso de perda — o único movimento punitivo do vocabulário.
 *
 * Incha e recolhe: `1 → 1.35 → 1`. Serve ao momento em que algo é **tirado** da
 * pessoa (hoje, uma vida no quiz), que até aqui acontecia sem sinal visual
 * nenhum — o contador simplesmente trocava.
 *
 * Por que não reusar os existentes: `useScalePop` entra de 0.98 para 1 e é
 * chegada, não perda; `useShakeError` é o vocabulário de *erro*, e errar não é
 * a mesma coisa que perder — no modo revisão erra-se sem custo. Um movimento
 * próprio é o que separa os dois eventos.
 *
 * A escala passa de 1 de propósito: encolher leria como "sumindo", e o coração
 * não some, ele esvazia. Duração `micro` na ida e `ui` na volta — a ida chama
 * atenção, a volta devolve a tela; a HIG pede movimento breve em interações que
 * se repetem, e esta se repete várias vezes por sessão.
 */
export function useLossPulse() {
    const scale = useRef(new Animated.Value(1)).current;
    const reducedMotionEnabled = useReducedMotionPreference();

    const animateIn = useCallback(() => {
        if (reducedMotionEnabled) {
            scale.setValue(1);
            return;
        }

        scale.setValue(1);
        Animated.sequence([
            Animated.timing(scale, {
                toValue: 1.35,
                duration: duration.micro,
                easing: easing.out,
                useNativeDriver: true,
            }),
            Animated.timing(scale, {
                toValue: 1,
                duration: duration.ui,
                easing: easing.out,
                useNativeDriver: true,
            }),
        ]).start();
    }, [reducedMotionEnabled, scale]);

    const animatedStyle = {
        transform: [{ scale }],
    };

    return { scale, animatedStyle, animateIn };
}

export const createFadeInUp = useFadeInUp;
export const createScalePop = useScalePop;
export const createShakeError = useShakeError;
export const createPressScale = usePressScale;
export const createCardEnter = useCardEnter;
export const createLossPulse = useLossPulse;
export const MotionView = Reanimated.View;
export const MotionSvgGroup = Reanimated.createAnimatedComponent(G);
export const MotionSvgPath = Reanimated.createAnimatedComponent(Path);

// ============================================================================
// REANIMATED HELPERS — mounted, lightweight status glyphs
// ============================================================================

/**
 * Celebra uma alteração positiva pontual sem transformar um estado estático em
 * uma animação contínua. Usado pelo XP do HUD quando o valor aumenta.
 */
export function useEventCelebrationScale(value: number) {
    const reducedMotionEnabled = useReducedMotionPreference();
    const scale = useSharedValue(1);
    const rayOpacity = useSharedValue(0);
    const rayScale = useSharedValue(0.4);
    const previous = useRef(value);

    useEffect(() => {
        const increased = value > previous.current;
        previous.current = value;

        if (!increased || reducedMotionEnabled) {
            scale.value = 1;
            rayOpacity.value = 0;
            rayScale.value = reducedMotionEnabled ? 1 : 0.4;
            return;
        }

        const dormantMs = duration.celebrate * 0.55;
        const rayRiseMs = duration.celebrate * 0.15;
        const rayFadeMs = duration.celebrate * 0.3;
        const burstRiseMs = duration.celebrate * 0.07;
        const burstSettleMs = duration.celebrate * 0.38;

        scale.value = withDelay(dormantMs, withSequence(
            withTiming(1.35, {
                duration: burstRiseMs,
                easing: ReanimatedEasing.bezier(0.34, 1.56, 0.64, 1),
            }),
            withTiming(1, {
                duration: burstSettleMs,
                easing: ReanimatedEasing.bezier(0.22, 1, 0.36, 1),
            }),
        ));
        rayOpacity.value = withDelay(dormantMs, withSequence(
            withTiming(0.9, {
                duration: rayRiseMs,
                easing: ReanimatedEasing.bezier(0.22, 1, 0.36, 1),
            }),
            withTiming(0, {
                duration: rayFadeMs,
                easing: ReanimatedEasing.bezier(0.22, 1, 0.36, 1),
            }),
        ));
        rayScale.value = withDelay(dormantMs, withSequence(
            withTiming(1, {
                duration: rayRiseMs,
                easing: ReanimatedEasing.bezier(0.22, 1, 0.36, 1),
            }),
            withTiming(1.5, {
                duration: rayFadeMs,
                easing: ReanimatedEasing.bezier(0.22, 1, 0.36, 1),
            }),
        ));
    }, [rayOpacity, rayScale, reducedMotionEnabled, scale, value]);

    const animatedProps = useAnimatedProps(() => ({
        scale: scale.value,
        originX: 26,
        originY: 26,
    }));
    const rayAnimatedProps = useAnimatedProps(() => ({
        opacity: rayOpacity.value,
        scale: rayScale.value,
        originX: 26,
        originY: 26,
    }));

    return { animatedProps, rayAnimatedProps };
}

/**
 * Encena a perda dentro do próprio SVG: impacto, rachadura seca e drenagem.
 * O estado final sempre é o `filled` recebido; movimento reduzido salta direto
 * para ele, sem deixar a rachadura visível.
 */
export function useHeartLossAnimation(filled: boolean, losing: boolean) {
    const reducedMotionEnabled = useReducedMotionPreference();
    const scale = useSharedValue(1);
    const drain = useSharedValue(filled ? 0 : 1);
    const crackOpacity = useSharedValue(0);

    useEffect(() => {
        scale.value = 1;
        crackOpacity.value = 0;

        if (reducedMotionEnabled || !losing || filled) {
            drain.value = filled ? 0 : 1;
            return;
        }

        const impactDelayMs = duration.ui * 0.4;
        const impactRiseMs = duration.ui * 0.08;
        const impactDropMs = duration.ui * 0.12;
        const impactSettleMs = duration.ui * 0.4;
        const crackDelayMs = duration.ui * 0.6;
        const drainDelayMs = duration.ui * 0.52;
        const drainMs = duration.ui * 0.18;

        drain.value = 0;
        scale.value = withDelay(impactDelayMs, withSequence(
            withTiming(1.18, {
                duration: impactRiseMs,
                easing: ReanimatedEasing.bezier(0.22, 1, 0.36, 1),
            }),
            withTiming(0.9, {
                duration: impactDropMs,
                easing: ReanimatedEasing.bezier(0.22, 1, 0.36, 1),
            }),
            withTiming(1, {
                duration: impactSettleMs,
                easing: ReanimatedEasing.bezier(0.22, 1, 0.36, 1),
            }),
        ));
        crackOpacity.value = withDelay(
            crackDelayMs,
            withTiming(1, { duration: 0 }),
        );
        drain.value = withDelay(
            drainDelayMs,
            withTiming(1, {
                duration: drainMs,
                easing: ReanimatedEasing.bezier(0.22, 1, 0.36, 1),
            }),
        );
    }, [crackOpacity, drain, filled, losing, reducedMotionEnabled, scale]);

    const groupAnimatedProps = useAnimatedProps(() => ({
        scale: scale.value,
        originX: 26,
        originY: 28.6,
    }));
    const fillAnimatedProps = useAnimatedProps(() => ({
        fill: interpolateColor(
            drain.value,
            [0, 1],
            ['#FF3B30', 'rgba(255, 255, 255, 0.20)'],
        ),
    }));
    const crackAnimatedProps = useAnimatedProps(() => ({ opacity: crackOpacity.value }));

    return { groupAnimatedProps, fillAnimatedProps, crackAnimatedProps };
}

/**
 * Mantém um indicador de estado vivo com uma respiração discreta. Sob reduced
 * motion devolve imediatamente a escala estática e legível.
 */
export function useBreathingScale() {
    const reducedMotionEnabled = useReducedMotionPreference();
    const scale = useSharedValue(1);

    useEffect(() => {
        if (reducedMotionEnabled) {
            scale.value = 1;
            return;
        }

        scale.value = withRepeat(
            withSequence(
                withTiming(1.08, {
                    duration: 800,
                    easing: ReanimatedEasing.inOut(ReanimatedEasing.ease),
                }),
                withTiming(1, {
                    duration: 800,
                    easing: ReanimatedEasing.inOut(ReanimatedEasing.ease),
                }),
            ),
            -1,
            false,
        );
    }, [reducedMotionEnabled, scale]);

    const animatedStyle = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));

    return { animatedStyle };
}
