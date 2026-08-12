import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { test } from 'node:test';
import { fileURLToPath } from 'node:url';

import { parseCheckpointPerformanceLog } from './checkpoint-performance-report.mjs';
import {
  CHECKPOINT_PERFORMANCE_PREFIX,
  createEnvelopeCollector,
  consoleTextFrom,
  positiveControlLine,
  selectDebuggerTarget,
} from './checkpoint-cdp-collector.mjs';

// O controle positivo tem de provar o canal sem poder virar amostra, e as duas
// metades sao afirmadas por dois modulos diferentes: o coletor grava a linha, o
// parser do relatorio a ignora. Medido ao vivo em 2026-08-12 — a linha de
// controle de uma sessao reapareceu no arquivo da sessao seguinte, reentregue
// pelo buffer do alvo, e "descarte o arquivo de controle" nao protege disso,
// porque a linha mora no buffer e nao no arquivo. Como `first_frame` com
// `durationMs: 0` ela entraria na coorte e deprimiria o p50 do baseline, o que
// INFLA o piso de ruido e produz o passe vazio que o gate existe para recusar.
test('a linha de controle positivo atravessa o coletor e nao vira amostra do relatorio', () => {
  const coletor = createEnvelopeCollector({ since: 0 });
  const linha = positiveControlLine();

  assert.equal(coletor.accept({ timestamp: 1, args: [{ type: 'string', value: linha }] }), linha);
  assert.deepEqual(parseCheckpointPerformanceLog(linha, 'off'), []);
});

// O prefixo e um contrato entre tres arquivos que nao se importam: o emissor em
// TypeScript dentro do app, este coletor e o parser do relatorio. Trocado no
// emissor, o coletor grava zero linha e o gate reprova por amostra insuficiente
// — que le como "faltou rodar". A ligacao e por texto, entao o teste tem de
// olhar o texto.
test('o prefixo do coletor nao derivou do emissor do app', () => {
  const emissor = readFileSync(
    fileURLToPath(new URL('../src/features/student-checkpoints/CheckpointPerformance.ts', import.meta.url)),
    'utf8',
  );
  const declarado = emissor.match(/CHECKPOINT_PERFORMANCE_PREFIX\s*=\s*'([^']+)'/);

  assert.notEqual(declarado, null, 'o emissor precisa declarar CHECKPOINT_PERFORMANCE_PREFIX');
  assert.equal(CHECKPOINT_PERFORMANCE_PREFIX, declarado[1]);
});

// O alvo certo nao e "o primeiro da lista". Neste Dev Client bridgeless o
// `/json/list` devolve mais de um alvo, e o depreciado tambem aceita conexao —
// conectar nele produz um arquivo vazio que o parser reporta como amostra
// insuficiente, que le como "faltou rodar" em vez de "conectei no lugar errado".
test('selectDebuggerTarget prefere o alvo bridgeless quando o depreciado tambem esta na lista', () => {
  const alvo = selectDebuggerTarget([
    {
      title: 'React Native Bridge (Deprecated)',
      webSocketDebuggerUrl: 'ws://localhost:8081/inspector/debug?device=1&page=-1',
    },
    {
      title: 'Radiant',
      description: 'Bridgeless',
      webSocketDebuggerUrl: 'ws://localhost:8081/inspector/debug?device=1&page=2',
    },
  ]);

  assert.equal(alvo, 'ws://localhost:8081/inspector/debug?device=1&page=2');
});

test('selectDebuggerTarget aceita o unico alvo conectavel quando nao ha rotulo bridgeless', () => {
  const alvo = selectDebuggerTarget([
    { title: 'Radiant', webSocketDebuggerUrl: 'ws://localhost:8081/inspector/debug?page=7' },
  ]);

  assert.equal(alvo, 'ws://localhost:8081/inspector/debug?page=7');
});

// Falha fechada: sem alvo, a coorte inteira sai vazia, e vazio e ambiguo entre
// "o app nao emitiu" e "ninguem estava escutando". O erro precisa acontecer
// antes de a coorte comecar, nao depois de 20 execucoes.
test('selectDebuggerTarget falha fechado quando nenhum alvo aceita conexao', () => {
  assert.throws(() => selectDebuggerTarget([]), /nenhum alvo/i);
  assert.throws(
    () => selectDebuggerTarget([{ title: 'Radiant', description: 'Bridgeless' }]),
    /nenhum alvo/i,
  );
});

test('consoleTextFrom devolve o texto do argumento de string', () => {
  const texto = consoleTextFrom({
    type: 'info',
    args: [{ type: 'string', value: 'RADIANT_CHECKPOINT_PERF {"metric":"first_frame"}' }],
  });

  assert.equal(texto, 'RADIANT_CHECKPOINT_PERF {"metric":"first_frame"}');
});

