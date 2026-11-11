import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import test from 'node:test';
import { fileURLToPath } from 'node:url';

const appRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

// O rosto do Pixel é desenhado por cima da imagem. Se ele for posicionado
// contra o frame do componente em vez da caixa da imagem, ele erra o alvo por
// uma cabeça inteira — foi exatamente o defeito que existiu até 2026-08-11, e
// nenhum lint, typecheck, jest ou visual:qa o pegou, porque é geometria de
// runtime. A regra é estrutural e por isso é verificada na fonte.
test('PixelFace mede contra a imagem, nunca contra o frame', async () => {
  const source = await readFile(path.join(appRoot, 'src/ui/characters/PixelFace.tsx'), 'utf8');

  // A presença textual de `PIXEL_SCREEN` ou `imageWidth` no arquivo não prova
  // que a geometria chega até a matemática de posição — só prova que as
  // palavras aparecem em algum lugar. O que importa é que a fração da tela
  // seja de fato multiplicada pela dimensão da imagem, nos dois eixos.
  assert.match(
    source,
    /PIXEL_SCREEN\.\w+\s*\*\s*imageWidth/,
    'PixelFace multiplica um campo de PIXEL_SCREEN por imageWidth',
  );
  assert.match(
    source,
    /PIXEL_SCREEN\.\w+\s*\*\s*imageHeight/,
    'PixelFace multiplica um campo de PIXEL_SCREEN por imageHeight',
  );
  // Percentual em string é sempre relativo ao PAI. Se aparecer aqui, alguém
  // voltou a medir contra o container e o rosto vai flutuar de novo.
  assert.doesNotMatch(
    source,
    /(top|left|right|bottom):\s*'[0-9]+%'/,
    'PixelFace não posiciona por percentual de container',
  );
  // PixelFace nunca recebe `dimension` — sua API é imageWidth/imageHeight.
  // Foi exatamente `top: Math.round(dimension * 0.22)` (fração do FRAME) que
  // shipou o defeito que esta task corrige. Qualquer ocorrência de
  // `dimension` aqui é, por construção, a unidade errada — não importa a
  // sintaxe usada para chegar nela.
  assert.doesNotMatch(
    source,
    /\bdimension\b/,
    'PixelFace não referencia `dimension` — isso é geometria do frame, não da imagem',
  );
});

test('PixelIllustration põe corpo e rosto na mesma caixa', async () => {
  const source = await readFile(
    path.join(appRoot, 'src/ui/characters/PixelIllustration.tsx'),
    'utf8',
  );
  assert.match(source, /<PixelFace/, 'PixelIllustration renderiza PixelFace');
  assert.match(source, /<PixelBody/, 'PixelIllustration renderiza PixelBody');
  assert.doesNotMatch(source, /<Image\b/, 'PixelIllustration não desenha mais uma imagem raster');

  // O corpo e o rosto recebem as MESMAS dimensões da caixa inteira, até na
  // variante cabeça: ela recorta a caixa, não a redesenha. Cada elemento é
  // lido até o próprio fechamento, para a comparação não vazar de um para o outro.
  const body = source.match(/<PixelBody\b([\s\S]*?)\/>/);
  const face = source.match(/<PixelFace\b([\s\S]*?)\/>/);
  assert.ok(body, 'PixelBody é renderizado com props');
  assert.ok(face, 'PixelFace é renderizado com props');

  const prop = (attributes, name) => attributes.match(new RegExp(`\\b${name}=\\{([^}]+)\\}`))?.[1].trim();
  assert.ok(prop(body[1], 'width'), 'PixelBody recebe width');
  assert.ok(prop(body[1], 'height'), 'PixelBody recebe height');
  assert.equal(
    prop(face[1], 'imageWidth'),
    prop(body[1], 'width'),
    'PixelFace.imageWidth é a mesma largura do PixelBody',
  );
  assert.equal(
    prop(face[1], 'imageHeight'),
    prop(body[1], 'height'),
    'PixelFace.imageHeight é a mesma altura do PixelBody',
  );
});
