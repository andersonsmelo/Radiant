import { DEFAULT_POSTER_FRAME, resolvePlayback } from './illustrationPlayback';

// A decisão de como a ilustração de tema toca, separada do Skia para que o Jest
// a teste sem rasterizar nada. As regras pinadas no plano 1 (tarefa 5):
// bloqueado é sempre silhueta parada; "reduzir movimento" é quadro parado; e o
// quadro parado é o de pose principal declarado no JSON, nunca o quadro 0, que
// pode estar vazio (fótons ainda invisíveis, feixe apagado).

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
