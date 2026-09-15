import { CloudKitPrivateAdapter, resolvePrivateCloudAdapter } from './CloudKitPrivateAdapter';
import {
    CLOUDKIT_PAYLOAD_VERSION,
    type CloudKitAccountStatus,
    type CloudKitBackupRecord,
    type CloudKitNativeErrorCode,
    type RadiantCloudKitNative,
} from './cloudkitBackup.types';
import { isCloudConflict, isCloudUnavailable, type ProgressBackup } from './progressSync.types';
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

        await expect(new CloudKitPrivateAdapter(native).pull())
            .resolves.toEqual({ kind: 'usable', backup: BACKUP });
    });

    it('devolve ausência quando não existe registro remoto', async () => {
        // Ausência NÃO é erro: é o caso do primeiro uso, e é o ÚNICO estado em
        // que o serviço pode gravar por cima sem destruir nada.
        await expect(new CloudKitPrivateAdapter(fakeNative()).pull())
            .resolves.toEqual({ kind: 'absent' });
    });

    it('marca envelope de versão desconhecida como INCOMPATÍVEL, nunca como ausente', async () => {
        // Achado 1 da revisão do PR #14: virar ausência aqui fazia o serviço
        // gravar por cima de um backup de versão futura.
        const native = fakeNative({
            fetchBackup: jest.fn(async () => ({ ...registroDe(BACKUP), payloadVersion: 99 })),
        });

        await expect(new CloudKitPrivateAdapter(native).pull())
            .resolves.toEqual({ kind: 'incompatible', reason: 'payload-version' });
    });

    it('marca payload corrompido como INCOMPATÍVEL, distinguindo de outro schema', async () => {
        const native = fakeNative({
            fetchBackup: jest.fn(async () => ({ ...registroDe(BACKUP), payload: '{isso não é json' })),
        });

        await expect(new CloudKitPrivateAdapter(native).pull())
            .resolves.toEqual({ kind: 'incompatible', reason: 'corrupt' });
    });

    it('marca schemaVersion divergente como INCOMPATÍVEL', async () => {
        const native = fakeNative({
            fetchBackup: jest.fn(async () => ({
                ...registroDe(BACKUP),
                payload: JSON.stringify({ ...BACKUP, schemaVersion: 7 }),
            })),
        });

        await expect(new CloudKitPrivateAdapter(native).pull())
            .resolves.toEqual({ kind: 'incompatible', reason: 'schema-version' });
    });
});

// Achado da SEGUNDA revisão do PR #14. O Swift devolvia `nil` quando o registro
// existia mas não tinha os campos esperados, e `nil` significa "registro
// inexistente" — o serviço então fazia o primeiro push por cima de um registro
// real. Mesma classe do achado 1, um nível abaixo da união discriminada.
//
// `null` passou a ser reservado a `CKError.unknownItem`. O envelope cru volta
// sempre que o registro existe, e é aqui que ele é classificado.
describe('CloudKitPrivateAdapter — registro existente nunca é lido como ausente', () => {
    it('ausência real continua sendo ausência', async () => {
        const native = fakeNative({ fetchBackup: jest.fn(async () => null) });

        await expect(new CloudKitPrivateAdapter(native).pull()).resolves.toEqual({ kind: 'absent' });
    });

    it('registro sem payload não vira ausência', async () => {
        const native = fakeNative({
            fetchBackup: jest.fn(async () => ({ payloadVersion: 1, savedAt: BACKUP.savedAt })),
        });

        await expect(new CloudKitPrivateAdapter(native).pull())
            .resolves.toEqual({ kind: 'incompatible', reason: 'record-structure' });
    });

    it('registro sem savedAt não vira ausência', async () => {
        const native = fakeNative({
            fetchBackup: jest.fn(async () => ({ payloadVersion: 1, payload: JSON.stringify(BACKUP) })),
        });

        await expect(new CloudKitPrivateAdapter(native).pull())
            .resolves.toEqual({ kind: 'incompatible', reason: 'record-structure' });
    });

    it('registro sem payloadVersion não vira ausência', async () => {
        const native = fakeNative({
            fetchBackup: jest.fn(async () => ({ payload: JSON.stringify(BACKUP), savedAt: BACKUP.savedAt })),
        });

        await expect(new CloudKitPrivateAdapter(native).pull())
            .resolves.toEqual({ kind: 'incompatible', reason: 'record-structure' });
    });

    it('campos de tipo inesperado não viram ausência', async () => {
        const native = fakeNative({
            fetchBackup: jest.fn(async () => ({ payloadVersion: 'um', payload: 123, savedAt: true })),
        });

        await expect(new CloudKitPrivateAdapter(native).pull())
            .resolves.toEqual({ kind: 'incompatible', reason: 'record-structure' });
    });

    it('registro completamente vazio não vira ausência', async () => {
        const native = fakeNative({ fetchBackup: jest.fn(async () => ({})) });

        await expect(new CloudKitPrivateAdapter(native).pull())
            .resolves.toEqual({ kind: 'incompatible', reason: 'record-structure' });
    });
});

