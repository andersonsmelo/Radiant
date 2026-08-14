import { STORAGE_KEYS } from '../../../constants/storageKeys';
import { readJsonStorage, removeStorageKey, writeJsonStorage } from '../../../storage';
import {
    JOURNEY_PROGRESS_SCHEMA_VERSION,
    type JourneyNodeDefinition,
    type JourneyProgress,
    type JourneyProgressStore,
    type JourneySnapshot,
    type JourneySyncEvent,
    type JourneyTrackDefinition,
} from '../../../types/journey';
import { SpacedRepetitionService } from '../../spaced-repetition/services/SpacedRepetitionService';
import { JourneyRecommendationService } from './JourneyRecommendationService';
import { JourneyDefinitionService } from './JourneyDefinitionService';
import { LessonCatalogService } from '../../content/services/LessonCatalogService';
import { resolveActiveTrackId } from './JourneyTrackUnlockService';

const LEGACY_JOURNEY_PROGRESS_SCHEMA_VERSION = 'journey-progress.v1';

function nowIso(): string {
    return new Date().toISOString();
}

function createSyncEvent(nodeId: string, type: JourneySyncEvent['type']): JourneySyncEvent {
    const occurredAt = nowIso();

    return {
        id: `${type}:${nodeId}:${occurredAt}`,
        type,
        nodeId,
        occurredAt,
    };
}

function nodeCompletionEventType(node: JourneyNodeDefinition): JourneySyncEvent['type'] {
    if (node.type === 'review') {
        return 'review_completed';
    }

    if (node.type === 'reward') {
        return 'reward_awarded';
    }

    return 'node_completed';
}

class JourneyProgressServiceImpl {
    async bootstrap(trackDefinition?: JourneyTrackDefinition): Promise<JourneySnapshot> {
        const resolvedTrackDefinition = await this.resolveTrackDefinition(trackDefinition);
        const progress = await this.ensureProgress(resolvedTrackDefinition);
        return JourneyRecommendationService.computeSnapshot(resolvedTrackDefinition, progress);
    }

    async getSnapshot(trackDefinition?: JourneyTrackDefinition): Promise<JourneySnapshot> {
        const resolvedTrackDefinition = await this.resolveTrackDefinition(trackDefinition);
        const progress = await this.ensureProgress(resolvedTrackDefinition);
        return JourneyRecommendationService.computeSnapshot(resolvedTrackDefinition, progress);
    }

    async selectTrack(trackId: string): Promise<JourneySnapshot> {
        const trackDefinition = JourneyDefinitionService.getTrackDefinition(trackId);
        const progress = await this.ensureProgress(trackDefinition);
        return JourneyRecommendationService.computeSnapshot(trackDefinition, progress);
    }

    async setCurrentNode(
        nodeId: string | null,
        trackDefinition?: JourneyTrackDefinition
    ): Promise<JourneySnapshot> {
        const resolvedTrackDefinition = await this.resolveTrackDefinition(trackDefinition);
        const progress = await this.ensureProgress(resolvedTrackDefinition);
        const nextProgress: JourneyProgress = {
            ...progress,
            currentNodeId: nodeId,
            lastUpdatedAt: nowIso(),
        };

        return this.persistAndHydrate(resolvedTrackDefinition, nextProgress);
    }

    async setResumableNode(
        nodeId: string | undefined,
        trackDefinition?: JourneyTrackDefinition
    ): Promise<JourneySnapshot> {
        const resolvedTrackDefinition = await this.resolveTrackDefinition(trackDefinition);
        const progress = await this.ensureProgress(resolvedTrackDefinition);
        const nextProgress: JourneyProgress = {
            ...progress,
            resumableNodeId: nodeId,
            lastUpdatedAt: nowIso(),
        };

        return this.persistAndHydrate(resolvedTrackDefinition, nextProgress);
    }

