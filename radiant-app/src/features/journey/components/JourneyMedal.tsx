import React, { useId } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Svg, { ClipPath, Circle, Defs, Ellipse, G, Path } from 'react-native-svg';

import type { JourneyNode } from '../../../types/journey';
import type { LessonStars } from '../../quiz/services/resolveLessonStars';
import { ThemeIllustration, type IllustrationTheme } from '../../../ui/illustrations/ThemeIllustration';
import { MotionView, useMedalPulse } from '../../../ui/motion';
import { typography } from '../../../ui/styles';
import {
  depth,
  galaxyColors,
  medalColors,
  medalGlyphTones,
  medalStarTones,
} from '../../../ui/theme';

export type MedalState = 'done' | 'next' | 'locked';

/**
 * O estado visual da medalha. Concluído é ouro; o recomendado é a próxima
 * (azul, com anel); bloqueado é cinza. Disponível, em andamento, retomável e
 * revisão devida que NÃO são o recomendado também são azuis, só que sem anel:
 * podem ser abertos, mas o caminho aponta para outro.
 */
export function medalStateFor(node: Pick<JourneyNode, 'status'>, isRecommended: boolean): MedalState {
  if (node.status === 'completed') return 'done';
  if (isRecommended) return 'next';
  if (node.status === 'locked') return 'locked';
  return 'next';
}

type JourneyMedalProps = {
  node: Pick<JourneyNode, 'id' | 'type'>;
  theme: IllustrationTheme;
  state: MedalState;
  /** Liga o anel que pulsa. Só vale com `state="next"`. */
  pulsing: boolean;
  /** `undefined` não desenha estrela; 0 desenha as três apagadas. */
  stars?: LessonStars;
  /** O raio da medalha. Padrão 34 (30 na revisão). */
  size?: number;
  /** O número da unidade, que o checkpoint traz no miolo. */
  unitNumber?: number;
  /** Sem `onPress` a medalha é uma imagem com o rótulo, e não um botão. */
  onPress?: () => void;
  /** Padrão: bloqueada é desativada. */
  disabled?: boolean;
  /** `"<título>. <estado>."`: é o que os roteiros Maestro leem. */
  accessibilityLabel: string;
};

const DEFAULT_RADIUS = 34;
const REVIEW_RADIUS = 30;
const MIN_TOUCH_TARGET = 48;
// A prancheta desenha a medalha com raio 46; tudo o que não é fração do raio
// (brilhos, estrelas, glifos) vem dela e escala por `radius / BOARD_RADIUS`.
const BOARD_RADIUS = 46;
const INNER_RATIO = 37 / BOARD_RADIUS;
const ILLUSTRATION_RATIO = 0.72;
const RING_STROKE = 3;
// Entre o lábio e as estrelas, em unidades da prancheta.
const STAR_GAP = 6;

const STAR_PATH = 'M0,-9 L2.7,-3.2 L9,-2.6 L4.3,1.7 L5.6,8 L0,4.8 L-5.6,8 L-4.3,1.7 L-9,-2.6 L-2.7,-3.2 Z';
const STAR_SHINE_PATH = 'M-2.7,-3.2 L0,-9 L1.4,-6 Z';
// Os ícones de revisão (Material "refresh") e de conquista, em 24 × 24.
const REVIEW_PATH =
  'M17.65 6.35A7.958 7.958 0 0 0 12 4c-4.42 0-7.99 3.58-7.99 8s3.57 8 7.99 8c3.73 0 6.84-2.55 7.73-6h-2.08A5.99 5.99 0 0 1 12 18c-3.31 0-6-2.69-6-6s2.69-6 6-6c1.66 0 3.14.69 4.22 1.78L13 11h7V4l-2.35 2.35z';

type Palette = { face: string; lip: string; inner: string };
type GlyphTones = { face: string; shade: string; light: string; ink: string };

