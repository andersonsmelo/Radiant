import {
  MEDAL_RADIUS,
  NEXT_MEDAL_RADIUS,
  REVIEW_MEDAL_RADIUS,
  TRAIL_DOT_PERIOD,
  TRAIL_LEAD,
  TRAIL_PATH_STROKE,
  TRAIL_RING_ROOM,
  TRAIL_SEAM_PHASE,
  TRAIL_SIDE_GAP,
  incomingPath,
  medalOffsetX,
  medalRadiusFor,
  outgoingPath,
  trailTitleWidth,
} from './trailLayout';

/** Os números de um `d` como `M10,5 H40 Q60,5 60,30 V120`. */
function numbers(d: string): number[] {
  return (d.match(/-?\d+(\.\d+)?/g) ?? []).map(Number);
}

describe('medalOffsetX — os nós alternam entre esquerda e direita', () => {
  it('a 35% da meia-largura, começando pela esquerda, como na prancheta', () => {
    const offsets = [0, 1, 2, 3, 4, 5, 6, 7, 8].map((index) => medalOffsetX(index, 100, false));
    const expected = [-35, 35, -35, 35, -35, 35, -35, 35, -35];

    offsets.forEach((offset, index) => expect(offset).toBeCloseTo(expected[index], 10));
  });

  it('em coluna (texto grande) fica sempre no centro', () => {
    for (let index = 0; index < 9; index += 1) {
      expect(medalOffsetX(index, 100, true)).toBe(0);
    }
  });
});

describe('trailLayout — medidas da prancheta', () => {
  it('medalha de raio 34, 40 na próxima e 30 na revisão', () => {
    expect(MEDAL_RADIUS).toBe(34);
    expect(NEXT_MEDAL_RADIUS).toBe(40);
    expect(medalRadiusFor('lesson', false)).toBe(34);
    expect(medalRadiusFor('review', false)).toBe(REVIEW_MEDAL_RADIUS);
    expect(medalRadiusFor('review', true)).toBe(40);
  });

  it('deixa folga para o anel da próxima, que cresce até 1,18 do raio', () => {
    // O anel pulsa para fora da caixa da medalha. Sem esta folga ele encostaria
    // no fim do pontilhado de cima e seria cortado no primeiro nó da lista.
    expect(TRAIL_RING_ROOM).toBeGreaterThanOrEqual(Math.ceil(NEXT_MEDAL_RADIUS * 0.18));
  });

  it('o título ocupa até a meia-largura menos 16', () => {
    expect(trailTitleWidth(185)).toBe(169);
  });
});

describe('outgoingPath — o trecho sai da lateral da medalha', () => {
  const half = 185;
  const fromX = medalOffsetX(0, half, false);
  const toX = medalOffsetX(1, half, false);

  it('nasce na lateral, na altura do centro, corre na horizontal e desce na vertical do seguinte', () => {
    const path = outgoingPath(fromX, toX, MEDAL_RADIUS, 120);
    const [startX, startY, turnX, , , endX, endY, bottom] = numbers(path.d);

    expect(path.d).toMatch(/^M[\d.]+,[\d.]+ H[\d.]+ Q[\d.]+,[\d.]+ [\d.]+,[\d.]+ V[\d.]+$/);
    expect(startX + path.left).toBeCloseTo(fromX + MEDAL_RADIUS + TRAIL_SIDE_GAP, 6);
    expect(startY).toBe(TRAIL_PATH_STROKE / 2);
    expect(turnX).toBeGreaterThan(startX);
    expect(endX + path.left).toBeCloseTo(toX, 6);
    expect(endY).toBeGreaterThan(startY);
    expect(bottom).toBe(120);
  });

  it('para a esquerda, sai pela lateral esquerda', () => {
    const path = outgoingPath(toX, fromX, MEDAL_RADIUS, 120);
    const [startX] = numbers(path.d);

    expect(startX + path.left).toBeCloseTo(toX - MEDAL_RADIUS - TRAIL_SIDE_GAP, 6);
  });

  it('o desenho tem folga de um traço inteiro dos dois lados, para nenhum ponto ser cortado', () => {
    const path = outgoingPath(fromX, toX, MEDAL_RADIUS, 120);
    const xs = numbers(path.d).filter((_, index) => [0, 2, 3, 5].includes(index));

    expect(Math.min(...xs)).toBeGreaterThanOrEqual(TRAIL_PATH_STROKE);
    expect(path.width - Math.max(...xs)).toBeGreaterThanOrEqual(TRAIL_PATH_STROKE);
  });

  it('o comprimento soma a horizontal, a curva e a descida', () => {
    const path = outgoingPath(fromX, toX, MEDAL_RADIUS, 120);
    const horizontal = toX - (fromX + MEDAL_RADIUS + TRAIL_SIDE_GAP);
    const vertical = 120 - TRAIL_PATH_STROKE / 2;

    // A curva é mais curta que o canto em L que ela corta, e mais longa que a diagonal.
    expect(path.length).toBeLessThan(horizontal + vertical);
    expect(path.length).toBeGreaterThan(Math.hypot(horizontal, vertical));
  });

  it('na costura, o último ponto de cima e o primeiro de baixo distam um período', () => {
    const out = outgoingPath(fromX, toX, MEDAL_RADIUS, 117.3);
    const lead = incomingPath(toX);
    // Um ponto acende em `s` quando (s + offset) mod período cai em [0, 1).
    const lastDot = out.length - (((out.length + out.dashOffset) % TRAIL_DOT_PERIOD));
    const firstDot = (TRAIL_DOT_PERIOD - (lead.dashOffset % TRAIL_DOT_PERIOD)) % TRAIL_DOT_PERIOD;

    expect(out.length - lastDot).toBeCloseTo(TRAIL_SEAM_PHASE, 6);
    expect(firstDot).toBeCloseTo(TRAIL_SEAM_PHASE, 6);
    expect(out.length - lastDot + firstDot).toBeCloseTo(TRAIL_DOT_PERIOD, 6);
  });

  it('o ponto da descida que chega cabe inteiro na linha', () => {
    expect(TRAIL_SEAM_PHASE + TRAIL_PATH_STROKE / 2).toBeLessThanOrEqual(TRAIL_LEAD);
  });

  it('em coluna é só a descida, na vertical do centro', () => {
    const path = outgoingPath(0, 0, MEDAL_RADIUS, 24);
    const [x] = numbers(path.d);

    expect(path.d).toMatch(/^M[\d.]+,[\d.]+ V[\d.]+$/);
    expect(x + path.left).toBe(0);
  });
});
