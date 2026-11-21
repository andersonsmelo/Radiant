// Gerador dos três fluxos de cinco cartões com ícones do Lucide (ISC), fase 4 da troca das figuras.
// Uso: node scripts/content/figuras/fluxos/<id>.mjs   (reescreve o spec e o arquivo de alvos da figura)
// Os ícones vêm de ../vendor/lucide/icones.json (SVG original, intacto); o que o gerador muda é só
// `currentColor` -> cor da paleta, escala 2 e translação ao centro do cartão. Quadro 320 x 240, parado, sem texto.
// Os geradores dos outros dois fluxos importam `gerarFluxo` daqui, para a grade ser uma só.
import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const raiz = (caminho) => fileURLToPath(new URL(`../../../../${caminho}`, import.meta.url));
export const ICONES = JSON.parse(readFileSync(new URL('../vendor/lucide/icones.json', import.meta.url), 'utf8'));
const VERSAO = ICONES.versao;
const ESCALA = 2;
// Cartões em serpentina: 3 em cima (esq. -> dir.), 2 embaixo (dir. -> esq.). Mesma grade nas três figuras.
const CARTOES = [[18, 36], [122, 36], [226, 36], [226, 136], [122, 136]];
const [CW, CH] = [76, 68];
const seta = (linha, ponta) => `<line ${linha} stroke="\${P.accent}" stroke-width="3" stroke-linecap="round"/><polygon points="${ponta}" fill="\${P.accent}" stroke="\${P.accent}" stroke-width="1" stroke-linejoin="round"/>`;
const SETAS = [
  seta('x1="99" y1="70" x2="108" y2="70"', '118,70 107,64.5 107,75.5'),
  seta('x1="203" y1="70" x2="212" y2="70"', '222,70 211,64.5 211,75.5'),
  seta('x1="264" y1="109" x2="264" y2="119"', '264,130 258.5,119 269.5,119'),
  seta('x1="221" y1="170" x2="212" y2="170"', '202,170 213,164.5 213,175.5'),
];
const arredonda = (v) => Math.round(v * 10000) / 10000;
const camel = (id) => id.replace(/-(\w)/g, (_, c) => c.toUpperCase());

/** `passos`: [[ícone do Lucide, nome do alvo, 'beam' no passo de imagem]]. Devolve o texto do spec e o dos alvos. */
export function gerarFluxo(id, { alt, nota, passos }) {
  const icones = passos.map(([nome, , papel], i) => {
    if (!ICONES.icones[nome]) throw new Error(`ícone fora de vendor/lucide/icones.json: ${nome}`);
    const cor = papel === 'beam' ? '${P.beam}' : '${P.line}';
    const dentro = [...ICONES.icones[nome].matchAll(/<(path|circle|rect|line|polyline|polygon|ellipse)\b[^>]*?\/>/g)]
      .map((m) => m[0].replace(/\s+\/>$/, '/>')).join('\n').replaceAll('currentColor', cor);
    const [cx, cy] = [CARTOES[i][0] + CW / 2, CARTOES[i][1] + CH / 2];
    return `<g transform="translate(${cx - 12 * ESCALA} ${cy - 12 * ESCALA}) scale(${ESCALA})" fill="none" stroke="${cor}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">\n${dentro}\n</g>`;
  });
  const spec = `import { P } from '../diagramPalette';
import type { DiagramSpec } from '../diagramTypes';

// Fase 4 da troca das figuras. Quadro 320x240, parado, sem texto: ${nota}
// Cinco cartões P.fill em serpentina (a mesma grade nas três figuras de fluxo) e, em cada um, um ícone do Lucide
// (ISC, v${VERSAO}) intacto, só recolorido e posto no centro. Seta cheia em P.accent. Só o passo de imagem é âmbar (cor do feixe).
// Quem rotula os passos é a aula. Figura com área de toque fica parada: sem movimento.
// Gerado por scripts/content/figuras/fluxos/${id}.mjs: não se edita à mão.
export const ${camel(id)}: DiagramSpec = {
  id: '${id}',
  art: 'imported',
  alt: '${alt}',
  width: 320,
  height: 240,
  layers: [
    {
      // Os cinco cartões.
      svg: \`${CARTOES.map(([x, y]) => `<rect x="${x}" y="${y}" width="${CW}" height="${CH}" rx="10" fill="\${P.fill}"/>`).join('\n')}\`,
    },
    {
      // Setas da serpentina.
      svg: \`${SETAS.join('\n')}\`,
    },
    {
      // Os cinco ícones, na ordem do fluxo.
      svg: \`${icones.join('\n')}\`,
    },
  ],
};
`;
  const alvos = `[\n${passos.map(([, nome], i) => `  ${JSON.stringify({ nome, x: arredonda(CARTOES[i][0] / 320), y: arredonda(CARTOES[i][1] / 240), width: arredonda(CW / 320), height: arredonda(CH / 240) })}`).join(',\n')}\n]\n`;
  return { spec, alvos };
}

export const caminhos = (id) => ({ spec: raiz(`radiant-app/src/ui/diagrams/specs/${id}.ts`), alvos: raiz(`content-manifest/rtg-2026/figuras/${id}.alvos.json`) });

export function escreveFluxo(id, definicao) {
  const { spec, alvos } = gerarFluxo(id, definicao);
  const destino = caminhos(id);
  writeFileSync(destino.spec, spec);
  writeFileSync(destino.alvos, alvos);
}

export const ALT = 'Cinco cartões com ícones ligados por setas: três em cima, da esquerda para a direita, e dois embaixo, da direita para a esquerda.';
export const FLUXO = {
  alt: ALT,
  nota: 'Cadeia de custódia: do material lacrado ao armário.',
  passos: [
    ['package', 'Invólucro lacrado'], ['handshake', 'Entrega assinada'], ['scan-line', 'Aquisição da imagem', 'beam'],
    ['notebook-pen', 'Livro de registro'], ['folder-lock', 'Armário trancado'],
  ],
};
if (process.argv[1] === fileURLToPath(import.meta.url)) escreveFluxo('cadeia-de-custodia', FLUXO);
