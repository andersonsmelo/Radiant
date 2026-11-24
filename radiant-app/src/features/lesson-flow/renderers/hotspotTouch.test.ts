import fs from 'fs';
import path from 'path';
import { DIAGRAMS } from '../../../ui/diagrams/diagramRegistry';
import { TOUCH_FIGURE_WIDTH_PT, touchRect, touchRectInside, touchRectsOverlap, touchSlop, badgeBox, badgeBoxes, labelBadgeBox, labelBadgeBoxes, LABEL_DOT, BADGE_SIZE, badgeStyle } from './hotspotTouch';

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

    it('o estilo do selo é absoluto no quadro, na própria caixa (o selo é irmão da região, não filho)', () => {
        const box = badgeBox({ x: 0.3, y: 0.5, width: 0.3, height: 0.2 }, quadro);
        expect(badgeStyle(box)).toEqual({ position: 'absolute', left: box.left, top: box.top, width: 36, height: 24 });
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

    it('rotular: dois pontos vizinhos não ganham selos sobrepostos nem selo sobre o ponto do outro', () => {
        const pontos = [{ x: 0.5, y: 0.5 }, { x: 0.55, y: 0.5 }];
        const [one, two] = labelBadgeBoxes(pontos, quadro);
        expect(touchRectsOverlap(one, two)).toBe(false);
        for (const [box, p] of [[one, pontos[1]], [two, pontos[0]]] as const) {
            expect(touchRectsOverlap(box, { left: p.x * 280 - LABEL_DOT / 2, top: p.y * 210 - LABEL_DOT / 2, width: LABEL_DOT, height: LABEL_DOT })).toBe(false);
        }
    });
});

const areaOn = (a: { left: number; top: number; width: number; height: number }, b: { left: number; top: number; width: number; height: number }) =>
    Math.max(0, Math.min(a.left + a.width, b.left + b.width) - Math.max(a.left, b.left)) * Math.max(0, Math.min(a.top + a.height, b.top + b.height) - Math.max(a.top, b.top));

// E12: o selo de um alvo não pisa na área de toque de 44 pt de outro alvo do mesmo item.
describe('selos fora da área de toque dos outros alvos (E12)', () => {
    const quadro = { width: 280, height: 210 };
    const noQuadro = (b: { left: number; top: number; width: number; height: number }) => b.left >= 0 && b.top >= 0 && b.left + b.width <= 280 && b.top + b.height <= 210;

    it('rotular: havendo posição livre, o selo de um ponto não cai na área de toque de outro ponto', () => {
        // B está acima e à direita de A: fora do ponto de A e do primeiro selo (que fica ao lado de A),
        // mas a área de 44 pt de B alcança o selo "acima e à direita" de A.
        const a = { x: 0.5, y: 0.6 };
        const b = { x: 0.5 + 60 / 280, y: 0.6 - 18 / 210 };
        const [seloA] = labelBadgeBoxes([a, b], quadro);
        expect(touchRectsOverlap(seloA, touchRect(b, quadro))).toBe(false);
        // Validade: o selo continua inteiro no quadro e encostado no ponto de A (a menos de 1 pt dele).
        expect(noQuadro(seloA)).toBe(true);
        const dotA = { left: a.x * 280 - LABEL_DOT / 2, top: a.y * 210 - LABEL_DOT / 2, width: LABEL_DOT, height: LABEL_DOT };
        expect(Math.max(Math.abs(seloA.left - (dotA.left + dotA.width)), 0) < 1 || Math.abs(seloA.left + seloA.width - dotA.left) < 1 || Math.abs(seloA.top + seloA.height - dotA.top) < 1 || Math.abs(seloA.top - (dotA.top + dotA.height)) < 1).toBe(true);
    });

    it('tocar: havendo posição livre, o selo de uma região não cai na área de toque de outra região', () => {
        // B é pequena e fica logo acima de A, sem tocar o selo "acima" de A, mas com a área de 44 pt por cima dele.
        const a = { x: 0.3, y: 0.5, width: 0.1, height: 0.1 };
        const b = { x: 0.3, y: 0.5 - 46 / 210, width: 0.1, height: 16 / 210 };
        const [seloA] = badgeBoxes([a, b], quadro);
        expect(touchRectsOverlap(seloA, touchRect(b, quadro))).toBe(false);
        expect(noQuadro(seloA)).toBe(true);
    });

    it('sem posição livre, vale a de menor área sobre a área de toque alheia, e os selos não se sobrepõem', () => {
        // Pontos em fila a cada 28 pt: toda posição pisa em alguma área alheia.
        const pontos = [0.2, 0.3, 0.4, 0.5, 0.6, 0.7].map(x => ({ x, y: 0.5 }));
        const caixas = labelBadgeBoxes(pontos, quadro);
        const sobre = (box: { left: number; top: number; width: number; height: number }, i: number) =>
            pontos.reduce((sum, p, j) => (j === i ? sum : sum + areaOn(box, touchRect(p, quadro))), 0);
        pontos.forEach((p, i) => {
            const cx = p.x * 280, cy = p.y * 210;
            const primeiro = { left: cx + LABEL_DOT / 2, top: cy - LABEL_DOT / 2 - 24, width: 36, height: 24 };
            expect(sobre(caixas[i], i)).toBeLessThanOrEqual(sobre(primeiro, i));
        });
        caixas.forEach((c, i) => caixas.slice(i + 1).forEach(o => expect(touchRectsOverlap(c, o)).toBe(false)));
    });
});

