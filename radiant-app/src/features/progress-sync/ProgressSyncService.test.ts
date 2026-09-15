import { STORAGE_KEYS } from '../../constants/storageKeys';
import { CloudKitPrivateAdapter } from './CloudKitPrivateAdapter';
import { ProgressSyncService, mergeProgressBackups } from './ProgressSyncService';
import {
    CloudConflictError,
    CloudUnavailableError,
    type IncompatibleReason,
    type LocalProgressPort,
    type PrivateCloudPort,
    type PrivateCloudRead,
    type ProgressBackup,
} from './progressSync.types';

jest.mock('@react-native-async-storage/async-storage', () =>
    require('@react-native-async-storage/async-storage/jest/async-storage-mock'));

const AGORA = Date.parse('2026-09-14T12:00:00.000Z');
const AGORA_ISO = new Date(AGORA).toISOString();

function cartao(lessonId: string, lastReviewedAt: string, interval: number) {
    return {
        lessonId,
        easeFactor: 2.5,
        interval,
        repetitions: 1,
        nextReviewAt: new Date(Date.parse(lastReviewedAt) + interval * 24 * 60 * 60 * 1000).toISOString(),
        lastReviewedAt,
        createdAt: '2026-09-01T00:00:00.000Z',
    };
}

function backup(overrides: Partial<ProgressBackup> = {}): ProgressBackup {
    return {
        schemaVersion: 1,
        savedAt: AGORA_ISO,
        completedNodesByTrack: { 'track-1': ['n1', 'n2'] },
        reviewSchedule: { l1: cartao('l1', '2026-09-10T00:00:00.000Z', 3) },
        totalXp: 120,
        streakDays: 4,
        lastRefillAt: '2026-09-14T11:00:00.000Z',
        ...overrides,
    };
}

function vazio(): ProgressBackup {
    return {
        schemaVersion: 1,
        savedAt: '2026-01-01T00:00:00.000Z',
        completedNodesByTrack: {},
        reviewSchedule: {},
        totalXp: 0,
        streakDays: 0,
        lastRefillAt: null,
    };
}

describe('mergeProgressBackups — mescla, nunca apaga', () => {
    it('faz a união dos nós concluídos por trilha', () => {
        const local = backup({ completedNodesByTrack: { 'track-1': ['n1', 'n2'] } });
        const nuvem = backup({ completedNodesByTrack: { 'track-1': ['n2', 'n3'], 'track-2': ['m1'] } });

        expect(mergeProgressBackups(local, nuvem).completedNodesByTrack).toEqual({
            'track-1': ['n1', 'n2', 'n3'],
            'track-2': ['m1'],
        });
    });

    it('fica com a agenda mais recente de cada nó', () => {
        const antigo = cartao('l1', '2026-09-10T00:00:00.000Z', 3);
        const recente = cartao('l1', '2026-09-13T00:00:00.000Z', 6);
        const soLocal = cartao('l2', '2026-09-12T00:00:00.000Z', 1);
        const local = backup({ reviewSchedule: { l1: antigo, l2: soLocal } });
        const nuvem = backup({ reviewSchedule: { l1: recente } });

        expect(mergeProgressBackups(local, nuvem).reviewSchedule).toEqual({ l1: recente, l2: soLocal });
        expect(mergeProgressBackups(nuvem, local).reviewSchedule).toEqual({ l1: recente, l2: soLocal });
    });

    it('fica com o maior XP e a maior sequência', () => {
        const local = backup({ totalXp: 120, streakDays: 4 });
        const nuvem = backup({ totalXp: 90, streakDays: 9 });

        const mesclado = mergeProgressBackups(local, nuvem);

        expect(mesclado.totalXp).toBe(120);
        expect(mesclado.streakDays).toBe(9);
    });

    it('fica com o lastRefillAt mais recente', () => {
        const local = backup({ lastRefillAt: '2026-09-14T11:00:00.000Z' });
        const nuvem = backup({ lastRefillAt: '2026-09-14T11:30:00.000Z' });

        expect(mergeProgressBackups(local, nuvem).lastRefillAt).toBe('2026-09-14T11:30:00.000Z');
        expect(mergeProgressBackups(nuvem, local).lastRefillAt).toBe('2026-09-14T11:30:00.000Z');
        expect(mergeProgressBackups(local, backup({ lastRefillAt: null })).lastRefillAt).toBe('2026-09-14T11:00:00.000Z');
    });

    it('nuvem vazia nunca substitui o progresso local', () => {
        const local = backup();

        expect(mergeProgressBackups(local, vazio())).toEqual({ ...local, savedAt: local.savedAt });
        expect(mergeProgressBackups(local, null)).toEqual(local);
    });
});

