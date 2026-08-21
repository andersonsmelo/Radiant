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
});
