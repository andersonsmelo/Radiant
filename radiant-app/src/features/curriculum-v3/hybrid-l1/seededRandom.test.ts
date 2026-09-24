import { createRng, shuffled } from './seededRandom';

describe('sorteio determinístico', () => {
  it('a mesma semente gera a mesma sequência', () => {
    const a = createRng(7);
    const b = createRng(7);
    expect([a(), a(), a()]).toEqual([b(), b(), b()]);
  });

  it('gera números em [0, 1)', () => {
    const rng = createRng(3);
    for (let i = 0; i < 200; i += 1) {
      const value = rng();
      expect(value).toBeGreaterThanOrEqual(0);
      expect(value).toBeLessThan(1);
    }
  });

  it('embaralha sem perder nem repetir itens', () => {
    expect([...shuffled([1, 2, 3, 4], createRng(1))].sort()).toEqual([1, 2, 3, 4]);
  });

  it('sementes diferentes mudam a ordem em algum dos sorteios', () => {
    const orders = new Set(Array.from({ length: 20 }, (_, seed) => shuffled(['a', 'b'], createRng(seed)).join('')));
    expect(orders.size).toBe(2);
  });
});