function memoria() {
    const dados = new Map<string, string>();
    return {
        getItem: jest.fn(async (key: string) => dados.get(key) ?? null),
        setItem: jest.fn(async (key: string, value: string) => { dados.set(key, value); }),
        removeItem: jest.fn(async (key: string) => { dados.delete(key); }),
    };
}

function localPort(inicial: ProgressBackup): LocalProgressPort & { aplicado: ProgressBackup[] } {
    const aplicado: ProgressBackup[] = [];
    return {
        aplicado,
        snapshot: jest.fn(async (nowIso: string) => ({ ...inicial, savedAt: nowIso })),
        apply: jest.fn(async (merged: ProgressBackup) => { aplicado.push(merged); }),
    };
}

function nuvem(remoto: ProgressBackup | null): PrivateCloudPort & { enviados: ProgressBackup[] } {
    return nuvemLendo(remoto === null ? { kind: 'absent' } : { kind: 'usable', backup: remoto });
}

function nuvemLendo(leitura: PrivateCloudRead): PrivateCloudPort & { enviados: ProgressBackup[] } {
    const enviados: ProgressBackup[] = [];
    return {
        enviados,
        pull: jest.fn(async () => leitura),
        push: jest.fn(async (snapshot: ProgressBackup) => {
            enviados.push(snapshot);
            return { savedAt: snapshot.savedAt };
        }),
    };
}

function nuvemIndisponivel(): PrivateCloudPort {
    const falha = async () => { throw new CloudUnavailableError(); };
    return { pull: falha, push: falha };
}

