import { CHROME_MAX_FONT_SCALE, LABEL_MAX_FONT_SCALE, LARGE_TEXT_FONT_SCALE, isLargeTextScale } from './useLargeTextLayout';

describe('isLargeTextScale', () => {
    it.each([
        [1, false],
        [1.24, false],
        [1.35, true],
        [1.65, true],
        [3.1, true],
    ])('fontScale %f → layout de texto grande: %s', (fontScale, expected) => {
        expect(isLargeTextScale(fontScale)).toBe(expected);
    });

    it('o teto do cromo não fica abaixo do corte do layout', () => {
        // Se o teto fosse menor que o corte, o HUD pararia de crescer antes de o
        // resto da tela mudar de layout: texto pequeno no cromo, grande no resto.
        expect(CHROME_MAX_FONT_SCALE).toBeGreaterThanOrEqual(LARGE_TEXT_FONT_SCALE);
    });

    it('rótulos curtos crescem mais que o cromo', () => {
        expect(LABEL_MAX_FONT_SCALE).toBeGreaterThan(CHROME_MAX_FONT_SCALE);
    });
});
