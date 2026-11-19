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
  { label: 'Cátodo com filamento', x: 0.28, y: 0.44 },
  { label: 'Ânodo', x: 0.72, y: 0.44 },
  { label: 'Janela de saída', x: 0.68, y: 0.71 },
  { label: 'Ampola de vidro', x: 0.375, y: 0.71 },
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
  const six = n => ({ label: `Parte ${n}`, x: 0.1 + (n % 3) * 0.3, y: 0.15 + Math.floor(n / 3) * 0.3 });
  assert.deepEqual(labelItem(item => { item.points = [0, 1, 2, 3, 4, 5].map(six); }), []);
  expectOnly(labelItem(item => { item.points = [0, 1, 2, 3, 4, 5, 6].map(six); }), /de 3 a 6 alvos/);
});
test('label: o ponto não tem largura nem altura', () => {
  expectOnly(labelItem(item => { Object.assign(item.points[1], { width: 0.1, height: 0.1 }); }), /campo desconhecido: width|campo desconhecido: height/);
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
