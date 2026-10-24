/**
 * O modelo de exposição da bancada: como a radiografia simulada responde ao kV
 * e ao mAs. É uma função pura; o shader e a tela só leem os números dela.
 *
 * Segue o simulador da prancheta de 2026-10-21
 * (`docs/design/2026-10-21-aula-bancada.html`, função `render`), que modela uma
 * radiografia DIGITAL: o processamento ajusta o brilho, o kV define o contraste
 * e o mAs define o ruído.
 *
 * AFIRMAÇÃO FÍSICA (o que a tela pode dizer ao aluno):
 * - o kV controla a penetração do feixe. Com kV mais alto, o feixe atravessa
 *   mais, a atenuação cai, e cai mais no osso do que nas partes moles. Por
 *   isso o contraste entre osso e partes moles diminui;
 * - o mAs controla a quantidade de fótons. O ruído quântico (o mosqueado) cai
 *   com 1/√mAs: quadruplicar o mAs divide o ruído por dois;
 * - com processamento digital, o mAs não muda o brilho final da imagem, nem o
 *   contraste entre osso e partes moles. Muda só o ruído.
 *
 * SIMPLIFICAÇÃO (o que o modelo faz de conta):
 * - o fantoma é estilizado, nunca uma incidência real: uma coluna de 10 cm de
 *   partes moles, com 3 cm dela ocupados por osso. As espessuras são fixas;
 * - a atenuação é exponencial e monocromática. Os coeficientes (`MU_SOFT_60`,
 *   `MU_BONE_60` e os expoentes) são os da prancheta, de ordem de grandeza
 *   plausível mas não medidos. O feixe real é polienergético e tem dispersão;
 * - a normalização do processamento é ideal: o osso sempre cai no mesmo nível
 *   (`BONE_WHITE`), e o fundo no mesmo nível (`BLACK_LEVEL`), em qualquer kV;
 * - o ruído depende só do mAs. Na prática o kV também muda quantos fótons
 *   chegam ao detector, e o ruído muda um pouco com ele; aqui isso é ignorado;
 * - o domínio é kV de 40 a 120 e mAs de 1 a 40. Fora dele, a entrada é limitada
 *   ao domínio.
 *
 * Convenção: osso claro (luminância alta), fundo escuro. `background` é a
 * região sem tecido.
 */

export type ExposureInput = { kv: number; mas: number };

/** Luminâncias de 0 (preto) a 1 (branco) e o desvio do ruído, de 0 a 1. */
export type ExposureOutput = {
  bone: number;
  soft: number;
  background: number;
  noise: number;
};

/** O ponto de partida da bancada: 70 kV e 10 mAs. */
export const REFERENCE_EXPOSURE: ExposureInput = { kv: 70, mas: 10 };

const KV_MIN = 40;
const KV_MAX = 120;
const MAS_MIN = 1;
const MAS_MAX = 40;

/** Coluna de partes moles do fantoma, em cm. */
const SOFT_PATH_CM = 10;
/** Parte dessa coluna ocupada por osso, em cm. */
const BONE_PATH_CM = 3;

/** Atenuação das partes moles e do osso a 60 kV, em 1/cm (da prancheta). */
const MU_SOFT_60 = 0.21;
const MU_BONE_60 = 0.62;
/** Quanto cada atenuação cai com o kV: ~(60/kV)^n. No osso cai bem mais. */
const SOFT_KV_EXPONENT = 1.15;
const BONE_KV_EXPONENT = 2.3;

/** Onde o processamento digital fixa o osso, deixando folga até o branco. */
const BONE_WHITE = 0.92;
/** Nível do fundo sem tecido: o preto do detector, não zero absoluto. */
const BLACK_LEVEL = 0.02;
/** Curva de exibição da prancheta (gama). */
const DISPLAY_GAMMA = 0.85;

/** Desvio do ruído a 12 mAs, e o mAs em que ele vale (da prancheta). */
const NOISE_AT_12_MAS = 0.045;
const NOISE_REFERENCE_MAS = 12;

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

/** Entrada que não é número cai no ponto de referência; o resto é limitado. */
function limited(value: number, fallback: number, min: number, max: number): number {
  return Number.isFinite(value) ? clamp(value, min, max) : fallback;
}

/** Da atenuação normalizada (0 a 1) à luminância exibida. */
function display(level: number): number {
  return clamp(BLACK_LEVEL + (1 - BLACK_LEVEL) * Math.pow(level, DISPLAY_GAMMA), 0, 1);
}

export function exposureModel(input: ExposureInput): ExposureOutput {
  const kv = limited(input.kv, REFERENCE_EXPOSURE.kv, KV_MIN, KV_MAX);
  const mas = limited(input.mas, REFERENCE_EXPOSURE.mas, MAS_MIN, MAS_MAX);

  const muSoft = MU_SOFT_60 * Math.pow(60 / kv, SOFT_KV_EXPONENT);
  const muBone = MU_BONE_60 * Math.pow(60 / kv, BONE_KV_EXPONENT);

  // Integral da atenuação ao longo de cada coluna: é o que o detector "vê".
  const softPath = muSoft * SOFT_PATH_CM;
  const bonePath = muSoft * (SOFT_PATH_CM - BONE_PATH_CM) + muBone * BONE_PATH_CM;

  // O processamento digital normaliza: o osso (a coluna mais atenuada) sempre
  // cai em BONE_WHITE. O contraste relativo ainda depende do kV.
  const scale = BONE_WHITE / bonePath;

  const noise = NOISE_AT_12_MAS * Math.sqrt(NOISE_REFERENCE_MAS / mas);

  return {
    bone: display(bonePath * scale),
    soft: display(softPath * scale),
    background: display(0),
    noise: clamp(noise, 0, 1),
  };
}

/** Contraste entre osso e partes moles: `bone − soft`. */
export function subjectContrast(out: ExposureOutput): number {
  return out.bone - out.soft;
}
