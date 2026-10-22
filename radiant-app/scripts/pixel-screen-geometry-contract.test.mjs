import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import test from 'node:test';
import { appRoot, resolveNode, resolveProperty, sourceOf, ts } from './ast-helpers.mjs';

const geometryPath = path.join(appRoot, 'src/ui/characters/pixelScreenGeometry.ts');
const bodyPath = 'src/ui/characters/PixelBody.tsx';

// As constantes de PIXEL_SCREEN descrevem ONDE fica a tela do Pixel dentro da
// caixa do desenho. Se alguém trocar o corpo por um de proporção ou
// enquadramento diferente, o rosto desenhado passa a cair fora da tela — defeito
// que já aconteceu neste componente e que nenhum teste de unidade pega, porque é
// geometria de runtime. Desde 2026-10-21 o corpo é SVG (`PixelBody`), então a
// caixa e a tela são lidas do código dele, por AST, e não mais de um PNG.
function readNumber(name, ...keys) {
  let current = resolveNode(ts.factory.createIdentifier(name), sourceOf(bodyPath));
  for (const key of keys) current = resolveProperty(current, key);
  assert.equal(typeof current.value, 'number', `${name}.${keys.join('.')} não resolve para um número`);
  return current.value;
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

test('PIXEL_SCREEN descreve o desenho realmente comitado', () => {
  assert.ok(fs.existsSync(path.join(appRoot, bodyPath)), `${bodyPath} existe`);

  const width = readNumber('PIXEL_VIEWBOX', 'width');
  const height = readNumber('PIXEL_VIEWBOX', 'height');
  assert.equal(width, 576, 'largura da caixa');
  assert.equal(height, 864, 'altura da caixa');

  const rect = {
    x: readNumber('PIXEL_SCREEN_RECT', 'x'),
    y: readNumber('PIXEL_SCREEN_RECT', 'y'),
    w: readNumber('PIXEL_SCREEN_RECT', 'width'),
    h: readNumber('PIXEL_SCREEN_RECT', 'height'),
  };
  assert.ok(rect.x + rect.w <= width && rect.y + rect.h <= height, 'a tela cabe na caixa');

  const source = fs.readFileSync(geometryPath, 'utf8');
  const x = parseConstant(source, 'x');
  const y = parseConstant(source, 'y');
  const w = parseConstant(source, 'w');
  const h = parseConstant(source, 'h');

  // Cada fração de PIXEL_SCREEN tem de cair no retângulo que o corpo desenha.
  assert.ok(Math.abs(x * width - rect.x) <= 6, `x=${x} deve cair em ${rect.x}±6px`);
  assert.ok(Math.abs(y * height - rect.y) <= 6, `y=${y} deve cair em ${rect.y}±6px`);
  assert.ok(Math.abs(w * width - rect.w) <= 6, `w=${w} deve cair em ${rect.w}±6px`);
  assert.ok(Math.abs(h * height - rect.h) <= 6, `h=${h} deve cair em ${rect.h}±6px`);

  // E o retângulo é o medido na aprovação de 2026-10-21: x 168, y 200, 168 × 112.
  assert.deepEqual(rect, { x: 168, y: 200, w: 168, h: 112 });

  const aspect = parseConstant(source, 'PIXEL_ASSET_ASPECT');
  assert.ok(Math.abs(aspect - width / height) < 0.01, 'PIXEL_ASSET_ASPECT bate com a caixa');
});
