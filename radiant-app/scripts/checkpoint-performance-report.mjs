import { readdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

const PREFIX = 'RADIANT_CHECKPOINT_PERF ';
const METRICS = new Set(['persistence', 'restoration']);
const MODES = new Set(['off', 'active']);
const EXACT_KEYS = ['durationMs', 'metric', 'mode', 'schemaVersion'];
const MIN_SAMPLES = 20;

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
  };
}

function absoluteGate(summary, limitMs) {
  if (summary.count < MIN_SAMPLES) {
    return { passed: false, reason: 'insufficient-samples', count: summary.count, required: MIN_SAMPLES, p95Ms: summary.p95Ms, limitMs };
  }
  return {
    passed: summary.p95Ms <= limitMs,
    reason: summary.p95Ms <= limitMs ? 'within-limit' : 'limit-exceeded',
    count: summary.count,
    required: MIN_SAMPLES,
    p95Ms: summary.p95Ms,
    limitMs,
  };
}

function deltaGate(baseline, active) {
  if (baseline.count < MIN_SAMPLES || active.count < MIN_SAMPLES) {
    return {
      passed: false,
      reason: 'insufficient-samples',
      baselineCount: baseline.count,
      activeCount: active.count,
      requiredPerCohort: MIN_SAMPLES,
      baselineP95Ms: baseline.p95Ms,
      activeP95Ms: active.p95Ms,
      deltaMs: null,
      allowedDeltaMs: null,
    };
  }
  const deltaMs = Math.round((active.p95Ms - baseline.p95Ms) * 10) / 10;
  const allowedDeltaMs = Math.round(Math.max(0.05 * baseline.p95Ms, 50) * 10) / 10;
  return {
    passed: deltaMs <= allowedDeltaMs,
    reason: deltaMs <= allowedDeltaMs ? 'within-limit' : 'limit-exceeded',
    baselineCount: baseline.count,
    activeCount: active.count,
    requiredPerCohort: MIN_SAMPLES,
    baselineP95Ms: baseline.p95Ms,
    activeP95Ms: active.p95Ms,
    deltaMs,
    allowedDeltaMs,
  };
}

export function buildCheckpointPerformanceReport({ baselineCommandRuns, activeCommandRuns, activeLog }) {
  const baselineSamples = extractMaestroPerformanceSamples(baselineCommandRuns, 'off');
  const activeSamples = [
    ...extractMaestroPerformanceSamples(activeCommandRuns, 'active'),
    ...parseCheckpointPerformanceLog(activeLog, 'active'),
  ];
  const summary = {
    baseline: {
      cold_start: summarize(baselineSamples, 'cold_start'),
      home_to_lesson: summarize(baselineSamples, 'home_to_lesson'),
    },
    active: {
      persistence: summarize(activeSamples, 'persistence'),
      restoration: summarize(activeSamples, 'restoration'),
      cold_start: summarize(activeSamples, 'cold_start'),
      home_to_lesson: summarize(activeSamples, 'home_to_lesson'),
    },
  };
  const gates = {
    persistence: absoluteGate(summary.active.persistence, 75),
    restoration: absoluteGate(summary.active.restoration, 100),
    cold_start_delta: deltaGate(summary.baseline.cold_start, summary.active.cold_start),
    home_to_lesson_delta: deltaGate(summary.baseline.home_to_lesson, summary.active.home_to_lesson),
  };

  return {
    schemaVersion: 1,
    minimumSamplesPerCohort: MIN_SAMPLES,
    summary,
    gates,
    passed: Object.values(gates).every((gate) => gate.passed),
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
