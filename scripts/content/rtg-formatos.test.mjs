// A unidade sintética de formatos passa pelo verificador, pela fábrica e pelo gerador Maestro.
// As tarefas da fase B trocam uma interação dela pelo tipo novo que cada uma cria.
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';
import { renderRtgMaestroFlows } from '../qa/generate-rtg-maestro.mjs';
import appContract from './load-app-contract.cjs';
import { renderRtgBatches } from './build-rtg-batches.mjs';
import { TYPES, lintUnit } from './rtg-lesson-lint.mjs';

const { WIDE_ACTIVITY_FAMILIES } = appContract.loadAppContract('features/student-checkpoints/EditorialWideContract.ts');
const { FAMILY_LABEL } = appContract.loadAppContract('features/student-checkpoints/batches/rtgBatchFactory.ts');
const doc = JSON.parse(await readFile(new URL('./fixtures/unidade-formatos.json', import.meta.url), 'utf8'));
/** `comparison` precisa de imagem registrada; o roteiro dele é coberto pelas aulas reais em generate-rtg-maestro.test.mjs. */
const NEEDS_IMAGE = ['comparison'];
const usedTypes = () => new Set(doc.lessons.flatMap(lesson => lesson.interactions.map(item => item.type)));

test('a unidade sintética passa no verificador, sem nenhum erro', () => {
  assert.deepEqual(lintUnit(doc), []);
});

test('todo tipo aceito pelo verificador está em WIDE_ACTIVITY_FAMILIES e em FAMILY_LABEL', () => {
  for (const type of TYPES) {
    assert.ok(WIDE_ACTIVITY_FAMILIES.includes(type), `${type} falta em WIDE_ACTIVITY_FAMILIES`);
    assert.ok(Object.hasOwn(FAMILY_LABEL, type), `${type} falta em FAMILY_LABEL`);
  }
});

test('a unidade usa todos os tipos da aula-fonte, menos os que exigem imagem', () => {
  assert.deepEqual([...usedTypes()].sort(), TYPES.filter(type => !NEEDS_IMAGE.includes(type)).sort());
});

test('a fábrica gera o lote com um tipo de interação para cada tipo da aula-fonte', () => {
  const { files } = renderRtgBatches([{ file: 'm01.json', doc }]);
  const text = files.get('rtg-2026-m01.ts');
  const batch = JSON.parse(text.slice(text.indexOf('= {') + 2, text.lastIndexOf(';')));
  const types = new Set(batch.activities.flatMap(activity => activity.steps.filter(step => step.kind === 'interaction').map(step => step.interaction.type)));
  assert.deepEqual([...types].sort(), [...usedTypes()].sort());
});

test('o gerador Maestro tem roteiro de resposta para todo tipo da unidade', () => {
  assert.doesNotThrow(() => renderRtgMaestroFlows([doc]));
});

test('o hotspot sobre diagrama chega ao lote com imageRef diagram:<id> e região com id gerado', () => {
  const { files } = renderRtgBatches([{ file: 'm01.json', doc }]);
  const text = files.get('rtg-2026-m01.ts');
  const batch = JSON.parse(text.slice(text.indexOf('= {') + 2, text.lastIndexOf(';')));
  const interactions = batch.activities.flatMap(activity => activity.steps.filter(step => step.kind === 'interaction').map(step => step.interaction));
  const hotspot = interactions.find(interaction => interaction.type === 'hotspot');
  assert.equal(hotspot.payload.imageRef, 'diagram:sala-com-riscos');
  assert.match(hotspot.accessibility.label, /^Toque na imagem: /);
  assert.deepEqual(hotspot.payload.regions.map(region => region.id), [1, 2, 3, 4].map(n => `region:rtg-2026:m01:aula-01:i2:${n}`));
  assert.deepEqual(hotspot.payload.correctRegionIds, ['region:rtg-2026:m01:aula-01:i2:2']);
  assert.equal(Object.hasOwn(hotspot.payload.regions[0], 'correct'), false);
});

