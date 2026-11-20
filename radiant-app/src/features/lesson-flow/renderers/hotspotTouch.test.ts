import { TOUCH_FIGURE_WIDTH_PT, touchRect, touchRectInside, touchRectsOverlap, touchSlop, badgeBox, badgeBoxes, labelBadgeBox, labelBadgeBoxes, LABEL_DOT, BADGE_SIZE } from './hotspotTouch';

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

describe('badgeBox fora da região (E11)', () => {
    const quadro = { width: 280, height: 210 };
    const rect = (b: { left: number; top: number; width: number; height: number }) => b;
    const regionRect = (r: { x: number; y: number; width: number; height: number }) =>
        ({ left: r.x * quadro.width, top: r.y * quadro.height, width: r.width * quadro.width, height: r.height * quadro.height });
    const dentro = (b: { left: number; top: number; width: number; height: number }) =>
        b.left >= 0 && b.top >= 0 && b.left + b.width <= quadro.width + 1e-9 && b.top + b.height <= quadro.height + 1e-9;

    it('prefere ACIMA da região, alinhado à borda esquerda e encostado', () => {
        const region = { x: 0.3, y: 0.5, width: 0.3, height: 0.2 };
        const box = badgeBox(region, quadro);
        expect(box.left).toBeCloseTo(0.3 * 280);
        expect(box.top + box.height).toBeCloseTo(0.5 * 210);
        expect(touchRectsOverlap(rect(box), regionRect(region))).toBe(false);
    });

    it('sem espaço acima, vai ABAIXO', () => {
        const region = { x: 0.3, y: 0.04, width: 0.3, height: 0.2 };
        const box = badgeBox(region, quadro);
        expect(box.top).toBeCloseTo(0.24 * 210);
        expect(touchRectsOverlap(rect(box), regionRect(region))).toBe(false);
        expect(dentro(box)).toBe(true);
    });

    it('sem espaço acima nem abaixo, vai à ESQUERDA', () => {
        const region = { x: 0.5, y: 0.02, width: 0.2, height: 0.96 };
        const box = badgeBox(region, quadro);
        expect(box.left + box.width).toBeCloseTo(0.5 * 280);
        expect(touchRectsOverlap(rect(box), regionRect(region))).toBe(false);
        expect(dentro(box)).toBe(true);
    });

    it('sem espaço acima, abaixo nem à esquerda, vai à DIREITA', () => {
        const region = { x: 0.05, y: 0.02, width: 0.2, height: 0.96 };
        const box = badgeBox(region, quadro);
        expect(box.left).toBeCloseTo(0.25 * 280);
        expect(touchRectsOverlap(rect(box), regionRect(region))).toBe(false);
        expect(dentro(box)).toBe(true);
    });

    it('só se nenhuma posição couber, o selo fica DENTRO da região, ainda no quadro', () => {
        const box = badgeBox({ x: 0.02, y: 0.02, width: 0.96, height: 0.96 }, quadro);
        expect(dentro(box)).toBe(true);
        expect(touchRectsOverlap(rect(box), regionRect({ x: 0.02, y: 0.02, width: 0.96, height: 0.96 }))).toBe(true);
    });

    it('região na borda direita: o selo acima continua inteiro no quadro (difere E é válido)', () => {
        const box = badgeBox({ x: 0.92, y: 0.5, width: 0.08, height: 0.2 }, quadro);
        expect(dentro(box)).toBe(true);
        expect(box.top + box.height).toBeCloseTo(0.5 * 210);
    });

    it('o offset do selo absoluto dentro da região leva a mesma posição, descontada a borda de 2 pt', () => {
        const region = { x: 0.3, y: 0.5, width: 0.3, height: 0.2 };
        const box = badgeBox(region, quadro);
        expect(box.offset).toEqual({ left: box.left - 0.3 * 280 - 2, top: box.top - 0.5 * 210 - 2 });
    });
});

describe('labelBadgeBox (E11)', () => {
    const quadro = { width: 280, height: 210 };
    const dotRect = (p: { x: number; y: number }) => ({ left: p.x * 280 - LABEL_DOT / 2, top: p.y * 210 - LABEL_DOT / 2, width: LABEL_DOT, height: LABEL_DOT });
    const dentro = (b: { left: number; top: number; width: number; height: number }) =>
        b.left >= 0 && b.top >= 0 && b.left + b.width <= 280 + 1e-9 && b.top + b.height <= 210 + 1e-9;

    it('o ponto é pequeno: de 10 a 12 pt', () => {
        expect(LABEL_DOT).toBeGreaterThanOrEqual(10);
        expect(LABEL_DOT).toBeLessThanOrEqual(12);
    });

    it('o selo fica acima e à direita do ponto, encostado, sem cobri-lo', () => {
        const p = { x: 0.5, y: 0.5 };
        const box = labelBadgeBox(p, quadro);
        expect(box.left).toBeCloseTo(0.5 * 280 + LABEL_DOT / 2);
        expect(box.top + box.height).toBeCloseTo(0.5 * 210 - LABEL_DOT / 2);
        expect(box.width).toBe(BADGE_SIZE.width);
        expect(touchRectsOverlap(box, dotRect(p))).toBe(false);
    });

    it.each([
        ['junto ao topo: abaixo e à direita', { x: 0.5, y: 0.03 }],
        ['junto à direita: acima e à esquerda', { x: 0.97, y: 0.5 }],
        ['no canto superior direito: abaixo e à esquerda', { x: 0.97, y: 0.03 }],
    ])('%s, sempre inteiro no quadro e fora do ponto', (_nome, p) => {
        const box = labelBadgeBox(p, quadro);
        expect(dentro(box)).toBe(true);
        expect(touchRectsOverlap(box, dotRect(p))).toBe(false);
    });
});