function paletteFor(type: JourneyNode['type'], state: MedalState): Palette {
  if (state === 'locked') return medalColors.locked;
  if (type === 'checkpoint') return medalColors.silver;
  if (type === 'reward') return medalColors.gold;
  return state === 'done' ? medalColors.gold : medalColors.unit;
}

// Bloqueado desenha o glifo numa cor só, a da silhueta da ilustração.
function glyphTonesFor(state: MedalState): GlyphTones {
  if (state === 'locked') {
    const tone = medalColors.locked.silhouette;
    return { face: tone, shade: tone, light: tone, ink: tone };
  }
  return medalGlyphTones;
}

function starsValue(stars: LessonStars): string {
  return `${stars} ${stars === 1 ? 'estrela' : 'estrelas'}`;
}

function Star({ x, y, on }: { x: number; y: number; on: boolean }) {
  const tone = on ? medalStarTones.on : medalStarTones.off;
  return (
    <G testID={on ? 'journey-medal-star-on' : 'journey-medal-star-off'} transform={`translate(${x} ${y})`}>
      <Path
        testID={on ? 'journey-medal-star-on-shape' : 'journey-medal-star-off-shape'}
        d={STAR_PATH}
        fill={tone.face}
        stroke={tone.edge}
        strokeWidth={1.6}
        strokeLinejoin="round"
      />
      {on ? <Path d={STAR_SHINE_PATH} fill={medalStarTones.on.light} /> : null}
    </G>
  );
}

/** As três estrelas, em arco, na forma da prancheta (raio interno 0,45). */
function StarRow({ count, scale }: { count: number; scale: number }) {
  return (
    <Svg
      width={66 * scale}
      height={24 * scale}
      viewBox="-33 -10 66 24"
      style={{ marginTop: STAR_GAP * scale }}
    >
      {[0, 1, 2].map((index) => (
        <Star key={index} x={-22 + index * 22} y={index === 1 ? 4 : 0} on={index < count} />
      ))}
    </Svg>
  );
}

/** O ícone de revisão, em três tons: sombra, face e um brilho no ombro. */
function ReviewGlyph({ tones }: { tones: GlyphTones }) {
  return (
    <G testID="journey-medal-review-glyph" transform="scale(1.7) translate(-12 -12)">
      <Path d={REVIEW_PATH} fill={tones.shade} transform="translate(0 1.2)" />
      <Path d={REVIEW_PATH} fill={tones.face} />
      <Ellipse cx={6.6} cy={9.8} rx={1.5} ry={0.9} fill={tones.light} transform="rotate(-60 6.6 9.8)" />
    </G>
  );
}

/** A estrela da conquista, em três tons como as estrelas da lição. */
function RewardGlyph({ tones }: { tones: GlyphTones }) {
  return (
    <G testID="journey-medal-reward-glyph" transform="scale(2.3)">
      <Path d={STAR_PATH} fill={tones.shade} transform="translate(0 0.9)" />
      <Path d={STAR_PATH} fill={tones.face} />
      <Path d={STAR_SHINE_PATH} fill={tones.light} />
    </G>
  );
}

