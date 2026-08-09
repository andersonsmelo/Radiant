/**
 * Traduz nó da jornada em competências.
 *
 * Existe isolado porque hoje os dois espaços de identificador não se tocam: a
 * jornada usa `node:lesson-1`, o currículo usa
 * `competency:protecao-radiologica:blindagem`. Enquanto não houver atividade
 * v2, todo nó resolve para a competência sintética por lição que o
 * `LegacyLessonAdapter` emite — e o motor de domínio descarta evidência legada
 * por padrão.
 *
 * Consequência desejada: `legacyOnly` é `true` em tudo, `getDue` volta vazio, e
 * a recomendação cai no comportamento de hoje. O sistema entra desligado e
 * acende sozinho quando o conteúdo v2 existir.
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
