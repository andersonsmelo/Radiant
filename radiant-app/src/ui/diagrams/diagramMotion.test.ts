import { diagramSvgAt, groupLayers, layerFrameSvg, layerOrigin, layerStateAt, layerStyleAt, motionKeysError } from './diagramMotion';
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

  it('translate em once chega a dx no progresso 1 e não dá a volta', () => {
    const m = motion({ kind: 'translate', dx: 40, dy: 0, mode: 'once' });
    expect(layerStateAt(m, 0).translateX).toBeCloseTo(0);
    expect(layerStateAt(m, 0.5).translateX).toBeCloseTo(20);
    expect(layerStateAt(m, 1).translateX).toBeCloseTo(40);
    expect(layerStateAt(m, 1.4).translateX).toBeCloseTo(40);
    expect(layerStateAt(m, -0.2).translateX).toBeCloseTo(0);
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

  it('range restringe o movimento ao trecho a..b da fração e segura fora dele', () => {
    const arm = motion({ kind: 'translate', dx: 0, dy: 10, mode: 'pingpong', range: [0, 0.5] });
    expect(layerStateAt(arm, 0).translateY).toBeCloseTo(0);
    expect(layerStateAt(arm, 0.125).translateY).toBeCloseTo(5);
    // Fração 0,5 a 1 (progresso 0,25 a 0,75): parado embaixo.
    expect(layerStateAt(arm, 0.25).translateY).toBeCloseTo(10);
    expect(layerStateAt(arm, 0.5).translateY).toBeCloseTo(10);
    expect(layerStateAt(arm, 0.75).translateY).toBeCloseTo(10);
    expect(layerStateAt(arm, 0.875).translateY).toBeCloseTo(5);
    const beam = motion({ kind: 'fade', from: 0, to: 1, mode: 'pingpong', range: [0.9, 1] });
    expect(layerStateAt(beam, 0.4).opacity).toBeCloseTo(0);
    expect(layerStateAt(beam, 0.475).opacity).toBeCloseTo(0.5);
    expect(layerStateAt(beam, 0.5).opacity).toBeCloseTo(1);
    expect(layerStateAt(beam, 0.6).opacity).toBeCloseTo(0);
    const once = motion({ kind: 'fade', from: 0, to: 1, mode: 'once', range: [0.5, 1] });
    expect(layerStateAt(once, 0.25).opacity).toBeCloseTo(0);
    expect(layerStateAt(once, 0.75).opacity).toBeCloseTo(0.5);
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

describe('keys e ease', () => {
  const pulse = motion({
    kind: 'fade',
    from: 0,
    to: 1,
    mode: 'loop',
    keys: [[0, 0], [0.3, 1], [0.6, 1], [0.8, 0], [1, 0]],
  });

  it('keys desenham acende, segura e apaga dentro de um ciclo', () => {
    expect(layerStateAt(pulse, 0).opacity).toBeCloseTo(0);
    expect(layerStateAt(pulse, 0.45).opacity).toBeCloseTo(1);
    expect(layerStateAt(pulse, 0.7).opacity).toBeCloseTo(0.5);
    expect(layerStateAt(pulse, 0.9).opacity).toBeCloseTo(0);
  });

  it('ease inOut: smoothstep da rampa, com valor numérico', () => {
    const base = { kind: 'translate', dx: 100, dy: 0, mode: 'once' } as const;
    expect(layerStateAt(motion(base), 0.25).translateX).toBeCloseTo(25);
    expect(layerStateAt(motion({ ...base, ease: 'inOut' }), 0.25).translateX).toBeCloseTo(15.625);
    expect(layerStateAt(motion({ ...base, ease: 'inOut' }), 0.5).translateX).toBeCloseTo(50);
    expect(layerStateAt(motion({ ...base, ease: 'linear' }), 0.25).translateX).toBeCloseTo(25);
  });

  it('ease inOut vale por trecho de keys: smoothstep em cada um e nós preservados', () => {
    const m = motion({ kind: 'fade', from: 0, to: 1, mode: 'loop', keys: [[0, 0], [0.5, 1], [1, 0]], ease: 'inOut' });
    expect(layerStateAt(m, 0.125).opacity).toBeCloseTo(0.15625);
    expect(layerStateAt(m, 0.5).opacity).toBeCloseTo(1);
    expect(layerStateAt(m, 0.625).opacity).toBeCloseTo(0.84375);
    expect(layerStateAt(m, 0.75).opacity).toBeCloseTo(0.5);
    // Sem ease, o mesmo trecho é linear.
    expect(layerStateAt({ ...m, ease: undefined }, 0.125).opacity).toBeCloseTo(0.25);
  });

  describe('motionKeysError, uma regra por teste', () => {
    const err = (keys: [number, number][]) => motionKeysError(motion({ kind: 'fade', from: 0, to: 1, mode: 'loop', keys }));
    it('aceita keys válidas e movimento sem keys', () => {
      expect(motionKeysError(pulse)).toBeNull();
      expect(motionKeysError(motion({ kind: 'fade', from: 0, to: 1, mode: 'loop' }))).toBeNull();
      expect(motionKeysError(undefined)).toBeNull();
    });
    it('recusa tempo fora de ordem', () => expect(err([[0, 0], [0.6, 1], [0.3, 0]])).toMatch(/ordem/));
    it('recusa tempo repetido (ordem estrita)', () => expect(err([[0, 0], [0.5, 1], [0.5, 0]])).toMatch(/ordem/));
    it('recusa tempo fora de 0 a 1', () => expect(err([[0, 0], [1.2, 1]])).toMatch(/0 a 1/));
    it('recusa tempo negativo', () => expect(err([[-0.1, 0], [1, 1]])).toMatch(/0 a 1/));
    it('recusa valor fora de 0 a 1', () => expect(err([[0, 0], [0.5, -0.1]])).toMatch(/0 a 1/));
    it('recusa valor acima de 1', () => expect(err([[0, 0], [0.5, 1.1]])).toMatch(/0 a 1/));
    it('recusa NaN', () => expect(err([[0, 0], [Number.NaN, 1]])).toMatch(/0 a 1/));
    it('recusa um ponto só', () => expect(err([[0, 0]])).toMatch(/duas/));
    it('recusa lista vazia', () => expect(err([])).toMatch(/duas/));
    const rangeErr = (range: [number, number]) => motionKeysError(motion({ kind: 'fade', from: 0, to: 1, mode: 'loop', range }));
    it('aceita range crescente dentro de 0 a 1', () => expect(rangeErr([0.2, 0.8])).toBeNull());
    it('recusa range de largura zero (0/0 daria NaN)', () => expect(rangeErr([0.5, 0.5])).toMatch(/range/));
    it('recusa range invertido', () => expect(rangeErr([0.8, 0.2])).toMatch(/range/));
    it('recusa range fora de 0 a 1', () => expect(rangeErr([0.2, 1.4])).toMatch(/range/));
  });
});
