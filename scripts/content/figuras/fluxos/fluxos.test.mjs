// Os três fluxos de ícones do Lucide (fase 4): o spec e os alvos versionados são a saída exata dos geradores,
// os ícones são os do pacote (sha256 conferido) e a figura passa nas réguas que o teste do registro aplica.
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { test } from 'node:test';
import { caminhos, gerarFluxo, ICONES } from './cadeia-de-custodia.mjs';
import { FLUXO as pesquisa } from './fluxo-de-pesquisa.mjs';
import { FLUXO as risPacs } from './fluxo-ris-pacs.mjs';
import { FLUXO as cadeia } from './cadeia-de-custodia.mjs';

const { loadAppContract } = createRequire(import.meta.url)('../../load-app-contract.cjs');
const { LABEL_DOT, badgeBoxes, labelBadgeBoxes } = loadAppContract('features/lesson-flow/renderers/hotspotTouch.ts');
const aulas = Object.fromEntries(['m22', 'm31'].map((m) => [m, JSON.parse(readFileSync(new URL(`../../../../content-manifest/rtg-2026/aulas/${m}.json`, import.meta.url), 'utf8'))]));
const FRAME_PT = 280;
const FRAME_PT_H = (FRAME_PT * 240) / 320;
const UNIDADE = 320 / FRAME_PT; // pt -> unidades do quadro

const FLUXOS = { 'cadeia-de-custodia': cadeia, 'fluxo-de-pesquisa': pesquisa, 'fluxo-ris-pacs': risPacs };
const sha = (texto) => createHash('sha256').update(texto).digest('hex');
const lerDisco = (arquivo) => readFileSync(arquivo, 'utf8');
const readme = readFileSync(new URL('../vendor/lucide/README.md', import.meta.url), 'utf8');
const figuras = JSON.parse(readFileSync(new URL('../../../../content-manifest/rtg-2026/figuras.json', import.meta.url), 'utf8'));

for (const [id, fluxo] of Object.entries(FLUXOS)) {
  const { spec, alvos } = gerarFluxo(id, fluxo);
  const disco = caminhos(id);

  test(`${id}: o spec e os alvos versionados saem do gerador, byte a byte`, () => {
    assert.equal(lerDisco(disco.spec), spec);
    assert.equal(lerDisco(disco.alvos), alvos);
  });

  test(`${id}: três camadas, sem texto, imagem, link nem cor fora da paleta`, () => {
    const camadas = [...spec.matchAll(/svg: `([^`]*)`/g)].map((m) => m[1]);
    assert.equal(camadas.length, 3);
    for (const camada of camadas) {
      assert.doesNotMatch(camada, /<(text|image|script|foreignObject|style|filter|mask|clipPath|use|pattern)\b|href|\sclass=|\sstyle=|currentColor/i);
      assert.doesNotMatch(camada, /#[0-9a-f]{3,8}\b|rgba?\(/i);
    }
    assert.match(spec, /art: 'imported'/);
    // Figura com área de toque fica parada: nenhum movimento.
    assert.doesNotMatch(spec, /motion|keys|poster/);
  });

  test(`${id}: cinco cartões na grade comum e uma região de alvo igual à caixa de cada cartão`, () => {
    const lista = JSON.parse(alvos);
    assert.equal(lista.length, 5);
    const cartoes = [...spec.matchAll(/<rect x="(\d+)" y="(\d+)" width="76" height="68"/g)].map((m) => [Number(m[1]), Number(m[2])]);
    assert.deepEqual(cartoes, [[18, 36], [122, 36], [226, 36], [226, 136], [122, 136]]);
    lista.forEach((alvo, i) => {
      assert.ok(Math.abs(alvo.x - cartoes[i][0] / 320) < 1e-4 && Math.abs(alvo.y - cartoes[i][1] / 240) < 1e-4);
      assert.ok(Math.abs(alvo.width - 76 / 320) < 1e-4 && Math.abs(alvo.height - 68 / 240) < 1e-4);
    });
  });

  test(`${id}: cada ícone é o do pacote, e o registro guarda o sha256 da concatenação dos originais`, () => {
    const nomes = fluxo.passos.map(([nome]) => nome);
    const entrada = figuras.find((e) => e.id === id);
    assert.equal(entrada.origem, 'acervo');
    assert.equal(entrada.license, 'ISC');
    assert.equal(entrada.sha256Original, sha(nomes.map((n) => ICONES.icones[n]).join('')));
    for (const nome of nomes) assert.match(readme, new RegExp(`\`${nome}\` \\| ${sha(ICONES.icones[nome])}`));
  });
}

test('o aviso de copyright do Lucide e o texto ISC estão versionados', () => {
  const licenca = readFileSync(new URL('../vendor/lucide/LICENSE', import.meta.url), 'utf8');
  assert.match(licenca, /^ISC License\n\nCopyright \(c\) 2026 Lucide Icons and Contributors/);
  assert.match(licenca, /Permission to use, copy, modify, and\/or distribute this software/);
});

