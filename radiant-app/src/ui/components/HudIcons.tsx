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

import React from 'react';
import Svg, { Path } from 'react-native-svg';
import { galaxyColors } from '../theme';
import { duration, MotionView, useBreathingScale, useEventCelebrationScale } from '../motion';

type IconProps = { size?: number; testID?: string };

// ── XP — celebra o ganho ──────────────────────────────────────
export function XpIcon({ size = 14, value = 0 }: IconProps & { value?: number }) {
  const { animatedStyle } = useEventCelebrationScale(value);

  return (
    <MotionView style={animatedStyle}>
      <Svg width={size} height={size} viewBox="0 0 52 52">
        <Path d="M28 8 L15 29 h9 l-2 15 13-21h-9z" fill={galaxyColors.xpColor} />
      </Svg>
    </MotionView>
  );
}

// ── Sequência — respira em repouso ────────────────────────────
export function StreakIcon({ size = 14 }: IconProps) {
  const { animatedStyle } = useBreathingScale();

  return (
    <MotionView style={animatedStyle}>
      <Svg width={size} height={size} viewBox="0 0 52 52">
        <Path
          d="M26 6c7 9 12 13 12 21a12 12 0 0 1-24 0c0-8 5-12 12-21z"
          fill={galaxyColors.streakColor}
        />
        <Path d="M26 20c3.5 5 6 7 6 11a6 6 0 0 1-12 0c0-4 2.5-6 6-11z" fill="#FFD27A" />
      </Svg>
    </MotionView>
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

export const hudIconTiming = {
  DURATION_UI: duration.ui,
  DURATION_CELEBRATE: duration.celebrate,
  STREAK_BREATH: 1600,
};