test('o roteiro Maestro toca o hotspot pelo rótulo acessível da região certa e confere', () => {
  const lesson = renderRtgMaestroFlows([doc]).get('m01-aula-01.yaml').split('\n');
  const at = lesson.findIndex(line => line === '# interaction i2 hotspot');
  assert.ok(at > 0, 'sem o comentário do hotspot');
  const tapped = lesson.slice(at, at + 12).filter(line => line.startsWith('- tapOn:'));
  assert.deepEqual(tapped, ["- tapOn: 'Selecionar Ânodo na imagem'", "- tapOn: 'Conferir resposta'", "- tapOn: 'Continuar'"]);
});

test('o rotular sobre diagrama chega ao lote com pontos, fichas embaralhadas e ids gerados', () => {
  const { files } = renderRtgBatches([{ file: 'm01.json', doc }]);
  const text = files.get('rtg-2026-m01.ts');
  const batch = JSON.parse(text.slice(text.indexOf('= {') + 2, text.lastIndexOf(';')));
  const interactions = batch.activities.flatMap(activity => activity.steps.filter(step => step.kind === 'interaction').map(step => step.interaction));
  const label = interactions.find(interaction => interaction.type === 'label');
  assert.equal(label.payload.imageRef, 'diagram:sala-com-riscos');
  assert.match(label.accessibility.label, /^Rotular a imagem: /);
  assert.deepEqual(label.payload.points.map(point => point.id), [1, 2, 3, 4].map(n => `point:rtg-2026:m01:aula-01:i3:${n}`));
  assert.equal(label.payload.labels.length, 5);
  const text2 = new Map(label.payload.labels.map(entry => [entry.id, entry.label]));
  assert.deepEqual(label.payload.points.map(point => text2.get(point.correctLabelId)), ['Cátodo com filamento', 'Ânodo', 'Janela de saída', 'Ampola de vidro']);
  const correct = new Set(label.payload.points.map(point => point.correctLabelId));
  assert.notDeepEqual(label.payload.labels.filter(entry => correct.has(entry.id)).map(entry => entry.id), label.payload.points.map(point => point.correctLabelId));
  assert.deepEqual(label.payload.points.map(point => Object.keys(point).sort().join()), Array(4).fill('correctLabelId,id,where,x,y'));
});

test('o roteiro Maestro rotula cada ponto pela ficha certa, rolando para cima até o ponto', () => {
  const lesson = renderRtgMaestroFlows([doc]).get('m01-aula-01.yaml').split('\n');
  const at = lesson.findIndex(line => line === '# interaction i3 label');
  assert.ok(at > 0, 'sem o comentário do rotular');
  const segment = lesson.slice(at, lesson.findIndex((line, n) => n > at && line.startsWith('- assertVisible')));
  const tapped = segment.filter(line => /^- tapOn: |^    id: /.test(line));
  assert.deepEqual(tapped, [
    "- tapOn: 'Ponto 1, à esquerda, a espiral dentro da capa, sem rótulo'", "    id: 'label-chip-Cátodo com filamento'",
    "- tapOn: 'Ponto 2, à direita, o bloco inclinado atingido pelos elétrons, sem rótulo'", "    id: 'label-chip-Ânodo'",
    "- tapOn: 'Ponto 3, embaixo à direita, a abertura no vidro, sem rótulo'", "    id: 'label-chip-Janela de saída'",
    "- tapOn: 'Ponto 4, a parede curva que envolve todo o conjunto, sem rótulo'", "    id: 'label-chip-Ampola de vidro'",
    "- tapOn: 'Conferir resposta'", "- tapOn: 'Continuar'",
  ]);
  assert.equal(segment.filter(line => line === '    direction: UP').length, 4);
});

