import { PIXEL_EXPRESSIONS, type PixelExpression } from './pixelExpressions';

const TODAS: PixelExpression[] = [
  'neutro', 'feliz', 'orgulhoso', 'emburrado', 'revirando', 'surpreso', 'pensando',
];

describe('catálogo de expressões do Pixel', () => {
  it('define todas as sete expressões', () => {
    expect(Object.keys(PIXEL_EXPRESSIONS).sort()).toEqual([...TODAS].sort());
  });

  it('mantém cada forma dentro da tela', () => {
    for (const nome of TODAS) {
      const f = PIXEL_EXPRESSIONS[nome];
      expect(f.eyeW).toBeGreaterThan(0);
      expect(f.eyeW).toBeLessThanOrEqual(0.4);
      expect(f.eyeH).toBeGreaterThan(0);
      expect(f.eyeH).toBeLessThanOrEqual(0.8);
      expect(f.mouthW).toBeGreaterThan(0);
      expect(f.mouthW).toBeLessThanOrEqual(0.6);
      // Mergulho fora desta faixa desenha boca saindo da tela.
      expect(Math.abs(f.mouthDip)).toBeLessThanOrEqual(0.5);
      expect(f.mouthThickness).toBeGreaterThan(0);
      expect(f.mouthThickness).toBeLessThanOrEqual(0.15);
    }
  });

  it('só sorri quando a expressão é positiva', () => {
    expect(PIXEL_EXPRESSIONS.feliz.mouthDip).toBeGreaterThan(0);
    expect(PIXEL_EXPRESSIONS.orgulhoso.mouthDip).toBeGreaterThan(0);
    // O sinal já saiu invertido uma vez, num mockup: em coordenada de tela o y
    // cresce para baixo, então sorriso é mergulho POSITIVO. Este caso existe
    // para que a inversão volte a falhar aqui, e não na cara do usuário.
    expect(PIXEL_EXPRESSIONS.emburrado.mouthDip).toBeLessThan(0);
    expect(PIXEL_EXPRESSIONS.revirando.mouthDip).toBeLessThan(0);
  });
});