// P2-2 da revisão do PR #14. A validação aceitava qualquer objeto não nulo em
// `completedNodesByTrack` e `reviewSchedule`, então um payload versão 1
// corrompido passava como `usable`: uma string em `completedNodesByTrack` é
// espalhada em IDs de um caractere durante a mescla, e `{"l1": {}}` em
// `reviewSchedule` vira cartão com datas indefinidas no SpacedRepetitionService.
describe('CloudKitPrivateAdapter — validação estrutural profunda do payload', () => {
    const cartaoValido = {
        lessonId: 'l1',
        easeFactor: 2.5,
        interval: 3,
        repetitions: 1,
        nextReviewAt: '2026-09-18T00:00:00.000Z',
        lastReviewedAt: '2026-09-15T00:00:00.000Z',
        createdAt: '2026-09-01T00:00:00.000Z',
    };

    /** Remove um campo obrigatório sem deixar `undefined` no lugar. */
    function semCampo<T extends object>(base: T, campo: keyof T): Partial<T> {
        const copia = { ...base };
        delete copia[campo];
        return copia;
    }

    const lendo = (payload: unknown) => new CloudKitPrivateAdapter(fakeNative({
        fetchBackup: jest.fn(async () => ({
            payloadVersion: CLOUDKIT_PAYLOAD_VERSION,
            payload: JSON.stringify(payload),
            savedAt: BACKUP.savedAt,
        })),
    })).pull();

    const corrompidos: [string, unknown][] = [
        ['completedNodesByTrack é array', { ...BACKUP, completedNodesByTrack: [] }],
        ['trilha com string no lugar do array', { ...BACKUP, completedNodesByTrack: { t1: 'abc' } }],
        ['trilha com número dentro do array', { ...BACKUP, completedNodesByTrack: { t1: ['n1', 7] } }],
        ['trilha com id vazio', { ...BACKUP, completedNodesByTrack: { t1: ['n1', ''] } }],
        ['trilha nula', { ...BACKUP, completedNodesByTrack: { t1: null } }],
        ['reviewSchedule é array', { ...BACKUP, reviewSchedule: [] }],
        ['cartão vazio', { ...BACKUP, reviewSchedule: { l1: {} } }],
        ['cartão sem nextReviewAt', { ...BACKUP, reviewSchedule: { l1: semCampo(cartaoValido, 'nextReviewAt') } }],
        ['cartão sem lessonId', { ...BACKUP, reviewSchedule: { l1: semCampo(cartaoValido, 'lessonId') } }],
        ['cartão com easeFactor textual', { ...BACKUP, reviewSchedule: { l1: { ...cartaoValido, easeFactor: '2.5' } } }],
        ['cartão com interval NaN', { ...BACKUP, reviewSchedule: { l1: { ...cartaoValido, interval: NaN } } }],
        ['cartão nulo', { ...BACKUP, reviewSchedule: { l1: null } }],
    ];

    it.each(corrompidos)('%s vira incompatível, nunca utilizável', async (_rotulo, payload) => {
        await expect(lendo(payload)).resolves.toEqual({ kind: 'incompatible', reason: 'schema-version' });
    });

    // Contrapontos: sem eles, uma validação que rejeitasse tudo passaria nos
    // casos acima e destruiria o backup de todo mundo.
    const validos: [string, unknown][] = [
        ['backup completo', BACKUP],
        ['mapas vazios', { ...BACKUP, completedNodesByTrack: {}, reviewSchedule: {} }],
        ['trilha sem nós concluídos', { ...BACKUP, completedNodesByTrack: { t1: [] } }],
        ['várias trilhas', { ...BACKUP, completedNodesByTrack: { t1: ['n1'], t2: ['n2', 'n3'] } }],
        ['agenda com cartão íntegro', { ...BACKUP, reviewSchedule: { l1: cartaoValido } }],
        ['lastRefillAt nulo', { ...BACKUP, lastRefillAt: null }],
    ];

    it.each(validos)('%s continua utilizável', async (_rotulo, payload) => {
        await expect(lendo(payload)).resolves.toEqual({ kind: 'usable', backup: payload });
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

    it('traduz conflito do servidor como conflito, não como indisponibilidade', async () => {
        // Achado 2 da revisão: o Swift resolvia serverRecordChanged sozinho,
        // escrevendo por cima. Agora o conflito atravessa a fronteira para o
        // serviço, que é quem sabe mesclar.
        const native = fakeNative({
            saveBackup: jest.fn(async () => { throw nativeErro('conflict'); }),
        });

        await new CloudKitPrivateAdapter(native).push(BACKUP).then(
            () => { throw new Error('deveria ter recusado'); },
            (erro) => {
                expect(isCloudConflict(erro)).toBe(true);
                expect(isCloudUnavailable(erro)).toBe(false);
            },
        );
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
