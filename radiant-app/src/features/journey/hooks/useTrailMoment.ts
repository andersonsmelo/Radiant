import { useCallback, useState } from 'react';

export type TrailMoment = {
  /** O momento está tocando: o Pixel anda do nó concluído até o recomendado. */
  playing: boolean;
  /** O nó que acabou de ser concluído, de onde o Pixel parte. */
  fromNodeId?: string;
  /** O recomendado novo, ao lado de quem o Pixel para. */
  toNodeId?: string;
  /** Quem anima avisa que acabou. */
  done: () => void;
};

type MomentState = {
  /** O último recomendado lido. Antes da primeira leitura, nenhum. */
  last?: string;
  from?: string;
  to?: string;
};

/**
 * Decide quando o momento do Pixel toca: uma vez por conclusão.
 *
 * Toca quando o recomendado mudou desde a última leitura **e** o anterior está
 * entre os concluídos. A tela relê a trilha a cada foco da aba, então "desde a
 * última leitura" é "desde o último foco". Não toca na primeira leitura (não
 * há anterior), nem num foco que traz o mesmo recomendado, nem quando o
 * recomendado muda sem conclusão (o aluno abriu outra coisa). Uma leitura sem
 * recomendado (a trilha ainda carregando) não conta como leitura.
 *
 * A troca é decidida no próprio render, e não num efeito: assim o quadro em
 * que a medalha nova aparece já é o primeiro do momento, sem um quadro do
 * estado final antes dele.
 */
export function useTrailMoment(
  recommendedNodeId: string | undefined,
  completedIds: ReadonlySet<string>,
): TrailMoment {
  const [state, setState] = useState<MomentState>(() => ({ last: recommendedNodeId }));

  if (recommendedNodeId !== undefined && recommendedNodeId !== state.last) {
    const previous = state.last;
    const completedStep = previous !== undefined && completedIds.has(previous);
    setState(completedStep
      ? { last: recommendedNodeId, from: previous, to: recommendedNodeId }
      : { last: recommendedNodeId });
  }

  const done = useCallback(() => {
    setState(current => (current.to === undefined ? current : { last: current.last }));
  }, []);

  const playing = state.to !== undefined && state.to === recommendedNodeId;
  return {
    playing,
    fromNodeId: playing ? state.from : undefined,
    toNodeId: playing ? state.to : undefined,
    done,
  };
}