export function JourneyMedal({
  node,
  theme,
  state,
  pulsing,
  stars,
  size,
  unitNumber,
  onPress,
  disabled,
  accessibilityLabel,
}: JourneyMedalProps) {
  const radius = size ?? (node.type === 'review' ? REVIEW_RADIUS : DEFAULT_RADIUS);
  const scale = radius / BOARD_RADIUS;
  const diameter = radius * 2;
  const palette = paletteFor(node.type, state);
  const tones = glyphTonesFor(state);
  const showRing = pulsing && state === 'next';
  const ringStyle = useMedalPulse(showRing);
  const clipId = useId().replace(/[^A-Za-z0-9_-]/g, '');
  const isDisabled = disabled ?? state === 'locked';
  const interactive = onPress !== undefined;
  const accessibilityValue = stars === undefined ? undefined : { text: starsValue(stars) };

  const hiddenFromReader = {
    accessibilityElementsHidden: true,
    importantForAccessibility: 'no-hide-descendants',
  } as const;

  const body = (
    <>
      <View style={{ width: diameter, height: diameter + depth.medalLip }}>
        {showRing ? (
          <MotionView
            testID="journey-medal-pulse-ring"
            pointerEvents="none"
            {...hiddenFromReader}
            style={[
              styles.ring,
              {
                width: diameter,
                height: diameter,
                borderRadius: radius,
                borderColor: medalColors.unit.face,
              },
              ringStyle,
            ]}
          />
        ) : null}

        <Svg
          width={diameter}
          height={diameter + depth.medalLip}
          viewBox={`${-radius} ${-radius} ${diameter} ${diameter + depth.medalLip}`}
        >
          <Circle cy={depth.medalLip} r={radius} fill={palette.lip} />
          <Circle r={radius} fill={palette.face} />
          <Defs>
            <ClipPath id={clipId}>
              <Circle r={radius} />
            </ClipPath>
          </Defs>
          {/* Duas faixas de luz na diagonal, recortadas pela face. */}
          <G clipPath={`url(#${clipId})`} opacity={state === 'locked' ? 0.25 : 1}>
            <G transform={`scale(${scale})`}>
              <Path d="M-60,30 L30,-60 L44,-60 L-46,30 Z" fill={medalGlyphTones.light} opacity={0.16} />
              <Path d="M-48,44 L42,-46 L48,-46 L-42,44 Z" fill={medalGlyphTones.light} opacity={0.12} />
            </G>
          </G>
          <Circle r={radius * INNER_RATIO} fill={palette.inner} />
          <G transform={`scale(${scale})`}>
            <Path
              d="M-37,0 A37,37 0 0,1 37,0 A37,33 0 0,0 -37,0 Z"
              fill={galaxyColors.shadowHard}
              opacity={0.1}
            />
            {node.type === 'review' ? <ReviewGlyph tones={tones} /> : null}
            {node.type === 'reward' ? <RewardGlyph tones={tones} /> : null}
          </G>
        </Svg>

        {node.type === 'lesson' ? (
          <View
            pointerEvents="none"
            {...hiddenFromReader}
            style={[styles.overlay, { width: diameter, height: diameter }]}
          >
            <View style={{ transform: [{ translateY: -3 * scale }] }}>
              <ThemeIllustration theme={theme} state={state} size={diameter * ILLUSTRATION_RATIO} />
            </View>
          </View>
        ) : null}

        {node.type === 'checkpoint' && unitNumber !== undefined ? (
          <View
            pointerEvents="none"
            {...hiddenFromReader}
            style={[styles.overlay, { width: diameter, height: diameter }]}
          >
            <Text
              allowFontScaling={false}
              style={[
                typography.h3,
                { fontSize: radius * 0.8, lineHeight: radius * 1.0, color: tones.ink },
              ]}
            >
              {unitNumber}
            </Text>
          </View>
        ) : null}
      </View>

      {stars !== undefined ? <StarRow count={stars} scale={scale} /> : null}
    </>
  );

  if (!interactive) {
    return (
      <View
        accessible
        accessibilityRole="image"
        accessibilityLabel={accessibilityLabel}
        accessibilityValue={accessibilityValue}
        style={styles.target}
      >
        {body}
      </View>
    );
  }

  return (
    <Pressable
      onPress={onPress}
      disabled={isDisabled}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      accessibilityValue={accessibilityValue}
      accessibilityState={{ disabled: isDisabled }}
      style={styles.target}
    >
      {body}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  // O alvo de toque nunca fica abaixo de 48 × 48, mesmo com a medalha pequena.
  target: {
    minWidth: MIN_TOUCH_TARGET,
    minHeight: MIN_TOUCH_TARGET,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ring: {
    position: 'absolute',
    top: 0,
    left: 0,
    borderWidth: RING_STROKE,
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
