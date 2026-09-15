/**
 * Fronteira nativa do CloudKit privado e schema do registro (ADR 2026-09-15).
 *
 * O domínio nunca importa API nativa: fala com `PrivateCloudPort`, que o
 * `CloudKitPrivateAdapter` implementa, e é o adaptador — só ele — que conhece
 * este contrato.
 *
 * O payload trafega como **string JSON opaca**. O módulo nativo não conhece o
 * formato do progresso, o que mantém o Swift pequeno e faz a evolução do
 * schema ser mudança de TypeScript, não de código nativo — que exigiria build
 * novo para cada campo acrescentado.
 */

/** Record type no banco privado do usuário. */
export const CLOUDKIT_RECORD_TYPE = 'ProgressBackup';

/**
 * `recordName` fixo, um registro por usuário na zona padrão do banco privado.
 *
 * É o nome fixo que torna a escrita **idempotente**: salvar de novo atualiza o
 * mesmo registro em vez de acumular histórico. Trocar este valor é migração de
 * schema, não detalhe de implementação.
 */
export const CLOUDKIT_RECORD_NAME = 'progress-backup-v1';

/**
 * Versão do envelope do registro, independente do `schemaVersion` do
 * `ProgressBackup`. Um envelope de versão desconhecida é lido como "não há
 * backup utilizável" — nunca aplicado parcialmente sobre o progresso local.
 */
export const CLOUDKIT_PAYLOAD_VERSION = 1;

/** Único container do App ID, conforme o ADR. Aliases não são permitidos. */
export const CLOUDKIT_CONTAINER = 'iCloud.com.ascendcreative.radiant';

export type CloudKitAccountStatus =
    | 'available'
    | 'no-account'
    | 'restricted'
    | 'could-not-determine'
    | 'temporarily-unavailable';

/**
 * Nada aqui identifica a pessoa: sem nome, sem e-mail, sem identificador de
 * conta do Radiant. O container privado do próprio usuário é a fronteira de
 * identidade deste recurso.
 */
export type CloudKitBackupRecord = {
    payloadVersion: number;
    /** JSON do `ProgressBackup`. */
    payload: string;
    savedAt: string;
};

export type CloudKitNativeErrorCode =
    | 'not-authenticated'
    | 'network-unavailable'
    | 'transient'
    | 'unrecoverable';

export function nativeErrorCode(error: unknown): CloudKitNativeErrorCode | null {
    if (typeof error !== 'object' || error === null) return null;
    const code = (error as { code?: unknown }).code;
    return code === 'not-authenticated' || code === 'network-unavailable'
        || code === 'transient' || code === 'unrecoverable'
        ? code
        : null;
}

/** Superfície mínima do módulo Expo local; ausente fora de um build iOS assinado. */
export interface RadiantCloudKitNative {
    accountStatus(): Promise<CloudKitAccountStatus>;
    fetchBackup(): Promise<CloudKitBackupRecord | null>;
    saveBackup(record: CloudKitBackupRecord): Promise<{ savedAt: string }>;
}
