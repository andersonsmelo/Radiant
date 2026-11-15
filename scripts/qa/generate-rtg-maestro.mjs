#!/usr/bin/env node
// Aulas-fonte (content-manifest/rtg-2026/aulas/<unit>.json) -> flows Maestro que jogam a aula 01
// e a primeira avaliação de cada unidade, respondendo tudo certo pelo gabarito.
//
//   node scripts/qa/generate-rtg-maestro.mjs <unit>...           grava em radiant-app/.maestro/rtg-2026/
//   node scripts/qa/generate-rtg-maestro.mjs --check <unit>...   sai com 1 se algum flow versionado difere
//
// A saída depende só das aulas-fonte (nenhum relógio). A ordem de EXIBIÇÃO (ordenação, categorização,
// banco do cloze) vem do lote que o próprio gerador do app monta, não de uma cópia da regra aqui.
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import appContract from '../content/load-app-contract.cjs';
import { readRtgImages, readRtgSources } from '../content/build-rtg-batches.mjs';

const root = fileURLToPath(new URL('../../', import.meta.url));
const OUTPUT = path.join(root, 'radiant-app/.maestro/rtg-2026');
const factory = appContract.loadAppContract('features/student-checkpoints/batches/rtgBatchFactory.ts');
const APP_ID = 'com.ascendcreative.radiant';
// Os mesmos rótulos de LessonFlowScreen (CHECKED_FAMILIES e confirmationLabel).
const CHECKED = new Set(['multiple-choice', 'case-decision', 'cloze', 'true-false', 'categorize', 'multi-select']);

/** O seletor do Maestro é regex de casamento total: todo metacaractere de um rótulo literal leva barra. */
export const escapeMaestro = text => String(text).replace(/[.?()[\]+*^$|{}\\]/g, '\\$&');
const quote = text => `'${String(text).replace(/'/g, "''")}'`;
const text = label => `- tapOn: ${quote(escapeMaestro(label))}`;
const id = value => `- tapOn:\n    id: ${quote(escapeMaestro(value))}`;
// Sem `visibilityPercentage`: o contrato só admite uma régua por seletor e esta não mede nenhuma.
const scrollTo = (kind, value) => `- scrollUntilVisible:\n    element:\n      ${kind}: ${quote(escapeMaestro(value))}`;
const tapText = label => [scrollTo('text', label), text(label)];
const tapId = value => [scrollTo('id', value), id(value)];

/** Os toques que respondem certo a uma interação, na ordem em que o aluno os faz. */
function answerCommands(interaction) {
  const { type, payload } = interaction;
  switch (type) {
    case 'multiple-choice':
    case 'case-decision': {
      const correct = payload.options.find(option => option.id === payload.correctOptionId);
      return tapId(`lesson-option-${correct.id}`);
    }
    case 'comparison': {
      const correct = payload.options.find(option => option.id === payload.correctOptionId);
      return tapText(correct.imageAlt ? `${correct.label}. ${correct.imageAlt}` : correct.label);
    }
    case 'ordering': {
      // Só há "Subir"/"Descer" por item; leva cada item certo à sua posição por trocas adjacentes.
      const byId = new Map(payload.items.map(item => [item.id, item.label]));
      const current = payload.items.map(item => item.id);
      const commands = [];
      payload.correctOrder.forEach((target, position) => {
        for (let at = current.indexOf(target); at > position; at -= 1) {
          commands.push(...tapText(`Subir ${byId.get(target)}`));
          [current[at - 1], current[at]] = [current[at], current[at - 1]];
        }
      });
      return [...commands, ...tapText('Selecionar esta ordem')];
    }
    case 'matching':
      // O último par se completa sozinho (MatchingStepRenderer.choose): n - 1 toques.
      return payload.pairs.slice(0, -1).flatMap(pair => tapText(`Associar ${pair.left} a ${pair.right}`));
    case 'cloze': {
      const label = new Map(payload.tokens.map(token => [token.id, token.label]));
      return payload.blanks.flatMap(blank => tapId(`cloze-token-${label.get(blank.correctTokenId)}`));
    }
    case 'true-false':
      return payload.statements.flatMap((statement, index) => [
        ...(index ? [`- assertVisible: ${quote(`Afirmação ${index + 1} de ${payload.statements.length}`)}`] : []),
        ...tapId(statement.isTrue ? 'true-false-certo' : 'true-false-errado'),
      ]);
    case 'categorize': {
      const group = new Map(payload.categories.map(category => [category.id, category.label]));
      // O item ativo é o primeiro pendente (ordem de exibição); tocar nele e no grupo basta.
      return payload.items.flatMap(item => [...tapId(`categorize-item-${item.label}`), ...tapId(`categorize-group-${group.get(item.categoryId)}`)]);
    }
    case 'multi-select':
      return payload.options.filter(option => payload.correctOptionIds.includes(option.id)).flatMap(option => tapId(`multi-select-${option.label}`));
    default:
      throw new Error(`rtg-maestro-unsupported-family:${type}`);
  }
}

