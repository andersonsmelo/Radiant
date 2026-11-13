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

// Auditoria de 2026-11-10: `"correct": "false"` (texto) passava, porque só
// `=== true` era contado, e o gerador trata o texto como verdadeiro: o distrator
// virava o gabarito no app.
test('reprova correct que não seja true ou false, numa questão e numa conferência', () => {
  const errors = defect(doc => {
    const item = doc.lessons[0].interactions[0];
    const distractor = item.options.find(option => option.correct !== true);
    distractor.correct = 'false';
    const check = doc.lessons[0].checkpoint[0];
    delete check.options.find(option => option.correct !== true).correct;
  });
  expectOnly(errors, /^lessons\[0\]\(m01-01\)\.(interactions|checkpoint)\[0\]: correct deve ser true ou false em cada alternativa$/);
  assert.equal(errors.length, 2);
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

const IMAGES = [{ id: 'image:rtg-2026:m01:a' }, { id: 'image:rtg-2026:m01:b' }];
function comparison(mutate = () => {}) {
  const doc = fixture();
  const old = doc.lessons[0].interactions[1];
  doc.lessons[0].interactions[1] = {
    id: old.id, type: 'comparison', role: 'practice', help: old.help, sourceIds: old.sourceIds,
    prompt: 'Qual destas duas radiografias foi feita em perfil?',
    options: [
      { label: 'Radiografia A', imageId: 'image:rtg-2026:m01:a', correct: false, feedback: 'Esta é a incidência de frente, ensinada no conceito.' },
      { label: 'Radiografia B', imageId: 'image:rtg-2026:m01:b', correct: true, feedback: 'Esta é a incidência em perfil, ensinada no conceito.' },
    ],
  };
  mutate(doc.lessons[0].interactions[1]);
  return lintUnit(doc, { images: IMAGES });
}
test('aceita comparação com duas imagens registradas', () => assert.deepEqual(comparison(), []));
test('reprova comparação com imagem fora do registro', () => expectOnly(comparison(item => { item.options[0].imageId = 'image:rtg-2026:m01:c'; }), /imagem fora do registro/));
test('reprova comparação sem imagem na alternativa', () => expectOnly(comparison(item => { delete item.options[0].imageId; }), /imagem fora do registro/));
test('reprova comparação sem exatamente uma correta', () => expectOnly(comparison(item => { item.options[0].correct = true; }), /exatamente 1 alternativa correta/));
test('reprova comparação com uma imagem só', () => expectOnly(comparison(item => { item.options.pop(); }), /de 2 a 4 imagens/));
test('reprova a mesma imagem duas vezes na comparação', () => expectOnly(comparison(item => { item.options[1].imageId = item.options[0].imageId; }), /imagem repetida/));
test('reprova retorno repetido na comparação', () => expectOnly(comparison(item => { item.options[1].feedback = item.options[0].feedback; }), /retornos repetidos/));

// Auditoria de 2026-11-10, achado 18: o guia diz que `role: "safety"` e
// `criticalSafety: true` andam juntos, e o app só trata como segurança o segundo.
test('role safety e criticalSafety true andam juntos', () => {
  const findSafety = doc => doc.lessons.flatMap(lesson => lesson.interactions).find(item => item.role === 'safety');
  expectOnly(defect(doc => { delete findSafety(doc).criticalSafety; }), /safety/);
  expectOnly(defect(doc => {
    const other = doc.lessons.flatMap(lesson => lesson.interactions).find(item => item.role === 'practice');
    other.criticalSafety = true;
  }), /safety/);
});

// Famílias da 1.6 (ADR-2026-11-13). A aula 1 troca i2 a i5 pelas quatro famílias; i1 segue múltipla escolha.
function withNewFamilies(doc = fixture()) {
  const [, ...old] = doc.lessons[0].interactions;
  const keep = index => ({ id: old[index].id, role: old[index].role, help: old[index].help, sourceIds: old[index].sourceIds,
    ...(old[index].criticalSafety ? { criticalSafety: true } : {}) });
  doc.lessons[0].interactions.splice(1, 4,
    { ...keep(0), type: 'cloze', prompt: 'Complete a frase com as palavras do banco.', text: 'O {{1}} reduz a dose no {{2}}.',
      answers: ['avental', 'tronco'], distractors: ['relógio', 'cabelo'],
      feedbackCorrect: 'Você completou: o avental protege o tronco, como no conceito.',
      feedbackIncorrect: 'Releia o conceito: o avental cobre o tronco, onde estão os órgãos mais sensíveis.' },
    { ...keep(1), type: 'true-false', prompt: 'Julgue cada afirmação sobre a proteção.',
      statements: [
        { text: 'A distância da fonte reduz a dose recebida.', correct: true, feedback: 'Certo: quanto mais longe da fonte, menor a dose.' },
        { text: 'O dosímetro reduz a dose de quem o usa.', correct: false, feedback: 'Errado: o dosímetro mede a dose, não protege.' },
        { text: 'O avental cobre o tronco durante o exame.', correct: true, feedback: 'Certo: o avental cobre a região do tronco.' },
      ],
      feedbackCorrect: 'Você julgou as três afirmações como a fonte descreve.',
      feedbackIncorrect: 'Releia o conceito e compare cada afirmação com ele.' },
    { ...keep(2), type: 'categorize', prompt: 'Classifique cada ação no grupo certo.', categories: ['Tarefa técnica', 'Decisão clínica'],
      items: [
        { label: 'Posicionar o paciente', category: 'Tarefa técnica' }, { label: 'Ajustar o campo', category: 'Tarefa técnica' },
        { label: 'Escrever o laudo', category: 'Decisão clínica' }, { label: 'Indicar o exame', category: 'Decisão clínica' },
      ],
      feedbackCorrect: 'Você separou o que produz a imagem do que decide sobre ela.',
      feedbackIncorrect: 'Pergunte de cada ação: ela produz a imagem ou decide algo a partir dela?' },
    { ...keep(3), type: 'multi-select', prompt: 'Marque todas as medidas que reduzem a dose.',
      options: [
        { label: 'Usar o dosímetro', correct: false, feedback: 'O dosímetro mede a dose; não reduz.' },
        { label: 'Aumentar a distância', correct: true, feedback: 'A distância reduz a dose recebida.' },
        { label: 'Apressar o paciente', correct: false, feedback: 'Pressa não é medida de proteção.' },
        { label: 'Vestir o avental', correct: true, feedback: 'O avental reduz a dose no tronco.' },
      ],
      feedbackCorrect: 'Você marcou as duas medidas de proteção e deixou de fora as outras.',
      feedbackIncorrect: 'Releia o conceito: proteção é o que diminui a dose, não o que a mede.' });
  return doc;
}
function newDefect(mutate) {
  assert.deepEqual(lintUnit(withNewFamilies()), [], 'a aula com as famílias novas precisa passar antes do defeito');
  const doc = withNewFamilies();
  mutate(doc.lessons[0].interactions);
  return lintUnit(doc);
}

test('famílias da 1.6: a aula com cloze, true-false, categorize e multi-select passa', () => {
  assert.deepEqual(lintUnit(withNewFamilies()), []);
});

const NEW_FAMILY_DEFECTS = [
  ['cloze sem marcador de lacuna para cada resposta', ([, c]) => { c.text = 'O {{1}} reduz a dose.'; }, /lacuna/],
  ['cloze com três lacunas', ([, c]) => { c.text = 'O {{1}} reduz a {{2}} no {{3}}.'; c.answers.push('dose'); }, /1 ou 2 lacunas/],
  ['cloze com um distrator só', ([, c]) => { c.distractors = ['relógio']; }, /de 2 a 4 distratores/],
  ['cloze com palavra repetida no banco', ([, c]) => { c.distractors = ['Avental', 'cabelo']; }, /banco repetid/],
  ['cloze com resposta mais longa', ([, c]) => { c.answers[0] = 'avental plumbífero de corpo inteiro'; }, /mais longa/],
  ['true-false com veredito constante', ([, , t]) => { t.statements.forEach(s => { s.correct = true; }); }, /certa e ao menos uma errada/],
  ['true-false com afirmação certa mais longa', ([, , t]) => { t.statements[0].text = 'A distância da fonte reduz a dose recebida, porque a radiação se espalha e perde intensidade.'; }, /mais longa/],
  ['true-false com veredito em texto', ([, , t]) => { t.statements[1].correct = 'false'; }, /true ou false/],
  ['true-false com duas afirmações', ([, , t]) => { t.statements.pop(); }, /de 3 a 4 afirmações/],
  ['categorize com item de grupo desconhecido', ([, , , g]) => { g.items[0].category = 'Outro'; }, /grupo desconhecido/],
  ['categorize com grupo vazio', ([, , , g]) => { g.items.forEach(i => { i.category = 'Tarefa técnica'; }); }, /grupo sem item/],
  ['categorize com item que entrega o grupo', ([, , , g]) => { g.items[2].label = 'Escrever o laudo (decisão clínica)'; }, /entrega o grupo/],
  ['categorize com três itens', ([, , , g]) => { g.items.pop(); }, /de 4 a 6 itens/],
  ['multi-select com uma correta só', ([, , , , m]) => { m.options[3].correct = false; }, /de 2 a/],
  ['multi-select com corretas no topo', ([, , , , m]) => { m.options.sort((a, b) => Number(b.correct) - Number(a.correct)); }, /no topo/],
  ['multi-select com correta mais longa', ([, , , , m]) => { m.options[1].label = 'Aumentar a distância entre a fonte e quem está na sala'; }, /mais longa/],
  ['retorno de erro igual ao de acerto', ([, c]) => { c.feedbackIncorrect = c.feedbackCorrect; }, /retorno de erro igual/],
];
for (const [name, mutate, pattern] of NEW_FAMILY_DEFECTS) {
  test(`famílias da 1.6: reprova ${name}`, () => expectOnly(newDefect(mutate), pattern));
}
