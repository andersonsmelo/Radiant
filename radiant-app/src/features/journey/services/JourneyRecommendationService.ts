import { resolveNodeCompetencies } from './JourneyNodeCompetencyResolver';
import type { DueCompetency } from '../../../types/competencyReview';
import type {
    JourneyNode,
    JourneyNodeDefinition,
    JourneyProgress,
    JourneySnapshot,
    JourneyTrack,
    JourneyTrackDefinition,
    JourneyUnit,
    JourneyUnitDefinition,
    RecommendationReason,
} from '../../../types/journey';

function isNodeCompleted(progress: JourneyProgress, nodeId: string): boolean {
    return progress.completedNodeIds.includes(nodeId);
}

function unlockRuleSatisfied(node: JourneyNodeDefinition, progress: JourneyProgress): boolean {
    const requiresNodeIds = node.unlockRule?.requiresNodeIds ?? [];
    const requiresReviewClear = node.unlockRule?.requiresReviewClear ?? false;

    if (requiresNodeIds.some((requiredNodeId) => !progress.completedNodeIds.includes(requiredNodeId))) {
        return false;
    }

    if (requiresReviewClear && progress.pendingReviewNodeIds.length > 0) {
        return false;
    }

    return true;
}

function resolveNodeStatus(node: JourneyNodeDefinition, progress: JourneyProgress): JourneyNode['status'] {
    if (progress.resumableNodeId === node.id) {
        return 'resumable';
    }

    if (progress.currentNodeId === node.id) {
        return 'active';
    }

    const completed = isNodeCompleted(progress, node.id);
    const unlocked = unlockRuleSatisfied(node, progress);

    if (node.type === 'review') {
        if (progress.pendingReviewNodeIds.includes(node.id) && unlocked) {
            return 'due-review';
        }

        return completed ? 'completed' : 'locked';
    }

    if (completed) {
        return 'completed';
    }

    return unlocked ? 'available' : 'locked';
}

function resolveUnit(unit: JourneyUnitDefinition, progress: JourneyProgress): JourneyUnit {
    return {
        ...unit,
        nodes: unit.nodes.map((node) => ({
            ...node,
            status: resolveNodeStatus(node, progress),
        })),
    };
}

function isUnitComplete(unit: JourneyUnit): boolean {
    return unit.nodes
        .filter((node) => node.type !== 'review')
        .every((node) => node.status === 'completed');
}

/**
 * O motivo descreve **o nó que está sendo recomendado**, e nenhum outro. Antes
 * bastava qualquer nó não-`locked` cobrir uma vencida — inclusive um já
 * `completed` —, e o snapshot podia dizer "revisão vencida" enquanto a tela
 * mostrava uma lição inédita. Motivo que não descreve o que está na tela é pior
 * que motivo nenhum.
 *
 * O motivo continua sem destravar coisa alguma: ele apenas nomeia a escolha que
 * `getNextRecommendedNode` já fez sob as unlock rules, que seguem soberanas —
 * uma competência vencida num nó bloqueado não abre o nó.
 *
 * Puro e síncrono de propósito: a lista de vencidas entra por parâmetro em vez
 * de o serviço ir ao storage, porque este arquivo já declara que status é
 * derivado e não armazenado.
 */
function resolveReason(
    nextRecommendedNode: JourneyNode | null,
    dueCompetencies: DueCompetency[],
): RecommendationReason {
    if (nextRecommendedNode === null || dueCompetencies.length === 0) {
        return 'next-new';
    }

    const competenciasDoNo = resolveNodeCompetencies(nextRecommendedNode);

    // O adaptador do catálogo atual cria apenas competências sintéticas por
    // lição. Elas alimentam o store do agendador, mas não representam uma
    // competência curricular e portanto não podem mudar a recomendação. A
    // leitura só pode ser ativada quando o resolver passar a ligar este nó a
    // conteúdo v2 real; até lá, a ausência dessa ligação falha fechada.
    if (competenciasDoNo.legacyOnly) {
        return 'next-new';
    }

    const idsVencidos = new Set(dueCompetencies.map((item) => item.competencyId));

    const cobreVencida = competenciasDoNo.competencyIds
        .some((id) => idsVencidos.has(id));

    return cobreVencida ? 'due-review' : 'next-new';
}

