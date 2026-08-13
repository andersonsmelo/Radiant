/**
 * galaxy-catalog.ts
 * Catálogo local de galáxias e corpos celestes para o MVP.
 * Estrutura: RadiantGalaxy[] → CelestialBody[] → JourneyNode[]
 */

import type { RadiantGalaxy } from '../types/galaxy';
import type { JourneyNode } from '../types/journey';
import { GALAXY_NODES_BY_BODY } from './galaxy-nodes';

/**
 * Nós de um corpo, vindos do módulo gerado a partir do mapa de taxonomia.
 *
 * A divisão é deliberada: qual lição pertence a qual planeta é **fato de
 * governança** e vem gerado; cor, superfície e posição no mapa são **decisão de
 * design** e continuam escritas à mão aqui. Manter o vínculo à mão nos dois
 * lugares foi o que produziu dois catálogos divergentes do mesmo universo.
 *
 * Devolve `[]` para corpo sem lição mapeada — planeta de interpretação, por
 * exemplo, cujo currículo ainda é `planned` na taxonomia.
 */
function nodesOf(bodyId: string): JourneyNode[] {
  return GALAXY_NODES_BY_BODY[bodyId] ?? [];
}

export const GALAXY_CATALOG: RadiantGalaxy[] = [
  // ═══════════════════════════════════════════════════════════
  // GALÁXIA 1 — ANATOMIA  (azul, ativa)
  // ═══════════════════════════════════════════════════════════
  {
    id: 'galaxy-anatomia',
    title: 'Anatomia',
    emoji: '🧬',
    colorPrimary: 'rgba(80, 120, 255, 0.45)',
    colorSecondary: 'rgba(40, 60, 200, 0.2)',
    status: 'active',
    mapPosition: { x: 0.2, y: 0.2 },
    visualSize: 80,
    bodies: [
      // ── Planeta Cabeça & Pescoço (concluído) ──────────────
      {
        id: 'planet-cabeca-pescoco',
        galaxyId: 'galaxy-anatomia',
        title: 'Cabeça & Pescoço',
        bodyType: 'planet',
        size: 'lg',
        hasRing: false,
        surfaceConfig: {
          type: 'ice',
          glowColor: 'rgba(120, 184, 255, 0.6)',
          atmosphereColor: 'rgba(120, 184, 255, 0.35)',
        },
        status: 'completed',
        mapPosition: { x: 0.18, y: 0.16 },
        nodes: [],
      },
      // ── Planeta Tórax (ativo) ─────────────────────────────
      {
        id: 'planet-torax',
        galaxyId: 'galaxy-anatomia',
        title: 'Tórax',
        bodyType: 'planet',
        size: 'lg',
        hasRing: true,
        surfaceConfig: {
          type: 'jupiter',
          glowColor: 'rgba(255, 107, 74, 0.7)',
          atmosphereColor: 'rgba(255, 107, 74, 0.4)',
        },
        status: 'active',
        mapPosition: { x: 0.62, y: 0.38 },
        nodes: [
          {
            id: 'node-torax-01',
            unitId: 'planet-torax',
            type: 'lesson',
            title: 'Introdução ao Tórax',
            status: 'completed',
          },
          {
            id: 'node-torax-02',
            unitId: 'planet-torax',
            type: 'lesson',
            title: 'Anatomia do Mediastino',
            status: 'completed',
          },
          {
            id: 'node-torax-03',
            unitId: 'planet-torax',
            type: 'lesson',
            title: 'Parênquima Pulmonar',
            lessonId: 'fundamentos-radiologia',
            blockId: 'block-01',
            status: 'active',
          },
          {
            id: 'node-torax-04',
            unitId: 'planet-torax',
            type: 'review',
            title: 'Revisar Unidade 1',
            status: 'locked',
          },
          {
            id: 'node-torax-05',
            unitId: 'planet-torax',
            type: 'lesson',
            title: 'Padrões Radiológicos',
            status: 'locked',
          },
          {
            id: 'node-torax-06',
            unitId: 'planet-torax',
            type: 'checkpoint',
            title: 'Checkpoint da Unidade',
            status: 'locked',
          },
          {
            id: 'node-torax-07',
            unitId: 'planet-torax',
            type: 'lesson',
            title: 'Pneumotórax — Caso 1',
            status: 'locked',
          },
          {
            id: 'node-torax-08',
            unitId: 'planet-torax',
            type: 'reward',
            title: 'Mestre do Tórax',
            status: 'locked',
          },
        ],
      },
      // ── Estrela Coluna Vertebral (disponível) ─────────────
      {
        id: 'star-coluna',
        galaxyId: 'galaxy-anatomia',
        title: 'Coluna Vertebral',
        bodyType: 'star',
        size: 'sm',
        hasRing: false,
        surfaceConfig: {
          type: 'aqua',
          glowColor: 'rgba(40, 200, 160, 0.5)',
          atmosphereColor: 'rgba(40, 200, 160, 0.3)',
        },
        status: 'available',
        mapPosition: { x: 0.2, y: 0.6 },
        nodes: [],
      },
      // ── Planeta Abdômen (bloqueado) ────────────────────────
      {
        id: 'planet-abdomen',
        galaxyId: 'galaxy-anatomia',
        title: 'Abdômen',
        bodyType: 'planet',
        size: 'md',
        hasRing: false,
        surfaceConfig: {
          type: 'swamp',
          glowColor: 'rgba(60, 140, 80, 0.4)',
          atmosphereColor: 'rgba(60, 140, 80, 0.25)',
        },
        status: 'locked',
        mapPosition: { x: 0.65, y: 0.7 },
        nodes: [],
      },
      // ── Estrela Membros (bloqueado) ───────────────────────
      {
        id: 'star-membros',
        galaxyId: 'galaxy-anatomia',
        title: 'Membros',
        bodyType: 'star',
        size: 'sm',
        hasRing: false,
        surfaceConfig: {
          type: 'electric',
          glowColor: 'rgba(160, 80, 255, 0.4)',
          atmosphereColor: 'rgba(160, 80, 255, 0.2)',
        },
        status: 'locked',
        mapPosition: { x: 0.42, y: 0.88 },
        nodes: [],
      },
    ],
  },

  // ═══════════════════════════════════════════════════════════
  // GALÁXIA 2 — FÍSICA RADIOLÓGICA  (laranja, disponível)
  // ═══════════════════════════════════════════════════════════
  {
    id: 'galaxy-fisica',
    title: 'Física Radiológica',
    emoji: '⚛️',
    colorPrimary: 'rgba(255, 120, 50, 0.35)',
    colorSecondary: 'rgba(200, 60, 20, 0.2)',
    status: 'active',
    mapPosition: { x: 0.65, y: 0.44 },
    visualSize: 68,
    bodies: [
      // ── Planeta Física da Radiação (4 lições) ─────────────
      {
        id: 'planet-fisica-da-radiacao',
        galaxyId: 'galaxy-fisica',
        title: 'Física da Radiação',
        bodyType: 'planet',
        size: 'lg',
        hasRing: false,
        surfaceConfig: {
          type: 'lava',
          glowColor: 'rgba(255, 140, 60, 0.6)',
          atmosphereColor: 'rgba(255, 140, 60, 0.3)',
        },
        status: 'available',
        mapPosition: { x: 0.32, y: 0.3 },
        nodes: nodesOf('planet-fisica-da-radiacao'),
      },
      // ── Planeta Produção e Proteção (2 lições) ────────────
      {
        id: 'planet-producao-e-protecao',
        galaxyId: 'galaxy-fisica',
        title: 'Produção e Proteção',
        bodyType: 'planet',
        size: 'md',
        hasRing: true,
        surfaceConfig: {
          type: 'electric',
          glowColor: 'rgba(255, 190, 90, 0.55)',
          atmosphereColor: 'rgba(255, 190, 90, 0.28)',
        },
        status: 'available',
        mapPosition: { x: 0.68, y: 0.62 },
        nodes: nodesOf('planet-producao-e-protecao'),
      },
    ],
  },

  // ═══════════════════════════════════════════════════════════
  // GALÁXIA 3 — CASOS CLÍNICOS  (verde, bloqueada)
  // ═══════════════════════════════════════════════════════════
  {
    id: 'galaxy-casos',
    title: 'Casos Clínicos',
    emoji: '🩻',
    colorPrimary: 'rgba(40, 180, 100, 0.3)',
    colorSecondary: 'rgba(20, 120, 60, 0.15)',
    status: 'locked',
    mapPosition: { x: 0.2, y: 0.72 },
    visualSize: 58,
    bodies: [],
  },

  // ═══════════════════════════════════════════════════════════
  // GALÁXIA 4 — TECNOLOGIA EM IMAGEM  (violeta, bloqueada)
  // ═══════════════════════════════════════════════════════════
  {
    id: 'galaxy-tecnologia',
    title: 'Tecnologia em Imagem',
    emoji: '🔬',
    colorPrimary: 'rgba(160, 80, 240, 0.25)',
    colorSecondary: 'rgba(100, 40, 180, 0.15)',
    status: 'active',
    mapPosition: { x: 0.72, y: 0.82 },
    visualSize: 66,
    bodies: [
      // ── Planeta Equipamento (3 lições) ────────────────────
      {
        id: 'planet-equipamento',
        galaxyId: 'galaxy-tecnologia',
        title: 'Equipamento',
        bodyType: 'planet',
        size: 'lg',
        hasRing: true,
        surfaceConfig: {
          type: 'ice',
          glowColor: 'rgba(180, 120, 255, 0.6)',
          atmosphereColor: 'rgba(180, 120, 255, 0.3)',
        },
        status: 'available',
        mapPosition: { x: 0.28, y: 0.26 },
        nodes: nodesOf('planet-equipamento'),
      },
      // ── Planeta Modalidades (3 lições) ────────────────────
      {
        id: 'planet-modalidades',
        galaxyId: 'galaxy-tecnologia',
        title: 'Modalidades',
        bodyType: 'planet',
        size: 'lg',
        hasRing: false,
        surfaceConfig: {
          type: 'electric',
          glowColor: 'rgba(150, 90, 255, 0.6)',
          atmosphereColor: 'rgba(150, 90, 255, 0.3)',
        },
        status: 'available',
        mapPosition: { x: 0.7, y: 0.36 },
        nodes: nodesOf('planet-modalidades'),
      },
      // ── Planeta Imagem na Prática (2 lições) ──────────────
      {
        id: 'planet-imagem-na-pratica',
        galaxyId: 'galaxy-tecnologia',
        title: 'Imagem na Prática',
        bodyType: 'planet',
        size: 'md',
        hasRing: false,
        surfaceConfig: {
          type: 'aqua',
          glowColor: 'rgba(120, 200, 255, 0.55)',
          atmosphereColor: 'rgba(120, 200, 255, 0.28)',
        },
        status: 'available',
        mapPosition: { x: 0.32, y: 0.68 },
        nodes: nodesOf('planet-imagem-na-pratica'),
      },
      // ── Planeta Profissão e Aplicações (2 lições) ─────────
      {
        id: 'planet-profissao-e-aplicacoes',
        galaxyId: 'galaxy-tecnologia',
        title: 'Profissão e Aplicações',
        bodyType: 'planet',
        size: 'md',
        hasRing: true,
        surfaceConfig: {
          type: 'swamp',
          glowColor: 'rgba(140, 220, 170, 0.55)',
          atmosphereColor: 'rgba(140, 220, 170, 0.28)',
        },
        status: 'available',
        mapPosition: { x: 0.72, y: 0.76 },
        nodes: nodesOf('planet-profissao-e-aplicacoes'),
      },
    ],
  },
];

/** Retorna galáxia por id */
export function getGalaxyById(id: string): RadiantGalaxy | undefined {
  return GALAXY_CATALOG.find((g) => g.id === id);
}

/** Retorna a galáxia ativa (primeira com status 'active') */
export function getActiveGalaxy(): RadiantGalaxy | undefined {
  return GALAXY_CATALOG.find((g) => g.status === 'active');
}

/** Retorna o corpo celeste ativo dentro de uma galáxia */
export function getActiveBody(galaxyId: string) {
  const galaxy = getGalaxyById(galaxyId);
  return galaxy?.bodies.find((b) => b.status === 'active') ?? null;
}
