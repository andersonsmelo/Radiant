import assert from 'node:assert/strict';
import { test } from 'node:test';

import {
  attemptDirectory,
  parseLoadAverage,
  parseSwapUsage,
  runCohort,
} from './checkpoint-cohort-runner.mjs';

test('attemptDirectory numera a amostra com dois digitos e a tentativa a partir de 1', () => {
  assert.equal(attemptDirectory('.maestro/artifacts/h3/baseline', 1, 1), '.maestro/artifacts/h3/baseline/01/tentativa-1');
  assert.equal(attemptDirectory('.maestro/artifacts/h3/baseline', 20, 3), '.maestro/artifacts/h3/baseline/20/tentativa-3');
});

test('runCohort entrega uma tentativa por amostra quando nenhuma falha', async () => {
  const executadas = [];
  const resultado = await runCohort({
    root: 'raiz',
    samples: 3,
    maxAttempts: 3,
    execute: async ({ directory }) => {
      executadas.push(directory);
      return { ok: true };
    },
  });

  assert.deepEqual(executadas, ['raiz/01/tentativa-1', 'raiz/02/tentativa-1', 'raiz/03/tentativa-1']);
  assert.equal(resultado.validSamples, 3);
  assert.equal(resultado.retries, 0);
});

// A corrida do dev menu reincide no meio de coorte quente, entao repetir e parte
// da receita — mas o caminho da tentativa perdida nao pode ser reusado. Em
// 2026-08-10 o runner gravava todas as tentativas no mesmo arquivo e apagava o
// diretorio antes de repetir: a assinatura da falha desapareceu e nao foi
// possivel afirmar se era aquela corrida ou outra coisa.
test('runCohort repete numa tentativa nova, sem reusar o caminho da que falhou', async () => {
  const executadas = [];
  const resultado = await runCohort({
    root: 'raiz',
    samples: 2,
    maxAttempts: 3,
    execute: async ({ directory }) => {
      executadas.push(directory);
      return { ok: directory !== 'raiz/01/tentativa-1' };
    },
  });

  assert.deepEqual(executadas, [
    'raiz/01/tentativa-1',
    'raiz/01/tentativa-2',
    'raiz/02/tentativa-1',
  ]);
  assert.equal(resultado.validSamples, 2);
  assert.equal(resultado.retries, 1);
  assert.deepEqual(
    resultado.attempts.filter((tentativa) => !tentativa.ok).map((tentativa) => tentativa.directory),
    ['raiz/01/tentativa-1'],
  );
});

// Falha fechada. Entregar 19 amostras porque a vigesima nao fechou e o modo de
// falha mais caro deste gate: o relatorio reprova por `insufficient-samples`, que
// le como "faltou rodar" e manda repetir a janela inteira, quando o que houve foi
// uma amostra que nunca converge.
test('runCohort falha fechado quando uma amostra esgota as tentativas', async () => {
  await assert.rejects(
    runCohort({
      root: 'raiz',
      samples: 2,
      maxAttempts: 2,
      execute: async ({ sampleIndex }) => ({ ok: sampleIndex !== 2 }),
    }),
    /amostra 2/i,
  );
});

test('runCohort registra a contagem de tentativas de cada amostra', async () => {
  const resultado = await runCohort({
    root: 'raiz',
    samples: 1,
    maxAttempts: 4,
    execute: async ({ attempt }) => ({ ok: attempt === 3 }),
  });

  assert.equal(resultado.retries, 2);
  assert.equal(resultado.attempts.length, 3);
  assert.deepEqual(resultado.attempts.map((tentativa) => tentativa.attempt), [1, 2, 3]);
});

// Toda politica de retentativa carrega uma premissa nao escrita: que a falha
// TERMINA. Medido em 2026-08-12, na coorte `active`: o maestro registrou a falha
// no proprio log, comecou a captura de diagnostico e ficou dez minutos parado,
// com processo vivo e 0% de CPU. Como o orquestrador espera o filho encerrar
// para decidir se repete, a retentativa nunca foi consultada — a coorte inteira
// parou numa amostra, sem sinal de erro. O timeout e o que torna a retentativa
// alcancavel.
test('runCohort trata a tentativa que nao termina como falha e repete', async () => {
  const resultado = await runCohort({
    root: 'raiz',
    samples: 1,
    maxAttempts: 3,
    attemptTimeoutMs: 20,
    execute: async ({ attempt }) => {
      if (attempt === 1) return new Promise(() => {});
      return { ok: true };
    },
  });

  assert.equal(resultado.validSamples, 1);
  assert.equal(resultado.retries, 1);
  assert.equal(resultado.attempts[0].ok, false);
  assert.equal(resultado.attempts[0].reason, 'timeout');
});

// Ferramenta pendurada e produto defeituoso pedem acoes opostas, entao o motivo
// entra no registro: sem ele, o manifesto diz "repetiu" e nao diz por que.
test('runCohort distingue o motivo de cada tentativa', async () => {
  const resultado = await runCohort({
    root: 'raiz',
    samples: 1,
    maxAttempts: 3,
    attemptTimeoutMs: 50,
    execute: async ({ attempt }) => (attempt === 1 ? { ok: false } : { ok: true }),
  });

  assert.deepEqual(resultado.attempts.map((t) => t.reason), ['failed', 'ok']);
  assert.equal(resultado.timeouts, 0);
});

test('runCohort conta os estouros de tempo separadamente das falhas', async () => {
  const resultado = await runCohort({
    root: 'raiz',
    samples: 1,
    maxAttempts: 4,
    attemptTimeoutMs: 20,
    execute: async ({ attempt }) => {
      if (attempt === 1) return new Promise(() => {});
      if (attempt === 2) return { ok: false };
      return { ok: true };
    },
  });

  assert.equal(resultado.timeouts, 1);
  assert.equal(resultado.retries, 2);
});

// A deriva do host tem o MESMO sinal do efeito procurado — o candidato roda
// depois, logo mede pior —, entao ela e indistinguivel de regressao por qualquer
// analise que so olhe os dois numeros. Registrar swap e load nas pontas de cada
// coorte e o que permite separar as duas explicacoes depois.
test('parseSwapUsage extrai os megabytes do formato do sysctl', () => {
  const lido = parseSwapUsage('vm.swapusage: total = 3072,00M  used = 2781,50M  free = 290,50M  (encrypted)');

  assert.deepEqual(lido, { totalMb: 3072, usedMb: 2781.5, freeMb: 290.5 });
});

test('parseSwapUsage aceita o separador decimal por ponto', () => {
  const lido = parseSwapUsage('vm.swapusage: total = 1024.00M  used = 0.00M  free = 1024.00M');

  assert.deepEqual(lido, { totalMb: 1024, usedMb: 0, freeMb: 1024 });
});

test('parseSwapUsage devolve nulo quando a saida nao tem o formato esperado', () => {
  assert.equal(parseSwapUsage(''), null);
  assert.equal(parseSwapUsage('vm.swapusage: indisponivel'), null);
});

test('parseLoadAverage extrai as tres janelas', () => {
  assert.deepEqual(parseLoadAverage('vm.loadavg: { 5.58 4.12 3.90 }'), { one: 5.58, five: 4.12, fifteen: 3.9 });
});

test('parseLoadAverage devolve nulo quando a saida nao tem o formato esperado', () => {
  assert.equal(parseLoadAverage('vm.loadavg: {}'), null);
  assert.equal(parseLoadAverage(''), null);
});
