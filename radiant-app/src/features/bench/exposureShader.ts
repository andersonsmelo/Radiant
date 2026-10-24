/**
 * O fantoma radiográfico da bancada, em SkSL (o shader do Skia).
 *
 * É um joelho ESTILIZADO, nunca uma incidência real: duas diáfises (fêmur e
 * tíbia), os côndilos, a patela e a silhueta de partes moles, no desenho da
 * prancheta de 2026-10-21 (`docs/design/2026-10-21-aula-bancada.html`, função
 * `render`). A geometria vive no espaço da prancheta, 270 × 330, e o shader a
 * escala para o tamanho da imagem.
 *
 * O shader NÃO decide brilho nem contraste: só pinta os três tons que o
 * `exposureModel` calcula (`bone`, `soft`, `background`) e soma o grão do ruído
 * (`noise`). Quem sobe o kV ou o mAs muda os uniformes, e a GPU refaz a imagem;
 * nenhum pixel passa pelo JS.
 *
 * SIMPLIFICAÇÕES, além das do modelo:
 * - a prancheta calcula a atenuação ∫μ dl pixel a pixel e normaliza pelo
 *   máximo da imagem. Aqui, o modelo já entrega a luminância das duas colunas
 *   de referência (10 cm de partes moles; 10 cm com 3 cm de osso), e o shader
 *   MISTURA entre elas pela espessura de cada pixel: `SOFT_FULL` unidades de
 *   corda de partes moles dão o tom `soft`, e `BONE_FULL` unidades de osso dão
 *   o tom `bone`. Fora da silhueta é o `background`. É uma mistura linear de
 *   luminâncias exibidas, não de atenuações;
 * - a medula atenua menos que o osso cortical. O peso `MARROW_WEIGHT` é a razão
 *   (μ_medula − μ_moles) / (μ_osso − μ_moles) da prancheta a 70 kV, e é fixo
 *   em qualquer kV;
 * - o grão soma três sorteios por célula (aproxima uma gaussiana) e só cai onde
 *   há tecido, como na prancheta. O sorteio é uma função de hash determinística
 *   de `seed` e da célula: a mesma imagem sai igual a cada quadro;
 * - o ruído é somado depois da curva de exibição, e não antes como na
 *   prancheta;
 * - a máscara da colimação (`field`) é um retângulo centrado, com a fração da
 *   imagem que o feixe cobre em cada lado. Fora dele o pixel é o tom sem feixe
 *   (`UNEXPOSED`), sem grão. Com `field` em (1, 1), a bancada de exposição, a
 *   máscara não cobre nada. A física e as simplificações dela estão no topo de
 *   `collimationModel.ts`.
 */

import { UNEXPOSED_LUMINANCE } from './collimationModel';

/** Dimensões do espaço da prancheta, em unidades de desenho. */
export const PHANTOM_WIDTH = 270;
export const PHANTOM_HEIGHT = 330;

/** Semente do grão: a mesma em todas as imagens, para a referência e a do aluno se compararem. */
export const EXPOSURE_SEED = 5;

