// Coletor de envelopes de performance do H3.
//
// Existe porque a receita do gate (radiant-app/docs/E2E_RUNBOOK.md, secao
// "Gate H3") prescrevia este canal em prosa e o repositorio nao tinha o
// instrumento: a sessao de 2026-08-10 o construiu de forma efemera, produziu a
// evidencia e o perdeu junto com a sessao. Prosa que descreve um instrumento nao
// e o instrumento — e como os artefatos sobrevivem enquanto ele nao, a medicao
// parece reprodutivel para quem inspeciona o resultado.
//
// Por que CDP e nao o terminal do Metro: neste Dev Client bridgeless nenhuma
// saida de `console` do app chega ao terminal do Metro, e o log do sistema do
// simulador tambem nao a carrega — o runtime roteia console para o canal de
// depuracao. Preservar o log do Metro colhia arquivo vazio, e o parser reportava
// isso como amostra insuficiente, que le como "faltou rodar" em vez de "o canal
// esta quebrado".
import { appendFile, writeFile } from 'node:fs/promises';
import { setTimeout as sleep } from 'node:timers/promises';

export const CHECKPOINT_PERFORMANCE_PREFIX = 'RADIANT_CHECKPOINT_PERF ';

// O controle positivo precisa provar o canal SEM poder virar amostra, e essa
// combinacao nao e teorica: medida em 2026-08-12, a linha de controle injetada
// numa sessao reapareceu no arquivo de uma sessao seguinte, reentregue pelo
// buffer do alvo assim que o novo `Runtime.enable` chegou. A instrucao antiga
// ("descarte o arquivo de controle") nao protege — ela descarta o arquivo, e a
// linha mora no buffer do CDP, nao no arquivo.
//
// Com `metric: 'positive-control'` a linha continua provando o canal, porque o
// coletor filtra so pelo prefixo, e o parser do relatorio a ignora, porque a
// metrica nao esta na lista dele. Uma linha de `first_frame` com `durationMs: 0`
// faria o oposto do que o controle promete: entraria na coorte, deprimiria o p50
// do baseline e portanto INFLARIA o piso de ruido, que e exatamente a forma de
// passe vazio que o gate existe para recusar.
export const POSITIVE_CONTROL_METRIC = 'positive-control';

export function positiveControlLine() {
  return `${CHECKPOINT_PERFORMANCE_PREFIX}${JSON.stringify({
    schemaVersion: 1,
    metric: POSITIVE_CONTROL_METRIC,
    mode: 'off',
    durationMs: 0,
  })}`;
}

const RECONNECT_DELAY_MS = 250;

// O `/json/list` deste Dev Client devolve mais de um alvo, e o depreciado tambem
// aceita conexao — conectar nele nao da erro, da silencio. Escolher pelo rotulo
// e nao pela posicao e o que separa "o app nao emitiu" de "conectei no alvo
// errado", duas leituras com remedios opostos.
export function selectDebuggerTarget(targets) {
  const conectaveis = (Array.isArray(targets) ? targets : []).filter(
    (target) => typeof target?.webSocketDebuggerUrl === 'string' && target.webSocketDebuggerUrl.length > 0,
  );
  if (conectaveis.length === 0) {
    throw new Error('nenhum alvo de depuracao conectavel em /json/list');
  }
  const rotulado = conectaveis.find((target) => (
    /bridgeless/i.test(`${target.title ?? ''} ${target.description ?? ''}`)
  ));
  const preferido = rotulado ?? conectaveis.find((target) => (
    !/deprecated/i.test(`${target.title ?? ''} ${target.description ?? ''}`)
  ));
  return (preferido ?? conectaveis[0]).webSocketDebuggerUrl;
}

export function consoleTextFrom(params) {
  const args = Array.isArray(params?.args) ? params.args : [];
  return args
    .map((argument) => (typeof argument?.value === 'string' ? argument.value : null))
    .filter((valor) => valor !== null)
    .join(' ');
}

// A deduplicacao e por (instante, texto) porque a contaminacao observada e a
// REENTREGA da mesma linha: cada `Runtime.enable` reentrega o buffer do alvo, e o
// coletor reconecta a cada killApp/launchApp do flow. Deduplicar por texto
// sozinho engoliria medida legitima — duas amostras da mesma metrica com a mesma
// duracao sao normais numa coorte de 20.
//
// Filtrar por modo seria mais simples e esta deliberadamente fora: o gate
// `baseline_isolation` do relatorio reprova quando uma metrica de checkpoint
// aparece num log de baseline, e um coletor que descartasse essas linhas calaria
// o sinal em vez de deixa-lo reprovar.
// O piso temporal e a segunda defesa, e ela cobre o que a deduplicacao nao
// alcanca: dedup e por processo, entao a reentrega de uma linha de MINUTOS antes
// — de um lancamento anterior, ou do proprio controle positivo — passa limpa por
// um coletor recem-criado. Medido em 2026-08-12: um coletor novo recebeu, no
// `Runtime.enable`, tres envelopes reais com 110 s de idade. `timestamp` do
// `Runtime.consoleAPICalled` e epoch em milissegundos, entao "emitido antes de eu
// existir" e uma pergunta que se responde.
//
// Nao ha perda: numa coorte o coletor sobe antes do primeiro `launchApp`, logo
// toda amostra da coorte e posterior ao piso. O que ele descarta e exatamente o
// que nao pertence a coorte.
export function createEnvelopeCollector({
  prefix = CHECKPOINT_PERFORMANCE_PREFIX,
  since = Date.now(),
} = {}) {
  const vistos = new Set();
  return {
    accept(params) {
      const texto = consoleTextFrom(params);
      if (!texto.includes(prefix)) return null;
      const instante = params?.timestamp;
      if (Number.isFinite(instante) && instante < since) return null;
      const chave = `${instante ?? ''}|${texto}`;
      if (vistos.has(chave)) return null;
      vistos.add(chave);
      return texto;
    },
  };
}

