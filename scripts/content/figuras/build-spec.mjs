// Gera os specs de arte importada a partir de scripts/content/figuras/fontes/<id>.svg.
// Uso: node scripts/content/figuras/build-spec.mjs [id...]   (sem id: todos)
// Os specs em radiant-app/src/ui/diagrams/specs/ são saída deste script: não se editam à mão.
// Figura nova entra em FIGURES com o que só ela sabe (camadas, movimento, texto do cabeçalho).
import { existsSync, readFileSync, writeFileSync } from 'node:fs';
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
// (isométrica), versionada em scripts/content/figuras/fontes/raio-x-movel-no-leito.svg; não editar à mão.
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

/** Molde das figuras de acervo paradas (fase 1): uma camada de arte, mais camadas de código em `extra`. */
function importada({ id, name, header, alt, transform, nota, extra = [] }) {
  return (o) => {
    const art = clean(o.layers[0].svg);
    const layers = [{ note: nota, svg: transform ? `<g transform="${transform(o)}">${art}</g>` : art }, ...extra];
    const items = layers.map(({ note, svg }) => `    {\n${note ? `      // ${note}\n` : ''}      svg: ${JSON.stringify(svg)},\n    },`);
    return `import type { DiagramSpec } from '../diagramTypes';

${header}
export const ${name}: DiagramSpec = {
  id: '${id}',
  alt: '${alt}',
  width: 320,
  height: 240,
  art: 'imported',
  layers: [
${items.join('\n')}
  ],
};
`;
  };
}

// Enquadra a caixa [x, y, w, h] do desenho no quadro 320x240, centrada, com 10 de margem.
const caixa = ([bx, by, bw, bh]) => {
  const s = Math.min(300 / bw, 220 / bh);
  return `translate(${r((320 - bw * s) / 2 - bx * s)} ${r((240 - bh * s) / 2 - by * s)}) scale(${r(s)})`;
};

// Linhas de referência do linhas-do-cranio, em código, sobre pontos medidos na arte já no quadro 320x240.
const P = { canto: [41.5, 114], infra: [36.5, 123.8], meato: [106.5, 139.8], y: 115.5, orbD: 232.7, orbE: 281.7, xMedia: 257.2, topo: 30.8, base: 209.2 };
const casing = (d) => `<path d="${d}" fill="none" stroke="#171920" stroke-width="4.6" stroke-linecap="round"/>`;
const linha = (a, b, c) => `${casing(`M${a[0]},${a[1]} L${b[0]},${b[1]}`)}<line x1="${a[0]}" y1="${a[1]}" x2="${b[0]}" y2="${b[1]}" stroke="${c}" stroke-width="2.5" stroke-linecap="round"/>`;
const ponto = (p, c) => `<circle cx="${p[0]}" cy="${p[1]}" r="3" fill="${c}" stroke="#171920" stroke-width="1.2"/>`;
const yTopo = Math.max(4, P.topo - 10), yBase = Math.min(236, P.base + 8);
const LINHAS_CRANIO = [
  { note: 'Linha orbitomeatal (âmbar): do meato acústico externo ao canto externo do olho (margem lateral da órbita).', svg: `${linha(P.meato, P.canto, '#ffc21a')}${ponto(P.meato, '#ffc21a')}${ponto(P.canto, '#ffc21a')}` },
  { note: 'Linha infraorbitomeatal (ciano): do mesmo meato à margem inferior da órbita.', svg: `${linha(P.meato, P.infra, '#5eeaf7')}${ponto(P.infra, '#5eeaf7')}` },
  { note: 'Linha interpupilar (azul): pelo centro das duas órbitas, na vista de frente.', svg: `${linha([r(P.orbD - 8), P.y], [r(P.orbE + 8), P.y], '#4a9eff')}${ponto([P.orbD, P.y], '#4a9eff')}${ponto([P.orbE, P.y], '#4a9eff')}` },
  { note: 'Plano sagital mediano (cinza claro tracejado): vertical pela linha média, visto de lado como linha.', svg: `${casing(`M${P.xMedia},${yTopo} L${P.xMedia},${yBase}`)}<line x1="${P.xMedia}" y1="${yTopo}" x2="${P.xMedia}" y2="${yBase}" stroke="#e6e8ee" stroke-width="2.2" stroke-dasharray="7 5" stroke-linecap="round"/>` },
];

const ACERVO = 'Arte importada (art: \'imported\'), gerada por script a partir do acervo; não editar à mão.';

export const FIGURES = {
  'esqueleto-axial-apendicular': {
    file: 'esqueleto-axial-apendicular.ts',
    options: { dropBackground: true },
    render: importada({
      id: 'esqueleto-axial-apendicular',
      name: 'esqueletoAxialApendicular',
      header: `// ${ACERVO}
// Obra: "Human skeleton front - no labels" (Mikael Häggström, derivada da arte de LadyofHats),
// Wikimedia Commons, domínio público. Sem rótulos, recolorida para a paleta do app e achatada
// para atributos de apresentação (sem <style>, classe ou filtro). Quadro 320x240, parado.
// Corte do crânio ao joelho (pés e pernas ficam fora, para as cinturas valerem área de toque);
// esqueleto de frente, lado direito do paciente à esquerda de quem vê.
// Cores: axial em azul (crânio #4A9EFF, costelas e esterno mais claros, coluna, sacro e cóccix
// mais fundos); apendicular em âmbar (cinturas, membros e patelas).`,
      alt: 'Esqueleto humano de frente, do crânio aos joelhos: crânio, costelas, esterno e coluna em tons de azul; ombros, braços, quadris e coxas em âmbar.',
      // Corte do crânio ao joelho: y de 14 a 612 do original, x centrado no meio do esqueleto (59 a 404), 8 de margem no topo.
      transform: () => {
        const s = 224 / (612 - 14);
        return `translate(${r(160 - ((59 + 404) / 2) * s)} ${r(8 - 14 * s)}) scale(${r(s)})`;
      },
    }),
  },
  'articulacao-sinovial': {
    file: 'articulacao-sinovial.ts',
    options: { dropBackground: true },
    render: importada({
      id: 'articulacao-sinovial',
      name: 'articulacaoSinovial',
      header: `// ${ACERVO}
// Obra: "Normal joint" (Servier Medical Art, kit SMART-Bones, CC BY 4.0), vetores copiados do pptx do kit,
// sem rótulos, recolorida para a paleta do app e achatada para atributos de apresentação.
// Cores: osso cinza claro com poros mais escuros, cartilagem ciano, cavidade e líquido azul-petróleo,
// membrana sinovial azul médio, cápsula azul vivo por fora. Sem ligamento na arte.`,
      alt: 'Articulação em corte: dois ossos com pontas lisas, espaço azul-escuro entre elas, camada que o envolve por fora.',
    }),
  },
  'linhas-do-cranio': {
    file: 'linhas-do-cranio.ts',
    options: { dropBackground: true },
    render: importada({
      id: 'linhas-do-cranio',
      name: 'linhasDoCranio',
      header: `// Arte importada (art: 'imported') mais linhas de referência em código; gerada por script, não editar à mão.
// Cabeça: "Human skull side bones" e "Human skull front bones" (LadyofHats, Mariana Ruiz Villarreal), Wikimedia
// Commons, domínio público; sem rótulos nem linhas de chamada, recoloridas em tons neutros. Fonte versionada:
// scripts/content/figuras/fontes/linhas-do-cranio.svg. Quadro 320x240, parado. Perfil à esquerda (face para a
// esquerda) e frente à direita (o lado direito do paciente fica à esquerda de quem vê). As linhas são código,
// cada uma de uma cor, e passam pelos pontos da arte: meato acústico externo ${P.meato}, canto externo (margem
// lateral da órbita) ${P.canto}, margem inferior da órbita ${P.infra}; centros das órbitas ${P.orbD} e ${P.orbE} em y ${P.y};
// linha média x ${P.xMedia}.`,
      alt: 'Crânio de perfil com duas linhas do meato acústico à órbita; crânio de frente com uma linha horizontal pelas órbitas e uma vertical tracejada.',
      nota: 'Perfil e frente: a cabeça (crânio) sem linhas, em tom neutro.',
      extra: LINHAS_CRANIO,
    }),
  },
  'coluna-regioes': {
    file: 'coluna-regioes.ts',
    options: { dropBackground: true },
    render: importada({
      id: 'coluna-regioes',
      name: 'colunaRegioes',
      header: `// ${ACERVO}
// Obra: "Vertebral column (spine)" (DataBase Center for Life Science, DBCLS), Wikimedia Commons, CC BY 4.0.
// Só a vista de perfil, espelhada na horizontal (a frente do corpo fica à esquerda), sem a vista de
// frente, recolorida para a paleta do app e achatada para atributos de apresentação.
// Fonte versionada: scripts/content/figuras/fontes/coluna-regioes.svg. Quadro 320x240, parado; o desenho
// ocupa a caixa 39.843x220 centrada.
// Cores: cervical ciano, torácica azul, lombar âmbar, sacro cinza claro, cóccix cinza; discos escuros.`,
      alt: 'Coluna vertebral de perfil, com a frente do corpo à esquerda: cinco trechos em cores diferentes, do pescoço ao cóccix, e as curvas em S.',
      transform: () => caixa([105.64, 7.57, 69.7, 384.86]),
    }),
  },
  'vertebra-tipica': {
    file: 'vertebra-tipica.ts',
    options: { dropBackground: true },
    render: importada({
      id: 'vertebra-tipica',
      name: 'vertebraTipica',
      header: `// ${ACERVO}
// Obra: vértebra vista de cima do slide "Vertebra" do kit SMART-Bones, Servier Medical Art, CC BY 4.0
// (vetores copiados do pptx do kit, sem alterar as formas), sem rótulos, recolorida para a paleta do app
// e achatada para atributos de apresentação. Fonte versionada: scripts/content/figuras/fontes/vertebra-tipica.svg.
// Quadro 320x240, parado; o desenho ocupa a caixa 224.123x220 centrada. Vértebra lombar com a frente do
// corpo para o alto e o processo espinhoso para baixo (como veio, sem girar).
// Cores: corpo vertebral âmbar; arco (pedículos, lâminas, processos transversos e espinhoso) azul;
// facetas dos processos articulares ciano; o forame vertebral é o furo transparente no centro.`,
      alt: 'Vértebra lombar vista de cima: corpo largo no alto, arco com furo no meio, hastes finas para os lados, haste mais grossa para baixo.',
      // O bbox do conversor ignora as transformações dos caminhos: o enquadramento usa o viewBox da fonte.
      transform: () => caixa([3931, 1013, 1522, 1494]),
    }),
  },
  'joelho-frente-e-perfil': {
    file: 'joelho-frente-e-perfil.ts',
    options: { dropBackground: true },
    render: importada({
      id: 'joelho-frente-e-perfil',
      name: 'joelhoFrenteEPerfil',
      header: `// ${ACERVO}
// Obra: "Knee skeleton lateral anterior views" (Patrick J. Lynch, medical illustrator; C. Carl Jaffe), Wikimedia Commons,
// CC BY 2.5 (o SVG traz CC BY 3.0 nos metadados). Sem rótulos, recolorida por osso para a paleta do app, com as silhuetas
// divididas em ossos pelos traços do próprio autor e recortada em altura. Fonte versionada: scripts/content/figuras/fontes/joelho-frente-e-perfil.svg.
// Quadro 320x240, parado; o desenho ocupa a caixa 293.333x220 centrada. Joelho direito: à esquerda, de frente
// (lado de fora à esquerda de quem vê); à direita, de perfil pelo lado de fora, com a frente para a direita.
// Cores: fêmur cinza claro, tíbia âmbar, fíbula ciano, patela azul (só no perfil; na vista de frente é o contorno sobre o fêmur).`,
      alt: 'Joelho direito, ossos em cores: de frente à esquerda, com o lado de fora à esquerda; de perfil à direita, com a frente para a direita.',
      transform: () => caixa([0, 110, 440, 330]),
    }),
  },
  'ossos-do-pe': {
    file: 'ossos-do-pe.ts',
    options: { dropBackground: true },
    render: importada({
      id: 'ossos-do-pe',
      name: 'ossosDoPe',
      header: `// ${ACERVO}
// Obra: "Dorsal view of bones of right foot" (erico, design; Hiromasa Ono e DBCLS, edição; Togopic), Wikimedia Commons,
// CC BY 4.0. Sem fundo, recolorida por osso para a paleta do app, girada 90 graus (calcanhar à esquerda,
// dedos à direita, lado do hálux em cima) e achatada para atributos de apresentação.
// Fonte versionada: scripts/content/figuras/fontes/ossos-do-pe.svg. Quadro 320x240, parado; o desenho
// ocupa a caixa 300x111.905 centrada.
// Cores: tarso em tons de branco e cinza claro (calcâneo, navicular, tálus, cuboide e cuneiformes alternam),
// metatarsos e sesamoide azuis, falanges âmbar; capas articulares em tom mais claro.`,
      alt: 'Pé direito visto de cima e deitado: calcanhar à esquerda, dedos à direita, hálux em cima. Tarso em tons de branco, metatarsos azuis e falanges âmbar.',
      transform: () => caixa([-389, 130, 378, 141]),
    }),
  },
  'trato-digestivo': {
    file: 'trato-digestivo.ts',
    options: { dropBackground: true },
    render: importada({
      id: 'trato-digestivo',
      name: 'tratoDigestivo',
      header: `// ${ACERVO}
// Obra: "Complete digestive apparatus" (Servier Medical Art, kit SMART-Digestive-system, CC BY 4.0), vetores
// copiados do pptx do kit. Sem a cabeça (o corte vai do esôfago ao reto), recolorida para a paleta do app e
// achatada para atributos de apresentação (sem <style>, classe, gradiente ou filtro). Das 972 formas do grupo, 965 foram extraídas (7 pontos de 1 x 1 não),
// e 750 ficam (os 215 que saem são cabeça, boca, faringe e a ponta do reto, todos fora do quadro).
// Quadro 320x240, parado; tronco de frente: o lado direito do paciente fica à esquerda de quem vê.
// Cores: fígado âmbar, esôfago cinza claro, estômago e intestino delgado em azul (a arte desenha os dois como um
// só tubo), pâncreas ciano, intestino grosso cinza médio; vesícula em verde-petróleo, vasos e baço em cinza escuro de apoio.`,
      alt: 'Tronco de frente, do esôfago ao reto: órgãos do abdome superior em cores diferentes e, abaixo, alças intestinais cercadas por um tubo largo em moldura.',
      // Fonte em px locais de 244 x 899 (viewBox da fonte); corte do esôfago (y 300) ao reto (y 850) no quadro, com 4 de margem em cima.
      transform: (o) => {
        const [vx, vy, vw] = o.viewBox.split(/[ ,]+/).map(Number);
        const k = 244 / vw, S = 232 / 550;
        const r4 = (n) => Math.round(n * 10000) / 10000;
        return `translate(${r4(160 - 122 * S - vx * k * S)} ${r4(4 - 300 * S - vy * k * S)}) scale(${r4(k * S)})`;
      },
    }),
  },
  'marcos-de-superficie': {
    file: 'marcos-de-superficie.ts',
    options: { dropBackground: true },
    render: importada({
      id: 'marcos-de-superficie',
      name: 'marcosDeSuperficie',
      header: `// ${ACERVO}
// Obra: "Human skeleton front no-text no-color" (LadyofHats, Mariana Ruiz Villarreal), Wikimedia Commons,
// domínio público declarado pela autora. Recortada no tronco e na pelve (sem cabeça e pernas; antebraços e mãos
// só até onde entram no quadro), sem fundo e recolorida por região para a paleta do app, achatada para atributos
// de apresentação, com as coordenadas dos caminhos a 0,1 para caber no teto de 240 KiB.
// Fonte versionada: scripts/content/figuras/fontes/marcos-de-superficie.svg. Quadro 320x240, parado;
// o desenho ocupa a caixa 319.6x240.04 centrada. Paciente de frente: o lado direito dele fica à esquerda de quem vê.
// Cores: esterno âmbar, costelas azuis, coluna ciano, pelve em branco, fêmures âmbar claro, clavículas, escápulas e braços cinza;
// o contorno do corpo, em cinza fino.`,
      alt: 'Esqueleto de frente, do pescoço à coxa: esterno âmbar, costelas azuis, coluna ciano, pelve branca e fêmures âmbar claro, dentro do contorno do corpo.',
      // O recorte [-7, 148, 470, 353] da fonte em escala 0,68, com a linha média (x 207) no centro do quadro.
      transform: () => `translate(${r(160 - 207 * 0.68)} ${r((240 - 353 * 0.68) / 2 - 148 * 0.68)}) scale(0.68)`,
    }),
  },
  'sistema-nervoso': {
    file: 'sistema-nervoso.ts',
    options: { dropBackground: true },
    render: importada({
      id: 'sistema-nervoso',
      name: 'sistemaNervoso',
      header: `// ${ACERVO}
// Obra: "Nervous system" (Servier Medical Art, kit SMART-Nervous-system, slide29.xml do pacote, grupo "Group 3", CC BY 4.0), vetores copiados do pptx do kit.
// Corpo de frente inteiro, com o contorno; sem rótulos (a arte original não tem). Recolorida para a paleta do app e achatada
// para atributos de apresentação. Fonte versionada: scripts/content/figuras/fontes/sistema-nervoso.svg.
// Quadro 320x240, parado; o desenho ocupa a caixa 90.5x233.6 centrada (escala 0.07, margem de 3.2 em cima e embaixo). Lado direito do paciente à esquerda de quem vê.
// Cores: encéfalo âmbar (cerebelo em âmbar mais escuro), medula espinal âmbar, nervos periféricos ciano; corpo em cinza-azulado escuro com contorno cinza.`,
      alt: 'Corpo humano de frente, com a cabeça de perfil: encéfalo e medula espinal numa cor, e uma rede de nervos de outra cor que desce pelos braços, tórax e pernas.',
      // Escala 0,07 (o corpo ocupa 233,6 das 240 unidades de altura, com 3,2 de margem em cima e embaixo; com 10 de margem seria 220):
      // a margem fechada dá ao corpo 6% mais altura e largura. A caixa da fonte (812 719 1293 3337) vem do agente de arte; o topo real do contorno fica 1,1 abaixo dela.
      transform: () => 'translate(57.905 -47.13) scale(0.07)',
    }),
  },
  'cranio-de-perfil-ossos': { file: 'cranio-de-perfil-ossos.ts', options: { dropBackground: true }, render: cranio },
  'raio-x-movel-no-leito': {
    file: 'raio-x-movel-no-leito.ts',
    options: { strokeScale: 2, dropBackground: true, split: LEITO_SPLIT, wrapAttrs: { class: 'iso-svg iso', 'data-theme': 'dark' } },
    render: leito,
  },
};

/** Ids com fonte versionada em fontes/: só essas se regeneram (a cena do leito saiu do app em 2026-11-19 e volta na fase 2). */
export const figurasComFonte = () => Object.keys(FIGURES).filter((id) => existsSync(path.join(here, 'fontes', `${FIGURES[id].fonte ?? id}.svg`)));

/** Texto do spec da figura, e o relatório da conversão (perdas) junto. */
export function buildSpec(id) {
  const fig = FIGURES[id];
  if (!fig) throw new Error(`Figura desconhecida: ${id} (conhecidas: ${Object.keys(FIGURES).join(', ')})`);
  const o = convertSvg(readFileSync(path.join(here, 'fontes', `${fig.fonte ?? id}.svg`), 'utf8'), fig.options);
  return { file: fig.file, text: fig.render(o), report: o.report };
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  for (const id of process.argv.length > 2 ? process.argv.slice(2) : figurasComFonte()) {
    const { file, text, report } = buildSpec(id);
    writeFileSync(path.join(SPECS_DIR, file), text);
    console.log(file, (Buffer.byteLength(text) / 1024).toFixed(1), 'KiB; filtros removidos:', report.filters.length, JSON.stringify(report.filters));
  }
}
