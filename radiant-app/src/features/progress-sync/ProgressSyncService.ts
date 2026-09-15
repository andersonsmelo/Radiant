import AsyncStorage from '@react-native-async-storage/async-storage';

import { STORAGE_KEYS } from '../../constants/storageKeys';
import { LocalProgressAdapter } from './LocalProgressAdapter';
import { resolvePrivateCloudAdapter } from './CloudKitPrivateAdapter';
import {
    isCloudConflict,
    isCloudUnavailable,
    type BackupState,
    type BackupStateV1,
    type LocalProgressPort,
    type PrivateCloudPort,
    type ProgressBackup,
} from './progressSync.types';

export type ProgressSyncStorage = Pick<typeof AsyncStorage, 'getItem' | 'setItem'>;

type Deps = {
    cloud?: PrivateCloudPort;
    local?: LocalProgressPort;
    storage?: ProgressSyncStorage;
};

const INITIAL_STATE: BackupState = { enabled: false, decided: false, lastBackupAt: null, lastError: null };

function laterIso(a: string | null, b: string | null): string | null {
    if (a === null) return b;
    if (b === null) return a;
    return Date.parse(b) > Date.parse(a) ? b : a;
}

/**
 * Conflito: mescla, nunca apaga. União de concluídos por trilha, agenda mais
 * recente por nó, maior XP e sequência, `lastRefillAt` mais recente. Uma nuvem
 * vazia ou ausente devolve o local intacto.
 */
export function mergeProgressBackups(local: ProgressBackup, cloud: ProgressBackup | null): ProgressBackup {
    if (cloud === null) return local;

    const completedNodesByTrack: Record<string, string[]> = {};
    for (const trackId of new Set([...Object.keys(local.completedNodesByTrack), ...Object.keys(cloud.completedNodesByTrack)])) {
        completedNodesByTrack[trackId] = [...new Set([
            ...(local.completedNodesByTrack[trackId] ?? []),
            ...(cloud.completedNodesByTrack[trackId] ?? []),
        ])];
    }

    const reviewSchedule = { ...local.reviewSchedule };
    for (const [lessonId, remote] of Object.entries(cloud.reviewSchedule)) {
        const current = reviewSchedule[lessonId];
        if (!current || Date.parse(remote.lastReviewedAt) > Date.parse(current.lastReviewedAt)) {
            reviewSchedule[lessonId] = remote;
        }
    }

    return {
        schemaVersion: 1,
        savedAt: local.savedAt,
        completedNodesByTrack,
        reviewSchedule,
        totalXp: Math.max(local.totalXp, cloud.totalXp),
        streakDays: Math.max(local.streakDays, cloud.streakDays),
        lastRefillAt: laterIso(local.lastRefillAt, cloud.lastRefillAt),
    };
}

function parseState(raw: string | null): BackupState {
    if (raw === null) return INITIAL_STATE;
    try {
        const value: unknown = JSON.parse(raw);
        if (typeof value !== 'object' || value === null) return INITIAL_STATE;
        const record = value as Record<string, unknown>;
        if (record.schemaVersion !== 1) return INITIAL_STATE;
        return {
            enabled: record.enabled === true,
            // Registro gravado por build anterior não tem o campo, e a chave
            // existir já prova que houve decisão — por isso `!== false`.
            decided: record.decided !== false,
            lastBackupAt: typeof record.lastBackupAt === 'string' ? record.lastBackupAt : null,
                    lastError: record.lastError === 'cloud-unavailable' || record.lastError === 'failed' || record.lastError === 'incompatible'
                ? record.lastError
                : null,
        };
    } catch {
        return INITIAL_STATE;
    }
}

export class ProgressSyncService {
    /** Tentativas de envio por backup, contando a primeira. Limite explícito. */
    private static readonly TENTATIVAS_DE_ENVIO = 3;

    private fila: Promise<unknown> = Promise.resolve();
    private cloudPort: PrivateCloudPort | null;
    private readonly local: LocalProgressPort;
    private readonly storage: ProgressSyncStorage;

