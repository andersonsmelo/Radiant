/**
 * Como uma ilustração de tema toca, decidido sem Skia.
 *
 * As ilustrações são Lottie tocados pelo Skottie dentro da medalha da trilha.
 * Regras do plano 1 (fundação visual Medalhão, tarefa 5):
 * - bloqueada (`locked`) é sempre silhueta, parada no quadro de pose;
 * - com "reduzir movimento", fica parada no quadro de pose;
 * - o quadro de pose é o `meta.posterFrame` do JSON, nunca o quadro 0, que pode
 *   estar vazio (no tubo, os fótons ainda invisíveis e o feixe no mínimo).
 */

/** Os temas da trilha, um por ilustração. O tipo sai daqui, para a lista não divergir dele. */
export const ILLUSTRATION_THEMES = ['radiacao', 'tubo', 'tomografia', 'protecao', 'ressonancia'] as const;

export type IllustrationTheme = (typeof ILLUSTRATION_THEMES)[number];

export type IllustrationState = 'done' | 'next' | 'locked';

export type IllustrationPlayback = {
  mode: 'animate' | 'still' | 'silhouette';
  /** O quadro parado; `null` quando o laço decide o quadro. */
  frame: number | null;
};

/**
 * Quadro de pose para um JSON que não declara um válido. É o do tubo, a pose
 * com o feixe aceso e os três fótons em pontos diferentes da descida.
 */
export const DEFAULT_POSTER_FRAME = 60;

const warnedLabels = new Set<string>();

/**
 * O quadro de pose declarado, ou o padrão quando falta ou não serve.
 *
 * Serve o inteiro de 1 a `totalFrames − 1`: o 0 pode estar vazio, e o
 * `totalFrames` já é o 0 da volta seguinte. Fora disso, cai no padrão e avisa
 * uma vez por `label` (o tema), e não uma por nó da trilha: sem o aviso, um JSON
 * novo sem quadro de pose pararia em silêncio num quadro que ninguém escolheu.
 */
export function posterFrameOrDefault(
  posterFrame: number | undefined,
  { totalFrames, label = 'Lottie' }: { totalFrames?: number; label?: string } = {},
): number {
  const last = typeof totalFrames === 'number' && totalFrames > 0 ? totalFrames - 1 : Number.POSITIVE_INFINITY;
  if (typeof posterFrame === 'number' && Number.isInteger(posterFrame) && posterFrame >= 1 && posterFrame <= last) {
    return posterFrame;
  }
  if (!warnedLabels.has(label)) {
    warnedLabels.add(label);
    console.warn(
      `[ThemeIllustration] "${label}": meta.posterFrame ${
        posterFrame === undefined ? 'ausente' : `${String(posterFrame)} fora do laço`
      }; parado no quadro ${DEFAULT_POSTER_FRAME}.`,
    );
  }
  return DEFAULT_POSTER_FRAME;
}

export function resolvePlayback({
  state,
  reducedMotion,
  posterFrame,
  totalFrames,
  label,
}: {
  state: IllustrationState;
  reducedMotion: boolean;
  /** `meta.posterFrame` do JSON; ausente ou inválido, vale `DEFAULT_POSTER_FRAME`. */
  posterFrame?: number;
  /** Quadros do laço (o `op`); com ele, o quadro de pose não passa de `op − 1`. */
  totalFrames?: number;
  /** Quem avisa quando o quadro de pose não serve (o tema). */
  label?: string;
}): IllustrationPlayback {
  if (state === 'locked') {
    return { mode: 'silhouette', frame: posterFrameOrDefault(posterFrame, { totalFrames, label }) };
  }
  if (reducedMotion) {
    return { mode: 'still', frame: posterFrameOrDefault(posterFrame, { totalFrames, label }) };
  }
  return { mode: 'animate', frame: null };
}
