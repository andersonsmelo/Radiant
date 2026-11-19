import assert from 'node:assert/strict';
import test from 'node:test';
import { BADGE_PT, MARKER_PT, previewHtml } from './alvos-preview.mjs';

// A prévia desenha o que o app põe por cima: o marcador de 28 pt do label (raio 14 pt, 16 unidades num quadro de 320
// largura medido a 280 pt) e o selo de 36 x 24 pt da região. Sem isso, a estrutura escondida embaixo passa despercebida.
const regions = [{ nome: 'A', x: 0.4, y: 0.4, width: 0.2, height: 0.2 }];
test('o ponto de label sai como marcador opaco de 28 pt, no raio certo', () => {
  const html = previewHtml('cranio-de-perfil-ossos', regions, [{ label: 'A', n: 2, x: 0.5, y: 0.5 }]);
  const raio = (MARKER_PT / 2) * (320 / 280);
  assert.ok(html.includes(`r="${raio}" fill="#171920"`), 'marcador com o raio de 14 pt em unidades do quadro');
  assert.ok(html.includes('>2</text>'));
});
test('a região de hotspot sai com o selo de 36 x 24 pt no canto, dentro do quadro', () => {
  const html = previewHtml('cranio-de-perfil-ossos', regions, [{ label: 'A', n: 1, x: 0.9, y: 0.9, width: 0.1, height: 0.1 }]);
  const largura = BADGE_PT.width * (320 / 280);
  assert.ok(html.includes(`width="${largura}" height="${BADGE_PT.height * (240 / 210)}"`));
  // Região no canto de baixo: o selo é empurrado para dentro do quadro (x = 320 - largura).
  assert.ok(html.includes(`<rect x="${320 - largura}"`));
});