    constructor(deps: Deps = {}) {
        this.cloudPort = deps.cloud ?? null;
        this.local = deps.local ?? new LocalProgressAdapter();
        this.storage = deps.storage ?? AsyncStorage;
    }

    /**
     * Resolução preguiçosa de propósito: este módulo é importado na abertura,
     * e consultar o runtime de módulos nativos no `import` faria toda partida —
     * e toda suíte que apenas toca neste arquivo — pagar por um adaptador que
     * só é usado quando o backup está ligado.
     */
    private get cloud(): PrivateCloudPort {
        this.cloudPort ??= resolvePrivateCloudAdapter();
        return this.cloudPort;
    }

    async getState(): Promise<BackupState> {
        return parseState(await this.storage.getItem(STORAGE_KEYS.PROGRESS_BACKUP));
    }

    /**
     * Ligar sobe o local na hora; desligar só para de sincronizar — nada é
     * apagado. Desligar agora também **marca a decisão no registro remoto**,
     * que é o único lugar que sobrevive a um uninstall: sem isso, reinstalar
     * ressuscitaria um backup que o dono tinha desligado de propósito.
     */
    async setEnabled(enabled: boolean, nowMs: number): Promise<BackupState> {
        const state = await this.writeState({ ...(await this.getState()), enabled, decided: true });
        return enabled ? this.backupNow(nowMs) : this.emFila(() => this.marcarOptOutRemoto(state));
    }

    /**
     * Grava `backupEnabled: false` no registro remoto, preservando o payload.
     *
     * Best-effort e silencioso: desligar é ação local e não pode falhar por
     * causa da rede. Se a nuvem estiver fora, o registro remoto continua
     * dizendo "ligado" — risco conhecido, registrado no relatório.
     */
    private async marcarOptOutRemoto(state: BackupState): Promise<BackupState> {
        try {
            const remoto = await this.cloud.pull();
            // Sem registro não há o que marcar, e criar um só para dizer
            // "desligado" inventaria backup que o dono nunca pediu.
            if (remoto.kind !== 'usable') return state;
            await this.cloud.push({ ...remoto.backup, backupEnabled: false });
        } catch (cause) {
            console.error('[ProgressSyncService] Falha ao marcar opt-out no iCloud:', cause);
        }
        return state;
    }

    /** `push` a cada conclusão de nó: mescla o que existe na nuvem e sobe a união. */
    async backupNow(nowMs: number): Promise<BackupState> {
        return this.emFila(() => this.executarBackup(nowMs));
    }

    /** `pull` na abertura: nuvem vazia nunca substitui o progresso local. */
    async restoreOnLaunch(nowMs: number): Promise<BackupState> {
        return this.emFila(() => this.executarRestore(nowMs));
    }

    private async executarBackup(nowMs: number): Promise<BackupState> {
        const state = await this.getState();
        if (!state.enabled) return state;

        try {
            for (let tentativa = 1; tentativa <= ProgressSyncService.TENTATIVAS_DE_ENVIO; tentativa += 1) {
                const remoto = await this.cloud.pull();

                // Registro presente que este binário não entende. Gravar aqui
                // destruiria progresso real — provavelmente de uma versão mais
                // nova do app —, e é exatamente o que o backup existe para
                // impedir. Não envia, não aplica, informa e sai.
                if (remoto.kind === 'incompatible') {
                    return this.writeState({ ...state, lastError: 'incompatible' });
                }

                const local = await this.local.snapshot(new Date(nowMs).toISOString());
                const cloud = remoto.kind === 'usable' ? remoto.backup : null;
                const merged = mergeProgressBackups(local, cloud);
                if (cloud !== null) await this.local.apply(merged);

                try {
                    // Subir é, por definição, estar ligado: o registro carrega
                    // a decisão para a próxima instalação.
                    const { savedAt } = await this.cloud.push({ ...merged, backupEnabled: true });
                    return this.writeState({ enabled: true, decided: true, lastBackupAt: savedAt, lastError: null });
                } catch (cause) {
                    if (!isCloudConflict(cause)) throw cause;
                    // Outro aparelho gravou entre o nosso pull e o nosso push.
                    // Refazer o ciclo é o que garante que a mescla inclua o que
                    // chegou; reenviar o mesmo snapshot apagaria aquilo.
                }
            }

            // Limite pequeno e explícito. Conflito que não cede é falha, não
            // motivo para tentar para sempre: o local está intacto e a próxima
            // conclusão de nó tenta de novo.
            return this.writeState({ ...state, lastError: 'failed' });
        } catch (cause) {
            return this.recordFailure(state, cause);
        }
    }