    async markNodeCompleted(
        nodeId: string,
        trackDefinition?: JourneyTrackDefinition
    ): Promise<JourneySnapshot> {
        const resolvedTrackDefinition = await this.resolveTrackDefinition(trackDefinition);
        const progress = await this.ensureProgress(resolvedTrackDefinition);
        const node = this.findNode(resolvedTrackDefinition, nodeId);

        if (!node) {
            console.warn(`[JourneyProgressService] Tried to complete unknown node "${nodeId}"`);
            return JourneyRecommendationService.computeSnapshot(resolvedTrackDefinition, progress);
        }

        // A autorização mora aqui porque é aqui que a escrita acontece. Antes
        // ela morava só na tela de conquista, e três outros caminhos chegavam a
        // esta linha sem passar por lá: `/learn` entrega `nodeId` cru dos
        // parâmetros de rota para `markNodeCompleted`, o checkpoint filtra por
        // tipo e não por status, e o serviço é chamável direto. Um deep link
        // para `/learn` com o nó de reward bloqueado e um bloco de lição real
        // gravava a conquista da unidade e emitia `reward_awarded`.
        //
        // A régua é `unlockRule`, não o status cru: um nó de revisão fora da
        // fila do dia lê como 'locked' sem estar bloqueado — ele só não está
        // vencido —, e recusá-lo quebraria a conclusão de revisão, que é
        // legítima. Para os demais tipos, 'locked' e regra insatisfeita são a
        // mesma condição.
        if (!JourneyRecommendationService.isNodeUnlocked(node, progress)) {
            const status = JourneyRecommendationService.resolveNodeStatus(node, progress);
            console.warn(
                `[JourneyProgressService] Refused to complete locked node "${nodeId}" (status: ${status})`
            );
            return JourneyRecommendationService.computeSnapshot(resolvedTrackDefinition, progress);
        }

        const completedNodeIds = progress.completedNodeIds.includes(nodeId)
            ? progress.completedNodeIds
            : [...progress.completedNodeIds, nodeId];

        const pendingReviewNodeIds = progress.pendingReviewNodeIds.filter((pendingNodeId) => pendingNodeId !== nodeId);

        const nextProgress: JourneyProgress = {
            ...progress,
            completedNodeIds,
            pendingReviewNodeIds,
            currentNodeId: progress.currentNodeId === nodeId ? null : progress.currentNodeId,
            resumableNodeId: progress.resumableNodeId === nodeId ? undefined : progress.resumableNodeId,
            lastCompletedNodeId: nodeId,
            lastUpdatedAt: nowIso(),
            pendingSyncEvents: [
                ...progress.pendingSyncEvents,
                createSyncEvent(nodeId, nodeCompletionEventType(node)),
            ],
        };

        return this.persistAndHydrate(resolvedTrackDefinition, nextProgress);
    }

    async markLessonNodeCompleted(
        lessonId: string,
        trackDefinition?: JourneyTrackDefinition
    ): Promise<JourneySnapshot | null> {
        const resolvedTrackDefinition = await this.resolveTrackDefinition(trackDefinition);
        const node = resolvedTrackDefinition.units
            .flatMap((unit) => unit.nodes)
            .find((entry) => entry.type === 'lesson' && entry.lessonId === lessonId);

        if (!node) {
            return null;
        }

        return this.markNodeCompleted(node.id, resolvedTrackDefinition);
    }

    async markReviewNodeCompleted(
        lessonId: string,
        trackDefinition?: JourneyTrackDefinition
    ): Promise<JourneySnapshot | null> {
        const resolvedTrackDefinition = await this.resolveTrackDefinition(trackDefinition);
        const node = resolvedTrackDefinition.units
            .flatMap((unit) => unit.nodes)
            .find((entry) => entry.type === 'review' && entry.lessonId === lessonId);

        if (!node) {
            return null;
        }

        return this.markNodeCompleted(node.id, resolvedTrackDefinition);
    }

    async reset(trackDefinition?: JourneyTrackDefinition): Promise<void> {
        const resolvedTrackDefinition = await this.resolveTrackDefinition(trackDefinition);
        await removeStorageKey(STORAGE_KEYS.JOURNEY_PROGRESS);
        const freshProgress = await this.buildInitialProgress(resolvedTrackDefinition);
        await this.writeStore({
            schemaVersion: JOURNEY_PROGRESS_SCHEMA_VERSION,
            activeTrackId: resolvedTrackDefinition.id,
            tracks: {
                [resolvedTrackDefinition.id]: freshProgress,
            },
        });
    }

    private async ensureProgress(trackDefinition: JourneyTrackDefinition): Promise<JourneyProgress> {
        const store = (await this.readStore()) ?? this.createEmptyStore(trackDefinition.id);
        const normalized = this.normalizeProgress(store.tracks[trackDefinition.id], trackDefinition);

        if (!normalized) {
            const migrated = await this.buildInitialProgress(trackDefinition);
            await this.persistProgress(trackDefinition, migrated, store);
            return migrated;
        }

        const hydrated = await this.hydrateProgress(trackDefinition, normalized);
        await this.persistProgress(trackDefinition, hydrated, store);
        return hydrated;
    }

