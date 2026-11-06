import assert from 'node:assert/strict';
import { execFileSync, spawnSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { test } from 'node:test';
import { fileURLToPath } from 'node:url';
import { lintUnit } from './rtg-lesson-lint.mjs';

const fixturePath = fileURLToPath(new URL('./fixtures/rtg-unit-fixture.json', import.meta.url));
const script = fileURLToPath(new URL('./rtg-lesson-lint.mjs', import.meta.url));
const fixture = () => JSON.parse(readFileSync(fixturePath, 'utf8'));
const choices = doc => doc.lessons.flatMap(lesson => [
  ...lesson.interactions.filter(item => Array.isArray(item.options)), ...lesson.checkpoint,
  lesson.recovery.guided.item, lesson.recovery.transfer.item,
]);

/** Aplica um defeito à unidade válida e devolve os erros. O controle garante que só o defeito reprova. */
function defect(mutate) {
  assert.deepEqual(lintUnit(fixture()), [], 'a unidade de teste precisa passar antes do defeito');
  const doc = fixture();
  mutate(doc);
  return lintUnit(doc);
}
const expectOnly = (errors, pattern) => {
  assert.ok(errors.length > 0, 'o defeito passou sem erro');
  assert.deepEqual(errors.filter(error => !pattern.test(error)), [], 'o defeito produziu erro de outra regra');
};

test('a unidade de teste passa no verificador e tem a forma do guia', () => {
  const doc = fixture();
  assert.deepEqual(lintUnit(doc), []);
  assert.equal(doc.lessons.length, 6);
  for (const lesson of doc.lessons) {
    assert.equal(lesson.interactions.length, 5);
    assert.ok(new Set(lesson.interactions.map(item => item.type)).size >= 3);
    assert.equal(lesson.checkpoint.length, 2);
  }
});

test('reprova a correta mais longa que 1,2 vez o maior distrator', () => {
  const errors = defect(doc => {
    const item = doc.lessons[0].interactions[0];
    item.options.find(option => option.correct).label += ' com muito mais detalhe do que as outras';
  });
  expectOnly(errors, /^lessons\[0\]\(m01-01\)\.interactions\[0\]: a correta é mais longa que 1,2× o maior distrator$/);
});

test('reprova a unidade com a correta sempre na mesma posição (acima de 40%)', () => {
  const errors = defect(doc => {
    for (const item of choices(doc)) item.options.sort((a, b) => Number(b.correct) - Number(a.correct));
  });
  assert.ok(errors.includes('unidade: a resposta correta cai na posição 1 em 100% dos itens (máx. 40%)'), errors.join('\n'));
  assert.ok(errors.includes('unidade: nos itens de conferência a correta nunca cai na posição 2; o contrato do lote exige as quatro posições'), errors.join('\n'));
  assert.deepEqual(errors.filter(error => !error.startsWith('unidade: ')), []);
});

test('reprova a conferência que nunca usa uma das quatro posições, mesmo abaixo de 40%', () => {
  const errors = defect(doc => {
    // Tira a correta da posição 4 só na conferência, trocando-a com a primeira alternativa.
    for (const lesson of doc.lessons) for (const item of lesson.checkpoint) {
      if (item.options[3].correct) [item.options[0], item.options[3]] = [item.options[3], item.options[0]];
    }
  });
  expectOnly(errors, /^unidade: nos itens de conferência a correta nunca cai na posição 4; o contrato do lote exige as quatro posições$/);
});

test('reprova retorno repetido entre alternativas', () => {
  const errors = defect(doc => {
    const { options } = doc.lessons[1].interactions[4];
    options[1].feedback = options[0].feedback;
  });
  expectOnly(errors, /^lessons\[1\]\(m01-02\)\.interactions\[4\]: retornos repetidos/);
});

test('reprova a conferência de resposta constante', () => {
  const errors = defect(doc => {
    const [first, second] = doc.lessons[2].checkpoint;
    second.options.find(option => option.correct).label = first.options.find(option => option.correct).label;
  });
  expectOnly(errors, /^lessons\[2\]\(m01-03\)\.checkpoint: os dois itens têm a mesma resposta correta$/);
});

test('reprova item sem fonte e fonte que a unidade não declara', () => {
  expectOnly(defect(doc => { doc.lessons[3].interactions[1].sourceIds = []; }),
    /^lessons\[3\]\(m01-04\)\.interactions\[1\]: sourceIds vazio$/);
  expectOnly(defect(doc => { doc.lessons[3].checkpoint[0].sourceIds = ['fonte-inexistente']; }),
    /^lessons\[3\]\(m01-04\)\.checkpoint\[0\]: fonte desconhecida: fonte-inexistente$/);
  expectOnly(defect(doc => { delete doc.sources[0].use; }), /^sources\[0\]: use deve ser factual-reference ou cc-by-4\.0$/);
});

test('reprova travessão com espaços em texto do aluno', () => {
  const errors = defect(doc => { doc.lessons[4].concept.body = doc.lessons[4].concept.body.replace(', ', ' — '); });
  expectOnly(errors, /^lessons\[4\]\(m01-05\)\.concept\.body: travessão com espaços/);
});

test('reprova texto do aluno todo em caixa alta, e aceita sigla só como nome de editora', () => {
  const errors = defect(doc => { doc.lessons[0].checkpoint[0].options[0].label = 'O PACS'; });
  expectOnly(errors, /^lessons\[0\]\(m01-01\)\.checkpoint\[0\]\.options\[0\]\.label: texto todo em caixa alta/);
  assert.deepEqual(defect(doc => { doc.sources[0].publisher = 'IAEA'; }), []);
  assert.deepEqual(defect(doc => { doc.lessons[0].checkpoint[0].options[0].label = 'O sistema PACS da sala'; }), []);
});

test('reprova fala de paciente sem nome, aula sem as cinco interações e raiz que não é objeto', () => {
  expectOnly(defect(doc => { delete doc.lessons[0].scene.lines[1].name; }), /fala de paciente precisa de name fictício$/);
  const short = defect(doc => { doc.lessons[5].interactions.pop(); });
  assert.ok(short.includes('lessons[5](m01-06).interactions: são 4; devem ser 5'), short.join('\n'));
  assert.deepEqual(lintUnit(null), ['raiz: o arquivo deve conter um objeto JSON']);
});

test('a linha de comando sai com 0 na unidade válida e com 1 no JSON quebrado', () => {
  assert.match(execFileSync(process.execPath, [script, fixturePath], { encoding: 'utf8' }), /^OK /);
  const broken = spawnSync(process.execPath, [script, script], { encoding: 'utf8' });
  assert.equal(broken.status, 1);
  assert.match(broken.stdout, /REPROVADO .*\n {2}- JSON inválido/);
});
