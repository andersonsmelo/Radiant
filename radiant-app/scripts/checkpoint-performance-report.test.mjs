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

// Monta uma coorte de 20 amostras com p50 e p95 exatos, porque o gate de delta
// deriva o piso de ruido de `p95 - p50` e os casos abaixo precisam reproduzir
// razoes de ruido medidas, nao aproximadas. Com 20 valores ordenados o p50 e o
// indice 10 e o p95 e o indice 18, entao 11 valores no piso e o 19o no p95
// fixam as duas estatisticas de uma vez.
function coortePorPercentis({ p50, p95, tail = p95 + 50 }) {
  const meio = Math.round((p50 + p95) / 2);
  return [...Array(11).fill(p50), ...Array(7).fill(meio), p95, tail];
}

// A partir de 2026-08-10 o relatorio le tambem o log do BASELINE, porque a marca
// de primeiro frame e emitida nos dois modos. Toda fixtura de run completo passa a
// declarar as duas coortes de `first_frame`: sem elas o run esta incompleto, e o
// gate reprova por amostra insuficiente com razao.
function firstFrameLogs(baselineMs, activeMs, count = 20) {
  return {
    baselineLog: phasedFirstFrameLines('off', 'cold', Array(count).fill(baselineMs)),
    activeLog: [
      phasedFirstFrameLines('active', 'cold', Array(count).fill(activeMs)),
      phasedFirstFrameLines('active', 'resume', Array(count).fill(activeMs / 2)),
    ].join('\n'),
  };
}