test('a caça ao erro sobre diagrama chega ao lote com regiões que levam a explicação e os riscos por id', () => {
  const { files } = renderRtgBatches([{ file: 'm01.json', doc }]);
  const text = files.get('rtg-2026-m01.ts');
  const batch = JSON.parse(text.slice(text.indexOf('= {') + 2, text.lastIndexOf(';')));
  const interactions = batch.activities.flatMap(activity => activity.steps.filter(step => step.kind === 'interaction').map(step => step.interaction));
  const hunt = interactions.find(interaction => interaction.type === 'risk-hunt');
  assert.equal(hunt.payload.imageRef, 'diagram:sala-com-riscos');
  assert.equal(hunt.criticalSafety, true);
  assert.match(hunt.accessibility.label, /^Encontre os riscos: /);
  assert.deepEqual(hunt.payload.regions.map(region => region.id), [1, 2, 3, 4, 5].map(n => `region:rtg-2026:m01:aula-01:i4:${n}`));
  assert.deepEqual(hunt.payload.riskRegionIds, hunt.payload.regions.filter(region => ['Porta da sala aberta', 'Campo de luz sobre o paciente inteiro', 'Acompanhante ao lado da mesa'].includes(region.label)).map(region => region.id));
  assert.ok(hunt.payload.regions.every(region => region.explanation.length >= 25 && !Object.hasOwn(region, 'risk') && !Object.hasOwn(region, 'feedback')));
});

test('o roteiro Maestro marca cada região de risco pela lista e confere', () => {
  const lesson = renderRtgMaestroFlows([doc]).get('m01-aula-01.yaml').split('\n');
  const at = lesson.findIndex(line => line === '# interaction i4 risk-hunt');
  assert.ok(at > 0, 'sem o comentário da caça ao erro');
  const segment = lesson.slice(at, lesson.findIndex((line, n) => n > at && line.startsWith('- assertVisible')));
  assert.deepEqual(segment.filter(line => /^- tapOn: |^    id: /.test(line)), [
    "    id: 'risk-hunt-Porta da sala aberta'", "    id: 'risk-hunt-Campo de luz sobre o paciente inteiro'", "    id: 'risk-hunt-Acompanhante ao lado da mesa'",
    "- tapOn: 'Conferir resposta'", "- tapOn: 'Continuar'",
  ]);
});

/** O gerador Maestro só joga a primeira aula; a aula 02 vai à frente para exercitar o que ela tem. */
const secondLessonFirst = () => ({ ...doc, lessons: [doc.lessons[1], doc.lessons[0], ...doc.lessons.slice(2)] });
const fourthLessonFirst = () => ({ ...doc, lessons: [doc.lessons[3], doc.lessons[0], doc.lessons[1], doc.lessons[2], ...doc.lessons.slice(4)] });
const thirdLessonFirst = () => ({ ...doc, lessons: [doc.lessons[2], doc.lessons[0], doc.lessons[1], ...doc.lessons.slice(3)] });

test('a conversa chega ao lote com turnos, respostas com reação e a correta por id, sem name quando não há', () => {
  const { files } = renderRtgBatches([{ file: 'm01.json', doc }]);
  const text = files.get('rtg-2026-m01.ts');
  const batch = JSON.parse(text.slice(text.indexOf('= {') + 2, text.lastIndexOf(';')));
  const interactions = batch.activities.flatMap(activity => activity.steps.filter(step => step.kind === 'interaction').map(step => step.interaction));
  const talk = interactions.find(interaction => interaction.type === 'conversation');
  assert.match(talk.accessibility.label, /^Conversa: /);
  assert.equal(talk.payload.speaker, 'duda');
  assert.equal(Object.hasOwn(talk.payload, 'name'), false);
  assert.deepEqual(talk.payload.turns.map(turn => turn.id), [1, 2].map(n => `turn:rtg-2026:m01:aula-02:i2:${n}`));
  assert.deepEqual(talk.payload.turns[0].options.map(option => option.id), ['1a', '1b', '1c'].map(n => `option:rtg-2026:m01:aula-02:i2:${n}`));
  assert.deepEqual(talk.payload.turns.map(turn => turn.correctOptionId), ['option:rtg-2026:m01:aula-02:i2:1b', 'option:rtg-2026:m01:aula-02:i2:2a']);
  assert.ok(talk.payload.turns.every(turn => turn.options.every(option => option.reply.length > 0 && !Object.hasOwn(option, 'correct'))));
});

