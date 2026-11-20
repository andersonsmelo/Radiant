import assert from 'node:assert/strict';
import test from 'node:test';
import { BADGE_PT, MARKER_PT, previewHtml } from './alvos-preview.mjs';

// A prévia desenha o que o app põe por cima: o ponto pequeno do label (LABEL_DOT) sobre o alvo com o selo do número ao
// lado, e o selo de 36 x 24 pt FORA da região (E11). Sem isso, o que o aluno realmente vê não aparece na prévia.
const regions = [{ nome: 'A', x: 0.4, y: 0.4, width: 0.2, height: 0.2 }];
test('o ponto de label sai como marcador pequeno sobre o alvo e o número num selo fora dele', () => {
  const html = previewHtml('cranio-de-perfil-ossos', regions, [{ label: 'A', n: 2, x: 0.5, y: 0.5 }]);
  const raio = (MARKER_PT / 2) * (320 / 280);
  assert.ok(MARKER_PT >= 10 && MARKER_PT <= 12);
  assert.ok(html.includes(`<circle cx="160" cy="120" r="${raio}" fill="#171920"`), 'marcador pequeno no centro do alvo');
  // Selo acima e à direita, encostado: borda esquerda no limite direito do ponto, borda de baixo no topo dele.
  const largura = BADGE_PT.width * (320 / 280), altura = BADGE_PT.height * (240 / 210);
  assert.ok(html.includes(`<rect x="${160 + raio}" y="${120 - raio - altura}" width="${largura}" height="${altura}"`));
  assert.ok(html.includes('>2</text>'));
});
test('a região de hotspot sai com o selo de 36 x 24 pt fora da região, dentro do quadro', () => {
  const html = previewHtml('cranio-de-perfil-ossos', regions, [{ label: 'A', n: 1, x: 0.5, y: 0.5, width: 0.1, height: 0.1 }]);
  const largura = BADGE_PT.width * (320 / 280), altura = BADGE_PT.height * (240 / 210);
  // Acima da região: borda de baixo do selo em y = 0,5 * 240, alinhado à borda esquerda dela.
  assert.ok(html.includes(`<rect x="160" y="${120 - altura}" width="${largura}" height="${altura}"`));
  // Região no canto de baixo: o selo vai acima dela, e não é empurrado para dentro dela.
  const canto = previewHtml('cranio-de-perfil-ossos', regions, [{ label: 'A', n: 1, x: 0.9, y: 0.9, width: 0.1, height: 0.1 }]);
  // Só o último rect é o selo; a conta em ponto flutuante dá a mesma posição com diferença de 1e-13, então compara com folga.
  const [, x, y] = [...canto.matchAll(/<rect x="([\d.]+)" y="([\d.]+)" width="[\d.]+" height="[\d.]+" rx="4"/g)].at(-1).map(Number).concat();
  assert.ok(Math.abs(x - (320 - largura)) < 1e-6 && Math.abs(y - (216 - altura)) < 1e-6, `selo em ${x},${y}`);
});
