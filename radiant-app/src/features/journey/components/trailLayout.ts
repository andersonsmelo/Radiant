import type { JourneyNode } from '../../../types/journey';

/**
 * As medidas da trilha de medalhas, tiradas da prancheta de 2026-10-21
 * (`docs/design/2026-10-21-trilha-medalhao.html`, `seg()` e a lista `nodes`).
 */

/** Raio da medalha concluída e da bloqueada. */
export const MEDAL_RADIUS = 34;
/** Raio da próxima: ela é a maior da trilha. */
export const NEXT_MEDAL_RADIUS = 40;
/** Raio da revisão, o padrão da `JourneyMedal` para ela. */
export const REVIEW_MEDAL_RADIUS = 30;

/**
 * Os nós alternam entre esquerda e direita, a 35% da meia-largura do centro:
 * é a posição dos nós na prancheta (x 112 e 230 numa trilha de 342).
 */
export const TRAIL_OFFSET_FRACTION = 0.35;

/** Trecho vertical que desce do topo da linha até perto da medalha. O ponto
 * dele cai em 9,5 e a ponta redonda vai até 14,5: cabe inteiro. */
export const TRAIL_LEAD = 15;
/**
 * Folga entre o fim do pontilhado e o topo da medalha. O anel da próxima pulsa
 * até 1,18 do raio para fora da caixa (`useMedalPulse`), 7,2 pt no raio 40;
 * com esta folga ele não encosta no pontilhado nem é cortado no primeiro nó.
 */
export const TRAIL_RING_ROOM = 10;
/** Do topo da linha ao topo da medalha. */
export const TRAIL_MEDAL_TOP = TRAIL_LEAD + TRAIL_RING_ROOM;
/** Folga abaixo do título, onde o pontilhado da coluna (texto grande) desce. */
export const TRAIL_ROW_BOTTOM = 12;
/** O título ocupa até a meia-largura menos isto, para não chegar ao pontilhado. */
export const TRAIL_TITLE_INSET = 16;

/** O pontilhado: traço de 1 com ponta redonda vira ponto de 10, a cada 19. */
export const TRAIL_PATH_STROKE = 10;
export const TRAIL_PATH_DASH = '1 18';
export const TRAIL_DOT_PERIOD = 19;
/**
 * A costura entre duas linhas da lista cai no meio de um intervalo: o último
 * ponto do trecho de cima fica meio período antes do fim, e o primeiro do de
 * baixo, meio período depois do começo. Assim os pontos seguem a cada 19 pt
 * através da costura e nenhum é cortado na borda da linha.
 */
export const TRAIL_SEAM_PHASE = TRAIL_DOT_PERIOD / 2;
/** Da borda da medalha até onde o pontilhado nasce (10 na prancheta). */
export const TRAIL_SIDE_GAP = 10;
/** Raio da curva que leva o trecho da horizontal à vertical (34 × 34/46). */
export const TRAIL_CORNER = 25;

/**
 * O deslocamento horizontal da medalha a partir do centro da trilha. O índice
 * é o do percurso inteiro, e não o da unidade, para o caminho não reiniciar a
 * cada unidade. O primeiro nó fica à esquerda, como na prancheta. Em coluna
 * (texto grande) é sempre 0.
 */
export function medalOffsetX(nodeIndex: number, halfWidth: number, column: boolean): number {
  if (column) return 0;
  const side = nodeIndex % 2 === 0 ? -1 : 1;
  return side * TRAIL_OFFSET_FRACTION * halfWidth;
}

/** O raio com que a trilha desenha cada medalha. */
export function medalRadiusFor(type: JourneyNode['type'], isRecommended: boolean): number {
  if (isRecommended) return NEXT_MEDAL_RADIUS;
  return type === 'review' ? REVIEW_MEDAL_RADIUS : MEDAL_RADIUS;
}

/** Largura máxima do título abaixo da medalha, no zigue-zague. */
export function trailTitleWidth(halfWidth: number): number {
  return Math.max(0, halfWidth - TRAIL_TITLE_INSET);
}

function quadraticLength(
  x0: number, y0: number, cx: number, cy: number, x1: number, y1: number,
): number {
  const steps = 24;
  let length = 0;
  let px = x0;
  let py = y0;
  for (let i = 1; i <= steps; i += 1) {
    const t = i / steps;
    const u = 1 - t;
    const x = u * u * x0 + 2 * u * t * cx + t * t * x1;
    const y = u * u * y0 + 2 * u * t * cy + t * t * y1;
    length += Math.hypot(x - px, y - py);
    px = x;
    py = y;
  }
  return length;
}

