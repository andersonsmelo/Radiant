import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import test from 'node:test';
import { fileURLToPath } from 'node:url';

const APP_ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const REPO_ROOT = path.resolve(APP_ROOT, '..');

// PNG: assinatura de 8 bytes, depois IHDR. width em 16..19, height em 20..23,
// bit depth em 24, color type em 25 (tudo big-endian).
// Color types: 0 cinza, 2 RGB, 3 indexado, 4 cinza+alpha, 6 RGBA.
const ALPHA_TYPES = new Set([4, 6]);

export function readPngHeader(absPath) {
  const buf = fs.readFileSync(absPath);
  assert.equal(
    buf.subarray(0, 8).toString('hex'),
    '89504e470d0a1a0a',
    `${absPath}: nao e um PNG valido`
  );
  const colorType = buf.readUInt8(25);
  // tRNS da transparencia a um PNG sem canal alpha; conta como alpha.
  // Percorre a cadeia real de chunks (comprimento + tipo + dados + CRC) a partir
  // do fim da assinatura, em vez de buscar 'tRNS' por substring no buffer inteiro:
  // uma busca por substring tambem varre o stream comprimido do IDAT, onde uma
  // coincidencia acidental de 4 bytes e possivel e cresce conforme mais assets
  // entram no contrato.
  let hasTrns = false;
  let offset = 8;
  while (offset + 8 <= buf.length) {
    const chunkLength = buf.readUInt32BE(offset);
    const chunkType = buf.toString('ascii', offset + 4, offset + 8);
    if (chunkType === 'tRNS') {
      hasTrns = true;
    }
    if (chunkType === 'IEND') {
      break;
    }
    offset += 8 + chunkLength + 4; // comprimento + tipo, depois dados + CRC
  }
  return {
    width: buf.readUInt32BE(16),
    height: buf.readUInt32BE(20),
    colorType,
    hasAlpha: ALPHA_TYPES.has(colorType) || hasTrns,
    bytes: buf.length,
  };
}

const ASSETS = [
  { file: 'radiant-app/assets/images/icon.png', w: 1024, h: 1024, alpha: false },
  { file: 'radiant-app/assets/images/android-icon-foreground.png', w: 512, h: 512, alpha: true },
  { file: 'radiant-app/assets/images/android-icon-background.png', w: 512, h: 512, alpha: true },
  { file: 'radiant-app/assets/images/splash-icon.png', w: 1024, h: 1024, alpha: true },
  { file: 'radiant-app/assets/images/favicon.png', w: 48, h: 48, alpha: true },
  { file: 'docs/store/assets/play-icon-512.png', w: 512, h: 512, alpha: true, maxBytes: 1024 * 1024 },
  { file: 'docs/store/assets/feature-graphic.png', w: 1024, h: 500, alpha: false },
];

for (const asset of ASSETS) {
  test(`asset de loja: ${asset.file}`, () => {
    const abs = path.join(REPO_ROOT, asset.file);
    assert.ok(fs.existsSync(abs), `${asset.file}: ausente`);
    const h = readPngHeader(abs);
    assert.equal(h.width, asset.w, `${asset.file}: largura`);
    assert.equal(h.height, asset.h, `${asset.file}: altura`);
    assert.equal(
      h.hasAlpha,
      asset.alpha,
      `${asset.file}: alpha deveria ser ${asset.alpha}. A Apple rejeita icone com alpha; ` +
        `o Play exige alpha no icone 512 e proibe no feature graphic.`
    );
    if (asset.maxBytes) {
      assert.ok(h.bytes <= asset.maxBytes, `${asset.file}: ${h.bytes}B excede ${asset.maxBytes}B`);
    }
  });
}

test('camada monocromatica e estruturalmente monocromatica', () => {
  const abs = path.join(REPO_ROOT, 'radiant-app/assets/images/android-icon-monochrome.png');
  assert.ok(fs.existsSync(abs), 'android-icon-monochrome.png: ausente');
  const h = readPngHeader(abs);
  assert.equal(h.width, 432);
  assert.equal(h.height, 432);
  // color type 4 (cinza + alpha) nao e exigencia de Android nem de Play: o sistema
  // decodifica o PNG e usa o alpha como mascara de tint, independente do encoding.
  // E invariante auto-imposta do nosso pipeline (o gerador emite modo LA, que sai
  // como color type 4 naturalmente), escolhida porque verificar a estrutura do
  // arquivo e barato, enquanto confirmar R=G=B pixel a pixel em Node puro exigiria
  // implementar inflate para decodificar o PNG.
  assert.equal(
    h.colorType,
    4,
    'monochrome deve ser PNG cinza+alpha (color type 4) — convencao do nosso ' +
      'pipeline de geracao, nao requisito de plataforma'
  );
});

test('screenshots da loja respeitam o teto de proporcao do Play', () => {
  const dir = path.join(REPO_ROOT, 'docs/store/assets/screenshots');
  assert.ok(fs.existsSync(dir), 'docs/store/assets/screenshots: ausente');
  const shots = fs.readdirSync(dir).filter((f) => f.endsWith('.png'));
  assert.ok(shots.length >= 2, 'o Play exige no minimo 2 screenshots de telefone');
  for (const shot of shots) {
    const h = readPngHeader(path.join(dir, shot));
    const lo = Math.min(h.width, h.height);
    const hi = Math.max(h.width, h.height);
    assert.ok(lo >= 320 && hi <= 3840, `${shot}: lado fora da faixa 320-3840`);
    // "maximum dimension can't be more than twice as long as the minimum dimension".
    // O Pixel 9 nativo (1080x2424 = 2.244:1) seria RECUSADO; capturar em 1080x1920.
    assert.ok(hi <= 2 * lo, `${shot}: proporcao ${(hi / lo).toFixed(3)}:1 excede o teto de 2:1`);
    assert.equal(h.hasAlpha, false, `${shot}: o Play nao aceita alpha em screenshot`);
  }
});
