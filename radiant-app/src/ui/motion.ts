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
    cancelAnimation,
    interpolateColor,
    useAnimatedProps,
    useAnimatedStyle,
    useDerivedValue,
    useSharedValue,
    withDelay,
    withRepeat,
    withSequence,
    withTiming,
    type DerivedValue,
} from 'react-native-reanimated';
import { G, Path } from 'react-native-svg';
import { useReducedMotionPreference, useReducedMotionPreferenceState } from './accessibility/useReducedMotionPreference';
import { useScreenFocused } from './useScreenFocused';
import { galaxyColors, hudIconTones } from './theme';

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
 *
 * A entrada só começa quando a preferência de movimento é conhecida (FILA 64).
 * Antes disso, `animateIn` apenas anota o pedido, e o hook o cumpre quando a
 * resposta chega. Medido no Android em 2026-10-19, com "Remover animações": a
 * versão anterior começava a animação nativa na primeira passada, a resposta
 * `true` a interrompia com `setValue(1)`, e o retorno nativo da animação
 * interrompida chegava depois, gravando opacidade 0 por cima. O cartão ficava
 * invisível. `reset` e `animateIn` não mudam de identidade quando a preferência
 * chega, para que o efeito de quem chama não rode de novo e interrompa a
 * entrada em curso.
 */
export function useCardEnter(customDuration?: number) {
    const opacity = useRef(new Animated.Value(0)).current;
    const translateY = useRef(new Animated.Value(6)).current;
    const preference = useReducedMotionPreferenceState();
    const preferenceRef = useRef(preference);
    const pendingEnter = useRef(false);

    const enter = useCallback((reducedMotionEnabled: boolean) => {
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
    }, [customDuration, opacity, translateY]);

    // Declarado antes de qualquer efeito de quem chama, então roda primeiro na
    // mesma confirmação: o `animateIn` do chamador já lê a preferência nova.
    useEffect(() => {
        preferenceRef.current = preference;
        if (preference.resolved && pendingEnter.current) {
            pendingEnter.current = false;
            enter(preference.reducedMotionEnabled);
        }
    }, [enter, preference]);

    const reset = useCallback(() => {
        pendingEnter.current = false;
        opacity.setValue(0);
        translateY.setValue(6);
    }, [opacity, translateY]);

    const animateIn = useCallback(() => {
        const { reducedMotionEnabled, resolved } = preferenceRef.current;
        if (!resolved) {
            pendingEnter.current = true;
            return;
        }
        enter(reducedMotionEnabled);
    }, [enter]);

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

/**
 * Positional slide between two coordinates.
 *
 * Drives a single numeric value — an SVG or layout coordinate rather than a
 * transform — so it runs off the native driver on purpose. The caller keeps
 * ownership of when the slide restarts, because the trigger is usually a
 * change of scenario rather than a change of destination.
 *
 * Reduced motion is the caller's to pass: components that receive it as a
 * prop stay testable, and `settle` applies the final coordinate with no
 * animation at all.
 */
export function useSlideToPosition(startValue: number, customDuration?: number) {
    const position = useRef(new Animated.Value(startValue)).current;

    const settle = useCallback((toValue: number) => {
        position.setValue(toValue);
    }, [position]);

    const slideTo = useCallback((toValue: number, onFinished?: (finished: boolean) => void) => {
        position.setValue(startValue);
        const animation = Animated.timing(position, {
            toValue,
            duration: customDuration ?? duration.ui,
            easing: easing.out,
            useNativeDriver: false,
        });
        animation.start(({ finished }) => onFinished?.(finished));
        return () => animation.stop();
    }, [customDuration, position, startValue]);

    return { position, slideTo, settle };
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
            // Parte do vermelho do desenho de três tons, que some na perda: com
            // outro vermelho, o instante 0 dava um salto de cor e a borda
            // antialiased do desenho deixava uma franja do de baixo.
            [hudIconTones.heart.face, galaxyColors.heartEmpty],
        ),
    }));
    const crackAnimatedProps = useAnimatedProps(() => ({ opacity: crackOpacity.value }));

    return { groupAnimatedProps, fillAnimatedProps, crackAnimatedProps };
}

/**
 * Mantém um indicador de estado vivo com uma respiração discreta. Sob reduced
 * motion, ou com a tela fora de foco, devolve imediatamente a escala estática
 * e legível: o laço infinito numa tela escondida só gasta CPU (FILA, 33).
 */
export function useBreathingScale() {
    const reducedMotionEnabled = useReducedMotionPreference();
    const focused = useScreenFocused();
    const still = reducedMotionEnabled || !focused;
    const scale = useSharedValue(1);

    useEffect(() => {
        if (still) {
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
    }, [still, scale]);

    const animatedStyle = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));

    return { animatedStyle };
}

