import AsyncStorage from '@react-native-async-storage/async-storage';
import { STORAGE_KEYS } from '../../constants/storageKeys';
import { DecorationsCoordinator, progressFromSources, type DecorationsPorts } from './DecorationsService';
import type { DecorationProgress } from './unlocks';

jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock'));

const base: DecorationProgress = { lessonsCompleted: 0, unitsCompleted: 0, streakDays: 0, allMissionsDoneToday: false, level: 1 };
function service(progress: Partial<DecorationProgress> = {}, subscriber = false) {
  const ports: DecorationsPorts = { progress: jest.fn(async () => ({ ...base, ...progress })), subscriber: jest.fn(async () => subscriber) };
  return { svc: new DecorationsCoordinator(ports), ports };
}
const stored = async () => JSON.parse((await AsyncStorage.getItem(STORAGE_KEYS.DECORATIONS)) ?? 'null');

beforeEach(() => AsyncStorage.clear());

describe('DecorationsCoordinator.sync', () => {
  it('grava em silêncio o que o aluno já cumpriu, e devolve só o estado (sem evento de celebração)', async () => {
    const { svc } = service({ lessonsCompleted: 10, streakDays: 3 });
    const state = await svc.sync();
    expect(state.unlocked.sort()).toEqual(['moldura-aurora', 'selo-faisca']);
    expect(Object.keys(state).sort()).toEqual(['equipped', 'subscriber', 'unlocked']);
    expect(await stored()).toEqual({ schemaVersion: 1, unlocked: expect.arrayContaining(['moldura-aurora', 'selo-faisca']), equipped: {} });
  });

  it('ganho não volta atrás quando a sequência zera', async () => {
    await service({ streakDays: 7 }).svc.sync();
    const state = await service({ streakDays: 1 }).svc.sync();
    expect(state.unlocked).toContain('moldura-orbita');
  });

  it('nada ganho e nada gravado antes: não cria a chave (a flag desligada nunca chega aqui, e o vazio não suja o backup)', async () => {
    await service().svc.sync();
    expect(await AsyncStorage.getItem(STORAGE_KEYS.DECORATIONS)).toBeNull();
  });

  it('registro corrompido ou de versão mais nova não derruba nem é sobrescrito', async () => {
    await AsyncStorage.setItem(STORAGE_KEYS.DECORATIONS, '{"schemaVersion":2,"unlocked":["x"]}');
    const state = await service({ lessonsCompleted: 1 }).svc.sync();
    expect(state.unlocked).toEqual(['moldura-aurora']);
    expect(await AsyncStorage.getItem(STORAGE_KEYS.DECORATIONS)).toBe('{"schemaVersion":2,"unlocked":["x"]}');
  });
});

describe('DecorationsCoordinator.equip', () => {
  it('equipa o que está disponível; recusa o bloqueado e o de outro encaixe', async () => {
    const { svc } = service({ lessonsCompleted: 1 });
    await svc.sync();
    expect(await svc.equip('moldura', 'moldura-aurora')).toBe(true);
    expect(await svc.equip('moldura', 'moldura-orbita')).toBe(false);
    expect(await svc.equip('selo', 'moldura-aurora')).toBe(false);
    expect((await stored()).equipped).toEqual({ moldura: 'moldura-aurora' });
    expect(await svc.equip('moldura', null)).toBe(true);
    expect((await stored()).equipped).toEqual({});
  });

  it('exclusivo: equipa só assinando; ao deixar de assinar, some do perfil e a escolha fica', async () => {
    expect(await service({}, false).svc.equip('selo', 'selo-cometa')).toBe(false);
    expect(await service({}, true).svc.equip('selo', 'selo-cometa')).toBe(true);
    const lapsed = await service({}, false).svc.sync();
    expect(lapsed.equipped.selo).toBeNull();
    expect((await stored()).equipped).toEqual({ selo: 'selo-cometa' });
    expect((await service({}, true).svc.sync()).equipped.selo?.id).toBe('selo-cometa');
  });

  it('registro de versão mais nova: equipar recusa e não grava por cima', async () => {
    await AsyncStorage.setItem(STORAGE_KEYS.DECORATIONS, '{"schemaVersion":2,"unlocked":[]}');
    expect(await service({}, true).svc.equip('selo', 'selo-cometa')).toBe(false);
    expect(await AsyncStorage.getItem(STORAGE_KEYS.DECORATIONS)).toBe('{"schemaVersion":2,"unlocked":[]}');
  });

  it('assinatura que não lê vale "não assinante", nunca derruba a tela', async () => {
    const ports: DecorationsPorts = { progress: async () => base, subscriber: async () => { throw new Error('loja'); } };
    expect((await new DecorationsCoordinator(ports).sync()).subscriber).toBe(false);
  });
});