describe('selos de um item em conjunto (E11, integrador)', () => {
    const quadro = { width: 280, height: 210 };
    const rectOf = (r: { x: number; y: number; width: number; height: number }) =>
        ({ left: r.x * 280, top: r.y * 210, width: r.width * 280, height: r.height * 210 });
    // Regiões reais do item de tocar da m19-06 (tubo-raios-x, figura compacta): cátodo, ânodo, janela, ampola.
    const m19_06 = [
        { x: 0.2188, y: 0.3083, width: 0.1437, height: 0.2417 },
        { x: 0.5094, y: 0.0854, width: 0.4578, height: 0.2646 },
        { x: 0.475, y: 0.4, width: 0.1453, height: 0.1167 },
        { x: 0.2578, y: 0.0625, width: 0.1875, height: 0.1979 },
    ];

    it('m19-06: nenhum selo se sobrepõe a outro, todos dentro do quadro e fora da própria região', () => {
        const boxes = badgeBoxes(m19_06, quadro);
        boxes.forEach((box, i) => {
            expect(box.left).toBeGreaterThanOrEqual(0);
            expect(box.top).toBeGreaterThanOrEqual(0);
            expect(box.left + box.width).toBeLessThanOrEqual(280);
            expect(box.top + box.height).toBeLessThanOrEqual(210);
            expect(touchRectsOverlap(box, rectOf(m19_06[i]))).toBe(false);
            boxes.slice(i + 1).forEach(other => expect(touchRectsOverlap(box, other)).toBe(false));
        });
    });

    it('um selo que pisaria em outra região, havendo posição livre, vai para a livre', () => {
        // B logo acima de A: o selo de A acima cobriria B; abaixo está livre.
        const a = { x: 0.3, y: 0.5, width: 0.2, height: 0.2 };
        const b = { x: 0.3, y: 0.38, width: 0.2, height: 0.1 };
        const [boxA] = badgeBoxes([a, b], quadro);
        expect(touchRectsOverlap(boxA, rectOf(b))).toBe(false);
        expect(boxA.top).toBeCloseTo(0.7 * 210);
    });

    it('dois selos vizinhos não se sobrepõem: o segundo escolhe a próxima posição', () => {
        const a = { x: 0.3, y: 0.5, width: 0.05, height: 0.1 };
        const b = { x: 0.32, y: 0.5, width: 0.05, height: 0.1 };
        const [boxA, boxB] = badgeBoxes([a, b], quadro);
        expect(touchRectsOverlap(boxA, boxB)).toBe(false);
    });

    it('m19-06: com oito posições, o selo do ânodo não cobre a janela nem outra região', () => {
        const boxes = badgeBoxes(m19_06, quadro);
        boxes.forEach((box, i) => m19_06.forEach((other, j) => {
            if (i !== j) expect(touchRectsOverlap(box, rectOf(other))).toBe(false);
        }));
    });

    it('rotular: com os cantos do ponto, selos de pontos colados não se sobrepõem entre si', () => {
        const pontos = [{ x: 0.5, y: 0.5 }, { x: 0.53, y: 0.5 }, { x: 0.56, y: 0.5 }];
        const boxes = labelBadgeBoxes(pontos, quadro);
        boxes.forEach((box, i) => boxes.slice(i + 1).forEach(other => expect(touchRectsOverlap(box, other)).toBe(false)));
    });

    it('um item de uma região só dá o mesmo selo que o de antes', () => {
        const region = { x: 0.3, y: 0.5, width: 0.3, height: 0.2 };
        expect(badgeBox(region, quadro)).toEqual(badgeBoxes([region], quadro)[0]);
    });

    it('rotular: dois pontos vizinhos não ganham selos sobrepostos nem selo sobre o ponto do outro', () => {
        const pontos = [{ x: 0.5, y: 0.5 }, { x: 0.55, y: 0.5 }];
        const [one, two] = labelBadgeBoxes(pontos, quadro);
        expect(touchRectsOverlap(one, two)).toBe(false);
        for (const [box, p] of [[one, pontos[1]], [two, pontos[0]]] as const) {
            expect(touchRectsOverlap(box, { left: p.x * 280 - LABEL_DOT / 2, top: p.y * 210 - LABEL_DOT / 2, width: LABEL_DOT, height: LABEL_DOT })).toBe(false);
        }
    });
});