/** Um pulso do anel da próxima medalha, de ponta a ponta. */
export const MEDAL_PULSE_MS = 1600;
const MEDAL_PULSE_SCALE_TO = 1.18;
const MEDAL_PULSE_OPACITY_FROM = 0.5;

/**
 * O anel que pulsa em volta da medalha da próxima aula: sai do tamanho da face
 * (escala 1, opacidade 0,5) e cresce até 1,18 enquanto some, em 1,6 s, sem fim.
 *
 * Parado e invisível com "reduzir movimento", com `enabled` falso e com a tela
 * fora de foco: o laço infinito numa tela escondida só gasta CPU (FILA, 33).
 * O anel continua sendo decoração; quem diz "próximo passo" é o rótulo.
 */
export function useMedalPulse(enabled: boolean) {
    const reducedMotionEnabled = useReducedMotionPreference();
    const focused = useScreenFocused();
    const running = enabled && !reducedMotionEnabled && focused;
    const scale = useSharedValue(1);
    const opacity = useSharedValue(0);

    useEffect(() => {
        if (!running) {
            cancelAnimation(scale);
            cancelAnimation(opacity);
            scale.value = 1;
            opacity.value = 0;
            return undefined;
        }

        scale.value = 1;
        opacity.value = MEDAL_PULSE_OPACITY_FROM;
        scale.value = withRepeat(
            withTiming(MEDAL_PULSE_SCALE_TO, {
                duration: MEDAL_PULSE_MS,
                easing: ReanimatedEasing.out(ReanimatedEasing.quad),
            }),
            -1,
            false,
        );
        opacity.value = withRepeat(
            withTiming(0, {
                duration: MEDAL_PULSE_MS,
                easing: ReanimatedEasing.out(ReanimatedEasing.quad),
            }),
            -1,
            false,
        );
        return () => {
            cancelAnimation(scale);
            cancelAnimation(opacity);
        };
    }, [running, scale, opacity]);

    return useAnimatedStyle(() => ({
        opacity: opacity.value,
        transform: [{ scale: scale.value }],
    }));
}

/**
 * O quadro corrente de um Lottie em laço, para o `<Skottie frame>` do Skia.
 *
 * Um relógio anda de 0 a `totalFrames` em tempo linear (a curva de cada
 * movimento mora no próprio JSON), e o quadro é o relógio somado ao de pose,
 * módulo o total: o laço começa exatamente na imagem que estava parada, e o
 * fim de um ciclo encosta no começo do seguinte sem costura.
 *
 * Fica parado no quadro de pose quando `playing` é falso, quando a pessoa
 * pediu menos movimento e enquanto essa preferência ainda não respondeu (um
 * laço é agendamento; ver `useReducedMotionPreferenceState`). Fora de foco, o
 * laço pausa onde está e retoma dali ao voltar o foco: animação infinita numa
 * tela escondida só gasta CPU (FILA, 33).
 */
export function useLottieFrameLoop({
    totalFrames,
    fps,
    posterFrame,
    playing,
}: {
    /** Quadros do laço (`duration() * fps()` da animação). */
    totalFrames: number;
    fps: number;
    /** O quadro de pose, de onde o laço parte e onde fica parado. */
    posterFrame: number;
    /** O chamador quer o laço (estado desbloqueado). */
    playing: boolean;
}): DerivedValue<number> {
    const motion = useReducedMotionPreferenceState();
    const focused = useScreenFocused();
    const reduced = motion.reducedMotionEnabled || !motion.resolved;
    const valid = totalFrames > 0 && fps > 0;
    const still = !playing || reduced || !valid;
    const running = !still && focused;
    const clock = useSharedValue(0);

    useEffect(() => {
        if (still) {
            cancelAnimation(clock);
            clock.value = 0;
            return undefined;
        }
        if (!running) {
            cancelAnimation(clock);
            return undefined;
        }
        const cycleMs = (totalFrames / fps) * 1000;
        const from = clock.value % totalFrames;
        clock.value = from;
        clock.value = withSequence(
            withTiming(totalFrames, {
                duration: ((totalFrames - from) / totalFrames) * cycleMs,
                easing: ReanimatedEasing.linear,
            }),
            withRepeat(
                withSequence(
                    withTiming(0, { duration: 0 }),
                    withTiming(totalFrames, { duration: cycleMs, easing: ReanimatedEasing.linear }),
                ),
                -1,
                false,
            ),
        );
        return () => cancelAnimation(clock);
    }, [still, running, clock, fps, totalFrames]);

    return useDerivedValue(() => (valid ? (posterFrame + clock.value) % totalFrames : posterFrame));
}
