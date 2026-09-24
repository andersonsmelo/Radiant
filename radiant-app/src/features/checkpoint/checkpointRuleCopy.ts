/**
 * O que o checkpoint diz ao aluno sobre a própria regra, calculado da avaliação
 * que ele vai fazer.
 *
 * Até 2026-09-24 a tela dizia "Responda 10 questões… acerte pelo menos 8" e
 * "exige 8 acertos" em texto fixo. Isso descrevia a avaliação única de dez
 * itens, anterior a 2026-08-21, e sobreviveu à repartição em cinco avaliações
 * de dois itens (achado 1 do gate H4).
 */

/**
 * Menor número de acertos que aprova.
 *
 * É a mesma conta de `UnitCheckpointService.evaluate`
 * (`floor(10000 * acertos / itens) >= limiar`), e não uma aproximação por
 * porcentagem. Assim, o texto não promete um número que a avaliação não aplica.
 */
export function requiredCorrectItems(itemCount: number, targetScoreBasisPoints: number): number {
    for (let correct = 0; correct <= itemCount; correct += 1) {
        if (Math.floor((10000 * correct) / itemCount) >= targetScoreBasisPoints) {
            return correct;
        }
    }
    return itemCount;
}

function questions(count: number): string {
    return count === 1 ? 'questão' : 'questões';
}

export function checkpointIntroCopy(itemCount: number, requiredCorrect: number): string {
    if (requiredCorrect >= itemCount) {
        return itemCount === 1
            ? 'Responda a questão. Para avançar, acerte-a.'
            : `Responda as ${itemCount} questões. Para avançar, acerte todas.`;
    }
    return `Responda ${itemCount} ${questions(itemCount)}. Para avançar, acerte pelo menos ${requiredCorrect}.`;
}

export function checkpointRequirementCopy(requiredCorrect: number): string {
    return `A aprovação exige ${requiredCorrect} ${requiredCorrect === 1 ? 'acerto' : 'acertos'}.`;
}
