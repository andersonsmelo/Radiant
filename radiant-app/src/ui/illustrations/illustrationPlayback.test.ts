import { DEFAULT_POSTER_FRAME, posterFrameOrDefault, resolvePlayback } from './illustrationPlayback';

// A decisão de como a ilustração de tema toca, separada do Skia para que o Jest
// a teste sem rasterizar nada. As regras pinadas no plano 1 (tarefa 5):
// bloqueado é sempre silhueta parada; "reduzir movimento" é quadro parado; e o
// quadro parado é o de pose principal declarado no JSON, nunca o quadro 0, que
// pode estar vazio (fótons ainda invisíveis, feixe apagado).

let warn: jest.SpyInstance;

beforeEach(() => {
  warn = jest.spyOn(console, 'warn').mockImplementation(() => undefined);
});

afterEach(() => {
  warn.mockRestore();
});

describe('resolvePlayback', () => {
  it.each([
    { state: 'done', reducedMotion: false, mode: 'animate', frame: null },
    { state: 'next', reducedMotion: false, mode: 'animate', frame: null },
    { state: 'done', reducedMotion: true, mode: 'still', frame: DEFAULT_POSTER_FRAME },
    { state: 'next', reducedMotion: true, mode: 'still', frame: DEFAULT_POSTER_FRAME },
    { state: 'locked', reducedMotion: false, mode: 'silhouette', frame: DEFAULT_POSTER_FRAME },
    { state: 'locked', reducedMotion: true, mode: 'silhouette', frame: DEFAULT_POSTER_FRAME },
  ] as const)('$state com reducedMotion=$reducedMotion dá $mode', ({ state, reducedMotion, mode, frame }) => {
    expect(resolvePlayback({ state, reducedMotion })).toEqual({ mode, frame });
  });

  it('o quadro parado é o posterFrame declarado', () => {
    expect(resolvePlayback({ state: 'done', reducedMotion: true, posterFrame: 37 })).toEqual({
      mode: 'still',
      frame: 37,
    });
    expect(resolvePlayback({ state: 'locked', reducedMotion: false, posterFrame: 37 })).toEqual({
      mode: 'silhouette',
      frame: 37,
    });
  });

  it.each([0, -4, Number.NaN, Number.POSITIVE_INFINITY, undefined])(
    'frame nunca é 0, nem com posterFrame=%p',
    (posterFrame) => {
      for (const state of ['done', 'next', 'locked'] as const) {
        for (const reducedMotion of [false, true]) {
          const { frame } = resolvePlayback({ state, reducedMotion, posterFrame });
          // Válido e diferente de 0: um quadro parado que existe.
          if (frame !== null) {
            expect(Number.isFinite(frame)).toBe(true);
            expect(frame).toBeGreaterThan(0);
          }
        }
      }
    },
  );

  it('o padrão é um quadro válido, não o 0', () => {
    expect(Number.isFinite(DEFAULT_POSTER_FRAME)).toBe(true);
    expect(DEFAULT_POSTER_FRAME).toBeGreaterThan(0);
  });
});

// O quadro de pose é um quadro do laço: inteiro, de 1 a op − 1. O 0 pode estar
// vazio e o op já é o 0 da volta seguinte. Um JSON que não o declara, ou o
// declara fora disso, cai no padrão, e avisa: sem o aviso, o defeito seria
// silencioso justamente no tema novo.
describe('posterFrameOrDefault', () => {
  it('aceita o inteiro de 1 a op − 1, sem avisar', () => {
    for (const posterFrame of [1, 60, 143]) {
      expect(posterFrameOrDefault(posterFrame, { totalFrames: 144, label: 'valido' })).toBe(posterFrame);
    }
    expect(warn).not.toHaveBeenCalled();
  });

  it.each([
    ['ausente', undefined],
    ['0', 0],
    ['igual a op', 144],
    ['além de op', 200],
    ['fracionário', 37.5],
    ['negativo', -4],
    ['NaN', Number.NaN],
  ])('posterFrame %s cai no padrão e avisa uma vez', (name, posterFrame) => {
    const label = `tema ${name}`;
    for (let call = 0; call < 3; call += 1) {
      expect(posterFrameOrDefault(posterFrame, { totalFrames: 144, label })).toBe(DEFAULT_POSTER_FRAME);
    }
    expect(warn).toHaveBeenCalledTimes(1);
    expect(String(warn.mock.calls[0][0])).toContain(label);
  });

  it('avisa uma vez por ilustração, e não uma só na sessão', () => {
    posterFrameOrDefault(undefined, { totalFrames: 144, label: 'primeira' });
    posterFrameOrDefault(undefined, { totalFrames: 144, label: 'segunda' });
    expect(warn).toHaveBeenCalledTimes(2);
  });

  it('resolvePlayback nunca para no op do laço', () => {
    expect(
      resolvePlayback({ state: 'done', reducedMotion: true, posterFrame: 144, totalFrames: 144, label: 'op' }),
    ).toEqual({ mode: 'still', frame: DEFAULT_POSTER_FRAME });
    expect(
      resolvePlayback({ state: 'locked', reducedMotion: false, posterFrame: 143, totalFrames: 144, label: 'op' }),
    ).toEqual({ mode: 'silhouette', frame: 143 });
  });
});
