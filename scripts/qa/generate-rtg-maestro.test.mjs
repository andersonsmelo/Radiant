import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { createRequire } from 'node:module';
import test from 'node:test';
import { escapeMaestro, renderRtgMaestroFlows } from './generate-rtg-maestro.mjs';

// `yaml` é dependência do app (o contrato do Maestro a resolve assim), não da raiz.
const { parseAllDocuments } = createRequire(new URL('../../radiant-app/package.json', import.meta.url))('yaml');
const m01 = JSON.parse(await readFile(new URL('../../content-manifest/rtg-2026/aulas/m01.json', import.meta.url), 'utf8'));
const fresh = () => structuredClone(m01);
const render = (doc = m01) => renderRtgMaestroFlows([doc]);
const parse = content => {
  const documents = parseAllDocuments(content);
  assert.deepEqual(documents.flatMap(document => document.errors), []);
  return documents.map(document => document.toJS());
};
const commandsOf = content => parse(content)[1];

/** Todo texto que o Maestro lê como regex: tapOn, asserções, esperas e condições. */
function selectors(commands) {
  const found = [];
  const add = value => { if (typeof value === 'string') found.push(value); else if (value) for (const key of ['id', 'text']) if (value[key]) found.push(value[key]); };
  for (const command of commands) {
    if ('tapOn' in command) add(command.tapOn);
    if ('assertVisible' in command) add(command.assertVisible);
    if ('extendedWaitUntil' in command) add(command.extendedWaitUntil.visible);
    if ('scrollUntilVisible' in command) add(command.scrollUntilVisible.element);
    if ('runFlow' in command && command.runFlow.when) {
      add(command.runFlow.when.visible);
      found.push(...selectors(command.runFlow.commands ?? []));
    }
  }
  return found;
}
const unescapedMeta = selector => /[.?()[\]+*^$|{}]/.test(selector.replace(/\\./g, ''));
const tapped = lines => lines.filter(line => /^- tapOn:/.test(line));

test('renders two flows per unit, each with a metadata document and a command document', () => {
  const files = render();
  assert.deepEqual([...files.keys()], ['m01-aula-01.yaml', 'm01-avaliacao-01.yaml']);
  for (const [name, content] of files) {
    const documents = parse(content);
    assert.equal(documents.length, 2, `${name}: metadata + commands`);
    assert.equal(documents[0].appId, 'com.ascendcreative.radiant');
    assert.ok(Array.isArray(documents[1]), `${name}: command sequence`);
  }
});

test('is deterministic', () => {
  assert.deepEqual([...render()], [...render()]);
});

test('every launchApp carries the reduce-motion argument', () => {
  for (const [name, content] of render()) {
    const launches = commandsOf(content).filter(command => 'launchApp' in command);
    assert.equal(launches.length, 1, `${name}: exactly one launchApp`);
    assert.deepEqual(launches[0].launchApp.arguments, { radiantReduceMotion: '1' }, name);
  }
});

test('escapes every regex metacharacter of every selector', () => {
  const doc = fresh();
  // Rótulo sintético com "?" e "(": a resposta certa do primeiro item da avaliação.
  const correct = doc.lessons[0].checkpoint[0].options.find(option => option.correct);
  correct.label = 'Conferir (pulso). Agora?';
  const files = render(doc);
  for (const [name, content] of files) {
    for (const selector of selectors(commandsOf(content))) assert.ok(!unescapedMeta(selector), `${name}: unescaped metacharacter in ${selector}`);
  }
  const selector = selectors(commandsOf(files.get('m01-avaliacao-01.yaml'))).find(value => value.startsWith('Conferir \\('));
  assert.equal(selector, 'Conferir \\(pulso\\)\\. Agora\\?');
  assert.ok(new RegExp(`^(?:${selector})$`).test(correct.label), 'the escaped selector must still match the literal label');
  assert.equal(escapeMaestro('a.b?c(d)[e]+*^$|{}\\'), 'a\\.b\\?c\\(d\\)\\[e\\]\\+\\*\\^\\$\\|\\{\\}\\\\');
});

test('lesson 01 answers every interaction, with the taps its family needs', () => {
  const lesson = m01.lessons[0];
  const lines = render().get('m01-aula-01.yaml').split('\n');
  const marks = lines.flatMap((line, index) => (line.startsWith('# interaction ') ? [index] : []));
  assert.equal(marks.length, lesson.interactions.length, 'one block per interaction');
  const expected = {
    'multiple-choice': () => 1, 'case-decision': () => 1,
    categorize: source => source.items.length * 2,
    'true-false': source => source.statements.length,
    'multi-select': source => source.options.filter(option => option.correct).length,
    matching: source => source.pairs.length - 1,
    cloze: source => source.answers.length,
  };
  lesson.interactions.forEach((source, index) => {
    const block = lines.slice(marks[index] + 1, marks[index + 1] ?? lines.length);
    assert.match(lines[marks[index]], new RegExp(`^# interaction ${source.id} ${source.type}$`));
    // Só os toques da resposta: antes do botão de conferir.
    const answer = block.slice(0, block.findIndex(line => /^- tapOn: '(Conferir resposta|Continuar)'$/.test(line)));
    const taps = tapped(answer).length;
    assert.ok(taps >= 1, `${source.id} (${source.type}) has no answering command`);
    if (expected[source.type]) assert.equal(taps, expected[source.type](source), `${source.id} (${source.type})`);
  });
  const finish = lines.filter(line => /Concluir e voltar/.test(line));
  assert.equal(finish.length, 1, 'the closing step finishes the lesson');
  assert.ok(lines.some(line => line.includes('A lição foi concluída')), 'ends on the summary');
});

test('the checkpoint flow answers exactly the items of the first competency, correctly', () => {
  const lesson = m01.lessons[0];
  const lines = render().get('m01-avaliacao-01.yaml').split('\n');
  const marks = lines.flatMap((line, index) => (line.startsWith('# item ') ? [index] : []));
  assert.equal(marks.length, lesson.checkpoint.length, 'one block per item of aula 01, none from other lessons');
  lesson.checkpoint.forEach((source, index) => {
    const block = lines.slice(marks[index] + 1, marks[index + 1] ?? lines.length);
    const answers = block.filter(line => /^- tapOn: /.test(line)).map(line => line.slice('- tapOn: '.length));
    const correct = escapeMaestro(source.options.find(option => option.correct).label).replace(/'/g, "''");
    assert.equal(answers[0], `'${correct}'`, `item ${index + 1} taps the correct option`);
    assert.equal(answers[1], index === lesson.checkpoint.length - 1 ? "'Enviar avaliação'" : "'Próxima questão'");
    assert.equal(answers.length, 2);
  });
  const otherLesson = m01.lessons[1].checkpoint.flatMap(item => item.options.filter(option => option.correct)).map(option => option.label);
  assert.ok(otherLesson.every(label => !lines.join('\n').includes(escapeMaestro(label))), 'no answer from aula 02 leaks in');
});

test('the checkpoint flow plays lesson 01 first, because the checkpoint is locked on a fresh install', () => {
  const content = render().get('m01-avaliacao-01.yaml');
  assert.match(content, /BLOQUEADA EM INSTALAÇÃO LIMPA/);
  const summary = content.indexOf("- assertVisible: 'A lição foi concluída'");
  assert.ok(summary >= 0 && summary < content.indexOf("- tapOn: 'Começar avaliação'"), 'lesson 01 summary comes before the checkpoint starts');
});