function phasedFirstFrameLines(mode, launchPhase, values) {
  return values.map((durationMs) => (
    `LOG ${prefix}${JSON.stringify({ schemaVersion: 2, metric: 'first_frame', mode, launchPhase, durationMs })}`
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

  const primeiroFrame = firstFrameLogs(800, 820);
  const report = buildCheckpointPerformanceReport({
    baselineCommandRuns,
    activeCommandRuns,
    activeLog: [activeLog, primeiroFrame.activeLog].join('\n'),
    baselineLog: primeiroFrame.baselineLog,
  });

  assert.equal(report.summary.baseline.cold_start.p95Ms, 118);
  assert.equal(report.summary.active.persistence.p95Ms, 48);
  assert.equal(report.summary.active.restoration.p95Ms, 68);
  assert.equal(report.gates.persistence.passed, true);
  assert.equal(report.gates.restoration.passed, true);
  assert.equal(report.gates.cold_start_delta.passed, true);
  assert.equal(report.gates.home_to_lesson_delta.passed, true);
  assert.equal(report.passed, true);
  assert.equal(report.outcome, 'pass');
});

// A coorte active relança o app para provar retomada offline. O segundo launch
// e legitimamente mais rápido, mas não pertence à mesma população da partida
// fria do baseline. Misturá-lo faria o p95 do candidato parecer melhor sem que
// o kernel fosse mais rápido. Esta guarda deve falhar se o relatório voltar a
// aceitar envelopes sem proveniência ou a agregar `resume` em `cold`.
test('uses only cold first frames for the delta while requiring one resume per active sample', () => {
  const baselineCommandRuns = Array.from({ length: 20 }, () => commandRun(3000, 200));
  const activeCommandRuns = Array.from({ length: 20 }, () => commandRun(3000, 200));
  const activeLog = [
    lines('persistence', 'active', Array(20).fill(10)),
    lines('restoration', 'active', Array(20).fill(10)),
    phasedFirstFrameLines('active', 'cold', Array(20).fill(820)),
    phasedFirstFrameLines('active', 'resume', Array(20).fill(400)),
  ].join('\n');

  const report = buildCheckpointPerformanceReport({
    baselineCommandRuns,
    activeCommandRuns,
    activeLog,
    baselineLog: phasedFirstFrameLines('off', 'cold', Array(20).fill(800)),
  });

  assert.equal(report.summary.active.first_frame.count, 20);
  assert.equal(report.summary.active.first_frame.p95Ms, 820);
  assert.equal(report.gates.first_frame_population.outcome, 'pass');
  assert.equal(report.gates.first_frame_delta.deltaMs, 20);
  assert.equal(report.gates.first_frame_delta.outcome, 'pass');
});

test('fails closed when an active cold cohort has no matching recovery provenance', () => {
  const baselineCommandRuns = Array.from({ length: 20 }, () => commandRun(3000, 200));
  const activeCommandRuns = Array.from({ length: 20 }, () => commandRun(3000, 200));
  const report = buildCheckpointPerformanceReport({
    baselineCommandRuns,
    activeCommandRuns,
    activeLog: [
      lines('persistence', 'active', Array(20).fill(10)),
      lines('restoration', 'active', Array(20).fill(10)),
      phasedFirstFrameLines('active', 'cold', Array(20).fill(820)),
    ].join('\n'),
    baselineLog: phasedFirstFrameLines('off', 'cold', Array(20).fill(800)),
  });

  assert.equal(report.gates.first_frame_population.reason, 'active-resume-count-mismatch');
  assert.equal(report.gates.first_frame_population.outcome, 'inconclusive');
  assert.equal(report.passed, false);
  assert.equal(report.outcome, 'inconclusive');
});

test('fails closed when a cohort has fewer than twenty valid samples', () => {
  const baselineCommandRuns = Array.from({ length: 20 }, () => commandRun(100, 200));
  const activeCommandRuns = Array.from({ length: 20 }, () => commandRun(100, 200));
  const activeLog = [
    lines('persistence', 'active', Array(19).fill(10)),
    lines('restoration', 'active', Array(20).fill(10)),
  ].join('\n');

  const primeiroFrame = firstFrameLogs(800, 820);
  const report = buildCheckpointPerformanceReport({
    baselineCommandRuns,
    activeCommandRuns,
    activeLog: [activeLog, primeiroFrame.activeLog].join('\n'),
    baselineLog: primeiroFrame.baselineLog,
  });

  assert.equal(report.gates.persistence.passed, false);
  assert.equal(report.gates.persistence.reason, 'insufficient-samples');
  assert.equal(report.passed, false);
  // Amostra insuficiente e o outro jeito de nao ter medido, entao pertence ao
  // mesmo desfecho: `fail` fica reservado para o candidato que regrediu de fato.
  assert.equal(report.gates.persistence.outcome, 'inconclusive');
  assert.equal(report.outcome, 'inconclusive');
});

// Medido em 2026-08-10, na primeira execucao real do gate: a amplitude interna
// do cold start foi 838 ms no baseline e 833 ms no candidato, enquanto o limite
// derivado de 5% do p95 era 167,6 ms. Um limiar cinco vezes menor que a
// dispersao da propria medida reprova por ruido, independentemente da mudanca
// sob teste. O piso passa a incluir a cauda superior medida do baseline
// (p95 - p50), entao o gate nunca exige resolucao que o instrumento nao tem.
// A fixture deste caso foi trocada em 2026-08-10, junto do desfecho
// `inconclusive`, e a troca merece registro porque nao e cosmetica. Ela usava
// baseline p50=1000/p95=1400, ou seja um piso de ruido de 400 ms sobre 1400 ms —
// razao de 28,6%, acima do teto de 20%. Escrita antes de o teto existir, ela
// afirmava que uma medicao nesse nivel de ruido **aprova**, que e exatamente o
// passe vazio que o teto passou a recusar. Manter os numeros antigos exigiria
// isentar este caso da regra nova, o que anularia a regra.
//
// O que o caso protege continua identico: quando a cauda medida do baseline
// supera os dois termos originais, e ela que manda. A fixture nova apenas fica
// dentro da faixa em que a medicao ainda conclui — piso de 600 ms sobre um
// baseline de 4000 ms, razao de 15%, contra um teto de 800 ms.
test('never demands a delta finer than the baseline own upper-tail spread', () => {
  const baselineCommandRuns = coortePorPercentis({ p50: 3400, p95: 4000 })
    .map((coldStart) => commandRun(coldStart, 200));
  const activeCommandRuns = coortePorPercentis({ p50: 4100, p95: 4300 })
    .map((coldStart) => commandRun(coldStart, 200));
  const activeLog = [
    lines('persistence', 'active', Array(20).fill(10)),
    lines('restoration', 'active', Array(20).fill(10)),
  ].join('\n');

  const primeiroFrame = firstFrameLogs(800, 820);
  const report = buildCheckpointPerformanceReport({
    baselineCommandRuns,
    activeCommandRuns,
    activeLog: [activeLog, primeiroFrame.activeLog].join('\n'),
    baselineLog: primeiroFrame.baselineLog,
  });
  const gate = report.gates.cold_start_delta;

  assert.equal(gate.baselineP50Ms, 3400);
  assert.equal(gate.baselineP95Ms, 4000);
  assert.equal(gate.deltaMs, 300);
  // 5% de 4000 sao 200 ms, e o piso fixo sao 50 ms: os dois ficam abaixo dos
  // 600 ms de cauda medida, que e o termo que deve mandar. Sem ele, 300 ms de
  // delta reprovariam contra 200 ms.
  assert.equal(gate.noiseFloorMs, 600);
  assert.equal(gate.allowedDeltaMs, 600);
  // E a medicao ainda conclui: 600 ms cabem no teto de 800 ms.
  assert.equal(gate.maxNoiseFloorMs, 800);
  assert.equal(gate.outcome, 'pass');
  assert.equal(gate.passed, true);
});

test('keeps the stricter fixed floor when the baseline is quiet', () => {
  const baselineCommandRuns = Array.from({ length: 20 }, () => commandRun(1000, 200));
  const activeCommandRuns = Array.from({ length: 20 }, () => commandRun(1060, 200));
  const activeLog = [
    lines('persistence', 'active', Array(20).fill(10)),
    lines('restoration', 'active', Array(20).fill(10)),
  ].join('\n');

  const primeiroFrame = firstFrameLogs(800, 820);
  const report = buildCheckpointPerformanceReport({
    baselineCommandRuns,
    activeCommandRuns,
    activeLog: [activeLog, primeiroFrame.activeLog].join('\n'),
    baselineLog: primeiroFrame.baselineLog,
  });
  const gate = report.gates.cold_start_delta;

  // Baseline sem dispersao: a cauda medida e zero, entao quem manda e o maior
  // entre 5% de 1000 (50 ms) e o piso fixo de 50 ms. 60 ms de delta reprova.
  assert.equal(gate.noiseFloorMs, 0);
  assert.equal(gate.allowedDeltaMs, 50);
  assert.equal(gate.deltaMs, 60);
  assert.equal(gate.passed, false);
  // Reprovacao medida e um desfecho diferente de medicao impossivel: aqui o
  // instrumento tinha resolucao e o candidato excedeu o limite.
  assert.equal(gate.outcome, 'fail');
  // O veredito nao segue mais este gate — ver a nota no caso do piso dominante. A
  // reprovacao medida do `first_frame` tem caso proprio.
  assert.equal(gate.advisory, true);
  assert.equal(report.outcome, 'pass');
});

// Medido em 2026-08-10, na terceira passagem do gate: o piso de ruido do cold
// start foi 2863 ms contra um p95 de baseline de 5748 ms — metade da propria
// medida —, porque o host estava em swap. O relatorio fechou em `passed: true`,
// e esse verde nao distingue regressao de flutuacao: um limite que tolera 2,9 s
// apenas declara que a medicao nao tem resolucao. O limiar consciente de ruido,
// que entrou horas antes, eliminou o falso-negativo e trocou-o por um passe
// vazio, que e mais perigoso porque tem cara de aprovacao.
//
// Por isso o gate ganha um terceiro desfecho. O teto do piso de ruido e um
// quinto do p95 do baseline, ou seja quatro vezes a sensibilidade de 5% que o
// desenho original pedia. Acima disso "dentro do limite" tolera um quinto da
// metrica inteira e nao carrega informacao. As quatro razoes medidas em
// 2026-08-10 separam bem: 0,108 na passagem de host ocioso, 0,246 na passagem
// que foi descartada por metodo, 0,498 na do host em swap, e 0,053/0,073 nos
// deltas de Home->Licao das tres. O teto de 0,2 marca as duas passagens que o
// julgamento humano ja havia rejeitado e preserva a unica que serviu.
test('reports inconclusive instead of an empty pass when the noise floor dominates the baseline', () => {
  const baselineCommandRuns = coortePorPercentis({ p50: 2885, p95: 5748 })
    .map((coldStart) => commandRun(coldStart, 200));
  const activeCommandRuns = coortePorPercentis({ p50: 6000, p95: 6666 })
    .map((coldStart) => commandRun(coldStart, 200));
  const activeLog = [
    lines('persistence', 'active', Array(20).fill(10)),
    lines('restoration', 'active', Array(20).fill(10)),
  ].join('\n');

  const primeiroFrame = firstFrameLogs(800, 820);
  const report = buildCheckpointPerformanceReport({
    baselineCommandRuns,
    activeCommandRuns,
    activeLog: [activeLog, primeiroFrame.activeLog].join('\n'),
    baselineLog: primeiroFrame.baselineLog,
  });
  const gate = report.gates.cold_start_delta;

  assert.equal(gate.baselineP50Ms, 2885);
  assert.equal(gate.baselineP95Ms, 5748);
  assert.equal(gate.noiseFloorMs, 2863);
  assert.equal(gate.maxNoiseFloorMs, 1149.6);
  // O delta cabe folgado no limite permitido, e e exatamente esse conforto que
  // nao pode ser lido como aprovacao.
  assert.equal(gate.deltaMs, 918);
  assert.equal(gate.outcome, 'inconclusive');
  assert.equal(gate.reason, 'measurement-too-noisy');
  assert.equal(gate.passed, false);
  // Home->Licao continua conclusivo na mesma execucao: o desfecho e por gate,
  // nao por relatorio, senao um instrumento ruim apagaria as medidas boas.
  assert.equal(report.gates.home_to_lesson_delta.outcome, 'pass');
  assert.equal(report.gates.persistence.outcome, 'pass');
  // As duas assercoes de RELATORIO deste caso mudaram em 2026-08-10, quando o cold
  // start saiu do veredito por decisao do dono. O que o caso protege — que um piso
  // de ruido dominante produz `inconclusive` no GATE, e nunca um passe vazio —
  // segue identico e esta afirmado acima. O veredito deixou de seguir este gate, e
  // afirmar isso aqui e o registro da mudanca no lugar onde alguem se confundiria.
  // A guarda equivalente no nivel do relatorio mora no caso do `first_frame`.
  assert.equal(report.gates.cold_start_delta.advisory, true);
  assert.equal(report.passed, true);
  assert.equal(report.outcome, 'pass');
});

// A guarda irma do caso acima, e a que impede que o teto engula medicao usavel:
// a passagem de host ocioso de 2026-08-10 teve piso de 362 ms contra p95 de
// 3351 ms (razao 0,108) e delta de 267 ms. Ela precisa continuar conclusiva,
// senao o gate deixa de poder aprovar qualquer coisa neste host e o custo e uma
// remedicao de horas por execucao.
test('stays conclusive at the noise floor an idle host produced', () => {
  const baselineCommandRuns = coortePorPercentis({ p50: 2989, p95: 3351 })
    .map((coldStart) => commandRun(coldStart, 200));
  const activeCommandRuns = coortePorPercentis({ p50: 3500, p95: 3618 })
    .map((coldStart) => commandRun(coldStart, 200));
  const activeLog = [
    lines('persistence', 'active', Array(20).fill(10)),
    lines('restoration', 'active', Array(20).fill(10)),
  ].join('\n');

  const primeiroFrame = firstFrameLogs(800, 820);
  const report = buildCheckpointPerformanceReport({
    baselineCommandRuns,
    activeCommandRuns,
    activeLog: [activeLog, primeiroFrame.activeLog].join('\n'),
    baselineLog: primeiroFrame.baselineLog,
  });
  const gate = report.gates.cold_start_delta;

  assert.equal(gate.noiseFloorMs, 362);
  assert.equal(gate.maxNoiseFloorMs, 670.2);
  assert.equal(gate.deltaMs, 267);
  assert.equal(gate.allowedDeltaMs, 362);
  assert.equal(gate.outcome, 'pass');
  assert.equal(gate.reason, 'within-limit');
  assert.equal(gate.passed, true);
  assert.equal(report.outcome, 'pass');
});

// O teto e uma fronteira, e fronteira precisa de lado declarado: exatamente no
// teto a medicao ainda conclui. Sem este caso, trocar `>` por `>=` na guarda
// passaria sem ninguem notar.
test('treats a noise floor exactly at the ceiling as still conclusive', () => {
  const baselineCommandRuns = coortePorPercentis({ p50: 800, p95: 1000 })
    .map((coldStart) => commandRun(coldStart, 200));
  const activeCommandRuns = coortePorPercentis({ p50: 1100, p95: 1150 })
    .map((coldStart) => commandRun(coldStart, 200));
  const activeLog = [
    lines('persistence', 'active', Array(20).fill(10)),
    lines('restoration', 'active', Array(20).fill(10)),
  ].join('\n');

  const primeiroFrame = firstFrameLogs(800, 820);
  const report = buildCheckpointPerformanceReport({
    baselineCommandRuns,
    activeCommandRuns,
    activeLog: [activeLog, primeiroFrame.activeLog].join('\n'),
    baselineLog: primeiroFrame.baselineLog,
  });
  const gate = report.gates.cold_start_delta;

  assert.equal(gate.noiseFloorMs, 200);
  assert.equal(gate.maxNoiseFloorMs, 200);
  assert.equal(gate.deltaMs, 150);
  assert.equal(gate.allowedDeltaMs, 200);
  assert.equal(gate.outcome, 'pass');
  assert.equal(gate.passed, true);
});

// A metrica que o gate passou a gatear em 2026-08-10. O `cold_start` media a
// duracao do `launchApp` do Maestro, que num Dev Client termina no launcher —
// antes de o bundle JS existir —, e o kernel e JavaScript: aquela janela nao
// continha o objeto sob teste. `first_frame` mede inicio do bundle ate o
// primeiro frame util, e o primeiro frame util e o frame seguinte a
// `startupPhase` virar `ready`, que so acontece depois de `inspectLaunch` do
// runtime de checkpoints. O kernel esta dentro da janela por construcao.
test('gates the first-frame delta and keeps cold start advisory only', () => {
  const baselineCommandRuns = coortePorPercentis({ p50: 2885, p95: 5748 })
    .map((coldStart) => commandRun(coldStart, 200));
  const activeCommandRuns = coortePorPercentis({ p50: 6000, p95: 6666 })
    .map((coldStart) => commandRun(coldStart, 200));
  const primeiroFrame = firstFrameLogs(800, 830);
  const activeLog = [
    lines('persistence', 'active', Array(20).fill(10)),
    lines('restoration', 'active', Array(20).fill(10)),
    primeiroFrame.activeLog,
  ].join('\n');

  const report = buildCheckpointPerformanceReport({
    baselineCommandRuns,
    activeCommandRuns,
    activeLog,
    baselineLog: primeiroFrame.baselineLog,
  });

  assert.equal(report.summary.baseline.first_frame.count, 20);
  assert.equal(report.summary.active.first_frame.count, 20);
  assert.equal(report.gates.first_frame_delta.deltaMs, 30);
  assert.equal(report.gates.first_frame_delta.outcome, 'pass');

  // O cold start desta fixture e o do host em swap de 2026-08-10: razao de ruido
  // 0,498, ou seja `inconclusive`. Ele continua sendo calculado e reportado,
  // porque a serie historica tem valor de contexto...
  assert.equal(report.gates.cold_start_delta.outcome, 'inconclusive');
  assert.equal(report.gates.cold_start_delta.advisory, true);
  // ...e NAO entra no veredito, porque um gate cuja metrica nao observa o que ele
  // protege nao pode aprovar nem reprovar. Decisao do dono em 2026-08-10.
  assert.equal(report.passed, true);
  assert.equal(report.outcome, 'pass');
  // Os gates que mandam declaram isso de forma legivel, para ninguem precisar
  // saber de cor quais entram no veredito.
  assert.equal(report.gates.first_frame_delta.advisory, false);
  assert.equal(report.gates.persistence.advisory, false);
});

test('fails the first-frame gate when the candidate regresses beyond the allowed delta', () => {
  const baselineCommandRuns = Array.from({ length: 20 }, () => commandRun(3000, 200));
  const activeCommandRuns = Array.from({ length: 20 }, () => commandRun(3000, 200));
  const primeiroFrame = firstFrameLogs(800, 900);
  const activeLog = [
    lines('persistence', 'active', Array(20).fill(10)),
    lines('restoration', 'active', Array(20).fill(10)),
    primeiroFrame.activeLog,
  ].join('\n');

  const report = buildCheckpointPerformanceReport({
    baselineCommandRuns,
    activeCommandRuns,
    activeLog,
    baselineLog: primeiroFrame.baselineLog,
  });

  // Baseline plano: piso de ruido zero, entao manda o maior entre 5% de 800
  // (40 ms) e o piso fixo de 50 ms. 100 ms de regressao reprova, e reprova como
  // `fail` — o instrumento tinha resolucao e o candidato piorou.
  assert.equal(report.gates.first_frame_delta.allowedDeltaMs, 50);
  assert.equal(report.gates.first_frame_delta.deltaMs, 100);
  assert.equal(report.gates.first_frame_delta.outcome, 'fail');
  assert.equal(report.passed, false);
  assert.equal(report.outcome, 'fail');
});

// A garantia de "`off` silencioso" era uma afirmacao sobre construcao: o probe de
// checkpoint esta desabilitado e nao pode emitir. Com o baseline passando a ser
// lido, ela vira assercao verificada. Isto nao e hipotetico: em 2026-08-10 duas
// linhas `"mode":"active"` apareceram num log de baseline, por replay do buffer
// do CDP, e nada no relatorio as pegaria porque o baseline nao era lido.
test('fails closed when a baseline log carries any checkpoint metric', () => {
  const baselineCommandRuns = Array.from({ length: 20 }, () => commandRun(3000, 200));
  const activeCommandRuns = Array.from({ length: 20 }, () => commandRun(3000, 200));
  const primeiroFrame = firstFrameLogs(800, 810);
  const activeLog = [
    lines('persistence', 'active', Array(20).fill(10)),
    lines('restoration', 'active', Array(20).fill(10)),
    primeiroFrame.activeLog,
  ].join('\n');
  const baselineLog = [
    primeiroFrame.baselineLog,
    lines('persistence', 'off', [12]),
  ].join('\n');

  const report = buildCheckpointPerformanceReport({
    baselineCommandRuns,
    activeCommandRuns,
    activeLog,
    baselineLog,
  });

  assert.equal(report.gates.baseline_isolation.passed, false);
  assert.equal(report.gates.baseline_isolation.reason, 'checkpoint-metric-in-baseline');
  assert.deepEqual(report.gates.baseline_isolation.metrics, ['persistence']);
  // Violacao de contrato, nao medicao impossivel: o desfecho e `fail`.
  assert.equal(report.gates.baseline_isolation.outcome, 'fail');
  assert.equal(report.gates.baseline_isolation.advisory, false);
  assert.equal(report.passed, false);
});

test('accepts a baseline log that carries only the mode-independent startup mark', () => {
  const baselineCommandRuns = Array.from({ length: 20 }, () => commandRun(3000, 200));
  const activeCommandRuns = Array.from({ length: 20 }, () => commandRun(3000, 200));
  const primeiroFrame = firstFrameLogs(800, 810);
  const activeLog = [
    lines('persistence', 'active', Array(20).fill(10)),
    lines('restoration', 'active', Array(20).fill(10)),
    primeiroFrame.activeLog,
  ].join('\n');

  const report = buildCheckpointPerformanceReport({
    baselineCommandRuns,
    activeCommandRuns,
    activeLog,
    baselineLog: primeiroFrame.baselineLog,
  });

  assert.equal(report.gates.baseline_isolation.passed, true);
  assert.equal(report.gates.baseline_isolation.outcome, 'pass');
  assert.equal(report.passed, true);
});

test('fails closed when the first-frame cohort is short of twenty samples', () => {
  const baselineCommandRuns = Array.from({ length: 20 }, () => commandRun(3000, 200));
  const activeCommandRuns = Array.from({ length: 20 }, () => commandRun(3000, 200));
  const primeiroFrame = firstFrameLogs(800, 810, 19);
  const activeLog = [
    lines('persistence', 'active', Array(20).fill(10)),
    lines('restoration', 'active', Array(20).fill(10)),
    primeiroFrame.activeLog,
  ].join('\n');

  const report = buildCheckpointPerformanceReport({
    baselineCommandRuns,
    activeCommandRuns,
    activeLog,
    baselineLog: primeiroFrame.baselineLog,
  });

  assert.equal(report.gates.first_frame_delta.reason, 'insufficient-samples');
  assert.equal(report.gates.first_frame_delta.outcome, 'inconclusive');
  assert.equal(report.passed, false);
  assert.equal(report.outcome, 'inconclusive');
});
