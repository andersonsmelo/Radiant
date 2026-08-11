import React from 'react';
import { StyleSheet, View } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { PIXEL_SCREEN } from './pixelScreenGeometry';
import {
  PIXEL_EXPRESSIONS,
  PIXEL_EYE_BASELINE,
  PIXEL_EYE_GAP,
  PIXEL_MOUTH_BASELINE,
  type PixelExpression,
  type PixelFaceShape,
} from './pixelExpressions';

interface PixelFaceProps {
  expression: PixelExpression;
  /** Largura da Image em pixels. NÃO a largura do frame. */
  imageWidth: number;
  /** Altura da Image em pixels. NÃO a altura do frame. */
  imageHeight: number;
}

/** Converte a forma (em fração da tela) para pixels absolutos da imagem. */
function resolveLayout(shape: PixelFaceShape, imageWidth: number, imageHeight: number) {
  const screenX = PIXEL_SCREEN.x * imageWidth;
  const screenY = PIXEL_SCREEN.y * imageHeight;
  const screenW = PIXEL_SCREEN.w * imageWidth;
  const screenH = PIXEL_SCREEN.h * imageHeight;

  return {
    screenX,
    screenY,
    screenW,
    screenH,
    eyeW: shape.eyeW * screenW,
    eyeH: shape.eyeH * screenH,
    eyeGap: PIXEL_EYE_GAP * screenW,
    eyeCenterY: screenH / 2 + (PIXEL_EYE_BASELINE + shape.eyeOffsetY) * screenH,
    mouthW: shape.mouthW * screenW,
    mouthDip: shape.mouthDip * screenH,
    mouthThickness: Math.max(1.5, shape.mouthThickness * screenH),
    mouthY: screenH / 2 + PIXEL_MOUTH_BASELINE * screenH,
  };
}

/** Curva de três pontos. Mergulho positivo desce no meio, ou seja, sorri. */
function mouthPath(centerX: number, y: number, width: number, dip: number) {
  const x0 = centerX - width / 2;
  const x1 = centerX + width / 2;
  // Num quadrático, o ponto de controle precisa do dobro do deslocamento
  // desejado para que a curva passe por `y + dip` no meio.
  return `M ${x0} ${y} Q ${centerX} ${y + dip * 2} ${x1} ${y}`;
}

export function PixelFace({ expression, imageWidth, imageHeight }: PixelFaceProps) {
  const shape = PIXEL_EXPRESSIONS[expression] ?? PIXEL_EXPRESSIONS.neutro;
  const l = resolveLayout(shape, imageWidth, imageHeight);
  const centerX = l.screenW / 2;

  return (
    <View
      pointerEvents="none"
      style={[
        styles.layer,
        { left: l.screenX, top: l.screenY, width: l.screenW, height: l.screenH },
      ]}
    >
      {!shape.eyeArc
        ? [-1, 1].map((side) => (
            <View
              key={`eye-${side}`}
              style={{
                position: 'absolute',
                left: centerX + side * l.eyeGap - l.eyeW / 2,
                top: l.eyeCenterY - l.eyeH / 2,
                width: l.eyeW,
                height: l.eyeH,
                borderRadius: shape.eyeRadius * l.eyeW,
                backgroundColor: shape.glow,
                transform: [{ rotate: `${-side * shape.eyeRotate}deg` }],
              }}
            />
          ))
        : null}

      <Svg width={l.screenW} height={l.screenH} style={styles.svg}>
        {shape.eyeArc
          ? [-1, 1].map((side) => {
              const ex = centerX + side * l.eyeGap;
              const rx = l.eyeW * 0.95;
              return (
                <Path
                  key={`arc-${side}`}
                  d={`M ${ex - rx} ${l.eyeCenterY} Q ${ex} ${l.eyeCenterY - l.eyeH * 1.6} ${ex + rx} ${l.eyeCenterY}`}
                  stroke={shape.glow}
                  strokeWidth={l.mouthThickness}
                  strokeLinecap="round"
                  fill="none"
                />
              );
            })
          : null}
        <Path
          d={mouthPath(centerX, l.mouthY, l.mouthW, l.mouthDip)}
          stroke={shape.glow}
          strokeWidth={l.mouthThickness}
          strokeLinecap="round"
          fill="none"
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
  svg: {
    position: 'absolute',
    left: 0,
    top: 0,
  },
});
