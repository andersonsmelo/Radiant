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

// ── Nebula estática ───────────────────────────────────────────

function Nebula({ color, x, y, w, h }: NebulaConfig) {
  return (
    <View
      pointerEvents="none"
      style={{
        position: 'absolute',
        left: `${x * 100}%` as any,
        top: `${y * 100}%` as any,
        width: w,
        height: h,
        borderRadius: w / 2,
        backgroundColor: color,
        // blur via shadow no iOS
        shadowColor: color,
        shadowOpacity: 1,
        shadowRadius: 60,
        shadowOffset: { width: 0, height: 0 },
      }}
    />
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
    { color: 'rgba(61,202,232,0.06)',  x: 0.05, y: 0.05, w: 320, h: 220 },
    // Blue nebula — bottom-right (design: rgba(33,85,255) primary)
    { color: 'rgba(33,85,255,0.10)',   x: 0.55, y: 0.60, w: 280, h: 200 },
    // Deep indigo — centre fill for depth
    { color: 'rgba(21, 30, 100, 0.08)', x: 0.2,  y: 0.35, w: 240, h: 180 },
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
