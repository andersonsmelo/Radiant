/**
 * As medidas da trilha de medalhas, tiradas da prancheta de 2026-10-21
 * (`docs/design/2026-10-21-trilha-medalhao.html`).
 */

/** Raio da medalha concluída e da bloqueada. */
export const MEDAL_RADIUS = 34;
/** Raio da próxima: ela é a maior da trilha. */
export const NEXT_MEDAL_RADIUS = 40;

/**
 * Folga acima de cada medalha. O anel da próxima pulsa até 1,18 do raio para
 * fora da caixa (`useMedalPulse`), e sem esta folga ele tocaria o fim do
 * pontilhado e seria cortado no topo do primeiro nó.
 */
export const TRAIL_RING_ROOM = 8;

/** Altura do trecho pontilhado que chega a cada medalha. */
export const TRAIL_SEGMENT_HEIGHT = 36;

/** Largura máxima do título abaixo da medalha, no zigue-zague. */
export const TRAIL_TITLE_MAX_WIDTH = 168;

// Em fração da meia-largura: centro, sai para a direita, volta, sai para a
// esquerda. O máximo é 30%, para a medalha e o título caberem na tela.
const OFFSET_CYCLE = [0, 0.22, 0.3, 0.22, 0, -0.22, -0.3, -0.22] as const;

/**
 * O deslocamento horizontal da medalha a partir do centro da trilha. O índice
 * é o do percurso inteiro, e não o da unidade, para o caminho não reiniciar a
 * cada unidade. Em coluna (texto grande) é sempre 0.
 */
export function medalOffsetX(nodeIndex: number, halfWidth: number, column: boolean): number {
  if (column) return 0;
  const step = ((nodeIndex % OFFSET_CYCLE.length) + OFFSET_CYCLE.length) % OFFSET_CYCLE.length;
  const fraction = OFFSET_CYCLE[step];
  return fraction === 0 ? 0 : fraction * halfWidth;
}
