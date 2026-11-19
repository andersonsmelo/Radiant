import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { inventory } from './rtg-inventory.mjs';

const VISUAIS = ['hotspot', 'label', 'risk-hunt', 'comparison', 'bench', 'parameter-lab'];
const ints = (types) => types.map((type) => ({ type }));
const lesson = (visual, types) => ({
  scene: {}, concept: visual ? { title: 't', body: 'b', visual } : { title: 't', body: 'b' },
  interactions: ints(types), closing: {}, checkpoint: {}, recovery: {},
});

test('documento mínimo com números contados à mão', () => {
  const doc = {
    unit: { id: 'xx' },
    lessons: [
      lesson(null, ['multiple-choice', 'hotspot', 'label', 'case-decision', 'comparison']),
      lesson('diag', ['multiple-choice', 'multiple-choice', 'bench', 'parameter-lab', 'risk-hunt']),
    ],
  };
  const r = inventory([doc]);
  const u = r.unidades[0];
  assert.equal(r.trilha.unidades, 1);
  assert.equal(r.trilha.aulas, 2);
  assert.equal(r.trilha.interacoes, 10);
  assert.equal(r.trilha.passos, 16);
  assert.equal(r.trilha.porTipo['multiple-choice'], 3);
  assert.equal(r.trilha.porTipo['case-decision'], 1);
  assert.equal(r.trilha.passosTexto, 5);
  assert.equal(r.trilha.meta2Pct, 56.25);
  assert.equal(u.aulasVisual, 2);
  assert.deepEqual(u.semVisual, []);
  assert.equal(u.familias.length, 6);
  assert.equal(r.metas.meta4.abaixo.length, 0);
});

test('aula sem passo visual e unidade com poucas famílias', () => {
  const r = inventory([{ unit: { id: 'yy' }, lessons: [lesson(null, ['multiple-choice', 'sort', 'sort', 'order', 'case-decision'])] }]);
  assert.equal(r.unidades[0].aulasVisual, 0);
  assert.deepEqual(r.unidades[0].semVisual, [0]);
  assert.equal(r.unidades[0].familias.length, 2);
  assert.deepEqual(r.metas.meta4.abaixo, ['yy']);
  assert.deepEqual(r.metas.meta3.unidadesComAulaSemVisual, ['yy']);
});

test('fixture sintética, contada por laços independentes', () => {
  const doc = JSON.parse(readFileSync(new URL('./fixtures/unidade-formatos.json', import.meta.url), 'utf8'));
  let aulas = 0, inter = 0, texto = 0, mc = 0, cd = 0, comVisual = 0;
  const fam = new Set();
  for (const l of doc.lessons) {
    aulas++;
    texto += 2 + (l.concept.visual === undefined ? 1 : 0);
    let visual = l.concept.visual !== undefined;
    for (const i of l.interactions) {
      inter++;
      if (i.type === 'multiple-choice') mc++;
      else if (i.type === 'case-decision') cd++;
      else fam.add(i.type);
      if (VISUAIS.includes(i.type)) visual = true;
    }
    if (visual) comVisual++;
  }
  const r = inventory([doc]);
  const u = r.unidades[0];
  assert.equal(r.trilha.aulas, aulas);
  assert.equal(r.trilha.interacoes, inter);
  assert.equal(r.trilha.passos, aulas * 8);
  assert.equal(r.trilha.passosTexto, texto);
  assert.equal(r.trilha.porTipo['multiple-choice'] ?? 0, mc);
  assert.equal(r.trilha.porTipo['case-decision'] ?? 0, cd);
  assert.equal(u.aulasVisual, comVisual);
  assert.equal(u.familias.length, fam.size);
  assert.equal(u.meta2Pct, ((texto + mc + cd) / (aulas * 8)) * 100);
});
