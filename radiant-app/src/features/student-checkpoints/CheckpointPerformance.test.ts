import {
    CHECKPOINT_PERFORMANCE_PREFIX,
    CheckpointPerformanceProbe,
    firstFrameLaunchPhase,
    StartupProbe,
} from './CheckpointPerformance';

describe('CheckpointPerformanceProbe', () => {
    it('emits only the closed metric, mode and rounded duration', async () => {
        const emit = jest.fn();
        const times = [100, 126.789];
        const probe = new CheckpointPerformanceProbe({
            enabled: true,
            mode: 'active',
            clock: () => times.shift() ?? 0,
            emit,
        });

        await expect(probe.measure('persistence', async () => 'ok')).resolves.toBe('ok');

        expect(emit).toHaveBeenCalledWith(
            `${CHECKPOINT_PERFORMANCE_PREFIX}{"schemaVersion":1,"metric":"persistence","mode":"active","durationMs":26.8}`,
        );
    });

    it('records failures without swallowing the original error', async () => {
        const emit = jest.fn();
        const times = [10, 12];
        const probe = new CheckpointPerformanceProbe({
            enabled: true,
            mode: 'active',
            clock: () => times.shift() ?? 0,
            emit,
        });

        await expect(probe.measure('restoration', async () => {
            throw new Error('storage-unavailable');
        })).rejects.toThrow('storage-unavailable');

        expect(emit).toHaveBeenCalledWith(expect.stringContaining('"metric":"restoration"'));
    });

    it('is a byte-silent no-op when disabled', async () => {
        const emit = jest.fn();
        const clock = jest.fn(() => 1);
        const probe = new CheckpointPerformanceProbe({ enabled: false, mode: 'off', clock, emit });

        await expect(probe.measure('persistence', async () => 7)).resolves.toBe(7);

        expect(clock).not.toHaveBeenCalled();
        expect(emit).not.toHaveBeenCalled();
    });
});

describe('StartupProbe.recordFirstFrame', () => {
    function probeFor(mode: 'off' | 'active', options: { bundleStartedAt?: number; now?: number } = {}) {
        const emit = jest.fn();
        const probe = new StartupProbe({
            enabled: true,
            mode,
            bundleStartedAt: options.bundleStartedAt ?? 1_000,
            clock: () => options.now ?? 1_812.4,
            emit,
        });
        return { probe, emit };
    }

    // Esta e a assercao que sustenta a coorte de comparacao inteira. O probe de
    // checkpoint exige `runtimeMode === 'active'`, e foi esse acoplamento que
    // fez a rota da marca de primeiro frame ser descartada em 2026-08-10 com o
    // motivo "o baseline `off` nunca produziria a coorte". A marca de primeiro
    // frame nao e dado de checkpoint: ela mede inicializacao e nao toca store
    // nenhum, entao emite nos dois modos e o delta passa a existir.
    it.each([
        ['off', 'cold'],
        ['active', 'cold'],
    ] as const)('emits the closed cold-start envelope in %s mode', (mode, launchPhase) => {
        const { probe, emit } = probeFor(mode);

        probe.recordFirstFrame(launchPhase);

        expect(emit).toHaveBeenCalledWith(
            `${CHECKPOINT_PERFORMANCE_PREFIX}{"schemaVersion":2,"metric":"first_frame","mode":"${mode}","launchPhase":"${launchPhase}","durationMs":812.4}`,
        );
    });

    it('labels any checkpoint recovery launch as resume, not as a cold sample', () => {
        expect(firstFrameLaunchPhase('none')).toBe('cold');
        expect(firstFrameLaunchPhase('offer')).toBe('resume');
        expect(firstFrameLaunchPhase('fallback')).toBe('resume');
    });

    // O gatilho vive num efeito de React, que pode reexecutar. Duas amostras de
    // um mesmo lancamento inflariam a coorte e corromperiam o p95 exatamente
    // como o replay de buffer do CDP fez em 2026-08-10.
    it('emits once per launch even when the trigger repeats', () => {
        const { probe, emit } = probeFor('active');

        probe.recordFirstFrame('cold');
        probe.recordFirstFrame('cold');
        probe.recordFirstFrame('cold');

        expect(emit).toHaveBeenCalledTimes(1);
    });

    it('is silent when disabled, without reading the clock', () => {
        const emit = jest.fn();
        const clock = jest.fn(() => 5);
        const probe = new StartupProbe({
            enabled: false,
            mode: 'off',
            bundleStartedAt: 1,
            clock,
            emit,
        });

        probe.recordFirstFrame('cold');

        expect(clock).not.toHaveBeenCalled();
        expect(emit).not.toHaveBeenCalled();
    });

    // Um relogio que ande para tras produziria duracao negativa, e o parser do
    // relatorio a descartaria em silencio — coorte menor sem ninguem saber por
    // que. Falhar aqui e mais barato que investigar amostra faltando depois.
    it('does not emit a duration that is negative or not finite', () => {
        const negativo = probeFor('active', { bundleStartedAt: 2_000, now: 1_000 });
        negativo.probe.recordFirstFrame('cold');
        expect(negativo.emit).not.toHaveBeenCalled();

        const infinito = probeFor('active', { bundleStartedAt: Number.NaN });
        infinito.probe.recordFirstFrame('cold');
        expect(infinito.emit).not.toHaveBeenCalled();
    });

    it('never lets a failing emitter reach the learning path', () => {
        const probe = new StartupProbe({
            enabled: true,
            mode: 'active',
            bundleStartedAt: 0,
            clock: () => 10,
            emit: () => { throw new Error('console-unavailable'); },
        });

        expect(() => probe.recordFirstFrame('resume')).not.toThrow();
    });
});

