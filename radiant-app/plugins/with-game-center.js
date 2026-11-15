const { withEntitlementsPlist, withInfoPlist } = require('@expo/config-plugins');

/**
 * Liga semanal pelo Game Center (ADR 2026-11-13): a permissão
 * `com.apple.developer.game-center` e o texto do pedido de lista de amigos.
 *
 * Só entra quando a build liga a liga (`EXPO_PUBLIC_ENABLE_LEAGUE`, a mesma
 * variável que o `AppConfig` lê). Com a chave desligada, o binário não ganha
 * permissão nem texto novo no Info.plist. O módulo `radiant-gamecenter` e o
 * GameKit continuam ligados pelo autolink em todo binário, mas nada os chama
 * sem a chave. Ligar a liga por OTA num binário sem a permissão cai num estado
 * de "indisponível" ou "a liga ainda não abriu" (não medido qual), nunca num erro.
 */
const FRIENDS_USAGE =
    'O Radiant mostra seus amigos do Game Center na liga da semana. Nada além do apelido é exibido.';

function leagueEnabled(env = process.env) {
    // Mesma leitura do `readBooleanFlag` do app: só "true" liga, padrão desligado.
    return String(env.EXPO_PUBLIC_ENABLE_LEAGUE ?? '').trim().toLowerCase() === 'true';
}

function withGameCenter(config) {
    if (!leagueEnabled()) return config;
    config = withEntitlementsPlist(config, (cfg) => {
        cfg.modResults['com.apple.developer.game-center'] = true;
        return cfg;
    });
    return withInfoPlist(config, (cfg) => {
        cfg.modResults.NSGKFriendListUsageDescription = FRIENDS_USAGE;
        return cfg;
    });
}

module.exports = withGameCenter;
module.exports.leagueEnabled = leagueEnabled;
