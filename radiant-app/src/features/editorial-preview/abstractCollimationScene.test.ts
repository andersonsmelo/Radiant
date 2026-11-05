import { abstractCollimationScene } from './abstractCollimationScene';

describe('PC06-B abstract field geometry', () => {
    it('draws actual detector coordinates without using the retired phantom', () => {
        const scene = abstractCollimationScene(21);
        expect(scene.field).toEqual({ x: 30, y: 0, width: 210, height: 330 });
        expect(scene.target).toEqual({ x: 45, y: 66, width: 180, height: 198 });
        expect(scene.relativeFieldArea).toBeCloseTo(21 / 27);
    });

    it.each([1, 9, 17, 18, 19, 20, 21, 27, -100, 100])('keeps both rectangles valid for width %s', width => {
        const scene = abstractCollimationScene(width);
        for (const rect of [scene.field, scene.target]) {
            expect(rect.width).toBeGreaterThan(0); expect(rect.height).toBeGreaterThan(0);
            expect(rect.x).toBeGreaterThanOrEqual(0); expect(rect.y).toBeGreaterThanOrEqual(0);
            expect(rect.x + rect.width).toBeLessThanOrEqual(270);
            expect(rect.y + rect.height).toBeLessThanOrEqual(330);
        }
    });

    it('describes coverage and changing margins without announcing the answer interval', () => {
        expect(abstractCollimationScene(17).covered).toBe(false);
        expect(abstractCollimationScene(17).description).toContain('fora do campo');
        expect(abstractCollimationScene(18).description).toContain('coincidem');
        expect(abstractCollimationScene(27).description).toContain('33%');
        expect(abstractCollimationScene(20).description).toContain('10%');
        for (const width of [17, 18, 20, 27])
            expect(abstractCollimationScene(width).description).not.toMatch(/18\s*cm|18–20|faixa.meta|dose|espalhamento|correto/iu);
    });

    it.each([NaN, Infinity, -Infinity])('refuses a non-finite width %s', width => {
        expect(() => abstractCollimationScene(width)).toThrow('invalid-abstract-field');
    });
});