/** A aula inteira, do passo 1 ao resumo. Cada interação abre com um comentário `# interaction <id> <tipo>`. */
function lessonCommands(activity) {
  const steps = activity.steps;
  const total = steps.length;
  const interactions = steps.filter(step => step.kind === 'interaction');
  // LessonFlowScreen.perItemFeedback: com várias interações (ou um caso), conferir e seguir são dois toques.
  const perItem = interactions.length > 1 || interactions.some(step => step.interaction.type === 'case-decision');
  const out = [`- assertVisible: ${quote(`Passo 1 de ${total}`)}`];
  steps.forEach((step, index) => {
    const last = index === total - 1;
    if (step.kind === 'presentation') {
      // Uma fala nova por toque; o último toque avança (ou conclui).
      const presses = Math.max(1, step.payload.dialogue?.lines.length ?? 0);
      for (let press = 1; press <= presses; press += 1) out.push(text(press === presses && last ? 'Concluir e voltar' : 'Continuar'));
    } else {
      const { interaction } = step;
      out.push(`# interaction ${interaction.id.split(':').at(-1)} ${interaction.type}`, ...answerCommands(interaction));
      out.push(text(CHECKED.has(interaction.type) ? 'Conferir resposta' : 'Continuar'));
      if (perItem) out.push(text('Continuar'));
    }
    if (!last) out.push(`- assertVisible: ${quote(`Passo ${index + 2} de ${total}`)}`);
  });
  out.push(`- assertVisible: ${quote('A lição foi concluída')}`);
  return out;
}

const link = (route, params) => `radiantapp://${route}?${Object.entries(params).map(([key, value]) => `${key}=${encodeURIComponent(value)}`).join('&')}`;

/** Abre um link do app; no iOS o sistema pode perguntar antes ("Open"). */
const openLink = target => [
  `- openLink: ${quote(target)}`,
  '- runFlow:\n    when:\n      visible: \'Open\'\n    commands:\n      - tapOn: \'Open\'',
];

function flowFile({ name, tags, notes, commands }) {
  const comments = notes.map(note => `# ${note}`);
  return [`appId: ${APP_ID}`, `name: ${quote(name)}`, 'tags:', ...tags.map(tag => `  - ${tag}`), '---', ...comments,
    '- launchApp:\n    arguments:\n      radiantReduceMotion: \'1\'\n    clearState: true\n    permissions:\n      all: deny',
    '- runFlow: ../subflows/dismiss-dev-client.yaml', '- runFlow: ../subflows/dismiss-first-run.yaml',
    '- assertVisible:\n    id: journey-trail', ...commands].join('\n') + '\n';
}

/**
 * Função pura: recebe as aulas-fonte e devolve `Map<nome do arquivo, YAML>` com dois flows por unidade.
 * `images` só é necessário para unidades com `comparison`.
 */
