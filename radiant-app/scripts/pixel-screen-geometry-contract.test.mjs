import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import test from 'node:test';
import { fileURLToPath } from 'node:url';

const appRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const assetPath = path.join(appRoot, 'src/ui/characters/assets/pixel/pixel_core_faceless.png');
const geometryPath = path.join(appRoot, 'src/ui/characters/pixelScreenGeometry.ts');

// As constantes de PIXEL_SCREEN descrevem ONDE fica a tela do Pixel dentro do
// asset. Se alguém trocar o render por um de proporção ou enquadramento
// diferente, o rosto desenhado passa a cair fora da tela — defeito que já
// aconteceu neste componente e que nenhum teste de unidade pega, porque é
// geometria de runtime. Aqui a constante é conferida contra o próprio PNG.
function readPng(absPath) {
  const buf = fs.readFileSync(absPath);
  assert.equal(buf.subarray(0, 8).toString('hex'), '89504e470d0a1a0a', `${absPath}: não é PNG`);
  return { width: buf.readUInt32BE(16), height: buf.readUInt32BE(20) };
}

function parseConstant(source, key) {
  // Aceita tanto `key: 0.292,` (propriedade de objeto) quanto
  // `key = 576 / 864;` (const de nível superior, possivelmente uma divisão) —
  // pixelScreenGeometry.ts usa as duas formas.
  const match = source.match(new RegExp(`${key}\\s*[:=]\\s*([0-9.]+(?:\\s*/\\s*[0-9.]+)?)`));
  assert.ok(match, `pixelScreenGeometry.ts define ${key}`);
  const expr = match[1];
  if (expr.includes('/')) {
    const [num, den] = expr.split('/').map((part) => Number.parseFloat(part.trim()));
    return num / den;
  }
  return Number.parseFloat(expr);
}

test('PIXEL_SCREEN descreve o asset realmente comitado', () => {
  const { width, height } = readPng(assetPath);
  assert.equal(width, 576, 'largura do asset');
  assert.equal(height, 864, 'altura do asset');

  const source = fs.readFileSync(geometryPath, 'utf8');
  const x = parseConstant(source, 'x');
  const y = parseConstant(source, 'y');
  const w = parseConstant(source, 'w');
  const h = parseConstant(source, 'h');

  // Caixa medida em 2026-08-11: x 168..336, y 200..312.
  assert.ok(Math.abs(x * width - 168) <= 6, `x=${x} deve cair em 168±6px`);
  assert.ok(Math.abs(y * height - 200) <= 6, `y=${y} deve cair em 200±6px`);
  assert.ok(Math.abs(w * width - 168) <= 6, `w=${w} deve cair em 168±6px`);
  assert.ok(Math.abs(h * height - 112) <= 6, `h=${h} deve cair em 112±6px`);

  const aspect = parseConstant(source, 'PIXEL_ASSET_ASPECT');
  assert.ok(Math.abs(aspect - width / height) < 0.01, 'PIXEL_ASSET_ASPECT bate com o PNG');
});