test('a fábrica só leva name ao payload quando a aula-fonte o traz (chave ausente, não undefined)', () => {
  const factory = appContract.loadAppContract('features/student-checkpoints/batches/rtgBatchFactory.ts');
  const talkOf = source => factory.buildRtgBatch(source).batch.activities[1].steps.map(step => step.interaction).find(interaction => interaction?.type === 'conversation');
  assert.equal(Object.hasOwn(talkOf(doc).payload, 'name'), false);
  const patient = structuredClone(doc);
  Object.assign(patient.lessons[1].interactions[1], { speaker: 'paciente', name: 'Sr. Álvaro' });
  assert.equal(talkOf(patient).payload.name, 'Sr. Álvaro');
});

test('o roteiro Maestro responde cada turno da conversa pela resposta certa e confere', () => {
  const lesson = renderRtgMaestroFlows([secondLessonFirst()]).get('m01-aula-01.yaml').split('\n');
  const at = lesson.findIndex(line => line === '# interaction i2 conversation');
  assert.ok(at > 0, 'sem o comentário da conversa');
  const segment = lesson.slice(at, lesson.findIndex((line, n) => n > at && line.startsWith('- assertVisible')));
  assert.deepEqual(segment.filter(line => /^- tapOn: |^    id: /.test(line)), [
    "    id: 'conversation-option-Prenda na altura do tronco, como o plano do setor manda\\.'",
    "    id: 'conversation-option-Avise a supervisão antes: sem dosímetro, não entre\\.'",
    "- tapOn: 'Conferir resposta'", "- tapOn: 'Continuar'",
  ]);
});

test('a rodada rápida chega ao lote com afirmações por id, passCount de n menos 1 e o veredito em isTrue', () => {
  const { files } = renderRtgBatches([{ file: 'm01.json', doc }]);
  const text = files.get('rtg-2026-m01.ts');
  const batch = JSON.parse(text.slice(text.indexOf('= {') + 2, text.lastIndexOf(';')));
  const interactions = batch.activities.flatMap(activity => activity.steps.filter(step => step.kind === 'interaction').map(step => step.interaction));
  const blitz = interactions.find(interaction => interaction.type === 'blitz');
  assert.match(blitz.accessibility.label, /^Rodada rápida: /);
  assert.deepEqual(blitz.payload.statements.map(statement => statement.id), [1, 2, 3, 4, 5, 6].map(n => `statement:rtg-2026:m01:aula-02:i3:${n}`));
  assert.deepEqual(blitz.payload.statements.map(statement => statement.isTrue), [true, false, true, true, false, false]);
  assert.equal(blitz.payload.passCount, 5);
  assert.ok(blitz.payload.statements.every(statement => statement.explanation.length >= 25 && !Object.hasOwn(statement, 'correct') && !Object.hasOwn(statement, 'feedback')));
  assert.deepEqual(Object.keys(blitz.payload).sort(), ['passCount', 'prompt', 'statements']);
});

