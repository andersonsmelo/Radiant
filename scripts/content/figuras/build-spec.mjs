// Gera os specs de arte importada a partir de scripts/content/figuras/fontes/<id>.svg.
// Uso: node scripts/content/figuras/build-spec.mjs [id...]   (sem id: todos)
// Os specs em radiant-app/src/ui/diagrams/specs/ são saída deste script: não se editam à mão.
// Figura nova entra em FIGURES com o que só ela sabe (camadas, movimento, texto do cabeçalho).
import { readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { convertSvg, gradientMap, ownDefs } from './convert.mjs';

const here = path.dirname(fileURLToPath(import.meta.url));
const SPECS_DIR = path.join(here, '../../../radiant-app/src/ui/diagrams/specs');

const clean = (s) => s.replace(/&#(9|10|13);/g, ' ').replace(/\s{2,}/g, ' ').replace(/ "/g, '"');
const r = (n) => Math.round(n * 1000) / 1000;

// Leito: separa o aparelho nas camadas que se movem (braço, luz, feixe, brilho, LED), na ordem de pintura.
const LEITO_SPLIT = `(lt) => {
  lt.querySelector('.arm').setAttribute('data-part', 'arm');
  lt.querySelector('.beam.light').setAttribute('data-part', 'light');
  lt.querySelector('.beam.xray').setAttribute('data-part', 'xray');
  lt.querySelector('.led').setAttribute('data-part', 'led');
  lt.querySelector('.glow').setAttribute('data-part', 'glow');
  const parts = {}; for (const el of lt.querySelectorAll('[data-part]')) parts[el.dataset.part] = el;
  for (const k of ['led', 'glow', 'arm']) if (parts[k].parentNode !== lt) throw new Error(k + ' fora da raiz');
  const layers = []; let cur = [];
  const flush = () => { if (cur.length) layers.push({ name: 'static', nodes: cur }); cur = []; };
  const defs = lt.querySelector('defs');
  for (const ch of [...lt.children]) {
    if (ch === defs || ch.localName === 'style') continue;
    const part = ch.dataset?.part;
    if (part === 'led' || part === 'glow') { flush(); layers.push({ name: part, nodes: [ch] }); }
    else if (part === 'arm') { flush(); const l = parts.light, x = parts.xray; l.remove(); x.remove(); layers.push({ name: 'arm', nodes: [ch] }, { name: 'light', nodes: [l] }, { name: 'xray', nodes: [x] }); }
    else cur.push(ch);
  }
  flush();
  return layers;
}`;

function cranio(o) {
  // Caixa do desenho (sem o retângulo de fundo) centrada no quadro, 10 de margem.
  const [bx, by, bw, bh] = o.bbox;
  const s = Math.min(300 / bw, 220 / bh);
  const tx = (320 - bw * s) / 2 - bx * s;
  const ty = (240 - bh * s) / 2 - by * s;
  const svg = `<g transform="translate(${r(tx)} ${r(ty)}) scale(${r(s)})">${clean(o.layers[0].svg)}</g>`;
  return `import type { DiagramSpec } from '../diagramTypes';

// Arte importada (art: 'imported'), gerada por script a partir do acervo; não editar à mão.
// Obra: "Human skull side bones" (LadyofHats, Mariana Ruiz Villarreal), Wikimedia Commons,
// domínio público declarado pela autora. Sem rótulos e linhas de chamada, recolorida para a
// paleta do app e achatada para atributos de apresentação (sem <style>, classe ou filtro).
// Quadro 320x240, parado; o desenho ocupa a caixa ${r(bw * s)}x${r(bh * s)} centrada.
// Cores: frontal âmbar, parietal azul, temporal ciano, occipital azul escuro, esfenoide branco,
// maxila creme, mandíbula cinza; face para a esquerda.
export const cranioDePerfilOssos: DiagramSpec = {
  id: 'cranio-de-perfil-ossos',
  alt: 'Crânio de perfil com a face para a esquerda: ossos da calota, da base lateral e da face em cores diferentes, com as suturas entre eles.',
  width: 320,
  height: 240,
  art: 'imported',
  layers: [
    {
      svg: ${JSON.stringify(svg)},
    },
  ],
};
`;
}

function leito(o) {
  // 640x480 da skill cabe em 320x240 com escala 0,5.
  const grads = gradientMap(o.defs, o.layers.map((l) => l.svg));
  const dropRootOpacity = (svg) => svg.replace(/^(<\w+[^>]*?) opacity="[^"]*"/, '$1');
  const ARM_UP = 21.13; // a skill sobe o braço 21,13 unidades (640x480) no começo e no fim do ciclo
  const MOTION = {
    // Pingpong de 7 s: o braço desce na fração 0 a 0,55 e espera; a luz de campo acende de 0,55 a
    // 0,7; o disparo (feixe, brilho no detector e LED do disparador) vai de 0,9 a 1, no fundo do ciclo.
    arm: `{ kind: 'translate', dx: 0, dy: ${r(ARM_UP / 2)}, mode: 'pingpong', range: [0, 0.55] }`,
    light: `{ kind: 'fade', from: 0, to: 1, mode: 'pingpong', range: [0.55, 0.7] }`,
    xray: `{ kind: 'fade', from: 0, to: 1, mode: 'pingpong', range: [0.9, 1] }`,
    glow: `{ kind: 'fade', from: 0, to: 1, mode: 'pingpong', range: [0.9, 1] }`,
    led: `{ kind: 'fade', from: 0.18, to: 1, mode: 'pingpong', range: [0.9, 1] }`,
  };
  const NOTE = {
    static: 'Parte parada (de trás para a frente na ordem de pintura da skill).',
    led: 'LED do disparador na mão do operador.',
    glow: 'Campo iluminado no detector, por baixo do paciente.',
    arm: 'Braço: carro na coluna, braço telescópico, cabeçote e colimador, desenhados no alto.',
    light: 'Luz de campo do colimador (ciano).',
    xray: 'Feixe de raios X (âmbar).',
  };
  const layers = o.layers.map(({ name, svg }) => {
    const { body, defs } = ownDefs(clean(name === 'static' || name === 'arm' ? svg : dropRootOpacity(svg)), grads);
    const t = name === 'arm' ? `scale(0.5) translate(0 ${-ARM_UP})` : 'scale(0.5)';
    const xml = `${defs}<g transform="${t}">${body}</g>`;
    return `    {\n      // ${NOTE[name]}\n      svg: ${JSON.stringify(xml)},${MOTION[name] ? `\n      motion: ${MOTION[name]},` : ''}\n    },`;
  });
  return `import type { DiagramSpec } from '../diagramTypes';

// Arte importada (art: 'imported'), gerada por script a partir da amostra da skill \`anatomy\`
// (isométrica, .superpowers/sdd/2026-11-19-amostra-figuras/equipamento/build.mjs); não editar à mão.
// O CSS da skill (classes, variáveis, vector-effect, filtro de sombra e @keyframes) foi achatado
// para atributos de apresentação; o ciclo de 7 s virou cinco camadas com movimento e \`range\`.
// Quadro 320x240. Paciente sentado no leito com a cabeceira elevada e o detector atrás das
// costas; o aparelho móvel ao lado estende o braço sobre o tórax; o operador, de avental,
// fica afastado com o disparador na mão.
export const raioXMovelNoLeito: DiagramSpec = {
  id: 'raio-x-movel-no-leito',
  alt: 'Raio X no leito: paciente sentado com o detector nas costas, o braço do aparelho móvel desce sobre o tórax e dispara; o operador, de avental, fica longe.',
  width: 320,
  height: 240,
  art: 'imported',
  periodMs: 7000,
  posterAt: 0.5,
  layers: [
${layers.join('\n')}
  ],
};
`;
}

export const FIGURES = {
  'cranio-de-perfil-ossos': { file: 'cranio-de-perfil-ossos.ts', options: { dropBackground: true }, render: cranio },
  'raio-x-movel-no-leito': {
    file: 'raio-x-movel-no-leito.ts',
    options: { strokeScale: 2, dropBackground: true, split: LEITO_SPLIT, wrapAttrs: { class: 'iso-svg iso', 'data-theme': 'dark' } },
    render: leito,
  },
};

/** Texto do spec da figura, e o relatório da conversão (perdas) junto. */
export function buildSpec(id) {
  const fig = FIGURES[id];
  if (!fig) throw new Error(`Figura desconhecida: ${id} (conhecidas: ${Object.keys(FIGURES).join(', ')})`);
  const o = convertSvg(readFileSync(path.join(here, 'fontes', `${id}.svg`), 'utf8'), fig.options);
  return { file: fig.file, text: fig.render(o), report: o.report };
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  for (const id of process.argv.length > 2 ? process.argv.slice(2) : Object.keys(FIGURES)) {
    const { file, text, report } = buildSpec(id);
    writeFileSync(path.join(SPECS_DIR, file), text);
    console.log(file, (Buffer.byteLength(text) / 1024).toFixed(1), 'KiB; filtros removidos:', report.filters.length, JSON.stringify(report.filters));
  }
}
