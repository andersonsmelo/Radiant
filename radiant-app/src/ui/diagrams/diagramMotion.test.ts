import { diagramSvgAt, layerStateAt } from './diagramMotion';
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
