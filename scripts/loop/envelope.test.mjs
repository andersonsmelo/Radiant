import assert from 'node:assert/strict';
import test from 'node:test';
import { parseEnvelope, assertCode } from './envelope.mjs';

test('extrai code e runId do envelope', () => {
  const env = parseEnvelope('{"code":"RUN_CREATED","runId":"run-1","ok":true}');
  assert.equal(env.code, 'RUN_CREATED');
  assert.equal(env.runId, 'run-1');
});

test('runId ausente vira null em vez de undefined', () => {
  assert.equal(parseEnvelope('{"code":"STEP_STARTED"}').runId, null);
});

test('assertCode lanca quando o codigo diverge', () => {
  const env = parseEnvelope('{"code":"MEMORY_EVIDENCE_INVALID"}');
  assert.throws(() => assertCode(env, 'MEMORY_WRITTEN'), /MEMORY_EVIDENCE_INVALID/);
});

test('assertCode passa quando o codigo confere', () => {
  assert.doesNotThrow(() => assertCode(parseEnvelope('{"code":"RUN_CLOSED"}'), 'RUN_CLOSED'));
});

test('saida que nao e JSON vira erro legivel, nao stack trace', () => {
  assert.throws(() => parseEnvelope('command not found'), /envelope ilegivel/);
});
