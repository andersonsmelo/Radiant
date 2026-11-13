/**
 * O plugin `with-game-center` só põe a permissão do Game Center e o texto da
 * lista de amigos no binário quando a build liga a liga. Com a chave
 * desligada, o projeto nativo sai igual ao da `main`.
 */
const withGameCenter = require('../../../plugins/with-game-center');

type Mod = (config: Record<string, unknown>) => Promise<{ modResults: Record<string, unknown> }>;

async function rodar(env: string | undefined) {
    const anterior = process.env.EXPO_PUBLIC_ENABLE_LEAGUE;
    if (env === undefined) delete process.env.EXPO_PUBLIC_ENABLE_LEAGUE;
    else process.env.EXPO_PUBLIC_ENABLE_LEAGUE = env;
    try {
        const config = withGameCenter({ name: 'Radiant', slug: 'radiant-app' });
        const mods = (config.mods?.ios ?? {}) as Record<string, Mod>;
        const rodarMod = async (nome: string) => {
            const mod = mods[nome];
            if (!mod) return {};
            const saida = await mod({ ...config, modResults: {}, modRequest: { nextMod: async (c: unknown) => c } });
            return saida.modResults;
        };
        return { entitlements: await rodarMod('entitlements'), infoPlist: await rodarMod('infoPlist') };
    } finally {
        if (anterior === undefined) delete process.env.EXPO_PUBLIC_ENABLE_LEAGUE;
        else process.env.EXPO_PUBLIC_ENABLE_LEAGUE = anterior;
    }
}

describe('plugin with-game-center', () => {
    it('sem EXPO_PUBLIC_ENABLE_LEAGUE, não muda nada', async () => {
        await expect(rodar(undefined)).resolves.toEqual({ entitlements: {}, infoPlist: {} });
        await expect(rodar('false')).resolves.toEqual({ entitlements: {}, infoPlist: {} });
    });

    it('com a liga ligada, põe a permissão do Game Center e o texto da lista de amigos', async () => {
        const { entitlements, infoPlist } = await rodar('true');
        expect(entitlements).toEqual({ 'com.apple.developer.game-center': true });
        expect(infoPlist).toEqual({ NSGKFriendListUsageDescription: expect.stringContaining('apelido') });
    });

    it('lê a variável como o app: só "true" liga', () => {
        expect(withGameCenter.leagueEnabled({ EXPO_PUBLIC_ENABLE_LEAGUE: ' TRUE ' })).toBe(true);
        expect(withGameCenter.leagueEnabled({ EXPO_PUBLIC_ENABLE_LEAGUE: '1' })).toBe(false);
        expect(withGameCenter.leagueEnabled({})).toBe(false);
    });

    it('está registrado no app.json', () => {
        const plugins = require('../../../app.json').expo.plugins as unknown[];
        expect(plugins).toContain('./plugins/with-game-center');
    });
});