export const EXPOSURE_SKSL = `
uniform float bone;
uniform float soft;
uniform float background;
uniform float noise;
uniform float seed;
uniform float2 size;
uniform float2 field;

const float PHANTOM_W = ${PHANTOM_WIDTH}.0;
const float PHANTOM_H = ${PHANTOM_HEIGHT}.0;
const float SOFT_FULL = 192.0;
const float BONE_FULL = 48.0;
const float MARROW_WEIGHT = 0.3;
const float GRAIN_CELLS_PER_UNIT = 2.0;
const float GRAIN_GAIN = 1.4;
const float COOL_TINT = 0.016;
const float UNEXPOSED = ${UNEXPOSED_LUMINANCE.toFixed(3)};

float chord(float r, float dx) {
  return dx < r ? 2.0 * sqrt(r * r - dx * dx) : 0.0;
}

float femurR(float y) {
  if (y < 120.0) return 30.0;
  if (y < 150.0) return 30.0 + (y - 120.0) * 0.45;
  if (y < 168.0) {
    float t = (y - 150.0) / 18.0;
    return 43.5 * sqrt(max(0.0, 1.0 - t * t));
  }
  return 0.0;
}

float tibiaR(float y) {
  if (y < 176.0) return 0.0;
  if (y < 186.0) {
    float t = (186.0 - y) / 10.0;
    return 41.0 * sqrt(max(0.0, 1.0 - t * t));
  }
  if (y < 220.0) return 41.0 - (y - 186.0) * 0.35;
  return 29.0;
}

float rand(float2 cell) {
  return fract(sin(dot(cell, float2(12.9898, 78.233)) + seed * 37.719) * 43758.5453);
}

half4 main(float2 fragCoord) {
  float x = fragCoord.x / size.x * PHANTOM_W;
  float y = fragCoord.y / size.y * PHANTOM_H;

  // Partes moles: a corda da silhueta, que alarga um pouco na altura do joelho.
  float knee = (y - 170.0) / 40.0;
  float softR = 96.0 + 10.0 * exp(-(knee * knee));
  float soft_chord = chord(softR, abs(x - 128.0));

  // Osso cortical (bf) e medula (bm), somados ao longo da corda.
  float cortical = 0.0;
  float marrow = 0.0;
  float rf = femurR(y);
  if (rf > 0.0) {
    float outer = chord(rf, abs(x - 122.0));
    float inner = chord(rf * 0.6, abs(x - 122.0));
    cortical += outer - inner;
    marrow += inner;
  }
  float rt = tibiaR(y);
  if (rt > 0.0) {
    float outer = chord(rt, abs(x - 132.0));
    float inner = chord(rt * 0.62, abs(x - 132.0));
    cortical += outer - inner;
    marrow += inner;
  }
  float dp = distance(float2(x, y), float2(196.0, 140.0));
  if (dp < 19.0) {
    float cp = 2.0 * sqrt(361.0 - dp * dp);
    cortical += cp * 0.35;
    marrow += cp * 0.65;
  }

  float softFrac = clamp(soft_chord / SOFT_FULL, 0.0, 1.0);
  float boneFrac = clamp((cortical + MARROW_WEIGHT * marrow) / BONE_FULL, 0.0, 1.0);
  float lum = mix(mix(background, soft, softFrac), bone, boneFrac);

  if (soft_chord > 0.0) {
    float2 cell = floor(fragCoord * GRAIN_CELLS_PER_UNIT);
    float grain = rand(cell) + rand(cell + float2(1.0, 0.0)) + rand(cell + float2(0.0, 1.0)) - 1.5;
    lum += grain * noise * GRAIN_GAIN;
  }

  // Colimação: fora do retângulo centrado que o feixe cobre, não há sinal.
  float2 offCenter = abs(fragCoord / size - 0.5);
  bool outside = offCenter.x > 0.5 * field.x || offCenter.y > 0.5 * field.y;
  lum = outside ? UNEXPOSED : clamp(lum, 0.0, 1.0);
  return half4(half(lum), half(lum), half(min(1.0, lum + COOL_TINT)), 1.0);
}
`;

/** Da luminância de 0 a 1 ao cinza `rgb(...)`, limitando o que sair da faixa. */
export function grayTone(luminance: number): string {
  const channel = Math.round(255 * Math.min(1, Math.max(0, luminance)));
  return `rgb(${channel}, ${channel}, ${channel})`;
}

/** Um retângulo do fantoma, no espaço da prancheta. `r` é o raio da quina. */
export type PhantomShape = { x: number; y: number; w: number; h: number; r: number };

/**
 * O mesmo fantoma em retângulos, para quando o shader não compila: as partes
 * moles de ponta a ponta, o fêmur (diáfise e côndilos), a tíbia (platô e
 * diáfise) e a patela. Em três tons só, sem ruído e sem medula.
 */
export const PHANTOM_SOFT: PhantomShape = { x: 32, y: 0, w: 192, h: PHANTOM_HEIGHT, r: 0 };
export const PHANTOM_BONES: PhantomShape[] = [
  { x: 92, y: 0, w: 60, h: 130, r: 0 },
  { x: 78, y: 126, w: 88, h: 42, r: 20 },
  { x: 91, y: 176, w: 82, h: 28, r: 12 },
  { x: 103, y: 200, w: 58, h: 130, r: 0 },
  { x: 177, y: 121, w: 38, h: 38, r: 19 },
];
