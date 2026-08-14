import type { LearningTrack } from '../../content/content.types';

/**
 * Ordem e destravamento sequencial de trilhas.
 *
 * O percurso passou a ser único em 2026-08-14: o aluno não escolhe trilha, e a
 * seguinte abre quando a atual termina. A Galáxia já promete isso por escrito.
 * Este módulo é a regra que sustenta a promessa — e é PURO de propósito:
 * recebe as trilhas e o conjunto de trilhas concluídas, não lê storage, não
 * conhece o serviço de progresso. Regra de negócio que depende de I/O só pode
 * ser testada montando I/O; esta se testa com dois argumentos.
 *
 * O que ele deliberadamente NÃO faz: decidir se uma trilha está concluída.
 * Isso depende dos nós e do progresso, que pertencem ao serviço de progresso.
 * Aqui a conclusão entra como fato de entrada.
 */

export type TrackAccess = {
    trackId: string;
    order: number;
    unlocked: boolean;
    completed: boolean;
};

/**
 * Ordena as trilhas do percurso.
 *
 * `order` explícito vence; na ausência dele, a posição no array desempata. Os
 * dois convivem porque o catálogo pode vir de um payload remoto sem o campo —
 * e nesse caso a ordem do array é a única informação de sequência que existe.
 * Trilhas com `order` declarado vêm antes das que não têm, para que um
 * catálogo parcialmente anotado não intercale de forma imprevisível.
 */
export function sortTracks(tracks: LearningTrack[]): LearningTrack[] {
    return tracks
        .map((track, index) => ({ track, index }))
        .sort((a, b) => {
            const aOrder = a.track.order;
            const bOrder = b.track.order;

            if (aOrder !== undefined && bOrder !== undefined) {
                return aOrder - bOrder || a.index - b.index;
            }

            if (aOrder !== undefined) {
                return -1;
            }

            if (bOrder !== undefined) {
                return 1;
            }

            return a.index - b.index;
        })
        .map((entry) => entry.track);
}

/**
 * Estado de acesso de cada trilha, na ordem do percurso.
 *
 * A primeira trilha está sempre aberta — senão não há por onde começar, e um
 * aluno novo veria o curso inteiro trancado. Cada trilha seguinte abre quando
 * a ANTERIOR foi concluída, e não quando qualquer uma foi: é isso que faz o
 * percurso ser uma linha e não um conjunto.
 *
 * Uma trilha concluída continua desbloqueada. Rever conteúdo já feito nunca é
 * bloqueado — o cadeado existe para impedir pular adiante, não para impedir
 * voltar.
 */
export function resolveTrackAccess(
    tracks: LearningTrack[],
    completedTrackIds: ReadonlySet<string>,
): TrackAccess[] {
    let previousCompleted = true;

    return sortTracks(tracks).map((track, index) => {
        const completed = completedTrackIds.has(track.id);
        const unlocked = index === 0 || previousCompleted;

        previousCompleted = completed;

        return {
            trackId: track.id,
            order: track.order ?? index + 1,
            unlocked,
            completed,
        };
    });
}

/**
 * A trilha em que o aluno deve estar: a primeira aberta que ainda não terminou.
 *
 * Quando todas terminaram devolve a última, e não `null`: o app precisa de uma
 * trilha para exibir, e quem concluiu o curso deve continuar vendo o que fez,
 * não uma tela vazia. Quem quiser tratar "curso concluído" pergunta a
 * `resolveTrackAccess`, onde esse fato está explícito.
 */
export function resolveActiveTrackId(
    tracks: LearningTrack[],
    completedTrackIds: ReadonlySet<string>,
): string | null {
    const access = resolveTrackAccess(tracks, completedTrackIds);

    if (access.length === 0) {
        return null;
    }

    return access.find((entry) => entry.unlocked && !entry.completed)?.trackId
        ?? access[access.length - 1].trackId;
}