test('o roteiro Maestro desliga o relógio se ele existir, responde cada afirmação pela resposta certa e confere', () => {
  const lesson = renderRtgMaestroFlows([secondLessonFirst()]).get('m01-aula-01.yaml').split('\n');
  const at = lesson.findIndex(line => line === '# interaction i3 blitz');
  assert.ok(at > 0, 'sem o comentário da rodada rápida');
  const segment = lesson.slice(at, lesson.findIndex((line, n) => n > at && line.startsWith('- assertVisible: \'Passo')));
  // A primeira linha de comando é o desligar condicional: sem botão (reduzir movimento, leitor de tela) o roteiro segue.
  assert.deepEqual(segment.slice(1, 6), ['- runFlow:', '    when:', "      visible: 'Sem tempo'", '    commands:', "      - tapOn: 'Sem tempo'"]);
  assert.deepEqual(segment.filter(line => /^    id: |^- assertVisible: 'Afirmação/.test(line)), [
    "    id: 'blitz-verdadeiro'", "- assertVisible: 'Afirmação 2 de 6'", "    id: 'blitz-falso'", "- assertVisible: 'Afirmação 3 de 6'", "    id: 'blitz-verdadeiro'",
    "- assertVisible: 'Afirmação 4 de 6'", "    id: 'blitz-verdadeiro'", "- assertVisible: 'Afirmação 5 de 6'", "    id: 'blitz-falso'",
    "- assertVisible: 'Afirmação 6 de 6'", "    id: 'blitz-falso'",
  ]);
  assert.deepEqual(segment.filter(line => /^- tapOn: 'Conferir|^- tapOn: 'Continuar/.test(line)), ["- tapOn: 'Conferir resposta'", "- tapOn: 'Continuar'"]);
});

test('a bancada chega ao lote com os mesmos campos do contrato do app e sem chave a mais', () => {
  const { files } = renderRtgBatches([{ file: 'm01.json', doc }]);
  const text = files.get('rtg-2026-m01.ts');
  const batch = JSON.parse(text.slice(text.indexOf('= {') + 2, text.lastIndexOf(';')));
  const interactions = batch.activities.flatMap(activity => activity.steps.filter(step => step.kind === 'interaction').map(step => step.interaction));
  const bench = interactions.find(interaction => interaction.type === 'bench');
  assert.match(bench.accessibility.label, /^Bancada: /);
  assert.deepEqual(Object.keys(bench.payload).sort(), ['controls', 'goal', 'hints', 'mode', 'phantomLabel', 'prompt', 'simulator']);
  assert.deepEqual(bench.payload.goal, { kind: 'reach', control: 'kv', atLeast: 90 });
  assert.deepEqual(bench.payload.controls, [{ id: 'kv', label: 'Tensão', unit: 'kV', min: 40, max: 120, step: 10, initial: 60 }]);
  assert.equal(bench.feedback.correct.length > 0 && bench.feedback.incorrect.length > 0, true);
});

test('o roteiro Maestro leva a tensão até o alvo pelo botão Aumentar, um toque por passo, e confere', () => {
  const lesson = renderRtgMaestroFlows([thirdLessonFirst()]).get('m01-aula-01.yaml').split('\n');
  const at = lesson.findIndex(line => line === '# interaction i2 bench');
  assert.ok(at > 0, 'sem o comentário da bancada');
  const segment = lesson.slice(at, lesson.findIndex((line, n) => n > at && line.startsWith('- assertVisible: \'Passo')));
  // De 60 a 90 kV em passos de 10: três toques. O botão fica abaixo da imagem, então rola até ele uma vez.
  assert.deepEqual(segment.filter(line => /^- tapOn: /.test(line)), ["- tapOn: 'Aumentar Tensão'", "- tapOn: 'Aumentar Tensão'", "- tapOn: 'Aumentar Tensão'", "- tapOn: 'Conferir resposta'", "- tapOn: 'Continuar'"]);
  assert.equal(segment.filter(line => line.startsWith('- scrollUntilVisible')).length, 1);
});

test('a bancada com alvo de menos de um limite usa Diminuir, o passo que passa do limite para no extremo, e o match pede roteiro manual', () => {
  const lessonWith = mutate => {
    const copy = structuredClone(thirdLessonFirst());
    mutate(copy.lessons[0].interactions[1]);
    return renderRtgMaestroFlows([copy]).get('m01-aula-01.yaml').split('\n');
  };
  const down = lessonWith(item => { item.goal = { kind: 'reach', control: 'kv', atMost: 45 }; });
  // De 60 a 45 kV em passos de 10: dois toques (50, 40), e 40 já cumpre o limite.
  assert.deepEqual(down.filter(line => line === "- tapOn: 'Diminuir Tensão'"), ["- tapOn: 'Diminuir Tensão'", "- tapOn: 'Diminuir Tensão'"]);
  // De 60 em passos de 25 até atLeast 115: 85, 110 e o botão para em 120. Três toques, e o último cumpre.
  const clamped = lessonWith(item => { item.controls[0].step = 25; item.goal.atLeast = 115; });
  assert.equal(clamped.filter(line => line === "- tapOn: 'Aumentar Tensão'").length, 3);
  assert.throws(() => lessonWith(item => { item.goal = { kind: 'match', reference: { kv: 80, mas: 10 }, tolerance: 0.05 }; }), /rtg-maestro-bench-manual/);
});

