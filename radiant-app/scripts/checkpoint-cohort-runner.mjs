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
// O limite por tentativa e o par obrigatorio da politica de retentativa, e ele
// existe por medicao: em 2026-08-12 o maestro falhou, registrou a falha e NAO
// saiu — dez minutos de processo vivo a 0% de CPU. Esperar o filho encerrar para
// decidir se repete significa que uma ferramenta pendurada nunca chega a ser
// repetida; a coorte para numa amostra, sem sinal de erro. O default e ~3x a
// tentativa mais lenta observada (as amostras de `active` levaram ~2,5 min, com
// dois lancamentos cada).
const DEFAULT_ATTEMPT_TIMEOUT_MS = 600_000;

const ESTOUROU = Symbol('tentativa-estourou');

async function comLimite(promessa, attemptTimeoutMs) {
  if (!Number.isFinite(attemptTimeoutMs) || attemptTimeoutMs <= 0) {
    return { resultado: await promessa, estourou: false };
  }
  let timer;
  const limite = new Promise((resolve) => {
    timer = setTimeout(() => resolve(ESTOUROU), attemptTimeoutMs);
  });
  const vencedor = await Promise.race([promessa, limite]);
  clearTimeout(timer);
  return vencedor === ESTOUROU
    ? { resultado: undefined, estourou: true }
    : { resultado: vencedor, estourou: false };
}

export async function runCohort({
  root,
  samples,
  maxAttempts = 3,
  attemptTimeoutMs = DEFAULT_ATTEMPT_TIMEOUT_MS,
  execute,
  onAttempt,
}) {
  const attempts = [];
  let retries = 0;
  let timeouts = 0;

  for (let sampleIndex = 1; sampleIndex <= samples; sampleIndex += 1) {
    let ok = false;
    for (let attempt = 1; attempt <= maxAttempts && !ok; attempt += 1) {
      const directory = attemptDirectory(root, sampleIndex, attempt);
      const { resultado, estourou } = await comLimite(
        Promise.resolve().then(() => execute({ directory, sampleIndex, attempt })),
        attemptTimeoutMs,
      );
      ok = !estourou && resultado?.ok === true;
      // Ferramenta pendurada e produto defeituoso pedem acoes opostas, entao o
      // motivo entra no registro em vez de virar so mais uma retentativa.
      const reason = estourou ? 'timeout' : (ok ? 'ok' : 'failed');
      attempts.push({ sampleIndex, attempt, directory, ok, reason });
      onAttempt?.({ sampleIndex, attempt, directory, ok, reason });
      if (estourou) timeouts += 1;
      if (!ok) retries += 1;
    }
    if (!ok) {
      throw new Error(
        `amostra ${sampleIndex} nao fechou em ${maxAttempts} tentativas; a coorte falha fechada`,
      );
    }
  }

  return { root, samples, validSamples: samples, retries, timeouts, attempts };
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
  const attemptTimeoutMs = Number(readArgument('--attempt-timeout-ms') ?? DEFAULT_ATTEMPT_TIMEOUT_MS);
  if (!root || !flow) {
    throw new Error('uso: node scripts/checkpoint-cohort-runner.mjs --root <dir> --flow <yaml> [--device <udid>] [--samples 20]');
  }

  const inicio = await readHostTelemetry();
  await mkdir(root, { recursive: true });

  const resultado = await runCohort({
    root,
    samples,
    maxAttempts,
    attemptTimeoutMs,
    execute: async ({ directory }) => {
      await mkdir(directory, { recursive: true });
      const argumentos = device ? ['--device', device] : [];
      try {
        // O limite tambem vai para o `execFile`: o `Promise.race` do orquestrador
        // libera a coorte, mas so isto MATA o processo pendurado — sem ele o
        // maestro fica vivo segurando o simulador da amostra seguinte.
        await executar('maestro', [...argumentos, 'test', flow, '--test-output-dir', directory], {
          maxBuffer: 64 * 1024 * 1024,
          timeout: attemptTimeoutMs,
          killSignal: 'SIGKILL',
        });
        return { ok: true };
      } catch {
        return { ok: false };
      }
    },
    onAttempt: ({ sampleIndex, attempt, ok, reason }) => {
      process.stdout.write(`amostra ${sampleIndex} tentativa ${attempt}: ${ok ? 'ok' : reason}\n`);
    },
  });

  const fim = await readHostTelemetry();
  const manifesto = { schemaVersion: 1, flow, device: device ?? null, attemptTimeoutMs, host: { inicio, fim }, ...resultado };
  await writeFile(path.join(root, 'cohort-manifest.json'), `${JSON.stringify(manifesto, null, 2)}\n`, 'utf8');
  process.stdout.write(`coorte fechada: ${resultado.validSamples} amostras, ${resultado.retries} retentativas, ${resultado.timeouts} estouros\n`);
}

if (process.argv[1] && process.argv[1].endsWith('checkpoint-cohort-runner.mjs')) {
  main().catch((error) => {
    process.stderr.write(`${error instanceof Error ? error.message : String(error)}\n`);
    process.exitCode = 1;
  });
}
