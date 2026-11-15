import type { PixelExpression } from '../pixelExpressions';
import { PIXEL_EXPRESSIONS } from '../pixelExpressions';
import { CAST_STROKE, type CastShape } from './castLooks';

/**
 * O conjunto comum do elenco (bíblia de 2026-11-13). Todo personagem humano
 * tem as cinco, montadas das MESMAS partes: um rosto novo não desenha
 * expressão, escolhe olhos, boca, sobrancelha e acessório desta tabela.
 */
export const CAST_EXPRESSIONS = ['neutro', 'feliz', 'pensativo', 'preocupado', 'comemorando'] as const;
export type CastExpression = (typeof CAST_EXPRESSIONS)[number];

/**
 * As partes vivem na caixa 64 × 64 do retrato, com o rosto centrado em
 * (32, 27): olhos em x = 27,5 e 36,5, sobrancelhas na faixa de y 20 a 24, boca
 * na de 32 a 36 (o ponto de controle da boca aberta fica em 39, a curva chega a 35,5). Só geometria: a cor entra no desenho (feição é sempre tinta,
 * acessório é sempre ouro).
 */
export const CAST_EYES = {
    ponto: [
        { kind: 'circle', cx: 27.5, cy: 27, r: 1.4 },
        { kind: 'circle', cx: 36.5, cy: 27, r: 1.4 },
    ],
    // O arco ∩ é o que faz o rosto ler como sorriso, como no Pixel.
    arco: [
        { kind: 'path', d: 'M26 27.6 Q27.5 25.4 29 27.6 M35 27.6 Q36.5 25.4 38 27.6', strokeWidth: CAST_STROKE.feicao },
    ],
    // Olhar para cima e para o lado: a pessoa está buscando a resposta.
    lateral: [
        { kind: 'circle', cx: 28.4, cy: 26.2, r: 1.4 },
        { kind: 'circle', cx: 37.4, cy: 26.2, r: 1.4 },
    ],
    // Um pouco mais abertos, atentos: preocupação com alguém, não susto.
    atento: [
        { kind: 'circle', cx: 27.5, cy: 27.2, r: 1.7 },
        { kind: 'circle', cx: 36.5, cy: 27.2, r: 1.7 },
    ],
} as const satisfies Record<string, readonly CastShape[]>;

export const CAST_MOUTHS = {
    calma: [{ kind: 'path', d: 'M29 33 Q32 34.6 35 33', strokeWidth: CAST_STROKE.feicao }],
    sorriso: [{ kind: 'path', d: 'M28 32.5 Q32 35.8 36 32.5', strokeWidth: CAST_STROKE.feicao }],
    // Preenchida: a única boca aberta do conjunto.
    aberta: [{ kind: 'path', d: 'M27.5 32 Q32 39 36.5 32 Z', filled: true }],
    deLado: [{ kind: 'path', d: 'M29.5 33.6 Q32.5 33.4 35 32.2', strokeWidth: CAST_STROKE.feicao }],
    // Curva suave para baixo e curta: acolhe, não reprova. Nunca mais funda que isto.
    contida: [{ kind: 'path', d: 'M29.5 34 Q32 32.8 34.5 34', strokeWidth: CAST_STROKE.feicao }],
} as const satisfies Record<string, readonly CastShape[]>;

export const CAST_BROWS = {
    relaxada: [{ kind: 'path', d: 'M25 23 L30 22.6 M34 22.6 L39 23', strokeWidth: CAST_STROKE.feicao }],
    erguida: [{ kind: 'path', d: 'M25 22.4 Q27.5 20.6 30 22 M34 22 Q36.5 20.6 39 22.4', strokeWidth: CAST_STROKE.feicao }],
    assimetrica: [{ kind: 'path', d: 'M25 22.8 L30 22.6 M34 21.8 Q36.5 20.4 39 21.6', strokeWidth: CAST_STROKE.feicao }],
    // Ponta de dentro para cima: empatia. A de reprovação (ponta para baixo) não existe.
    preocupada: [{ kind: 'path', d: 'M25 23.2 L30 21.8 M34 21.8 L39 23.2', strokeWidth: CAST_STROKE.feicao }],
} as const satisfies Record<string, readonly CastShape[]>;

export const CAST_ACCESSORIES = {
    nenhum: [],
    // Duas faíscas de quatro pontas, em ouro: a cor do avanço no Medalhão.
    faiscas: [
        { kind: 'path', d: 'M11 7 L12.2 10.8 L16 12 L12.2 13.2 L11 17 L9.8 13.2 L6 12 L9.8 10.8 Z', filled: true },
        { kind: 'path', d: 'M53 10 L53.9 12.6 L56.5 13.5 L53.9 14.4 L53 17 L52.1 14.4 L49.5 13.5 L52.1 12.6 Z', filled: true },
    ],
} as const satisfies Record<string, readonly CastShape[]>;

export type CastFace = {
    eyes: keyof typeof CAST_EYES;
    mouth: keyof typeof CAST_MOUTHS;
    brows: keyof typeof CAST_BROWS;
    accessory: keyof typeof CAST_ACCESSORIES;
};

export const CAST_FACES: Record<CastExpression, CastFace> = {
    neutro: { eyes: 'ponto', mouth: 'calma', brows: 'relaxada', accessory: 'nenhum' },
    feliz: { eyes: 'arco', mouth: 'sorriso', brows: 'erguida', accessory: 'nenhum' },
    pensativo: { eyes: 'lateral', mouth: 'deLado', brows: 'assimetrica', accessory: 'nenhum' },
    preocupado: { eyes: 'atento', mouth: 'contida', brows: 'preocupada', accessory: 'nenhum' },
    comemorando: { eyes: 'arco', mouth: 'aberta', brows: 'erguida', accessory: 'faiscas' },
};

/**
 * O que o leitor de tela acrescenta ao nome quando a expressão muda o sentido.
 * Gerúndio e locução não têm gênero, então servem a todo o elenco. O neutro
 * não acrescenta nada.
 */
export const CAST_EXPRESSION_LABEL: Record<CastExpression, string | null> = {
    neutro: null,
    feliz: 'sorrindo',
    pensativo: 'pensando',
    preocupado: 'com ar de preocupação',
    comemorando: 'comemorando',
};

/**
 * A expressão que o rótulo diz. O rótulo descreve o rosto que aparece: o Pixel
 * não tem rosto de preocupação, mostra o "pensando", e é isso que ele diz.
 */
export function labelExpressionFor(speaker: string, expression: CastExpression): CastExpression {
    return speaker === 'pixel' && expression === 'preocupado' ? 'pensativo' : expression;
}

export function isCastExpression(value: unknown): value is CastExpression {
    return (CAST_EXPRESSIONS as readonly unknown[]).includes(value);
}

/**
 * O Pixel tem a tela dele (aprovada em 2026-10-21) e não é redesenhado: cada
 * expressão do conjunto comum aponta para a dele mais próxima. `preocupado`
 * vira `pensando`, o rosto que o retorno de erro já usa ("pensando com você").
 */
export const PIXEL_EXPRESSION_FOR: Record<CastExpression, PixelExpression> = {
    neutro: 'neutro',
    feliz: 'feliz',
    pensativo: 'pensando',
    preocupado: 'pensando',
    comemorando: 'orgulhoso',
};

/** Aceita as duas famílias: a do Pixel passa direto; a comum é traduzida. */
export function pixelExpressionFor(expression: CastExpression | PixelExpression): PixelExpression {
    return expression in PIXEL_EXPRESSIONS ? (expression as PixelExpression) : PIXEL_EXPRESSION_FOR[expression as CastExpression];
}
