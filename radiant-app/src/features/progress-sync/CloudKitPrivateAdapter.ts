import { requireOptionalNativeModule } from 'expo-modules-core';

import { UnavailablePrivateCloudAdapter } from './UnavailablePrivateCloudAdapter';
import {
    CLOUDKIT_PAYLOAD_VERSION,
    nativeErrorCode,
    type CloudKitAccountStatus,
    type RadiantCloudKitNative,
} from './cloudkitBackup.types';
import { CloudUnavailableError, type PrivateCloudPort, type ProgressBackup } from './progressSync.types';

/**
 * Backup no banco privado do iCloud do próprio usuário (ADR 2026-09-15).
 *
 * Toda falha desta classe degrada para modo local: o Radiant é local-first e
 * nenhum estado de nuvem pode bloquear estudo, trilha, revisão ou vidas.
 *
 * A tradução de erro separa duas coisas que o cartão de backup mostra
 * diferente: `cloud-unavailable` é **estado esperado** — sem conta iCloud, sem
 * rede, limite de taxa — e some sozinho quando a condição passa; qualquer outra
 * coisa é **defeito**, vira `failed` e merece aparecer. Colapsar as duas
 * esconderia defeito atrás de uma mensagem tranquilizadora.
 */

const MENSAGEM_POR_STATUS: Record<Exclude<CloudKitAccountStatus, 'available'>, string> = {
    'no-account': 'Nenhuma conta iCloud ativa neste aparelho.',
    restricted: 'O acesso ao iCloud está restrito neste aparelho.',
    'could-not-determine': 'Não foi possível verificar a conta do iCloud agora.',
    'temporarily-unavailable': 'O iCloud está temporariamente indisponível.',
};

function parseSeguro(payload: string): unknown {
    try {
        return JSON.parse(payload);
    } catch {
        // Payload ilegível é lido como ausência, nunca como erro: um registro
        // corrompido não pode virar falha de abertura nem apagar o local.
        return null;
    }
}

function ehProgressBackup(value: unknown): value is ProgressBackup {
    if (typeof value !== 'object' || value === null) return false;
    const c = value as Record<string, unknown>;
    return c.schemaVersion === 1
        && typeof c.savedAt === 'string'
        && typeof c.totalXp === 'number'
        && typeof c.streakDays === 'number'
        && (typeof c.lastRefillAt === 'string' || c.lastRefillAt === null)
        && typeof c.completedNodesByTrack === 'object' && c.completedNodesByTrack !== null
        && typeof c.reviewSchedule === 'object' && c.reviewSchedule !== null;
}

export class CloudKitPrivateAdapter implements PrivateCloudPort {
    constructor(private readonly native: RadiantCloudKitNative) {}

    async pull(): Promise<ProgressBackup | null> {
        await this.exigirContaUtilizavel();

        const registro = await this.traduzindoFalhas(() => this.native.fetchBackup());
        if (registro === null) return null;

        // Envelope de versão desconhecida é ausência, não erro. Uma versão
        // futura pode ter campos que este binário não sabe aplicar, e aplicar
        // pela metade sobre o progresso local é pior que não aplicar: o backup
        // segue intacto na nuvem para um binário que o entenda.
        if (registro.payloadVersion !== CLOUDKIT_PAYLOAD_VERSION) return null;

        const candidato = parseSeguro(registro.payload);
        return ehProgressBackup(candidato) ? candidato : null;
    }

    async push(snapshot: ProgressBackup): Promise<{ savedAt: string }> {
        await this.exigirContaUtilizavel();

        return this.traduzindoFalhas(() => this.native.saveBackup({
            payloadVersion: CLOUDKIT_PAYLOAD_VERSION,
            payload: JSON.stringify(snapshot),
            savedAt: snapshot.savedAt,
        }));
    }

    /**
     * Sem conta utilizável o adaptador nem toca no registro. Consultar mesmo
     * assim renderia o mesmo erro mais tarde, com uma ida a mais e um caminho
     * de falha a mais para distinguir.
     */
    private async exigirContaUtilizavel(): Promise<void> {
        const status = await this.traduzindoFalhas(() => this.native.accountStatus());
        if (status === 'available') return;
        throw new CloudUnavailableError(MENSAGEM_POR_STATUS[status]);
    }

    private async traduzindoFalhas<T>(operacao: () => Promise<T>): Promise<T> {
        try {
            return await operacao();
        } catch (cause) {
            const code = nativeErrorCode(cause);
            if (code === 'not-authenticated') throw new CloudUnavailableError(MENSAGEM_POR_STATUS['no-account']);
            if (code === 'network-unavailable') throw new CloudUnavailableError('Sem conexão para falar com o iCloud.');
            if (code === 'transient') throw new CloudUnavailableError('O iCloud está ocupado; tentaremos de novo depois.');
            throw cause instanceof Error ? cause : new Error(String(cause));
        }
    }
}

/** Nome do módulo Expo local; só existe num build iOS que o compilou. */
export const RADIANT_CLOUDKIT_MODULE = 'RadiantCloudKit';

/**
 * Escolhe o adaptador conforme o binário em que o app está rodando.
 *
 * Sem o módulo nativo — Expo Go, Android, build anterior a esta versão — o
 * backup fica indisponível e o estudo segue local, que é o contrato de
 * produto. Por isso o `catch`: resolver adaptador é trabalho de abertura, e
 * nenhuma falha aqui pode virar erro fatal de bootstrap.
 */
export function resolvePrivateCloudAdapter(): PrivateCloudPort {
    try {
        const native = requireOptionalNativeModule<RadiantCloudKitNative>(RADIANT_CLOUDKIT_MODULE);
        return native ? new CloudKitPrivateAdapter(native) : new UnavailablePrivateCloudAdapter();
    } catch (cause) {
        console.error('[CloudKitPrivateAdapter] Falha ao resolver o módulo nativo:', cause);
        return new UnavailablePrivateCloudAdapter();
    }
}