describe('ProgressSyncService — interruptor e backup', () => {
    it('começa desligado, sem data e sem erro', async () => {
        const service = new ProgressSyncService({ cloud: nuvem(null), local: localPort(backup()), storage: memoria() });

        expect(await service.getState()).toEqual({ enabled: false, decided: false, lastBackupAt: null, lastError: null });
    });

    it('ligar com progresso local sobe o local e registra a data', async () => {
        const cloud = nuvem(null);
        const local = localPort(backup());
        const service = new ProgressSyncService({ cloud, local, storage: memoria() });

        const estado = await service.setEnabled(true, AGORA);

        expect(cloud.enviados).toHaveLength(1);
        expect(cloud.enviados[0].completedNodesByTrack).toEqual({ 'track-1': ['n1', 'n2'] });
        expect(local.aplicado).toHaveLength(0);
        expect(estado).toEqual({ enabled: true, decided: true, lastBackupAt: AGORA_ISO, lastError: null });
    });

    it('ligar com nuvem já preenchida mescla nos dois sentidos', async () => {
        const cloud = nuvem(backup({ completedNodesByTrack: { 'track-1': ['n3'] }, totalXp: 300 }));
        const local = localPort(backup());
        const service = new ProgressSyncService({ cloud, local, storage: memoria() });

        await service.setEnabled(true, AGORA);

        expect(local.aplicado[0].completedNodesByTrack).toEqual({ 'track-1': ['n1', 'n2', 'n3'] });
        expect(local.aplicado[0].totalXp).toBe(300);
        expect(cloud.enviados[0].completedNodesByTrack).toEqual({ 'track-1': ['n1', 'n2', 'n3'] });
    });

    it('desligado POR DECISÃO do dono, não toca a nuvem nem o local', async () => {
        const cloud = nuvem(backup());
        const local = localPort(backup());
        const service = new ProgressSyncService({ cloud, local, storage: memoriaDesligada() });

        await service.backupNow(AGORA);
        await service.restoreOnLaunch(AGORA);

        expect(cloud.pull).not.toHaveBeenCalled();
        expect(cloud.push).not.toHaveBeenCalled();
        expect(local.apply).not.toHaveBeenCalled();
    });

    it('nuvem indisponível informa o erro sem bloquear nem apagar o local', async () => {
        const local = localPort(backup());
        const service = new ProgressSyncService({ cloud: nuvemIndisponivel(), local, storage: memoria() });

        const estado = await service.setEnabled(true, AGORA);

        expect(estado).toEqual({ enabled: true, decided: true, lastBackupAt: null, lastError: 'cloud-unavailable' });
        expect(local.apply).not.toHaveBeenCalled();
    });

    it('o adaptador padrão responde cloud-unavailable e nunca finge integração', async () => {
        const local = localPort(backup());
        const service = new ProgressSyncService({ local, storage: memoria() });

        expect(await service.setEnabled(true, AGORA)).toEqual({ enabled: true, decided: true, lastBackupAt: null, lastError: 'cloud-unavailable' });
    });

    it('um backup bem-sucedido limpa o erro anterior', async () => {
        const storage = memoria();
        const local = localPort(backup());
        await new ProgressSyncService({ cloud: nuvemIndisponivel(), local, storage }).setEnabled(true, AGORA);

        const estado = await new ProgressSyncService({ cloud: nuvem(null), local, storage }).backupNow(AGORA + 60_000);

        expect(estado).toEqual({ enabled: true, decided: true, lastBackupAt: new Date(AGORA + 60_000).toISOString(), lastError: null });
    });

    it('na abertura, nuvem vazia não substitui o local e nuvem cheia é mesclada', async () => {
        const storage = memoria();
        const localVazio = localPort(vazio());
        const service = new ProgressSyncService({ cloud: nuvem(null), local: localVazio, storage });
        await service.setEnabled(true, AGORA);
        await service.restoreOnLaunch(AGORA);
        expect(localVazio.apply).not.toHaveBeenCalled();

        const localComProgresso = localPort(backup({ completedNodesByTrack: { 'track-1': ['n1'] } }));
        const restaurando = new ProgressSyncService({
            cloud: nuvem(backup({ completedNodesByTrack: { 'track-1': ['n5'] } })),
            local: localComProgresso,
            storage,
        });
        await restaurando.restoreOnLaunch(AGORA);

        expect(localComProgresso.aplicado[0].completedNodesByTrack).toEqual({ 'track-1': ['n1', 'n5'] });
    });

    it('desligar mantém a última data e não apaga nada na nuvem', async () => {
        const cloud = nuvem(null);
        const service = new ProgressSyncService({ cloud, local: localPort(backup()), storage: memoria() });
        await service.setEnabled(true, AGORA);

        const estado = await service.setEnabled(false, AGORA + 1);

        expect(estado).toEqual({ enabled: false, decided: true, lastBackupAt: AGORA_ISO, lastError: null });
        expect(cloud.push).toHaveBeenCalledTimes(1);
    });
});

/**
 * Storage com decisão EXPLÍCITA de desligado.
 *
 * Antes, este cenário era escrito com `memoria()` vazia — que é o estado de uma
 * instalação limpa, não o de quem desligou. Os dois eram indistinguíveis, e foi
 * exatamente isso que fez a reinstalação parar de restaurar.
 */
function memoriaDesligada() {
    const storage = memoria();
    storage.setItem(
        STORAGE_KEYS.PROGRESS_BACKUP,
        JSON.stringify({ schemaVersion: 1, enabled: false, decided: true, lastBackupAt: null, lastError: null }),
    );
    return storage;
}

/** Estado já ligado, sem pagar um backup só para chegar nele. */
function memoriaLigada() {
    const storage = memoria();
    storage.setItem(
        STORAGE_KEYS.PROGRESS_BACKUP,
        JSON.stringify({ schemaVersion: 1, enabled: true, decided: true, lastBackupAt: null, lastError: null }),
    );
    return storage;
}

