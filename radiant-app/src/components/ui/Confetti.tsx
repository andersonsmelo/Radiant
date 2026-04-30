import React, { useEffect, useMemo } from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import Animated, {
  useSharedValue,
  withTiming,
  withDelay,
  useAnimatedStyle,
  Easing,
} from 'react-native-reanimated';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');
const COLORS = ['#2155FF', '#3DCAE8', '#F5A623', '#1A9C71', '#FFFFFF', '#6FE0F2'];

interface PieceConfig {
  x: number;
  cx: number;
  rot: number;
  dur: number;
  delay: number;
  size: number;
  isCircle: boolean;
  color: string;
}

interface PieceProps extends PieceConfig {}

function ConfettiPiece({ x, cx, rot, dur, delay, size, isCircle, color }: PieceProps) {
  const translateY = useSharedValue(-20);
  const translateX = useSharedValue(0);
  const rotate = useSharedValue(0);
  const opacity = useSharedValue(0);

  useEffect(() => {
    const cfg = { duration: dur, easing: Easing.in(Easing.quad) };
    translateY.value = withDelay(delay, withTiming(SCREEN_HEIGHT + 20, cfg));
    translateX.value = withDelay(delay, withTiming(cx, cfg));
    rotate.value = withDelay(delay, withTiming(rot, cfg));
    opacity.value = withDelay(delay, withTiming(1, { duration: 80 }));
  }, []);

  const animStyle = useAnimatedStyle(() => ({
    transform: [
      { translateY: translateY.value },
      { translateX: translateX.value },
      { rotate: `${rotate.value}deg` },
    ],
    opacity: opacity.value,
  }));

  return (
    <Animated.View
      style={[
        animStyle,
        {
          position: 'absolute',
          left: `${x}%` as any,
          top: 0,
          width: size,
          height: isCircle ? size : size * 0.5,
          backgroundColor: color,
          borderRadius: isCircle ? size / 2 : 1,
        },
      ]}
    />
  );
}

interface ConfettiProps {
  count?: number;
  run?: boolean;
}

export function Confetti({ count = 50, run = true }: ConfettiProps) {
  const pieces = useMemo<PieceConfig[]>(
    () =>
      Array.from({ length: count }, (_, i) => ({
        x: Math.random() * 100,
        cx: (Math.random() - 0.5) * 200,
        rot: Math.random() * 720 - 360,
        dur: (Math.random() * 1.5 + 2) * 1000,
        delay: Math.random() * 600,
        size: Math.random() * 6 + 5,
        isCircle: Math.random() > 0.5,
        color: COLORS[i % COLORS.length],
      })),
    [count],
  );

  if (!run) return null;

  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="none">
      {pieces.map((p, i) => (
        <ConfettiPiece key={i} {...p} />
      ))}
    </View>
  );
}
