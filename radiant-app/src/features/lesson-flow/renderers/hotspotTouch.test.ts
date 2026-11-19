import { TOUCH_FIGURE_WIDTH_PT, touchRect, touchRectInside, touchRectsOverlap, touchSlop, badgeBox } from './hotspotTouch';

const frame = (width: number, height: number) => ({ width: TOUCH_FIGURE_WIDTH_PT, height: (TOUCH_FIGURE_WIDTH_PT * height) / width });

describe('hotspotTouch', () => {
    it('amplia em torno do centro até 44 pt por eixo e não encolhe região grande', () => {
        const small = touchRect({ x: 0.5, y: 0.5, width: 0.04, height: 0.04 }, { width: 280, height: 280 });
        expect(small).toEqual({ left: 140 + 5.6 - 22, top: 140 + 5.6 - 22, width: 44, height: 44 });
        expect(touchRect({ x: 0.1, y: 0.1, width: 0.5, height: 0.5 }, { width: 280, height: 280 })).toEqual({ left: 28, top: 28, width: 140, height: 140 });
        // Ponto: sem largura nem altura.
        expect(touchRect({ x: 0.5, y: 0.5 }, { width: 280, height: 280 })).toEqual({ left: 118, top: 118, width: 44, height: 44 });
    });

    it('o hitSlop é a diferença entre o retângulo de toque e a região, igual nos dois lados', () => {
        const slop = touchSlop({ x: 0.5, y: 0.5, width: 0.1, height: 0.2 }, { width: 280, height: 280 });
        expect(slop).toEqual({ left: 8, right: 8, top: 0, bottom: 0 });
        expect(touchSlop({ x: 0.1, y: 0.1, width: 0.5, height: 0.5 }, { width: 280, height: 280 })).toEqual({ left: 0, right: 0, top: 0, bottom: 0 });
    });

    // Cenário 1 do revisor: regiões de altura 0,08 com centros a 0,17 na vertical numa figura 320x240.
    it('recusa duas regiões baixas com centros a 0,17 na vertical, que a régua euclidiana antiga deixava passar', () => {
        const f = frame(320, 240);
        const a = touchRect({ x: 0.3, y: 0.2, width: 0.3, height: 0.08 }, f);
        const b = touchRect({ x: 0.3, y: 0.37, width: 0.3, height: 0.08 }, f);
        expect(0.17 * f.height).toBeLessThan(44);
        expect(touchRectsOverlap(a, b)).toBe(true);
        // Validade: com 0,22 de distância (46,2 pt) deixa de sobrepor.
        expect(touchRectsOverlap(a, touchRect({ x: 0.3, y: 0.42, width: 0.3, height: 0.08 }, f))).toBe(false);
    });

    // Cenário 2 do revisor: região encostada na borda direita.
    it('recusa a região de x 0,92 e largura 0,08, cujo toque sai da figura', () => {
        const f = frame(320, 240);
        expect(touchRectInside(touchRect({ x: 0.92, y: 0.4, width: 0.08, height: 0.2 }, f), f)).toBe(false);
        expect(touchRectInside(touchRect({ x: 0.8, y: 0.4, width: 0.08, height: 0.2 }, f), f)).toBe(true);
    });

    it('encostar na borda não sobrepõe', () => {
        expect(touchRectsOverlap({ left: 0, top: 0, width: 44, height: 44 }, { left: 44, top: 0, width: 44, height: 44 })).toBe(false);
    });
});

describe('badgeBox', () => {
    const quadro = { width: 280, height: 210 };
    // Régua mínima do verificador: 0,08 de largura e de altura. Uma na borda de baixo (mandíbula) e outra na borda direita.
    const regioes = [
        { x: 0.3, y: 0.92, width: 0.4, height: 0.08 },
        { x: 0.92, y: 0.4, width: 0.08, height: 0.4 },
        { x: 0.1, y: 0.1, width: 0.08, height: 0.08 },
    ];

    it.each(regioes)('o selo cabe inteiro no quadro e toca a região %#', region => {
        const box = badgeBox(region, quadro);
        expect(box.left).toBeGreaterThanOrEqual(0);
        expect(box.top).toBeGreaterThanOrEqual(0);
        expect(box.left + box.width).toBeLessThanOrEqual(quadro.width);
        expect(box.top + box.height).toBeLessThanOrEqual(quadro.height);
        // Continua ancorado na região, não solto pela figura.
        const left = region.x * quadro.width, top = region.y * quadro.height;
        expect(box.left).toBeLessThanOrEqual(left + region.width * quadro.width);
        expect(box.top).toBeLessThanOrEqual(top + region.height * quadro.height);
        expect(box.left + box.width).toBeGreaterThanOrEqual(left);
        expect(box.top + box.height).toBeGreaterThanOrEqual(top);
    });
});
