// Gera um roteiro do Maestro por aula e por avaliação das 20 unidades rtg-2026,
// a partir dos lotes gerados (o que o app de fato mostra), na ordem da trilha.
// Uso: node gera.mjs <pasta-dos-lotes> <saida>
import fs from 'node:fs';
import path from 'node:path';

const [batchesDir, outDir] = process.argv.slice(2);
const index = fs.readFileSync(path.join(batchesDir, 'index.ts'), 'utf8');
const units = [...index.matchAll(/from '\.\/rtg-2026-([a-z0-9-]+)'/g)].map((m) => m[1]);
const load = (u) => {
  const s = fs.readFileSync(path.join(batchesDir, `rtg-2026-${u}.ts`), 'utf8');
  return JSON.parse(s.slice(s.indexOf('= {') + 2, s.lastIndexOf(';')));
};
const rx = (t) => t.replace(/[\\^$.|?*+()[\]{}]/g, '\\$&');
const q = (t) => JSON.stringify(t);
const head = (url) => ['appId: com.ascendcreative.radiant', '---', `- openLink: ${q(url)}`];
const scrollTap = (label, exact = true) => [
  '- scrollUntilVisible:',
  '    element:',
  `      text: ${q(exact ? rx(label) : `${rx(label)}.*`)}`,
  '    direction: DOWN',
  '    timeout: 4000',
  '    centerElement: true',
  '    optional: true',
  '    speed: 80',
  '    waitToSettleTimeoutMs: 400',
  '- tapOn:',
  `    text: ${q(exact ? rx(label) : `${rx(label)}.*`)}`,
  '    waitToSettleTimeoutMs: 400',
];
// Toca até a tela mudar: o botão às vezes ainda não aceita o primeiro toque.
const tapWhile = (cond, label, times = 6) => [
  '- repeat:',
  '    while:',
  `      ${cond}`,
  `    times: ${times}`,
  '    commands:',
  '      - tapOn:',
  `          text: ${q(label)}`,
  '          optional: true',
  '          waitToSettleTimeoutMs: 400',
];

const plan = [];
for (const u of units) {
  const b = load(u);
  const stages = [];
  for (const a of b.activities) if (!stages.includes(a.competencyIds[0])) stages.push(a.competencyIds[0]);
  for (const comp of stages) {
    for (const a of b.activities.filter((x) => x.competencyIds[0] === comp)) {
      const n = a.steps.length;
      const L = head(`radiantapp://learn?blockId=${a.id}&nodeId=node:${a.id}`);
      L.push('- extendedWaitUntil:', `    visible: ${q(`Passo 1 de ${n}`)}`, '    timeout: 20000');
      a.steps.forEach((s, i) => {
        const k = i + 1;
        const here = `visible: ${q(`Passo ${k} de ${n}`)}`;
        if (s.kind === 'interaction') {
          const it = s.interaction; const p = it.payload;
          if (['multiple-choice', 'case-decision', 'comparison'].includes(it.type)) {
            const label = p.options.find((o) => o.id === p.correctOptionId).label;
            const confirm = it.type === 'comparison' ? 'Continuar' : 'Conferir resposta';
            const target = it.type === 'comparison' ? `${rx(label)}.*` : rx(label);
            L.push(...scrollTap(label, it.type !== 'comparison'));
            L.push(...tapWhile(`notVisible: { text: ${q(confirm)}, enabled: true }`, target, 4));
            L.push(...tapWhile(`notVisible: ${q('Resposta correta')}`, confirm, 4));
          } else if (it.type === 'matching') {
            for (const pair of p.pairs.slice(0, -1)) L.push(...scrollTap(`Associar ${pair.left} a ${pair.right}`));
            L.push(...tapWhile(`notVisible: ${q('Resposta correta')}`, 'Continuar', 4));
          } else if (it.type === 'ordering') {
            const cur = p.items.map((x) => x.id);
            const label = (id) => p.items.find((x) => x.id === id).label;
            let moved = false;
            p.correctOrder.forEach((id, target) => {
              for (let j = cur.indexOf(id); j > target; j -= 1) {
                L.push(...scrollTap(`Subir ${label(id)}`));
                [cur[j - 1], cur[j]] = [cur[j], cur[j - 1]]; moved = true;
              }
            });
            if (!moved) L.push(...scrollTap('Selecionar esta ordem'));
            L.push(...tapWhile(`notVisible: ${q('Resposta correta')}`, 'Continuar', 4));
          } else throw new Error(`tipo sem roteiro: ${it.type}`);
          L.push(`- assertVisible: ${q('Resposta correta')}`);
        }
        L.push(...tapWhile(k === n ? `${here}\n      notVisible: ${q('A lição foi concluída')}` : here, k === n ? 'Continuar|Concluir e voltar' : 'Continuar', 8));
      });
      L.push('- extendedWaitUntil:', `    visible: ${q('A lição foi concluída')}`, '    timeout: 20000');
      L.push(...tapWhile(`visible: ${q('A lição foi concluída')}`, 'Continuar'));
      plan.push({ unit: u, kind: 'aula', id: a.id.split(':').pop(), yaml: L });
    }
    const items = b.checkpoint.items.filter((x) => x.competencyIds[0] === comp);
    const C = head(`radiantapp://checkpoint?nodeId=node:${b.checkpoint.id}:${comp.split(':').pop()}`);
    const right = (it) => rx(it.options.find((o) => o.id === it.correctOptionId).label);
    C.push(...tapWhile(`visible: ${q('Começar avaliação')}`, 'Começar avaliação'));
    items.forEach((it, i) => {
      const last = i === items.length - 1;
      C.push(...scrollTap(it.options.find((o) => o.id === it.correctOptionId).label));
      C.push(...tapWhile(`notVisible: { text: ${q(last ? 'Enviar avaliação' : 'Próxima questão')}, enabled: true }`, right(it), 4));
      C.push(...tapWhile(`notVisible: ${q(last ? 'Avaliação concluída.*' : `Questão ${i + 2} de ${items.length}`)}`, last ? 'Enviar avaliação' : 'Próxima questão'));
    });
    C.push('- extendedWaitUntil:', `    visible: ${q('Avaliação concluída.*')}`, '    timeout: 20000');
    C.push(...tapWhile(`visible: ${q('Avaliação concluída.*')}`, 'Voltar'));
    plan.push({ unit: u, kind: 'avaliacao', id: comp.split(':').pop(), yaml: C });
  }
}
fs.mkdirSync(outDir, { recursive: true });
const order = plan.map((f, i) => {
  const name = `${String(i + 1).padStart(3, '0')}-${f.unit}-${f.kind}-${f.id}.yaml`;
  fs.writeFileSync(path.join(outDir, name), `${f.yaml.join('\n')}\n`);
  return name;
});
fs.writeFileSync(path.join(outDir, 'ordem.txt'), `${order.join('\n')}\n`);
console.log(`${units.length} unidades, ${plan.filter((f) => f.kind === 'aula').length} aulas, ${plan.filter((f) => f.kind === 'avaliacao').length} avaliações`);
