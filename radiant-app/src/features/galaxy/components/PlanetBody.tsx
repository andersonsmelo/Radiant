/**
 * PlanetBody
 * Planeta ou estrela completo: superfície + glow atmosférico + anel (opcional) + pulso animado.
 */

import React, { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import { Ellipse, Svg } from 'react-native-svg';
import type { CelestialBody, CelestialBodySize } from '../../../types/galaxy';
import { PlanetSurface } from './PlanetSurface';

// ── Mapeamento de tamanho ────────────────────────────────────

const PLANET_SIZE: Record<CelestialBodySize, number> = {
  sm: 48,
  md: 64,
  lg: 90,
};

// ── Tipos ───────────────────────────────────────────────────

interface PlanetBodyProps {
  body: CelestialBody;
  /** Override de tamanho em px (ignora body.size) */
  sizeOverride?: number;
}

// ── Componente ──────────────────────────────────────────────

export function PlanetBody({ body, sizeOverride }: PlanetBodyProps) {
  const planetSize = sizeOverride ?? PLANET_SIZE[body.size];
  const { surfaceConfig, hasRing, status } = body;
  const isActive = status === 'active';
  const isLocked = status === 'locked';
  const isCompleted = status === 'completed';

  // Glow externo animado
  const glowOpacity = useSharedValue(isActive ? 0.4 : isCompleted ? 0.55 : 0.2);
  const glowScale = useSharedValue(1);

  const pulseOpacity = useSharedValue(0);
  const pulseScale = useSharedValue(1);

  useEffect(() => {
    if (isActive) {
      // Glow pulsante para planeta ativo
      glowOpacity.value = withRepeat(
        withSequence(
          withTiming(0.85, { duration: 1200 }),
          withTiming(0.4, { duration: 1200 }),
        ),
        -1,
        false,
      );
      glowScale.value = withRepeat(
        withSequence(
          withTiming(1.06, { duration: 1200 }),
          withTiming(0.96, { duration: 1200 }),
        ),
        -1,
        false,
      );

      // Anel de pulso secundário
      pulseOpacity.value = withDelay(
        400,
        withRepeat(
          withSequence(
            withTiming(0.5, { duration: 800 }),
            withTiming(0, { duration: 1400 }),
          ),
          -1,
          false,
        ),
      );
      pulseScale.value = withDelay(
        400,
        withRepeat(
          withSequence(
            withTiming(1.25, { duration: 2200 }),
            withTiming(1.0, { duration: 0 }),
          ),
          -1,
          false,
        ),
      );
    } else if (isCompleted) {
      // Glow dourado estável para concluído
      glowOpacity.value = withRepeat(
        withSequence(
          withTiming(0.7, { duration: 2000 }),
          withTiming(0.45, { duration: 2000 }),
        ),
        -1,
        false,
      );
    }
  }, [status]);

  const glowStyle = useAnimatedStyle(() => ({
    opacity: glowOpacity.value,
    transform: [{ scale: glowScale.value }],
  }));

  const pulseStyle = useAnimatedStyle(() => ({
    opacity: pulseOpacity.value,
    transform: [{ scale: pulseScale.value }],
  }));

  const glowSize = planetSize * 1.8;
  const glowColor = isCompleted ? 'rgba(255, 220, 80, 0.4)' : surfaceConfig.glowColor;

  return (
    <View style={[styles.container, { width: planetSize, height: planetSize }]}>
      {/* Glow atmosférico */}
      {!isLocked && (
        <Animated.View
          pointerEvents="none"
          style={[
            styles.glow,
            {
              width: glowSize,
              height: glowSize,
              borderRadius: glowSize / 2,
              backgroundColor: glowColor,
              top: -(glowSize - planetSize) / 2,
              left: -(glowSize - planetSize) / 2,
              // blur via shadow (iOS)
              shadowColor: glowColor,
              shadowOpacity: 1,
              shadowRadius: 24,
              shadowOffset: { width: 0, height: 0 },
            },
            glowStyle,
          ]}
        />
      )}

      {/* Anel de pulso (só para ativo) */}
      {isActive && (
        <Animated.View
          pointerEvents="none"
          style={[
            styles.pulseRing,
            {
              width: planetSize + 10,
              height: planetSize + 10,
              borderRadius: (planetSize + 10) / 2,
              borderColor: surfaceConfig.atmosphereColor,
              top: -5,
              left: -5,
            },
            pulseStyle,
          ]}
        />
      )}

      {/* Anel de Saturno */}
      {hasRing && !isLocked && (
        <View
          pointerEvents="none"
          style={[
            styles.ringWrapper,
            {
              width: planetSize * 1.55,
              height: planetSize * 1.55,
              top: -(planetSize * 0.275),
              left: -(planetSize * 0.275),
            },
          ]}
        >
          <Svg
            width={planetSize * 1.55}
            height={planetSize * 1.55}
            style={{ transform: [{ rotateX: '72deg' }] }}
          >
            <Ellipse
              cx={(planetSize * 1.55) / 2}
              cy={(planetSize * 1.55) / 2}
              rx={planetSize * 0.72}
              ry={planetSize * 0.18}
              fill="none"
              stroke="rgba(255,180,100,0.25)"
              strokeWidth={6}
            />
            <Ellipse
              cx={(planetSize * 1.55) / 2}
              cy={(planetSize * 1.55) / 2}
              rx={planetSize * 0.64}
              ry={planetSize * 0.14}
              fill="none"
              stroke="rgba(255,200,140,0.15)"
              strokeWidth={4}
            />
          </Svg>
        </View>
      )}

      {/* Superfície do planeta */}
      <View
        style={[
          styles.surface,
          isLocked && styles.surfaceLocked,
        ]}
      >
        <PlanetSurface type={surfaceConfig.type} size={planetSize} />
      </View>
    </View>
  );
}

// ── Estilos ─────────────────────────────────────────────────

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  glow: {
    position: 'absolute',
  },
  pulseRing: {
    position: 'absolute',
    borderWidth: 2,
  },
  ringWrapper: {
    position: 'absolute',
    zIndex: 1,
  },
  surface: {
    zIndex: 3,
    borderRadius: 999,
    overflow: 'hidden',
  },
  surfaceLocked: {
    opacity: 0.28,
    // @ts-ignore
    filter: 'grayscale(0.85)',
  },
});
