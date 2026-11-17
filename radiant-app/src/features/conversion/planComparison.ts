import { MAX_HEARTS, REFILL_MIN } from '../hearts/HeartsService';

export type PlanComparisonRow = { label: string; free: string; plus: string };

/**
 * Gratuito × Radiant Ilimitado, tirado do que o código libera (levantamento da
 * F8, 2026-11-15): a assinatura só muda as vidas. Só a linha em que os planos
 * diferem entra; aulas, revisões e avaliações são iguais nos dois e a tela diz
 * isso numa frase. Os números vêm das regras de `HeartsService`, então o texto
 * muda junto se a regra mudar.
 */
export function planComparison(): PlanComparisonRow[] {
    return [
        {
            label: 'Vidas',
            // "pode": a aula híbrida não cobra o primeiro contato, só a nova tentativa.
            free: `${MAX_HEARTS}; errar em aula ou avaliação pode gastar uma (revisão nunca gasta); uma volta a cada ${REFILL_MIN} min`,
            plus: 'Sem limite',
        },
    ];
}
