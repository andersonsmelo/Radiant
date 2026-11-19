import { parse } from 'react-native-svg';
import { galaxyColors, hudIconTones, pixelColors } from '../theme';
import { diagramSvgAt } from './diagramMotion';
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

  it.each(DIAGRAM_IDS)('%s: sem texto, imagem, script nem link e só com cores da paleta', (id) => {
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

  it('o colimador tem laço, e o tubo é parado', () => {
    expect(DIAGRAMS['colimador-abrindo'].periodMs).toBeGreaterThan(0);
    expect(DIAGRAMS['tubo-raios-x'].periodMs).toBeUndefined();
  });

  it('diagramRef e parseDiagramRef são inversas', () => {
    for (const id of DIAGRAM_IDS) expect(parseDiagramRef(diagramRef(id))).toBe(id);
    expect(parseDiagramRef('licensed-image-1')).toBeNull();
    expect(parseDiagramRef('diagram:')).toBeNull();
  });
});