    private async persistAndHydrate(
        trackDefinition: JourneyTrackDefinition,
        progress: JourneyProgress
    ): Promise<JourneySnapshot> {
        const finalProgress = await this.hydrateProgress(trackDefinition, progress, nowIso());
        await this.persistProgress(trackDefinition, finalProgress);
        return JourneyRecommendationService.computeSnapshot(trackDefinition, finalProgress);
    }

    /**
     * Uma trilha está concluída quando TODOS os seus nós estão concluídos.
     *
     * Trilha sem progresso guardado não está concluída — e trilha sem nós
     * também não, senão um catálogo vazio ou ainda não hidratado destravaria o
     * curso inteiro de uma vez, que é o oposto do que o cadeado existe para
     * fazer.
     */
    private isTrackCompleted(trackId: string, store: JourneyProgressStore | null): boolean {
        const progress = store?.tracks?.[trackId];

        if (!progress) {
            return false;
        }

        const nodeIds = JourneyDefinitionService.getTrackDefinition(trackId)
            .units.flatMap((unit) => unit.nodes.map((node) => node.id));

        if (nodeIds.length === 0) {
            return false;
        }

        const completed = new Set(progress.completedNodeIds);
        return nodeIds.every((nodeId) => completed.has(nodeId));
    }

    /**
     * A trilha ativa passou a ser DERIVADA da regra sequencial em 2026-08-14,
     * em vez de lida direto de `store.activeTrackId`.
     *
     * O percurso é único: a trilha certa é a primeira aberta que ainda não
     * terminou, e `activeTrackId` virou registro do que foi resolvido, não a
     * fonte da decisão. Guardar a decisão no store significava que, ao concluir
     * uma trilha, nada movia o aluno para a seguinte — a Galáxia prometia
     * "a trilha seguinte abre quando esta terminar" e ninguém cumpria.
     *
     * O fallback para `activeTrackId` e depois para o default cobre o catálogo
     * ainda não hidratado, quando não há trilha nenhuma para ordenar.
     */
    private async resolveTrackDefinition(trackDefinition?: JourneyTrackDefinition): Promise<JourneyTrackDefinition> {
        if (trackDefinition) {
            return trackDefinition;
        }

        const store = await this.readStore();
        const tracks = LessonCatalogService.listTracks();
        const completedTrackIds = new Set(
            tracks.map((track) => track.id).filter((trackId) => this.isTrackCompleted(trackId, store)),
        );

        const sequentialTrackId = resolveActiveTrackId(tracks, completedTrackIds);
        const defaultTrackId = JourneyDefinitionService.getDefaultTrackId();
        const activeTrackId = sequentialTrackId ?? store?.activeTrackId ?? defaultTrackId ?? undefined;

        return JourneyDefinitionService.getTrackDefinition(activeTrackId);
    }

    private async hydrateProgress(
        trackDefinition: JourneyTrackDefinition,
        progress: JourneyProgress,
        lastUpdatedAt: string = progress.lastUpdatedAt
    ): Promise<JourneyProgress> {
        const hydratedProgress = await this.withFreshReviewState(trackDefinition, progress);
        const hydratedTrack = JourneyRecommendationService.resolveTrack(trackDefinition, hydratedProgress);
        const currentUnitId = JourneyRecommendationService.resolveCurrentUnitId(hydratedTrack, hydratedProgress);

        return {
            ...hydratedProgress,
            activeTrackId: trackDefinition.id,
            currentUnitId,
            lastUpdatedAt,
        };
    }

    private createEmptyStore(activeTrackId: string): JourneyProgressStore {
        return {
            schemaVersion: JOURNEY_PROGRESS_SCHEMA_VERSION,
            activeTrackId,
            tracks: {},
        };
    }

    private async readStore(): Promise<JourneyProgressStore | null> {
        const raw = await readJsonStorage<unknown | null>(STORAGE_KEYS.JOURNEY_PROGRESS, null);
        return this.normalizeStore(raw);
    }

    private async writeStore(store: JourneyProgressStore): Promise<void> {
        await writeJsonStorage(STORAGE_KEYS.JOURNEY_PROGRESS, store);
    }