describe('backup e reset', () => {
  it('payload de backup só existe com algo gravado', async () => {
    const { svc } = service({ lessonsCompleted: 1 });
    expect(await svc.backupPayload()).toBeNull();
    await svc.sync(); await svc.equip('moldura', 'moldura-aurora');
    expect(await svc.backupPayload()).toEqual({ unlocked: ['moldura-aurora'], equipped: { moldura: 'moldura-aurora' } });
  });

  it('restaurar une os ganhos; o equipado local vence, e o da nuvem entra se o local está vazio', async () => {
    const { svc } = service({ lessonsCompleted: 1 });
    await svc.sync();
    await svc.absorbBackup({ unlocked: ['selo-faisca', 'inexistente'], equipped: { selo: 'selo-faisca' } });
    expect(await stored()).toEqual({ schemaVersion: 1, unlocked: ['moldura-aurora', 'selo-faisca'], equipped: { selo: 'selo-faisca' } });
    await svc.equip('moldura', 'moldura-aurora');
    // Conflito real: a nuvem traz outra moldura equipada; a escolha deste aparelho fica.
    await svc.absorbBackup({ unlocked: ['moldura-orbita'], equipped: { moldura: 'moldura-orbita' } });
    expect((await stored()).equipped).toEqual({ selo: 'selo-faisca', moldura: 'moldura-aurora' });
  });

  it('reset apaga a chave', async () => {
    const { svc } = service({ lessonsCompleted: 1 });
    await svc.sync();
    await svc.reset();
    expect(await AsyncStorage.getItem(STORAGE_KEYS.DECORATIONS)).toBeNull();
  });
});

describe('progressFromSources', () => {
  const node = (type: string, status: string) => ({ id: `${type}-${status}-${Math.random()}`, type, status, title: 'x' });
  const trail = (units: object[][]) => ({ segments: [{ units: units.map(nodes => ({ nodes })) }] }) as never;

  it('conta aulas e unidades concluídas; revisão vencida de novo não tira a unidade', () => {
    const p = progressFromSources(trail([
      [node('lesson', 'completed'), node('checkpoint', 'completed'), node('review', 'available')],
      [node('lesson', 'completed'), node('lesson', 'available')],
      [],
    ]), { streakDays: 4, totalXp: 60 }, [{ done: true }, { done: true }, { done: false }]);
    expect(p).toEqual({ lessonsCompleted: 2, unitsCompleted: 1, streakDays: 4, allMissionsDoneToday: false, level: 3 });
  });

  it('missões: todas feitas conta; lista vazia (fonte que falhou) não conta', () => {
    const empty = trail([]);
    expect(progressFromSources(empty, { streakDays: 0, totalXp: 0 }, [{ done: true }, { done: true }, { done: true }]).allMissionsDoneToday).toBe(true);
    expect(progressFromSources(empty, { streakDays: 0, totalXp: 0 }, []).allMissionsDoneToday).toBe(false);
  });
});

describe('fila', () => {
  it('uma fonte que nunca responde não prende equipar nem a leitura seguinte', async () => {
    let calls = 0;
    const ports: DecorationsPorts = {
      progress: () => (++calls === 1 ? new Promise(() => undefined) : Promise.resolve({ ...base, lessonsCompleted: 1 })),
      subscriber: async () => false,
    };
    const svc = new DecorationsCoordinator(ports);
    void svc.sync(); // fica pendurada para sempre
    expect((await svc.sync()).unlocked).toEqual(['moldura-aurora']);
    expect(await svc.equip('moldura', 'moldura-aurora')).toBe(true);
  });
});
