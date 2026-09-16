import { ProgressSyncService } from './ProgressSyncService';
import { restaurarBackupNaAbertura, type EventoDeAbertura } from './startupRestore';
import type {
    BackupState,
    LocalProgressPort,
    PrivateCloudPort,
    PrivateCloudRead,
    ProgressBackup,
} from './progressSync.types';
import { CloudUnavailableError } from './progressSync.types';

jest.mock('@react-native-async-storage/async-storage', () =>
    require('@react-native-async-storage/async-storage/jest/async-storage-mock'));

const AGORA = Date.parse('2026-09-15T21:00:00.000Z');

function backupRemoto(overrides: Partial<ProgressBackup> = {}): ProgressBackup {
    return {
        schemaVersion: 1,
        savedAt: '2026-09-15T18:11:00.000Z',
        completedNodesByTrack: { 'track-1': ['n1', 'n2', 'n3'] },
        reviewSchedule: {},
        totalXp: 100,
        streakDays: 1,
        lastRefillAt: null,
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

/** Storage em memória que começa VAZIO: é o que sobra depois de um uninstall. */
function storageDeInstalacaoLimpa() {
    const dados = new Map<string, string>();
    return {
        dados,
        getItem: jest.fn(async (k: string) => dados.get(k) ?? null),
        setItem: jest.fn(async (k: string, v: string) => { dados.set(k, v); }),
        removeItem: jest.fn(async (k: string) => { dados.delete(k); }),
    };
}

function localRealista(inicial: ProgressBackup): LocalProgressPort & { aplicado: ProgressBackup[] } {
    const aplicado: ProgressBackup[] = [];
    return {
        aplicado,
        snapshot: jest.fn(async (nowIso: string) => ({ ...inicial, savedAt: nowIso })),
        apply: jest.fn(async (merged: ProgressBackup) => { aplicado.push(merged); }),
    };
}

function nuvemFalsa(leitura: PrivateCloudRead) {
    const ordem: string[] = [];
    const enviados: ProgressBackup[] = [];
    const port: PrivateCloudPort & { ordem: string[]; enviados: ProgressBackup[] } = {
        ordem,
        enviados,
        pull: jest.fn(async () => { ordem.push('pull'); return leitura; }),
        push: jest.fn(async (s: ProgressBackup) => { ordem.push('push'); enviados.push(s); return { savedAt: s.savedAt }; }),
    };
    return port;
}

// Integração de verdade: ProgressSyncService REAL, storage realmente vazio,
// porta de nuvem falsa que registra a ordem. Nada de mockar `restoreOnLaunch` —
// era justamente o mock que fazia o teste anterior provar nada.
describe('abertura de instalação limpa — integração com o serviço real', () => {
    function montar(leitura: PrivateCloudRead, local = localRealista(vazio())) {
        const storage = storageDeInstalacaoLimpa();
        const cloud = nuvemFalsa(leitura);
        const service = new ProgressSyncService({ cloud, local, storage });
        const eventos: EventoDeAbertura[] = [];
        return { storage, cloud, local, service, eventos };
    }

    it('chega ao cloud.pull, aplica o remoto e termina ligado e decidido', async () => {
        const remoto = backupRemoto();
        const { storage, cloud, local, service, eventos } = montar({ kind: 'usable', backup: remoto });

        await restaurarBackupNaAbertura({
            lerEstado: () => service.getState(),
            hidratarJornada: async () => undefined,
            restaurar: (n) => service.restoreOnLaunch(n),
            agora: () => AGORA,
            registrar: (e) => eventos.push(e),
        });

        expect(cloud.pull).toHaveBeenCalledTimes(1);
        expect(local.aplicado[0].completedNodesByTrack['track-1']).toEqual(['n1', 'n2', 'n3']);
        expect(local.aplicado[0].totalXp).toBe(100);

        const estado = await service.getState();
        expect(estado).toEqual<BackupState>({
            enabled: true, decided: true, lastBackupAt: null, lastError: null,
        });
        expect(storage.dados.size).toBeGreaterThan(0);
        expect(eventos.find((e) => e.etapa === 'restore')).toMatchObject({ ok: true, ligado: true, decidido: true });
    });

    it('NUNCA envia snapshot local vazio antes de ler o remoto', async () => {
        const { cloud, service } = montar({ kind: 'usable', backup: backupRemoto() });

        await restaurarBackupNaAbertura({
            lerEstado: () => service.getState(),
            hidratarJornada: async () => undefined,
            restaurar: (n) => service.restoreOnLaunch(n),
            agora: () => AGORA,
        });

        expect(cloud.enviados).toHaveLength(0);
        expect(cloud.ordem[0]).toBe('pull');
    });

    // O defeito reprovado em aparelho: a cadeia antiga punha hidratação e
    // restore sob UM catch, então qualquer rejeição na hidratação pulava o
    // restore inteiro — em silêncio, com o app abrindo normal.
    it('restaura mesmo quando a hidratação da jornada falha', async () => {
        const { cloud, local, service, eventos } = montar({ kind: 'usable', backup: backupRemoto() });

        await restaurarBackupNaAbertura({
            lerEstado: () => service.getState(),
            hidratarJornada: async () => { throw new Error('catálogo indisponível na abertura'); },
            restaurar: (n) => service.restoreOnLaunch(n),
            agora: () => AGORA,
            registrar: (e) => eventos.push(e),
        });

        expect(cloud.pull).toHaveBeenCalledTimes(1);
        expect(local.apply).toHaveBeenCalled();
        expect((await service.getState()).enabled).toBe(true);
        expect(eventos).toContainEqual({ etapa: 'hidratacao', ok: false });
    });

    it('respeita opt-out gravado no remoto: não aplica e não religa', async () => {
        const { cloud, local, service } = montar({ kind: 'usable', backup: backupRemoto({ backupEnabled: false }) });

        await restaurarBackupNaAbertura({
            lerEstado: () => service.getState(),
            hidratarJornada: async () => undefined,
            restaurar: (n) => service.restoreOnLaunch(n),
            agora: () => AGORA,
        });

        expect(local.apply).not.toHaveBeenCalled();
        expect(cloud.push).not.toHaveBeenCalled();
        expect(await service.getState()).toMatchObject({ enabled: false, decided: true });
    });

    it('remoto ausente não inventa progresso', async () => {
        const { cloud, local, service } = montar({ kind: 'absent' });

        await restaurarBackupNaAbertura({
            lerEstado: () => service.getState(),
            hidratarJornada: async () => undefined,
            restaurar: (n) => service.restoreOnLaunch(n),
            agora: () => AGORA,
        });

        expect(local.apply).not.toHaveBeenCalled();
        expect(cloud.push).not.toHaveBeenCalled();
        expect(await service.getState()).toMatchObject({ enabled: false, decided: true });
    });

    it('erro transitório mantém indeciso, para tentar na próxima abertura', async () => {
        const local = localRealista(vazio());
        const storage = storageDeInstalacaoLimpa();
        const cloud: PrivateCloudPort = {
            pull: jest.fn(async () => { throw new CloudUnavailableError(); }),
            push: jest.fn(),
        };
        const service = new ProgressSyncService({ cloud, local, storage });

        await restaurarBackupNaAbertura({
            lerEstado: () => service.getState(),
            hidratarJornada: async () => undefined,
            restaurar: (n) => service.restoreOnLaunch(n),
            agora: () => AGORA,
        });

        expect(local.apply).not.toHaveBeenCalled();
        expect(await service.getState()).toMatchObject({ decided: false, lastError: 'cloud-unavailable' });
    });

    it('registro incompatível não é aplicado nem sobrescrito', async () => {
        const { cloud, local, service } = montar({ kind: 'incompatible', reason: 'payload-version' });

        await restaurarBackupNaAbertura({
            lerEstado: () => service.getState(),
            hidratarJornada: async () => undefined,
            restaurar: (n) => service.restoreOnLaunch(n),
            agora: () => AGORA,
        });

        expect(local.apply).not.toHaveBeenCalled();
        expect(cloud.push).not.toHaveBeenCalled();
        expect(await service.getState()).toMatchObject({ decided: false, lastError: 'incompatible' });
    });

    // Documenta o MECANISMO do defeito, não a sua ocorrência em aparelho.
    // A cadeia que estava no RootLayout era, em forma:
    //   catalogo.then(hidratar).then(restaurar).catch(logar)
    // Um único `catch` para três etapas: qualquer rejeição antes do último
    // `.then` pula o restore inteiro, sem erro visível e com o app abrindo
    // normalmente — indistinguível de "não havia backup".
    //
    // Este caso NÃO prova que a hidratação falhava no iPhone; prova que, se
    // falhasse, o restore seria silenciosamente pulado. A instrumentação é que
    // vai responder o que de fato ocorreu lá.
    it('PROVA DO MECANISMO: a cadeia antiga pulava o restore quando uma etapa anterior rejeitava', async () => {
        const restaurar = jest.fn();

        await Promise.resolve()
            .then(() => { throw new Error('etapa anterior rejeitou'); })
            .then(() => restaurar())
            .catch(() => undefined);

        expect(restaurar).not.toHaveBeenCalled();

        // A forma nova, com falhas isoladas, chama assim mesmo.
        const restaurarNovo = jest.fn(async () => ({
            enabled: true, decided: true, lastBackupAt: null, lastError: null,
        }) as BackupState);
        await restaurarBackupNaAbertura({
            lerEstado: async () => ({ enabled: false, decided: false, lastBackupAt: null, lastError: null }),
            hidratarJornada: async () => { throw new Error('etapa anterior rejeitou'); },
            restaurar: restaurarNovo,
            agora: () => AGORA,
        });
        expect(restaurarNovo).toHaveBeenCalledTimes(1);
    });

    it('a instrumentação não carrega payload nem dado do aluno', async () => {
        const { service, eventos } = montar({ kind: 'usable', backup: backupRemoto() });

        await restaurarBackupNaAbertura({
            lerEstado: () => service.getState(),
            hidratarJornada: async () => undefined,
            restaurar: (n) => service.restoreOnLaunch(n),
            agora: () => AGORA,
            registrar: (e) => eventos.push(e),
        });

        const texto = JSON.stringify(eventos);
        for (const proibido of ['n1', 'n2', 'n3', 'track-1', '100', 'iCloud', 'payload']) {
            expect(texto).not.toContain(proibido);
        }
        expect(eventos.length).toBeGreaterThan(0);
    });
});
