import {
  MEDAL_RADIUS,
  NEXT_MEDAL_RADIUS,
  TRAIL_RING_ROOM,
  medalOffsetX,
} from './trailLayout';

describe('medalOffsetX — o zigue-zague da trilha', () => {
  it('segue o ciclo de oito posições da prancheta, em fração da meia-largura', () => {
    const offsets = [0, 1, 2, 3, 4, 5, 6, 7, 8].map((index) => medalOffsetX(index, 100, false));
    const expected = [0, 22, 30, 22, 0, -22, -30, -22, 0];

    offsets.forEach((offset, index) => expect(offset).toBeCloseTo(expected[index], 10));
  });

  it('nunca passa de 30% da meia-largura', () => {
    for (let index = 0; index < 40; index += 1) {
      expect(Math.abs(medalOffsetX(index, 180, false))).toBeLessThanOrEqual(0.3 * 180 + 1e-9);
    }
  });

  it('em coluna (texto grande) fica sempre no centro', () => {
    for (let index = 0; index < 9; index += 1) {
      expect(medalOffsetX(index, 100, true)).toBe(0);
    }
  });
});

describe('trailLayout — medidas da prancheta', () => {
  it('medalha de raio 34, e 40 na próxima', () => {
    expect(MEDAL_RADIUS).toBe(34);
    expect(NEXT_MEDAL_RADIUS).toBe(40);
  });

  it('deixa folga para o anel da próxima, que cresce até 1,18 do raio', () => {
    // O anel pulsa para fora da caixa da medalha. Sem esta folga ele encostaria
    // no fim do pontilhado de cima e seria cortado no primeiro nó da lista.
    expect(TRAIL_RING_ROOM).toBeGreaterThanOrEqual(Math.ceil(NEXT_MEDAL_RADIUS * 0.18));
  });
});
