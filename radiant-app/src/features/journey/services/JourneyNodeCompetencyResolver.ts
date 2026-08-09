/**
 * Traduz nó da jornada em competências.
 *
 * Existe isolado porque hoje os dois espaços de identificador não se tocam: a
 * jornada usa `node:lesson-1`, o currículo usa
 * `competency:protecao-radiologica:blindagem`. Enquanto não houver atividade
 * v2, todo nó resolve para a competência sintética por lição que o
 * `LegacyLessonAdapter` emite, e `legacyOnly` é `true` em tudo.
 *
 * **Por que nada muda para o usuário hoje.** Não é por `includeLegacyEvidence`:
 * esse sinalizador é filtro do motor de domínio no cálculo de domínio e não
 * afeta o agendador em nada — cartões legados são criados normalmente e vencem
 * em um dia. O que preserva o comportamento atual é mais simples e mais frágil:
 * `CompetencyReviewService.getDue` **não tem chamador de produção**, e todas as
 * chamadas a `JourneyRecommendationService.computeSnapshot` omitem o terceiro
 * parâmetro, então a lista de vencidas que chega à recomendação é sempre vazia.
 *
 * Consequência: a recomendação cai em `next-new`, como hoje. O sistema acende
 * no dia em que alguém ligar `getDue` à recomendação — e nesse dia é preciso
 * decidir o que fazer com competência legada, porque o agendador a agenda.
 */

import { LEGACY_COMPETENCY_PREFIX } from '../../lesson-flow/services/LegacyLessonAdapter';
import type { JourneyNodeDefinition } from '../../../types/journey';

export type NodeCompetencyResolution = {
    nodeId: string;
    competencyIds: string[];
    legacyOnly: boolean;
};

export function resolveNodeCompetencies(node: JourneyNodeDefinition): NodeCompetencyResolution {
    if (!node.lessonId) {
        return { nodeId: node.id, competencyIds: [], legacyOnly: false };
    }

    const competencyIds = [`${LEGACY_COMPETENCY_PREFIX}${node.lessonId}`];

    return {
        nodeId: node.id,
        competencyIds,
        legacyOnly: competencyIds.every((id) => id.startsWith(LEGACY_COMPETENCY_PREFIX)),
    };
}