    private async executarRestore(nowMs: number): Promise<BackupState> {
        const state = await this.getState();

        // Só quem DECIDIU desligar é ignorado. Instalação limpa não decidiu
        // nada — a chave sequer existe —, e é justamente quem mais precisa que
        // a nuvem seja consultada. Confundir os dois foi o defeito medido no
        // iPhone: reinstalar zerava a tela com o backup íntegro na nuvem.
        if (state.decided && !state.enabled) return state;

        try {
            const remoto = await this.cloud.pull();

            if (remoto.kind === 'incompatible') {
                // Segue INDECISO de propósito: um binário mais novo pode
                // entender este registro, e marcar decisão aqui desligaria o
                // restore para sempre neste aparelho.
                return this.writeState({ ...state, lastError: 'incompatible' });
            }

            if (remoto.kind === 'absent') {
                // Resposta definitiva: não há backup. Marca a decisão para não
                // consultar a rede a cada abertura de quem nunca fez opt-in.
                return this.writeState({ ...state, decided: true, lastError: null });
            }

            // O registro remoto é a autoridade sobre o opt-in, porque é o único
            // que sobrevive ao uninstall. Ausente significa ligado, para os
            // registros que builds anteriores gravaram sem o campo.
            if (remoto.backup.backupEnabled === false) {
                return this.writeState({ ...state, enabled: false, decided: true, lastError: null });
            }

            const local = await this.local.snapshot(new Date(nowMs).toISOString());
            await this.local.apply(mergeProgressBackups(local, remoto.backup));

            // Retoma a proteção: quem tinha backup ligado e reinstalou não
            // deveria ficar sem backup em silêncio.
            return this.writeState({ ...state, enabled: true, decided: true, lastError: null });
        } catch (cause) {
            // Falha de rede não é decisão: continua indeciso e tenta de novo na
            // próxima abertura.
            return this.recordFailure(state, cause);
        }
    }

    /**
     * Serialização mínima das operações de backup deste aparelho.
     *
     * `backupNow` é um ciclo ler-mesclar-gravar sobre o mesmo registro remoto e
     * o mesmo storage local. Duas conclusões de nó em sequência rápida disparam
     * dois ciclos, e sem fila eles interleiam: os dois leem o mesmo estado e o
     * segundo grava por cima do primeiro sem tê-lo lido. A fila é uma corrente
     * de promises — pequena, sem biblioteca, e o `then(op, op)` garante que uma
     * falha anterior não trave as chamadas seguintes.
     */
    private emFila<T>(operacao: () => Promise<T>): Promise<T> {
        const resultado = this.fila.then(operacao, operacao);
        this.fila = resultado.then(() => undefined, () => undefined);
        return resultado;
    }

    private async recordFailure(state: BackupState, cause: unknown): Promise<BackupState> {
        if (!isCloudUnavailable(cause)) {
            console.error('[ProgressSyncService] Falha no backup:', cause);
        }
        return this.writeState({ ...state, lastError: isCloudUnavailable(cause) ? 'cloud-unavailable' : 'failed' });
    }

    private async writeState(state: BackupState): Promise<BackupState> {
        const persisted: BackupStateV1 = { schemaVersion: 1, ...state };
        await this.storage.setItem(STORAGE_KEYS.PROGRESS_BACKUP, JSON.stringify(persisted));
        return state;
    }
}

export const progressSyncService = new ProgressSyncService();
