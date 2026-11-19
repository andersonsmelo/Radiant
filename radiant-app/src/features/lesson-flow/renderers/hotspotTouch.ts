// Régua do alvo de toque sobre uma figura. Sem importar pacote: o verificador de
// conteúdo a carrega por `load-app-contract.cjs`, e o renderer usa a mesma conta.

/** Lado mínimo do alvo de toque, em pontos. */
export const TOUCH_MIN_PT = 44;
/** Largura em que o verificador mede a figura (a tela estreita comum). */
export const TOUCH_FIGURE_WIDTH_PT = 280;

export type TouchTarget = { x: number; y: number; width?: number; height?: number };
export type TouchRect = { left: number; top: number; width: number; height: number };

/** O retângulo de toque em pontos: o da região (ou o ponto) ampliado em torno do centro até 44 pt por eixo. */
export function touchRect(target: TouchTarget, frame: { width: number; height: number }): TouchRect {
    const width = Math.max((target.width ?? 0) * frame.width, TOUCH_MIN_PT);
    const height = Math.max((target.height ?? 0) * frame.height, TOUCH_MIN_PT);
    const centerX = (target.x + (target.width ?? 0) / 2) * frame.width;
    const centerY = (target.y + (target.height ?? 0) / 2) * frame.height;
    return { left: centerX - width / 2, top: centerY - height / 2, width, height };
}

/** Quanto o retângulo de toque passa da região em cada lado (o `hitSlop` do alvo): metade do que falta para 44 pt. */
export function touchSlop(target: TouchTarget, frame: { width: number; height: number }) {
    const sideX = Math.max(0, (TOUCH_MIN_PT - (target.width ?? 0) * frame.width) / 2);
    const sideY = Math.max(0, (TOUCH_MIN_PT - (target.height ?? 0) * frame.height) / 2);
    return { left: sideX, right: sideX, top: sideY, bottom: sideY };
}

/** Os dois retângulos têm área em comum? Encostar na borda não conta. */
export function touchRectsOverlap(a: TouchRect, b: TouchRect): boolean {
    const eps = 1e-9;
    return a.left < b.left + b.width - eps && b.left < a.left + a.width - eps
        && a.top < b.top + b.height - eps && b.top < a.top + a.height - eps;
}

/** O retângulo inteiro cabe na figura? */
export function touchRectInside(rect: TouchRect, frame: { width: number; height: number }): boolean {
    const eps = 1e-9;
    return rect.left >= -eps && rect.top >= -eps && rect.left + rect.width <= frame.width + eps && rect.top + rect.height <= frame.height + eps;
}

/** Selo do número (ou da marca) sobre a região, em pontos. */
export const BADGE_SIZE = { width: 36, height: 24 };

/** Borda da região, em pontos: o selo absoluto parte de dentro dela. */
const REGION_BORDER = 2;

/**
 * Onde o selo fica no quadro (em pontos): no canto da região, empurrado para dentro do quadro.
 * Região baixa ou na borda não o corta: ele pode passar da região, nunca do quadro.
 * `offset` é a posição relativa à região, para o selo absoluto dentro dela.
 */
export function badgeBox(region: TouchTarget, frame: { width: number; height: number }) {
    const regionLeft = region.x * frame.width;
    const regionTop = region.y * frame.height;
    const left = Math.max(0, Math.min(regionLeft, frame.width - BADGE_SIZE.width));
    const top = Math.max(0, Math.min(regionTop, frame.height - BADGE_SIZE.height));
    return { left, top, ...BADGE_SIZE, offset: { left: left - regionLeft - REGION_BORDER, top: top - regionTop - REGION_BORDER } };
}

/** Estilo do selo absoluto dentro da região, já mantido dentro do quadro. */
export function badgeStyle(region: TouchTarget, frame: { width: number; height: number }) {
    const { offset, width, height } = badgeBox(region, frame);
    return { position: 'absolute' as const, ...offset, width, height };
}
