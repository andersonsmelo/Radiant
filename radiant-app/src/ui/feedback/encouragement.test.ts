import { encouragementFor, type EncouragementMoment } from './encouragement';

const MOMENTS: readonly EncouragementMoment[] = [
  { kind: 'sequencia', milestone: 3 }, { kind: 'sequencia', milestone: 5 }, { kind: 'sequencia', milestone: 10 },
  { kind: 'retomada' }, { kind: 'aula-sem-erro' },
];

/** Todas as frases que um momento pode dar, percorrendo o rodízio. */
function phrases(moment: EncouragementMoment): string[] {
  return [...new Set(Array.from({ length: 12 }, (_, turn) => encouragementFor(moment, turn)))];
}

describe('incentivo nos marcos da aula (F3)', () => {
  it.each(MOMENTS)('%o varia: pelo menos duas frases, e duas vezes seguidas nunca a mesma', (moment) => {
    expect(phrases(moment).length).toBeGreaterThanOrEqual(2);
    for (let turn = 0; turn < 11; turn += 1) {
      expect(encouragementFor(moment, turn)).not.toBe(encouragementFor(moment, turn + 1));
    }
  });

  it.each(MOMENTS)('%o é determinístico pelo turno, para a tela e o teste concordarem', (moment) => {
    expect(encouragementFor(moment, 7)).toBe(encouragementFor(moment, 7));
  });

  it('a sequência diz o número de acertos, por extenso ou em algarismo', () => {
    for (const milestone of [3, 5, 10] as const) {
      const numero = { 3: /três|3/iu, 5: /cinco|5/iu, 10: /dez|10/iu }[milestone];
      for (const frase of phrases({ kind: 'sequencia', milestone })) expect(frase).toMatch(numero);
    }
  });

  it.each(MOMENTS)('%o é curto, sem exagero e nunca pune', (moment) => {
    for (const frase of phrases(moment)) {
      expect(frase.length).toBeLessThanOrEqual(60);
      // Sem exclamação, caixa alta de ênfase ou travessão (contrato de copy).
      expect(frase).not.toMatch(/!|—|\b[A-ZÁÉÍÓÚÂÊÔÃÕÇ]{3,}\b/u);
      expect(frase).not.toMatch(/errou|falhou|ruim|fraco|de novo não|cuidado|perdeu/iu);
    }
  });

  it('frases diferentes entre os momentos: a retomada não repete a aula sem erro', () => {
    const retomada = new Set(phrases({ kind: 'retomada' }));
    for (const frase of phrases({ kind: 'aula-sem-erro' })) expect(retomada.has(frase)).toBe(false);
  });
});
