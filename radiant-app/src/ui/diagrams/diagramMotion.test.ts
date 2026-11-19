import { diagramSvgAt, groupLayers, layerFrameSvg, layerOrigin, layerStateAt, layerStyleAt } from './diagramMotion';
import type { DiagramLayer } from './diagramTypes';

const motion = (m: NonNullable<DiagramLayer['motion']>) => m;

describe('layerStateAt', () => {
  it('sem movimento devolve a identidade', () => {
    expect(layerStateAt(undefined, 0.37)).toEqual({ translateX: 0, translateY: 0, rotateDeg: 0, scale: 1, opacity: 1 });
  });

  it('translate em loop vai de 0 a dx e volta a 0 no progresso 1', () => {
    const m = motion({ kind: 'translate', dx: 40, dy: -10, mode: 'loop' });
    expect(layerStateAt(m, 0)).toMatchObject({ translateX: 0 });
    expect(layerStateAt(m, 0.5)).toMatchObject({ translateX: 20, translateY: -5 });
    expect(layerStateAt(m, 0.999).translateX).toBeCloseTo(40, 0);
    expect(layerStateAt(m, 1).translateX).toBe(0);
  });

  it('translate em pingpong passa por dx em 0,5 e volta', () => {
    const m = motion({ kind: 'translate', dx: 40, dy: 0, mode: 'pingpong' });
    expect(layerStateAt(m, 0).translateX).toBe(0);
    expect(layerStateAt(m, 0.25).translateX).toBeCloseTo(20);
    expect(layerStateAt(m, 0.5).translateX).toBeCloseTo(40);
    expect(layerStateAt(m, 0.75).translateX).toBeCloseTo(20);
    expect(layerStateAt(m, 1).translateX).toBeCloseTo(0);
  });

  it('phase desloca o ciclo, inclusive para valor negativo', () => {
    const m = motion({ kind: 'translate', dx: 40, dy: 0, mode: 'loop', phase: 0.25 });
    expect(layerStateAt(m, 0).translateX).toBeCloseTo(10);
    expect(layerStateAt(m, 0.75).translateX).toBeCloseTo(0);
    expect(layerStateAt({ ...m, phase: -0.25 }, 0).translateX).toBeCloseTo(30);
  });

  it('rotate dá degrees vezes o progresso', () => {
    const m = motion({ kind: 'rotate', degrees: 90, cx: 10, cy: 10, mode: 'loop' });
    expect(layerStateAt(m, 0.5).rotateDeg).toBeCloseTo(45);
  });

  it('fade e scale interpolam', () => {
    expect(layerStateAt(motion({ kind: 'fade', from: 0.2, to: 1, mode: 'pingpong' }), 0.5).opacity).toBeCloseTo(1);
    expect(layerStateAt(motion({ kind: 'fade', from: 0.2, to: 1, mode: 'loop' }), 0.5).opacity).toBeCloseTo(0.6);
    expect(layerStateAt(motion({ kind: 'scale', from: 1, to: 2, cx: 0, cy: 0, mode: 'loop' }), 0.5).scale).toBeCloseTo(1.5);
  });
});

describe('diagramSvgAt', () => {
  const spec = {
    id: 'x',
    alt: 'x',
    width: 100,
    height: 50,
    layers: [{ svg: '<rect width="1" height="1"/>', motion: { kind: 'translate' as const, dx: 10, dy: 0, mode: 'loop' as const } }],
  };

  it('aplica o estado da camada no instante pedido', () => {
    expect(diagramSvgAt(spec, 0.5)).toContain('<g transform="translate(5 0)"><rect width="1" height="1"/></g>');
  });

  it('declara o quadro do desenho', () => {
    expect(diagramSvgAt(spec, 0)).toMatch(/^<svg [^>]*viewBox="0 0 100 50"/);
  });
});

