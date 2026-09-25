import { useWindowDimensions } from 'react-native';

/**
 * A partir de que ajuste de texto do sistema os layouts lado a lado cedem.
 *
 * `fontScale` é o que o iOS entrega quando o aluno aumenta o texto: XXL ≈ 1,24,
 * XXXL (o maior tamanho padrão) ≈ 1,35 e AX1 a AX5 ≈ 1,65 a 3,1. O corte fica
 * logo abaixo do XXXL porque ali os cartões de 45% da trilha já partiam
 * palavras ("Fundamento / s de"), e medido no simulador em 2026-09-24 (gate H4).
 */
export const LARGE_TEXT_FONT_SCALE = 1.3;

/**
 * Teto de escala para o cromo que não pode crescer sem sair da tela (o HUD):
 * o maior tamanho padrão, onde o HUD foi medido cabendo em 402 pt.
 */
export const CHROME_MAX_FONT_SCALE = 1.35;

/**
 * Teto para rótulos curtos que crescem mais que o corpo (título do estágio, 24 pt;
 * rótulo de botão). A 3,1× uma palavra sozinha ficava mais larga que a tela
 * ("radiaçã / o", "checkpoi / nt", AX5 no gate H4). Como nos estilos de título do
 * iOS, eles crescem menos que o texto corrido, que continua sem teto.
 */
export const LABEL_MAX_FONT_SCALE = 2;

export function isLargeTextScale(fontScale: number): boolean {
    return fontScale > LARGE_TEXT_FONT_SCALE;
}

/** Verdadeiro quando o texto do sistema pede layout empilhado em vez de lado a lado. */
export function useLargeTextLayout(): boolean {
    const { fontScale } = useWindowDimensions();
    return isLargeTextScale(fontScale);
}
