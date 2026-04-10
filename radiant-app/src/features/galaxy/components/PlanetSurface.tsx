/**
 * PlanetSurface
 * Renderiza a superfície de um planeta via react-native-svg.
 * Cada tipo tem textura, bandas e detalhes únicos.
 */

import React from 'react';
import {
  Circle,
  ClipPath,
  Defs,
  Ellipse,
  G,
  RadialGradient,
  Rect,
  Stop,
  Svg,
} from 'react-native-svg';
import type { PlanetSurfaceType } from '../../../types/galaxy';

// ── Tipos ──────────────────────────────────────────────────────

interface PlanetSurfaceProps {
  type: PlanetSurfaceType;
  size: number;
}

// ── Configurações visuais por tipo ────────────────────────────

interface SurfaceConfig {
  baseGradient: [string, string, string]; // light, mid, dark
  bands: Array<{ y: number; h: number; color: string; opacity: number }>;
  spots?: Array<{ cx: number; cy: number; rx: number; ry: number; color: string; opacity: number }>;
  icecap?: { ry: number; opacity: number };
  craters?: Array<{ cx: number; cy: number; r: number; opacity: number }>;
}

const SURFACE_CONFIGS: Record<PlanetSurfaceType, SurfaceConfig> = {
  // Mundo de gelo cristalino — bandas azul-claro, calotas brancas
  ice: {
    baseGradient: ['#a8d4f5', '#4a90d4', '#0a2060'],
    bands: [
      { y: 0.25, h: 0.06, color: 'rgba(200,230,255,0.55)', opacity: 1 },
      { y: 0.40, h: 0.04, color: 'rgba(160,210,255,0.45)', opacity: 1 },
      { y: 0.55, h: 0.07, color: 'rgba(180,220,255,0.40)', opacity: 1 },
      { y: 0.68, h: 0.04, color: 'rgba(140,190,240,0.35)', opacity: 1 },
    ],
    icecap: { ry: 0.22, opacity: 0.78 },
    craters: [
      { cx: 0.32, cy: 0.42, r: 0.07, opacity: 0.25 },
      { cx: 0.65, cy: 0.55, r: 0.05, opacity: 0.2 },
      { cx: 0.45, cy: 0.68, r: 0.09, opacity: 0.18 },
    ],
  },
  // Estilo Júpiter — faixas atmosféricas laranja/vermelho, grande mancha
  jupiter: {
    baseGradient: ['#ff9060', '#d84010', '#3a0500'],
    bands: [
      { y: 0.10, h: 0.09, color: 'rgba(255,220,160,0.45)', opacity: 1 },
      { y: 0.22, h: 0.07, color: 'rgba(140,30,5,0.55)', opacity: 1 },
      { y: 0.32, h: 0.12, color: 'rgba(255,160,60,0.40)', opacity: 1 },
      { y: 0.46, h: 0.08, color: 'rgba(100,15,5,0.60)', opacity: 1 },
      { y: 0.57, h: 0.10, color: 'rgba(200,70,20,0.45)', opacity: 1 },
      { y: 0.70, h: 0.07, color: 'rgba(70,10,5,0.55)', opacity: 1 },
    ],
    spots: [
      // Grande Mancha Vermelha
      { cx: 0.62, cy: 0.52, rx: 0.16, ry: 0.10, color: 'rgba(255,60,10,0.75)', opacity: 1 },
      { cx: 0.64, cy: 0.52, rx: 0.10, ry: 0.06, color: 'rgba(255,130,50,0.6)', opacity: 1 },
      // Pequena tempestade
      { cx: 0.28, cy: 0.38, rx: 0.07, ry: 0.05, color: 'rgba(255,100,30,0.5)', opacity: 1 },
    ],
  },
  // Mundo orgânico — verde escuro, manchas de continentes
  swamp: {
    baseGradient: ['#5a9060', '#1e5428', '#061008'],
    bands: [
      { y: 0.28, h: 0.07, color: 'rgba(80,160,60,0.35)', opacity: 1 },
      { y: 0.45, h: 0.05, color: 'rgba(40,100,30,0.45)', opacity: 1 },
      { y: 0.60, h: 0.08, color: 'rgba(100,180,60,0.30)', opacity: 1 },
    ],
    spots: [
      { cx: 0.22, cy: 0.32, rx: 0.14, ry: 0.10, color: 'rgba(160,120,30,0.45)', opacity: 1 },
      { cx: 0.55, cy: 0.50, rx: 0.12, ry: 0.08, color: 'rgba(140,100,25,0.40)', opacity: 1 },
      { cx: 0.70, cy: 0.28, rx: 0.09, ry: 0.06, color: 'rgba(180,140,40,0.35)', opacity: 1 },
    ],
  },
  // Mundo elétrico — violeta/roxo, tempestades de energia
  electric: {
    baseGradient: ['#c060ff', '#6010c0', '#1a0440'],
    bands: [
      { y: 0.22, h: 0.06, color: 'rgba(200,120,255,0.45)', opacity: 1 },
      { y: 0.38, h: 0.05, color: 'rgba(60,10,140,0.55)', opacity: 1 },
      { y: 0.54, h: 0.07, color: 'rgba(180,80,255,0.40)', opacity: 1 },
    ],
    spots: [
      { cx: 0.30, cy: 0.30, rx: 0.10, ry: 0.07, color: 'rgba(220,180,255,0.55)', opacity: 1 },
      { cx: 0.62, cy: 0.55, rx: 0.08, ry: 0.05, color: 'rgba(255,200,255,0.45)', opacity: 1 },
      { cx: 0.45, cy: 0.70, rx: 0.06, ry: 0.04, color: 'rgba(200,140,255,0.40)', opacity: 1 },
    ],
  },
  // Mundo aquático — ciano suave, ondulações
  aqua: {
    baseGradient: ['#60e0c0', '#18a078', '#063020'],
    bands: [
      { y: 0.30, h: 0.05, color: 'rgba(120,255,200,0.45)', opacity: 1 },
      { y: 0.45, h: 0.04, color: 'rgba(10,140,90,0.50)', opacity: 1 },
      { y: 0.58, h: 0.06, color: 'rgba(100,240,180,0.40)', opacity: 1 },
      { y: 0.72, h: 0.04, color: 'rgba(20,160,110,0.45)', opacity: 1 },
    ],
    spots: [
      { cx: 0.25, cy: 0.35, rx: 0.12, ry: 0.08, color: 'rgba(60,220,160,0.35)', opacity: 1 },
      { cx: 0.68, cy: 0.60, rx: 0.09, ry: 0.06, color: 'rgba(40,200,140,0.30)', opacity: 1 },
    ],
  },
  // Mundo de lava — vermelho magma, fendas brilhantes
  lava: {
    baseGradient: ['#ff5010', '#a01800', '#300400'],
    bands: [
      { y: 0.20, h: 0.07, color: 'rgba(255,120,20,0.40)', opacity: 1 },
      { y: 0.35, h: 0.06, color: 'rgba(80,5,0,0.60)', opacity: 1 },
      { y: 0.50, h: 0.08, color: 'rgba(255,80,10,0.45)', opacity: 1 },
      { y: 0.65, h: 0.06, color: 'rgba(60,5,0,0.55)', opacity: 1 },
    ],
    spots: [
      { cx: 0.20, cy: 0.28, rx: 0.12, ry: 0.08, color: 'rgba(255,180,20,0.55)', opacity: 1 },
      { cx: 0.60, cy: 0.48, rx: 0.10, ry: 0.07, color: 'rgba(255,150,10,0.50)', opacity: 1 },
      { cx: 0.38, cy: 0.68, rx: 0.08, ry: 0.05, color: 'rgba(255,200,30,0.45)', opacity: 1 },
    ],
    craters: [
      { cx: 0.50, cy: 0.40, r: 0.08, opacity: 0.30 },
      { cx: 0.28, cy: 0.60, r: 0.06, opacity: 0.25 },
    ],
  },
};

