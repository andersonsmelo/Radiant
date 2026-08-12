/**
 * Ícones do HUD — vetor animado em código.
 *
 * Substituem o emoji do sistema (⚡ 🔥 ❤️ 🤍), que ignorava token de cor,
 * renderizava ao gosto do SO e era o objeto mais saturado da Home — mais forte
 * que o próprio CTA. O DESIGN.md proíbe emoji como ícone por escrito.
 *
 * Por que código e não Rive/Lottie: estes três ficam montados no HUD em nove
 * telas. Instanciar um runtime de animação por glifo de 14pt para produzir um
 * pulso de escala é custo permanente sem retorno. Rive fica reservado ao Pixel,
 * onde a interpolação de forma compensa.
 *
 * Cada ícone tem um PAPEL de movimento distinto, e a diferença é intencional:
 * o XP celebra um evento, a chama sinaliza um estado vivo, o coração encena uma
 * perda. Movimento uniforme nos três diria que os três significam a mesma coisa.
 */

import React, { useEffect } from 'react';
import Svg, { Path } from 'react-native-svg';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import { galaxyColors } from '../theme';
import { useReducedMotionPreference } from '../accessibility/useReducedMotionPreference';

// Espelham `src/ui/motion.ts`. Reanimated exige a curva no seu próprio módulo,
// então os números vivem aqui, mas os valores são os mesmos do token.
const OUT = Easing.bezier(0.22, 1, 0.36, 1);
const SPRING = Easing.bezier(0.34, 1.56, 0.64, 1);
const DURATION_UI = 220;
const DURATION_CELEBRATE = 600;
const STREAK_BREATH = 1600;

type IconProps = { size?: number; testID?: string };

// ── XP — celebra o ganho ──────────────────────────────────────
export function XpIcon({ size = 14, value = 0 }: IconProps & { value?: number }) {
  const reducedMotion = useReducedMotionPreference();
  const scale = useSharedValue(1);
  const previous = React.useRef(value);

  useEffect(() => {
    const ganhou = value > previous.current;
    previous.current = value;
    if (!ganhou || reducedMotion) return;

    scale.value = withSequence(
      withTiming(1.35, { duration: DURATION_CELEBRATE * 0.35, easing: SPRING }),
      withTiming(1, { duration: DURATION_CELEBRATE * 0.65, easing: OUT }),
    );
  }, [reducedMotion, scale, value]);

  const style = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));

  return (
    <Animated.View style={style}>
      <Svg width={size} height={size} viewBox="0 0 52 52">
        <Path d="M28 8 L15 29 h9 l-2 15 13-21h-9z" fill={galaxyColors.xpColor} />
      </Svg>
    </Animated.View>
  );
}

// ── Sequência — respira em repouso ────────────────────────────
export function StreakIcon({ size = 14 }: IconProps) {
  const reducedMotion = useReducedMotionPreference();
  const scale = useSharedValue(1);

  useEffect(() => {
    if (reducedMotion) {
      // Estado final estático: a chama continua legível, sem o loop infinito.
      scale.value = 1;
      return;
    }

    scale.value = withRepeat(
      withSequence(
        withTiming(1.08, { duration: STREAK_BREATH / 2, easing: Easing.inOut(Easing.ease) }),
        withTiming(1, { duration: STREAK_BREATH / 2, easing: Easing.inOut(Easing.ease) }),
      ),
      -1,
      false,
    );
  }, [reducedMotion, scale]);

  const style = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));

  return (
    <Animated.View style={style}>
      <Svg width={size} height={size} viewBox="0 0 52 52">
        <Path
          d="M26 6c7 9 12 13 12 21a12 12 0 0 1-24 0c0-8 5-12 12-21z"
          fill={galaxyColors.streakColor}
        />
        <Path d="M26 20c3.5 5 6 7 6 11a6 6 0 0 1-12 0c0-4 2.5-6 6-11z" fill="#FFD27A" />
      </Svg>
    </Animated.View>
  );
}

// ── Vida — o preenchimento é o estado ─────────────────────────
export function HeartIcon({ size = 18, filled, testID }: IconProps & { filled: boolean }) {
  // A cor cheia contra o vazio é o canal visual do estado. O canal de leitor de
  // tela é o rótulo agregado do HUD ("3 de 5 vidas") — os dois existem, e nenhum
  // depende do outro. Cor sozinha nunca carrega informação neste projeto.
  return (
    <Svg width={size} height={size} viewBox="0 0 52 52">
      <Path
        testID={testID}
        d="M26 43S8 32 8 20a10 10 0 0 1 18-6 10 10 0 0 1 18 6c0 12-18 23-18 23z"
        fill={filled ? galaxyColors.heartFull : galaxyColors.heartEmpty}
      />
    </Svg>
  );
}

export const hudIconTiming = { DURATION_UI, DURATION_CELEBRATE, STREAK_BREATH };
