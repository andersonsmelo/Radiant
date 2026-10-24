import React, { useMemo } from 'react';
import { StyleSheet, View } from 'react-native';
import { Canvas, Fill, Shader, Skia, type SkRuntimeEffect } from '@shopify/react-native-skia';

import { exposureModel, type ExposureInput } from './exposureModel';
import {
  EXPOSURE_SEED,
  EXPOSURE_SKSL,
  PHANTOM_BONES,
  PHANTOM_HEIGHT,
  PHANTOM_SOFT,
  PHANTOM_WIDTH,
  grayTone,
  type PhantomShape,
} from './exposureShader';

const warnedReasons = new Set<string>();

/** Um shader quebrado avisa uma vez por motivo na sessão, e não uma por imagem na tela. */
function warnOnce(reason: string) {
  if (warnedReasons.has(reason)) return;
  warnedReasons.add(reason);
  console.warn(`[ExposureImage] fantoma desenhado com Views, sem shader: ${reason}`);
}

function makeEffect(): SkRuntimeEffect | null {
  try {
    const effect = Skia.RuntimeEffect.Make(EXPOSURE_SKSL);
    if (!effect) {
      warnOnce('o Skia não compilou o SkSL (Make devolveu null)');
      return null;
    }
    return effect;
  } catch (error) {
    warnOnce(`o Skia não compilou o SkSL (${error instanceof Error ? error.message : String(error)})`);
    return null;
  }
}

function shapeStyle(shape: PhantomShape, scale: number, color: string) {
  return {
    position: 'absolute' as const,
    left: shape.x * scale,
    top: shape.y * scale,
    width: shape.w * scale,
    height: shape.h * scale,
    borderRadius: shape.r * scale,
    backgroundColor: color,
  };
}

/**
 * O fantoma radiográfico simulado: o shader pinta o joelho estilizado com os
 * números de `exposureModel`. `size` é a largura; a altura segue a proporção da
 * prancheta (270 × 330). O `label` é o que o leitor de tela anuncia.
 *
 * Sem o shader (o Skia não o compila), o mesmo fantoma sai de `View`s em três
 * tons, calculados pelo mesmo modelo, e a tela avisa uma vez no log.
 */
export function ExposureImage({
  input,
  size,
  label,
}: {
  input: ExposureInput;
  size: number;
  label: string;
}): React.ReactElement {
  const effect = useMemo(makeEffect, []);
  const out = exposureModel(input);
  const height = (size * PHANTOM_HEIGHT) / PHANTOM_WIDTH;
  const scale = size / PHANTOM_WIDTH;

  return (
    <View
      style={{ width: size, height }}
      accessible
      accessibilityRole="image"
      accessibilityLabel={label}
    >
      {effect ? (
        <Canvas style={{ width: size, height }}>
          <Fill>
            <Shader
              source={effect}
              uniforms={{
                bone: out.bone,
                soft: out.soft,
                background: out.background,
                noise: out.noise,
                seed: EXPOSURE_SEED,
                size: [size, height],
              }}
            />
          </Fill>
        </Canvas>
      ) : (
        <View testID="exposure-image-fallback" style={styles.fallback}>
          <View
            testID="exposure-fallback-background"
            style={[StyleSheet.absoluteFill, { backgroundColor: grayTone(out.background) }]}
          />
          <View testID="exposure-fallback-soft" style={shapeStyle(PHANTOM_SOFT, scale, grayTone(out.soft))} />
          {PHANTOM_BONES.map((shape, index) => (
            <View
              key={index}
              testID={index === 0 ? 'exposure-fallback-bone' : undefined}
              style={shapeStyle(shape, scale, grayTone(out.bone))}
            />
          ))}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  fallback: { ...StyleSheet.absoluteFillObject, overflow: 'hidden' },
});
