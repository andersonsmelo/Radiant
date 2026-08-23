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

/**
 * O mesmo par de contagens para um TRECHO do percurso — uma trilha inteira,
 * que pode ter mais de uma unidade.
 *
 * Existe porque o cabeçalho de estágio da aba Estude precisava disso e, em
 * 2026-08-21, resolveu contando **todos** os nós do trecho. O resultado foi o
 * defeito que a função acima existe para impedir: a trilha anunciava "2 de 21"
 * no topo e a conclusão de lição anunciava "3 de 14" logo depois, para o mesmo
 * currículo, com minutos de diferença. Dois números de progresso que discordam
 * não somam informação: eles tiram a confiança dos dois.
 *
 * A regra é uma só — revisão não conta como marco — e agora as duas telas a
 * leem daqui.
 */
export function computeSegmentPrimaryProgress(
  units: readonly JourneyUnit[],
): { completed: number; total: number } {
  return units.reduce(
    (acc, unit) => {
      const unitProgress = computeUnitPrimaryProgress(unit);
      return {
        completed: acc.completed + unitProgress.completed,
        total: acc.total + unitProgress.total,
      };
    },
    { completed: 0, total: 0 },
  );
}
