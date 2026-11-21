// Os três fluxos de ícones do Lucide (fase 4): o spec e os alvos versionados são a saída exata dos geradores,
// os ícones são os do pacote (sha256 conferido) e a figura passa nas réguas que o teste do registro aplica.
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { test } from 'node:test';
import { caminhos, gerarFluxo, ICONES } from './cadeia-de-custodia.mjs';
import { FLUXO as pesquisa } from './fluxo-de-pesquisa.mjs';
import { FLUXO as risPacs } from './fluxo-ris-pacs.mjs';
import { FLUXO as cadeia } from './cadeia-de-custodia.mjs';

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