// Guarda de conteúdo: os itens reais das 40 unidades, de desenho (diagramId) e de imagem real (imageId), na régua de 280 pt (achado 1 da revisão do 2A; achado 13 da revisão das imagens reais).
describe('selos nos itens reais das 40 unidades (E12)', () => {
    type Box = { left: number; top: number; width: number; height: number };
    type Item = { unit: string; id: string; diagramId?: string; imageId?: string; points?: { x: number; y: number }[]; regions?: { x: number; y: number; width: number; height: number; correct?: boolean }[] };
    const dir = path.resolve(__dirname, '../../../../../content-manifest/rtg-2026/aulas');
    const imagens = JSON.parse(fs.readFileSync(path.resolve(dir, '../imagens.json'), 'utf8')) as { id: string; width: number; height: number }[];
    const items: Item[] = [];
    for (const file of fs.readdirSync(dir).filter(name => name.endsWith('.json')).sort()) {
        const walk = (node: unknown) => {
            if (Array.isArray(node)) { node.forEach(walk); return; }
            if (!node || typeof node !== 'object') return;
            const n = node as Record<string, unknown> & Partial<Item>;
            const desenhado = !!n.diagramId && !!(DIAGRAMS as Record<string, unknown>)[n.diagramId];
            const real = !!n.imageId && imagens.some(img => img.id === n.imageId);
            if ((desenhado || real) && (n.points || n.regions)) items.push({ unit: file.replace('.json', ''), id: String(n.id), diagramId: desenhado ? n.diagramId : undefined, imageId: real ? n.imageId : undefined, points: n.points, regions: n.regions });
            Object.values(node).forEach(walk);
        };
        walk(JSON.parse(fs.readFileSync(path.join(dir, file), 'utf8')));
    }
    const frameOf = (item: Item) => {
        const spec = item.imageId ? imagens.find(img => img.id === item.imageId)! : (DIAGRAMS as Record<string, { width: number; height: number }>)[item.diagramId!];
        return { width: 280, height: (280 * spec.height) / spec.width };
    };
    const gap = (a: Box, b: Box) =>
        Math.hypot(Math.max(0, a.left - (b.left + b.width), b.left - (a.left + a.width)), Math.max(0, a.top - (b.top + b.height), b.top - (a.top + a.height)));
    const labels = items.filter(item => item.points && item.points.length > 1);

    it('encontra os 90 itens de figura das 40 unidades (75 de desenho e 15 de imagem real)', () => {
        expect(items.length).toBe(90);
        expect(items.filter(item => item.imageId).length).toBe(15);
    });

    it('rotular: nenhum selo cobre o ponto de outro alvo nem fica mais perto dele que do próprio ponto (mais 8 pt)', () => {
        const falhas: string[] = [];
        for (const item of labels) {
            const frame = frameOf(item);
            const seals = labelBadgeBoxes(item.points!, frame);
            const dots = item.points!.map(p => ({ left: p.x * frame.width - LABEL_DOT / 2, top: p.y * frame.height - LABEL_DOT / 2, width: LABEL_DOT, height: LABEL_DOT }));
            seals.forEach((seal, i) => dots.forEach((dot, j) => {
                if (i !== j && gap(seal, dot) < gap(seal, dots[i]) + 8) falhas.push(`${item.unit} ${item.id} selo ${i + 1} perto do ponto ${j + 1}`);
            }));
        }
        expect(falhas).toEqual([]);
    });

    it('m17-05 i2 (itens de emergência): o selo do "5" fica fora da área de toque do botão de chamada (ponto 4)', () => {
        const item = items.find(entry => entry.unit === 'm17' && entry.diagramId === 'itens-de-emergencia-da-sala' && entry.points)!;
        const frame = frameOf(item);
        const seals = labelBadgeBoxes(item.points!, frame);
        expect(touchRectsOverlap(seals[4], touchRect(item.points![3], frame))).toBe(false);
    });

    it('M29.04 empilha a mesma fatia e mantém a gordura do painel inferior como resposta', () => {
        const imageId = 'image:rtg-2026:m29:rm-supressao-gordura-01';
        const item = items.find(entry => entry.imageId === imageId && entry.id === 'i3')!;
        const frame = frameOf(item);
        const [gorduraAcima, gorduraAbaixo, colunaAcima, colunaAbaixo] = item.regions!;
        expect(frame.height).toBeGreaterThan(frame.width);
        expect(item.regions!.map(region => Boolean(region.correct))).toEqual([false, true, false, false]);
        expect(gorduraAcima.y + gorduraAcima.height).toBeLessThan(colunaAcima.y);
        expect(colunaAcima.y + colunaAcima.height).toBeLessThan(0.5);
        expect(gorduraAbaixo.y).toBeGreaterThan(0.5);
        expect(gorduraAbaixo.y + gorduraAbaixo.height).toBeLessThan(colunaAbaixo.y);
        expect(gorduraAcima.x).toBeCloseTo(gorduraAbaixo.x, 4);
        expect(colunaAcima.x).toBeCloseTo(colunaAbaixo.x, 4);
    });

    it('tocar e caça ao risco: nenhum selo encosta (menos de 3 pt) em outra região', () => {
        const falhas: string[] = [];
        for (const item of items.filter(entry => entry.regions && entry.regions.length > 1)) {
            const frame = frameOf(item);
            const seals = badgeBoxes(item.regions!, frame);
            const rects = item.regions!.map(r => ({ left: r.x * frame.width, top: r.y * frame.height, width: r.width * frame.width, height: r.height * frame.height }));
            seals.forEach((seal, i) => rects.forEach((rect, j) => {
                if (i !== j && gap(seal, rect) < 3) falhas.push(`${item.unit} ${item.id} selo ${i + 1} junto da região ${j + 1}`);
            }));
        }
        expect(falhas).toEqual([]);
    });
});
