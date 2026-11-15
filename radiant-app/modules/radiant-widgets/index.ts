/**
 * Ponto de entrada do módulo Expo local dos widgets (ADR 2026-11-15).
 *
 * A `WidgetBridge` resolve o módulo pelo nome, com `requireOptionalNativeModule`:
 * num binário compilado sem a chave `ENABLE_WIDGETS` o pod não entra, e a
 * ausência é caminho normal, não erro.
 */
import { requireOptionalNativeModule } from 'expo-modules-core';

export interface RadiantWidgetsModule {
    /**
     * Grava `json` no `UserDefaults` do App Group, na chave que o widget lê. A chave mora
     * só no Swift (aqui e em `targets/widget/RadiantWidgets.swift`): não é do AsyncStorage.
     * `false` se o grupo não abrir.
     */
    write(appGroup: string, json: string): boolean;
    /** Pede ao WidgetKit que releia todas as timelines. */
    reloadTimelines(): void;
}

/** `null` fora de um build iOS que compilou este módulo. */
export const RadiantWidgets = requireOptionalNativeModule<RadiantWidgetsModule>('RadiantWidgets');

export default RadiantWidgets;
