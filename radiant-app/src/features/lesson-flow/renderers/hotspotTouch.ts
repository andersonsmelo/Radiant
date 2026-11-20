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

type Frame = { width: number; height: number };
type Box = { left: number; top: number; width: number; height: number };

const fits = (box: Box, frame: Frame) => box.left >= 0 && box.top >= 0 && box.left + box.width <= frame.width && box.top + box.height <= frame.height;
const clamp = (value: number, max: number) => Math.max(0, Math.min(value, max));

/**
 * Onde o selo fica no quadro (em pontos): FORA da região, para não esconder o objeto que ela mostra.
 * Ordem: acima (alinhado à borda esquerda, encostado), abaixo, à esquerda, à direita; só se nenhuma
 * couber inteira no quadro, dentro da região, como antes. Acima e abaixo escorregam na horizontal,
 * esquerda e direita na vertical, para nunca passar do quadro.
 * `offset` é a posição relativa à região, para o selo absoluto dentro dela.
 */
export function badgeBox(region: TouchTarget, frame: Frame) {
    const { width, height } = BADGE_SIZE;
    const regionLeft = region.x * frame.width;
    const regionTop = region.y * frame.height;
    const regionRight = regionLeft + (region.width ?? 0) * frame.width;
    const regionBottom = regionTop + (region.height ?? 0) * frame.height;
    const sideLeft = clamp(regionLeft, frame.width - width);
    const sideTop = clamp(regionTop, frame.height - height);
    const candidates: Box[] = [
        { left: sideLeft, top: regionTop - height, width, height },
        { left: sideLeft, top: regionBottom, width, height },
        { left: regionLeft - width, top: sideTop, width, height },
        { left: regionRight, top: sideTop, width, height },
    ];
    const outside = candidates.find(box => fits(box, frame));
    const { left, top } = outside ?? { left: sideLeft, top: sideTop };
    return { left, top, width, height, offset: { left: left - regionLeft - REGION_BORDER, top: top - regionTop - REGION_BORDER } };
}

/** Estilo do selo absoluto dentro da região, já mantido dentro do quadro. */
export function badgeStyle(region: TouchTarget, frame: { width: number; height: number }) {
    const { offset, width, height } = badgeBox(region, frame);
    return { position: 'absolute' as const, ...offset, width, height };
}

/** Lado do ponto que marca o alvo do `label`, em pontos: pequeno para não cobrir o que se rotula. */
export const LABEL_DOT = 12;

/**
 * Selo do número do `label`, em pontos no quadro: acima e à direita do ponto, encostado; se não couber,
 * abaixo e à direita, depois acima e à esquerda, depois abaixo e à esquerda. Sempre inteiro no quadro.
 */
export function labelBadgeBox(point: { x: number; y: number }, frame: Frame) {
    const { width, height } = BADGE_SIZE;
    const half = LABEL_DOT / 2;
    const cx = point.x * frame.width;
    const cy = point.y * frame.height;
    const candidates: Box[] = [
        { left: cx + half, top: cy - half - height, width, height },
        { left: cx + half, top: cy + half, width, height },
        { left: cx - half - width, top: cy - half - height, width, height },
        { left: cx - half - width, top: cy + half, width, height },
    ];
    // shortcut: ponto tão perto do centro de um quadro minúsculo que nada cabe cai no primeiro, preso ao quadro.
    const box = candidates.find(entry => fits(entry, frame)) ?? candidates[0];
    return { left: clamp(box.left, frame.width - width), top: clamp(box.top, frame.height - height), width, height };
}
