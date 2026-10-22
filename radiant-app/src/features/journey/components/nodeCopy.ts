import type { JourneyNode, NextNodeDecision } from '../../../types/journey';

/**
 * As palavras que dizem o estado de um nó. Moram aqui, e não no cartão, porque
 * a medalha as usa no rótulo de acessibilidade (`"<título>. <estado>."`) e os
 * roteiros Maestro leem esses rótulos ao pé da letra.
 */
export function getStatusCopy(node: JourneyNode) {
  if (node.type === 'review' && Number.isFinite(node.reviewAvailableAtMs)
    && node.reviewAvailableAtMs! > Date.now()) {
    const date = new Date(node.reviewAvailableAtMs!);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const hour = String(date.getHours()).padStart(2, '0');
    const minute = String(date.getMinutes()).padStart(2, '0');
    return `Disponível em ${day}/${month}/${date.getFullYear()} às ${hour}:${minute}`;
  }
  switch (node.status) {
    case 'completed':
      return 'Concluído';
    case 'active':
      return 'Em andamento';
    case 'resumable':
      return 'Retomar';
    case 'due-review':
      return 'Revisar';
    case 'available':
      return 'Disponível';
    default:
      return 'Bloqueado';
  }
}

export function getRecommendationCopy(
  isRecommended: boolean,
  reason: NextNodeDecision['reason'] | undefined,
  dueReviewCount: number,
): string | null {
  if (!isRecommended) return null;
  if (reason === 'paused-lesson') return 'Continuar de onde parou';
  if (reason === 'due-review') {
    return `Revisão devida · ${dueReviewCount} ${dueReviewCount === 1 ? 'devida' : 'devidas'}`;
  }
  return 'Próximo passo';
}

/**
 * O que o botão sob a medalha recomendada diz: a ação, pelo tipo do nó e por
 * ele estar pausado. Veio do cartão de recomendação, que a trilha substituiu,
 * com as mesmas palavras: os roteiros Maestro tocam "Continuar jornada" e
 * "Receber conquista" pelo texto, e o `maestro-contract` lê esta função.
 */
export function getRecommendationActionCopy(
  node: JourneyNode,
  reason: NextNodeDecision['reason'] | undefined,
): string {
  const resuming = node.status === 'resumable' || reason === 'paused-lesson';
  switch (node.type) {
    case 'review':
      return resuming ? 'Retomar revisão' : 'Fazer revisão';
    case 'checkpoint':
      return resuming ? 'Retomar avaliação' : 'Fazer avaliação';
    case 'reward':
      return 'Receber conquista';
    default:
      return resuming ? 'Retomar lição' : 'Continuar jornada';
  }
}
