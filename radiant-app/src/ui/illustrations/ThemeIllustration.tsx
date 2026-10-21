import { useMemo } from 'react';
import { View } from 'react-native';
import {
  BlendColor,
  Canvas,
  Group,
  Paint,
  Picture,
  Skia,
  Skottie,
  type SkPicture,
  type SkSkottieAnimation,
} from '@shopify/react-native-skia';

import { useReducedMotionPreferenceState } from '../accessibility/useReducedMotionPreference';
import { useLottieFrameLoop } from '../motion';
import { medalColors } from '../theme';
import {
  posterFrameOrDefault,
  resolvePlayback,
  type IllustrationState,
  type IllustrationTheme,
} from './illustrationPlayback';

export type { IllustrationState, IllustrationTheme } from './illustrationPlayback';

/**
 * Um Lottie já carregado. O Metro entrega `.json` como objeto (é extensão de
 * código, não de asset), então o `require` do JSON é o próprio documento, e
 * não um número de asset.
 */
export type LottieSource = { meta?: { posterFrame?: number } } & Record<string, unknown>;

/**
 * As ilustrações de tema. Cada JSON tem 120 × 120 a 60 fps e desenha a arte da
 * prancheta (80 × 80 centrada em 0,0) na escala 1,4, com o (0,0) da prancheta
 * no centro do quadro: quem compõe a medalha centra a ilustração como a
 * prancheta centra o `IL[tema]`.
 */
export const illustrationAssets: Partial<Record<IllustrationTheme, LottieSource>> = {
  tubo: require('../../../assets/illustrations/tubo.json'),
};

/**
 * O slot escalar dos JSON que multiplica a opacidade de tudo o que é luz
 * (feixe, fótons, anodo aceso): 100 aceso, 0 na silhueta do nó bloqueado, como
 * o `.no-sil` da prancheta. É slot, e não `setOpacity` por camada, porque o
 * RN Skia 2.2.12 declara `setOpacity` no tipo mas não o expõe no objeto nativo
 * (medido no simulador em 2026-10-21: "setOpacity is not a function").
 */
export const LIGHT_SLOT = 'luz';

const warnedThemes = new Set<IllustrationTheme>();

/** Uma ilustração quebrada avisa uma vez por sessão, e não uma por nó da trilha. */
function warnOnce(theme: IllustrationTheme, reason: string) {
  if (warnedThemes.has(theme)) return;
  warnedThemes.add(theme);
  console.warn(`[ThemeIllustration] tema "${theme}" sem ilustração, só a medalha: ${reason}`);
}

function makeAnimation(theme: IllustrationTheme): SkSkottieAnimation | null {
  const source = illustrationAssets[theme];
  if (!source) {
    warnOnce(theme, 'nenhum Lottie registrado em illustrationAssets');
    return null;
  }
  try {
    const animation = Skia.Skottie.Make(JSON.stringify(source));
    if (!animation) {
      warnOnce(theme, 'o Skottie não montou o JSON');
      return null;
    }
    return animation;
  } catch (error) {
    warnOnce(theme, `o Skottie não montou o JSON (${error instanceof Error ? error.message : String(error)})`);
    return null;
  }
}

/**
 * Grava um quadro parado. Na silhueta, a luz é apagada só durante o desenho e
 * devolvida logo depois: a mesma animação pode voltar a tocar.
 */
function recordStill(animation: SkSkottieAnimation, frame: number, hideLights: boolean): SkPicture {
  const { width, height } = animation.size();
  const recorder = Skia.PictureRecorder();
  const canvas = recorder.beginRecording(Skia.XYWHRect(0, 0, width, height));
  animation.seekFrame(frame);
  const lit = hideLights ? animation.getScalarSlot(LIGHT_SLOT) : null;
  if (lit !== null) animation.setScalarSlot(LIGHT_SLOT, 0);
  animation.render(canvas);
  if (lit !== null) animation.setScalarSlot(LIGHT_SLOT, lit);
  return recorder.finishRecordingAsPicture();
}

export function ThemeIllustration({
  theme,
  state,
  size,
}: {
  theme: IllustrationTheme;
  state: IllustrationState;
  size: number;
}) {
  const animation = useMemo(() => makeAnimation(theme), [theme]);
  const motion = useReducedMotionPreferenceState();
  // Até a preferência responder, a ilustração fica parada: o laço é
  // agendamento, e não pode começar a animação que a pessoa pediu para não ver.
  const reducedMotion = motion.reducedMotionEnabled || !motion.resolved;
  const posterFrame = illustrationAssets[theme]?.meta?.posterFrame;
  const playback = resolvePlayback({ state, reducedMotion, posterFrame });

  const fps = animation ? animation.fps() : 0;
  // O laço (relógio, foco, reduzir movimento) mora em `motion.ts`.
  const frame = useLottieFrameLoop({
    totalFrames: animation ? Math.round(animation.duration() * fps) : 0,
    fps,
    posterFrame: posterFrameOrDefault(posterFrame),
    playing: playback.mode === 'animate',
  });

  const still = useMemo(
    () =>
      animation && playback.frame !== null
        ? recordStill(animation, playback.frame, playback.mode === 'silhouette')
        : null,
    [animation, playback.frame, playback.mode],
  );

  if (!animation) return null;

  const scale = size / animation.size().width;

  return (
    <View
      style={{ width: size, height: size }}
      pointerEvents="none"
      accessible={false}
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
    >
      <Canvas style={{ width: size, height: size }}>
        <Group
          transform={[{ scale }]}
          layer={
            playback.mode === 'silhouette' ? (
              <Paint>
                <BlendColor color={medalColors.locked.silhouette} mode="srcIn" />
              </Paint>
            ) : undefined
          }
        >
          {playback.mode === 'animate' ? (
            <Skottie animation={animation} frame={frame} />
          ) : still ? (
            <Picture picture={still} />
          ) : null}
        </Group>
      </Canvas>
    </View>
  );
}