// A fronteira que faltava medir. O custo de ~440 ms medido no piloto de
// `first_frame` em 2026-08-10 esta em algum lugar entre o inicio da janela JS e o
// primeiro frame util, e `inspectLaunch` e a UNICA coisa que difere entre os dois
// modos naquele trecho — mas ele nunca passou pelo probe, e e por isso que os
// 9 ms de restauracao nunca contradisseram os 440. Medi-lo NOS DOIS MODOS e o que
// separa "o kernel custa isso" de "o custo esta em outro lugar".
describe('StartupProbe.measure', () => {
    it.each(['off', 'active'] as const)('measures the launch inspection in %s mode', async (mode) => {
        const emit = jest.fn();
        const times = [500, 941.4];
        const probe = new StartupProbe({
            enabled: true,
            mode,
            bundleStartedAt: 0,
            clock: () => times.shift() ?? 0,
            emit,
        });

        await expect(probe.measure('launch_inspection', async () => 'pronto')).resolves.toBe('pronto');

        expect(emit).toHaveBeenCalledWith(
            `${CHECKPOINT_PERFORMANCE_PREFIX}{"schemaVersion":1,"metric":"launch_inspection","mode":"${mode}","durationMs":441.4}`,
        );
    });

    it('records the duration even when the inspected task rejects', async () => {
        const emit = jest.fn();
        const times = [10, 30];
        const probe = new StartupProbe({
            enabled: true, mode: 'active', bundleStartedAt: 0, clock: () => times.shift() ?? 0, emit,
        });

        await expect(probe.measure('launch_inspection', async () => {
            throw new Error('storage-unavailable');
        })).rejects.toThrow('storage-unavailable');

        expect(emit).toHaveBeenCalledWith(expect.stringContaining('"metric":"launch_inspection"'));
    });

    it('does not read the clock when disabled', async () => {
        const clock = jest.fn(() => 1);
        const emit = jest.fn();
        const probe = new StartupProbe({ enabled: false, mode: 'off', bundleStartedAt: 0, clock, emit });

        await expect(probe.measure('launch_inspection', async () => 3)).resolves.toBe(3);

        expect(clock).not.toHaveBeenCalled();
        expect(emit).not.toHaveBeenCalled();
    });
});

// O teste decisivo do mecanismo por tras dos ~240 ms que `launch_inspection`
// mostrou em `active`. Duas explicacoes sobreviveram a analise e elas tem remedios
// OPOSTOS: se o custo e a resolucao do modulo (`await import()` servido como chunk
// HTTP pelo Metro em dev), e artefato de desenvolvimento e nao ha o que otimizar;
// se e a abertura do banco nativo na primeira leitura, e real em producao. Medir a
// resolucao sozinha separa as duas: `launch_inspection` menos esta metrica e o
// custo da leitura.
describe('StartupProbe.measure — resolucao de modulo', () => {
    it('measures the module resolution once and stays silent on later calls', async () => {
        const emit = jest.fn();
        const times = [10, 241.5, 900, 901];
        const probe = new StartupProbe({
            enabled: true,
            mode: 'active',
            bundleStartedAt: 0,
            clock: () => times.shift() ?? 0,
            emit,
        });

        await probe.measureOnce('storage_module_resolution', async () => 'modulo');
        await probe.measureOnce('storage_module_resolution', async () => 'modulo');

        expect(emit).toHaveBeenCalledTimes(1);
        expect(emit).toHaveBeenCalledWith(
            `${CHECKPOINT_PERFORMANCE_PREFIX}{"schemaVersion":1,"metric":"storage_module_resolution","mode":"active","durationMs":231.5}`,
        );
    });

    // A segunda chamada nao pode pagar o preco de medir o que ja foi medido: o
    // ponto de `measureOnce` e que a resolucao acontece uma vez por lancamento e
    // toda operacao de storage seguinte passa por aqui.
    it('does not read the clock on calls after the first', async () => {
        const clock = jest.fn(() => 1);
        const probe = new StartupProbe({
            enabled: true, mode: 'active', bundleStartedAt: 0, clock, emit: jest.fn(),
        });

        await probe.measureOnce('storage_module_resolution', async () => 1);
        const antes = clock.mock.calls.length;
        await probe.measureOnce('storage_module_resolution', async () => 1);

        expect(clock.mock.calls.length).toBe(antes);
    });

    it('returns the task result and stays transparent when disabled', async () => {
        const emit = jest.fn();
        const probe = new StartupProbe({
            enabled: false, mode: 'off', bundleStartedAt: 0, clock: () => 1, emit,
        });

        await expect(probe.measureOnce('storage_module_resolution', async () => 'passa')).resolves.toBe('passa');
        expect(emit).not.toHaveBeenCalled();
    });
});
