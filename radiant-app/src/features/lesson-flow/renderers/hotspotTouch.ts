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

/** Selo do número (ou da marca) junto da região, em pontos. */
export const BADGE_SIZE = { width: 36, height: 24 };

/** Faixa que o selo também deixa livre em volta da área de toque dos OUTROS alvos, em pontos. */
const TOUCH_MARGIN = 4;

type Frame = { width: number; height: number };
type Box = { left: number; top: number; width: number; height: number };

const fits = (box: Box, frame: Frame) => box.left >= 0 && box.top >= 0 && box.left + box.width <= frame.width && box.top + box.height <= frame.height;
const clamp = (value: number, max: number) => Math.max(0, Math.min(value, max));
const grow = (box: Box, by: number): Box => ({ left: box.left - by, top: box.top - by, width: box.width + 2 * by, height: box.height + 2 * by });
const overlapArea = (a: Box, b: Box) =>
    Math.max(0, Math.min(a.left + a.width, b.left + b.width) - Math.max(a.left, b.left))
    * Math.max(0, Math.min(a.top + a.height, b.top + b.height) - Math.max(a.top, b.top));
const areaOn = (box: Box, others: Box[]) => others.reduce((sum, other) => sum + overlapArea(box, other), 0);

/**
 * Escolhe a posição do selo de um item entre as candidatas, já na ordem de preferência. Três áreas a evitar,
 * da mais grave à menos: selo já posto, o que os OUTROS alvos mostram (região ou ponto) e a área de toque de
 * 44 pt dos outros alvos (com uma faixa de 4 pt em volta). Vale a candidata de menor área, nessa ordem de gravidade;
 * a primeira livre das três ganha, e o empate fica com a mais cedo na ordem.
 */
function pick(candidates: Box[], placed: Box[], structures: Box[], touches: Box[]): Box {
    const score = (box: Box) => [areaOn(box, placed), areaOn(box, structures), areaOn(box, touches)];
    const lower = (a: number[], b: number[]) => {
        for (let i = 0; i < a.length; i += 1) if (a[i] !== b[i]) return a[i] < b[i];
        return false;
    };
    let best = candidates[0];
    let bestScore = score(best);
    for (const box of candidates.slice(1)) {
        const current = score(box);
        if (lower(current, bestScore)) { best = box; bestScore = current; }
    }
    return best;
}

/**
 * Onde os selos de um item ficam no quadro (em pontos), um por região, na ordem dos índices: FORA da
 * região, para não esconder o objeto que ela mostra. Para cada região, a ordem de preferência é acima
 * (alinhado à esquerda, depois à direita), abaixo (idem), à esquerda (no alto, depois embaixo), à direita (idem),
 * e `pick` escolhe, entre as que cabem no quadro, a que não pisa em selo já posto, em outra região nem na
 * área de toque de outra região. Só se nenhuma couber inteira no quadro, o selo fica dentro da região.
 * O selo é um irmão da região (não filho): a caixa dele está fora da dela, e o toque nele seleciona a região dona.
 */
export function badgeBoxes(regions: TouchTarget[], frame: Frame) {
    const { width, height } = BADGE_SIZE;
    const rects: Box[] = regions.map(region => ({ left: region.x * frame.width, top: region.y * frame.height, width: (region.width ?? 0) * frame.width, height: (region.height ?? 0) * frame.height }));
    const touches: Box[] = regions.map(region => grow(touchRect(region, frame), TOUCH_MARGIN));
    const placed: Box[] = [];
    return regions.map((_, index) => {
        const r = rects[index];
        const alignedLeft = clamp(r.left, frame.width - width);
        const alignedRight = clamp(r.left + r.width - width, frame.width - width);
        const alignedTop = clamp(r.top, frame.height - height);
        const alignedBottom = clamp(r.top + r.height - height, frame.height - height);
        // Oito posições, sempre encostadas na região: acima, abaixo, à esquerda, à direita, cada uma
        // alinhada a um dos dois cantos; o que escorrega para caber no quadro continua encostado.
        const outside = ([
            { left: alignedLeft, top: r.top - height },
            { left: alignedRight, top: r.top - height },
            { left: alignedLeft, top: r.top + r.height },
            { left: alignedRight, top: r.top + r.height },
            { left: r.left - width, top: alignedTop },
            { left: r.left - width, top: alignedBottom },
            { left: r.left + r.width, top: alignedTop },
            { left: r.left + r.width, top: alignedBottom },
        ] as { left: number; top: number }[]).map(at => ({ ...at, width, height })).filter(box => fits(box, frame));
        const others = (list: Box[]) => list.filter((_, other) => other !== index);
        const box = outside.length
            ? pick(outside, placed, others(rects), others(touches))
            : { left: alignedLeft, top: alignedTop, width, height };
        placed.push(box);
        return box;
    });
}

/** O selo de uma região sozinha. */
export function badgeBox(region: TouchTarget, frame: Frame) {
    return badgeBoxes([region], frame)[0];
}

/** Estilo do selo: absoluto no quadro da figura, na caixa que `badgeBoxes` ou `labelBadgeBoxes` devolveu. */
export function badgeStyle(box: Box) {
    return { position: 'absolute' as const, left: box.left, top: box.top, width: box.width, height: box.height };
}

/** Lado do ponto que marca o alvo do `label`, em pontos: pequeno para não cobrir o que se rotula. */
export const LABEL_DOT = 12;

/**
 * Selos do número do `label`, um por ponto, na ordem dos índices: acima e à direita do ponto, encostado;
 * se não couber ou pisar em selo já posto, em outro ponto ou na área de toque de 44 pt de outro ponto, abaixo e à
 * direita, acima e à esquerda, abaixo e à esquerda, depois acima e abaixo alinhados a cada canto do ponto
 * (escolha de `pick`). Sempre inteiro no quadro.
 */
export function labelBadgeBoxes(points: { x: number; y: number }[], frame: Frame) {
    const { width, height } = BADGE_SIZE;
    const half = LABEL_DOT / 2;
    const dots: Box[] = points.map(point => ({ left: point.x * frame.width - half, top: point.y * frame.height - half, width: LABEL_DOT, height: LABEL_DOT }));
    const touches: Box[] = points.map(point => grow(touchRect(point, frame), TOUCH_MARGIN));
    const placed: Box[] = [];
    return points.map((point, index) => {
        const cx = point.x * frame.width;
        const cy = point.y * frame.height;
        const all = ([
            { left: cx + half, top: cy - half - height },
            { left: cx + half, top: cy + half },
            { left: cx - half - width, top: cy - half - height },
            { left: cx - half - width, top: cy + half },
            // Alinhados a um canto do ponto, acima e abaixo.
            { left: cx - half, top: cy - half - height },
            { left: cx + half - width, top: cy - half - height },
            { left: cx - half, top: cy + half },
            { left: cx + half - width, top: cy + half },
        ] as { left: number; top: number }[]).map(at => ({ ...at, width, height }));
        const inside = all.filter(box => fits(box, frame));
        const others = (list: Box[]) => list.filter((_, other) => other !== index);
        // shortcut: quadro tão pequeno que nada cabe cai no primeiro, preso ao quadro.
        const chosen = inside.length ? pick(inside, placed, others(dots), others(touches)) : all[0];
        const box = { left: clamp(chosen.left, frame.width - width), top: clamp(chosen.top, frame.height - height), width, height };
        placed.push(box);
        return box;
    });
}

/** O selo de um ponto sozinho. */
export function labelBadgeBox(point: { x: number; y: number }, frame: Frame) {
    return labelBadgeBoxes([point], frame)[0];
}
