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

export type IllustrationTheme = 'radiacao' | 'tubo' | 'tomografia' | 'protecao' | 'ressonancia';

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

/** O quadro de pose declarado, ou o padrão quando falta ou não serve. */
export function posterFrameOrDefault(posterFrame: number | undefined): number {
  return typeof posterFrame === 'number' && Number.isFinite(posterFrame) && posterFrame > 0
    ? posterFrame
    : DEFAULT_POSTER_FRAME;
}

export function resolvePlayback({
  state,
  reducedMotion,
  posterFrame,
}: {
  state: IllustrationState;
  reducedMotion: boolean;
  /** `meta.posterFrame` do JSON; ausente ou inválido, vale `DEFAULT_POSTER_FRAME`. */
  posterFrame?: number;
}): IllustrationPlayback {
  if (state === 'locked') {
    return { mode: 'silhouette', frame: posterFrameOrDefault(posterFrame) };
  }
  if (reducedMotion) {
    return { mode: 'still', frame: posterFrameOrDefault(posterFrame) };
  }
  return { mode: 'animate', frame: null };
}