// Origem: nenhum ícone usado contém desenho do Feather (MIT), para a licença continuar só ISC (decisão do dono, 2026-11-21).
test('nenhum ícone usado está na lista dos derivados do Feather, e os quatro que continham desenho dele não voltaram', () => {
  const licenca = readFileSync(new URL('../vendor/lucide/LICENSE', import.meta.url), 'utf8');
  const derivados = new Set(licenca.split('derived from the Feather project:')[1].split('The MIT License')[0].split(',').map((nome) => nome.trim()));
  const usados = new Set(Object.values(FLUXOS).flatMap((fluxo) => fluxo.passos.map(([nome]) => nome)));
  assert.ok(derivados.size > 80 && usados.size === 13);
  for (const nome of usados) assert.ok(!derivados.has(nome), `${nome} é derivado do Feather`);
  for (const nome of ['clipboard-list', 'monitor-check', 'package', 'hard-drive']) {
    assert.ok(!usados.has(nome), `${nome} contém desenho do Feather`);
    assert.equal(ICONES.icones[nome], undefined, `${nome} não deve estar em icones.json`);
  }
  assert.doesNotMatch(JSON.stringify(figuras.filter((e) => e.id in FLUXOS)), /Feather/);
});

// Selo e ponto do app contra o desenho: a régua dos itens que usam as três figuras (valem os pontos e as regiões das aulas).
const caixa = (x0, y0, x1, y1) => ({ x0, y0, x1, y1 });
const cruza = (a, b) => a.x0 < b.x1 && b.x0 < a.x1 && a.y0 < b.y1 && b.y0 < a.y1;
for (const [id, fluxo] of Object.entries(FLUXOS)) {
  const { spec } = gerarFluxo(id, fluxo);
  const camadaSetas = [...spec.matchAll(/svg: `([^`]*)`/g)][1][1];
  const setas = [...camadaSetas.matchAll(/<line x1="([\d.]+)" y1="([\d.]+)" x2="([\d.]+)" y2="([\d.]+)"[^>]*\/><polygon points="([^"]+)"/g)].map((m) => {
    const xs = [m[1], m[3], ...m[5].split(' ').map((p) => p.split(',')[0])].map(Number);
    const ys = [m[2], m[4], ...m[5].split(' ').map((p) => p.split(',')[1])].map(Number);
    return caixa(Math.min(...xs) - 0.5, Math.min(...ys) - 0.5, Math.max(...xs) + 0.5, Math.max(...ys) + 0.5);
  });
  const cartoes = JSON.parse(gerarFluxo(id, fluxo).alvos).map((a) => caixa(a.x * 320, a.y * 240, (a.x + a.width) * 320, (a.y + a.height) * 240));
  const icones = cartoes.map((c) => { const [cx, cy] = [(c.x0 + c.x1) / 2, (c.y0 + c.y1) / 2]; return caixa(cx - 24, cy - 24, cx + 24, cy + 24); });
  const itens = [];
  const walk = (no) => {
    if (Array.isArray(no)) return no.forEach(walk);
    if (!no || typeof no !== 'object') return;
    if (no.diagramId === id && (no.points || no.regions)) itens.push(no);
    Object.values(no).forEach(walk);
  };
  Object.values(aulas).forEach(walk);

  test(`${id}: o selo e o ponto do app não pisam em seta nem em ícone, e o ponto fica sobre o cartão que nomeia`, () => {
    assert.ok(itens.length >= 1, 'a figura é usada por algum item');
    assert.equal(setas.length, 4);
    const frame = { width: FRAME_PT, height: FRAME_PT_H };
    for (const item of itens) {
      const lista = item.points ?? item.regions;
      const selos = (item.points ? labelBadgeBoxes : badgeBoxes)(lista, frame).map((b) => caixa(b.left * UNIDADE, b.top * UNIDADE, (b.left + b.width) * UNIDADE, (b.top + b.height) * UNIDADE));
      selos.forEach((selo, i) => {
        for (const seta of setas) assert.ok(!cruza(selo, seta), `${item.id}: o selo ${i + 1} esconde uma seta`);
        for (const icone of icones) assert.ok(!cruza(selo, icone), `${item.id}: o selo ${i + 1} esconde um ícone`);
      });
      if (!item.points) continue;
      item.points.forEach((p, i) => {
        const [px, py] = [p.x * 320, p.y * 240];
        const alvo = cartoes[i];
        // Validade: o ponto está sobre o cartão (o alvo) E o disco do ponto não toca o quadrado do ícone.
        assert.ok(px >= alvo.x0 && px <= alvo.x1 && py >= alvo.y0 && py <= alvo.y1, `${item.id}: o ponto ${i + 1} saiu do cartão`);
        const ic = icones[i];
        const [dx, dy] = [Math.max(ic.x0 - px, 0, px - ic.x1), Math.max(ic.y0 - py, 0, py - ic.y1)];
        assert.ok(Math.hypot(dx, dy) > (LABEL_DOT / 2) * UNIDADE, `${item.id}: o ponto ${i + 1} cobre o ícone`);
        for (const seta of setas) {
          const [sx, sy] = [Math.max(seta.x0 - px, 0, px - seta.x1), Math.max(seta.y0 - py, 0, py - seta.y1)];
          assert.ok(Math.hypot(sx, sy) > (LABEL_DOT / 2) * UNIDADE, `${item.id}: o ponto ${i + 1} cobre uma seta`);
        }
      });
    }
  });
}
