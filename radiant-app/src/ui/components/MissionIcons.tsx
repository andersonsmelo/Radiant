/**
 * Peça das missões do dia (viewBox 48): a medalha do Medalhão em miniatura.
 *
 * Círculo com lábio sólido, no azul da unidade em andamento e em ouro quando
 * concluída, com um glifo branco por tipo. Concluída, o glifo vira a marca de
 * feito. Decorativa: quem a usa diz o estado ao leitor de tela.
 */
import React from 'react';
import Svg, { Circle, Path } from 'react-native-svg';
import { medalColors, medalGlyphTones } from '../theme';
import type { MissionId } from '../../features/missions/services/DailyMissionsService';

export type MissionKind = 'aulas' | 'acertos' | 'meta';

const KINDS: Readonly<Record<MissionId, MissionKind>> = {
  'aula-1': 'aulas', 'aula-2': 'aulas', revisao: 'aulas', 'seguidas-5': 'acertos', 'acertos-10': 'acertos', meta: 'meta',
};

/** Tipo da peça a partir do identificador da missão; desconhecido usa `meta`. */
export function missionKind(id: string): MissionKind {
  return (KINDS as Readonly<Record<string, MissionKind>>)[id] ?? 'meta';
}

// Livro aberto, alvo (anéis e miolo) e raio; o feito é o mesmo traço do CheckIcon.
const GLYPHS: Record<MissionKind | 'done', string> = {
  aulas: 'M24 17 C20 14.5 16 14 12.5 14.5 V31 C16 30.5 20 31 24 33.5 C28 31 32 30.5 35.5 31 V14.5 C32 14 28 14.5 24 17 Z M24 17 V33.5',
  acertos: 'M24 12.5 A11.5 11.5 0 1 0 24 35.5 A11.5 11.5 0 1 0 24 12.5 Z M24 19 A5 5 0 1 0 24 29 A5 5 0 1 0 24 19 Z',
  meta: 'M26.5 11.5 L16 25.5 H23 L21.5 36.5 L32 22.5 H25 Z',
  done: 'M14.5 24.5 L21 31 L33.5 17',
};

const HIDDEN = {
  accessible: false,
  accessibilityElementsHidden: true,
  importantForAccessibility: 'no-hide-descendants',
} as const;

export function MissionIcon({ kind, done, size = 48 }: { kind: MissionKind; done: boolean; size?: number }) {
  const tones = done ? medalColors.gold : medalColors.unit;
  const stroked = done || kind === 'aulas' || kind === 'acertos';

  return (
    <Svg width={size} height={size} viewBox="0 0 48 48" {...HIDDEN}>
      <Circle cx={24} cy={27} r={21} fill={tones.lip} />
      <Circle cx={24} cy={24} r={21} fill={tones.face} />
      <Path
        d={GLYPHS[done ? 'done' : kind]}
        fill={stroked ? 'none' : medalGlyphTones.light}
        stroke={medalGlyphTones.light}
        strokeWidth={done ? 4 : 2.6}
        strokeLinecap="round"
        strokeLinejoin="round"
        fillRule="evenodd"
      />
    </Svg>
  );
}
