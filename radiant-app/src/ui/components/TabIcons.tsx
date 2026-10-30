/**
 * Ícones da barra de abas — desenhados em código, no relevo do Medalhão.
 *
 * Ativa, a aba usa os três tons da unidade (`medalColors.unit`: face, lábio e
 * miolo); inativa, um tom só (`galaxyColors.tabBarInactive`), sem relevo. Os
 * traçados vêm da prancheta da trilha (viewBox 28). A borla dourada do capelo
 * da prancheta ficou de fora: a aba ativa tem os três tons da unidade e mais
 * nada.
 *
 * Tudo é `Path`, de propósito: o teste de cor consulta cada forma por tipo, e
 * um `Circle` escaparia dele. O ícone é decorativo — o rótulo da aba é o texto
 * visível, e um leitor de tela que lesse o desenho também repetiria o nome.
 */

import React from 'react';
import Svg, { Path } from 'react-native-svg';
import { galaxyColors, medalColors } from '../theme';

type TabIconProps = { focused: boolean; size?: number };

type Tones = { face: string; lip: string; inner: string };

function tonesFor(focused: boolean): Tones {
  if (!focused) {
    const flat = galaxyColors.tabBarInactive;
    return { face: flat, lip: flat, inner: flat };
  }
  return medalColors.unit;
}

function TabIconFrame({ size, children }: { size: number; children: React.ReactNode }) {
  return (
    <Svg
      width={size}
      height={size}
      viewBox="0 0 28 28"
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
    >
      {children}
    </Svg>
  );
}

// ── Estude — capelo ───────────────────────────────────────────
export function StudyTabIcon({ focused, size = 28 }: TabIconProps) {
  const { face, lip, inner } = tonesFor(focused);

  return (
    <TabIconFrame size={size}>
      <Path d="M14 5 L26 11 L14 17 L2 11Z" fill={face} />
      <Path d="M14 17 L26 11 L26 12.5 L14 18.5 L2 12.5 L2 11Z" fill={lip} />
      <Path d="M7 14 V19 C9.5 21.5 18.5 21.5 21 19 V14 L14 17.5Z" fill={inner} />
    </TabIconFrame>
  );
}

// ── Perfil — pessoa ───────────────────────────────────────────
export function ProfileTabIcon({ focused, size = 28 }: TabIconProps) {
  const { face, lip, inner } = tonesFor(focused);

  return (
    <TabIconFrame size={size}>
      <Path d="M9 9.5 a5 5 0 1 0 10 0 a5 5 0 1 0 -10 0Z" fill={face} />
      <Path d="M5 24 C5 17.5 9 15.5 14 15.5 C19 15.5 23 17.5 23 24Z" fill={lip} />
      <Path d="M5 22.5 C5 17 9 15.5 14 15.5 C19 15.5 23 17 23 22.5Z" fill={inner} />
    </TabIconFrame>
  );
}
