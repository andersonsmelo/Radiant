/**
 * Marcas de acerto e erro, e o fechar, desenhadas em código (viewBox 24).
 *
 * Substituem os caracteres ✓ ✗ ✕, que dependem da fonte do sistema e ignoram
 * os tokens. Três tons, luz de cima à esquerda: o lábio por baixo, a face e a
 * marca escura por cima (`onFill`).
 */
import React from 'react';
import Svg, { Circle, Path } from 'react-native-svg';
import { feedbackColors } from '../theme';

type VerdictIconProps = { verdict: 'correct' | 'incorrect'; size?: number; testID?: string };

const MARKS = {
  correct: 'M7 12.5 L10.5 16 L17 8.5',
  incorrect: 'M8 8 L16 16 M16 8 L8 16',
} as const;

// Decorativo: o veredito é dito por quem usa o ícone (rótulo ou valor acessível).
const HIDDEN = {
  accessible: false,
  accessibilityElementsHidden: true,
  importantForAccessibility: 'no-hide-descendants',
} as const;

export function VerdictIcon({ verdict, size = 24, testID }: VerdictIconProps) {
  const tones = verdict === 'correct' ? feedbackColors.success : feedbackColors.error;

  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" {...HIDDEN}>
      <Circle cx={12} cy={13.5} r={10} fill={tones.lip} />
      <Circle testID={testID} cx={12} cy={11.5} r={10} fill={tones.fill} />
      <Path d={MARKS[verdict]} stroke={tones.onFill} strokeWidth={2.6} strokeLinecap="round" strokeLinejoin="round" fill="none" />
    </Svg>
  );
}

export function CloseIcon({ size = 18, color, testID }: { size?: number; color?: string; testID?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" {...HIDDEN}>
      <Path testID={testID} d="M5 5 L19 19 M19 5 L5 19" stroke={color} strokeWidth={3} strokeLinecap="round" fill="none" />
    </Svg>
  );
}

// Marca de seleção, sem veredito: só o traço, na cor de quem a usa.
export function CheckIcon({ size = 18, color, testID }: { size?: number; color?: string; testID?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" {...HIDDEN}>
      <Path testID={testID} d={MARKS.correct} stroke={color} strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" fill="none" />
    </Svg>
  );
}
