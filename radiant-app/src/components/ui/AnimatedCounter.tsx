import React from 'react';
import { StyleSheet, TextInput, type TextStyle, type StyleProp } from 'react-native';
import Animated, {
  useAnimatedProps,
  useSharedValue,
  withTiming,
  Easing,
} from 'react-native-reanimated';

import { duration } from '../../ui/motion';
import { useReducedMotionPreference } from '../../ui/accessibility/useReducedMotionPreference';

const AnimatedTextInput = Animated.createAnimatedComponent(TextInput);

interface AnimatedCounterProps {
  /** Valor final. A contagem sempre parte de zero. */
  value: number;
  prefix?: string;
  suffix?: string;
  style?: StyleProp<TextStyle>;
  durationMs?: number;
  /** Lido pelo leitor de tela no lugar do número em movimento. */
  accessibilityLabel?: string;
}

/**
 * Contador que sobe até o valor.
 *
 * Roda na UI thread: o texto é escrito via `animatedProps` de um TextInput
 * editável=false, o único caminho no React Native para atualizar texto sem
 * passar por um re-render de React a cada quadro. A alternativa que existia no
 * app — `setInterval` de 18ms chamando `setState` — engasga junto com qualquer
 * outro trabalho na JS thread, exatamente durante a celebração.
 *
 * Com reduced motion o número aparece direto no valor final.
 */
export function AnimatedCounter({
  value,
  prefix = '',
  suffix = '',
  style,
  durationMs = duration.celebrate,
  accessibilityLabel,
}: AnimatedCounterProps) {
  const reducedMotion = useReducedMotionPreference();
  const progress = useSharedValue(reducedMotion ? value : 0);

  React.useEffect(() => {
    if (reducedMotion) {
      progress.value = value;
      return;
    }

    progress.value = 0;
    progress.value = withTiming(value, {
      duration: durationMs,
      easing: Easing.out(Easing.cubic),
    });
  }, [value, reducedMotion, durationMs]);

  const animatedProps = useAnimatedProps(() => ({
    text: `${prefix}${Math.round(progress.value)}${suffix}`,
    defaultValue: `${prefix}${Math.round(progress.value)}${suffix}`,
  }));

  return (
    <AnimatedTextInput
      editable={false}
      // O leitor de tela anuncia o valor final, não o número em movimento.
      accessible
      accessibilityLabel={accessibilityLabel ?? `${prefix}${value}${suffix}`}
      underlineColorAndroid="transparent"
      style={[styles.base, style]}
      animatedProps={animatedProps as never}
      value={`${prefix}${value}${suffix}`}
    />
  );
}

const styles = StyleSheet.create({
  base: {
    padding: 0,
    margin: 0,
  },
});