// Achado 1 da revisão independente do PR #14. `pull()` devolvia `null` tanto
// para "não existe registro" quanto para "existe um registro que este binário
// não entende", e `backupNow` lê `null` como permissão para gravar por cima —
// destruindo, dentro do mecanismo antiperda, um backup feito por uma versão
// futura do app. A prova tem de ser no SERVIÇO: é ele que decide gravar.
describe('ProgressSyncService — remoto incompatível nunca é sobrescrito', () => {
    const razoes: IncompatibleReason[] = ['payload-version', 'corrupt', 'schema-version', 'record-structure'];

    it('registro inexistente permite o primeiro push', async () => {
        const cloud = nuvemLendo({ kind: 'absent' });
        const local = localPort(backup());

        const estado = await new ProgressSyncService({ cloud, local, storage: memoriaLigada() }).backupNow(AGORA);

        expect(cloud.enviados).toHaveLength(1);
        expect(estado.lastError).toBeNull();
        expect(estado.lastBackupAt).toBe(AGORA_ISO);
    });

    it.each(razoes)('não envia nem aplica quando o remoto é incompatível por "%s"', async (reason) => {
        const cloud = nuvemLendo({ kind: 'incompatible', reason });
        const local = localPort(backup());

        const estado = await new ProgressSyncService({ cloud, local, storage: memoriaLigada() }).backupNow(AGORA);

        expect(cloud.push).not.toHaveBeenCalled();
        expect(cloud.enviados).toHaveLength(0);
        expect(local.apply).not.toHaveBeenCalled();
        expect(estado).toEqual({ enabled: true, decided: true, lastBackupAt: null, lastError: 'incompatible' });
    });

    it.each(razoes)('na abertura, remoto incompatível por "%s" não toca o progresso local', async (reason) => {
        const cloud = nuvemLendo({ kind: 'incompatible', reason });
        const local = localPort(backup());

        const estado = await new ProgressSyncService({ cloud, local, storage: memoriaLigada() }).restoreOnLaunch(AGORA);

        expect(local.apply).not.toHaveBeenCalled();
        expect(cloud.push).not.toHaveBeenCalled();
        expect(estado.lastError).toBe('incompatible');
    });
});

/** Nuvem que recusa os primeiros `conflitos` envios, e devolve leituras em sequência. */
function nuvemComConflito(leituras: PrivateCloudRead[], conflitos: number) {
    const enviados: ProgressBackup[] = [];
    const ordem: string[] = [];
    let iPull = 0;
    let recusas = 0;
    const port: PrivateCloudPort & { enviados: ProgressBackup[]; ordem: string[] } = {
        enviados,
        ordem,
        pull: jest.fn(async () => {
            ordem.push('pull');
            return leituras[Math.min(iPull++, leituras.length - 1)];
        }),
        push: jest.fn(async (snapshot: ProgressBackup) => {
            ordem.push('push');
            if (recusas < conflitos) {
                recusas += 1;
                throw new CloudConflictError();
            }
            enviados.push(snapshot);
            return { savedAt: snapshot.savedAt };
        }),
    };
    return port;
}

