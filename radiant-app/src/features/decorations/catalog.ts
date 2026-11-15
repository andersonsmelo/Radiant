/**
 * Catálogo das decorações do perfil (F6 da 1.6, ADR 2026-11-15). Cosméticas: não
 * mudam o estudo, o XP nem as vidas. Toda cor sai de um token do tema e o selo é
 * desenhado em SVG (`DecorationArt.tsx`), sem asset binário.
 */
import { galaxyColors, medalColors } from '../../ui/theme';

export type DecorationSlot = 'moldura' | 'selo' | 'cartao';

/** Regra de desbloqueio lida do estado que o app já guarda. */
export type UnlockRule =
    | { kind: 'aulas'; count: number }
    | { kind: 'unidades'; count: number }
    | { kind: 'sequencia'; days: number }
    | { kind: 'missoes-do-dia' }
    | { kind: 'nivel'; level: number }
    | { kind: 'assinante' };

export type BadgeShape = 'faisca' | 'estrela' | 'escudo' | 'cometa';

type Art =
    | { type: 'moldura'; ring: string; inner?: string }
    | { type: 'selo'; shape: BadgeShape; fill: string; stroke: string }
    | { type: 'cartao'; background: string; border: string };

export type Decoration = { id: string; slot: DecorationSlot; name: string; description: string; rule: UnlockRule; art: Art };

export const DECORATIONS: readonly Decoration[] = [
    { id: 'moldura-aurora', slot: 'moldura', name: 'Aurora', description: 'Um anel azul em volta da sua inicial.',
        rule: { kind: 'aulas', count: 1 }, art: { type: 'moldura', ring: medalColors.unit.face } },
    { id: 'moldura-orbita', slot: 'moldura', name: 'Órbita', description: 'Dois anéis, como a sequência que segue.',
        rule: { kind: 'sequencia', days: 7 }, art: { type: 'moldura', ring: galaxyColors.streakColor, inner: galaxyColors.xpColor } },
    { id: 'moldura-nebulosa', slot: 'moldura', name: 'Nebulosa', description: 'Um anel prateado de quem já fechou unidades.',
        rule: { kind: 'unidades', count: 3 }, art: { type: 'moldura', ring: medalColors.silver.face } },
    { id: 'moldura-ouro', slot: 'moldura', name: 'Ouro', description: 'Um anel dourado do Radiant Ilimitado.',
        rule: { kind: 'assinante' }, art: { type: 'moldura', ring: medalColors.gold.face, inner: medalColors.gold.lip } },

    { id: 'selo-faisca', slot: 'selo', name: 'Faísca', description: 'Um raio ao lado do seu nome.',
        rule: { kind: 'sequencia', days: 3 }, art: { type: 'selo', shape: 'faisca', fill: galaxyColors.streakColor, stroke: galaxyColors.background } },
    { id: 'selo-estrela', slot: 'selo', name: 'Estrela', description: 'Para o dia em que as três missões fecharam.',
        rule: { kind: 'missoes-do-dia' }, art: { type: 'selo', shape: 'estrela', fill: medalColors.gold.face, stroke: medalColors.gold.lip } },
    { id: 'selo-escudo', slot: 'selo', name: 'Escudo', description: 'Para a primeira unidade inteira.',
        rule: { kind: 'unidades', count: 1 }, art: { type: 'selo', shape: 'escudo', fill: medalColors.unit.face, stroke: medalColors.unit.lip } },
    { id: 'selo-cometa', slot: 'selo', name: 'Cometa', description: 'Um cometa azul do Radiant Ilimitado.',
        rule: { kind: 'assinante' }, art: { type: 'selo', shape: 'cometa', fill: galaxyColors.navBlue, stroke: galaxyColors.background } },

    { id: 'cartao-noite', slot: 'cartao', name: 'Noite clara', description: 'Um cartão com borda acesa no topo do perfil.',
        rule: { kind: 'nivel', level: 3 }, art: { type: 'cartao', background: galaxyColors.surfaceActive, border: galaxyColors.borderActive } },
    { id: 'cartao-cometa', slot: 'cartao', name: 'Rastro azul', description: 'Um cartão com borda azul.',
        rule: { kind: 'unidades', count: 5 }, art: { type: 'cartao', background: galaxyColors.surfaceMuted, border: medalColors.unit.face } },
    { id: 'cartao-dourado', slot: 'cartao', name: 'Dourado', description: 'Um cartão com borda dourada do Radiant Ilimitado.',
        rule: { kind: 'assinante' }, art: { type: 'cartao', background: galaxyColors.surfaceMuted, border: medalColors.gold.face } },
];

export const DECORATION_SLOTS: readonly { slot: DecorationSlot; title: string }[] = [
    { slot: 'moldura', title: 'Moldura do avatar' },
    { slot: 'selo', title: 'Selo ao lado do nome' },
    { slot: 'cartao', title: 'Cartão do perfil' },
];
