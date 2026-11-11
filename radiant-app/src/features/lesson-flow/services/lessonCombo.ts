/**
 * Sequência de acertos dentro de uma aula (plano de 2026-11-05, frente C).
 *
 * Função pura: a tela guarda o estado e pergunta o próximo. Os marcos são 3, 5
 * e 10 respostas certas seguidas; um erro zera. O marco só aparece na resposta
 * que o alcança, então a 4ª seguida não repete o selo da 3ª.
 */
export type ComboMilestone = 3 | 5 | 10;

export type ComboState = { count: number; milestone: ComboMilestone | null };

export const COMBO_START: ComboState = { count: 0, milestone: null };

const MILESTONES: readonly number[] = [3, 5, 10];

export function nextCombo(state: Pick<ComboState, 'count'>, correct: boolean): ComboState {
    const count = correct ? state.count + 1 : 0;
    return { count, milestone: MILESTONES.includes(count) ? (count as ComboMilestone) : null };
}

/** O texto do selo, e o que o leitor de tela ouve junto do retorno. */
export function comboLabel(milestone: ComboMilestone): string {
    return `${milestone} seguidas`;
}
