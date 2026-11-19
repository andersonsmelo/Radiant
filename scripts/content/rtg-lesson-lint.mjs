#!/usr/bin/env node
// Verificador do formato "aula-fonte" (schemaVersion 1), descrito em
// docs/content/2026-11-05-guia-de-autoria-rtg-2026.md.
// Uso: node scripts/content/rtg-lesson-lint.mjs <arquivo.json>...
// Sai com 1 se houver erro. Sem dependências. Confere forma, não verdade.
import { existsSync, readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';
import { findNationalReferences } from './rtg-national-terms.mjs';

const SPEAKERS = ['pixel', 'lia', 'caio', 'duda', 'paciente'];
export const TYPES = ['multiple-choice', 'case-decision', 'ordering', 'matching', 'comparison', 'cloze', 'true-false', 'categorize', 'multi-select', 'hotspot', 'label', 'risk-hunt', 'conversation', 'blitz', 'bench'];
// Famílias da 1.6 (ADR-2026-11-13) e da fase B: retorno de acerto e de erro próprios, como ordenação e associação.
const NEW_FAMILIES = ['cloze', 'true-false', 'categorize', 'multi-select', 'hotspot', 'label', 'risk-hunt', 'conversation', 'blitz', 'bench'];
// Os diagramas em código moram no app; o verificador os lê pelo mesmo carregador do gerador.
const { loadAppContract } = createRequire(import.meta.url)('./load-app-contract.cjs');
const { DIAGRAMS } = loadAppContract('ui/diagrams/diagramRegistry.ts');
const { BENCH_SIMULATOR_CONTROLS } = loadAppContract('types/learningActivity.ts');
const { TOUCH_FIGURE_WIDTH_PT, touchRect, touchRectInside, touchRectsOverlap } = loadAppContract('features/lesson-flow/renderers/hotspotTouch.ts');
// As 24 unidades publicadas antes da fase B: o corpo do conceito delas segue com 110 palavras mesmo com `visual`.
// Escritas por extenso, e não lidas da fábrica: a lista da fábrica cresce, esta não.
const LEGACY_UNITS = ['m01', 'm02', 'm03', 'm15', 'm04', 'm05', 'm06', 'm07', 'm08', 'm09', 'm16', 'm10', 'm11', 'm12', 'm13', 'm14',
  's-tc', 's-rm', 's-md', 's-mn', 's-rt', 's-ir', 's-od', 's-us'];
// M05.06 já foi publicada sem múltipla escolha; mexer nela muda um lote gerado, e a fase D decide aula a aula.
const NO_MULTIPLE_CHOICE_OK = ['m05-06'];
const CHOICE = ['multiple-choice', 'case-decision'];
const words = (s) => String(s ?? '').trim().split(/\s+/).filter(Boolean).length;
const norm = (s) => String(s ?? '').trim().toLowerCase();

/** Erros de chave: o lint não perdoa campo de digitação errada, que a fábrica descartaria em silêncio. */
export function keyErrors(where, value, allowed) {
  if (value === null || typeof value !== 'object' || Array.isArray(value)) return [`${where}: objeto esperado`];
  return Object.keys(value).filter((key) => !allowed.includes(key)).map((key) => `${where}: campo desconhecido: ${key}`);
}

/**
 * Régua dos alvos tocáveis numa figura (ponto `{label,x,y}` ou região com `width` e `height`, em 0 a 1).
 * O retângulo de toque é o do alvo ampliado em torno do centro até 44 pt por eixo (mesma conta do renderer),
 * numa figura de 280 pt de largura. Ele precisa caber na figura e nunca sobrepor o de outro alvo.
 * `ratio` é `{ width, height }` da figura; sem ele só a forma é conferida. `sized` exige largura e altura em todo alvo.
 */
export function targetErrors(where, list, { allowed = ['label', 'x', 'y', 'width', 'height'], min = 3, max = 6, ratio = null, sized = false } = {}) {
  const found = [];
  const add = (at, message) => found.push(`${at}: ${message}`);
  if (!Array.isArray(list) || list.length < min || list.length > max) return [`${where}: de ${min} a ${max} alvos`];
  const frame = ratio && { width: TOUCH_FIGURE_WIDTH_PT, height: (TOUCH_FIGURE_WIDTH_PT * ratio.height) / ratio.width };
  const placed = [];
  list.forEach((target, i) => {
    const at = `${where}[${i}]`;
    const shape = keyErrors(at, target, allowed);
    found.push(...shape);
    if (target === null || typeof target !== 'object' || Array.isArray(target)) return;
    const hasSize = target.width !== undefined || target.height !== undefined;
    if (sized && !(target.width !== undefined && target.height !== undefined)) return add(at, 'alvo sem width e height');
    const [width, height] = hasSize ? [target.width, target.height] : [0, 0];
    if ([target.x, target.y, width, height].some((n) => typeof n !== 'number' || !Number.isFinite(n))) return add(at, 'x, y, width e height devem ser números');
    if (target.x < 0 || target.y < 0 || target.x + width > 1 || target.y + height > 1) add(at, 'alvo fora do quadro (0 a 1)');
    if (hasSize && (width < 0.08 || height < 0.08)) add(at, 'região menor que 0,08 de largura ou de altura');
    if (!frame) return;
    const rect = touchRect({ x: target.x, y: target.y, width, height }, frame);
    if (!touchRectInside(rect, frame)) add(at, 'a área de toque de 44 pt sai da figura');
    placed.push({ i, rect });
  });
  if (new Set(list.map((target) => norm(target?.label))).size !== list.length) found.push(`${where}: rótulo repetido`);
  placed.forEach((a, n) => placed.slice(n + 1).forEach((b) => {
    if (touchRectsOverlap(a.rect, b.rect)) found.push(`${where}: alvos muito próximos, as áreas de toque de 44 pt se sobrepõem: ${list[a.i].label} e ${list[b.i].label}`);
  }));
  return found;
}

export function lintUnit(doc, { images = [] } = {}) {
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
  if (!/^(m\d{2}|s-[a-z]{2})$/.test(unit.id ?? '')) err('unit.id', 'use m seguido de dois dígitos, ou s- seguido de duas letras');
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
    // O gerador usa `o.correct` como verdadeiro ou falso: o texto "false" viraria gabarito.
    if (options.some((o) => typeof o?.correct !== 'boolean')) return err(where, 'correct deve ser true ou false em cada alternativa');
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

  const imageIds = new Set(images.map((image) => image.id));
  const comparison = (where, item) => {
    text(`${where}.prompt`, item.prompt, { min: 20, max: 420 });
    const options = Array.isArray(item.options) ? item.options : [];
    if (options.length < 2 || options.length > 4) return err(where, 'comparação: de 2 a 4 imagens');
    if (options.some((o) => typeof o?.correct !== 'boolean')) return err(where, 'correct deve ser true ou false em cada alternativa');
    if (options.filter((o) => o.correct === true).length !== 1) return err(where, 'exatamente 1 alternativa correta');
    options.forEach((o, i) => {
      text(`${where}.options[${i}].label`, o.label, { max: 110 }); text(`${where}.options[${i}].feedback`, o.feedback, { min: 25, max: 260 });
      if (!imageIds.has(o.imageId)) err(`${where}.options[${i}]`, `imagem fora do registro: ${o.imageId}`);
    });
    if (new Set(options.map((o) => o.imageId)).size !== options.length) err(where, 'imagem repetida na comparação');
    if (new Set(options.map((o) => norm(o.label))).size !== options.length) err(where, 'alternativas repetidas');
    if (new Set(options.map((o) => norm(o.feedback))).size !== options.length) err(where, 'retornos repetidos: cada alternativa explica o próprio erro');
    refs(where, item.sourceIds);
  };

  // Figura de uma interação: imagem licenciada ou diagrama em código, exatamente uma. Devolve a proporção
  // `{ width, height }` da figura, ou null quando a figura é inválida. Reutilizada por `label` e `risk-hunt`.
  const figure = (where, item) => {
    if ((item.imageId === undefined) === (item.diagramId === undefined)) return void err(where, 'use exatamente um de imageId e diagramId');
    if (item.diagramId !== undefined) {
      const diagram = Object.hasOwn(DIAGRAMS, item.diagramId) ? DIAGRAMS[item.diagramId] : null;
      return diagram ? { width: diagram.width, height: diagram.height } : void err(where, `diagrama fora do registro: ${item.diagramId}`);
    }
    const image = images.find((entry) => entry.id === item.imageId);
    if (!image) return void err(where, `imagem fora do registro: ${item.imageId}`);
    return image.width > 0 && image.height > 0 ? { width: image.width, height: image.height } : void err(where, `imagem sem largura e altura no cadastro: ${item.imageId}`);
  };
  // Alvos tocáveis numa figura: `targetErrors` (geometria) e o texto do rótulo.
  const targets = (where, list, options) => {
    targetErrors(where, list, options).forEach((message) => errors.push(message));
    if (Array.isArray(list)) list.forEach((target, i) => text(`${where}[${i}].label`, target?.label, { min: 2, max: 40 }));
  };

  // Regras de cada família nova. As mesmas garantias do contrato amplo
  // (`newFamilyIssues`, em EditorialWideContract.ts), na voz do conteudista.
  const longer = (correct, others) => correct.length && others.length
    && Math.max(...correct.map((l) => String(l).length)) > Math.max(...others.map((l) => String(l).length)) * 1.2;
  // Bancada: as mesmas garantias de `validateInteraction` (invalid-simulator, invalid-controls, invalid-initial,
  // missing-hints, invalid-goal), na voz do conteudista, mais o que o contrato `wide` pede (alvo que não se cumpre sozinho).
  const bench = (where, item) => {
    const number = (value) => typeof value === 'number' && Number.isFinite(value);
    const known = Object.hasOwn(BENCH_SIMULATOR_CONTROLS, item.simulator ?? '');
    if (!known) err(where, 'bench: simulator deve ser exposure ou collimation');
    if (!['explore', 'challenge', 'correct'].includes(item.mode)) err(where, 'bench: mode deve ser explore, challenge ou correct');
    text(`${where}.phantomLabel`, item.phantomLabel, { min: 3, max: 60 });
    if (item.hints === undefined || item.hints === null || typeof item.hints !== 'object') err(where, 'bench: hints ausente');
    else {
      errors.push(...keyErrors(`${where}.hints`, item.hints, ['tooLow', 'tooHigh']));
      text(`${where}.hints.tooLow`, item.hints.tooLow, { min: 25, max: 260 });
      text(`${where}.hints.tooHigh`, item.hints.tooHigh, { min: 25, max: 260 });
      if (norm(item.hints.tooLow) === norm(item.hints.tooHigh)) err(where, 'bench: hints.tooLow e hints.tooHigh iguais; cada lado do erro tem a dica própria');
    }
    const controls = Array.isArray(item.controls) ? item.controls : [];
    if (controls.length < 1 || controls.length > 2) return err(where, 'bench: de 1 a 2 controles');
    let sound = true;
    controls.forEach((control, i) => {
      const cw = `${where}.controls[${i}]`;
      errors.push(...keyErrors(cw, control, ['id', 'label', 'unit', 'min', 'max', 'step', 'initial']));
      text(`${cw}.label`, control?.label, { min: 2, max: 40 });
      text(`${cw}.unit`, control?.unit, { max: 12, caps: false });
      if (known && !BENCH_SIMULATOR_CONTROLS[item.simulator].includes(control?.id)) { sound = false; err(cw, `bench: controle de outro simulador: ${control?.id}`); }
      if (![control?.min, control?.max, control?.step, control?.initial].every(number)) { sound = false; return err(cw, 'bench: min, max, step e initial devem ser números'); }
      if (!(control.min < control.max)) { sound = false; err(cw, 'bench: min deve ser menor que max'); }
      if (!(control.step > 0)) { sound = false; err(cw, 'bench: step deve ser positivo'); }
      if (control.initial < control.min || control.initial > control.max) { sound = false; err(cw, 'bench: initial fora da faixa'); }
    });
    if (new Set(controls.map((control) => control?.id)).size !== controls.length) { sound = false; err(where, 'bench: controle repetido'); }
    const goal = item.goal;
    if (goal === undefined || goal === null || typeof goal !== 'object') return err(where, 'bench: goal ausente');
    if (goal.kind === 'match') {
      errors.push(...keyErrors(`${where}.goal`, goal, ['kind', 'reference', 'tolerance']));
      if (item.simulator !== 'exposure') err(where, 'bench: match só vale na exposição, porque a colimação não muda o contraste');
      errors.push(...keyErrors(`${where}.goal.reference`, goal.reference, ['kv', 'mas']));
      if (goal.reference && !(number(goal.reference.kv) && number(goal.reference.mas))) err(`${where}.goal.reference`, 'bench: kv e mas devem ser números');
      if (!(number(goal.tolerance) && goal.tolerance > 0)) err(where, 'bench: tolerance deve ser um número positivo');
    } else if (goal.kind === 'reach') {
      errors.push(...keyErrors(`${where}.goal`, goal, ['kind', 'control', 'atLeast', 'atMost']));
      const target = controls.find((control) => control?.id === goal.control);
      if (!target) return err(where, 'bench: o alvo aponta um controle que a bancada não tem');
      if (goal.atLeast === undefined && goal.atMost === undefined) return err(where, 'bench: o alvo precisa de atLeast ou atMost');
      const limits = [goal.atLeast, goal.atMost].filter((limit) => limit !== undefined);
      if (!limits.every(number)) return err(where, 'bench: atLeast e atMost devem ser números');
      if (sound && limits.some((limit) => limit < target.min || limit > target.max)) return err(where, 'bench: limite do alvo fora da faixa do controle');
      // Sem mexer em nada o aluno já cumpriria o alvo, e a bancada se responderia sozinha.
      if (sound && (goal.atLeast === undefined || target.initial >= goal.atLeast) && (goal.atMost === undefined || target.initial <= goal.atMost)) err(where, 'bench: o alvo já vale no ponto de partida; a bancada se responderia sozinha');
      // Os botões andam em passos a partir do ponto de partida; sem um passo dentro do alvo ele é inalcançável.
      else if (sound) {
        const inside = (value) => (goal.atLeast === undefined || value >= goal.atLeast) && (goal.atMost === undefined || value <= goal.atMost);
        const steps = Math.ceil((target.max - target.min) / target.step);
        const reachable = [target.min, target.max, ...Array.from({ length: 2 * steps + 1 }, (_, k) => target.initial + (k - steps) * target.step)];
        if (!reachable.some((value) => value >= target.min && value <= target.max && inside(value))) err(where, 'bench: nenhum passo do controle cai dentro do alvo');
      }
    } else err(where, 'bench: goal.kind deve ser reach ou match');
  };
  const newFamily = (where, item) => {
    if (norm(item.feedbackCorrect) === norm(item.feedbackIncorrect)) err(where, 'retorno de erro igual ao de acerto; o erro precisa de explicação própria');
    if (item.type === 'hotspot') {
      errors.push(...keyErrors(where, item, ['id', 'type', 'role', 'criticalSafety', 'prompt', 'help', 'sourceIds', 'feedbackCorrect', 'feedbackIncorrect', 'imageId', 'diagramId', 'regions']));
      targets(`${where}.regions`, item.regions, { allowed: ['label', 'x', 'y', 'width', 'height', 'correct'], sized: true, ratio: figure(where, item) });
      const regions = Array.isArray(item.regions) ? item.regions : [];
      if (regions.some((region) => region?.correct !== undefined && region.correct !== true)) err(where, 'hotspot: correct, quando existe, é true');
      const right = regions.filter((region) => region?.correct === true).length;
      if (right < 1 || right > 2) err(where, 'hotspot: de 1 a 2 regiões certas');
      else if (regions.length - right < 2) err(where, 'hotspot: ao menos 2 regiões erradas');
    } else if (item.type === 'risk-hunt') {
      errors.push(...keyErrors(where, item, ['id', 'type', 'role', 'criticalSafety', 'prompt', 'help', 'sourceIds', 'feedbackCorrect', 'feedbackIncorrect', 'imageId', 'diagramId', 'regions']));
      targets(`${where}.regions`, item.regions, { allowed: ['label', 'x', 'y', 'width', 'height', 'risk', 'feedback'], min: 4, max: 6, sized: true, ratio: figure(where, item) });
      const regions = Array.isArray(item.regions) ? item.regions : [];
      if (regions.some((region) => typeof region?.risk !== 'boolean')) err(where, 'risk-hunt: risk deve ser true ou false em toda região');
      else if (regions.length >= 4 && regions.length <= 6) {
        const risks = regions.filter((region) => region.risk).length;
        if (risks < 2 || risks > regions.length - 1) err(where, `risk-hunt: de 2 a ${regions.length - 1} regiões de risco; todas viram resposta constante`);
        else if (regions.slice(0, risks).every((region) => region.risk)) err(where, 'risk-hunt: os riscos estão todos no topo da lista; intercale');
      }
      regions.forEach((region, i) => text(`${where}.regions[${i}].feedback`, region?.feedback, { min: 25, max: 260 }));
      if (new Set(regions.map((region) => norm(region?.feedback))).size !== regions.length) err(where, 'risk-hunt: retornos repetidos: cada região explica a própria situação');
    } else if (item.type === 'label') {
      errors.push(...keyErrors(where, item, ['id', 'type', 'role', 'criticalSafety', 'prompt', 'help', 'sourceIds', 'feedbackCorrect', 'feedbackIncorrect', 'imageId', 'diagramId', 'points', 'distractors']));
      // Ponto sem tamanho: o retângulo de toque de 44 pt é centrado nele.
      targets(`${where}.points`, item.points, { allowed: ['label', 'x', 'y', 'where'], ratio: figure(where, item) });
      // `where` é o que o leitor de tela ouve no lugar da figura: posição ou forma, sem nomear nenhuma parte.
      const plain = (value) => norm(value).normalize('NFD').replace(/\p{M}/gu, '');
      const points = Array.isArray(item.points) ? item.points : [];
      points.forEach((point, i) => {
        text(`${where}.points[${i}].where`, point?.where, { min: 8, max: 60 });
        if (typeof point?.where === 'string' && points.some((other) => typeof other?.label === 'string' && plain(other.label).length >= 2 && plain(point.where).includes(plain(other.label)))) err(`${where}.points[${i}]`, 'label: where nomeia uma das partes; descreva só a posição ou a forma');
      });
      if (new Set(points.map((point) => norm(point?.where))).size !== points.length) err(where, 'label: where repetido entre os pontos');
      const distractors = item.distractors === undefined ? [] : item.distractors;
      if (!Array.isArray(distractors) || distractors.length > 2) return err(where, 'label: de 0 a 2 distratores');
      distractors.forEach((word, i) => text(`${where}.distractors[${i}]`, word, { min: 2, max: 40 }));
      const shown = [...(Array.isArray(item.points) ? item.points.map((point) => point?.label) : []), ...distractors];
      if (new Set(shown.map(norm)).size !== shown.length) err(where, 'label: rótulo repetido entre pontos e distratores');
    } else if (item.type === 'bench') {
      errors.push(...keyErrors(where, item, ['id', 'type', 'role', 'criticalSafety', 'prompt', 'help', 'sourceIds', 'feedbackCorrect', 'feedbackIncorrect', 'simulator', 'mode', 'controls', 'goal', 'phantomLabel', 'hints']));
      bench(where, item);
    } else if (item.type === 'conversation') {
      errors.push(...keyErrors(where, item, ['id', 'type', 'role', 'criticalSafety', 'prompt', 'help', 'sourceIds', 'feedbackCorrect', 'feedbackIncorrect', 'speaker', 'name', 'turns']));
      // O Pixel é o guia de estudo, não um interlocutor; o paciente muda a cada cena e leva nome fictício.
      if (!SPEAKERS.includes(item.speaker) || item.speaker === 'pixel') err(where, 'conversation: speaker deve ser lia, caio, duda ou paciente');
      if (item.name !== undefined) text(`${where}.name`, item.name, { max: 40, caps: false });
      else if (item.speaker === 'paciente') err(where, 'conversation: fala de paciente precisa de name fictício');
      const turns = Array.isArray(item.turns) ? item.turns : [];
      if (turns.length < 2 || turns.length > 3) return err(where, 'conversation: 2 ou 3 turnos');
      const places = [];
      turns.forEach((turn, t) => {
        const tw = `${where}.turns[${t}]`;
        errors.push(...keyErrors(tw, turn, ['line', 'options']));
        text(`${tw}.line`, turn?.line, { max: 200 });
        const options = Array.isArray(turn?.options) ? turn.options : [];
        if (options.length < 2 || options.length > 3) return err(tw, 'de 2 a 3 respostas');
        options.forEach((option, o) => {
          errors.push(...keyErrors(`${tw}.options[${o}]`, option, ['label', 'correct', 'reply']));
          text(`${tw}.options[${o}].label`, option?.label, { max: 120 });
          text(`${tw}.options[${o}].reply`, option?.reply, { max: 200 });
        });
        if (options.some((option) => typeof option?.correct !== 'boolean')) return err(tw, 'correct deve ser true ou false em cada resposta');
        const right = options.filter((option) => option.correct === true);
        if (right.length !== 1) return err(tw, 'exatamente 1 resposta correta');
        // A reação é cena, e não veredito: duas respostas com a mesma reação não deixam o aluno ver a diferença.
        if (new Set(options.map((option) => norm(option.label))).size !== options.length) err(tw, 'respostas repetidas');
        if (new Set(options.map((option) => norm(option.reply))).size !== options.length) err(tw, 'reações repetidas: cada resposta tem a reação própria');
        if (right[0].label.length > Math.max(...options.filter((option) => !option.correct).map((option) => option.label.length))) err(tw, 'a resposta correta é a mais longa do turno');
        places.push(options.findIndex((option) => option.correct));
      });
      if (places.length === turns.length && new Set(places).size === 1) err(where, 'conversation: a resposta correta está na mesma posição em todos os turnos; varie');
    } else if (item.type === 'cloze') {
      const answers = Array.isArray(item.answers) ? item.answers : [];
      const distractors = Array.isArray(item.distractors) ? item.distractors : [];
      if (answers.length < 1 || answers.length > 2) return err(where, 'cloze: 1 ou 2 lacunas (answers)');
      text(`${where}.text`, item.text, { min: 20, max: 200 });
      const markers = String(item.text ?? '').match(/\{\{\d\}\}/g) ?? [];
      if (markers.join() !== answers.map((_, i) => `{{${i + 1}}}`).join()) err(where, 'cloze: o texto precisa de uma lacuna {{1}}, {{2}} por resposta, em ordem');
      if (distractors.length < 2 || distractors.length > 4) err(where, 'cloze: de 2 a 4 distratores no banco');
      const bank = [...answers, ...distractors];
      bank.forEach((word, i) => text(`${where}.banco[${i}]`, word, { max: 40, caps: false }));
      if (new Set(bank.map(norm)).size !== bank.length) err(where, 'cloze: palavra do banco repetida');
      if (longer(answers, distractors)) err(where, 'cloze: a resposta é mais longa que 1,2× o maior distrator');
    } else if (item.type === 'true-false') {
      const statements = Array.isArray(item.statements) ? item.statements : [];
      if (statements.length < 3 || statements.length > 4) return err(where, 'true-false: de 3 a 4 afirmações');
      if (statements.some((st) => typeof st?.correct !== 'boolean')) return err(where, 'true-false: correct deve ser true ou false em cada afirmação');
      statements.forEach((st, i) => { text(`${where}.statements[${i}].text`, st.text, { min: 15, max: 160 }); text(`${where}.statements[${i}].feedback`, st.feedback, { min: 25, max: 260 }); });
      if (!statements.some((st) => st.correct) || !statements.some((st) => !st.correct)) err(where, 'true-false: ao menos uma afirmação certa e ao menos uma errada');
      else if (longer(statements.filter((st) => st.correct).map((st) => st.text), statements.filter((st) => !st.correct).map((st) => st.text))) err(where, 'true-false: a afirmação certa é mais longa que 1,2× a maior errada');
      if (new Set(statements.map((st) => norm(st.text))).size !== statements.length || new Set(statements.map((st) => norm(st.feedback))).size !== statements.length) err(where, 'true-false: afirmação ou retorno repetido');
    } else if (item.type === 'blitz') {
      errors.push(...keyErrors(where, item, ['id', 'type', 'role', 'criticalSafety', 'prompt', 'help', 'sourceIds', 'feedbackCorrect', 'feedbackIncorrect', 'statements']));
      const statements = Array.isArray(item.statements) ? item.statements : [];
      if (statements.length < 6 || statements.length > 8) return err(where, 'blitz: de 6 a 8 afirmações');
      if (statements.some((st) => typeof st?.correct !== 'boolean')) return err(where, 'blitz: correct deve ser true ou false em cada afirmação');
      statements.forEach((st, i) => {
        errors.push(...keyErrors(`${where}.statements[${i}]`, st, ['text', 'correct', 'feedback']));
        text(`${where}.statements[${i}].text`, st.text, { min: 15, max: 110 });
        text(`${where}.statements[${i}].feedback`, st.feedback, { min: 25, max: 260 });
      });
      const truths = statements.filter((st) => st.correct).length;
      if (truths < 2 || truths > statements.length - 2) err(where, `blitz: de 2 a ${statements.length - 2} afirmações verdadeiras; com menos, ou mais, a rodada se acerta sem ler`);
      if (statements.slice(0, 3).every((st) => st.correct === statements[0].correct)) err(where, 'blitz: as três primeiras afirmações têm a mesma resposta; intercale');
      if (new Set(statements.map((st) => norm(st.text))).size !== statements.length || new Set(statements.map((st) => norm(st.feedback))).size !== statements.length) err(where, 'blitz: afirmação ou retorno repetido');
    } else if (item.type === 'categorize') {
      const categories = Array.isArray(item.categories) ? item.categories : [];
      const items = Array.isArray(item.items) ? item.items : [];
      if (categories.length < 2 || categories.length > 3 || new Set(categories.map(norm)).size !== categories.length) err(where, 'categorize: de 2 a 3 grupos, sem repetir');
      if (items.length < 4 || items.length > 6 || new Set(items.map((i) => norm(i.label))).size !== items.length) err(where, 'categorize: de 4 a 6 itens únicos');
      categories.forEach((c, i) => text(`${where}.categories[${i}]`, c, { max: 40 }));
      items.forEach((i, n) => {
        text(`${where}.items[${n}].label`, i.label, { max: 60 });
        if (!categories.includes(i.category)) err(where, `categorize: item de grupo desconhecido: ${i.category}`);
        if (categories.some((c) => norm(i.label).includes(norm(c)))) err(where, `categorize: o item "${i.label}" entrega o grupo no próprio rótulo`);
      });
      if (categories.some((c) => !items.some((i) => i.category === c))) err(where, 'categorize: grupo sem item');
    } else if (item.type === 'multi-select') {
      const options = Array.isArray(item.options) ? item.options : [];
      if (options.length < 4 || options.length > 6) return err(where, 'multi-select: de 4 a 6 alternativas');
      if (options.some((o) => typeof o?.correct !== 'boolean')) return err(where, 'correct deve ser true ou false em cada alternativa');
      options.forEach((o, i) => { text(`${where}.options[${i}].label`, o.label, { max: 110 }); text(`${where}.options[${i}].feedback`, o.feedback, { min: 25, max: 260 }); });
      const correct = options.filter((o) => o.correct);
      if (correct.length < 2 || correct.length > options.length - 1) err(where, `multi-select: de 2 a ${options.length - 1} corretas; uma só é múltipla escolha, e todas viram resposta constante`);
      else if (options.slice(0, correct.length).every((o) => o.correct)) err(where, 'multi-select: as corretas estão todas no topo da lista; intercale');
      if (longer(correct.map((o) => o.label), options.filter((o) => !o.correct).map((o) => o.label))) err(where, 'multi-select: uma correta é mais longa que 1,2× a maior errada');
      if (new Set(options.map((o) => norm(o.label))).size !== options.length || new Set(options.map((o) => norm(o.feedback))).size !== options.length) err(where, 'multi-select: alternativa ou retorno repetido');
    }
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
    if (lesson.concept && typeof lesson.concept === 'object') errors.push(...keyErrors(`${w}.concept`, lesson.concept, ['title', 'body', 'keyPoints', 'visual']));
    // Com diagrama, o corpo cede espaço a ele: 80 palavras nas unidades novas.
    const visual = lesson.concept?.visual;
    if (visual !== undefined && !(typeof visual === 'string' && Object.hasOwn(DIAGRAMS, visual))) err(`${w}.concept.visual`, `diagrama fora do registro: ${visual}`);
    const bodyLimit = visual !== undefined && !LEGACY_UNITS.includes(unit.id) ? 80 : 110;
    if (words(lesson.concept?.body) > bodyLimit) err(`${w}.concept.body`, `${words(lesson.concept.body)} palavras (máx. ${bodyLimit}${bodyLimit === 80 ? ' com visual' : ''})`);
    if (!Array.isArray(lesson.concept?.keyPoints) || lesson.concept.keyPoints.length < 2 || lesson.concept.keyPoints.length > 3) err(`${w}.concept.keyPoints`, 'de 2 a 3 pontos');
    text(`${w}.closing.title`, lesson.closing?.title, { max: 60 });
    text(`${w}.closing.body`, lesson.closing?.body, { min: 40, max: 320 });

    const interactions = Array.isArray(lesson.interactions) ? lesson.interactions : [];
    if (interactions.length !== 5) err(`${w}.interactions`, `são ${interactions.length}; devem ser 5`);
    const types = interactions.map((i) => i.type);
    if (new Set(types).size < 3) err(`${w}.interactions`, 'use ao menos 3 tipos diferentes na aula');
    if (interactions.length && !types.includes('multiple-choice') && !NO_MULTIPLE_CHOICE_OK.includes(lesson.id)) err(`${w}.interactions`, 'a aula precisa de ao menos uma múltipla escolha: sem ela, as cartas de revisão da aula nunca são limpas');
    const interactionIds = new Set();
    interactions.forEach((it, ii) => {
      const iw = `${w}.interactions[${ii}]`;
      if (!TYPES.includes(it.type)) return err(iw, `tipo inválido: ${it.type}`);
      if (!/^i\d$/.test(it.id ?? '') || interactionIds.has(it.id)) err(iw, 'id i1..i5, único na aula'); interactionIds.add(it.id);
      if (!['prerequisite', 'prediction', 'practice', 'transfer', 'safety'].includes(it.role)) err(iw, 'role inválido');
      // O app só trata como segurança o que tem `criticalSafety`; o papel e a marca andam juntos.
      if ((it.role === 'safety') !== (it.criticalSafety === true)) err(iw, 'role safety e criticalSafety: true andam juntos');
      text(`${iw}.help`, it.help, { min: 15, max: 200 });
      if (NEW_FAMILIES.includes(it.type)) {
        text(`${iw}.prompt`, it.prompt, { min: 20, max: 300 });
        text(`${iw}.feedbackCorrect`, it.feedbackCorrect, { min: 25, max: 260 });
        text(`${iw}.feedbackIncorrect`, it.feedbackIncorrect, { min: 25, max: 260 });
        refs(iw, it.sourceIds);
        newFamily(iw, it);
      } else if (it.type === 'comparison') {
        comparison(iw, it);
      } else if (CHOICE.includes(it.type)) {
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

  // Com a mesma contagem de certas em todo true-false, a última afirmação se deduz das anteriores.
  const trueCounts = lessons.flatMap((l) => (Array.isArray(l.interactions) ? l.interactions : []))
    .filter((it) => it.type === 'true-false' && Array.isArray(it.statements))
    .map((it) => `${it.statements.filter((st) => st.correct === true).length}/${it.statements.length}`);
  if (trueCounts.length >= 3 && new Set(trueCounts).size === 1) err('unidade', `todo true-false tem a mesma contagem de certas (${trueCounts[0]}); varie para a última afirmação não se deduzir`);

  positions.forEach((count, i) => {
    if (choiceCount >= 12 && count / choiceCount > 0.4) err('unidade', `a resposta correta cai na posição ${i + 1} em ${Math.round((count / choiceCount) * 100)}% dos itens (máx. 40%)`);
    if (choiceCount >= 12 && count / choiceCount < 0.1) err('unidade', `a posição ${i + 1} quase nunca é a correta (${count}/${choiceCount}); distribua`);
  });
  // Mesma régua do contrato do lote (`checkpoint-answer-position-bias`): sem isto a
  // unidade passava aqui e só reprovava no gerador.
  if (checkpointPositions.reduce((sum, count) => sum + count, 0) >= 4) checkpointPositions.forEach((count, i) => {
    if (count === 0) err('unidade', `nos itens de conferência a correta nunca cai na posição ${i + 1}; o contrato do lote exige as quatro posições`);
  });
  // Base internacional (guia, regra 1.4). Varre o documento inteiro, e não só os campos que as
  // outras réguas leem: campo novo no formato nasce coberto. Identificador e endereço não são texto de aula.
  const NOT_TEXT = new Set(['id', 'sourceIds', 'url', 'imageId', 'diagramId']);
  const national = (where, value) => {
    if (typeof value === 'string') findNationalReferences(value).forEach((found) => err(where, `referência nacional "${found}"; use base internacional (guia, regra 1.4)`));
    else if (Array.isArray(value)) value.forEach((item, i) => national(`${where}[${i}]`, item));
    else if (value && typeof value === 'object') Object.entries(value).forEach(([key, item]) => NOT_TEXT.has(key) || national(`${where}.${key}`, item));
  };
  national('unit', doc.unit); national('sources', doc.sources); national('lessons', doc.lessons);
  return errors;
}

if (process.argv[1] && process.argv[1] === fileURLToPath(import.meta.url)) {
  let failed = false;
  const registry = fileURLToPath(new URL('../../content-manifest/rtg-2026/imagens.json', import.meta.url));
  const registeredImages = existsSync(registry) ? JSON.parse(readFileSync(registry, 'utf8')) : [];
  for (const file of process.argv.slice(2)) {
    let errors;
    try { errors = lintUnit(JSON.parse(readFileSync(file, 'utf8')), { images: registeredImages }); } catch (e) { errors = [`JSON inválido: ${e.message}`]; }
    console.log(`${errors.length ? 'REPROVADO' : 'OK'} ${file}${errors.length ? ` (${errors.length} erros)` : ''}`);
    errors.slice(0, 60).forEach((e) => console.log(`  - ${e}`));
    failed ||= errors.length > 0;
  }
  process.exit(failed ? 1 : 0);
}
