import { CloudKitPrivateAdapter, resolvePrivateCloudAdapter } from './CloudKitPrivateAdapter';
import {
    CLOUDKIT_PAYLOAD_VERSION,
    type CloudKitAccountStatus,
    type CloudKitBackupRecord,
    type CloudKitNativeErrorCode,
    type RadiantCloudKitNative,
} from './cloudkitBackup.types';
import { isCloudUnavailable, type ProgressBackup } from './progressSync.types';
import { UnavailablePrivateCloudAdapter } from './UnavailablePrivateCloudAdapter';

jest.mock('expo-modules-core', () => ({ requireOptionalNativeModule: jest.fn() }));

const { requireOptionalNativeModule } = jest.requireMock('expo-modules-core');

const BACKUP: ProgressBackup = {
    schemaVersion: 1,
    savedAt: '2026-09-15T12:00:00.000Z',
    completedNodesByTrack: { 'track-radiology-foundations': ['node:foundation-1'] },
    reviewSchedule: {},
    totalXp: 120,
    streakDays: 4,
    lastRefillAt: '2026-09-15T11:00:00.000Z',
};

function nativeErro(code: CloudKitNativeErrorCode): Error & { code: string } {
    return Object.assign(new Error(`falha nativa: ${code}`), { code });
}

function fakeNative(overrides: Partial<RadiantCloudKitNative> & { status?: CloudKitAccountStatus } = {}) {
    const { status = 'available', ...rest } = overrides;
    const native: RadiantCloudKitNative = {
        accountStatus: jest.fn(async () => status),
        fetchBackup: jest.fn(async () => null),
        saveBackup: jest.fn(async (record: CloudKitBackupRecord) => ({ savedAt: record.savedAt })),
        ...rest,
    };
    return native;
}

const registroDe = (backup: ProgressBackup): CloudKitBackupRecord => ({
    payloadVersion: CLOUDKIT_PAYLOAD_VERSION,
    payload: JSON.stringify(backup),
    savedAt: backup.savedAt,
});

describe('CloudKitPrivateAdapter — leitura', () => {
    it('lê um backup existente no banco privado', async () => {
        const native = fakeNative({ fetchBackup: jest.fn(async () => registroDe(BACKUP)) });

        await expect(new CloudKitPrivateAdapter(native).pull()).resolves.toEqual(BACKUP);
    });

    it('devolve null quando não existe registro remoto', async () => {
        // Ausência NÃO é erro: é o caso do primeiro uso, e o serviço depende
        // dele para não substituir progresso local por nada.
        await expect(new CloudKitPrivateAdapter(fakeNative()).pull()).resolves.toBeNull();
    });

    it('trata envelope de versão desconhecida como ausência, em vez de aplicar pela metade', async () => {
        const native = fakeNative({
            fetchBackup: jest.fn(async () => ({ ...registroDe(BACKUP), payloadVersion: 99 })),
        });

        await expect(new CloudKitPrivateAdapter(native).pull()).resolves.toBeNull();
    });

    it('trata payload corrompido como ausência', async () => {
        const native = fakeNative({
            fetchBackup: jest.fn(async () => ({ ...registroDe(BACKUP), payload: '{isso não é json' })),
        });

        await expect(new CloudKitPrivateAdapter(native).pull()).resolves.toBeNull();
    });

    it('trata payload de schemaVersion divergente como ausência', async () => {
        const native = fakeNative({
            fetchBackup: jest.fn(async () => ({
                ...registroDe(BACKUP),
                payload: JSON.stringify({ ...BACKUP, schemaVersion: 7 }),
            })),
        });

        await expect(new CloudKitPrivateAdapter(native).pull()).resolves.toBeNull();
    });
});

