/**
 * GalaxyBlob
 * Renderiza uma galáxia espiral usando react-native-svg.
 * Cada galáxia tem cor primária única e braços estelares.
 */

import React, { useMemo } from 'react';
import {
  Circle,
  ClipPath,
  Defs,
  G,
  RadialGradient,
  Stop,
  Svg,
} from 'react-native-svg';

// ── Tipos ──────────────────────────────────────────────────────

interface GalaxyBlobProps {
  size: number;
  colorPrimary: string; // ex: '#6090ff'
  colorCore?: string;   // ex: '#ffffff' (padrão branco)
  starCount?: number;   // estrelas por braço
}

// ── Gerador de braço espiral ───────────────────────────────────

interface SpaceParticle {
  cx: number;
  cy: number;
  r: number;
  opacity: number;
}

function generateSpiralArm(
  cx: number,
  cy: number,
  radius: number,
  armAngleOffset: number,
  count: number,
  seed: number,
): SpaceParticle[] {
  const rng = (s: number) => {
    const x = Math.sin(s) * 10000;
    return x - Math.floor(x);
  };

  const particles: SpaceParticle[] = [];
  for (let i = 0; i < count; i++) {
    const t = i / count;
    // espiral logarítmica
    const angle = armAngleOffset + t * Math.PI * 2.8;
    const r = t * radius * 0.9;
    // adiciona ruído posicional
    const noise = (rng(seed + i * 7) - 0.5) * radius * 0.18;
    const noiseA = (rng(seed + i * 13) - 0.5) * 0.4;
    const px = cx + Math.cos(angle + noiseA) * (r + noise);
    const py = cy + Math.sin(angle + noiseA) * (r + noise);
    // só inclui se dentro do círculo
    const dist = Math.sqrt((px - cx) ** 2 + (py - cy) ** 2);
    if (dist > radius) continue;

    const opacity = (1 - t * 0.7) * (0.5 + rng(seed + i * 3) * 0.5);
    const dotSize = rng(seed + i * 11) < 0.5 ? 0.6 : rng(seed + i * 17) < 0.5 ? 1.0 : 1.5;

    particles.push({ cx: px, cy: py, r: dotSize, opacity });
  }
  return particles;
}

// ── Componente ────────────────────────────────────────────────

export function GalaxyBlob({
  size,
  colorPrimary,
  colorCore = '#ffffff',
  starCount = 55,
}: GalaxyBlobProps) {
  const r = size / 2;
  const gradId = `gg-${size}-${colorPrimary.replace(/[^a-z0-9]/gi, '')}`;
  const clipId = `gc-${size}-${colorPrimary.replace(/[^a-z0-9]/gi, '')}`;

  // Gera os braços da espiral
  const particles = useMemo(() => {
    const arms = 3;
    const result: SpaceParticle[] = [];
    for (let arm = 0; arm < arms; arm++) {
      const offset = (arm / arms) * Math.PI * 2;
      result.push(...generateSpiralArm(r, r, r * 0.92, offset, starCount, arm * 1000 + size));
    }
    return result;
  }, [r, starCount, size]);

  return (
    <Svg width={size} height={size} style={{ borderRadius: r }}>
      <Defs>
        <RadialGradient id={gradId} cx="50%" cy="50%" r="50%">
          <Stop offset="0%" stopColor={colorCore} stopOpacity={0.9} />
          <Stop offset="20%" stopColor={colorCore} stopOpacity={0.35} />
          <Stop offset="50%" stopColor={colorPrimary} stopOpacity={0.7} />
          <Stop offset="100%" stopColor={colorPrimary} stopOpacity={0.15} />
        </RadialGradient>
        <ClipPath id={clipId}>
          <Circle cx={r} cy={r} r={r} />
        </ClipPath>
      </Defs>

      {/* Base escura */}
      <Circle cx={r} cy={r} r={r} fill="rgba(5,5,20,0.95)" />

      <G clipPath={`url(#${clipId})`}>
        {/* Partículas dos braços estelares */}
        {particles.map((p, i) => (
          <Circle
            key={`gp-${i}`}
            cx={p.cx}
            cy={p.cy}
            r={p.r}
            fill="#ffffff"
            opacity={p.opacity}
          />
        ))}

        {/* Glow do núcleo central */}
        <Circle cx={r} cy={r} r={r * 0.55} fill={`url(#${gradId})`} />

        {/* Núcleo brilhante */}
        <Circle cx={r} cy={r} r={r * 0.12} fill={colorCore} opacity={0.9} />
        <Circle cx={r} cy={r} r={r * 0.06} fill="#ffffff" opacity={1} />
      </G>
    </Svg>
  );
}