export class JourneyRecommendationService {
    /**
     * O status de um nó é DERIVADO, nunca armazenado. Quem precisar autorizar
     * uma escrita tem de perguntar aqui em vez de reimplementar a regra: uma
     * segunda cópia de `unlockRuleSatisfied` divergiria da primeira no dia em
     * que a regra mudasse, e a divergência apareceria como uma conquista
     * entregue sem estudo.
     */
    static resolveNodeStatus(node: JourneyNodeDefinition, progress: JourneyProgress): JourneyNode['status'] {
        return resolveNodeStatus(node, progress);
    }

    /**
     * A regra de destravamento isolada do status. Um nó de revisão fora da fila
     * do dia lê como 'locked' sem que nada esteja bloqueado — ele só não está
     * vencido —, então quem autoriza escrita precisa das duas respostas para
     * não confundir "ainda não abriu" com "não é a hora".
     */
    static isNodeUnlocked(node: JourneyNodeDefinition, progress: JourneyProgress): boolean {
        return unlockRuleSatisfied(node, progress);
    }

    static resolveTrack(track: JourneyTrackDefinition, progress: JourneyProgress): JourneyTrack {
        return {
            ...track,
            units: track.units.map((unit) => resolveUnit(unit, progress)),
        };
    }

    static getNextRecommendedNode(track: JourneyTrack, currentUnitId: string = track.initialUnitId): JourneyNode | null {
        const currentUnitIndex = Math.max(track.units.findIndex((unit) => unit.id === currentUnitId), 0);

        const searchUnits = [
            ...track.units.slice(currentUnitIndex),
            ...track.units.slice(0, currentUnitIndex),
        ];

        for (const unit of searchUnits) {
            // Retomar vence começar. Um nó em andamento é o único que a busca
            // não enxergava: `resolveNodeStatus` o tira de `available` e o põe em
            // `resumable`, que não era procurado aqui, e a unidade incompleta
            // fazia o laço devolver `null` logo abaixo — a trilha inteira ficava
            // sem próximo passo enquanto uma lição estava aberta pela metade.
            const resumable = unit.nodes.find((node) => node.status === 'resumable');
            if (resumable) {
                return resumable;
            }

            const dueReview = unit.nodes.find((node) => node.status === 'due-review');
            if (dueReview) {
                return dueReview;
            }

            const available = unit.nodes.find((node) => node.status === 'available');
            if (available) {
                return available;
            }

            if (!isUnitComplete(unit)) {
                return null;
            }
        }

        return null;
    }

    static computeSnapshot(
        trackDefinition: JourneyTrackDefinition,
        progress: JourneyProgress,
        dueCompetencies: DueCompetency[] = [],
    ): JourneySnapshot {
        const resolvedTrack = this.resolveTrack(trackDefinition, progress);
        const nextRecommendedNode = this.getNextRecommendedNode(resolvedTrack, progress.currentUnitId);

        return {
            track: resolvedTrack,
            progress,
            nextRecommendedNode,
            completedCount: progress.completedNodeIds.length,
            dueReviewCount: progress.pendingReviewNodeIds.length,
            recommendationReason: resolveReason(nextRecommendedNode, dueCompetencies),
        };
    }

    static resolveCurrentUnitId(track: JourneyTrack, progress: JourneyProgress): string {
        const resumableNode = track.units
            .flatMap((unit) => unit.nodes)
            .find((node) => node.id === progress.resumableNodeId);

        if (resumableNode) {
            return resumableNode.unitId;
        }

        const activeNode = track.units
            .flatMap((unit) => unit.nodes)
            .find((node) => node.id === progress.currentNodeId);

        if (activeNode) {
            return activeNode.unitId;
        }

        const nextRecommendedNode = this.getNextRecommendedNode(track, progress.currentUnitId);
        return nextRecommendedNode?.unitId ?? track.initialUnitId;
    }
}