/** O dash offset que põe o ponto `TRAIL_SEAM_PHASE` antes do fim do trecho. */
export function seamDashOffset(length: number): number {
  const offset = (TRAIL_SEAM_PHASE - length) % TRAIL_DOT_PERIOD;
  return offset < 0 ? offset + TRAIL_DOT_PERIOD : offset;
}

export type TrailPathGeometry = {
  /** O traçado, em coordenadas do desenho (x a partir de `left`). */
  d: string;
  /** Comprimento do traçado, em pt. */
  length: number;
  /** Onde o desenho começa, a partir do centro da trilha. */
  left: number;
  width: number;
  height: number;
  /** O `strokeDashoffset` que acerta a costura com a linha de baixo. */
  dashOffset: number;
};

/**
 * O trecho que SAI de um nó, como o `seg()` da prancheta: nasce na lateral da
 * medalha, na altura do centro, corre na horizontal na direção do nó seguinte,
 * faz a curva e desce na vertical do nó seguinte até a borda de baixo da linha.
 * O desenho começa `TRAIL_PATH_STROKE / 2` acima do centro, para a ponta
 * redonda do primeiro ponto não ser cortada. Em coluna (`fromX === toX`) é só
 * a descida.
 */
export function outgoingPath(fromX: number, toX: number, fromRadius: number, height: number): TrailPathGeometry {
  const pad = TRAIL_PATH_STROKE;
  const top = TRAIL_PATH_STROKE / 2;
  const endY = Math.max(top, height);
  const direction = Math.sign(toX - fromX);

  if (direction === 0) {
    const length = endY - top;
    return {
      d: `M${pad},${top} V${endY}`,
      length,
      left: toX - pad,
      width: 2 * pad,
      height: endY,
      dashOffset: seamDashOffset(length),
    };
  }

  const startX = fromX + direction * (fromRadius + TRAIL_SIDE_GAP);
  // Sem espaço para a curva inteira, ela encolhe em vez de voltar para trás.
  const corner = Math.max(0, Math.min(TRAIL_CORNER, Math.abs(toX - startX), endY - top));
  const turnX = toX - direction * corner;
  const left = Math.min(startX, toX) - pad;
  const width = Math.abs(toX - startX) + 2 * pad;
  const local = (x: number) => x - left;
  const length = Math.abs(turnX - startX)
    + quadraticLength(turnX, top, toX, top, toX, top + corner)
    + (endY - top - corner);

  return {
    d: `M${local(startX)},${top} H${local(turnX)} Q${local(toX)},${top} ${local(toX)},${top + corner} V${endY}`,
    length,
    left,
    width,
    height: endY,
    dashOffset: seamDashOffset(length),
  };
}

/**
 * O trecho que CHEGA a um nó: a continuação da descida, do topo da linha até
 * `TRAIL_RING_ROOM` acima da medalha. Começa no meio de um intervalo.
 */
export function incomingPath(toX: number, height: number = TRAIL_LEAD): TrailPathGeometry {
  const pad = TRAIL_PATH_STROKE;
  return {
    d: `M${pad},0 V${height}`,
    length: height,
    left: toX - pad,
    width: 2 * pad,
    height,
    dashOffset: TRAIL_SEAM_PHASE,
  };
}

/** Respiro antes da cauda: a cabeça inteira passa abaixo do título, com4pt. */
export function trailColumnClearance(headHeight: number): number {
  const rideOverlap = 4;
  const textGap = 4;
  return Math.max(0, headHeight - rideOverlap - TRAIL_PATH_STROKE / 2 + textGap);
}

/** Janela da cabeça sm do Pixel; o layout reserva os corredores também parado. */
export const TRAIL_PIXEL_HEAD_WIDTH = 48;
export const TRAIL_PIXEL_HEAD_HEIGHT = 46;

/** Troca de lado acima da medalha: cabeça inteira entre os dois blocos, com4pt. */
export function trailRowBottom(headHeight: number): number {
  return Math.max(TRAIL_ROW_BOTTOM, headHeight - TRAIL_LEAD - 4 + 4);
}

/** A coluna preserva uma faixa de cabeça + duas folgas de8pt em cada lado. */
export function trailColumnContentWidth(halfWidth: number, headWidth: number, gap: number): number {
  return Math.max(0, halfWidth * 2 - 2 * (headWidth + gap * 2));
}
