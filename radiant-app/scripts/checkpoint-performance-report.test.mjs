import assert from 'node:assert/strict';
import test from 'node:test';

import {
  buildCheckpointPerformanceReport,
  extractMaestroPerformanceSamples,
  parseCheckpointPerformanceLog,
} from './checkpoint-performance-report.mjs';

const prefix = 'RADIANT_CHECKPOINT_PERF ';

function lines(metric, mode, values) {
  return values.map((durationMs) => (
    `LOG ${prefix}${JSON.stringify({ schemaVersion: 1, metric, mode, durationMs })}`
  )).join('\n');
}

function commandRun(coldStartMs, homeToLessonMs) {
  return [
    {
      command: { launchAppCommand: { clearState: true } },
      metadata: { status: 'COMPLETED', timestamp: 100, duration: coldStartMs },
    },
    {
      command: { tapOnElement: { selector: { textRegex: 'Continuar jornada' } } },
      metadata: { status: 'COMPLETED', timestamp: 1000, duration: 10 },
    },
    {
      command: { assertConditionCommand: { condition: { visible: { textRegex: 'Fundamentos de Radiologia' } } } },
      metadata: { status: 'COMPLETED', timestamp: 1000 + homeToLessonMs - 5, duration: 5 },
    },
  ];
}

test('parses only the closed, finite and mode-matching performance envelope', () => {
  const parsed = parseCheckpointPerformanceLog([
    lines('persistence', 'active', [10]),
    `${prefix}{"schemaVersion":2,"metric":"persistence","mode":"active","durationMs":11}`,
    `${prefix}{"schemaVersion":1,"metric":"content-id","mode":"active","durationMs":12}`,
    `${prefix}{"schemaVersion":1,"metric":"restoration","mode":"active","durationMs":"13"}`,
  ].join('\n'), 'active');

  assert.deepEqual(parsed, [{ schemaVersion: 1, metric: 'persistence', mode: 'active', durationMs: 10 }]);
});

test('extracts end-to-end cold start and Home-to-Lesson durations from completed Maestro commands', () => {
  assert.deepEqual(extractMaestroPerformanceSamples([commandRun(321, 456)], 'off'), [
    { schemaVersion: 1, metric: 'cold_start', mode: 'off', durationMs: 321 },
    { schemaVersion: 1, metric: 'home_to_lesson', mode: 'off', durationMs: 456 },
  ]);
});

test('uses nearest-rank p95 and closes all four gates with twenty samples', () => {
  const baselineCommandRuns = Array.from({ length: 20 }, (_, index) => commandRun(100 + index, 200 + index));
  const activeCommandRuns = Array.from({ length: 20 }, (_, index) => commandRun(110 + index, 210 + index));
  const activeLog = [
    lines('persistence', 'active', Array.from({ length: 20 }, (_, index) => 30 + index)),
    lines('restoration', 'active', Array.from({ length: 20 }, (_, index) => 50 + index)),
  ].join('\n');

  const report = buildCheckpointPerformanceReport({ baselineCommandRuns, activeCommandRuns, activeLog });

  assert.equal(report.summary.baseline.cold_start.p95Ms, 118);
  assert.equal(report.summary.active.persistence.p95Ms, 48);
  assert.equal(report.summary.active.restoration.p95Ms, 68);
  assert.equal(report.gates.persistence.passed, true);
  assert.equal(report.gates.restoration.passed, true);
  assert.equal(report.gates.cold_start_delta.passed, true);
  assert.equal(report.gates.home_to_lesson_delta.passed, true);
  assert.equal(report.passed, true);
});

test('fails closed when a cohort has fewer than twenty valid samples', () => {
  const baselineCommandRuns = Array.from({ length: 20 }, () => commandRun(100, 200));
  const activeCommandRuns = Array.from({ length: 20 }, () => commandRun(100, 200));
  const activeLog = [
    lines('persistence', 'active', Array(19).fill(10)),
    lines('restoration', 'active', Array(20).fill(10)),
  ].join('\n');

  const report = buildCheckpointPerformanceReport({ baselineCommandRuns, activeCommandRuns, activeLog });

  assert.equal(report.gates.persistence.passed, false);
  assert.equal(report.gates.persistence.reason, 'insufficient-samples');
  assert.equal(report.passed, false);
});
