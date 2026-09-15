/**
 * Ponto de entrada do módulo Expo local.
 *
 * O `CloudKitPrivateAdapter` **não** importa este arquivo: ele resolve o módulo
 * pelo nome, com `requireOptionalNativeModule`, para que a ausência do binário
 * nativo seja um caminho normal em vez de erro de importação. Este arquivo
 * existe para a convenção do módulo e para quem quiser consumi-lo tipado.
 *
 * O tipo é declarado aqui, e não importado de `src/`, de propósito: um módulo
 * nativo que depende do código da aplicação inverte a direção da dependência e
 * impede que ele seja extraído depois.
 */
import { requireOptionalNativeModule } from 'expo-modules-core';

export type RadiantCloudKitAccountStatus =
    | 'available'
    | 'no-account'
    | 'restricted'
    | 'could-not-determine'
    | 'temporarily-unavailable';

export type RadiantCloudKitRecord = {
    payloadVersion: number;
    /** JSON opaco: o módulo não conhece o formato do progresso. */
    payload: string;
    savedAt: string;
};

export interface RadiantCloudKitModule {
    accountStatus(): Promise<RadiantCloudKitAccountStatus>;
    fetchBackup(): Promise<RadiantCloudKitRecord | null>;
    saveBackup(record: RadiantCloudKitRecord): Promise<{ savedAt: string }>;
}

/** `null` fora de um build iOS que compilou este módulo. */
export const RadiantCloudKit = requireOptionalNativeModule<RadiantCloudKitModule>('RadiantCloudKit');

export default RadiantCloudKit;
