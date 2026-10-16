import type { JourneyNodeType } from '../../../types/journey';

type CompletionNode = { id: string; type: JourneyNodeType };

/**
 * A régua ÚNICA de "trilha concluída", usada pela tela
 * (`JourneyCurriculumService`) e pela trilha ativa (`JourneyProgressService`).
 *
 * Até 2026-10-16 eram duas, e divergiam: a tela lia o status, em que uma
 * revisão vencida de novo deixa de estar concluída; o serviço lia
 * `completedNodeIds`, em que ela fica para sempre. A recomendação ia para a
 * trilha seguinte enquanto a tela a trancava de novo a cada revisão vencida.
 *
 * **Revisão não conta** (ADR de 2026-10-16): ela é prática paralela, como a
 * prática personalizada do Duolingo, e não portão. Visto no simulador: "8 DE 8",
 * conquista coletada, e a trilha seguinte trancada por uma revisão que só abria
 * em 21/10. Lições, conquistas e avaliações continuam obrigatórias.
 *
 * Trilha sem nó obrigatório não está concluída: um catálogo vazio abriria a
 * seguinte de graça, e o cadeado existe para impedir pular adiante.
 */
export function isTrackCompleted<T extends CompletionNode>(
    nodes: readonly T[],
    isNodeCompleted: (node: T) => boolean,
): boolean {
    const required = nodes.filter((node) => node.type !== 'review');

    return required.length > 0 && required.every(isNodeCompleted);
}
