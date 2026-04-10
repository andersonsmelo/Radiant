/**
 * Galaxy — tipos da hierarquia de conteúdo gamificada.
 *
 * Hierarquia:
 *   RadiantGalaxy  (tema grande: Anatomia, Física Radiológica…)
 *     └── CelestialBody  (subtema: Planeta Tórax, Estrela Coluna…)
 *           └── JourneyNode[]  (trilha de lições existente)
 */

import type { JourneyNode } from './journey';

// ── Tipos de superfície do planeta ──────────────────────────────
export type PlanetSurfaceType =
  | 'ice'       // azul cristalino — ex: Cabeça & Pescoço
  | 'jupiter'   // faixas laranja/vermelho — ex: Tórax
  | 'swamp'     // verde orgânico — ex: Abdômen
  | 'electric'  // violeta elétrico — ex: Neurologia
  | 'aqua'      // ciano suave — ex: Coluna Vertebral
  | 'lava';     // vermelho/laranja magma — ex: TC Crânio

export interface PlanetSurfaceConfig {
  type: PlanetSurfaceType;
  glowColor: string;      // cor do glow atmosférico
  atmosphereColor: string; // cor da atmosfera animada
}

// ── Corpo celeste (Planeta ou Estrela) ───────────────────────────
export type CelestialBodyType = 'planet' | 'star';
export type CelestialBodySize = 'sm' | 'md' | 'lg';
export type CelestialBodyStatus = 'locked' | 'available' | 'active' | 'completed';

export interface CelestialBody {
  id: string;
  galaxyId: string;
  title: string;
  bodyType: CelestialBodyType;
  size: CelestialBodySize;
  hasRing: boolean;
  surfaceConfig: PlanetSurfaceConfig;
  status: CelestialBodyStatus;
  /** Posição normalizada no mapa interior da galáxia (0–1) */
  mapPosition: { x: number; y: number };
  nodes: JourneyNode[];
}

// ── Galáxia (tema grande) ────────────────────────────────────────
export type GalaxyStatus = 'locked' | 'available' | 'active' | 'completed';

export interface RadiantGalaxy {
  id: string;
  title: string;
  emoji: string;
  /** Cor primária da nebula */
  colorPrimary: string;
  colorSecondary: string;
  status: GalaxyStatus;
  /** Posição normalizada no mapa global (0–1) */
  mapPosition: { x: number; y: number };
  /** Tamanho relativo da galáxia no mapa (px) */
  visualSize: number;
  bodies: CelestialBody[];
}

// ── Snapshot de progresso por galáxia ───────────────────────────
export interface GalaxyProgressSnapshot {
  galaxyId: string;
  totalBodies: number;
  completedBodies: number;
  activebody: CelestialBody | null;
  activeNode: import('./journey').JourneyNode | null;
}