    private async persistProgress(
        trackDefinition: JourneyTrackDefinition,
        progress: JourneyProgress,
        existingStore?: JourneyProgressStore
    ): Promise<void> {
        const store = existingStore ?? (await this.readStore()) ?? this.createEmptyStore(trackDefinition.id);
        await this.writeStore({
            schemaVersion: JOURNEY_PROGRESS_SCHEMA_VERSION,
            activeTrackId: trackDefinition.id,
            tracks: {
                ...store.tracks,
                [trackDefinition.id]: progress,
            },
        });
    }

    private async withFreshReviewState(
        trackDefinition: JourneyTrackDefinition,
        progress: JourneyProgress
    ): Promise<JourneyProgress> {
        const dueLessonIds = await SpacedRepetitionService.getDueLessons();
        const pendingReviewNodeIds = this.mapLessonIdsToReviewNodeIds(trackDefinition, dueLessonIds);
        const sanitizedCompletedNodeIds = progress.completedNodeIds.filter((nodeId) => Boolean(this.findNode(trackDefinition, nodeId)));

        return {
            ...progress,
            completedNodeIds: sanitizedCompletedNodeIds,
            pendingReviewNodeIds,
        };
    }

    private async buildInitialProgress(trackDefinition: JourneyTrackDefinition): Promise<JourneyProgress> {
        const [trackedLessonIds, dueLessonIds] = await Promise.all([
            SpacedRepetitionService.getTrackedLessonIds(),
            SpacedRepetitionService.getDueLessons(),
        ]);

        const completedNodeIds = this.mapLessonIdsToLessonNodeIds(trackDefinition, trackedLessonIds);
        const pendingReviewNodeIds = this.mapLessonIdsToReviewNodeIds(trackDefinition, dueLessonIds);
        const lastCompletedNodeId = this.resolveLastCompletedNodeId(trackDefinition, completedNodeIds);
        const currentUnitId = this.resolveInitialUnitId(trackDefinition, lastCompletedNodeId);

        return {
            schemaVersion: JOURNEY_PROGRESS_SCHEMA_VERSION,
            activeTrackId: trackDefinition.id,
            currentUnitId,
            currentNodeId: null,
            completedNodeIds,
            pendingReviewNodeIds,
            lastUpdatedAt: nowIso(),
            lastCompletedNodeId,
            pendingSyncEvents: [],
        };
    }

    private normalizeProgress(raw: unknown, trackDefinition: JourneyTrackDefinition): JourneyProgress | null {
        if (!raw || typeof raw !== 'object') {
            return null;
        }

        const candidate = raw as Partial<JourneyProgress>;
        if (candidate.schemaVersion !== JOURNEY_PROGRESS_SCHEMA_VERSION) {
            return null;
        }

        if (candidate.activeTrackId !== trackDefinition.id) {
            return null;
        }

        if (typeof candidate.currentUnitId !== 'string') {
            return null;
        }

        return {
            schemaVersion: JOURNEY_PROGRESS_SCHEMA_VERSION,
            activeTrackId: candidate.activeTrackId,
            currentUnitId: candidate.currentUnitId,
            currentNodeId: typeof candidate.currentNodeId === 'string' ? candidate.currentNodeId : null,
            completedNodeIds: Array.isArray(candidate.completedNodeIds) ? candidate.completedNodeIds.filter(Boolean) : [],
            pendingReviewNodeIds: Array.isArray(candidate.pendingReviewNodeIds)
                ? candidate.pendingReviewNodeIds.filter(Boolean)
                : [],
            lastUpdatedAt: typeof candidate.lastUpdatedAt === 'string' ? candidate.lastUpdatedAt : nowIso(),
            lastCompletedNodeId:
                typeof candidate.lastCompletedNodeId === 'string' ? candidate.lastCompletedNodeId : undefined,
            resumableNodeId: typeof candidate.resumableNodeId === 'string' ? candidate.resumableNodeId : undefined,
            pendingSyncEvents: Array.isArray(candidate.pendingSyncEvents) ? candidate.pendingSyncEvents : [],
        };
    }

