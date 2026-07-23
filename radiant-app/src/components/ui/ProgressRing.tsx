import React, { useEffect } from 'react';
import { View } from 'react-native';
import Animated, {
  useSharedValue,
  withTiming,
  useAnimatedProps,
} from 'react-native-reanimated';
import Svg, { Circle } from 'react-native-svg';
import { semanticColors } from '../../ui/semantic-colors';
import { duration, easing } from '../../ui/motion';

const AnimatedCircle = Animated.createAnimatedComponent(Circle);
const light = semanticColors.light;

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
  /** @deprecated use children to overlay content */
  label?: string;
}

export function ProgressRing({
  size = 96,
  value = 0.6,
  total,
  stroke = 8,
  color = light.actionPrimary,
  trackColor = light.border,
  children,
  animate = true,
}: ProgressRingProps) {
  const normalized = total != null ? Math.min(1, Math.max(0, value / Math.max(1, total))) : value;
  const r = (size - stroke) / 2;
  const circumference = 2 * Math.PI * r;
  const progress = useSharedValue(animate ? 0 : normalized);

  useEffect(() => {
    progress.value = withTiming(normalized, {
      duration: duration.celebrate,
      easing: easing.spring,
    });
  }, [normalized]);

  const animatedProps = useAnimatedProps(() => ({
    strokeDashoffset: circumference * (1 - progress.value),
  }));

  return (
    <View style={{ width: size, height: size }}>
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
