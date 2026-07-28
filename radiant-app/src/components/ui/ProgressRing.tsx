import React, { useEffect } from 'react';
import { View } from 'react-native';
import Animated, {
  useSharedValue,
  withTiming,
  useAnimatedProps,
  Easing,
} from 'react-native-reanimated';
import Svg, { Circle } from 'react-native-svg';
import { semanticColors } from '../../ui/semantic-colors';
import { duration } from '../../ui/motion';
import { useReducedMotionPreference } from '../../ui/accessibility/useReducedMotionPreference';

const AnimatedCircle = Animated.createAnimatedComponent(Circle);
const galaxy = semanticColors.galaxy;

interface ProgressRingProps {
  size?: number;
  /** Normalized 0–1 progress, OR raw integer when `total` is also provided */
  value?: number;
  /** When provided, `value` is treated as a raw count and divided by `total` */
  total?: number;
  stroke?: number;
  color?: string;
  trackColor?: string;
  children?: React.ReactNode;
  animate?: boolean;
  /** Descreve o que o anel mede; sem isso o leitor de tela não anuncia nada. */
  accessibilityLabel?: string;
  /**
   * Nome do que o anel mede. Antes era declarado e descartado no
   * destructuring, então todo `label` passado sumia sem aviso — inclusive o do
   * hero. Agora alimenta o rótulo acessível quando `accessibilityLabel` não
   * vem. Para conteúdo visível no centro, use `children`.
   */
  label?: string;
}

export function ProgressRing({
  size = 96,
  value = 0.6,
  total,
  stroke = 8,
  color = galaxy.statusInformation,
  trackColor = galaxy.border,
  children,
  animate = true,
  accessibilityLabel,
  label,
}: ProgressRingProps) {
  const resolvedAccessibilityLabel = accessibilityLabel ?? label;
  const normalized = total != null ? Math.min(1, Math.max(0, value / Math.max(1, total))) : value;
  const r = (size - stroke) / 2;
  const circumference = 2 * Math.PI * r;
  const reducedMotion = useReducedMotionPreference();
  const shouldAnimate = animate && !reducedMotion;
  const progress = useSharedValue(shouldAnimate ? 0 : normalized);

  useEffect(() => {
    // Com reduced motion o anel salta direto para o valor final: o número
    // continua correto, só o preenchimento não é encenado.
    if (!shouldAnimate) {
      progress.value = normalized;
      return;
    }

    progress.value = withTiming(normalized, {
      duration: duration.celebrate,
      easing: Easing.bezier(0.34, 1.56, 0.64, 1),
    });
  }, [normalized, shouldAnimate]);

  const animatedProps = useAnimatedProps(() => ({
    strokeDashoffset: circumference * (1 - progress.value),
  }));

  return (
    <View
      style={{ width: size, height: size }}
      accessibilityRole="progressbar"
      accessibilityLabel={resolvedAccessibilityLabel}
      accessibilityValue={
        total != null
          ? { min: 0, max: total, now: value }
          : { min: 0, max: 100, now: Math.round(normalized * 100) }
      }
    >
      <Svg
        width={size}
        height={size}
        style={{ transform: [{ rotate: '-90deg' }] }}
      >
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          stroke={trackColor}
          strokeWidth={stroke}
          fill="none"
        />
        <AnimatedCircle
          cx={size / 2}
          cy={size / 2}
          r={r}
          stroke={color}
          strokeWidth={stroke}
          fill="none"
          strokeDasharray={circumference}
          animatedProps={animatedProps}
          strokeLinecap="round"
        />
      </Svg>
      {children != null && (
        <View
          style={{
            position: 'absolute',
            top: 0, left: 0, right: 0, bottom: 0,
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {children}
        </View>
      )}
    </View>
  );
}
