/**
 * Plugin `with-widgets` (ADR 2026-11-15): com a chave desligada a build é a da
 * `main`; ligada, entra o alvo do WidgetKit e o App Group.
 */
import fs from 'fs';
import path from 'path';

const mockAppleTargets = jest.fn((config: Record<string, unknown>, _props: unknown) => ({ ...config, appleTargetsApplied: true }));
jest.mock('@bacons/apple-targets/app.plugin', () => mockAppleTargets);

const withWidgets = require('../../../plugins/with-widgets');

const GROUP = 'group.com.ascendcreative.radiant.widgets';
const ROOT = path.resolve(__dirname, '../../..');

function baseConfig() {
    return {
        name: 'Radiant',
        slug: 'radiant-app',
        ios: {
            bundleIdentifier: 'com.ascendcreative.radiant',
            entitlements: { 'com.apple.developer.icloud-services': ['CloudKit'] },
        },
    };
}

function withEnv<T>(value: string | undefined, run: () => T): T {
    const before = process.env.EXPO_PUBLIC_ENABLE_WIDGETS;
    if (value === undefined) delete process.env.EXPO_PUBLIC_ENABLE_WIDGETS;
    else process.env.EXPO_PUBLIC_ENABLE_WIDGETS = value;
    try {
        return run();
    } finally {
        if (before === undefined) delete process.env.EXPO_PUBLIC_ENABLE_WIDGETS;
        else process.env.EXPO_PUBLIC_ENABLE_WIDGETS = before;
    }
}

beforeEach(() => mockAppleTargets.mockClear());

describe('with-widgets', () => {
    it.each([undefined, '', 'false', '1', 'yes'])('chave %p: devolve a config intacta e não chama o apple-targets', (value) => {
        const config = baseConfig();
        const result = withEnv(value, () => withWidgets(config));
        expect(result).toEqual(baseConfig());
        expect(mockAppleTargets).not.toHaveBeenCalled();
    });

    it('chave ligada: App Group nas permissões do app, sem perder as que já existiam', () => {
        const result = withEnv('true', () => withWidgets(baseConfig()));
        expect(result.ios.entitlements['com.apple.security.application-groups']).toEqual([GROUP]);
        expect(result.ios.entitlements['com.apple.developer.icloud-services']).toEqual(['CloudKit']);
    });

    it('chave ligada: o apple-targets procura o alvo dentro de modules/, onde ele mora', () => {
        withEnv(' TRUE ', () => withWidgets(baseConfig()));
        expect(mockAppleTargets).toHaveBeenCalledTimes(1);
        const props = mockAppleTargets.mock.calls[0][1] as { root: string };
        expect(props.root).toBe('./modules/radiant-widgets/targets');
        expect(fs.existsSync(path.join(ROOT, props.root, 'widget', 'expo-target.config.js'))).toBe(true);
    });

    it('a chave de build é a mesma que o AppConfig lê', () => {
        expect(withWidgets.widgetsEnabled({ EXPO_PUBLIC_ENABLE_WIDGETS: 'true' })).toBe(true);
        expect(withWidgets.widgetsEnabled({})).toBe(false);
    });

    it('o app.json registra o plugin', () => {
        const app = JSON.parse(fs.readFileSync(path.join(ROOT, 'app.json'), 'utf8'));
        expect(app.expo.plugins).toContain('./plugins/with-widgets');
    });
});
