import fs from 'node:fs';
import path from 'node:path';
import { parse } from 'react-native-svg';
import { galaxyColors, hudIconTones, pixelColors } from '../theme';
import { diagramSvgAt, motionKeysError } from './diagramMotion';
import { P } from './diagramPalette';
import { DIAGRAMS, DIAGRAM_IDS, diagramRef, parseDiagramRef } from './diagramRegistry';

/** Cada cor copiada para a paleta pura e o token do app que ela copia. */
const SOURCES: Record<keyof typeof P, string> = {
  bg: galaxyColors.backgroundAlt,
  fill: galaxyColors.surfaceMuted,
  line: galaxyColors.textPrimary,
  muted: galaxyColors.textSecondary,
  accent: galaxyColors.navBlue,
  beam: hudIconTones.bolt.face,
  electron: pixelColors.glow,
};

const IMPORTED_IDS = DIAGRAM_IDS.filter((id) => DIAGRAMS[id].art === 'imported');
const DRAWN_IDS = DIAGRAM_IDS.filter((id) => DIAGRAMS[id].art !== 'imported');

const luminance = (hex: string) => {
  const [r, g, b] = [1, 3, 5].map((i) => {
    const c = parseInt(hex.slice(i, i + 2), 16) / 255;
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
};
const contrast = (a: string, b: string) => {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
};

/** Verificação mínima de balanceamento de tags (o Jest não traz parser de XML). */
function isBalanced(xml: string): boolean {
  const stack: string[] = [];
  for (const m of xml.matchAll(/<(\/?)([a-zA-Z]+)[^>]*?(\/?)>/g)) {
    if (m[3] === '/') continue;
    if (m[1] === '/') {
      if (stack.pop() !== m[2]) return false;
    } else stack.push(m[2]);
  }
  return stack.length === 0;
}

describe('paleta dos diagramas', () => {
  it.each(Object.keys(P) as (keyof typeof P)[])('%s copia o token de origem', (key) => {
    expect(P[key].toLowerCase()).toBe(SOURCES[key].toLowerCase());
  });

  it.each((Object.keys(P) as (keyof typeof P)[]).filter((k) => k !== 'bg' && k !== 'fill'))('traço %s tem 3:1 contra o fundo', (key) => {
    expect(contrast(P[key], P.bg)).toBeGreaterThanOrEqual(3);
  });
});

describe('registro de diagramas', () => {
  it('guarda ao menos os dois diagramas de semente', () => {
    expect(DIAGRAM_IDS).toEqual(expect.arrayContaining(['tubo-raios-x', 'colimador-abrindo']));
  });

  it.each(DIAGRAM_IDS)('%s: id, quadro e alt válidos', (id) => {
    const spec = DIAGRAMS[id];
    expect(spec.id).toBe(id);
    expect(id).toMatch(/^[a-z0-9]+(-[a-z0-9]+)*$/);
    expect(spec.width).toBeGreaterThan(0);
    expect(spec.height).toBeGreaterThan(0);
    expect(spec.alt.length).toBeGreaterThanOrEqual(20);
    expect(spec.alt.length).toBeLessThanOrEqual(160);
  });

  // Arte importada (acervo aberto, gerador externo) tem cores próprias: réguas em IMPORTED_IDS.
  it.each(DRAWN_IDS)('%s: sem texto, imagem, script nem link e só com cores da paleta', (id) => {
    const palette = new Set(Object.values(P).map((c) => c.toLowerCase()));
    for (const layer of DIAGRAMS[id].layers) {
      expect(layer.svg).not.toMatch(/<(text|image|script|foreignObject)|href/i);
      // A régua de cor só lê atributo com aspas duplas: `style=` e aspas simples passariam por ela.
      expect(layer.svg).not.toMatch(/\sstyle=|='/);
      for (const color of layer.svg.match(/#[0-9a-fA-F]{3,8}\b|rgba?\(/g) ?? []) {
        expect(palette.has(color.toLowerCase())).toBe(true);
      }
      // Nome de cor ("white") e função de cor também são cor fora da paleta.
      for (const [, value] of layer.svg.matchAll(/\b(?:fill|stroke|stop-color|color)="([^"]*)"/g)) {
        expect(value === 'none' || palette.has(value.toLowerCase())).toBe(true);
      }
    }
  });

  // Registro de origem (content-manifest/rtg-2026/figuras.json): a arte importada não entra sem proveniência.
  const figuras: { id: string; origem: string }[] = JSON.parse(
    fs.readFileSync(path.resolve(__dirname, '../../../../content-manifest/rtg-2026/figuras.json'), 'utf8'),
  );

  it('toda figura importada tem entrada em figuras.json, e toda entrada importada aponta para uma figura que existe', () => {
    expect(IMPORTED_IDS.filter((id) => !figuras.some((entry) => entry.id === id))).toEqual([]);
    // Arte importada declarada como "codigo" escaparia da régua de licença e do crédito.
    expect(IMPORTED_IDS.filter((id) => !['acervo', 'anatomy', 'gerada'].includes(figuras.find((entry) => entry.id === id)?.origem ?? ''))).toEqual([]);
    const importedEntries = figuras.filter((entry) => ['acervo', 'anatomy', 'gerada'].includes(entry.origem));
    expect(importedEntries.filter((entry) => !IMPORTED_IDS.includes(entry.id)).map((entry) => entry.id)).toEqual([]);
  });

  // Exceção nomeada: dois desenhos completos do mesmo autor no mesmo quadro (ver docs/evidence/2026-11-19-figuras/lote-1E.md).
  const TETO_POR_FIGURA: Record<string, number> = { 'respiracao-diafragma': 2 * 240 * 1024 };

  it.each(IMPORTED_IDS)('%s (importada): sem texto, imagem, script, link, CSS nem efeito que o react-native-svg ignora', (id) => {
    const spec = DIAGRAMS[id];
    expect(spec.layers.length).toBeGreaterThanOrEqual(1);
    expect(spec.layers.length).toBeLessThanOrEqual(8);
    expect([spec.width, spec.height]).toEqual([320, 240]);
    for (const layer of spec.layers) {
      expect(layer.svg).not.toMatch(/<(text|image|script|foreignObject|style|filter|mask|clipPath|use|pattern)\b|href/i);
      // CSS não chega ao SvgXml: classe, estilo inline, variável, animação e vector-effect ficam de fora.
      expect(layer.svg).not.toMatch(/\s(class|style|filter|mask|clip-path|vector-effect)=|var\(|@keyframes|='/);
      // Gradiente só por id local da própria camada (cada camada é um SvgXml separado).
      for (const [, ref] of layer.svg.matchAll(/url\(#([^)]+)\)/g)) expect(layer.svg).toContain(`id="${ref}"`);
      for (const [, value] of layer.svg.matchAll(/\b(?:fill|stroke|stop-color)="([^"]*)"/g)) {
        expect(value).toMatch(/^(none|#[0-9a-f]{6}|url\(#[^)]+\))$/);
      }
    }
    // Teto medido em 2026-11-19: crânio 75 KiB, leito 222 KiB de SVG. Arte acima disso vai para imagem.
    expect(spec.layers.reduce((n, l) => n + l.svg.length, 0)).toBeLessThanOrEqual(TETO_POR_FIGURA[id] ?? 240 * 1024);
  });

  it('a soma do SVG de todas as figuras importadas cabe no orçamento do plano', () => {
    // (24 x 75.211 do crânio + 22 x 225.380 do leito) x 1,2 = 8.116.109 bytes, medido em 2026-11-19 (docs/evidence/2026-11-19-figuras/orcamento.md).
    const TETO_TOTAL = 8_116_109;
    const soma = IMPORTED_IDS.reduce((n, id) => n + DIAGRAMS[id].layers.reduce((m, l) => m + l.svg.length, 0), 0);
    expect(soma).toBeLessThanOrEqual(TETO_TOTAL);
  });

  it.each(DIAGRAM_IDS)('%s: diagramSvgAt devolve XML bem formado em 0, 0,5 e 1', (id) => {
    for (const progress of [0, 0.5, 1]) {
      const xml = diagramSvgAt(DIAGRAMS[id], progress);
      expect(xml.startsWith('<svg ')).toBe(true);
      expect(xml.endsWith('</svg>')).toBe(true);
      expect(isBalanced(xml)).toBe(true);
      // O parser que o aparelho usa: não pode lançar nem devolver nulo.
      expect(parse(xml)).not.toBeNull();
    }
  });

  it.each(DIAGRAM_IDS)('%s: keys do movimento em ordem crescente e de 0 a 1', (id) => {
    for (const layer of DIAGRAMS[id].layers) expect(motionKeysError(layer.motion)).toBeNull();
  });

  it('o colimador tem laço, e o tubo e a sala com riscos são parados', () => {
    expect(DIAGRAMS['colimador-abrindo'].periodMs).toBeGreaterThan(0);
    expect(DIAGRAMS['tubo-raios-x'].periodMs).toBeUndefined();
    expect(DIAGRAMS['sala-com-riscos'].periodMs).toBeUndefined();
  });

  it('diagramRef e parseDiagramRef são inversas', () => {
    for (const id of DIAGRAM_IDS) expect(parseDiagramRef(diagramRef(id))).toBe(id);
    expect(parseDiagramRef('licensed-image-1')).toBeNull();
    expect(parseDiagramRef('diagram:')).toBeNull();
  });
});

// O react-native-svg do iOS aborta (SIGABRT em RNSVGSvgView definePainter) ao registrar degradê sem id.
describe('servidores de pintura', () => {
  it.each(DIAGRAM_IDS)('%s: todo degradê tem id', (id) => {
    const semId: string[] = [];
    for (const layer of DIAGRAMS[id].layers) {
      // Lê a abertura de cada elemento, não o texto solto: um comentário não casa.
      for (const [open] of layer.svg.matchAll(/<(?:linear|radial)Gradient\b[^>]*>/g)) if (!/\sid="[^"]+"/.test(open)) semId.push(open);
    }
    expect(semId).toEqual([]);
  });
});
