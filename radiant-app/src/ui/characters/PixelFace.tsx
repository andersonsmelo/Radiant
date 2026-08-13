import React, { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import Animated, {
  Easing,
  useAnimatedProps,
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import { PIXEL_SCREEN } from './pixelScreenGeometry';
import {
  PIXEL_EXPRESSIONS,
  PIXEL_EYE_BASELINE,
  PIXEL_EYE_GAP,
  PIXEL_MOUTH_BASELINE,
  type PixelExpression,
} from './pixelExpressions';
import { useReducedMotionPreference } from '../accessibility/useReducedMotionPreference';

const AnimatedPath = Animated.createAnimatedComponent(Path);

/** Duração da transição entre duas expressões. */
const TROCA_MS = 260;
const TROCA = { duration: TROCA_MS, easing: Easing.out(Easing.quad) } as const;
/** Duração de cada metade da piscada — fechar, depois abrir. */
const PISCADA_MS = 90;

interface PixelFaceProps {
  expression: PixelExpression;
  /** Largura da Image em pixels. NÃO a largura do frame. */
  imageWidth: number;
  /** Altura da Image em pixels. NÃO a altura do frame. */
  imageHeight: number;
}

/** Curva de três pontos. Mergulho positivo desce no meio, ou seja, sorri. */
function mouthPath(centerX: number, y: number, width: number, dip: number) {
  'worklet';
  const x0 = centerX - width / 2;
  const x1 = centerX + width / 2;
  // Num quadrático, o ponto de controle precisa do dobro do deslocamento
  // desejado para que a curva passe por `y + dip` no meio.
  return `M ${x0} ${y} Q ${centerX} ${y + dip * 2} ${x1} ${y}`;
}

export function PixelFace({ expression, imageWidth, imageHeight }: PixelFaceProps) {
  // Recalculado a cada render a partir da prop `expression` — é o que dá a
  // `glowColor` (abaixo) seu valor mais atual, já que `glow` troca direto,
  // sem interpolação. `useSharedValue` abaixo só olha para o valor inicial
  // na primeira chamada; renders seguintes não afetam a semente.
  const shape = PIXEL_EXPRESSIONS[expression] ?? PIXEL_EXPRESSIONS.neutro;
  const reducedMotion = useReducedMotionPreference();

  // Um useSharedValue por número interpolável. `glow` não entra aqui: ele
  // troca direto com a expressão, nunca interpola (regra 2).
  const eyeW = useSharedValue(shape.eyeW);
  const eyeH = useSharedValue(shape.eyeH);
  const eyeRadius = useSharedValue(shape.eyeRadius);
  const eyeRotate = useSharedValue(shape.eyeRotate);
  const eyeOffsetY = useSharedValue(shape.eyeOffsetY);
  const mouthW = useSharedValue(shape.mouthW);
  const mouthDip = useSharedValue(shape.mouthDip);
  const mouthThickness = useSharedValue(shape.mouthThickness);
  // 0 = olho pílula, 1 = olho arco. Crossfade de opacidade entre as duas
  // representações — não há morphing de forma entre pílula e arco.
  const arcMix = useSharedValue(shape.eyeArc ? 1 : 0);
  // Multiplicador da altura do olho, não valor absoluto: funciona em
  // qualquer tamanho de render (sm, md, lg) sem precisar saber pixels.
  const blink = useSharedValue(1);

  useEffect(() => {
    const next = PIXEL_EXPRESSIONS[expression] ?? PIXEL_EXPRESSIONS.neutro;
    const targetArcMix = next.eyeArc ? 1 : 0;

    if (reducedMotion) {
      // A pose muda — a expressão é informação — mas sem interpolação e sem
      // o movimento perpétuo da piscada, que outro efeito nem agenda.
      eyeW.value = next.eyeW;
      eyeH.value = next.eyeH;
      eyeRadius.value = next.eyeRadius;
      eyeRotate.value = next.eyeRotate;
      eyeOffsetY.value = next.eyeOffsetY;
      mouthW.value = next.mouthW;
      mouthDip.value = next.mouthDip;
      mouthThickness.value = next.mouthThickness;
      arcMix.value = targetArcMix;
      return;
    }

    eyeW.value = withTiming(next.eyeW, TROCA);
    eyeH.value = withTiming(next.eyeH, TROCA);
    eyeRadius.value = withTiming(next.eyeRadius, TROCA);
    eyeRotate.value = withTiming(next.eyeRotate, TROCA);
    eyeOffsetY.value = withTiming(next.eyeOffsetY, TROCA);
    mouthW.value = withTiming(next.mouthW, TROCA);
    mouthDip.value = withTiming(next.mouthDip, TROCA);
    mouthThickness.value = withTiming(next.mouthThickness, TROCA);
    arcMix.value = withTiming(targetArcMix, TROCA);
  }, [expression, reducedMotion]);

  useEffect(() => {
    if (reducedMotion) {
      blink.value = 1;
      return;
    }

    let timeoutId: ReturnType<typeof setTimeout>;

    const scheduleBlink = () => {
      const delay = 4000 + Math.random() * 3000;
      timeoutId = setTimeout(() => {
        blink.value = withSequence(
          withTiming(0.1, { duration: PISCADA_MS, easing: Easing.out(Easing.quad) }),
          withTiming(1, { duration: PISCADA_MS, easing: Easing.out(Easing.quad) }),
        );
        scheduleBlink();
      }, delay);
    };

    scheduleBlink();

    return () => {
      clearTimeout(timeoutId);
    };
  }, [reducedMotion]);

  const screenX = PIXEL_SCREEN.x * imageWidth;
  const screenY = PIXEL_SCREEN.y * imageHeight;
  const screenW = PIXEL_SCREEN.w * imageWidth;
  const screenH = PIXEL_SCREEN.h * imageHeight;
  const centerX = screenW / 2;
  const eyeGapPx = PIXEL_EYE_GAP * screenW;
  const mouthY = screenH / 2 + PIXEL_MOUTH_BASELINE * screenH;
  const glowColor = shape.glow;

  const eyePillLeftStyle = useAnimatedStyle(() => {
    const heightPx = eyeH.value * screenH * blink.value;
    const widthPx = eyeW.value * screenW;
    const eyeCenterY = screenH / 2 + (PIXEL_EYE_BASELINE + eyeOffsetY.value) * screenH;
    const cx = centerX - eyeGapPx;
    return {
      left: cx - widthPx / 2,
      top: eyeCenterY - heightPx / 2,
      width: widthPx,
      height: heightPx,
      borderRadius: eyeRadius.value * widthPx,
      backgroundColor: glowColor,
      opacity: 1 - arcMix.value,
      transform: [{ rotate: `${eyeRotate.value}deg` }],
    };
  });

  const eyePillRightStyle = useAnimatedStyle(() => {
    const heightPx = eyeH.value * screenH * blink.value;
    const widthPx = eyeW.value * screenW;
    const eyeCenterY = screenH / 2 + (PIXEL_EYE_BASELINE + eyeOffsetY.value) * screenH;
    const cx = centerX + eyeGapPx;
    return {
      left: cx - widthPx / 2,
      top: eyeCenterY - heightPx / 2,
      width: widthPx,
      height: heightPx,
      borderRadius: eyeRadius.value * widthPx,
      backgroundColor: glowColor,
      opacity: 1 - arcMix.value,
      transform: [{ rotate: `${-eyeRotate.value}deg` }],
    };
  });

  const eyeArcLeftProps = useAnimatedProps(() => {
    const heightPx = eyeH.value * screenH * blink.value;
    const widthPx = eyeW.value * screenW;
    const eyeCenterY = screenH / 2 + (PIXEL_EYE_BASELINE + eyeOffsetY.value) * screenH;
    const ex = centerX - eyeGapPx;
    const rx = widthPx * 0.95;
    return {
      d: `M ${ex - rx} ${eyeCenterY} Q ${ex} ${eyeCenterY - heightPx * 1.6} ${ex + rx} ${eyeCenterY}`,
      stroke: glowColor,
      strokeWidth: Math.max(1.5, mouthThickness.value * screenH),
      opacity: arcMix.value,
    };
  });

  const eyeArcRightProps = useAnimatedProps(() => {
    const heightPx = eyeH.value * screenH * blink.value;
    const widthPx = eyeW.value * screenW;
    const eyeCenterY = screenH / 2 + (PIXEL_EYE_BASELINE + eyeOffsetY.value) * screenH;
    const ex = centerX + eyeGapPx;
    const rx = widthPx * 0.95;
    return {
      d: `M ${ex - rx} ${eyeCenterY} Q ${ex} ${eyeCenterY - heightPx * 1.6} ${ex + rx} ${eyeCenterY}`,
      stroke: glowColor,
      strokeWidth: Math.max(1.5, mouthThickness.value * screenH),
      opacity: arcMix.value,
    };
  });

  const mouthProps = useAnimatedProps(() => {
    const widthPx = mouthW.value * screenW;
    const dipPx = mouthDip.value * screenH;
    return {
      d: mouthPath(centerX, mouthY, widthPx, dipPx),
      stroke: glowColor,
      strokeWidth: Math.max(1.5, mouthThickness.value * screenH),
    };
  });

  return (
    <View
      pointerEvents="none"
      style={[
        styles.layer,
        { left: screenX, top: screenY, width: screenW, height: screenH },
      ]}
    >
      <Animated.View style={[styles.eyePill, eyePillLeftStyle]} />
      <Animated.View style={[styles.eyePill, eyePillRightStyle]} />

      <Svg width={screenW} height={screenH} style={styles.svg}>
        <AnimatedPath
          animatedProps={eyeArcLeftProps}
          fill="none"
          strokeLinecap="round"
        />
        <AnimatedPath
          animatedProps={eyeArcRightProps}
          fill="none"
          strokeLinecap="round"
        />
        <AnimatedPath
          animatedProps={mouthProps}
          fill="none"
          strokeLinecap="round"
        />
      </Svg>
    </View>
  );
}

const styles = StyleSheet.create({
  layer: {
    position: 'absolute',
    zIndex: 3,
  },
  eyePill: {
    position: 'absolute',
  },
  svg: {
    position: 'absolute',
    left: 0,
    top: 0,
  },
});