// ── Componente ────────────────────────────────────────────────

export function PlanetSurface({ type, size }: PlanetSurfaceProps) {
  const r = size / 2;
  const cfg = SURFACE_CONFIGS[type];
  const [c1, c2, c3] = cfg.baseGradient;

  const gradId = `pg-${type}`;
  const clipId = `pc-${type}-${size}`;

  return (
    <Svg width={size} height={size} style={{ borderRadius: r }}>
      <Defs>
        {/* Gradiente radial da superfície */}
        <RadialGradient id={gradId} cx="38%" cy="32%" r="68%">
          <Stop offset="0%" stopColor={c1} />
          <Stop offset="45%" stopColor={c2} />
          <Stop offset="100%" stopColor={c3} />
        </RadialGradient>
        {/* Clip no círculo */}
        <ClipPath id={clipId}>
          <Circle cx={r} cy={r} r={r} />
        </ClipPath>
      </Defs>

      {/* Base */}
      <Circle cx={r} cy={r} r={r} fill={`url(#${gradId})`} />

      <G clipPath={`url(#${clipId})`}>
        {/* Bandas atmosféricas */}
        {cfg.bands.map((b, i) => (
          <Rect
            key={`band-${i}`}
            x={0}
            y={b.y * size}
            width={size}
            height={b.h * size}
            fill={b.color}
            opacity={b.opacity}
          />
        ))}

        {/* Manchas / spots */}
        {cfg.spots?.map((s, i) => (
          <Ellipse
            key={`spot-${i}`}
            cx={s.cx * size}
            cy={s.cy * size}
            rx={s.rx * size}
            ry={s.ry * size}
            fill={s.color}
            opacity={s.opacity}
          />
        ))}

        {/* Calota polar */}
        {cfg.icecap && (
          <Ellipse
            cx={r}
            cy={0}
            rx={r * 0.8}
            ry={cfg.icecap.ry * size}
            fill="rgba(240,250,255,0.85)"
            opacity={cfg.icecap.opacity}
          />
        )}

        {/* Crateras */}
        {cfg.craters?.map((c, i) => (
          <Circle
            key={`crater-${i}`}
            cx={c.cx * size}
            cy={c.cy * size}
            r={c.r * size}
            fill="rgba(0,0,0,0.25)"
            stroke="rgba(0,0,0,0.3)"
            strokeWidth={1}
            opacity={c.opacity}
          />
        ))}

        {/* Brilho de luz (sheen) — canto superior esquerdo */}
        <Ellipse
          cx={r * 0.58}
          cy={r * 0.44}
          rx={r * 0.34}
          ry={r * 0.22}
          fill="rgba(255,255,255,0.26)"
        />

        {/* Sombra de profundidade — canto inferior direito */}
        <Circle
          cx={r * 1.55}
          cy={r * 1.52}
          r={r * 0.90}
          fill="rgba(0,0,0,0.50)"
        />
      </G>
    </Svg>
  );
}
