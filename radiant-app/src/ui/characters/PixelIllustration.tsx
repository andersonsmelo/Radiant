import React, { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import type { CharacterSize, CharacterState, CharacterTier } from './types';
import { PixelBody, PIXEL_HEAD_WINDOW, PIXEL_VIEWBOX } from './PixelBody';
import { PixelFace } from './PixelFace';
import type { PixelExpression } from './pixelExpressions';
import { poseForState } from './pixelPoses';
import { PIXEL_FRAME_RATIO, PIXEL_IMAGE_RATIO } from './pixelScreenGeometry';
import { useReducedMotionPreferenceState } from '../accessibility/useReducedMotionPreference';

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

/**
 * Largura da JANELA da cabeça em cada tamanho (variante `head`). Exportado pelo
 * mesmo motivo de `PIXEL_SIZE_MAP`: quem põe a cabeça ao lado de uma medalha
 * reserva a coluna. A altura sai da proporção da janela, não é escolhida.
 */
export const PIXEL_HEAD_SIZE_MAP: Record<CharacterSize, number> = {
  sm: 48,
  md: 64,
  lg: 96,
};

/** Quanto o Pixel sobe no ponto mais alto da flutuação, em unidades da caixa de 576 × 864. */
const FLOAT_RISE = 10;
/** Meio ciclo: subir ou descer. O ciclo inteiro dura 3,2 s. */
const FLOAT_HALF_CYCLE_MS = 1600;
/** Curva do flutuar: sobe e desce, então entra e sai suave nas duas pontas. */
const FLUTUA = { easing: Easing.inOut(Easing.quad) } as const;

type PixelVariant = 'full' | 'head';

interface PixelIllustrationProps {
  state?: CharacterState;
  size?: CharacterSize;
  /** Segue na API porque quem chama o passa; deixou de mudar o desenho em 2026-10-21. */
  tier?: CharacterTier;
  accessibilityLabel?: string;
  expression?: PixelExpression;
  /**
   * `full` mostra o corpo inteiro; `head` recorta só a cabeça (antena, orelhas
   * e tela) da MESMA caixa, em vez de redesenhá-la.
   */
  variant?: PixelVariant;
}

/**
 * Onde a caixa do corpo cai dentro do frame, e que tamanho tem o frame.
 *
 * Em `full`, o frame é o de sempre (`dimension` × `dimension × 1,38`) e a caixa,
 * maior, é centrada nele e transborda para cima e para baixo. Em `head`, o
 * frame é uma janela de `overflow: hidden` do tamanho da cabeça e a caixa
 * INTEIRA fica deslocada para que a cabeça caia dentro dela. O `PixelFace`
 * recebe o tamanho da caixa inteira nos dois casos, e por isso não muda.
 */
function layoutFor(size: CharacterSize, variant: PixelVariant) {
  if (variant === 'head') {
    const width = PIXEL_HEAD_SIZE_MAP[size];
    const scale = width / PIXEL_HEAD_WINDOW.width;

    return {
      frameWidth: width,
      frameHeight: Math.round(PIXEL_HEAD_WINDOW.height * scale),
      imageWidth: PIXEL_VIEWBOX.width * scale,
      imageHeight: PIXEL_VIEWBOX.height * scale,
      offsetLeft: -PIXEL_HEAD_WINDOW.x * scale,
      offsetTop: -PIXEL_HEAD_WINDOW.y * scale,
    };
  }

  const dimension = PIXEL_SIZE_MAP[size];

  return {
    frameWidth: dimension,
    frameHeight: Math.round(dimension * PIXEL_FRAME_RATIO),
    imageWidth: dimension,
    imageHeight: Math.round(dimension * PIXEL_IMAGE_RATIO),
    offsetLeft: undefined,
    offsetTop: undefined,
  };
}

export function PixelIllustration({
  state = 'guide',
  size = 'md',
  accessibilityLabel = 'Mascote Pixel',
  expression = 'neutro',
  variant = 'full',
}: PixelIllustrationProps) {
  const { frameWidth, frameHeight, imageWidth, imageHeight, offsetLeft, offsetTop } = layoutFor(size, variant);
  const isHead = variant === 'head';

  // O laço só se agenda depois que a preferência de movimento respondeu, senão
  // ele começaria antes de saber se pode.
  const { reducedMotionEnabled, resolved } = useReducedMotionPreferenceState();
  const shouldFloat = resolved && !reducedMotionEnabled;
  const rise = (-FLOAT_RISE * imageHeight) / PIXEL_VIEWBOX.height;
  const translateY = useSharedValue(0);

  useEffect(() => {
    if (!shouldFloat) {
      // Atribuir um número cancela o laço em andamento: a pose fica parada.
      translateY.value = 0;
      return;
    }

    // Todos os estados flutuam igual. `celebrate` não pulsa mais e `oops` não
    // treme: quem diz o estado é a pose dos braços e o rosto.
    translateY.value = withRepeat(
      withSequence(
        withTiming(rise, { duration: FLOAT_HALF_CYCLE_MS, ...FLUTUA }),
        withTiming(0, { duration: FLOAT_HALF_CYCLE_MS, ...FLUTUA }),
      ),
      -1,
      false,
    );

    return () => {
      translateY.value = 0;
    };
  }, [rise, shouldFloat, translateY]);

  // Sobe o conteúdo do frame inteiro, corpo e rosto juntos. Se só o SVG
  // flutuasse, o rosto, desenhado fora dele, ficaria para trás e sairia da tela.
  const floatStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));

  return (
    <View
      accessible
      accessibilityRole="image"
      accessibilityLabel={accessibilityLabel}
      style={[styles.frame, { width: frameWidth, height: frameHeight }, isHead && styles.window]}
    >
      <Animated.View style={[styles.float, { width: frameWidth, height: frameHeight }, floatStyle]}>
        <View
          style={[
            styles.imageBox,
            { width: imageWidth, height: imageHeight },
            isHead && { position: 'absolute', left: offsetLeft, top: offsetTop },
          ]}
        >
          <PixelBody
            pose={poseForState(state)}
            width={imageWidth}
            height={imageHeight}
            waving={state === 'happy'}
          />
          <PixelFace expression={expression} imageWidth={imageWidth} imageHeight={imageHeight} />
        </View>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  frame: {
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'visible',
  },
  // A janela da cabeça corta o que a caixa inteira tem fora dela.
  window: {
    overflow: 'hidden',
  },
  float: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  imageBox: {
    position: 'relative',
  },
});
