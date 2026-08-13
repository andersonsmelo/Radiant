import { AppConfig } from '../../config';
import { readBooleanFlag } from '../../config/contracts';
import { resolveStudentCheckpointRuntimeMode } from './mode';

export const CHECKPOINT_PERFORMANCE_PREFIX = 'RADIANT_CHECKPOINT_PERF ';

export const CHECKPOINT_PERFORMANCE_METRICS = [
    'persistence',
    'restoration',
] as const;

// Métrica de inicialização, deliberadamente separada das duas acima. As de cima
// medem trabalho DO kernel e só existem quando ele está ligado; esta mede a
// janela de partida do app, que existe em qualquer modo — e é justamente por
// existir nos dois que ela permite comparar `off` com `active`.
// `launch_inspection` entrou em 2026-08-10, depois de o piloto de `first_frame`
// achar ~440 ms de custo na partida em `active`. Ele mede a fronteira que era a
// unica coisa a diferir entre os dois modos naquele trecho e a unica que nunca
// passou por probe nenhum — por isso os 9 ms de restauracao nunca contradisseram
// os 440. Medida NOS DOIS MODOS, ela separa "o kernel custa isso" de "o custo
// esta em outro lugar", que sao diagnosticos com remedios opostos.
// `storage_module_resolution` entrou em 2026-08-10 para separar duas explicacoes
// do custo de partida que tem remedios opostos: resolucao de modulo (artefato do
// Dev Client, nada a otimizar) contra abertura do banco nativo na primeira leitura
// (real em producao). `launch_inspection` menos esta metrica e o custo da leitura.
export const STARTUP_PERFORMANCE_METRICS = [
    'first_frame',
    'launch_inspection',
    'storage_module_resolution',
] as const;

export type CheckpointPerformanceMetric = (typeof CHECKPOINT_PERFORMANCE_METRICS)[number];
export type StartupPerformanceMetric = (typeof STARTUP_PERFORMANCE_METRICS)[number];
export type CheckpointPerformanceMode = 'off' | 'active';
export type FirstFrameLaunchPhase = 'cold' | 'resume';

// A coorte `active` precisa de dois lançamentos: o primeiro mede a partida fria;
// o segundo prova a oferta/fallback de retomada offline. Ambos são evidência, mas
// não são a mesma população de performance. Esta conversão fica junto do envelope
// para que o relatório não tenha de inferir a fase pela ordem frágil do log.
export function firstFrameLaunchPhase(kind: 'none' | 'offer' | 'fallback'): FirstFrameLaunchPhase {
    return kind === 'none' ? 'cold' : 'resume';
}

type ProbeDependencies = {
    enabled: boolean;
    mode: CheckpointPerformanceMode;
    clock: () => number;
    emit: (line: string) => void;
};

function roundedDuration(start: number, end: number): number | null {
    const duration = end - start;
    if (!Number.isFinite(duration) || duration < 0) return null;
    return Math.round(duration * 10) / 10;
}

export class CheckpointPerformanceProbe {
    constructor(private readonly dependencies: ProbeDependencies) {}

    async measure<T>(metric: CheckpointPerformanceMetric, task: () => Promise<T>): Promise<T> {
        if (!this.dependencies.enabled) return task();
        const startedAt = this.dependencies.clock();
        try {
            return await task();
        } finally {
            this.record(metric, startedAt);
        }
    }

    private record(metric: CheckpointPerformanceMetric, startedAt: number): number | null {
        const durationMs = roundedDuration(startedAt, this.dependencies.clock());
        if (durationMs === null) return null;
        const envelope = {
            schemaVersion: 1,
            metric,
            mode: this.dependencies.mode,
            durationMs,
        } as const;
        try {
            this.dependencies.emit(`${CHECKPOINT_PERFORMANCE_PREFIX}${JSON.stringify(envelope)}`);
        } catch {
            // Diagnostics must never interfere with the learning path.
        }
        return durationMs;
    }
}

type FirstFrameDependencies = {
    enabled: boolean;
    mode: CheckpointPerformanceMode;
    bundleStartedAt: number;
    clock: () => number;
    emit: (line: string) => void;
};

// Mede a janela JS da partida: início do bundle até o primeiro frame útil. Ela
// existe porque o gate de cold start do H3 media a duração do `launchApp` do
// Maestro, que num Dev Client termina no launcher — antes de o bundle JS ser
// buscado e avaliado. O kernel é JavaScript, então aquela janela não o continha,
// e nenhum ajuste de limiar conserta uma métrica que não observa o objeto.
//
// Esta janela contém o kernel por construção: o primeiro frame útil é o frame
// seguinte a `startupPhase` virar `ready`, que só acontece depois de
// `inspectLaunch` do runtime de checkpoints resolver.
//
// A independência de modo é o ponto do desenho, não um detalhe: o probe acima
// exige `runtimeMode === 'active'`, e foi esse acoplamento que fez esta rota ser
// descartada uma vez, com o motivo de que o baseline `off` nunca produziria a
// coorte de comparação. Uma marca de inicialização não é dado de checkpoint —
// não lê nem escreve store — então pode existir nos dois modos, e é isso que faz
// o delta existir.
export class StartupProbe {
    private recorded = false;
    private readonly medidos = new Set<StartupPerformanceMetric>();

