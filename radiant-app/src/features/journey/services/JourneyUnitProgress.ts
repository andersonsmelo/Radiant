import type { JourneyUnit } from '../../../types/journey';

/**
 * Marcos "primários" de uma unidade — todo nó que não é de revisão — e
 * quantos já foram concluídos.
 *
 * Extraído porque `RewardScreen` e `QuizScreen` mantinham cada um sua
 * própria cópia do mesmo par de filtros (`type !== 'review'` para o total,
 * mais `status === 'completed'` para o concluído). Duas definições da mesma
 * regra divergem no dia em que só uma delas muda — por isso a regra mora
 * aqui, e cada tela chama esta função em vez de reescrevê-la.
 */
export function computeUnitPrimaryProgress(unit: JourneyUnit | null): { completed: number; total: number } {
  if (!unit) {
    return { completed: 0, total: 0 };
  }

  const primaryNodes = unit.nodes.filter((node) => node.type !== 'review');

  return {
    completed: primaryNodes.filter((node) => node.status === 'completed').length,
    total: primaryNodes.length,
  };
}
