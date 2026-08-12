/**
 * StarfieldBackground
 * Fundo espacial com estrelas piscando e nebulas coloridas.
 * Reutilizável em todas as telas da galáxia.
 */

import React, { useEffect, useMemo } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import { galaxyColors } from '../theme';
import { useReducedMotionPreference } from '../accessibility/useReducedMotionPreference';

// ── Tipos ──────────────────────────────────────────────────────

interface NebulaConfig {
  color: string;
  /** 0–1 normalizado */
  x: number;
  y: number;
  /** largura em px */
  w: number;
  h: number;
  /** Deslocamento máximo, em px, para a deriva lenta. */
  driftX?: number;
  driftY?: number;
  /** Metade do ciclo de ida e volta, em ms. */
  driftDuration?: number;
  driftDelay?: number;
}

interface StarfieldBackgroundProps {
  /** Cor de fundo — padrão galaxyColors.background */
  backgroundColor?: string;
  /** Nebulas extras além das padrão */
  extraNebulas?: NebulaConfig[];
  /** Número de estrelas (padrão 90) */
  starCount?: number;
}

// ── Estrela animada ───────────────────────────────────────────

interface StarProps {
  x: number;
  y: number;
  size: number;
  minOpacity: number;
  maxOpacity: number;
  duration: number;
  delay: number;
  reducedMotion: boolean;
}

const Star = React.memo(function Star({
  x, y, size, minOpacity, maxOpacity, duration, delay, reducedMotion,
}: StarProps) {
  // Com reduced motion a estrela fica parada num brilho intermediário: o céu
  // continua estrelado, sem o cintilar infinito.
  const restingOpacity = (minOpacity + maxOpacity) / 2;
  const opacity = useSharedValue(reducedMotion ? restingOpacity : minOpacity);

  useEffect(() => {
    if (reducedMotion) {
      opacity.value = restingOpacity;
      return;
    }

    opacity.value = withDelay(
      delay,
      withRepeat(
        withSequence(
          withTiming(maxOpacity, { duration }),
          withTiming(minOpacity, { duration }),
        ),
        -1,
        false,
      ),
    );
  }, [reducedMotion]);

  const style = useAnimatedStyle(() => ({ opacity: opacity.value }));

  return (
    <Animated.View
      style={[
        {
          position: 'absolute',
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor: '#FFFFFF',
          left: `${x * 100}%` as any,
          top: `${y * 100}%` as any,
        },
        style,
      ]}
    />
  );
});

// ── Nebulosa com deriva lenta ─────────────────────────────────

function Nebula({
  color,
  x,
  y,
  w,
  h,
  driftX = 18,
  driftY = 12,
  driftDuration = 9000,
  driftDelay = 0,
}: NebulaConfig) {
  const reducedMotion = useReducedMotionPreference();
  const drift = useSharedValue(0);

  useEffect(() => {
    if (reducedMotion) {
      drift.value = 0;
      return;
    }

    drift.value = withDelay(
      driftDelay,
      withRepeat(
        withSequence(
          withTiming(1, { duration: driftDuration }),
          withTiming(-1, { duration: driftDuration }),
        ),
        -1,
        false,
      ),
    );
  }, [driftDelay, driftDuration, reducedMotion]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: drift.value * driftX },
      { translateY: drift.value * driftY },
      { scale: 1.08 + Math.abs(drift.value) * 0.04 },
    ],
  }));

  return (
    <Animated.View
      pointerEvents="none"
      style={[
        {
          position: 'absolute',
          left: `${x * 100}%` as any,
          top: `${y * 100}%` as any,
          width: w,
          height: h,
        },
        animatedStyle,
      ]}
    >
      {/* Camadas concêntricas simulam o degrade também onde shadow não borra. */}
      <View
        style={{
          position: 'absolute',
          inset: -48,
          borderRadius: (w + 96) / 2,
          backgroundColor: color,
          opacity: 0.18,
        }}
      />
      <View
        style={{
          position: 'absolute',
          inset: -20,
          borderRadius: (w + 40) / 2,
          backgroundColor: color,
          opacity: 0.42,
          shadowColor: color,
          shadowOpacity: 0.8,
          shadowRadius: 96,
          shadowOffset: { width: 0, height: 0 },
        }}
      />
      <View
        style={{
          width: w,
          height: h,
          borderRadius: w / 2,
          backgroundColor: color,
          opacity: 0.68,
        }}
      />
    </Animated.View>
  );
}

// ── Componente principal ──────────────────────────────────────

export function StarfieldBackground({
  backgroundColor = galaxyColors.background,
  extraNebulas = [],
  starCount = 90,
}: StarfieldBackgroundProps) {

  const reducedMotion = useReducedMotionPreference();

  // Gera estrelas deterministicamente (sem re-render)
  const stars = useMemo<Omit<StarProps, 'reducedMotion'>[]>(() => {
    // seed simples para reprodutibilidade
    const rng = (seed: number) => {
      const x = Math.sin(seed) * 10000;
      return x - Math.floor(x);
    };
    return Array.from({ length: starCount }, (_, i) => {
      const size = rng(i * 3 + 1) < 0.65 ? 1 : rng(i * 7) < 0.5 ? 2 : 3;
      return {
        x: rng(i * 13 + 5),
        y: rng(i * 17 + 7),
        size,
        minOpacity: 0.08 + rng(i * 11) * 0.25,
        maxOpacity: 0.45 + rng(i * 19) * 0.5,
        duration: 1500 + Math.floor(rng(i * 23) * 3500),
        delay: Math.floor(rng(i * 29) * 4000),
      };
    });
  }, [starCount]);

  const defaultNebulas: NebulaConfig[] = [
    // Cyan nebula — top-left (design: rgba(61,202,232) accent)
    { color: 'rgba(61,202,232,0.12)', x: 0.05, y: 0.05, w: 320, h: 220, driftX: 20, driftY: 14 },
    // Blue nebula — bottom-right (design: rgba(33,85,255) primary)
    { color: 'rgba(33,85,255,0.16)', x: 0.55, y: 0.60, w: 280, h: 200, driftX: -26, driftY: -16, driftDelay: 1300 },
    // Deep indigo — centre fill for depth
    { color: 'rgba(21, 30, 100, 0.14)', x: 0.2, y: 0.35, w: 240, h: 180, driftX: 14, driftY: -20, driftDelay: 2400 },
  ];

  const allNebulas = [...defaultNebulas, ...extraNebulas];

  return (
    <View style={[StyleSheet.absoluteFillObject, { backgroundColor }]} pointerEvents="none">
      {/* Nebulas */}
      {allNebulas.map((n, i) => (
        <Nebula key={`nebula-${i}`} {...n} />
      ))}
      {/* Stars */}
      {stars.map((s, i) => (
        <Star key={`star-${i}`} {...s} reducedMotion={reducedMotion} />
      ))}
    </View>
  );
}