// Achado 2 da revisão. O Swift pegava `error.serverRecord`, escrevia o payload
// local por cima e salvava — last-write-wins cego sobre um JSON opaco, que
// apaga progresso mais novo de outro aparelho. A mescla é do TypeScript, então
// o conflito tem de voltar até aqui e refazer o ciclo.
describe('ProgressSyncService — conflito refaz o ciclo, não sobrescreve', () => {
    it('refaz pull e mescla o remoto que chegou antes de reenviar', async () => {
        const remotoNovo = backup({ completedNodesByTrack: { 'track-1': ['n9'] }, totalXp: 999 });
        const cloud = nuvemComConflito(
            [{ kind: 'absent' }, { kind: 'usable', backup: remotoNovo }],
            1,
        );
        const local = localPort(backup({ completedNodesByTrack: { 'track-1': ['n1', 'n2'] }, totalXp: 120 }));

        const estado = await new ProgressSyncService({ cloud, local, storage: memoriaLigada() }).backupNow(AGORA);

        expect(cloud.pull).toHaveBeenCalledTimes(2);
        expect(cloud.ordem).toEqual(['pull', 'push', 'pull', 'push']);
        expect(cloud.enviados).toHaveLength(1);
        // A união: o que era só local e o que era só do outro aparelho.
        expect(cloud.enviados[0].completedNodesByTrack['track-1'].sort()).toEqual(['n1', 'n2', 'n9']);
        expect(cloud.enviados[0].totalXp).toBe(999);
        expect(estado.lastError).toBeNull();
    });

    it('progresso remoto mais novo não é substituído por um snapshot mais antigo', async () => {
        const remotoNovo = backup({ completedNodesByTrack: { 'track-1': ['n9'] }, streakDays: 30 });
        const cloud = nuvemComConflito([{ kind: 'absent' }, { kind: 'usable', backup: remotoNovo }], 1);
        const local = localPort(backup({ completedNodesByTrack: { 'track-1': ['n1'] }, streakDays: 2 }));

        await new ProgressSyncService({ cloud, local, storage: memoriaLigada() }).backupNow(AGORA);

        expect(cloud.enviados[0].completedNodesByTrack['track-1']).toContain('n9');
        expect(cloud.enviados[0].streakDays).toBe(30);
    });

    it('conflito repetido para no limite, preserva o local e registra falha', async () => {
        const cloud = nuvemComConflito([{ kind: 'absent' }], 99);
        const local = localPort(backup());

        const estado = await new ProgressSyncService({ cloud, local, storage: memoriaLigada() }).backupNow(AGORA);

        expect(cloud.enviados).toHaveLength(0);
        expect(estado.lastError).toBe('failed');
        expect(estado.lastBackupAt).toBeNull();
        // Limite pequeno e explícito: não é laço infinito.
        expect((cloud.push as jest.Mock).mock.calls.length).toBeLessThanOrEqual(3);
        expect((cloud.push as jest.Mock).mock.calls.length).toBeGreaterThan(1);
    });

    it('duas chamadas concorrentes de backupNow não interleiam pull e push', async () => {
        // Sem serialização, a ordem viraria pull,pull,push,push e o segundo
        // envio sobrescreveria o primeiro sem tê-lo lido.
        const cloud = nuvemComConflito([{ kind: 'absent' }], 0);
        const local = localPort(backup());
        const service = new ProgressSyncService({ cloud, local, storage: memoriaLigada() });

        await Promise.all([service.backupNow(AGORA), service.backupNow(AGORA + 1000)]);

        expect(cloud.ordem).toEqual(['pull', 'push', 'pull', 'push']);
    });
});

// Achado da SEGUNDA revisão do PR #14, provado onde a decisão de gravar é
// tomada. Aqui o adaptador é o REAL, não um dublê: o que se prova é a cadeia
// inteira — módulo nativo devolve um registro existente porém ilegível, o
// adaptador classifica, e o serviço não grava.
describe('ProgressSyncService + CloudKitPrivateAdapter — registro ilegível não é sobrescrito', () => {
    function nativeFake(fetch: () => Promise<unknown>) {
        return {
            accountStatus: jest.fn(async () => 'available' as const),
            fetchBackup: jest.fn(fetch as () => Promise<never>),
            saveBackup: jest.fn(async (r: { savedAt: string }) => ({ savedAt: r.savedAt })),
        };
    }

    const registrosIlegiveis: [string, unknown][] = [
        ['sem payload', { payloadVersion: 1, savedAt: AGORA_ISO }],
        ['sem savedAt', { payloadVersion: 1, payload: '{}' }],
        ['sem payloadVersion', { payload: '{}', savedAt: AGORA_ISO }],
        ['com tipos inválidos', { payloadVersion: 'um', payload: 123, savedAt: true }],
        ['vazio', {}],
    ];

    it.each(registrosIlegiveis)('registro existente %s: não grava e preserva o local', async (_rotulo, registro) => {
        const native = nativeFake(async () => registro);
        const local = localPort(backup());
        const service = new ProgressSyncService({
            cloud: new CloudKitPrivateAdapter(native as never),
            local,
            storage: memoriaLigada(),
        });

        const estado = await service.backupNow(AGORA);

        expect(native.saveBackup).not.toHaveBeenCalled();
        expect(local.apply).not.toHaveBeenCalled();
        expect(estado.lastError).toBe('incompatible');
        expect(estado.lastBackupAt).toBeNull();
    });

    it('ausência real — unknownItem — continua permitindo o primeiro backup', async () => {
        // O contraponto: sem este caso, "nunca grava" passaria trivialmente.
        const native = nativeFake(async () => null);
        const local = localPort(backup());
        const service = new ProgressSyncService({
            cloud: new CloudKitPrivateAdapter(native as never),
            local,
            storage: memoriaLigada(),
        });

        const estado = await service.backupNow(AGORA);

        expect(native.saveBackup).toHaveBeenCalledTimes(1);
        expect(estado.lastError).toBeNull();
    });

    it.each(registrosIlegiveis)('na abertura, registro existente %s não aplica nada sobre o local', async (_rotulo, registro) => {
        const native = nativeFake(async () => registro);
        const local = localPort(backup());
        const service = new ProgressSyncService({
            cloud: new CloudKitPrivateAdapter(native as never),
            local,
            storage: memoriaLigada(),
        });

        const estado = await service.restoreOnLaunch(AGORA);

        expect(local.apply).not.toHaveBeenCalled();
        expect(native.saveBackup).not.toHaveBeenCalled();
        expect(estado.lastError).toBe('incompatible');
    });
});

