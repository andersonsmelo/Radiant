import assert from 'node:assert/strict';
import { execFileSync, spawnSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { test } from 'node:test';
import { fileURLToPath } from 'node:url';
import { lintUnit, targetErrors } from './rtg-lesson-lint.mjs';

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

const IMAGES = [{ id: 'image:rtg-2026:m01:a', width: 800, height: 1000 }, { id: 'image:rtg-2026:m01:b', width: 800, height: 1000 }];
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

// Achado 4 da revisão de 2026-11-13: com a mesma contagem de certas em todo
// true-false da unidade, a última afirmação se deduz das anteriores.
test('famílias da 1.6: reprova unidade com a mesma contagem de certas em todos os true-false', () => {
  const doc = withNewFamilies();
  const base = doc.lessons[0].interactions[2];
  for (const lesson of doc.lessons.slice(1, 3)) lesson.interactions.splice(2, 1, { ...JSON.parse(JSON.stringify(base)), prompt: `${base.prompt} Aula ${lesson.id}.` });
  expectOnly(lintUnit(doc), /contagem de certas/);
  doc.lessons[1].interactions[2].statements[0].correct = false;
  doc.lessons[1].interactions[2].statements[0].feedback = 'Errado aqui: o texto foi trocado para variar a contagem.';
  assert.deepEqual(lintUnit(doc).filter(error => /contagem de certas/.test(error)), []);
});

// Base internacional (guia, regra 1.4): lei, norma e órgão de um país reprovam em qualquer campo de texto.
test('referência nacional reprova no conceito', () => {
  expectOnly(defect(doc => { doc.lessons[0].concept.body += ' A RDC 611 pede isso.'; }), /referência nacional "RDC 611"/);
});
test('referência nacional reprova no retorno de uma alternativa da conferência', () => {
  expectOnly(defect(doc => { doc.lessons[0].checkpoint[0].options[0].feedback += ' É o que a lei exige.'; }), /referência nacional "lei"/);
});
test('referência nacional reprova no título de uma fonte', () => {
  expectOnly(defect(doc => { doc.sources[0].title = 'RDC nº 611, de 9 de março de 2022'; }), /sources\[0\]\.title: referência nacional "RDC nº 611"/);
});
test('referência nacional reprova em campo que nenhuma outra régua lê', () => {
  expectOnly(defect(doc => { doc.lessons[0].diagramIdeas = ['Placa exigida pela Anvisa na porta.']; }), /referência nacional "Anvisa"/);
});
test('lei física e endereço de fonte não contam como referência nacional', () => {
  const doc = fixture();
  doc.lessons[0].concept.keyPoints[0] = 'A lei do inverso do quadrado vale.';
  doc.sources[0].url = 'https://www.gov.br/anvisa/pt-br/rdc-611';
  assert.deepEqual(lintUnit(doc).filter(error => /referência nacional/.test(error)), []);
});

// Formato `hotspot` (fase B, tarefa 3): figura por imageId ou diagramId, e alvos tocáveis dentro do quadro.
const hotspotRegions = () => [
  { label: 'Fonte de raios X', x: 0.1, y: 0.1, width: 0.2, height: 0.2, correct: true },
  { label: 'Detector plano', x: 0.6, y: 0.1, width: 0.2, height: 0.2 },
  { label: 'Paciente', x: 0.1, y: 0.6, width: 0.2, height: 0.2 },
  { label: 'Colimador', x: 0.6, y: 0.6, width: 0.2, height: 0.2 },
];
function hotspot(mutate = () => {}) {
  const doc = fixture();
  const old = doc.lessons[0].interactions[1];
  doc.lessons[0].interactions[1] = {
    id: old.id, type: 'hotspot', role: 'practice', help: old.help, sourceIds: old.sourceIds,
    prompt: 'Toque na parte que produz o feixe de raios X.', diagramId: 'tubo-raios-x', regions: hotspotRegions(),
    feedbackCorrect: 'Isso mesmo: o tubo é a fonte que produz o feixe.',
    feedbackIncorrect: 'Não é essa parte: procure onde o feixe nasce, no tubo.',
  };
  mutate(doc.lessons[0].interactions[1]);
  return lintUnit(doc, { images: IMAGES });
}
test('hotspot: aceita figura por diagramId e por imageId registrada', () => {
  assert.deepEqual(hotspot(), []);
  assert.deepEqual(hotspot(item => { delete item.diagramId; item.imageId = 'image:rtg-2026:m01:a'; }), []);
});
test('hotspot: exige exatamente um de imageId e diagramId, e que existam no registro', () => {
  expectOnly(hotspot(item => { item.imageId = 'image:rtg-2026:m01:a'; }), /exatamente um de imageId e diagramId/);
  expectOnly(hotspot(item => { delete item.diagramId; }), /exatamente um de imageId e diagramId/);
  expectOnly(hotspot(item => { item.diagramId = 'nao-existe'; }), /diagrama fora do registro: nao-existe/);
  expectOnly(hotspot(item => { delete item.diagramId; item.imageId = 'image:rtg-2026:m01:z'; }), /imagem fora do registro: image:rtg-2026:m01:z/);
});
test('hotspot: a régua de 3 a 6 alvos, chamada sozinha, sem as regras do hotspot por cima', () => {
  const at = n => ({ label: `Alvo ${n}`, x: 0.1 + (n % 3) * 0.3, y: 0.1 + Math.floor(n / 3) * 0.4, width: 0.2, height: 0.2 });
  const some = count => Array.from({ length: count }, (_, n) => at(n));
  assert.deepEqual(targetErrors('alvos', some(2)), ['alvos: de 3 a 6 alvos']);
  assert.deepEqual(targetErrors('alvos', some(7)), ['alvos: de 3 a 6 alvos']);
  assert.deepEqual(targetErrors('alvos', some(3)), []);
  assert.deepEqual(targetErrors('alvos', some(6)), []);
});
test('hotspot: a régua do hotspot repete a contagem pelo verificador inteiro', () => {
  expectOnly(hotspot(item => { item.regions.pop(); item.regions.pop(); }), /de 3 a 6 alvos|ao menos 2 regiões erradas/);
});
test('hotspot: região dentro do quadro, a cada eixo', () => {
  expectOnly(hotspot(item => { item.regions[1].x = 0.9; }), /alvo fora do quadro|sai da figura/);
  expectOnly(hotspot(item => { item.regions[1].y = 0.85; }), /alvo fora do quadro|sai da figura/);
  const negative = (field, value) => hotspot(item => { Object.assign(item.regions[1], { x: 0.35, y: 0.1, [field]: value }); });
  assert.ok(negative('y', -0.05).some(error => /alvo fora do quadro/.test(error)), 'y negativo');
  assert.ok(negative('x', -0.05).some(error => /alvo fora do quadro/.test(error)), 'x negativo');
});
test('hotspot: a área de toque de 44 pt, centrada, tem de caber na figura (borda direita)', () => {
  expectOnly(hotspot(item => { Object.assign(item.regions[1], { x: 0.92, width: 0.08 }); }), /sai da figura/);
});
test('hotspot: as áreas de toque não se sobrepõem, mesmo com região baixa ou dentro de outra região', () => {
  // Cenário do revisor: regiões de altura 0,08 com centros a 0,17 na vertical (35,7 pt numa figura de 210 pt).
  expectOnly(hotspot(item => {
    Object.assign(item.regions[2], { x: 0.4, y: 0.3, width: 0.3, height: 0.08 });
    Object.assign(item.regions[3], { x: 0.4, y: 0.47, width: 0.3, height: 0.08 });
  }), /alvos muito próximos/);
  expectOnly(hotspot(item => { Object.assign(item.regions[1], { x: 0.12, y: 0.12, width: 0.1, height: 0.1 }); }), /alvos muito próximos/);
  expectOnly(hotspot(item => { Object.assign(item.regions[1], { x: 0.2, y: 0.1 }); }), /alvos muito próximos/);
  // Vizinhas que não se tocam passam.
  assert.deepEqual(hotspot(item => { Object.assign(item.regions[1], { x: 0.35, y: 0.1 }); }), []);
});
test('hotspot: a medição usa a proporção da figura (imagem alta fica mais folgada na vertical)', () => {
  const close = item => { Object.assign(item.regions[2], { x: 0.4, y: 0.5, width: 0.3, height: 0.08 }); Object.assign(item.regions[3], { x: 0.4, y: 0.63, width: 0.3, height: 0.08 }); };
  expectOnly(hotspot(item => { close(item); }), /alvos muito próximos/);
  assert.deepEqual(hotspot(item => { close(item); delete item.diagramId; item.imageId = 'image:rtg-2026:m01:a'; }), []);
});
test('hotspot: largura e altura mínimas só quando o alvo tem tamanho', () => {
  expectOnly(hotspot(item => { item.regions[1].width = 0.05; }), /menor que 0,08/);
  expectOnly(hotspot(item => { item.regions[1].height = 0.05; }), /menor que 0,08/);
  assert.deepEqual(hotspot(item => { item.regions[1].width = 0.08; item.regions[1].height = 0.08; }), []);
});
test('hotspot: exige width e height em todo alvo; ponto não vale', () => {
  expectOnly(hotspot(item => { item.regions[1] = { label: 'Detector plano', x: 0.7, y: 0.2 }; }), /alvo sem width e height/);
  expectOnly(hotspot(item => { delete item.regions[1].height; }), /alvo sem width e height/);
});
test('hotspot: alvo nulo ou com coordenada que não é número vira erro de forma, sem exceção', () => {
  expectOnly(hotspot(item => { item.regions[1] = null; }), /objeto esperado|texto ausente ou curto/);
  expectOnly(hotspot(item => { item.regions[1].x = '0.6'; }), /devem ser números/);
});
test('hotspot: rótulos únicos, de 2 a 40 caracteres', () => {
  expectOnly(hotspot(item => { item.regions[1].label = 'fonte de raios x'; }), /rótulo repetido/);
  expectOnly(hotspot(item => { item.regions[1].label = 'D'; }), /texto ausente ou curto/);
  expectOnly(hotspot(item => { item.regions[1].label = 'Um rótulo de região muito mais longo que o limite'; }), /caracteres \(máx\. 40\)/);
});
test('hotspot: uma ou duas regiões certas e ao menos duas erradas', () => {
  expectOnly(hotspot(item => { item.regions[0].correct = undefined; }), /de 1 a 2 regiões certas/);
  expectOnly(hotspot(item => { item.regions[1].correct = true; item.regions[2].correct = true; }), /de 1 a 2 regiões certas/);
  expectOnly(hotspot(item => { item.regions[1].correct = true; item.regions[2].correct = true; item.regions.pop(); }), /de 1 a 2 regiões certas|ao menos 2 regiões erradas/);
  expectOnly(hotspot(item => { item.regions[1].correct = true; item.regions.pop(); }), /ao menos 2 regiões erradas/);
  expectOnly(hotspot(item => { item.regions[1].correct = false; }), /correct, quando existe, é true/);
});
test('hotspot: recusa chave fora da lista, na região e no item', () => {
  expectOnly(hotspot(item => { item.regions[1].cor = 'vermelho'; }), /campo desconhecido: cor/);
  expectOnly(hotspot(item => { item.alt = 'texto solto'; }), /campo desconhecido: alt/);
});
test('hotspot: retorno de erro igual ao de acerto reprova, como nas outras famílias', () => {
  expectOnly(hotspot(item => { item.feedbackIncorrect = item.feedbackCorrect; }), /retorno de erro igual ao de acerto/);
});
test('hotspot: diagramId não é texto de aula para a varredura de referência nacional', () => {
  // O id sintético contém um termo barrado; só a isenção de `diagramId` em NOT_TEXT o deixa passar nesta regra.
  assert.deepEqual(hotspot(item => { item.diagramId = 'RDC 611'; }).filter(error => /referência nacional/.test(error)), []);
  assert.ok(hotspot(item => { item.alt = 'RDC 611'; }).some(error => /referência nacional/.test(error)), 'controle: o termo reprova em campo de texto');
});

// Formato `label` (fase B, tarefa 4): pontos sem tamanho sobre a figura, rótulos e até dois distratores.
const labelPoints = () => [
  { label: 'Cátodo com filamento', x: 0.28, y: 0.44, where: 'à esquerda, a espiral dentro da capa' },
  { label: 'Ânodo', x: 0.72, y: 0.44, where: 'à direita, o bloco inclinado atingido pelos elétrons' },
  { label: 'Janela de saída', x: 0.68, y: 0.71, where: 'embaixo à direita, a abertura no vidro' },
  { label: 'Ampola de vidro', x: 0.375, y: 0.71, where: 'a parede curva que envolve todo o conjunto' },
];
function labelItem(mutate = () => {}) {
  const doc = fixture();
  const old = doc.lessons[0].interactions[1];
  doc.lessons[0].interactions[1] = {
    id: old.id, type: 'label', role: 'practice', help: old.help, sourceIds: old.sourceIds,
    prompt: 'Rotule as quatro partes do tubo de raios X.', diagramId: 'tubo-raios-x', points: labelPoints(), distractors: ['Fio de aterramento'],
    feedbackCorrect: 'Isso mesmo: cada parte do tubo tem a sua função.',
    feedbackIncorrect: 'Alguma parte está no lugar errado: releia o que cada uma faz no tubo.',
  };
  mutate(doc.lessons[0].interactions[1]);
  return lintUnit(doc, { images: IMAGES });
}
test('label: aceita figura por diagramId e por imageId registrada', () => {
  assert.deepEqual(labelItem(), []);
  assert.deepEqual(labelItem(item => { delete item.diagramId; item.imageId = 'image:rtg-2026:m01:a'; }), []);
  assert.deepEqual(labelItem(item => { delete item.distractors; }), []);
});
test('label: exige exatamente um de imageId e diagramId, existente no registro', () => {
  expectOnly(labelItem(item => { item.imageId = 'image:rtg-2026:m01:a'; }), /exatamente um de imageId e diagramId/);
  expectOnly(labelItem(item => { item.diagramId = 'nao-existe'; }), /diagrama fora do registro: nao-existe/);
});
test('label: de 3 a 6 pontos', () => {
  expectOnly(labelItem(item => { item.points.splice(2); }), /de 3 a 6 alvos/);
  const six = n => ({ label: `Parte ${n}`, where: `posição ${n} na figura`, x: 0.1 + (n % 3) * 0.3, y: 0.15 + Math.floor(n / 3) * 0.3 });
  assert.deepEqual(labelItem(item => { item.points = [0, 1, 2, 3, 4, 5].map(six); }), []);
  expectOnly(labelItem(item => { item.points = [0, 1, 2, 3, 4, 5, 6].map(six); }), /de 3 a 6 alvos/);
});
test('label: o ponto não tem largura nem altura', () => {
  expectOnly(labelItem(item => { Object.assign(item.points[1], { width: 0.1, height: 0.1 }); }), /campo desconhecido: width|campo desconhecido: height/);
});
test('label: where é obrigatório, de 8 a 60 caracteres, e entra na lista de chaves', () => {
  expectOnly(labelItem(item => { delete item.points[1].where; }), /texto ausente ou curto/);
  expectOnly(labelItem(item => { item.points[1].where = 'à direita'; item.points[1].where = 'curto'; }), /texto ausente ou curto/);
  expectOnly(labelItem(item => { item.points[1].where = 'à direita, o bloco inclinado atingido pelos elétrons, que fica ao lado do vidro'; }), /caracteres \(máx\. 60\)/);
});
test('label: where não nomeia a parte, a do próprio ponto nem a de outro, sem acento e sem caixa', () => {
  expectOnly(labelItem(item => { item.points[1].where = 'à direita, o ÂNODO da imagem'; }), /where nomeia uma das partes/);
  expectOnly(labelItem(item => { item.points[1].where = 'à direita, perto da janela de saida'; }), /where nomeia uma das partes/);
  expectOnly(labelItem(item => { item.points[1].where = 'à direita, o catodo com filamento'; }), /where nomeia uma das partes/);
});
test('label: where repetido entre os pontos reprova', () => {
  expectOnly(labelItem(item => { item.points[2].where = item.points[1].where.toUpperCase(); }), /where repetido|texto todo em caixa alta/);
  expectOnly(labelItem(item => { item.points[2].where = item.points[1].where; }), /where repetido/);
});
test('label: ponto dentro do quadro, a cada eixo', () => {
  expectOnly(labelItem(item => { item.points[1].x = 1.2; }), /alvo fora do quadro|sai da figura/);
  expectOnly(labelItem(item => { item.points[1].y = -0.1; }), /alvo fora do quadro|sai da figura/);
});
test('label: a área de toque de 44 pt, centrada no ponto, tem de caber na figura', () => {
  // Ponto no canto: o retângulo de 44 pt passa da borda mesmo com o ponto dentro do quadro.
  expectOnly(labelItem(item => { item.points[1].x = 0.97; }), /sai da figura/);
  expectOnly(labelItem(item => { item.points[1].y = 0.02; }), /sai da figura/);
  assert.deepEqual(labelItem(item => { item.points[1].x = 0.9; }), []);
});
test('label: as áreas de toque dos pontos não se sobrepõem', () => {
  expectOnly(labelItem(item => { Object.assign(item.points[1], { x: 0.35, y: 0.44 }); }), /alvos muito próximos/);
  expectOnly(labelItem(item => { Object.assign(item.points[2], { x: 0.4, y: 0.6 }); }), /alvos muito próximos/);
  assert.deepEqual(labelItem(item => { Object.assign(item.points[1], { x: 0.45, y: 0.44 }); }), []);
});
test('label: rótulos únicos entre pontos e distratores, de 2 a 40 caracteres', () => {
  expectOnly(labelItem(item => { item.points[1].label = 'cátodo com filamento'; }), /rótulo repetido/);
  expectOnly(labelItem(item => { item.distractors = ['ânodo']; }), /rótulo repetido/);
  expectOnly(labelItem(item => { item.distractors = ['Fio', 'fio']; }), /rótulo repetido/);
  expectOnly(labelItem(item => { item.points[1].label = 'Â'; }), /texto ausente ou curto/);
  expectOnly(labelItem(item => { item.distractors = ['Um rótulo de distrator muito mais longo que o limite']; }), /caracteres \(máx\. 40\)/);
});
test('label: de 0 a 2 distratores, em lista', () => {
  assert.deepEqual(labelItem(item => { item.distractors = ['Fio', 'Cabo']; }), []);
  expectOnly(labelItem(item => { item.distractors = ['Fio', 'Cabo', 'Mola']; }), /de 0 a 2 distratores/);
  expectOnly(labelItem(item => { item.distractors = 'Fio'; }), /de 0 a 2 distratores/);
});
test('label: recusa chave fora da lista, no ponto e no item', () => {
  expectOnly(labelItem(item => { item.points[1].cor = 'azul'; }), /campo desconhecido: cor/);
  expectOnly(labelItem(item => { item.regions = []; }), /campo desconhecido: regions/);
});
test('label: retorno de erro igual ao de acerto reprova, como nas outras famílias', () => {
  expectOnly(labelItem(item => { item.feedbackIncorrect = item.feedbackCorrect; }), /retorno de erro igual ao de acerto/);
});

// Formato `risk-hunt` (fase B, tarefa 5): regiões com tamanho sobre a figura, algumas de risco, cada uma com a explicação.
const riskRegions = () => [
  { label: 'Porta da sala aberta', x: 0.02, y: 0.08, width: 0.15, height: 0.82, risk: true, feedback: 'A porta aberta com a lâmpada acesa expõe o corredor à radiação espalhada.' },
  { label: 'Operador atrás do biombo', x: 0.7, y: 0.43, width: 0.17, height: 0.47, risk: false, feedback: 'Atrás do biombo o operador fica protegido do espalhamento.' },
  { label: 'Campo de luz sobre o paciente inteiro', x: 0.18, y: 0.26, width: 0.33, height: 0.4, risk: true, feedback: 'Um campo que cobre o paciente inteiro expõe tecido sem necessidade.' },
  { label: 'Acompanhante ao lado da mesa', x: 0.56, y: 0.45, width: 0.1, height: 0.45, risk: true, feedback: 'Quem fica ao lado da mesa na exposição recebe radiação espalhada.' },
  { label: 'Avental no suporte', x: 0.85, y: 0.17, width: 0.11, height: 0.24, risk: false, feedback: 'O avental guardado no suporte não expõe ninguém.' },
];
function riskHunt(mutate = () => {}) {
  const doc = fixture();
  const old = doc.lessons[0].interactions[3];
  doc.lessons[0].interactions[3] = {
    id: old.id, type: 'risk-hunt', role: 'safety', criticalSafety: true, help: old.help, sourceIds: old.sourceIds,
    prompt: 'Toque em todas as situações de risco que você vê na sala de raios X.', diagramId: 'sala-com-riscos', regions: riskRegions(),
    feedbackCorrect: 'Isso mesmo: você achou os riscos e deixou de fora o que está certo.',
    feedbackIncorrect: 'Releia a cena: alguma situação de risco ficou de fora, ou uma correta foi marcada.',
  };
  mutate(doc.lessons[0].interactions[3]);
  return lintUnit(doc, { images: IMAGES });
}
test('risk-hunt: aceita figura por diagramId e por imageId registrada', () => {
  assert.deepEqual(riskHunt(), []);
  assert.deepEqual(riskHunt(item => { delete item.diagramId; item.imageId = 'image:rtg-2026:m01:a'; }), []);
});
test('risk-hunt: exige exatamente um de imageId e diagramId, existente no registro', () => {
  expectOnly(riskHunt(item => { item.imageId = 'image:rtg-2026:m01:a'; }), /exatamente um de imageId e diagramId/);
  expectOnly(riskHunt(item => { item.diagramId = 'nao-existe'; }), /diagrama fora do registro: nao-existe/);
});
test('risk-hunt: de 4 a 6 regiões', () => {
  expectOnly(riskHunt(item => { item.regions.pop(); item.regions.pop(); }), /de 4 a 6 alvos|de 2 a \d+ regiões de risco/);
  expectOnly(riskHunt(item => { item.regions.pop(); item.regions[0].risk = false; item.regions[2].risk = false; }), /de 2 a \d+ regiões de risco/);
  const extra = n => ({ label: `Região extra ${n}`, x: 0.3 + n * 0.1, y: 0.7, width: 0.09, height: 0.2, risk: false, feedback: `Esta situação extra ${n} está correta e não expõe ninguém.` });
  expectOnly(riskHunt(item => { item.regions.push(extra(0), extra(1)); }), /de 4 a 6 alvos/);
});
test('risk-hunt: toda região tem width e height; ponto não vale', () => {
  expectOnly(riskHunt(item => { item.regions[3] = { label: 'Acompanhante ao lado da mesa', x: 0.56, y: 0.5, risk: true, feedback: 'Quem fica ao lado da mesa recebe radiação espalhada.' }; }), /alvo sem width e height/);
});
test('risk-hunt: região dentro do quadro e com a área de toque de 44 pt dentro da figura', () => {
  expectOnly(riskHunt(item => { item.regions[4].x = 0.95; }), /alvo fora do quadro|sai da figura/);
  expectOnly(riskHunt(item => { Object.assign(item.regions[4], { x: 0.9, width: 0.09 }); }), /sai da figura/);
});
test('risk-hunt: as áreas de toque das regiões não se sobrepõem', () => {
  expectOnly(riskHunt(item => { Object.assign(item.regions[3], { x: 0.5, width: 0.1 }); }), /alvos muito próximos/);
  expectOnly(riskHunt(item => { Object.assign(item.regions[4], { x: 0.68, y: 0.5 }); }), /alvos muito próximos/);
});
test('risk-hunt: risk é booleano em toda região, e de 2 a n-1 são de risco', () => {
  expectOnly(riskHunt(item => { item.regions[0].risk = 'true'; }), /risk deve ser true ou false/);
  expectOnly(riskHunt(item => { delete item.regions[1].risk; }), /risk deve ser true ou false/);
  expectOnly(riskHunt(item => { item.regions[0].risk = false; item.regions[2].risk = false; }), /de 2 a 4 regiões de risco/);
  expectOnly(riskHunt(item => { item.regions[1].risk = true; item.regions[4].risk = true; }), /de 2 a 4 regiões de risco/);
  assert.deepEqual(riskHunt(item => { item.regions[4].risk = true; }), []);
});
test('risk-hunt: os riscos todos no topo da lista entregam a resposta pela posição', () => {
  const top = item => { item.regions = [2, 3, 0, 1, 4].map(i => item.regions[i]); };
  expectOnly(riskHunt(top), /os riscos estão todos no topo da lista; intercale/);
  assert.deepEqual(riskHunt(item => { top(item); [item.regions[0], item.regions[3]] = [item.regions[3], item.regions[0]]; }), []);
});
test('risk-hunt: o retorno de cada região tem de 25 a 260 caracteres e não se repete', () => {
  expectOnly(riskHunt(item => { item.regions[0].feedback = 'Curto.'; }), /texto ausente ou curto/);
  expectOnly(riskHunt(item => { item.regions[1].feedback = item.regions[0].feedback; }), /retornos repetidos/);
});
test('risk-hunt: rótulos únicos, de 2 a 40 caracteres', () => {
  expectOnly(riskHunt(item => { item.regions[1].label = 'porta da sala aberta'; }), /rótulo repetido/);
  expectOnly(riskHunt(item => { item.regions[1].label = 'C'; }), /texto ausente ou curto/);
  expectOnly(riskHunt(item => { item.regions[1].label = 'Um rótulo de região muito mais longo que o limite'; }), /caracteres \(máx\. 40\)/);
});
test('risk-hunt: recusa chave fora da lista, na região e no item', () => {
  expectOnly(riskHunt(item => { item.regions[1].cor = 'vermelho'; }), /campo desconhecido: cor/);
  expectOnly(riskHunt(item => { item.points = []; }), /campo desconhecido: points/);
});
test('risk-hunt: retorno de erro igual ao de acerto reprova, como nas outras famílias', () => {
  expectOnly(riskHunt(item => { item.feedbackIncorrect = item.feedbackCorrect; }), /retorno de erro igual ao de acerto/);
});

// Formato `conversation` (fase B, tarefa 7): 2 ou 3 turnos, 2 ou 3 respostas por turno, uma correta, cada resposta com a reação.
const conversationTurns = () => [
  { line: 'Cheguei na sala e não sei onde prender o meu dosímetro individual. Onde ele fica?',
    options: [
      { label: 'Qualquer lugar serve, o importante é estar com você no turno.', correct: false, reply: 'Então fico tranquila e deixo no bolso.' },
      { label: 'Prenda na altura do tronco, como o plano do setor manda.', correct: true, reply: 'Entendi, vou prender aí agora.' },
      { label: 'Deixe guardado no armário durante todo o exame.', correct: false, reply: 'Mas eu queria conferir a leitura depois.' },
    ] },
  { line: 'E se eu esquecer o dosímetro em casa? Posso entrar na sala assim mesmo?',
    options: [
      { label: 'Avise a supervisão antes: sem dosímetro, não entre.', correct: true, reply: 'Combinado, falo com a supervisão agora.' },
      { label: 'Entre sem ele e anote depois que esqueceu em casa.', correct: false, reply: 'Tá, então eu anoto no fim do turno.' },
      { label: 'Pegue o de um colega só por hoje, para não atrasar.', correct: false, reply: 'Vou pedir emprestado, então.' },
    ] },
];
function conversationItem(mutate = () => {}) {
  const doc = fixture();
  const old = doc.lessons[0].interactions[1];
  doc.lessons[0].interactions[1] = {
    id: old.id, type: 'conversation', role: 'practice', help: old.help, sourceIds: old.sourceIds, speaker: 'duda',
    prompt: 'Duda está no primeiro dia de estágio. Ajude-a a conduzir o turno.', turns: conversationTurns(),
    feedbackCorrect: 'Isso mesmo: o dosímetro fica no tronco, e sem ele você avisa antes de entrar.',
    feedbackIncorrect: 'Reveja o turno: o uso segue o plano do setor, e a falta do dosímetro se avisa antes.',
  };
  mutate(doc.lessons[0].interactions[1]);
  return lintUnit(doc);
}
test('conversation: aceita 2 ou 3 turnos, com e sem name, com 2 ou 3 respostas', () => {
  assert.deepEqual(conversationItem(), []);
  assert.deepEqual(conversationItem(item => { item.speaker = 'paciente'; item.name = 'Sr. Álvaro'; }), []);
  assert.deepEqual(conversationItem(item => { item.turns.push({ line: 'Mais alguma coisa antes de eu começar?',
    options: [{ label: 'Pode começar logo, sem olhar o pedido do exame.', correct: false, reply: 'Certo, começo.' }, { label: 'Confira o pedido do exame.', correct: true, reply: 'Boa, vou conferir.' }] }); }), []);
});
test('conversation: o paciente exige name, e o Pixel não pode ser o interlocutor', () => {
  expectOnly(conversationItem(item => { item.speaker = 'paciente'; }), /fala de paciente precisa de name/);
  expectOnly(conversationItem(item => { item.speaker = 'pixel'; }), /speaker deve ser lia, caio, duda ou paciente/);
  expectOnly(conversationItem(item => { item.speaker = 'fulano'; }), /speaker deve ser/);
});
test('conversation: 2 ou 3 turnos e de 2 a 3 respostas por turno', () => {
  expectOnly(conversationItem(item => { item.turns.splice(1); }), /2 ou 3 turnos/);
  expectOnly(conversationItem(item => { item.turns.push(...conversationTurns()); }), /2 ou 3 turnos/);
  expectOnly(conversationItem(item => { item.turns[1].options.splice(1); }), /de 2 a 3 respostas/);
  expectOnly(conversationItem(item => { item.turns[0].options.push({ label: 'Outra resposta possível.', correct: false, reply: 'Hum, certo.' }); }), /de 2 a 3 respostas/);
});
test('conversation: exatamente uma correta por turno, booleana', () => {
  expectOnly(conversationItem(item => { item.turns[0].options[0].correct = true; }), /exatamente 1 resposta correta/);
  expectOnly(conversationItem(item => { item.turns[0].options[1].correct = false; }), /exatamente 1 resposta correta/);
  expectOnly(conversationItem(item => { item.turns[0].options[0].correct = 'false'; }), /correct deve ser true ou false/);
});
test('conversation: a correta não é a mais longa do turno', () => {
  expectOnly(conversationItem(item => { item.turns[1].options[0].label += ' com todo o cuidado do mundo'; }), /a resposta correta é a mais longa do turno/);
});
test('conversation: a posição da correta varia entre os turnos', () => {
  expectOnly(conversationItem(item => { const options = item.turns[1].options; [options[0], options[1]] = [options[1], options[0]]; }), /mesma posição em todos os turnos/);
});
test('conversation: limites de texto da fala, da reação e da resposta', () => {
  expectOnly(conversationItem(item => { item.turns[0].line = 'a'.repeat(201); }), /caracteres \(máx\. 200\)/);
  expectOnly(conversationItem(item => { item.turns[0].options[0].reply = `${'a'.repeat(201)}`; }), /caracteres \(máx\. 200\)/);
  expectOnly(conversationItem(item => { item.turns[1].options[1].label = `${'a'.repeat(121)}`; }), /caracteres \(máx\. 120\)|a mais longa/);
  assert.deepEqual(conversationItem(item => { item.turns[0].line = `${'a'.repeat(199)}.`; }), []);
});
test('conversation: respostas e reações repetidas no turno reprovam', () => {
  expectOnly(conversationItem(item => { item.turns[1].options[1].reply = item.turns[1].options[0].reply; }), /reações repetidas/);
  expectOnly(conversationItem(item => { item.turns[1].options[1].label = item.turns[1].options[0].label.toUpperCase().toLowerCase(); }), /respostas repetidas/);
});
test('conversation: recusa chave fora da lista, no item, no turno e na resposta', () => {
  expectOnly(conversationItem(item => { item.regions = []; }), /campo desconhecido: regions/);
  expectOnly(conversationItem(item => { item.turns[0].tom = 'alegre'; }), /campo desconhecido: tom/);
  expectOnly(conversationItem(item => { item.turns[0].options[0].feedback = 'x'; }), /campo desconhecido: feedback/);
});
test('conversation: retorno de erro igual ao de acerto reprova, como nas outras famílias', () => {
  expectOnly(conversationItem(item => { item.feedbackIncorrect = item.feedbackCorrect; }), /retorno de erro igual ao de acerto/);
});
test('conversation: referência nacional na fala do personagem reprova', () => {
  assert.ok(conversationItem(item => { item.turns[0].line = 'Isso segue a RDC 611, certo?'; }).some(error => /referência nacional/.test(error)));
});

// Formato `blitz` (fase B, tarefa 8): de 6 a 8 afirmações de até 110 caracteres, de 2 a n-2 verdadeiras, sem três iguais no começo.
const blitzStatements = () => [
  { text: 'Quanto maior a distância da fonte, menor é a dose recebida.', correct: true, feedback: 'Longe da fonte a dose cai, porque a radiação se espalha por uma área maior.' },
  { text: 'O dosímetro individual reduz a dose que a pessoa recebe.', correct: false, feedback: 'O dosímetro só registra a dose; quem a reduz é a distância, o tempo e a blindagem.' },
  { text: 'O avental de chumbo protege o tronco da radiação espalhada.', correct: true, feedback: 'O avental cobre o tronco e atenua a radiação que se espalha na sala.' },
  { text: 'Quanto mais tempo na sala durante a exposição, menor é a dose.', correct: false, feedback: 'Mais tempo de exposição aumenta a dose; reduzir o tempo reduz a dose.' },
  { text: 'Material com rachadura sai de uso e a supervisão é avisada.', correct: true, feedback: 'Material danificado não protege direito e o aviso evita que o problema se esconda.' },
  { text: 'Registrar o uso do dosímetro é opcional em turnos curtos.', correct: false, feedback: 'O registro vale em todo turno, porque mostra o uso e o desgaste do material.' },
];
function blitzItem(mutate = () => {}) {
  const doc = fixture();
  const old = doc.lessons[0].interactions[1];
  doc.lessons[0].interactions[1] = {
    id: old.id, type: 'blitz', role: 'practice', help: old.help, sourceIds: old.sourceIds, statements: blitzStatements(),
    prompt: 'Responda verdadeiro ou falso a cada afirmação sobre a proteção no turno.',
    feedbackCorrect: 'Isso mesmo: você separou o que protege do que expõe, no ritmo da rodada.',
    feedbackIncorrect: 'Reveja as afirmações: cada uma tem a própria explicação no retorno.',
  };
  mutate(doc.lessons[0].interactions[1]);
  return lintUnit(doc);
}
const extraStatement = (n, correct) => ({ text: `Afirmação extra número ${n} sobre o turno.`, correct, feedback: `Retorno próprio e distinto da afirmação extra ${n}.` });
test('blitz: aceita de 6 a 8 afirmações', () => {
  assert.deepEqual(blitzItem(), []);
  assert.deepEqual(blitzItem(item => { item.statements.push(extraStatement(7, false), extraStatement(8, true)); }), []);
});
test('blitz: de 6 a 8 afirmações, e correct booleano', () => {
  expectOnly(blitzItem(item => { item.statements.splice(5); }), /de 6 a 8 afirmações/);
  expectOnly(blitzItem(item => { item.statements.push(extraStatement(7, false), extraStatement(8, true), extraStatement(9, false)); }), /de 6 a 8 afirmações/);
  expectOnly(blitzItem(item => { item.statements[0].correct = 'true'; }), /correct deve ser true ou false/);
});
test('blitz: de 2 a n-2 verdadeiras', () => {
  expectOnly(blitzItem(item => { item.statements.forEach((st, i) => { st.correct = i === 1; }); }), /de 2 a 4 afirmações verdadeiras/);
  expectOnly(blitzItem(item => { item.statements.forEach((st, i) => { st.correct = i !== 1; }); }), /de 2 a 4 afirmações verdadeiras/);
  expectOnly(blitzItem(item => { item.statements.forEach((st) => { st.correct = false; }); }), /de 2 a 4 afirmações verdadeiras|mesma resposta/);
  // 2 e 4 de 6 ainda passam
  assert.deepEqual(blitzItem(item => { item.statements.forEach((st, i) => { st.correct = [0, 3].includes(i); }); }), []);
  assert.deepEqual(blitzItem(item => { item.statements.forEach((st, i) => { st.correct = [0, 1, 3, 5].includes(i); }); }), []);
});
test('blitz: três iguais seguidas no começo reprovam, e duas não', () => {
  expectOnly(blitzItem(item => { item.statements.forEach((st, i) => { st.correct = [0, 1, 2].includes(i) ? true : i === 3; }); }), /três primeiras afirmações têm a mesma resposta/);
  assert.deepEqual(blitzItem(item => { item.statements.forEach((st, i) => { st.correct = [0, 1, 3].includes(i) || i === 5; }); }), []);
});
test('blitz: texto de 15 a 110 caracteres e retorno de 25 a 260', () => {
  expectOnly(blitzItem(item => { item.statements[0].text = `${'a'.repeat(110)}.`; }), /caracteres \(máx\. 110\)/);
  expectOnly(blitzItem(item => { item.statements[0].text = 'Curta demais.'; }), /texto ausente ou curto/);
  assert.deepEqual(blitzItem(item => { item.statements[0].text = `${'a'.repeat(109)}.`; }), []);
  expectOnly(blitzItem(item => { item.statements[0].feedback = 'Muito curto.'; }), /texto ausente ou curto/);
});
test('blitz: afirmação ou retorno repetido reprova', () => {
  expectOnly(blitzItem(item => { item.statements[1].text = item.statements[0].text.toUpperCase().toLowerCase(); }), /afirmação ou retorno repetido/);
  expectOnly(blitzItem(item => { item.statements[1].feedback = item.statements[0].feedback; }), /afirmação ou retorno repetido/);
});
test('blitz: recusa chave fora da lista, no item e na afirmação', () => {
  expectOnly(blitzItem(item => { item.passCount = 5; }), /campo desconhecido: passCount/);
  expectOnly(blitzItem(item => { item.statements[0].tempo = 10; }), /campo desconhecido: tempo/);
});
test('blitz: retorno de erro igual ao de acerto reprova, como nas outras famílias', () => {
  expectOnly(blitzItem(item => { item.feedbackIncorrect = item.feedbackCorrect; }), /retorno de erro igual ao de acerto/);
});

// `visual` no conceito (fase B, tarefa 6): um diagrama do registro; unidade nova com visual tem corpo de até 80 palavras.
const withVisual = (mutate = () => {}, { unit = 'm01' } = {}) => {
  const doc = fixture();
  if (unit !== 'm01') {
    doc.unit.id = unit;
    doc.lessons.forEach((lesson, i) => { lesson.id = `${unit}-0${i + 1}`; });
  }
  doc.lessons[0].concept.visual = 'colimador-abrindo';
  mutate(doc.lessons[0].concept);
  return lintUnit(doc);
};
const bodyOf = (n) => Array.from({ length: n }, (_, i) => (i === 0 ? 'Conferir' : 'palavra')).join(' ');
test('visual: um diagrama do registro passa; id fora do registro reprova', () => {
  assert.deepEqual(withVisual(), []);
  expectOnly(withVisual(concept => { concept.visual = 'diagrama-que-nao-existe'; }), /concept\.visual: diagrama fora do registro: diagrama-que-nao-existe/);
  expectOnly(withVisual(concept => { concept.visual = ''; }), /concept\.visual: diagrama fora do registro/);
});
test('visual: chave do conceito fora de title, body, keyPoints e visual reprova', () => {
  expectOnly(withVisual(concept => { concept.visuall = 'colimador-abrindo'; }), /concept: campo desconhecido: visuall/);
  expectOnly(defect(doc => { doc.lessons[0].concept.imagem = 'x'; }), /concept: campo desconhecido: imagem/);
});
test('visual: o limite de 80 palavras vale para unidade nova e só com visual', () => {
  assert.deepEqual(withVisual(concept => { concept.body = bodyOf(80); }, { unit: 'm17' }), []);
  expectOnly(withVisual(concept => { concept.body = bodyOf(81); }, { unit: 'm17' }), /concept\.body: 81 palavras \(máx\. 80 com visual\)/);
  // Sem visual, a unidade nova mantém 110.
  assert.deepEqual(defect(doc => { doc.unit.id = 'm17'; doc.lessons.forEach((l, i) => { l.id = `m17-0${i + 1}`; }); doc.lessons[0].concept.body = bodyOf(100); }), []);
});
test('visual: unidade antiga com visual mantém 110 palavras', () => {
  assert.deepEqual(withVisual(concept => { concept.body = bodyOf(100); }), []);
  expectOnly(withVisual(concept => { concept.body = bodyOf(111); }), /concept\.body: 111 palavras \(máx\. 110\)/);
});

// Formato `bench` (fase B, tarefa 10): bancada de exposição ou de colimação, com controles, alvo, fantoma e dicas por lado.
function benchItem(mutate = () => {}) {
  const doc = fixture();
  const old = doc.lessons[0].interactions[1];
  doc.lessons[0].interactions[1] = {
    id: old.id, type: 'bench', role: 'practice', help: old.help, sourceIds: old.sourceIds,
    prompt: 'Suba a tensão do tubo até 90 kV e veja o contraste do fantoma mudar.',
    simulator: 'exposure', mode: 'challenge',
    controls: [{ id: 'kv', label: 'Tensão', unit: 'kV', min: 40, max: 120, step: 10, initial: 60 }],
    goal: { kind: 'reach', control: 'kv', atLeast: 90 },
    phantomLabel: 'Fantoma simulado',
    hints: { tooLow: 'Ainda falta tensão: suba o kV até o contraste aparecer.', tooHigh: 'Passou do ponto: desça o kV até o alvo.' },
    feedbackCorrect: 'Isso mesmo: com 90 kV o feixe atravessa o fantoma e o contraste aparece.',
    feedbackIncorrect: 'Ainda não chegou: observe a imagem enquanto muda o kV e compare com o alvo.',
  };
  mutate(doc.lessons[0].interactions[1]);
  return lintUnit(doc);
}
const collimationBench = (item) => {
  item.simulator = 'collimation';
  item.controls = [{ id: 'fieldWidth', label: 'Largura do campo', unit: 'cm', min: 5, max: 35, step: 1, initial: 30 }, { id: 'fieldHeight', label: 'Altura do campo', unit: 'cm', min: 5, max: 43, step: 1, initial: 40 }];
  item.goal = { kind: 'reach', control: 'fieldWidth', atMost: 15 };
  item.phantomLabel = 'Fantoma de tórax simulado';
};
test('bench: aceita exposição e colimação, nos três modos', () => {
  assert.deepEqual(benchItem(), []);
  assert.deepEqual(benchItem(item => { item.mode = 'explore'; }), []);
  assert.deepEqual(benchItem(item => { item.mode = 'correct'; }), []);
  assert.deepEqual(benchItem(collimationBench), []);
  assert.deepEqual(benchItem(item => { item.goal = { kind: 'match', reference: { kv: 80, mas: 10 }, tolerance: 0.05 }; item.controls.push({ id: 'mas', label: 'Carga', unit: 'mAs', min: 1, max: 100, step: 1, initial: 10 }); }), []);
});
test('bench: simulador e modo conhecidos', () => {
  expectOnly(benchItem(item => { item.simulator = 'ultrasound'; }), /bench: simulator deve ser exposure ou collimation/);
  expectOnly(benchItem(item => { item.mode = 'free'; }), /bench: mode deve ser explore, challenge ou correct/);
});
test('bench: recusa chave fora da lista, no item, no controle, no alvo e nas dicas', () => {
  expectOnly(benchItem(item => { item.tempo = 10; }), /campo desconhecido: tempo/);
  expectOnly(benchItem(item => { item.controls[0].passo = 10; }), /campo desconhecido: passo/);
  expectOnly(benchItem(item => { item.goal.limite = 3; }), /campo desconhecido: limite/);
  expectOnly(benchItem(item => { item.hints.middle = 'x'; }), /campo desconhecido: middle/);
});
test('bench: controles presentes, do simulador, com faixa e ponto de partida válidos', () => {
  expectOnly(benchItem(item => { delete item.controls; }), /bench: de 1 a 2 controles/);
  expectOnly(benchItem(item => { item.controls = []; }), /bench: de 1 a 2 controles/);
  expectOnly(benchItem(item => { item.controls[0].id = 'fieldWidth'; item.goal.control = 'fieldWidth'; }), /controle de outro simulador/);
  expectOnly(benchItem(item => { item.controls[0].min = 120; item.controls[0].initial = 120; }), /min deve ser menor que max/);
  expectOnly(benchItem(item => { item.controls[0].step = 0; }), /step deve ser positivo/);
  expectOnly(benchItem(item => { item.controls[0].initial = 130; }), /initial fora da faixa/);
  expectOnly(benchItem(item => { item.controls[0].max = '120'; }), /min, max, step e initial devem ser números/);
  expectOnly(benchItem(item => { item.controls[0].label = 'T'; }), /texto ausente ou curto/);
});
test('bench: o alvo aponta um controle da bancada, com limite dentro da faixa, e não se cumpre sozinho', () => {
  expectOnly(benchItem(item => { delete item.goal; }), /bench: goal ausente/);
  expectOnly(benchItem(item => { item.goal.kind = 'sum'; }), /bench: goal.kind deve ser reach ou match/);
  expectOnly(benchItem(item => { item.goal.control = 'mas'; }), /bench: o alvo aponta um controle que a bancada não tem/);
  expectOnly(benchItem(item => { delete item.goal.atLeast; }), /bench: o alvo precisa de atLeast ou atMost/);
  expectOnly(benchItem(item => { item.goal.atLeast = 130; }), /bench: limite do alvo fora da faixa do controle/);
  expectOnly(benchItem(item => { item.goal.atLeast = 60; }), /bench: o alvo já vale no ponto de partida/);
  expectOnly(benchItem(item => { item.goal = { kind: 'reach', control: 'kv', atMost: 90 }; }), /bench: o alvo já vale no ponto de partida/);
});
test('bench: algum passo do controle cai dentro do alvo', () => {
  // De 60 em passos de 10, nenhum valor fica entre 85 e 88.
  expectOnly(benchItem(item => { item.goal = { kind: 'reach', control: 'kv', atLeast: 85, atMost: 88 }; }), /bench: nenhum passo do controle cai dentro do alvo/);
  assert.deepEqual(benchItem(item => { item.goal = { kind: 'reach', control: 'kv', atLeast: 85, atMost: 100 }; }), []);
});
test('bench: o match só vale na exposição, com referência numérica e tolerância positiva', () => {
  const match = (mutate = () => {}) => item => { item.goal = { kind: 'match', reference: { kv: 80, mas: 10 }, tolerance: 0.05 }; mutate(item); };
  expectOnly(benchItem(item => { collimationBench(item); match()(item); }), /bench: match só vale na exposição/);
  expectOnly(benchItem(match(item => { delete item.goal.reference; })), /goal.reference: objeto esperado/);
  expectOnly(benchItem(match(item => { item.goal.reference.kv = '80'; })), /goal\.reference: bench: kv e mas devem ser números/);
  expectOnly(benchItem(match(item => { item.goal.tolerance = 0; })), /bench: tolerance deve ser um número positivo/);
});
test('bench: o fantoma tem de 3 a 60 caracteres', () => {
  expectOnly(benchItem(item => { item.phantomLabel = 'Fa'; }), /texto ausente ou curto/);
  expectOnly(benchItem(item => { item.phantomLabel = 'F'.repeat(1) + 'a'.repeat(60); }), /caracteres \(máx\. 60\)/);
  assert.deepEqual(benchItem(item => { item.phantomLabel = 'a'.repeat(60); }), []);
});
test('bench: as dicas por lado têm de 25 a 260 caracteres e são distintas', () => {
  expectOnly(benchItem(item => { item.hints.tooLow = 'Suba o kV.'; }), /texto ausente ou curto/);
  expectOnly(benchItem(item => { item.hints.tooHigh = 'a'.repeat(261); }), /caracteres \(máx\. 260\)/);
  expectOnly(benchItem(item => { item.hints.tooHigh = item.hints.tooLow.toUpperCase().toLowerCase(); }), /bench: hints.tooLow e hints.tooHigh iguais/);
  expectOnly(benchItem(item => { delete item.hints; }), /bench: hints ausente/);
});
test('bench: texto com travessão, caixa alta ou palavra reservada reprova, como nas outras famílias', () => {
  expectOnly(benchItem(item => { item.hints.tooLow = 'Falta tensão ainda — suba o kV com calma até chegar.'; }), /travessão com espaços/);
  expectOnly(benchItem(item => { item.controls[0].label = 'Configuração'; }), /palavra reservada/);
  expectOnly(benchItem(item => { item.feedbackIncorrect = item.feedbackCorrect; }), /retorno de erro igual ao de acerto/);
});

// Régua da múltipla escolha por aula: a revisão espaçada só mostra múltipla escolha, então sem uma
// as cartas da aula nunca são limpas (docs/evidence/2026-11-19-formatos/medicao-revisao-espacada.md).
const NO_MULTIPLE_CHOICE = /a aula precisa de ao menos uma múltipla escolha: sem ela, as cartas de revisão da aula nunca são limpas/;
const asCaseDecision = (item) => {
  item.type = 'case-decision';
  item.context = 'No setor de radiologia, antes de o turno começar, a equipe confere o material de proteção e os registros do dia.';
};
test('aula sem múltipla escolha reprova, e o caso com decisão não conta como uma', () => {
  const errors = defect(doc => { doc.lessons[0].interactions.filter(item => item.type === 'multiple-choice').forEach(asCaseDecision); });
  expectOnly(errors, /^lessons\[0\]\(m01-01\)\.interactions: a aula precisa de ao menos uma múltipla escolha/);
  assert.equal(errors.length, 1);
  assert.match(errors[0], NO_MULTIPLE_CHOICE);
});
test('uma só múltipla escolha basta', () => {
  assert.deepEqual(defect(doc => { doc.lessons[0].interactions.filter(item => item.type === 'multiple-choice').slice(1).forEach(asCaseDecision); }), []);
});
test('M05.06, publicada sem múltipla escolha, é a única isenta', () => {
  const m05 = () => JSON.parse(readFileSync(fileURLToPath(new URL('../../content-manifest/rtg-2026/aulas/m05.json', import.meta.url)), 'utf8'));
  assert.deepEqual(lintUnit(m05()), []);
  const doc = m05();
  doc.lessons[4].interactions.filter(item => item.type === 'multiple-choice').forEach(asCaseDecision);
  const errors = lintUnit(doc);
  expectOnly(errors, /^lessons\[4\]\(m05-05\)\.interactions: a aula precisa de ao menos uma múltipla escolha/);
});