test('o laboratório chega ao lote com os mesmos campos do contrato do app e sem chave a mais', () => {
  const { files } = renderRtgBatches([{ file: 'm01.json', doc }]);
  const text = files.get('rtg-2026-m01.ts');
  const batch = JSON.parse(text.slice(text.indexOf('= {') + 2, text.lastIndexOf(';')));
  const interactions = batch.activities.flatMap(activity => activity.steps.filter(step => step.kind === 'interaction').map(step => step.interaction));
  const lab = interactions.find(interaction => interaction.type === 'parameter-lab');
  assert.match(lab.accessibility.label, /^Ajuste o controle: /);
  assert.deepEqual(Object.keys(lab.payload).sort(), ['goal', 'hints', 'model', 'prompt', 'start']);
  assert.equal(lab.payload.model, 'inverse-square');
  assert.equal(lab.payload.start, 1);
  assert.deepEqual(lab.payload.goal, { atLeast: 2 });
  assert.equal(lab.feedback.correct.length > 0 && lab.feedback.incorrect.length > 0, true);
});

test('o roteiro Maestro leva a distância até a meta pelo botão Aumentar, um toque por passo, e confere', () => {
  const lesson = renderRtgMaestroFlows([fourthLessonFirst()]).get('m01-aula-01.yaml').split('\n');
  const at = lesson.findIndex(line => line === '# interaction i3 parameter-lab');
  assert.ok(at > 0, 'sem o comentário do laboratório');
  const segment = lesson.slice(at, lesson.findIndex((line, n) => n > at && line.startsWith('- assertVisible: \'Passo')));
  // De 1 a 2 m em passos de 0,5: dois toques. O botão fica abaixo do desenho, então rola até ele uma vez.
  assert.deepEqual(segment.filter(line => /^- tapOn: /.test(line)), ["- tapOn: 'Aumentar Distância'", "- tapOn: 'Aumentar Distância'", "- tapOn: 'Conferir resposta'", "- tapOn: 'Continuar'"]);
  assert.equal(segment.filter(line => line.startsWith('- scrollUntilVisible')).length, 1);
});

test('o laboratório com meta de menos de um limite usa Diminuir, um toque por passo', () => {
  const copy = structuredClone(fourthLessonFirst());
  Object.assign(copy.lessons[0].interactions[2], { start: 3, goal: { atMost: 1.5 } });
  const lesson = renderRtgMaestroFlows([copy]).get('m01-aula-01.yaml').split('\n');
  // De 3 a 1,5 m em passos de 0,5: três toques.
  assert.deepEqual(lesson.filter(line => line === "- tapOn: 'Diminuir Distância'"), Array(3).fill("- tapOn: 'Diminuir Distância'"));
});

test('tipo sem ramo na fábrica lança em vez de virar associação', () => {
  const broken = structuredClone(doc);
  broken.lessons[0].interactions[2].type = 'tipo-que-nao-existe';
  assert.throws(() => renderRtgBatches([{ file: 'm01.json', doc: broken }]), /rtg-lint|tipo inválido/);
  const factory = appContract.loadAppContract('features/student-checkpoints/batches/rtgBatchFactory.ts');
  assert.throws(() => factory.buildRtgBatch(broken), /rtg-batch-unknown-type:tipo-que-nao-existe/);
});
