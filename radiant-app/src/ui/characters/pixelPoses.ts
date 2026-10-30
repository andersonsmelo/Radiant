import type { CharacterState } from './types';

/**
 * Poses do Pixel. Cada uma troca só os braços; o resto do corpo, a cabeça e o
 * rosto não mudam. Os números vêm de `ARMS` na prancheta aprovada em 2026-10-21
 * (`docs/design/2026-10-21-pixel-medalhao.html`), na caixa de 576 × 864 do
 * `PixelBody`. Os ombros ficam em (150, 410) e (354, 410).
 */
export type PixelPose = 'acena' | 'aponta' | 'comemora' | 'pensa' | 'repouso';

export type PixelArm = {
  /** Da junta do ombro até o punho: x1, y1, x2, y2. */
  sleeve: [x1: number, y1: number, x2: number, y2: number];
  /** Onde a mão se apoia e quanto gira, em graus. */
  hand: { x: number; y: number; rotate: number };
};

// O braço esquerdo cai ao lado do corpo em quatro das cinco poses.
const LEFT_AT_REST: PixelArm = { sleeve: [150, 420, 118, 540], hand: { x: 116, y: 560, rotate: 8 } };

export const PIXEL_ARMS: Record<PixelPose, { left: PixelArm; right: PixelArm }> = {
  acena: {
    left: LEFT_AT_REST,
    right: { sleeve: [354, 420, 438, 330], hand: { x: 452, y: 300, rotate: 200 } },
  },
  aponta: {
    left: LEFT_AT_REST,
    right: { sleeve: [354, 420, 470, 420], hand: { x: 494, y: 420, rotate: -90 } },
  },
  comemora: {
    left: { sleeve: [150, 420, 90, 300], hand: { x: 80, y: 276, rotate: 160 } },
    right: { sleeve: [354, 420, 414, 300], hand: { x: 424, y: 276, rotate: 200 } },
  },
  pensa: {
    left: LEFT_AT_REST,
    right: { sleeve: [354, 430, 300, 360], hand: { x: 286, y: 344, rotate: 150 } },
  },
  repouso: {
    left: LEFT_AT_REST,
    right: { sleeve: [354, 420, 386, 540], hand: { x: 388, y: 560, rotate: -8 } },
  },
};

const POSE_BY_STATE: Record<CharacterState, PixelPose> = {
  idle: 'repouso',
  guide: 'aponta',
  thinking: 'pensa',
  happy: 'acena',
  celebrate: 'comemora',
  oops: 'repouso',
};

/** Quem chama continua passando `state`; a pose sai dele. */
export function poseForState(state: CharacterState): PixelPose {
  return POSE_BY_STATE[state];
}
