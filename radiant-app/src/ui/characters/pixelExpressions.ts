import { colors } from '../theme';

export type PixelExpression =
  | 'neutro'
  | 'feliz'
  | 'orgulhoso'
  | 'emburrado'
  | 'revirando'
  | 'surpreso'
  | 'pensando';

/**
 * Uma expressão são oito números — todos em fração da caixa da TELA, nunca em
 * pixels, para que a mesma expressão funcione em sm, md e lg — mais uma cor e
 * um formato de olho.
 *
 * Como toda boca é a mesma curva de três pontos, transição entre duas
 * expressões é interpolar números. Não há morphing de path com contagem de
 * pontos divergente.
 */
export interface PixelFaceShape {
  /** Largura do olho, fração da largura da tela. */
  eyeW: number;
  /** Altura do olho, fração da altura da tela. */
  eyeH: number;
  /** Raio do olho, fração da largura do olho. 0.5 = pílula. */
  eyeRadius: number;
  /** Rotação em graus. Positivo inclina a borda interna para baixo (bravo). */
  eyeRotate: number;
  /** Deslocamento vertical do olho, fração da altura da tela. */
  eyeOffsetY: number;
  /**
   * Olho em arco ∩ em vez de pílula. Arco é a forma que faz o rosto ler como
   * feliz — testado contra pílula achatada em 2026-08-11, e a pílula lê como
   * olho fechado ou sonolento. Arco é desenhado em SVG junto com a boca;
   * pílula é uma View. Transição entre os dois formatos faz crossfade de
   * opacidade, não interpolação de forma.
   */
  eyeArc: boolean;
  /** Largura da boca, fração da largura da tela. */
  mouthW: number;
  /** Mergulho: >0 sorri, 0 reta, <0 emburra. Fração da altura da tela. */
  mouthDip: number;
  /** Espessura do traço da boca, fração da altura da tela. */
  mouthThickness: number;
  /** Cor do brilho. Não interpola: troca junto com a expressão. */
  glow: string;
}

export const PIXEL_EXPRESSIONS: Record<PixelExpression, PixelFaceShape> = {
  neutro: {
    eyeW: 0.13, eyeH: 0.4, eyeRadius: 0.45, eyeRotate: 0, eyeOffsetY: 0,
    eyeArc: false, mouthW: 0.24, mouthDip: 0.06, mouthThickness: 0.055,
    glow: colors.accentStrong,
  },
  feliz: {
    eyeW: 0.15, eyeH: 0.3, eyeRadius: 0.5, eyeRotate: 0, eyeOffsetY: 0.02,
    eyeArc: true, mouthW: 0.34, mouthDip: 0.3, mouthThickness: 0.06,
    glow: colors.accentStrong,
  },
  orgulhoso: {
    eyeW: 0.14, eyeH: 0.16, eyeRadius: 0.5, eyeRotate: 0, eyeOffsetY: 0.02,
    eyeArc: false, mouthW: 0.22, mouthDip: 0.2, mouthThickness: 0.055,
    glow: colors.accentStrong,
  },
  emburrado: {
    eyeW: 0.14, eyeH: 0.34, eyeRadius: 0.35, eyeRotate: 16, eyeOffsetY: 0.03,
    eyeArc: false, mouthW: 0.22, mouthDip: -0.16, mouthThickness: 0.055,
    glow: colors.accentStrong,
  },
  revirando: {
    eyeW: 0.13, eyeH: 0.34, eyeRadius: 0.45, eyeRotate: 0, eyeOffsetY: -0.12,
    eyeArc: false, mouthW: 0.24, mouthDip: -0.05, mouthThickness: 0.05,
    glow: colors.accentStrong,
  },
  surpreso: {
    eyeW: 0.14, eyeH: 0.44, eyeRadius: 0.5, eyeRotate: 0, eyeOffsetY: 0,
    eyeArc: false, mouthW: 0.11, mouthDip: 0.02, mouthThickness: 0.05,
    glow: colors.accentStrong,
  },
  pensando: {
    eyeW: 0.13, eyeH: 0.34, eyeRadius: 0.45, eyeRotate: 0, eyeOffsetY: 0,
    eyeArc: false, mouthW: 0.18, mouthDip: 0.04, mouthThickness: 0.05,
    glow: colors.accentStrong,
  },
};

/** Distância do centro da tela até o centro de cada olho, fração da largura. */
export const PIXEL_EYE_GAP = 0.19;
/** Deslocamento vertical da linha dos olhos, fração da altura da tela. */
export const PIXEL_EYE_BASELINE = -0.1;
/** Deslocamento vertical da boca, fração da altura da tela. */
export const PIXEL_MOUTH_BASELINE = 0.26;
