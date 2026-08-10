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
export const STARTUP_PERFORMANCE_METRICS = ['first_frame'] as const;

export type CheckpointPerformanceMetric = (typeof CHECKPOINT_PERFORMANCE_METRICS)[number];
export type StartupPerformanceMetric = (typeof STARTUP_PERFORMANCE_METRICS)[number];
export type CheckpointPerformanceMode = 'off' | 'active';

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
export class FirstFrameProbe {
    private recorded = false;

    constructor(private readonly dependencies: FirstFrameDependencies) {}

    recordFirstFrame(): number | null {
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
            schemaVersion: 1,
            metric: 'first_frame' satisfies StartupPerformanceMetric,
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

export const firstFrameProbe = new FirstFrameProbe({
    enabled: firstFrameEnabled,
    mode: probeMode,
    bundleStartedAt,
    clock,
    emit: (line) => console.info(line),
});
