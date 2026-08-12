// Orquestrador das duas coortes do gate H3.
//
// As duas coortes rodam em sequencia imediata no mesmo processo por uma razao
// medida em 2026-08-10: executadas com uma hora de intervalo na mesma maquina,
// produziram um delta de +6021 ms cuja causa era o host (swap em 2781 MB de 3072,
// load 5,58) e nao o software. A deriva do host tem o MESMO sinal do efeito
// procurado — o candidato roda depois, logo mede pior —, entao ela e
// indistinguivel de regressao por qualquer analise que so olhe os dois numeros.
// Por isso swap e load sao registrados nas pontas de cada coorte, dentro do
// artefato de evidencia.
import { execFile } from 'node:child_process';
import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { promisify } from 'node:util';

const executar = promisify(execFile);

export function attemptDirectory(root, sampleIndex, attempt) {
  return path.posix.join(root, String(sampleIndex).padStart(2, '0'), `tentativa-${attempt}`);
}

export function parseSwapUsage(text) {
  const numeros = String(text ?? '').match(
    /total\s*=\s*([\d.,]+)M\s+used\s*=\s*([\d.,]+)M\s+free\s*=\s*([\d.,]+)M/i,
  );
  if (!numeros) return null;
  const [totalMb, usedMb, freeMb] = numeros.slice(1, 4).map((valor) => Number(valor.replace(',', '.')));
  if ([totalMb, usedMb, freeMb].some((valor) => !Number.isFinite(valor))) return null;
  return { totalMb, usedMb, freeMb };
}

export function parseLoadAverage(text) {
  const numeros = String(text ?? '').match(/\{\s*([\d.,]+)\s+([\d.,]+)\s+([\d.,]+)\s*\}/);
  if (!numeros) return null;
  const [one, five, fifteen] = numeros.slice(1, 4).map((valor) => Number(valor.replace(',', '.')));
  if ([one, five, fifteen].some((valor) => !Number.isFinite(valor))) return null;
  return { one, five, fifteen };
}

export async function readHostTelemetry(run = executar) {
  const leia = async (chave) => {
    try {
      const { stdout } = await run('sysctl', [chave]);
      return stdout;
    } catch {
      return '';
    }
  };
  const [swap, load] = await Promise.all([leia('vm.swapusage'), leia('vm.loadavg')]);
  return { swap: parseSwapUsage(swap), load: parseLoadAverage(load) };
}

// Repetir a execucao que falhar e parte da receita: a corrida do dev menu
// reincide no meio de coorte quente, com os guards `SKIPPED` e a falha tres
// passos adiante numa assercao obrigatoria. Duas regras vem de erro medido — a
// tentativa perdida NAO pode ser sobrescrita (sem o log dela nao se afirma qual
// corrida foi), e a coorte falha fechada em vez de entregar amostra a menos,
// porque 19 amostras reprovam como `insufficient-samples`, que le como "faltou
// rodar" quando o que houve foi uma amostra que nunca converge.
export async function runCohort({ root, samples, maxAttempts = 3, execute, onAttempt }) {
  const attempts = [];
  let retries = 0;

  for (let sampleIndex = 1; sampleIndex <= samples; sampleIndex += 1) {
    let ok = false;
    for (let attempt = 1; attempt <= maxAttempts && !ok; attempt += 1) {
      const directory = attemptDirectory(root, sampleIndex, attempt);
      const resultado = await execute({ directory, sampleIndex, attempt });
      ok = resultado?.ok === true;
      attempts.push({ sampleIndex, attempt, directory, ok });
      onAttempt?.({ sampleIndex, attempt, directory, ok });
      if (!ok) retries += 1;
    }
    if (!ok) {
      throw new Error(
        `amostra ${sampleIndex} nao fechou em ${maxAttempts} tentativas; a coorte falha fechada`,
      );
    }
  }

  return { root, samples, validSamples: samples, retries, attempts };
}

function readArgument(name) {
  const index = process.argv.indexOf(name);
  return index >= 0 ? process.argv[index + 1] : undefined;
}

async function main() {
  const root = readArgument('--root');
  const flow = readArgument('--flow');
  const device = readArgument('--device');
  const samples = Number(readArgument('--samples') ?? 20);
  const maxAttempts = Number(readArgument('--max-attempts') ?? 3);
  if (!root || !flow) {
    throw new Error('uso: node scripts/checkpoint-cohort-runner.mjs --root <dir> --flow <yaml> [--device <udid>] [--samples 20]');
  }

  const inicio = await readHostTelemetry();
  await mkdir(root, { recursive: true });

  const resultado = await runCohort({
    root,
    samples,
    maxAttempts,
    execute: async ({ directory }) => {
      await mkdir(directory, { recursive: true });
      const argumentos = device ? ['--device', device] : [];
      try {
        await executar('maestro', [...argumentos, 'test', flow, '--test-output-dir', directory], {
          maxBuffer: 64 * 1024 * 1024,
        });
        return { ok: true };
      } catch {
        return { ok: false };
      }
    },
    onAttempt: ({ sampleIndex, attempt, ok }) => {
      process.stdout.write(`amostra ${sampleIndex} tentativa ${attempt}: ${ok ? 'ok' : 'repetir'}\n`);
    },
  });

  const fim = await readHostTelemetry();
  const manifesto = { schemaVersion: 1, flow, device: device ?? null, host: { inicio, fim }, ...resultado };
  await writeFile(path.join(root, 'cohort-manifest.json'), `${JSON.stringify(manifesto, null, 2)}\n`, 'utf8');
  process.stdout.write(`coorte fechada: ${resultado.validSamples} amostras, ${resultado.retries} retentativas\n`);
}

if (process.argv[1] && process.argv[1].endsWith('checkpoint-cohort-runner.mjs')) {
  main().catch((error) => {
    process.stderr.write(`${error instanceof Error ? error.message : String(error)}\n`);
    process.exitCode = 1;
  });
}
