// src/ui/motion.ts
/**
 * Radiant Motion Referential Layer
 * Aligned with RADIANT_UI_KIT.md motion tokens
 */

import { useCallback, useEffect, useRef, useState } from 'react';
import { AccessibilityInfo, Animated, Easing } from 'react-native';

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

function useReducedMotionPreference() {
    const [reducedMotionEnabled, setReducedMotionEnabled] = useState(false);

    useEffect(() => {
        let mounted = true;

        AccessibilityInfo.isReduceMotionEnabled()
            .then((enabled) => {
                if (mounted) {
                    setReducedMotionEnabled(enabled);
                }
            })
            .catch(() => {
                if (mounted) {
                    setReducedMotionEnabled(false);
                }
            });

        const subscription = AccessibilityInfo.addEventListener('reduceMotionChanged', setReducedMotionEnabled);

        return () => {
            mounted = false;
            subscription.remove();
        };
    }, []);

    return reducedMotionEnabled;
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

export const createFadeInUp = useFadeInUp;
export const createScalePop = useScalePop;
export const createShakeError = useShakeError;
export const createPressScale = usePressScale;
export const createCardEnter = useCardEnter;
