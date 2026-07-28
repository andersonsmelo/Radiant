import React, { useEffect } from 'react';
import { StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';

import { duration } from '../../ui/motion';
import { useReducedMotionPreference } from '../../ui/accessibility/useReducedMotionPreference';
import { galaxyColors } from '../../ui/theme';
import { semanticColors } from '../../ui/semantic-colors';

interface AnimatedProgressBarProps {
  /** Progresso de 0 a 1. Valores fora da faixa são fixados nas bordas. */
  ratio: number;
  height?: number;
  /** Cores do gradiente de preenchimento, do início ao fim. */
  colors?: readonly [string, string];
  trackColor?: string;
  style?: StyleProp<ViewStyle>;
  accessibilityLabel?: string;
}

/**
 * Barra de progresso que anima até o valor.
 *
 * As barras do app escreviam a largura direto em porcentagem, então cada
 * avanço aparecia como um salto: o progresso acontecia sem que o usuário
 * visse acontecer. Aqui a largura é interpolada na UI thread.
 *
 * Mora em `components/` de propósito: a regra R4 do QA visual proíbe telas de
 * importar Reanimated direto justamente para que animação reutilizável viva
 * num componente compartilhado.
 */
export function AnimatedProgressBar({
  ratio,
  height = 8,
  colors = [galaxyColors.ctaGradientEnd, semanticColors.galaxy.statusInformation],
  trackColor = galaxyColors.spine,
  style,
  accessibilityLabel,
}: AnimatedProgressBarProps) {
  const clamped = Math.min(1, Math.max(0, ratio));
  const reducedMotion = useReducedMotionPreference();
  const fill = useSharedValue(reducedMotion ? clamped : 0);

  useEffect(() => {
    if (reducedMotion) {
      fill.value = clamped;
      return;
    }

    fill.value = withTiming(clamped, {
      duration: duration.ui,
      easing: Easing.out(Easing.cubic),
    });
  }, [clamped, reducedMotion]);

  const animatedStyle = useAnimatedStyle(() => ({
    width: `${fill.value * 100}%`,
  }));

  return (
    <View
      style={[styles.track, { height, borderRadius: height / 2, backgroundColor: trackColor }, style]}
      accessibilityRole="progressbar"
      accessibilityLabel={accessibilityLabel}
      accessibilityValue={{ min: 0, max: 100, now: Math.round(clamped * 100) }}
    >
      <Animated.View style={[styles.fill, animatedStyle]}>
        <LinearGradient
          colors={colors}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={StyleSheet.absoluteFill}
        />
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  track: {
    overflow: 'hidden',
    width: '100%',
  },
  fill: {
    height: '100%',
  },
});