// Defeito medido em iPhone físico em 2026-09-15: depois de apagar e reinstalar
// o app, com backup remoto íntegro, NADA foi restaurado — o cartão voltou
// desligado, XP zerou e a trilha voltou a 0/14. Só ligar o interruptor à mão
// trouxe tudo de volta.
//
// Causa: sem a chave local, `parseState(null)` devolve `{enabled:false}`, que é
// idêntico a "o dono desligou". O restore devolvia antes de consultar a nuvem.
// A decisão de opt-in passa a morar no registro remoto, único lugar que
// sobrevive ao uninstall.
describe('ProgressSyncService — instalação limpa', () => {
    /** Storage totalmente vazio: é literalmente o que sobra depois do uninstall. */
    const instalacaoLimpa = () => memoria();

    it('restaura o progresso e retoma a proteção quando o remoto está ligado', async () => {
        const remoto = backup({ completedNodesByTrack: { 't1': ['n1', 'n2'] }, totalXp: 100, streakDays: 1 });
        const cloud = nuvemLendo({ kind: 'usable', backup: remoto });
        const local = localPort(vazio());

        const estado = await new ProgressSyncService({ cloud, local, storage: instalacaoLimpa() })
            .restoreOnLaunch(AGORA);

        expect(cloud.pull).toHaveBeenCalled();
        expect(local.aplicado[0].completedNodesByTrack).toEqual({ 't1': ['n1', 'n2'] });
        expect(local.aplicado[0].totalXp).toBe(100);
        expect(estado.enabled).toBe(true);
        expect(estado.decided).toBe(true);
    });

    it('trata registro antigo sem o campo como ligado, por compatibilidade', async () => {
        const { backupEnabled, ...semCampo } = backup({ totalXp: 42 }) as never as Record<string, unknown>;
        const cloud = nuvemLendo({ kind: 'usable', backup: semCampo as never });
        const local = localPort(vazio());

        const estado = await new ProgressSyncService({ cloud, local, storage: instalacaoLimpa() })
            .restoreOnLaunch(AGORA);

        expect(local.aplicado).toHaveLength(1);
        expect(estado.enabled).toBe(true);
    });

    it('respeita quem desligou de propósito: não aplica nada e não religa', async () => {
        const cloud = nuvemLendo({ kind: 'usable', backup: backup({ backupEnabled: false, totalXp: 100 }) });
        const local = localPort(vazio());

        const estado = await new ProgressSyncService({ cloud, local, storage: instalacaoLimpa() })
            .restoreOnLaunch(AGORA);

        expect(local.apply).not.toHaveBeenCalled();
        expect(cloud.push).not.toHaveBeenCalled();
        expect(estado.enabled).toBe(false);
        expect(estado.decided).toBe(true);
    });

    it('sem registro remoto não inventa nada, e para de consultar nas próximas aberturas', async () => {
        const cloud = nuvemLendo({ kind: 'absent' });
        const local = localPort(vazio());
        const storage = instalacaoLimpa();

        const estado = await new ProgressSyncService({ cloud, local, storage }).restoreOnLaunch(AGORA);

        expect(local.apply).not.toHaveBeenCalled();
        expect(cloud.push).not.toHaveBeenCalled();
        expect(estado.enabled).toBe(false);
        expect(estado.decided).toBe(true);
    });

    it('remoto incompatível não é aplicado nem sobrescrito, e segue indeciso', async () => {
        const cloud = nuvemLendo({ kind: 'incompatible', reason: 'payload-version' });
        const local = localPort(vazio());

        const estado = await new ProgressSyncService({ cloud, local, storage: instalacaoLimpa() })
            .restoreOnLaunch(AGORA);

        expect(local.apply).not.toHaveBeenCalled();
        expect(cloud.push).not.toHaveBeenCalled();
        expect(estado.lastError).toBe('incompatible');
        // Indeciso de propósito: um binário mais novo pode entender o registro.
        expect(estado.decided).toBe(false);
    });

    it('CloudKit indisponível mantém o modo local e tenta de novo na próxima abertura', async () => {
        const local = localPort(vazio());

        const estado = await new ProgressSyncService({ cloud: nuvemIndisponivel(), local, storage: instalacaoLimpa() })
            .restoreOnLaunch(AGORA);

        expect(local.apply).not.toHaveBeenCalled();
        expect(estado.lastError).toBe('cloud-unavailable');
        expect(estado.decided).toBe(false);
    });

    it('NUNCA sobe snapshot vazio por cima de backup remoto válido', async () => {
        // A invariante que mais importa: instalação limpa + backup lá em cima.
        const remoto = backup({ completedNodesByTrack: { 't1': ['n1', 'n2'] }, totalXp: 100 });
        const cloud = nuvemLendo({ kind: 'usable', backup: remoto });
        const local = localPort(vazio());
        const service = new ProgressSyncService({ cloud, local, storage: instalacaoLimpa() });

        await service.restoreOnLaunch(AGORA);
        await service.backupNow(AGORA + 1000);

        for (const enviado of cloud.enviados) {
            expect(enviado.completedNodesByTrack['t1']).toEqual(expect.arrayContaining(['n1', 'n2']));
            expect(enviado.totalXp).toBeGreaterThanOrEqual(100);
        }
    });
});