test('consoleTextFrom junta multiplos argumentos de string com espaco', () => {
  const texto = consoleTextFrom({
    type: 'log',
    args: [{ type: 'string', value: 'RADIANT_CHECKPOINT_PERF' }, { type: 'string', value: '{"a":1}' }],
  });

  assert.equal(texto, 'RADIANT_CHECKPOINT_PERF {"a":1}');
});

test('consoleTextFrom ignora argumentos sem valor textual em vez de quebrar', () => {
  const texto = consoleTextFrom({
    type: 'log',
    args: [{ type: 'object', objectId: '{"injectedScriptId":1}' }],
  });

  assert.equal(texto, '');
});

test('consoleTextFrom devolve string vazia quando nao ha argumentos', () => {
  assert.equal(consoleTextFrom({ type: 'log' }), '');
  assert.equal(consoleTextFrom({}), '');
});

test('o coletor guarda apenas linhas com o prefixo fechado', () => {
  const coletor = createEnvelopeCollector({ since: 0 });

  assert.equal(
    coletor.accept({ timestamp: 1, args: [{ type: 'string', value: 'RADIANT_CHECKPOINT_PERF {"metric":"first_frame"}' }] }),
    'RADIANT_CHECKPOINT_PERF {"metric":"first_frame"}',
  );
  assert.equal(
    coletor.accept({ timestamp: 2, args: [{ type: 'string', value: 'Running application Radiant' }] }),
    null,
  );
});

// O `Runtime.enable` de cada reconexao reentrega o buffer do alvo, e o coletor
// precisa reconectar a cada killApp/launchApp do flow. Sem deduplicacao, a mesma
// amostra e contada uma vez por reconexao: foi assim que duas linhas
// `"mode":"active"` apareceram numa coorte de baseline em 2026-08-10. A chave e
// (timestamp, texto) porque e a reentrega da MESMA linha que contamina.
test('o coletor descarta a reentrega da mesma linha pelo buffer do CDP', () => {
  const coletor = createEnvelopeCollector({ since: 0 });
  const linha = { timestamp: 1786568000123.4, args: [{ type: 'string', value: 'RADIANT_CHECKPOINT_PERF {"metric":"persistence","durationMs":16.2}' }] };

  assert.notEqual(coletor.accept(linha), null);
  assert.equal(coletor.accept({ ...linha }), null);
});

// A deduplicacao nao pode engolir medida legitima: duas amostras da mesma
// metrica com a mesma duracao sao normais numa coorte de 20, e o que as
// distingue e o instante de emissao.
test('o coletor mantem linhas identicas emitidas em instantes diferentes', () => {
  const coletor = createEnvelopeCollector({ since: 0 });
  const valor = 'RADIANT_CHECKPOINT_PERF {"metric":"restoration","durationMs":6}';

  assert.notEqual(coletor.accept({ timestamp: 10, args: [{ type: 'string', value: valor }] }), null);
  assert.notEqual(coletor.accept({ timestamp: 11, args: [{ type: 'string', value: valor }] }), null);
});

// A deduplicacao e por processo, entao ela NAO cobre a reentrega de uma linha
// anterior ao proprio coletor — e essa e a contaminacao medida ao vivo em
// 2026-08-12: um coletor recem-criado recebeu no `Runtime.enable` tres envelopes
// reais com 110 s de idade, de um lancamento que nao pertencia a coorte.
test('o coletor descarta envelope emitido antes de ele existir', () => {
  const coletor = createEnvelopeCollector({ since: 1000 });
  const linha = 'RADIANT_CHECKPOINT_PERF {"metric":"first_frame","durationMs":723.5}';

  assert.equal(coletor.accept({ timestamp: 999.9, args: [{ type: 'string', value: linha }] }), null);
});

test('o coletor mantem envelope emitido a partir do piso temporal', () => {
  const coletor = createEnvelopeCollector({ since: 1000 });
  const linha = 'RADIANT_CHECKPOINT_PERF {"metric":"first_frame","durationMs":723.5}';

  assert.equal(coletor.accept({ timestamp: 1000, args: [{ type: 'string', value: linha }] }), linha);
});

// O coletor NAO filtra por modo, e isso e deliberado. O gate
// `baseline_isolation` do relatorio existe para reprovar quando uma metrica de
// checkpoint aparece num log de baseline; um coletor que descartasse essas
// linhas calaria justamente o sinal que o gate procura, e a contaminacao viraria
// invisivel em vez de reprovada.
test('o coletor entrega metrica de checkpoint mesmo quando o modo diverge', () => {
  const coletor = createEnvelopeCollector({ since: 0 });
  const linha = 'RADIANT_CHECKPOINT_PERF {"schemaVersion":1,"metric":"persistence","mode":"active","durationMs":9}';

  assert.equal(coletor.accept({ timestamp: 3, args: [{ type: 'string', value: linha }] }), linha);
});