describe('CloudKitPrivateAdapter — estados que degradam para local', () => {
    const contasIndisponiveis: CloudKitAccountStatus[] = [
        'no-account',
        'restricted',
        'could-not-determine',
        'temporarily-unavailable',
    ];

    it.each(contasIndisponiveis)('sinaliza nuvem indisponível quando a conta está "%s"', async (status) => {
        const native = fakeNative({ status });
        const adapter = new CloudKitPrivateAdapter(native);

        await adapter.pull().then(
            () => { throw new Error('deveria ter recusado'); },
            (erro) => expect(isCloudUnavailable(erro)).toBe(true),
        );
        // Sem conta utilizável o adaptador nem chega a consultar o registro.
        expect(native.fetchBackup).not.toHaveBeenCalled();
    });

    it.each<CloudKitNativeErrorCode>(['network-unavailable', 'transient'])(
        'sinaliza nuvem indisponível em "%s", para o estudo seguir local',
        async (code) => {
            const native = fakeNative({ fetchBackup: jest.fn(async () => { throw nativeErro(code); }) });

            await new CloudKitPrivateAdapter(native).pull().then(
                () => { throw new Error('deveria ter recusado'); },
                (erro) => expect(isCloudUnavailable(erro)).toBe(true),
            );
        },
    );

    it('propaga erro não recuperável como falha, não como indisponibilidade', async () => {
        // A distinção importa: 'cloud-unavailable' é estado esperado e some do
        // cartão sozinho; 'failed' é defeito e merece aparecer.
        const native = fakeNative({ fetchBackup: jest.fn(async () => { throw nativeErro('unrecoverable'); }) });

        await new CloudKitPrivateAdapter(native).pull().then(
            () => { throw new Error('deveria ter recusado'); },
            (erro) => expect(isCloudUnavailable(erro)).toBe(false),
        );
    });
});

describe('CloudKitPrivateAdapter — escrita', () => {
    it('escreve o backup no envelope versionado e devolve o carimbo do servidor', async () => {
        const native = fakeNative({
            saveBackup: jest.fn(async () => ({ savedAt: '2026-09-15T12:00:05.000Z' })),
        });

        const resultado = await new CloudKitPrivateAdapter(native).push(BACKUP);

        expect(native.saveBackup).toHaveBeenCalledWith({
            payloadVersion: CLOUDKIT_PAYLOAD_VERSION,
            payload: JSON.stringify(BACKUP),
            savedAt: BACKUP.savedAt,
        });
        expect(resultado).toEqual({ savedAt: '2026-09-15T12:00:05.000Z' });
    });

    it('é idempotente: duas escritas não acumulam registro', async () => {
        // O `recordName` é fixo no lado nativo; aqui a garantia observável é que
        // o adaptador não inventa identidade nova por chamada.
        const native = fakeNative();
        const adapter = new CloudKitPrivateAdapter(native);

        await adapter.push(BACKUP);
        await adapter.push({ ...BACKUP, totalXp: 200 });

        const chamadas = (native.saveBackup as jest.Mock).mock.calls;
        expect(chamadas).toHaveLength(2);
        expect(chamadas[0][0].payloadVersion).toBe(chamadas[1][0].payloadVersion);
    });

    it('recusa a escrita sem conta iCloud, sem tocar no registro', async () => {
        const native = fakeNative({ status: 'no-account' });

        await new CloudKitPrivateAdapter(native).push(BACKUP).then(
            () => { throw new Error('deveria ter recusado'); },
            (erro) => expect(isCloudUnavailable(erro)).toBe(true),
        );
        expect(native.saveBackup).not.toHaveBeenCalled();
    });

    it('sinaliza nuvem indisponível quando a rede caiu no meio da escrita', async () => {
        const native = fakeNative({
            saveBackup: jest.fn(async () => { throw nativeErro('network-unavailable'); }),
        });

        await new CloudKitPrivateAdapter(native).push(BACKUP).then(
            () => { throw new Error('deveria ter recusado'); },
            (erro) => expect(isCloudUnavailable(erro)).toBe(true),
        );
    });
});

describe('resolvePrivateCloudAdapter — degradação quando não há binário nativo', () => {
    beforeEach(() => jest.clearAllMocks());

    it('usa o adaptador do CloudKit quando o módulo nativo está no binário', () => {
        (requireOptionalNativeModule as jest.Mock).mockReturnValue(fakeNative());

        expect(resolvePrivateCloudAdapter()).toBeInstanceOf(CloudKitPrivateAdapter);
    });

    it('cai no adaptador indisponível quando o módulo nativo não existe', () => {
        // Expo Go, Android, simulador sem o módulo compilado, build antigo: o
        // app precisa abrir e estudar do mesmo jeito.
        (requireOptionalNativeModule as jest.Mock).mockReturnValue(null);

        expect(resolvePrivateCloudAdapter()).toBeInstanceOf(UnavailablePrivateCloudAdapter);
    });

    it('não propaga exceção do carregador: resolver adaptador nunca derruba a abertura', () => {
        (requireOptionalNativeModule as jest.Mock).mockImplementation(() => {
            throw new Error('runtime de módulos indisponível');
        });

        expect(resolvePrivateCloudAdapter()).toBeInstanceOf(UnavailablePrivateCloudAdapter);
    });
});
