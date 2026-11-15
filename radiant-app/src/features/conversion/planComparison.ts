import { MAX_HEARTS, REFILL_MIN, REVIEW_REWARD } from '../hearts/HeartsService';

export type PlanComparisonRow = { label: string; free: string; plus: string };

/**
 * Gratuito × Radiant Ilimitado, tirado do que o código libera (levantamento da
 * F8, 2026-11-15): a assinatura só muda as vidas. Os números vêm das regras de
 * `HeartsService`, então a tabela muda junto se a regra mudar.
 */
export function planComparison(): PlanComparisonRow[] {
    return [
        { label: 'Aulas, revisões e avaliações', free: 'Todas', plus: 'Todas' },
        {
            label: 'Vidas',
            // "pode": a aula híbrida não cobra o primeiro contato, só a nova tentativa.
            free: `${MAX_HEARTS}; errar em aula ou avaliação pode gastar uma (revisão nunca gasta); uma volta a cada ${REFILL_MIN} min`,
            plus: 'Ilimitadas: errar não gasta vida',
        },
        {
            label: 'Revisão concluída',
            free: `Devolve ${REVIEW_REWARD} vida`,
            plus: 'Continua valendo como estudo',
        },
    ];
}
