import { readdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

const PREFIX = 'RADIANT_CHECKPOINT_PERF ';
// `first_frame` entrou em 2026-08-10. As duas primeiras medem trabalho DO kernel
// e so existem quando ele esta ligado; `first_frame` mede a janela de partida do
// app e e emitida em qualquer modo — e por isso pode comparar `off` com `active`.
const CHECKPOINT_METRICS = ['persistence', 'restoration'];
const METRICS = new Set([...CHECKPOINT_METRICS, 'first_frame']);
const MODES = new Set(['off', 'active']);
const EXACT_KEYS = ['durationMs', 'metric', 'mode', 'schemaVersion'];
const MIN_SAMPLES = 20;

// O desenho original do gate pedia resolucao para detectar 5% de regressao. O
// piso de ruido medido pode substituir esse termo — e desde 2026-08-10 substitui
// — mas nao indefinidamente: quando ele cresce, o gate continua respondendo
// "dentro do limite" enquanto perde a capacidade de dizer qualquer coisa. O teto
// abaixo fixa quanta sensibilidade a medicao pode perder antes de o desfecho
// deixar de ser aprovacao e passar a ser medicao inconclusiva.
const DESIGNED_DELTA_SHARE_OF_BASELINE = 0.05;
const MAX_SENSITIVITY_LOSS = 4;
const MAX_NOISE_FLOOR_SHARE_OF_BASELINE = DESIGNED_DELTA_SHARE_OF_BASELINE * MAX_SENSITIVITY_LOSS;

// Dois desfechos negativos, um so `passed: false`. A distincao importa porque as
// acoes que eles pedem sao opostas: `fail` manda investigar o produto,
// `inconclusive` manda remedir o instrumento. Amostra insuficiente e ruido
// dominante sao as duas formas de nao ter medido.
const INCONCLUSIVE_REASONS = new Set(['insufficient-samples', 'measurement-too-noisy']);

function outcomeOf(passed, reason) {
  if (INCONCLUSIVE_REASONS.has(reason)) return 'inconclusive';
  return passed ? 'pass' : 'fail';
}

function tenths(value) {
  return Math.round(value * 10) / 10;
}

function hasExactKeys(candidate) {
  return Object.keys(candidate).sort().join('|') === EXACT_KEYS.join('|');
}

export function parseCheckpointPerformanceLog(log, expectedMode) {
  if (!MODES.has(expectedMode)) throw new Error(`invalid expected mode: ${expectedMode}`);
  const samples = [];

  for (const line of log.split(/\r?\n/)) {
    const prefixIndex = line.indexOf(PREFIX);
    if (prefixIndex < 0) continue;
    const raw = line.slice(prefixIndex + PREFIX.length).trim();
    let candidate;
    try {
      candidate = JSON.parse(raw);
    } catch {
      continue;
    }
    if (!candidate || typeof candidate !== 'object' || Array.isArray(candidate) || !hasExactKeys(candidate)) continue;
    if (candidate.schemaVersion !== 1 || candidate.mode !== expectedMode || !METRICS.has(candidate.metric)) continue;
    if (typeof candidate.durationMs !== 'number' || !Number.isFinite(candidate.durationMs) || candidate.durationMs < 0) continue;
    samples.push(candidate);
  }

  return samples;
}

function completed(command) {
  return command?.metadata?.status === 'COMPLETED'
    && Number.isFinite(command.metadata.timestamp)
    && Number.isFinite(command.metadata.duration)
    && command.metadata.duration >= 0;
}

export function extractMaestroPerformanceSamples(commandRuns, mode) {
  if (!MODES.has(mode)) throw new Error(`invalid Maestro mode: ${mode}`);
  const samples = [];

  for (const commands of commandRuns) {
    if (!Array.isArray(commands)) continue;
    const coldStart = commands.find((entry) => (
      completed(entry) && entry.command?.launchAppCommand?.clearState === true
    ));
    if (coldStart) {
      samples.push({
        schemaVersion: 1,
        metric: 'cold_start',
        mode,
        durationMs: coldStart.metadata.duration,
      });
    }

    const tapIndex = commands.findIndex((entry) => (
      completed(entry)
      && entry.command?.tapOnElement?.selector?.textRegex === 'Continuar jornada'
    ));
    const lessonReady = tapIndex < 0 ? undefined : commands.slice(tapIndex + 1).find((entry) => (
      completed(entry)
      && entry.command?.assertConditionCommand?.condition?.visible?.textRegex === 'Fundamentos de Radiologia'
    ));
    if (tapIndex >= 0 && lessonReady) {
      const startedAt = commands[tapIndex].metadata.timestamp;
      const finishedAt = lessonReady.metadata.timestamp + lessonReady.metadata.duration;
      const durationMs = finishedAt - startedAt;
      if (Number.isFinite(durationMs) && durationMs >= 0) {
        samples.push({ schemaVersion: 1, metric: 'home_to_lesson', mode, durationMs });
      }
    }
  }

  return samples;
}

function summarize(samples, metric) {
  const values = samples
    .filter((sample) => sample.metric === metric)
    .map((sample) => sample.durationMs)
    .sort((left, right) => left - right);
  const p95Index = values.length === 0 ? -1 : Math.ceil(values.length * 0.95) - 1;
  return {
    count: values.length,
    p95Ms: p95Index >= 0 ? values[p95Index] : null,
    // A mediana existe para medir a cauda superior do baseline, nao para ser
    // reportada por si: `p95 - p50` e o piso de ruido do gate de delta.
    p50Ms: values.length === 0 ? null : values[Math.floor(values.length / 2)],
  };
}

function absoluteGate(summary, limitMs) {
  if (summary.count < MIN_SAMPLES) {
    return { passed: false, reason: 'insufficient-samples', outcome: outcomeOf(false, 'insufficient-samples'), count: summary.count, required: MIN_SAMPLES, p95Ms: summary.p95Ms, limitMs };
  }
  const passed = summary.p95Ms <= limitMs;
  const reason = passed ? 'within-limit' : 'limit-exceeded';
  return {
    passed,
    reason,
    outcome: outcomeOf(passed, reason),
    count: summary.count,
    required: MIN_SAMPLES,
    p95Ms: summary.p95Ms,
    limitMs,
  };
}

// O limite permitido tem tres termos e o maior manda. Os dois primeiros — 5% do
// p95 do baseline e um piso fixo de 50 ms — vinham do desenho original. O
// terceiro entrou em 2026-08-10, medido: na primeira execucao real do gate a
// amplitude interna do cold start foi 838 ms no baseline e 833 ms no candidato,
// contra um limite de 167,6 ms. Um limiar abaixo da dispersao da propria medida
// reprova por ruido, independentemente da mudanca sob teste — e reprovou. A
// cauda superior medida do baseline (`p95 - p50`) e o piso de resolucao do
// instrumento: exigir menos que isso e pedir uma precisao que ele nao tem.
//
// `cold_start` deixou de entrar no veredito em 2026-08-10, por decisao do dono, e
// a razao e estrutural: ele mede a duracao do `launchApp` do Maestro, que num Dev
// Client termina no launcher, antes de o bundle JS ser buscado e avaliado. O
// kernel e JavaScript, logo nao vive na janela medida — um gate cuja metrica nao
// observa o objeto sob teste nao pode aprovar nem reprovar, e foi tentando faze-lo
// que o gate primeiro reprovou por ruido e depois aprovou vazio. Ele continua
// calculado e reportado porque a serie historica vale como contexto, e porque uma
// regressao de lancamento NATIVO so apareceria aqui. Voltar a gatea-lo e remover o
// nome desta lista.
const ADVISORY_GATES = new Set(['cold_start_delta']);

// Isto NAO afrouxa o gate quando a medida e estavel: com baseline sem
// dispersao o terceiro termo e zero e os dois originais continuam mandando.
//
// O terceiro desfecho entrou em 2026-08-10, depois da terceira passagem, e a
// razao e o limite do proprio termo acima. Com o host em swap o piso de ruido do
// cold start foi 2863 ms contra um p95 de baseline de 5748 ms, e o relatorio
// fechou em `passed: true`: o limiar consciente de ruido eliminou o
// falso-negativo e, num host que degrada, trocou-o por um passe vazio. As duas
// falhas sao do instrumento, e a segunda e a mais perigosa porque tem cara de
// aprovacao. Um gate que so sabe aprovar ou reprovar aprova vazio; por isso
// existe `measurement-too-noisy`, e ele e checado ANTES da comparacao de delta —
// quando a medida nao tem resolucao, nem "dentro do limite" nem "excede" sao
// afirmacoes sobre o produto. Foi assim que a segunda passagem se comportou:
// delta de +6021 ms atribuido ao host, nao ao software.
function deltaGate(baseline, active) {
  if (baseline.count < MIN_SAMPLES || active.count < MIN_SAMPLES) {
    return {
      passed: false,
      reason: 'insufficient-samples',
      outcome: outcomeOf(false, 'insufficient-samples'),
      baselineCount: baseline.count,
      activeCount: active.count,
      requiredPerCohort: MIN_SAMPLES,
      baselineP95Ms: baseline.p95Ms,
      baselineP50Ms: baseline.p50Ms,
      activeP95Ms: active.p95Ms,
      deltaMs: null,
      noiseFloorMs: null,
      maxNoiseFloorMs: null,
      allowedDeltaMs: null,
    };
  }
  const deltaMs = tenths(active.p95Ms - baseline.p95Ms);
  const noiseFloorMs = tenths(Math.max(baseline.p95Ms - baseline.p50Ms, 0));
  const maxNoiseFloorMs = tenths(MAX_NOISE_FLOOR_SHARE_OF_BASELINE * baseline.p95Ms);
  const allowedDeltaMs = tenths(Math.max(DESIGNED_DELTA_SHARE_OF_BASELINE * baseline.p95Ms, 50, noiseFloorMs));
  const tooNoisy = noiseFloorMs > maxNoiseFloorMs;
  const passed = !tooNoisy && deltaMs <= allowedDeltaMs;
  const reason = tooNoisy
    ? 'measurement-too-noisy'
    : (passed ? 'within-limit' : 'limit-exceeded');
  return {
    passed,
    reason,
    outcome: outcomeOf(passed, reason),
    baselineCount: baseline.count,
    activeCount: active.count,
    requiredPerCohort: MIN_SAMPLES,
    baselineP95Ms: baseline.p95Ms,
    baselineP50Ms: baseline.p50Ms,
    activeP95Ms: active.p95Ms,
    deltaMs,
    noiseFloorMs,
    maxNoiseFloorMs,
    allowedDeltaMs,
  };
}

// O baseline roda com o kernel em `off` e passou a emitir a marca de partida, que
// nao e dado de checkpoint. Uma metrica DE checkpoint num log de baseline e
// violacao de contrato, nao ruido: significa que o kernel agiu com o modo
// desligado, ou que o coletor contaminou a coorte. Em 2026-08-10 a segunda
// hipotese aconteceu de verdade — duas linhas `"mode":"active"` reentregues pelo
// buffer do CDP — e nada no relatorio as pegava, porque o baseline nao era lido.
function baselineIsolationGate(baselineLogSamples) {
  const metrics = [...new Set(
    baselineLogSamples.filter((sample) => CHECKPOINT_METRICS.includes(sample.metric)).map((s) => s.metric),
  )].sort();
  const passed = metrics.length === 0;
  const reason = passed ? 'baseline-carries-startup-mark-only' : 'checkpoint-metric-in-baseline';
  return { passed, reason, outcome: outcomeOf(passed, reason), metrics };
}

export function buildCheckpointPerformanceReport({ baselineCommandRuns, activeCommandRuns, activeLog, baselineLog }) {
  const baselineLogSamples = parseCheckpointPerformanceLog(baselineLog ?? '', 'off');
  const baselineSamples = [
    ...extractMaestroPerformanceSamples(baselineCommandRuns, 'off'),
    ...baselineLogSamples,
  ];
  const activeSamples = [
    ...extractMaestroPerformanceSamples(activeCommandRuns, 'active'),
    ...parseCheckpointPerformanceLog(activeLog, 'active'),
  ];
  const summary = {
    baseline: {
      cold_start: summarize(baselineSamples, 'cold_start'),
      home_to_lesson: summarize(baselineSamples, 'home_to_lesson'),
      first_frame: summarize(baselineSamples, 'first_frame'),
    },
    active: {
      persistence: summarize(activeSamples, 'persistence'),
      restoration: summarize(activeSamples, 'restoration'),
      cold_start: summarize(activeSamples, 'cold_start'),
      home_to_lesson: summarize(activeSamples, 'home_to_lesson'),
      first_frame: summarize(activeSamples, 'first_frame'),
    },
  };
  const gates = {
    persistence: absoluteGate(summary.active.persistence, 75),
    restoration: absoluteGate(summary.active.restoration, 100),
    first_frame_delta: deltaGate(summary.baseline.first_frame, summary.active.first_frame),
    cold_start_delta: deltaGate(summary.baseline.cold_start, summary.active.cold_start),
    home_to_lesson_delta: deltaGate(summary.baseline.home_to_lesson, summary.active.home_to_lesson),
    baseline_isolation: baselineIsolationGate(baselineLogSamples),
  };
  for (const [name, gate] of Object.entries(gates)) gate.advisory = ADVISORY_GATES.has(name);

  // Gates informativos ficam fora do veredito, e a lista deles e explicita acima.
  const results = Object.values(gates).filter((gate) => !gate.advisory);
  const passed = results.every((gate) => gate.passed);
  return {
    schemaVersion: 1,
    minimumSamplesPerCohort: MIN_SAMPLES,
    maxNoiseFloorShareOfBaseline: MAX_NOISE_FLOOR_SHARE_OF_BASELINE,
    summary,
    gates,
    passed,
    // `inconclusive` domina no relatorio porque e o desfecho que muda a proxima
    // acao: nao ha o que investigar no produto enquanto qualquer gate nao mediu.
    outcome: results.some((gate) => gate.outcome === 'inconclusive')
      ? 'inconclusive'
      : (passed ? 'pass' : 'fail'),
  };
}

async function collectArtifactEvidence(root) {
  const commandRuns = [];
  const logs = [];

  async function visit(directory) {
    const entries = await readdir(directory, { withFileTypes: true });
    for (const entry of entries) {
      const absolute = path.join(directory, entry.name);
      if (entry.isDirectory()) {
        await visit(absolute);
      } else if (entry.isFile() && entry.name === 'commands.json') {
        try {
          commandRuns.push(JSON.parse(await readFile(absolute, 'utf8')));
        } catch {
          // A malformed artifact does not become evidence.
        }
      } else if (entry.isFile() && /\.(?:log|txt)$/i.test(entry.name)) {
        const log = await readFile(absolute, 'utf8');
        if (log.includes(PREFIX)) logs.push(log);
      }
    }
  }

  await visit(root);
  return { commandRuns, log: logs.join('\n') };
}

function readArgument(name) {
  const index = process.argv.indexOf(name);
  return index >= 0 ? process.argv[index + 1] : undefined;
}

async function main() {
  const baselinePath = readArgument('--baseline');
  const activePath = readArgument('--active');
  const outputPath = readArgument('--output');
  if (!baselinePath || !activePath) {
    throw new Error('usage: node scripts/checkpoint-performance-report.mjs --baseline <log> --active <log> [--output <json>]');
  }
  const [baseline, active] = await Promise.all([
    collectArtifactEvidence(baselinePath),
    collectArtifactEvidence(activePath),
  ]);
  const report = buildCheckpointPerformanceReport({
    baselineCommandRuns: baseline.commandRuns,
    activeCommandRuns: active.commandRuns,
    activeLog: active.log,
    // Coletado desde sempre e descartado ate 2026-08-10: e nele que a marca de
    // partida do baseline chega, e sem ele nao existe delta de `first_frame`.
    baselineLog: baseline.log,
  });
  const json = `${JSON.stringify(report, null, 2)}\n`;
  if (outputPath) await writeFile(outputPath, json, 'utf8');
  process.stdout.write(json);
  if (!report.passed) process.exitCode = 1;
}

if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  main().catch((error) => {
    process.stderr.write(`${error instanceof Error ? error.message : String(error)}\n`);
    process.exitCode = 1;
  });
}
