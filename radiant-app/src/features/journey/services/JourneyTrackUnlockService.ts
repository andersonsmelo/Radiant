import type { LearningTrack } from '../../content/content.types';

/**
 * Ordem e destravamento sequencial de trilhas.
 *
 * O percurso passou a ser único em 2026-08-14: o aluno não escolhe trilha, e a
 * seguinte abre quando a atual termina. A Galáxia já promete isso por escrito.
 * Este módulo é a regra que sustenta a promessa — e é PURO de propósito:
 * recebe as trilhas e os conjuntos de trilhas concluídas e iniciadas, não lê storage, não
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

/** Índice, na ordem dada, da trilha iniciada mais adiante; −1 sem nenhuma. */
function furthestStartedIndex(trackIds: string[], startedTrackIds: ReadonlySet<string>): number {
    return trackIds.reduce((furthest, trackId, index) => (startedTrackIds.has(trackId) ? index : furthest), -1);
}

/**
 * Estado de acesso de cada trilha, na ordem do percurso.
 *
 * A primeira trilha está sempre aberta — senão não há por onde começar, e um
 * aluno novo veria o curso inteiro trancado. Cada trilha seguinte abre quando
 * a ANTERIOR foi concluída, e não quando qualquer uma foi: é isso que faz o
 * percurso ser uma linha e não um conjunto.
 *
 * Desde 2026-11-13 (F1 da 1.6) unidades novas entram no MEIO do percurso de um
 * app em produção. Por isso uma trilha também abre se ela mesma já foi
 * concluída ou iniciada (`startedTrackIds`: ao menos um nó concluído), ou se
 * fica antes da trilha iniciada mais adiante. Quem tem progresso não perde
 * acesso; quem não tem nenhum segue a ordem estrita, como antes.
 */
export function resolveTrackAccess(
    tracks: LearningTrack[],
    completedTrackIds: ReadonlySet<string>,
    startedTrackIds: ReadonlySet<string> = new Set(),
): TrackAccess[] {
    const sorted = sortTracks(tracks);
    const furthest = furthestStartedIndex(sorted.map((track) => track.id), startedTrackIds);
    let previousCompleted = true;

    return sorted.map((track, index) => {
        const completed = completedTrackIds.has(track.id);
        const unlocked = index === 0
            || previousCompleted
            || completed
            || startedTrackIds.has(track.id)
            || index < furthest;

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
 * A trilha em que o aluno deve estar: a primeira aberta que ainda não terminou,
 * contando a partir da trilha iniciada mais adiante. Uma unidade inserida atrás
 * do aluno fica aberta, mas não o puxa de volta; sem progresso nenhum, a
 * contagem começa do início, como antes de 2026-11-13.
 *
 * Quando todas terminaram devolve a última, e não `null`: o app precisa de uma
 * trilha para exibir, e quem concluiu o curso deve continuar vendo o que fez,
 * não uma tela vazia. Quem quiser tratar "curso concluído" pergunta a
 * `resolveTrackAccess`, onde esse fato está explícito.
 */
export function resolveActiveTrackId(
    tracks: LearningTrack[],
    completedTrackIds: ReadonlySet<string>,
    startedTrackIds: ReadonlySet<string> = new Set(),
): string | null {
    const access = resolveTrackAccess(tracks, completedTrackIds, startedTrackIds);

    if (access.length === 0) {
        return null;
    }

    const furthest = furthestStartedIndex(access.map((entry) => entry.trackId), startedTrackIds);

    return access.find((entry, index) => index >= furthest && entry.unlocked && !entry.completed)?.trackId
        ?? access[access.length - 1].trackId;
}