export function renderRtgMaestroFlows(unitDocs, images = []) {
  const files = new Map();
  for (const doc of unitDocs) {
    const unit = doc.unit.id;
    const { batch } = factory.buildRtgBatch(doc, images);
    const activity = batch.activities[0];
    const competency = activity.competencyIds[0];
    const nodeId = `node:${activity.id}`;
    const checkpointNodeId = `node:${batch.checkpoint.id}:${competency.split(':').at(-1)}`;
    const items = batch.checkpoint.items.filter(item => item.competencyIds[0] === competency);
    const lessonLink = openLink(link('learn', { blockId: activity.id, nodeId }));
    const lesson = [...lessonLink, ...lessonCommands(activity)];

    files.set(`${unit}-aula-01.yaml`, flowFile({
      name: `RTG ${unit.toUpperCase()}: aula 01 até o resumo`, tags: ['rtg-2026', 'generated'],
      notes: [
        'Gerado por scripts/qa/generate-rtg-maestro.mjs a partir da aula-fonte. Não edite à mão.',
        'Entrada pelo link da rota /learn. LessonFlowScreen não recusa nó bloqueado e a aula 01 não tem unlockRule,',
        'então a unidade abre numa instalação limpa, mesmo que a trilha a mostre atrás do cadeado. Não medido em aparelho.',
      ],
      commands: lesson,
    }));

    const checkpoint = [
      ...openLink(link('checkpoint', { nodeId: checkpointNodeId })),
      '- extendedWaitUntil:\n    visible: \'Começar avaliação\'\n    timeout: 15000',
      text('Começar avaliação'),
      ...items.flatMap((item, index) => {
        const correct = item.options.find(option => option.id === item.correctOptionId);
        return [`# item ${index + 1}`, ...tapText(correct.label), ...tapText(index === items.length - 1 ? 'Enviar avaliação' : 'Próxima questão')];
      }),
      '- extendedWaitUntil:\n    visible: \'Avaliação concluída\'\n    timeout: 15000',
    ];
    files.set(`${unit}-avaliacao-01.yaml`, flowFile({
      name: `RTG ${unit.toUpperCase()}: avaliação 1 (aula 01)`, tags: ['rtg-2026', 'generated'],
      notes: [
        'Gerado por scripts/qa/generate-rtg-maestro.mjs a partir da aula-fonte. Não edite à mão.',
        'BLOQUEADA EM INSTALAÇÃO LIMPA: a tela de avaliação mostra "Bloqueada" até a aula 01 estar concluída',
        '(unlockRule do nó), e o app não é alterado para contornar isso. Por isso o flow joga a aula 01 antes e só então abre a rota /checkpoint.',
        'Sem repetir launchApp: reaberto com clearState, o progresso se perderia. Não medido em aparelho.',
      ],
      commands: [...lesson, ...checkpoint],
    }));
  }
  return files;
}

async function main() {
  const args = process.argv.slice(2);
  const units = args.filter(arg => !arg.startsWith('--'));
  if (!units.length || args.some(arg => arg.startsWith('--') && arg !== '--check')) throw new Error('usage: generate-rtg-maestro.mjs [--check] <unit>...');
  const docs = (await readRtgSources()).filter(({ doc }) => units.includes(doc.unit.id)).map(({ doc }) => doc);
  const missing = units.filter(unit => !docs.some(doc => doc.unit.id === unit));
  if (missing.length) throw new Error(`rtg-maestro-unknown-unit:${missing.join(',')}`);
  const files = renderRtgMaestroFlows(docs, await readRtgImages());
  if (args.includes('--check')) {
    const stale = [];
    for (const [name, content] of files) if (await readFile(path.join(OUTPUT, name), 'utf8').catch(() => null) !== content) stale.push(name);
    if (stale.length) throw new Error(`rtg-maestro-stale: rode node scripts/qa/generate-rtg-maestro.mjs ${units.join(' ')}\n${stale.map(name => `  - ${name}`).join('\n')}`);
  } else {
    await mkdir(OUTPUT, { recursive: true });
    for (const [name, content] of files) await writeFile(path.join(OUTPUT, name), content, 'utf8');
  }
  process.stdout.write(`${JSON.stringify({ ok: true, mode: args.includes('--check') ? 'check' : 'write', files: [...files.keys()] })}\n`);
}

if (process.argv[1] === fileURLToPath(import.meta.url)) main().catch(error => {
  process.stderr.write(`${error.message}\n`); process.exitCode = 1;
});
