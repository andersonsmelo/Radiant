import type { LessonStars } from '../services/resolveLessonStars';

export const LESSON_SUMMARY_PHRASES: Record<LessonStars, readonly string[]> = {
  0: [
    'Ainda não fechou. Refazer agora é o caminho mais curto.',
    'Faltou pouco para o corte. A segunda passada costuma render.',
    'Esta ficou pela metade — vale rever antes de seguir.',
  ],
  1: [
    'Você conseguiu. Vamos continuar assim!',
    'Passou! Dá para apertar o resultado repetindo.',
    'Lição fechada. O próximo passo já está liberado.',
  ],
  2: [
    'Muito bom. Faltou pouco para a marca cheia.',
    'Resultado forte — quase tudo certo.',
    'Você está perto do domínio completo desta lição.',
  ],
  3: [
    'Perfeito. Nenhum erro nesta lição.',
    'Marca cheia! Leitura impecável.',
    'Três estrelas. Nada passou despercebido.',
  ],
};

export function pickSummaryPhrase(
  stars: LessonStars,
  previous: string | null,
  pickIndex: (length: number) => number = (length) => Math.floor(Math.random() * length),
): string {
  const todas = LESSON_SUMMARY_PHRASES[stars];
  const elegiveis = todas.filter((frase) => frase !== previous);
  const pool = elegiveis.length > 0 ? elegiveis : todas;
  const index = Math.min(Math.max(pickIndex(pool.length), 0), pool.length - 1);
  return pool[index];
}