    constructor(private readonly dependencies: FirstFrameDependencies) {}

    // Independente do modo, como `recordFirstFrame`: e a comparacao entre os dois
    // modos que carrega a informacao, entao medir so um deles nao serve.
    async measure<T>(metric: StartupPerformanceMetric, task: () => Promise<T>): Promise<T> {
        if (!this.dependencies.enabled) return task();
        const startedAt = this.dependencies.clock();
        try {
            return await task();
        } finally {
            const durationMs = roundedDuration(startedAt, this.dependencies.clock());
            if (durationMs !== null) this.emitEnvelope(metric, durationMs);
        }
    }

    // Mede apenas a PRIMEIRA execucao e fica transparente depois. Existe porque a
    // coisa a medir acontece uma vez por lancamento enquanto o ponto de chamada e
    // atravessado por toda operacao seguinte: medir sempre encareceria o caminho
    // quente para reobservar um custo que nao se repete.
    async measureOnce<T>(metric: StartupPerformanceMetric, task: () => Promise<T>): Promise<T> {
        if (!this.dependencies.enabled || this.medidos.has(metric)) return task();
        this.medidos.add(metric);
        const startedAt = this.dependencies.clock();
        try {
            return await task();
        } finally {
            const durationMs = roundedDuration(startedAt, this.dependencies.clock());
            if (durationMs !== null) this.emitEnvelope(metric, durationMs);
        }
    }

    private emitEnvelope(metric: StartupPerformanceMetric, durationMs: number): void {
        const envelope = { schemaVersion: 1, metric, mode: this.dependencies.mode, durationMs } as const;
        try {
            this.dependencies.emit(`${CHECKPOINT_PERFORMANCE_PREFIX}${JSON.stringify(envelope)}`);
        } catch {
            // Diagnostics must never interfere with the learning path.
        }
    }

    recordFirstFrame(launchPhase: FirstFrameLaunchPhase): number | null {
        if (!this.dependencies.enabled || this.recorded) return null;
        const durationMs = roundedDuration(
            this.dependencies.bundleStartedAt,
            this.dependencies.clock(),
        );
        if (durationMs === null) return null;
        // Marcado só depois de haver amostra válida: um relógio inconsistente não
        // deve consumir a única emissão do lançamento.
        this.recorded = true;
        const envelope = {
            schemaVersion: 2,
            metric: 'first_frame',
            mode: this.dependencies.mode,
            launchPhase,
            durationMs,
        } as const;
        try {
            this.dependencies.emit(`${CHECKPOINT_PERFORMANCE_PREFIX}${JSON.stringify(envelope)}`);
        } catch {
            // Diagnostics must never interfere with the learning path.
        }
        return durationMs;
    }
}

const runtimeMode = resolveStudentCheckpointRuntimeMode(
    AppConfig.APP_ENV,
    process.env.EXPO_PUBLIC_STUDENT_CHECKPOINT_MODE,
);
const probeMode: CheckpointPerformanceMode = runtimeMode === 'active' ? 'active' : 'off';
const probeEnabled = AppConfig.APP_ENV === 'development'
    && runtimeMode === 'active'
    && readBooleanFlag(process.env.EXPO_PUBLIC_STUDENT_CHECKPOINT_PERFORMANCE, false);

const clock = () => globalThis.performance?.now?.() ?? Date.now();

export const checkpointPerformanceProbe = new CheckpointPerformanceProbe({
    enabled: probeEnabled,
    mode: probeMode,
    clock,
    emit: (line) => console.info(line),
});

// A origem é lida com o MESMO relógio do fim da janela, no momento em que este
// módulo é avaliado. `global.__BUNDLE_START_TIME__` foi considerado e recusado:
// ele vive numa base de tempo diferente de `performance.now()`, e subtrair as
// duas produziria um número com cara de duração e sem significado. Para um
// DELTA entre duas coortes no mesmo binário, consistência da base importa mais
// que completude da janela — o que se perde é a avaliação de bundle anterior a
// este módulo, e ela se perde igualmente nas duas coortes.
const bundleStartedAt = clock();

// Habilitada independente do modo do kernel, ao contrário do probe acima. Só o
// ambiente e a flag de performance a governam, e é isso que faz o baseline `off`
// produzir a coorte de comparação. Nenhum store é lido ou escrito aqui.
const firstFrameEnabled = AppConfig.APP_ENV === 'development'
    && readBooleanFlag(process.env.EXPO_PUBLIC_STUDENT_CHECKPOINT_PERFORMANCE, false);

export const startupProbe = new StartupProbe({
    enabled: firstFrameEnabled,
    mode: probeMode,
    bundleStartedAt,
    clock,
    emit: (line) => console.info(line),
});
