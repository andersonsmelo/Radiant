/**
 * O currículo inteiro como um percurso só.
 *
 * A aba Estude passa a ser a trilha, em rolagem contínua: o aluno rola para
 * trás e vê o que já fez, rola para frente e vê o que vem bloqueado
 * (ADR-2026-08-15). Todo o resto do sistema de jornada é escopado a UMA trilha
 * — `JourneyProgress` tem `activeTrackId`, o store é `tracks: { [trackId]: … }`
 * e cada snapshot nasce de um `trackDefinition`. Este módulo é a única peça que
 * enxerga o conjunto.
 *
 * **Ele não inventa ordenação nem destravamento.** `sortTracks` já resolve
 * `order` explícito com desempate por posição, e `resolveTrackAccess` já dá o
 * destravamento sequencial — trilha N abre quando N−1 fecha. Aqui as duas são
 * consumidas, não reescritas: uma segunda régua para a mesma pergunta voltaria
 * a divergir da primeira.
 */

import type { JourneyNode, JourneySnapshot, JourneyUnit } from '../../../types/journey';
import { LessonCatalogService } from '../../content/services/LessonCatalogService';
import { JourneyDefinitionService } from './JourneyDefinitionService';
import { JourneyProgressService } from './JourneyProgressService';
import { resolveTrackAccess } from './JourneyTrackUnlockService';

/** Um trecho do percurso: uma trilha, com suas unidades e seu estado de acesso. */
export type CurriculumSegment = {
    trackId: string;
    trackTitle: string;
    order: number;
    unlocked: boolean;
    completed: boolean;
    units: JourneyUnit[];
};

export type CurriculumTrail = {
    segments: CurriculumSegment[];
    /** O nó que a trilha destaca. Vem da trilha ativa; sem ela, fica indefinido. */
    recommendedNodeId?: string;
};

/**
 * Uma trilha está concluída quando todo nó que a compõe está concluído.
 *
 * Trilha sem nó nenhum NÃO conta como concluída: um catálogo que ainda não
 * produziu conteúdo abriria a trilha seguinte de graça, e o cadeado existe
 * justamente para impedir pular adiante.
 */
function isTrackCompleted(units: JourneyUnit[]): boolean {
    const nodes = units.flatMap((unit) => unit.nodes);

    return nodes.length > 0 && nodes.every((node) => node.status === 'completed');
}

/**
 * Rebaixa a nós bloqueados um trecho cuja trilha ainda não abriu.
 *
 * O snapshot de cada trilha é computado isoladamente, então a primeira lição de
 * uma trilha futura lê como `available` — ela é a primeira DAQUELA trilha. No
 * percurso contínuo isso mentiria: a trilha inteira está atrás de um cadeado
 * sequencial, e é esse "o que vem" bloqueado que o aluno precisa enxergar ao
 * rolar para frente.
 *
 * Nós já concluídos são preservados. Uma trilha pode estar fechada e conter
 * conclusões antigas — apagá-las reescreveria o passado do aluno.
 */
function lockUnreachedUnits(units: JourneyUnit[]): JourneyUnit[] {
    return units.map((unit) => ({
        ...unit,
        nodes: unit.nodes.map((node): JourneyNode =>
            node.status === 'completed' ? node : { ...node, status: 'locked' }
        ),
    }));
}

class JourneyCurriculumServiceImpl {
    /**
     * Monta o percurso inteiro, na ordem do currículo.
     *
     * Custo: uma leitura de snapshot por trilha. O catálogo de hoje tem poucas
     * trilhas, e `getSnapshot` é idempotente, então isso é aceitável — mas é o
     * ponto a medir primeiro se a abertura da aba Estude ficar lenta.
     */
    async getCurriculumTrail(): Promise<CurriculumTrail> {
        const tracks = LessonCatalogService.listTracks();

        if (tracks.length === 0) {
            return { segments: [] };
        }

        const snapshotByTrackId = new Map<string, JourneySnapshot>();

        for (const track of tracks) {
            try {
                const definition = JourneyDefinitionService.getTrackDefinition(track.id);
                snapshotByTrackId.set(track.id, await JourneyProgressService.getSnapshot(definition));
            } catch (cause) {
                // Uma trilha ilegível não pode derrubar o percurso inteiro: ela
                // some do caminho e as demais continuam navegáveis.
                console.error(
                    `[JourneyCurriculumService] Falha ao ler a trilha "${track.id}":`,
                    cause
                );
            }
        }

        // A conclusão entra como fato de entrada em `resolveTrackAccess`, que
        // deliberadamente não decide o que é uma trilha concluída — isso depende
        // dos nós e do progresso, e é o que se calcula aqui.
        const completedTrackIds = new Set(
            [...snapshotByTrackId.entries()]
                .filter(([, snapshot]) => isTrackCompleted(snapshot.track.units))
                .map(([trackId]) => trackId)
        );

        const access = resolveTrackAccess(tracks, completedTrackIds);
        const titleByTrackId = new Map(tracks.map((track) => [track.id, track.title]));

        const segments = access.flatMap<CurriculumSegment>((entry) => {
            const snapshot = snapshotByTrackId.get(entry.trackId);

            if (!snapshot) {
                return [];
            }

            return [
                {
                    trackId: entry.trackId,
                    trackTitle: titleByTrackId.get(entry.trackId) ?? snapshot.track.title,
                    order: entry.order,
                    unlocked: entry.unlocked,
                    completed: entry.completed,
                    units: entry.unlocked
                        ? snapshot.track.units
                        : lockUnreachedUnits(snapshot.track.units),
                },
            ];
        });

        // O destaque vem da primeira trilha aberta e não concluída — a mesma
        // régua de `resolveActiveTrackId`, aplicada sobre os trechos que
        // sobreviveram à leitura.
        const activeSegment = segments.find((segment) => segment.unlocked && !segment.completed);
        const recommendedNodeId = activeSegment
            ? snapshotByTrackId.get(activeSegment.trackId)?.nextRecommendedNode?.id
            : undefined;

        return { segments, recommendedNodeId };
    }
}

export const JourneyCurriculumService = new JourneyCurriculumServiceImpl();
