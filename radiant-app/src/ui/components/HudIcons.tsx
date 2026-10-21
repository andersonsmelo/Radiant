/**
 * Ícones do HUD — vetor animado em código.
 *
 * Substituem o emoji do sistema (⚡ 🔥 ❤️ 🤍), que ignorava token de cor,
 * renderizava ao gosto do SO e era o objeto mais saturado da Home — mais forte
 * que o próprio CTA. O DESIGN.md proíbe emoji como ícone por escrito.
 *
 * Por que código e não Rive/Lottie: estes três ficam montados no HUD em nove
 * telas. Instanciar um runtime de animação por glifo pequeno para produzir um
 * pulso de escala é custo permanente sem retorno. Rive fica reservado ao Pixel,
 * onde a interpolação de forma compensa.
 *
 * Cada ícone tem um PAPEL de movimento distinto, e a diferença é intencional:
 * o XP celebra um evento, a chama sinaliza um estado vivo, o coração encena uma
 * perda. Movimento uniforme nos três diria que os três significam a mesma coisa.
 *
 * Desenho: os traçados são os da prancheta da trilha Medalhão (viewBox 24),
 * em três tons. O viewBox de 52 e as origens das animações não mudaram; um
 * `G` com `transform` assenta o traçado de 24 dentro deles. As cores novas
 * vivem em `hudIconTones` (theme.ts).
 */

import React from 'react';
import Svg, { Circle, Ellipse, G, Path } from 'react-native-svg';
import { galaxyColors, hudIconTones } from '../theme';
import {
  duration,
  MotionSvgGroup,
  MotionSvgPath,
  MotionView,
  useBreathingScale,
  useEventCelebrationScale,
  useHeartLossAnimation,
} from '../motion';

type IconProps = { size?: number; testID?: string };

// ── XP — celebra o ganho ──────────────────────────────────────
// Assenta o traçado de 24 do raio dentro do anel de fagulhas do viewBox de 52.
const BOLT_PLACEMENT = 'translate(26 26) scale(1.6) translate(-12 -12)';

export function XpIcon({ size = 24, value = 0 }: IconProps & { value?: number }) {
  const { animatedProps, rayAnimatedProps } = useEventCelebrationScale(value);
  const { face, light, shade } = hudIconTones.bolt;

  return (
    <Svg width={size} height={size} viewBox="0 0 52 52">
      <MotionSvgGroup animatedProps={rayAnimatedProps} fill={face}>
        <Circle testID="hud-xp-ray-0" cx={26} cy={6} r={2} />
        <Circle testID="hud-xp-ray-1" cx={46} cy={26} r={2} />
        <Circle testID="hud-xp-ray-2" cx={26} cy={46} r={2} />
        <Circle testID="hud-xp-ray-3" cx={6} cy={26} r={2} />
      </MotionSvgGroup>
      <MotionSvgGroup animatedProps={animatedProps}>
        <G transform={BOLT_PLACEMENT}>
          <Path d="M13.5 2 L4.5 13.5 H11 L9.5 22 L19.5 9.5 H13 Z" fill={face} />
          <Path d="M13.5 2 L11.2 9.5 H19.5 L13 9.5 Z" fill={light} />
          <Path d="M11 13.5 L9.5 22 L14.5 15.8 Z" fill={shade} />
        </G>
      </MotionSvgGroup>
    </Svg>
  );
}

// ── Sequência — respira em repouso ────────────────────────────
const FLAME_PLACEMENT = 'translate(26 24) scale(1.9) translate(-12 -11)';

export function StreakIcon({ size = 24 }: IconProps) {
  const { animatedStyle } = useBreathingScale();

  return (
    <MotionView style={animatedStyle}>
      <Svg width={size} height={size} viewBox="0 0 52 52">
        <G transform={FLAME_PLACEMENT}>
          <Path
            d="M12 2 C13 6 18 8 18 14 A6 6 0 0 1 6 14 C6 10 9 9 9 5 C10.5 6 11.5 7 12 2Z"
            fill={galaxyColors.streakColor}
          />
          <Path
            d="M12 10 C12.6 12.5 15 13 15 16 A3 3 0 0 1 9 16 C9 14 10.5 13 12 10Z"
            fill={hudIconTones.flame.core}
          />
        </G>
      </Svg>
    </MotionView>
  );
}

// ── Vida — o preenchimento é o estado ─────────────────────────
const HEART_PLACEMENT = 'translate(26 26) scale(1.8) translate(-12 -12.4)';
const HEART_BODY =
  'M12 21 C5 16 2.5 12.5 2.5 8.8 A4.8 4.8 0 0 1 12 6.6 A4.8 4.8 0 0 1 21.5 8.8 C21.5 12.5 19 16 12 21Z';

export function HeartIcon({
  size = 28,
  filled,
  losing = false,
  testID,
}: IconProps & { filled: boolean; losing?: boolean }) {
  const { groupAnimatedProps, fillAnimatedProps, crackAnimatedProps } =
    useHeartLossAnimation(filled, losing);
  // A cor cheia contra o vazio é o canal visual do estado. O canal de leitor de
  // tela é o rótulo agregado do HUD ("3 de 5 vidas") — os dois existem, e nenhum
  // depende do outro. Cor sozinha nunca carrega informação neste projeto.
  const { face, shade, highlight } = hudIconTones.heart;
  return (
    <Svg width={size} height={size} viewBox="0 0 52 52">
      <MotionSvgGroup animatedProps={groupAnimatedProps}>
        <G transform={HEART_PLACEMENT}>
          {/* Fundo animado: leva o preenchimento do vermelho ao vazio na perda.
              Com a vida cheia fica por baixo do desenho de três tons, que o
              cobre; na perda, o desenho some e este fundo drena. */}
          <MotionSvgPath
            animatedProps={fillAnimatedProps}
            testID={testID}
            d={HEART_BODY}
            fill={filled ? face : galaxyColors.heartEmpty}
          />
          {filled ? (
            <>
              <Path d={HEART_BODY} fill={face} />
              <Path d="M12 21 C17 17.5 19.8 14.5 21 11.2 C20 15 17 18 12 21Z" fill={shade} />
              <Ellipse
                cx={7.6}
                cy={8.6}
                rx={2.2}
                ry={1.5}
                rotation={-30}
                origin="7.6, 8.6"
                fill={highlight}
              />
            </>
          ) : null}
        </G>
        <MotionSvgPath
          animatedProps={crackAnimatedProps}
          testID={testID?.replace('fill', 'crack')}
          d="M26 14 l-4 9 l6 4 l-4 8"
          stroke={galaxyColors.background}
          strokeWidth={2.5}
          fill="none"
          strokeLinecap="round"
        />
      </MotionSvgGroup>
    </Svg>
  );
}

export const hudIconTiming = {
  DURATION_UI: duration.ui,
  DURATION_CELEBRATE: duration.celebrate,
  STREAK_BREATH: 1600,
};
