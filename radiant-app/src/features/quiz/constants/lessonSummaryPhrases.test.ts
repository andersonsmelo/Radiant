import { LESSON_SUMMARY_PHRASES, pickSummaryPhrase } from './lessonSummaryPhrases';

describe('lessonSummaryPhrases', () => {
  it('tem ao menos três frases em cada faixa', () => {
    ([0, 1, 2, 3] as const).forEach((stars) => {
      expect(LESSON_SUMMARY_PHRASES[stars].length).toBeGreaterThanOrEqual(3);
    });
  });

  it('não celebra a faixa zero', () => {
    LESSON_SUMMARY_PHRASES[0].forEach((frase) => {
      expect(frase.toLowerCase()).not.toContain('parabéns');
    });
  });

  it('escolhe pela faixa informada', () => {
    const frase = pickSummaryPhrase(3, null, () => 0);
    expect(frase).toBe(LESSON_SUMMARY_PHRASES[3][0]);
  });

  it('não repete a frase anterior', () => {
    const anterior = LESSON_SUMMARY_PHRASES[2][0];
    const frase = pickSummaryPhrase(2, anterior, () => 0);
    expect(frase).not.toBe(anterior);
  });

  // 0 estrela é zero acerto: nenhuma frase pode supor quase acerto. E a lição
  // de 0 estrela conta como concluída na trilha (radiant-1-4-vidas-esgotadas
  // afirma "1 de N etapas concluídas" logo depois), então nenhuma frase pode
  // dizer que ela não fechou.
  it.each(['metade', 'faltou pouco', 'quase', 'não fechou'])(
    'a faixa de 0 estrelas não diz "%s"',
    (marcador) => {
      LESSON_SUMMARY_PHRASES[0].forEach((frase) => {
        expect(frase.toLowerCase()).not.toContain(marcador);
      });
    },
  );
});

