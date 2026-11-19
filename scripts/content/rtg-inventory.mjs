// Inventário da trilha rtg-2026: confere as quatro metas de crescimento.
import { readFileSync, readdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const DIR = new URL('../../content-manifest/rtg-2026/aulas/', import.meta.url);
const ANTIGOS = ['multiple-choice', 'case-decision'];
const VISUAIS = ['hotspot', 'label', 'risk-hunt', 'comparison', 'bench', 'parameter-lab'];
const DE_HOJE = [
  'm01', 'm02', 'm03', 'm04', 'm05', 'm06', 'm07', 'm08', 'm09', 'm10', 'm11', 'm12', 'm13', 'm14', 'm15', 'm16',
  's-tc', 's-rm', 's-md', 's-mn', 's-rt', 's-ir', 's-od', 's-us',
];
const PASSOS_POR_AULA = 8; // abertura + conceito + fecho + 5 interações
const pct = (a, b) => (b === 0 ? 0 : (a / b) * 100);

function unidade(doc) {
  const id = doc.unit.id;
  const porTipo = {};
  let aulasVisual = 0, passosTexto = 0, interacoes = 0;
  const semVisual = [];
  doc.lessons.forEach((l, idx) => {
    const conceitoVisual = l.concept?.visual !== undefined;
    let visual = conceitoVisual;
    passosTexto += 2 + (conceitoVisual ? 0 : 1);
    for (const i of l.interactions) {
      porTipo[i.type] = (porTipo[i.type] ?? 0) + 1;
      interacoes++;
      if (VISUAIS.includes(i.type)) visual = true;
    }
    if (visual) aulasVisual++;
    else semVisual.push(l.id ?? idx);
  });
  const aulas = doc.lessons.length;
  const passos = aulas * PASSOS_POR_AULA;
  const antigos = ANTIGOS.reduce((s, t) => s + (porTipo[t] ?? 0), 0);
  return {
    id, aulas, interacoes, porTipo, passos, passosTexto, antigos,
    meta2Pct: pct(passosTexto + antigos, passos),
    aulasVisual, semVisual,
    familias: Object.keys(porTipo).filter((t) => !ANTIGOS.includes(t)).sort(),
    deHoje: DE_HOJE.includes(id),
  };
}

export function inventory(units) {
  const us = units.map(unidade);
  const soma = (k) => us.reduce((s, u) => s + u[k], 0);
  const porTipo = {};
  for (const u of us) for (const [t, n] of Object.entries(u.porTipo)) porTipo[t] = (porTipo[t] ?? 0) + n;
  const trilha = {
    unidades: us.length, aulas: soma('aulas'), interacoes: soma('interacoes'), porTipo,
    passos: soma('passos'), passosTexto: soma('passosTexto'), antigos: soma('antigos'),
    aulasVisual: soma('aulasVisual'),
  };
  trilha.meta2Pct = pct(trilha.passosTexto + trilha.antigos, trilha.passos);
  trilha.aulasVisualPct = pct(trilha.aulasVisual, trilha.aulas);

  const novas = us.filter((u) => !u.deHoje);
  const hoje = us.filter((u) => u.deHoje);
  const hojeVisual = hoje.reduce((s, u) => s + u.aulasVisual, 0);
  const novasSemVisual = novas.filter((u) => u.semVisual.length).map((u) => u.id);
  const abaixo = us.filter((u) => u.familias.length < 4).map((u) => u.id);
  const metas = {
    meta1: { unidades: trilha.unidades, aulas: trilha.aulas, cumpre: trilha.unidades === 48 && trilha.aulas >= 300 && trilha.aulas <= 320 },
    meta2: { pct: trilha.meta2Pct, cumpre: trilha.meta2Pct <= 50 },
    meta3: {
      aulasVisual: trilha.aulasVisual, pct: trilha.aulasVisualPct,
      unidadesComAulaSemVisual: us.filter((u) => u.semVisual.length).map((u) => u.id),
      novasSemVisual, hojeComVisual: hojeVisual,
      cumpre: novasSemVisual.length === 0 && hojeVisual >= 100,
    },
    meta4: { abaixo, cumpre: abaixo.length === 0 },
  };
  return { unidades: us, trilha, metas };
}

const f = (n) => n.toFixed(1) + '%';

function imprime(r) {
  console.log('unidade  aulas  meta2   visual       famílias  interações');
  for (const u of r.unidades) {
    const tipos = Object.entries(u.porTipo).map(([t, n]) => `${t}:${n}`).join(' ');
    console.log(`${u.id.padEnd(8)} ${String(u.aulas).padStart(5)}  ${f(pct(u.passosTexto + u.antigos, u.passos)).padStart(6)}  ${`${u.aulasVisual}/${u.aulas}`.padStart(7)}  ${String(u.familias.length).padStart(9)}  ${tipos}`);
  }
  const { trilha: t, metas: m } = r;
  const ok = (b) => (b ? 'cumpre' : 'não cumpre');
  console.log('\nResumo da trilha');
  console.log(`unidades ${t.unidades}, aulas ${t.aulas}, interações ${t.interacoes} (multiple-choice ${t.porTipo['multiple-choice'] ?? 0}, case-decision ${t.porTipo['case-decision'] ?? 0})`);
  console.log(`Meta 1 (48 unidades; 300 a 320 aulas): ${m.meta1.unidades} unidades, ${m.meta1.aulas} aulas: ${ok(m.meta1.cumpre)}`);
  console.log(`Meta 2 (menos texto, ≤ 50%): ${f(t.meta2Pct)} (${t.passosTexto} passos de texto + ${t.antigos} formatos antigos de ${t.passos} passos): ${ok(m.meta2.cumpre)}`);
  console.log(`Meta 3 (algo para ver): ${t.aulasVisual}/${t.aulas} aulas (${f(t.aulasVisualPct)}); nas 24 de hoje ${m.meta3.hojeComVisual} (mín. 100); unidades novas com aula sem visual: ${m.meta3.novasSemVisual.join(', ') || 'nenhuma'}: ${ok(m.meta3.cumpre)}`);
  console.log(`  unidades com alguma aula sem passo visual: ${m.meta3.unidadesComAulaSemVisual.join(', ') || 'nenhuma'}`);
  console.log(`Meta 4 (4 ou mais famílias por unidade): abaixo de 4: ${m.meta4.abaixo.join(', ') || 'nenhuma'}: ${ok(m.meta4.cumpre)}`);
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const args = process.argv.slice(2);
  const flags = args.filter((a) => a.startsWith('--'));
  let files = args.filter((a) => !a.startsWith('--'));
  if (!files.length) files = readdirSync(DIR).filter((n) => n.endsWith('.json')).sort().map((n) => fileURLToPath(new URL(n, DIR)));
  const r = inventory(files.map((p) => JSON.parse(readFileSync(p, 'utf8'))));
  if (flags.includes('--json')) console.log(JSON.stringify(r, null, 2));
  else imprime(r);
  if (flags.includes('--metas') && !Object.values(r.metas).every((m) => m.cumpre)) process.exit(1);
}