describe('camada ampliada na tela', () => {
  type Pt = [number, number];
  // O que a view faz: ocupa 3 larguras por 3 alturas, desloca -1 de cada, e o RN
  // aplica escala, giro e translação em torno da origem, nessa ordem.
  function onScreen(motion: NonNullable<DiagramLayer['motion']>, progress: number, [px, py]: Pt, W: number, H: number, screenW: number): Pt {
    const k = screenW / W; // pixels por unidade do desenho
    const viewW = 3 * W * k;
    const viewH = 3 * H * k;
    const o = layerOrigin(motion, W, H);
    const [ox, oy] = [(o.x / 100) * viewW, (o.y / 100) * viewH];
    const st = layerStyleAt(motion, progress, W, H);
    let [x, y] = [(px + W) * k, (py + H) * k]; // ponto dentro da view
    [x, y] = [ox + (x - ox) * st.scale, oy + (y - oy) * st.scale];
    const a = (st.rotateDeg * Math.PI) / 180;
    [x, y] = [ox + (x - ox) * Math.cos(a) - (y - oy) * Math.sin(a), oy + (x - ox) * Math.sin(a) + (y - oy) * Math.cos(a)];
    [x, y] = [x + (st.translateXPercent / 100) * viewW, y + (st.translateYPercent / 100) * viewH];
    return [x / k - W, y / k - H]; // de volta às unidades do desenho, no quadro
  }
  // O mesmo ponto como o `<g transform>` de `diagramSvgAt` o põe.
  function inSvg(layer: DiagramLayer, progress: number, [px, py]: Pt): Pt {
    const spec = { id: 'x', alt: 'x', width: 200, height: 100, layers: [layer] };
    const t = diagramSvgAt(spec, progress).match(/transform="([^"]*)"/)![1];
    let [x, y] = [px, py];
    for (const [, fn, args] of [...t.matchAll(/(\w+)\(([^)]*)\)/g)].reverse()) {
      const v = args.split(' ').map(Number);
      if (fn === 'translate') [x, y] = [x + v[0], y + v[1]];
      if (fn === 'scale') [x, y] = [x * v[0], y * v[0]];
      if (fn === 'rotate') {
        const a = (v[0] * Math.PI) / 180;
        [x, y] = [v[1] + (x - v[1]) * Math.cos(a) - (y - v[2]) * Math.sin(a), v[2] + (x - v[1]) * Math.sin(a) + (y - v[2]) * Math.cos(a)];
      }
    }
    return [x, y];
  }
  const motions: NonNullable<DiagramLayer['motion']>[] = [
    { kind: 'rotate', degrees: 40, cx: 60, cy: 30, mode: 'pingpong' },
    { kind: 'scale', from: 1, to: 1.6, cx: 150, cy: 20, mode: 'loop' },
    { kind: 'translate', dx: 30, dy: -12, mode: 'pingpong' },
  ];

  it.each(motions)('$kind: um ponto vai onde diagramSvgAt o põe, em duas larguras de tela', (motion) => {
    for (const screenW of [320, 411]) {
      for (const progress of [0.25, 0.5, 0.8]) {
        for (const p of [[10, 90], [190, 95], [60, 30]] as Pt[]) {
          const [x, y] = onScreen(motion, progress, p, 200, 100, screenW);
          const [ex, ey] = inSvg({ svg: '', motion }, progress, p);
          expect(x).toBeCloseTo(ex, 6);
          expect(y).toBeCloseTo(ey, 6);
        }
      }
    }
  });

  it.each(motions.slice(0, 2))('$kind: o centro (cx, cy) fica fixo', (motion) => {
    if (motion.kind === 'translate' || motion.kind === 'fade') return;
    for (const screenW of [320, 411]) {
      const [x, y] = onScreen(motion, 0.5, [motion.cx, motion.cy], 200, 100, screenW);
      expect(x).toBeCloseTo(motion.cx, 6);
      expect(y).toBeCloseTo(motion.cy, 6);
    }
  });

  it('a view ampliada cobre uma largura e uma altura de cada lado', () => {
    const spec = { id: 'x', alt: 'x', width: 200, height: 100, layers: [] };
    expect(layerFrameSvg(spec, { svg: '<g/>' })).toContain('viewBox="-200 -100 600 300"');
  });

  it('groupLayers junta as paradas contíguas e deixa cada móvel sozinha', () => {
    const still = { svg: 'a' };
    const moving = { svg: 'b', motion: { kind: 'fade' as const, from: 0, to: 1, mode: 'loop' as const } };
    expect(groupLayers([still, still, moving, moving, still]).map((g) => g.length)).toEqual([2, 1, 1, 1]);
  });
});
