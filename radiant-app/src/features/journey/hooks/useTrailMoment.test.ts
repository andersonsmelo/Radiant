import { act, renderHook } from '@testing-library/react-native';
import { useTrailMoment } from './useTrailMoment';

// O momento do Pixel toca uma vez por conclusão: quando o recomendado mudou
// desde o último foco E o anterior foi concluído. A tela relê a trilha a cada
// foco, então "desde o último foco" é "desde a última leitura".

type Props = { recommended?: string; completed: ReadonlySet<string> };

function renderMoment(initial: Props) {
  return renderHook(({ recommended, completed }: Props) => useTrailMoment(recommended, completed), {
    initialProps: initial,
  });
}

const NONE: ReadonlySet<string> = new Set();

describe('useTrailMoment', () => {
  it('não toca na primeira leitura: não há anterior', () => {
    const { result } = renderMoment({ recommended: 'a', completed: NONE });

    expect(result.current.playing).toBe(false);
    expect(result.current.fromNodeId).toBeUndefined();
    expect(result.current.toNodeId).toBeUndefined();
  });

  it('não toca quando o app abre já com aulas concluídas', () => {
    // A primeira leitura acontece depois do carregamento: até ela, não há
    // recomendado. O primeiro recomendado é o ponto de partida, não um passo.
    const { result, rerender } = renderMoment({ recommended: undefined, completed: NONE });
    rerender({ recommended: 'b', completed: new Set(['a']) });

    expect(result.current.playing).toBe(false);
  });

  it('toca de a para b quando o recomendado muda e a foi concluído, e para no done()', () => {
    const { result, rerender } = renderMoment({ recommended: 'a', completed: NONE });
    rerender({ recommended: 'b', completed: new Set(['a']) });

    expect(result.current).toMatchObject({ playing: true, fromNodeId: 'a', toNodeId: 'b' });

    act(() => result.current.done());

    expect(result.current.playing).toBe(false);
  });

  it('não toca quando o recomendado muda sem a ter sido concluído (o aluno abriu outra coisa)', () => {
    const { result, rerender } = renderMoment({ recommended: 'a', completed: NONE });
    rerender({ recommended: 'b', completed: new Set(['x']) });

    expect(result.current.playing).toBe(false);
  });

  it('não toca de novo a cada foco da aba com o mesmo recomendado', () => {
    const { result, rerender } = renderMoment({ recommended: 'a', completed: NONE });
    rerender({ recommended: 'b', completed: new Set(['a']) });
    act(() => result.current.done());

    // A releitura do foco seguinte traz um conjunto novo, com o mesmo conteúdo.
    rerender({ recommended: 'b', completed: new Set(['a']) });

    expect(result.current.playing).toBe(false);
  });

  it('uma leitura sem recomendado não apaga o anterior: a conclusão seguinte ainda toca', () => {
    const { result, rerender } = renderMoment({ recommended: 'a', completed: NONE });
    rerender({ recommended: undefined, completed: NONE });
    rerender({ recommended: 'b', completed: new Set(['a']) });

    expect(result.current).toMatchObject({ playing: true, fromNodeId: 'a', toNodeId: 'b' });
  });

  it('a conclusão seguinte troca o momento: toca de b para c', () => {
    const { result, rerender } = renderMoment({ recommended: 'a', completed: NONE });
    rerender({ recommended: 'b', completed: new Set(['a']) });
    rerender({ recommended: 'c', completed: new Set(['a', 'b']) });

    expect(result.current).toMatchObject({ playing: true, fromNodeId: 'b', toNodeId: 'c' });
  });
});
