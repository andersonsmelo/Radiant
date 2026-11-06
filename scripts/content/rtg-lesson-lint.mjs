#!/usr/bin/env node
// Verificador do formato "aula-fonte" (schemaVersion 1), descrito em
// docs/content/2026-11-05-guia-de-autoria-rtg-2026.md.
// Uso: node scripts/content/rtg-lesson-lint.mjs <arquivo.json>...
// Sai com 1 se houver erro. Sem dependências. Confere forma, não verdade.
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const SPEAKERS = ['pixel', 'lia', 'caio', 'duda', 'paciente'];
const TYPES = ['multiple-choice', 'case-decision', 'ordering', 'matching'];
const CHOICE = ['multiple-choice', 'case-decision'];
const words = (s) => String(s ?? '').trim().split(/\s+/).filter(Boolean).length;
const norm = (s) => String(s ?? '').trim().toLowerCase();

export function lintUnit(doc) {
  if (doc === null || typeof doc !== 'object' || Array.isArray(doc)) return ['raiz: o arquivo deve conter um objeto JSON'];
  const errors = [];
  const err = (where, msg) => errors.push(`${where}: ${msg}`);
  const text = (where, value, { min = 1, max = Infinity, caps = true } = {}) => {
    if (typeof value !== 'string' || value.trim().length < min) return err(where, `texto ausente ou curto (mín. ${min})`);
    if (value.length > max) err(where, `texto com ${value.length} caracteres (máx. ${max})`);
    if (/\s[—–]\s/.test(value)) err(where, 'travessão com espaços; reescreva com vírgula, ponto ou dois-pontos');
    // Mesma régua do contrato de texto do app (radiant-app/scripts/copy-style-contract.mjs): quatro letras ou mais, tudo em maiúsculas.
    if (caps && (value.match(/\p{L}/gu) ?? []).length >= 4 && value === value.toLocaleUpperCase('pt-BR')) err(where, 'texto todo em caixa alta; o app lê como ênfase. Acompanhe a sigla de uma palavra ("O sistema PACS")');
    if (/\b(todas|nenhuma) das (anteriores|alternativas)\b/i.test(value)) err(where, '"todas/nenhuma das anteriores" não é alternativa válida');
    // Mesma lista do contrato de texto do app: palavras que ele trata como jargão de interface.
    if (/(?<![\p{L}\p{N}_])(?:jornada|elegível|nó(?: liberado)?|checkpoint|configuraç(?:ão|ões))(?![\p{L}\p{N}_])/iu.test(value)) err(where, 'palavra reservada do app (jornada, nó, checkpoint, configuração, elegível); troque por outra, como "turno", "ajuste" ou "conferência"');
  };

  if (doc.schemaVersion !== 1) err('raiz', 'schemaVersion deve ser 1');
  const unit = doc.unit ?? {};
  if (!/^(m\d{2}|s-[a-z]{2})$/.test(unit.id ?? '')) err('unit.id', 'use m01..m14 ou s-tc, s-rm, s-md, s-mn, s-rt, s-ir');
  text('unit.title', unit.title, { max: 60 });
  text('unit.summary', unit.summary, { min: 30, max: 220 });

  const sources = Array.isArray(doc.sources) ? doc.sources : [];
  const sourceIds = new Set(sources.map((s) => s.id));
  if (sources.length < 2) err('sources', 'ao menos 2 fontes gratuitas por unidade');
  sources.forEach((s, i) => {
    const w = `sources[${i}]`;
    if (!/^[a-z0-9-]+$/.test(s.id ?? '')) err(w, 'id em kebab-case');
    if (!/^https:\/\//.test(s.url ?? '')) err(w, 'url https obrigatória');
    if (!/^\d{4}-\d{2}-\d{2}$/.test(s.accessedAt ?? '')) err(w, 'accessedAt no formato AAAA-MM-DD');
    text(`${w}.title`, s.title); text(`${w}.publisher`, s.publisher, { caps: false }); text(`${w}.licenseNote`, s.licenseNote, { min: 10 });
    if (!['factual-reference', 'cc-by-4.0'].includes(s.use)) err(w, 'use deve ser factual-reference ou cc-by-4.0');
  });
  const refs = (where, ids) => {
    if (!Array.isArray(ids) || !ids.length) return err(where, 'sourceIds vazio');
    ids.forEach((id) => sourceIds.has(id) || err(where, `fonte desconhecida: ${id}`));
  };

  const positions = [0, 0, 0, 0];
  const checkpointPositions = [0, 0, 0, 0];
  let choiceCount = 0;
  const choice = (where, item) => {
    text(`${where}.prompt`, item.prompt, { min: 20, max: 420 });
    const options = Array.isArray(item.options) ? item.options : [];
    if (options.length !== 4) return err(where, 'exatamente 4 alternativas');
    const correct = options.filter((o) => o.correct === true);
    if (correct.length !== 1) return err(where, 'exatamente 1 alternativa correta');
    options.forEach((o, i) => { text(`${where}.options[${i}].label`, o.label, { max: 110 }); text(`${where}.options[${i}].feedback`, o.feedback, { min: 25, max: 260 }); });
    if (new Set(options.map((o) => norm(o.label))).size !== 4) err(where, 'alternativas repetidas');
    if (new Set(options.map((o) => norm(o.feedback))).size !== 4) err(where, 'retornos repetidos: cada alternativa explica o próprio erro');
    const longest = Math.max(...options.filter((o) => !o.correct).map((o) => o.label.length));
    if (correct[0].label.length > longest * 1.2) err(where, 'a correta é mais longa que 1,2× o maior distrator');
    positions[options.findIndex((o) => o.correct)] += 1; choiceCount += 1;
    refs(where, item.sourceIds);
    return correct[0].label;
  };

  const lessons = Array.isArray(doc.lessons) ? doc.lessons : [];
  if (lessons.length < 6) err('lessons', `a unidade tem ${lessons.length} aulas; o mínimo é 6`);
  const seenIds = new Set();
  lessons.forEach((lesson, li) => {
    const w = `lessons[${li}](${lesson.id})`;
    if (!/^(m\d{2}|s-[a-z]{2})-\d{2}$/.test(lesson.id ?? '') || !String(lesson.id).startsWith(unit.id)) err(w, 'id no formato <unit.id>-NN');
    if (seenIds.has(lesson.id)) err(w, 'id repetido'); seenIds.add(lesson.id);
    text(`${w}.title`, lesson.title, { max: 60 });
    text(`${w}.objective`, lesson.objective, { min: 30, max: 160 });
    text(`${w}.competency`, lesson.competency, { min: 20, max: 160 });
    const lines = lesson.scene?.lines ?? [];
    text(`${w}.scene.setting`, lesson.scene?.setting, { max: 60 });
    if (lines.length < 2 || lines.length > 4) err(`${w}.scene`, 'de 2 a 4 falas');
    lines.concat(lesson.closing?.line ? [lesson.closing.line] : []).forEach((l, i) => {
      if (!SPEAKERS.includes(l.speaker)) err(`${w}.fala[${i}]`, `speaker inválido: ${l.speaker}`);
      text(`${w}.fala[${i}].text`, l.text, { max: 200 });
      if (l.speaker === 'paciente' && !l.name) err(`${w}.fala[${i}]`, 'fala de paciente precisa de name fictício');
    });
    text(`${w}.concept.title`, lesson.concept?.title, { max: 60 });
    text(`${w}.concept.body`, lesson.concept?.body, { min: 120 });
    if (words(lesson.concept?.body) > 110) err(`${w}.concept.body`, `${words(lesson.concept.body)} palavras (máx. 110)`);
    if (!Array.isArray(lesson.concept?.keyPoints) || lesson.concept.keyPoints.length < 2 || lesson.concept.keyPoints.length > 3) err(`${w}.concept.keyPoints`, 'de 2 a 3 pontos');
    text(`${w}.closing.title`, lesson.closing?.title, { max: 60 });
    text(`${w}.closing.body`, lesson.closing?.body, { min: 40, max: 320 });

    const interactions = Array.isArray(lesson.interactions) ? lesson.interactions : [];
    if (interactions.length !== 5) err(`${w}.interactions`, `são ${interactions.length}; devem ser 5`);
    const types = interactions.map((i) => i.type);
    if (new Set(types).size < 3) err(`${w}.interactions`, 'use ao menos 3 tipos diferentes na aula');
    const interactionIds = new Set();
    interactions.forEach((it, ii) => {
      const iw = `${w}.interactions[${ii}]`;
      if (!TYPES.includes(it.type)) return err(iw, `tipo inválido: ${it.type}`);
      if (!/^i\d$/.test(it.id ?? '') || interactionIds.has(it.id)) err(iw, 'id i1..i5, único na aula'); interactionIds.add(it.id);
      if (!['prerequisite', 'prediction', 'practice', 'transfer', 'safety'].includes(it.role)) err(iw, 'role inválido');
      text(`${iw}.help`, it.help, { min: 15, max: 200 });
      if (CHOICE.includes(it.type)) {
        choice(iw, it);
        if (it.type === 'case-decision') text(`${iw}.context`, it.context, { min: 60, max: 520 });
      } else {
        text(`${iw}.prompt`, it.prompt, { min: 20, max: 300 });
        text(`${iw}.feedbackCorrect`, it.feedbackCorrect, { min: 25, max: 260 });
        text(`${iw}.feedbackIncorrect`, it.feedbackIncorrect, { min: 25, max: 260 });
        refs(iw, it.sourceIds);
        if (it.type === 'ordering') {
          const items = it.items ?? [];
          if (items.length < 4 || items.length > 5 || new Set(items.map(norm)).size !== items.length) err(iw, 'ordering: 4 ou 5 itens únicos, já na ordem correta');
          items.forEach((s, i) => text(`${iw}.items[${i}]`, s, { max: 90 }));
        } else {
          const pairs = it.pairs ?? [];
          if (pairs.length !== 4 || new Set(pairs.map((p) => norm(p.left))).size !== 4 || new Set(pairs.map((p) => norm(p.right))).size !== 4) err(iw, 'matching: 4 pares, sem repetição de lado');
          pairs.forEach((p, i) => { text(`${iw}.pairs[${i}].left`, p.left, { max: 60 }); text(`${iw}.pairs[${i}].right`, p.right, { max: 90 }); });
        }
      }
    });
    if (interactions[0] && interactions[0].role !== 'prerequisite') err(`${w}.interactions[0]`, 'a primeira interação recupera um pré-requisito (role prerequisite)');

    const cp = Array.isArray(lesson.checkpoint) ? lesson.checkpoint : [];
    if (cp.length !== 2) err(`${w}.checkpoint`, 'exatamente 2 itens');
    const answers = cp.map((item, i) => choice(`${w}.checkpoint[${i}]`, item));
    cp.forEach((item) => { const at = (Array.isArray(item?.options) ? item.options : []).findIndex((o) => o?.correct === true); if (at >= 0 && at < 4) checkpointPositions[at] += 1; });
    if (answers.length === 2 && norm(answers[0]) === norm(answers[1])) err(`${w}.checkpoint`, 'os dois itens têm a mesma resposta correta');
    const prompts = [...interactions, ...cp].map((i) => norm(i.prompt));
    if (new Set(prompts).size !== prompts.length) err(w, 'enunciado repetido entre prática e conferência');
    text(`${w}.recovery.guided.hook`, lesson.recovery?.guided?.hook, { min: 20, max: 200 });
    if (lesson.recovery?.guided?.item) choice(`${w}.recovery.guided.item`, lesson.recovery.guided.item); else err(`${w}.recovery.guided`, 'item ausente');
    if (lesson.recovery?.transfer?.item) choice(`${w}.recovery.transfer.item`, lesson.recovery.transfer.item); else err(`${w}.recovery.transfer`, 'item ausente');
  });

  positions.forEach((count, i) => {
    if (choiceCount >= 12 && count / choiceCount > 0.4) err('unidade', `a resposta correta cai na posição ${i + 1} em ${Math.round((count / choiceCount) * 100)}% dos itens (máx. 40%)`);
    if (choiceCount >= 12 && count / choiceCount < 0.1) err('unidade', `a posição ${i + 1} quase nunca é a correta (${count}/${choiceCount}); distribua`);
  });
  // Mesma régua do contrato do lote (`checkpoint-answer-position-bias`): sem isto a
  // unidade passava aqui e só reprovava no gerador.
  if (checkpointPositions.reduce((sum, count) => sum + count, 0) >= 4) checkpointPositions.forEach((count, i) => {
    if (count === 0) err('unidade', `nos itens de conferência a correta nunca cai na posição ${i + 1}; o contrato do lote exige as quatro posições`);
  });
  return errors;
}

if (process.argv[1] && process.argv[1] === fileURLToPath(import.meta.url)) {
  let failed = false;
  for (const file of process.argv.slice(2)) {
    let errors;
    try { errors = lintUnit(JSON.parse(readFileSync(file, 'utf8'))); } catch (e) { errors = [`JSON inválido: ${e.message}`]; }
    console.log(`${errors.length ? 'REPROVADO' : 'OK'} ${file}${errors.length ? ` (${errors.length} erros)` : ''}`);
    errors.slice(0, 60).forEach((e) => console.log(`  - ${e}`));
    failed ||= errors.length > 0;
  }
  process.exit(failed ? 1 : 0);
}