    private normalizeStore(raw: unknown): JourneyProgressStore | null {
        if (!raw || typeof raw !== 'object') {
            return null;
        }

        const candidate = raw as Partial<JourneyProgressStore>;
        if (candidate.schemaVersion === LEGACY_JOURNEY_PROGRESS_SCHEMA_VERSION) {
            return this.normalizeLegacyProgress(raw);
        }

        if (candidate.schemaVersion !== JOURNEY_PROGRESS_SCHEMA_VERSION) {
            return null;
        }

        if (!candidate.tracks || typeof candidate.tracks !== 'object') {
            return null;
        }

        const tracks = Object.entries(candidate.tracks).reduce<Record<string, JourneyProgress>>(
            (accumulator, [trackId, progress]) => {
                if (trackId && progress && typeof progress === 'object') {
                    accumulator[trackId] = progress as JourneyProgress;
                }

                return accumulator;
            },
            {}
        );

        const activeTrackId =
            typeof candidate.activeTrackId === 'string' && candidate.activeTrackId in tracks
                ? candidate.activeTrackId
                : Object.keys(tracks)[0];

        if (!activeTrackId) {
            return null;
        }

        return {
            schemaVersion: JOURNEY_PROGRESS_SCHEMA_VERSION,
            activeTrackId,
            tracks,
        };
    }

    private normalizeLegacyProgress(raw: unknown): JourneyProgressStore | null {
        const candidate = raw as Partial<JourneyProgress>;
        const defaultTrackId = JourneyDefinitionService.getDefaultTrackId();
        const activeTrackId =
            typeof candidate.activeTrackId === 'string' && candidate.activeTrackId.startsWith('track-')
                ? candidate.activeTrackId
                : defaultTrackId;

        if (!activeTrackId || typeof candidate.currentUnitId !== 'string') {
            return null;
        }

        return {
            schemaVersion: JOURNEY_PROGRESS_SCHEMA_VERSION,
            activeTrackId,
            tracks: {
                [activeTrackId]: {
                    schemaVersion: JOURNEY_PROGRESS_SCHEMA_VERSION,
                    activeTrackId,
                    currentUnitId: candidate.currentUnitId,
                    currentNodeId: typeof candidate.currentNodeId === 'string' ? candidate.currentNodeId : null,
                    completedNodeIds: Array.isArray(candidate.completedNodeIds) ? candidate.completedNodeIds.filter(Boolean) : [],
                    pendingReviewNodeIds: Array.isArray(candidate.pendingReviewNodeIds)
                        ? candidate.pendingReviewNodeIds.filter(Boolean)
                        : [],
                    lastUpdatedAt: typeof candidate.lastUpdatedAt === 'string' ? candidate.lastUpdatedAt : nowIso(),
                    lastCompletedNodeId:
                        typeof candidate.lastCompletedNodeId === 'string' ? candidate.lastCompletedNodeId : undefined,
                    resumableNodeId: typeof candidate.resumableNodeId === 'string' ? candidate.resumableNodeId : undefined,
                    pendingSyncEvents: Array.isArray(candidate.pendingSyncEvents) ? candidate.pendingSyncEvents : [],
                },
            },
        };
    }

    private findNode(trackDefinition: JourneyTrackDefinition, nodeId: string): JourneyNodeDefinition | undefined {
        return trackDefinition.units
            .flatMap((unit) => unit.nodes)
            .find((node) => node.id === nodeId);
    }

    private mapLessonIdsToLessonNodeIds(trackDefinition: JourneyTrackDefinition, lessonIds: string[]): string[] {
        return trackDefinition.units
            .flatMap((unit) => unit.nodes)
            .filter((node) => node.type === 'lesson' && node.lessonId && lessonIds.includes(node.lessonId))
            .map((node) => node.id);
    }

    private mapLessonIdsToReviewNodeIds(trackDefinition: JourneyTrackDefinition, lessonIds: string[]): string[] {
        return trackDefinition.units
            .flatMap((unit) => unit.nodes)
            .filter((node) => node.type === 'review' && node.lessonId && lessonIds.includes(node.lessonId))
            .map((node) => node.id);
    }

    private resolveLastCompletedNodeId(trackDefinition: JourneyTrackDefinition, completedNodeIds: string[]): string | undefined {
        const orderedNodeIds = trackDefinition.units.flatMap((unit) => unit.nodes.map((node) => node.id));
        const completedNode = [...orderedNodeIds].reverse().find((nodeId) => completedNodeIds.includes(nodeId));
        return completedNode;
    }

    private resolveInitialUnitId(trackDefinition: JourneyTrackDefinition, lastCompletedNodeId?: string): string {
        if (!lastCompletedNodeId) {
            return trackDefinition.initialUnitId;
        }

        const completedNode = this.findNode(trackDefinition, lastCompletedNodeId);
        return completedNode?.unitId ?? trackDefinition.initialUnitId;
    }
}

export const JourneyProgressService = new JourneyProgressServiceImpl();
