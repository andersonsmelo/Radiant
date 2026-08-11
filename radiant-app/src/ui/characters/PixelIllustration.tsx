import React, { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, {
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
  useAnimatedStyle,
} from 'react-native-reanimated';
import { Image } from 'expo-image';
import type { CharacterSize, CharacterState, CharacterTier } from './types';
import { resolvePixelAsset } from './pixelAssets';
import { colors } from '../theme';
import { radius, space } from '../styles';
import { useReducedMotionPreference } from '../accessibility/useReducedMotionPreference';

/**
 * Largura renderizada de cada tamanho. Exportado porque quem coloca o Pixel
 * ao lado de texto precisa reservar a coluna: sem isso o conteúdo irmão fica
 * com a sobra e o texto quebra no meio da palavra.
 */
export const PIXEL_SIZE_MAP: Record<CharacterSize, number> = {
  sm: 60,
  md: 108,
  lg: 176,
};

const SIZE_MAP = PIXEL_SIZE_MAP;

const GRID_LINES = Array.from({ length: 6 }, (_, index) => index);
const PARTICLES = [
  { top: 18, right: 20 },
  { top: 42, right: 2 },
  { top: 112, left: 16 },
];

type PixelStateSpec = {
  glowColor: string;
  accentColor: string;
  faceColor: string;
  scanColor: string;
  showScan: boolean;
  showPanel: boolean;
  showParticles: boolean;
  imageOffsetY: number;
  imageScale: number;
  imageRotation: string;
};

const STATE_SPECS: Record<CharacterState, PixelStateSpec> = {
  idle: {
    glowColor: colors.highlight,
    accentColor: colors.accent,
    faceColor: colors.accentStrong,
    scanColor: colors.highlight,
    showScan: false,
    showPanel: false,
    showParticles: false,
    imageOffsetY: -6,
    imageScale: 1,
    imageRotation: '0deg',
  },
  thinking: {
    glowColor: colors.accent,
    accentColor: colors.primary,
    faceColor: colors.primary,
    scanColor: colors.accentStrong,
    showScan: true,
    showPanel: true,
    showParticles: false,
    imageOffsetY: -8,
    imageScale: 1.01,
    imageRotation: '2deg',
  },
  guide: {
    glowColor: colors.highlight,
    accentColor: colors.primary,
    faceColor: colors.accentStrong,
    scanColor: colors.accentStrong,
    showScan: true,
    showPanel: true,
    showParticles: false,
    imageOffsetY: -8,
    imageScale: 1.02,
    imageRotation: '0deg',
  },
  happy: {
    glowColor: colors.highlight,
    accentColor: colors.success,
    faceColor: colors.accentStrong,
    scanColor: colors.accentStrong,
    showScan: false,
    showPanel: false,
    showParticles: true,
    imageOffsetY: -10,
    imageScale: 1.02,
    imageRotation: '-2deg',
  },
  celebrate: {
    glowColor: colors.highlight,
    accentColor: colors.success,
    faceColor: colors.primary,
    scanColor: colors.accentStrong,
    showScan: true,
    showPanel: true,
    showParticles: true,
    imageOffsetY: -12,
    imageScale: 1.06,
    imageRotation: '-4deg',
  },
  oops: {
    glowColor: colors.warningSoft,
    accentColor: colors.warning,
    faceColor: colors.warning,
    scanColor: colors.warning,
    showScan: false,
    showPanel: false,
    showParticles: false,
    imageOffsetY: -4,
    imageScale: 0.99,
    imageRotation: '1deg',
  },
};

function resolveTier(state: CharacterState, tier?: CharacterTier): CharacterTier {
  if (tier) {
    return tier;
  }

  switch (state) {
    case 'celebrate':
      return 'advanced';
    case 'guide':
    case 'thinking':
    case 'happy':
      return 'intermediate';
    default:
      return 'starter';
  }
}

interface PixelIllustrationProps {
  state?: CharacterState;
  size?: CharacterSize;
  tier?: CharacterTier;
  accessibilityLabel?: string;
}

function PixelFace({
  state,
  dimension,
  color,
}: {
  state: CharacterState;
  dimension: number;
  color: string;
}) {
  const eyeSize = Math.max(6, Math.round(dimension * 0.09));
  const faceWidth = Math.round(dimension * 0.34);
  const faceHeight = Math.round(dimension * 0.18);

  return (
    <View
      pointerEvents="none"
      style={[
        styles.faceLayer,
        {
          width: faceWidth,
          height: faceHeight,
          top: Math.round(dimension * 0.22),
        },
      ]}
    >
      <View style={styles.faceRow}>
        <View
          style={[
            styles.eye,
            styles.eyeLeft,
            {
              width: eyeSize,
              height: state === 'thinking' ? 3 : eyeSize,
              borderRadius: eyeSize,
              backgroundColor: color,
              opacity: state === 'oops' ? 0.72 : 0.96,
            },
          ]}
        />
        <View
          style={[
            styles.eye,
            styles.eyeRight,
            {
              width: eyeSize,
              height: state === 'thinking' ? 3 : eyeSize,
              borderRadius: eyeSize,
              backgroundColor: color,
              opacity: state === 'oops' ? 0.72 : 0.96,
            },
          ]}
        />
      </View>
      <View
        style={[
          styles.mouth,
          {
            width: Math.round(faceWidth * 0.3),
            height: state === 'thinking' ? 3 : Math.max(6, Math.round(dimension * 0.03)),
            borderRadius: 999,
            backgroundColor: color,
            marginTop: state === 'thinking' ? space.s0 : space.s1,
            opacity: 0.92,
            transform: [{ scaleX: state === 'oops' ? 0.82 : 1 }],
          },
        ]}
      />
    </View>
  );
}

export function PixelIllustration({
  state = 'guide',
  size = 'md',
  tier,
  accessibilityLabel = 'Mascote Pixel',
}: PixelIllustrationProps) {
  const dimension = SIZE_MAP[size];
  const tierValue = resolveTier(state, tier);
  const stateSpec = STATE_SPECS[state];
  const asset = resolvePixelAsset(state, tierValue, size);
  const tierGlowOpacity = tierValue === 'advanced' ? 0.34 : tierValue === 'intermediate' ? 0.27 : 0.18;
  const gridOpacity = tierValue === 'advanced' ? 0.28 : tierValue === 'intermediate' ? 0.18 : 0.08;
  const shouldShowPanel = !asset.isDedicated && (stateSpec.showPanel || tierValue === 'advanced');
  const shouldShowGrid = !asset.isDedicated;
  const shouldShowScan = !asset.isDedicated && stateSpec.showScan;
  const shouldShowFace = !asset.isDedicated;
  const shouldShowParticles = !asset.isDedicated && stateSpec.showParticles;

  const translateY = useSharedValue(0);
  const scale = useSharedValue(1);
  const rotate = useSharedValue(0);
  const reducedMotion = useReducedMotionPreference();

  useEffect(() => {
    // Reset to defaults first
    translateY.value = 0;
    scale.value = 1;
    rotate.value = 0;

    // Com reduced motion o Pixel adota a POSE de cada estado (inclinação,
    // escala) sem os loops infinitos de flutuar, pulsar e tremer. A expressão
    // do personagem sobrevive; o movimento perpétuo, não.
    if (reducedMotion) {
      switch (state) {
        case 'happy':
          scale.value = 1.03;
          break;
        case 'guide':
          rotate.value = -3;
          break;
        case 'thinking':
          rotate.value = 4;
          scale.value = 0.97;
          break;
        case 'celebrate':
          scale.value = 1.08;
          break;
        case 'oops':
          rotate.value = -2;
          break;
        default:
          break;
      }
      return;
    }

    switch (state) {
      case 'idle':
        translateY.value = withRepeat(
          withSequence(
            withTiming(-8, { duration: 2250 }),
            withTiming(0, { duration: 2250 }),
          ), -1, false
        );
        break;
      case 'happy':
        translateY.value = withRepeat(
          withSequence(
            withTiming(-8, { duration: 1500 }),
            withTiming(0, { duration: 1500 }),
          ), -1, false
        );
        scale.value = 1.03;
        break;
      case 'guide':
        translateY.value = withRepeat(
          withSequence(
            withTiming(-8, { duration: 2500 }),
            withTiming(0, { duration: 2500 }),
          ), -1, false
        );
        rotate.value = -3;
        break;
      case 'thinking':
        translateY.value = withRepeat(
          withSequence(
            withTiming(-8, { duration: 3000 }),
            withTiming(0, { duration: 3000 }),
          ), -1, false
        );
        rotate.value = 4;
        scale.value = 0.97;
        break;
      case 'celebrate':
        scale.value = withRepeat(
          withSequence(
            withTiming(1.08, { duration: 600 }),
            withTiming(1, { duration: 600 }),
          ), -1, false
        );
        break;
      case 'oops':
        translateY.value = withRepeat(
          withSequence(
            withTiming(-6, { duration: 180 }),
            withTiming(6, { duration: 180 }),
            withTiming(-4, { duration: 180 }),
            withTiming(4, { duration: 180 }),
            withTiming(0, { duration: 180 }),
          ), -1, false
        );
        rotate.value = -2;
        scale.value = 0.96;
        break;
    }
  }, [state, reducedMotion]);

  const animStyle = useAnimatedStyle(() => ({
    transform: [
      { translateY: translateY.value },
      { scale: scale.value },
      { rotate: `${rotate.value}deg` },
    ],
  }));

  return (
    <Animated.View style={[styles.frame, { width: dimension, height: Math.round(dimension * 1.38) }, animStyle]}>
      <View
        style={[
          styles.haloPrimary,
          {
            backgroundColor: stateSpec.glowColor,
            opacity: tierGlowOpacity,
            width: Math.round(dimension * 1.12),
            height: Math.round(dimension * 1.12),
          },
        ]}
      />
      <View
        style={[
          styles.haloSecondary,
          {
            backgroundColor: stateSpec.accentColor,
            opacity: tierGlowOpacity * 0.74,
            width: Math.round(dimension * 0.66),
            height: Math.round(dimension * 0.66),
          },
        ]}
      />

      {shouldShowPanel ? (
        <View
          style={[
            styles.holoPanel,
            {
              borderColor: `${stateSpec.accentColor}88`,
              backgroundColor: `${colors.surface}AA`,
            },
          ]}
        >
          {GRID_LINES.map((lineIndex) => (
            <View
              key={`panel-line-${lineIndex}`}
              style={[
                styles.holoLine,
                {
                  backgroundColor: `${stateSpec.accentColor}${lineIndex % 2 === 0 ? '55' : '2A'}`,
                },
              ]}
            />
          ))}
        </View>
      ) : null}

      {shouldShowGrid ? (
        <View
          style={[
            styles.gridLayer,
            {
              opacity: gridOpacity,
              borderColor: `${stateSpec.accentColor}55`,
            },
          ]}
        >
          {GRID_LINES.map((lineIndex) => (
            <View
              key={`grid-line-${lineIndex}`}
              style={[
                styles.gridLine,
                {
                  backgroundColor: `${stateSpec.accentColor}${lineIndex === 2 ? '66' : '33'}`,
                },
              ]}
            />
          ))}
        </View>
      ) : null}

      {shouldShowScan ? (
        <View
          style={[
            styles.scanBeam,
            {
              backgroundColor: `${stateSpec.scanColor}66`,
            },
          ]}
        />
      ) : null}

      <Image
        source={asset.source}
        contentFit="contain"
        accessibilityLabel={accessibilityLabel}
        style={[
          styles.image,
          {
            width: dimension,
            height: Math.round(dimension * 1.48),
          },
        ]}
      />

      {shouldShowFace ? <PixelFace state={state} dimension={dimension} color={stateSpec.faceColor} /> : null}

      {shouldShowParticles ? (
        <>
          {PARTICLES.map((particle, index) => (
            <View
              key={`particle-${index}`}
              style={[
                styles.particle,
                {
                  top: particle.top,
                  right: particle.right,
                  left: particle.left,
                  backgroundColor: index === 0 ? stateSpec.accentColor : stateSpec.faceColor,
                },
              ]}
            />
          ))}
        </>
      ) : null}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  frame: {
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'visible',
  },
  haloPrimary: {
    position: 'absolute',
    borderRadius: 999,
  },
  haloSecondary: {
    position: 'absolute',
    top: '18%',
    borderRadius: 999,
  },
  holoPanel: {
    position: 'absolute',
    right: 0,
    top: '18%',
    width: 56,
    paddingHorizontal: space.s1,
    paddingVertical: space.s1,
    borderRadius: radius.rMd,
    borderWidth: 1,
    gap: space.s0,
  },
  holoLine: {
    height: 3,
    borderRadius: 999,
  },
  gridLayer: {
    position: 'absolute',
    top: '14%',
    width: '78%',
    height: '68%',
    borderRadius: radius.rXl,
    borderWidth: 1,
    justifyContent: 'space-evenly',
    overflow: 'hidden',
  },
  gridLine: {
    height: 1,
  },
  scanBeam: {
    position: 'absolute',
    top: '32%',
    width: '62%',
    height: 12,
    borderRadius: 999,
  },
  image: {
    zIndex: 2,
  },
  faceLayer: {
    position: 'absolute',
    zIndex: 3,
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  faceRow: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: space.s1,
  },
  eye: {
    shadowColor: colors.accent,
    shadowOpacity: 0.6,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 0 },
  },
  eyeLeft: {
    transform: [{ rotate: '-4deg' }],
  },
  eyeRight: {
    transform: [{ rotate: '4deg' }],
  },
  mouth: {
    minWidth: 18,
  },
  particle: {
    position: 'absolute',
    width: 8,
    height: 8,
    borderRadius: 999,
    opacity: 0.88,
  },
});