describe('ProgressSyncService — desligar marca a decisão no registro remoto', () => {
    it('desligar grava backupEnabled false sem apagar o payload', async () => {
        const remoto = backup({ completedNodesByTrack: { 't1': ['n1'] }, totalXp: 100 });
        const cloud = nuvemLendo({ kind: 'usable', backup: remoto });
        const local = localPort(backup());
        const storage = memoriaLigada();

        await new ProgressSyncService({ cloud, local, storage }).setEnabled(false, AGORA);

        expect(cloud.enviados).toHaveLength(1);
        expect(cloud.enviados[0].backupEnabled).toBe(false);
        // O progresso continua lá: desligar para de sincronizar, não apaga.
        expect(cloud.enviados[0].completedNodesByTrack['t1']).toContain('n1');
        expect(cloud.enviados[0].totalXp).toBe(100);
    });

    it('desligar sem registro remoto não cria registro nenhum', async () => {
        const cloud = nuvemLendo({ kind: 'absent' });
        const local = localPort(backup());

        await new ProgressSyncService({ cloud, local, storage: memoriaLigada() }).setEnabled(false, AGORA);

        expect(cloud.push).not.toHaveBeenCalled();
    });

    it('desligar com nuvem fora não quebra e mantém o desligamento local', async () => {
        const local = localPort(backup());

        const estado = await new ProgressSyncService({ cloud: nuvemIndisponivel(), local, storage: memoriaLigada() })
            .setEnabled(false, AGORA);

        expect(estado.enabled).toBe(false);
    });

    it('ligar continua marcando o registro remoto como ligado', async () => {
        const cloud = nuvemLendo({ kind: 'absent' });
        const local = localPort(backup());

        await new ProgressSyncService({ cloud, local, storage: memoria() }).setEnabled(true, AGORA);

        expect(cloud.enviados[0].backupEnabled).toBe(true);
    });
});
