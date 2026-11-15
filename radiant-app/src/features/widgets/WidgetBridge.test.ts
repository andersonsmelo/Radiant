import { createWidgetBridge, lessonUrl } from './WidgetBridge';
import type { WidgetSource } from './widgetSnapshot';

jest.mock('@react-native-async-storage/async-storage', () => ({ getItem: jest.fn(), setItem: jest.fn() }));

const NOW = new Date(2026, 10, 15, 14, 0, 0);
const SOURCE: WidgetSource = {
    streakDays: 3,
    lastActiveDate: '2026-11-15',
    freezes: 0,
    goalCompleted: 1,
    goalTarget: 2,
    goalDateKey: '2026-11-15',
    nextLesson: { title: 'Proteção radiológica', url: 'radiantapp://learn?nodeId=n&blockId=b' },
};

function setup(enabled: boolean, readSource: () => Promise<WidgetSource> = async () => SOURCE) {
    const calls: string[] = [];
    const write = jest.fn((value: string) => { calls.push('write'); return value; });
    const reload = jest.fn(() => { calls.push('reload'); });
    const read = jest.fn(readSource);
    const bridge = createWidgetBridge({ enabled: () => enabled, readSource: read, now: () => NOW, target: () => ({ write, reload }) });
    return { bridge, write, reload, read, calls };
}

describe('WidgetBridge', () => {
    it('chave desligada: não lê, não grava e não recarrega', async () => {
        const { bridge, write, reload, read } = setup(false);
        await bridge.refresh();
        expect(read).not.toHaveBeenCalled();
        expect(write).not.toHaveBeenCalled();
        expect(reload).not.toHaveBeenCalled();
    });

    it('chave ligada: grava o retrato versionado e só depois recarrega as timelines', async () => {
        const { bridge, write, calls } = setup(true);
        await bridge.refresh();
        expect(calls).toEqual(['write', 'reload']);
        const written = JSON.parse(write.mock.calls[0][0]);
        expect(written.schemaVersion).toBe(1);
        expect(written.entries[0]).toMatchObject({ streakDays: 3, countsToday: true, goalCompleted: 1, goalTarget: 2 });
        expect(written.nextLesson).toEqual(SOURCE.nextLesson);
    });

    it('falha ao ler o estado não derruba quem chamou e não grava retrato pela metade', async () => {
        const warn = jest.spyOn(console, 'warn').mockImplementation(() => undefined);
        const { bridge, write, reload } = setup(true, async () => { throw new Error('storage'); });
        await expect(bridge.refresh()).resolves.toBeUndefined();
        expect(write).not.toHaveBeenCalled();
        expect(reload).not.toHaveBeenCalled();
        warn.mockRestore();
    });
});

describe('WidgetBridge em chamadas seguidas', () => {
    it('grava na ordem das chamadas, cada uma lendo o estado na hora em que roda', async () => {
        const order: string[] = [];
        let next = 1;
        const readSource = jest.fn(async () => {
            const mine = next++;
            // A primeira leitura demora mais: sem fila, ela gravaria por último com dado velho.
            await new Promise((resolve) => setTimeout(resolve, mine === 1 ? 20 : 0));
            return { ...SOURCE, streakDays: mine };
        });
        const write = jest.fn((value: string) => { order.push(String(JSON.parse(value).entries[0].streakDays)); });
        const bridge = createWidgetBridge({ enabled: () => true, readSource, now: () => NOW, target: () => ({ write, reload: () => undefined }) });
        await Promise.all([bridge.refresh(), bridge.refresh()]);
        expect(order).toEqual(['1', '2']);
    });
});

describe('WidgetBridge sem o módulo nativo', () => {
    it('binário compilado sem a chave (chave ligada por OTA): não lê, não grava e não avisa', async () => {
        const warn = jest.spyOn(console, 'warn').mockImplementation(() => undefined);
        const read = jest.fn(async () => SOURCE);
        const bridge = createWidgetBridge({ enabled: () => true, readSource: read, now: () => NOW, target: () => null });
        await expect(bridge.refresh()).resolves.toBeUndefined();
        expect(read).not.toHaveBeenCalled();
        expect(warn).not.toHaveBeenCalled();
        warn.mockRestore();
    });
});

describe('lessonUrl', () => {
    it('aula: abre /learn com o nó e o bloco, como o botão da home', () => {
        expect(lessonUrl({ kind: 'learn', lessonId: 'l', nodeId: 'n 1', blockId: 'b&2' }))
            .toBe('radiantapp://learn?nodeId=n%201&blockId=b%262');
    });

    it('revisão: abre /review', () => {
        expect(lessonUrl({ kind: 'review', dueCount: 2 })).toBe('radiantapp://review');
    });

    it('aula sem nó ou bloco: abre a home, como a home faria', () => {
        expect(lessonUrl({ kind: 'learn', lessonId: 'l', nodeId: null, blockId: null })).toBe('radiantapp://');
    });
});

describe('ENABLE_WIDGETS', () => {
    it('vem desligada quando a build não a liga, e só "true" liga', () => {
        const read = (value: string | undefined) => {
            let flag: boolean | undefined;
            jest.isolateModules(() => {
                if (value === undefined) delete process.env.EXPO_PUBLIC_ENABLE_WIDGETS;
                else process.env.EXPO_PUBLIC_ENABLE_WIDGETS = value;
                flag = require('../../config').AppConfig.ENABLE_WIDGETS;
            });
            delete process.env.EXPO_PUBLIC_ENABLE_WIDGETS;
            return flag;
        };
        expect(read(undefined)).toBe(false);
        expect(read('false')).toBe(false);
        expect(read('true')).toBe(true);
    });
});