async function resolveTarget(inspectorUrl) {
  const resposta = await fetch(new URL('/json/list', inspectorUrl));
  if (!resposta.ok) throw new Error(`/json/list respondeu ${resposta.status}`);
  return selectDebuggerTarget(await resposta.json());
}

// Uma sessao de inspector, do connect ao close. Resolve quando o alvo cai — o que
// e o caso normal, porque o flow mata e relanca o app a cada amostra.
function inspectSession({ webSocketDebuggerUrl, onLine, onOpen, signal }) {
  return new Promise((resolve, reject) => {
    // `WebSocket` global existe a partir do Node 22; a referencia fica DENTRO da
    // funcao de proposito, para que os validadores (que rodam Node 20) consigam
    // importar este modulo e exercitar as funcoes puras acima.
    const socket = new WebSocket(webSocketDebuggerUrl);
    let identificador = 0;

    // Sem isto o `abort` nunca chega ao socket: o laco de coleta fica preso nesta
    // promessa ate o alvo cair sozinho, e um `--control` de 5 s vira um processo
    // que nao termina. Achado ao provar o canal ao vivo, que e a unica coisa que
    // exercita este caminho — as funcoes puras acima nao o tocam.
    signal?.addEventListener('abort', () => socket.close(), { once: true });

    socket.addEventListener('open', () => {
      socket.send(JSON.stringify({ id: ++identificador, method: 'Runtime.enable' }));
      onOpen?.((expressao) => {
        socket.send(JSON.stringify({
          id: ++identificador,
          method: 'Runtime.evaluate',
          params: { expression: expressao },
        }));
      });
    });

    socket.addEventListener('message', (evento) => {
      let mensagem;
      try {
        mensagem = JSON.parse(typeof evento.data === 'string' ? evento.data : '');
      } catch {
        return;
      }
      if (mensagem?.method !== 'Runtime.consoleAPICalled') return;
      onLine(mensagem.params);
    });

    socket.addEventListener('close', () => resolve());
    socket.addEventListener('error', (evento) => {
      // Alvo caiu junto com o app: e o ciclo normal da coorte, nao falha.
      if (socket.readyState === WebSocket.CLOSED) resolve();
      else reject(evento?.error ?? new Error('falha na sessao do inspector'));
    });
  });
}

export async function collect({ inspectorUrl, outputPath, signal, onOpen }) {
  const coletor = createEnvelopeCollector();
  let escritas = 0;

  while (!signal?.aborted) {
    let webSocketDebuggerUrl;
    try {
      webSocketDebuggerUrl = await resolveTarget(inspectorUrl);
    } catch {
      // O alvo some entre o killApp e o launchApp seguinte; reconectar e o
      // comportamento correto, nao um erro a reportar.
      await sleep(RECONNECT_DELAY_MS);
      continue;
    }

    try {
      await inspectSession({
        webSocketDebuggerUrl,
        onOpen,
        signal,
        onLine: (params) => {
          const linha = coletor.accept(params);
          if (linha === null) return;
          escritas += 1;
          void appendFile(outputPath, `${linha}\n`, 'utf8');
        },
      });
    } catch {
      // idem: qualquer queda de sessao volta para a resolucao de alvo.
    }
    await sleep(RECONNECT_DELAY_MS);
  }

  return { escritas };
}

function readArgument(name) {
  const index = process.argv.indexOf(name);
  return index >= 0 ? process.argv[index + 1] : undefined;
}

async function main() {
  const inspectorUrl = readArgument('--inspector') ?? 'http://localhost:8081';
  const outputPath = readArgument('--output');
  const control = process.argv.includes('--control');
  if (!outputPath) {
    throw new Error('uso: node scripts/checkpoint-cdp-collector.mjs --output <arquivo> [--inspector <url>] [--control]');
  }

  const controller = new AbortController();
  for (const sinal of ['SIGINT', 'SIGTERM']) {
    process.on(sinal, () => controller.abort());
  }

  // Controle positivo: sem ele, ausencia de amostra e ambigua entre emissor e
  // canal, e essa ambiguidade custou o diagnostico inteiro de 2026-08-10. O
  // arquivo de controle e proprio e descartavel — nunca o da coorte.
  if (control) {
    await writeFile(outputPath, '', 'utf8');
    const timer = setTimeout(() => controller.abort(), 5000);
    await collect({
      inspectorUrl,
      outputPath,
      signal: controller.signal,
      onOpen: (evaluate) => evaluate(`console.info(${JSON.stringify(positiveControlLine())})`),
    });
    clearTimeout(timer);
    return;
  }

  await collect({ inspectorUrl, outputPath, signal: controller.signal });
}

if (process.argv[1] && process.argv[1].endsWith('checkpoint-cdp-collector.mjs')) {
  main().catch((error) => {
    process.stderr.write(`${error instanceof Error ? error.message : String(error)}\n`);
    process.exitCode = 1;
  });
}
