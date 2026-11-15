const withAppleTargets = require('@bacons/apple-targets/app.plugin');

/**
 * Widgets da tela inicial do iOS (ADR 2026-11-15).
 *
 * Só age quando a build liga os widgets (`EXPO_PUBLIC_ENABLE_WIDGETS`, a mesma
 * variável que o `AppConfig` lê). Com a chave desligada a config sai intacta:
 * sem alvo, sem App Group, sem permissão nova. Ligada, o App Group entra nas
 * permissões do app (o apple-targets espelha a lista no alvo) e o alvo vem de
 * `modules/radiant-widgets/targets/widget`, porque `targets/` na raiz do app fica
 * fora da política de escrita do Loop.
 */
const APP_GROUP = 'group.com.ascendcreative.radiant.widgets';
const TARGETS_ROOT = './modules/radiant-widgets/targets';

function widgetsEnabled(env = process.env) {
    // Mesma leitura do `readBooleanFlag` do app: só "true" liga, padrão desligado.
    return String(env.EXPO_PUBLIC_ENABLE_WIDGETS ?? '').trim().toLowerCase() === 'true';
}

function withWidgets(config) {
    if (!widgetsEnabled()) return config;
    const entitlements = config.ios?.entitlements ?? {};
    const groups = entitlements['com.apple.security.application-groups'] ?? [];
    const withGroup = {
        ...config,
        ios: {
            ...config.ios,
            entitlements: {
                ...entitlements,
                'com.apple.security.application-groups': groups.includes(APP_GROUP) ? groups : [...groups, APP_GROUP],
            },
        },
    };
    return withAppleTargets(withGroup, { root: TARGETS_ROOT });
}

module.exports = withWidgets;
module.exports.widgetsEnabled = widgetsEnabled;
module.exports.APP_GROUP = APP_GROUP;
