/**
 * O modelo de colimação da bancada: quanto do feixe chega ao paciente quando o
 * aluno abre ou fecha o campo. É uma função pura; o shader e a tela só leem os
 * números dela.
 *
 * O fantoma é o mesmo da bancada de exposição, pintado com a exposição de
 * referência (`REFERENCE_EXPOSURE`, 70 kV e 10 mAs). Colimar não muda kV nem
 * mAs: muda só a área que o feixe cobre.
 *
 * AFIRMAÇÃO FÍSICA (o que a tela pode dizer ao aluno):
 * - com kV e mAs fixos, o produto dose-área (PDA, ou kerma-área) é
 *   proporcional à área irradiada: um campo com metade da área tem metade do
 *   produto dose-área;
 * - a dose do feixe direto num ponto dentro do campo não muda ao colimar. O
 *   que cai é a área que recebe esse feixe (Ruling 15);
 * - um campo menor reduz a radiação espalhada, porque menos tecido é
 *   irradiado e menos tecido espalha o feixe;
 * - colimar até a região de interesse é proteção radiológica: o que fica fora
 *   do campo não recebe o feixe direto.
 *
 * SIMPLIFICAÇÃO (o que o modelo faz de conta):
 * - o campo é um retângulo ideal, centrado na imagem, sem penumbra: a borda é
 *   um degrau, e fora dela não chega nada;
 * - o produto dose-área é relativo e não tem unidade (o real é em Gy·cm²): é
 *   a área do campo dividida pela área do campo todo (a imagem inteira), que
 *   vale 1;
 * - o espalhamento não é calculado. A imagem dentro do campo é a mesma com
 *   qualquer campo, embora na prática menos espalhamento melhore um pouco o
 *   contraste. Pelo mesmo motivo, a dose TOTAL num ponto dentro do campo,
 *   que soma o espalhamento do tecido vizinho, cai um pouco ao colimar; o
 *   modelo não a calcula, e a tela não fala dela;
 * - fora do campo, a imagem é um tom claro uniforme (`UNEXPOSED_LUMINANCE`):
 *   sem feixe não há sinal, e na convenção do `exposureModel` quanto menos
 *   sinal, mais claro. Muitos equipamentos digitais escurecem essa faixa por
 *   processamento; aqui ela fica clara, como num filme sem exposição;
 * - a imagem do fantoma, 270 × 330 unidades da prancheta, cobre 27 × 33 cm:
 *   10 unidades por centímetro. O desenho do joelho não tem as espessuras do
 *   modelo de exposição, que são de uma coluna de tecido, e não do desenho;
 * - o domínio é de 1 cm até o tamanho da imagem, em cada lado. Fora dele, a
 *   entrada é limitada ao domínio.
 */

export type CollimationInput = { fieldWidth: number; fieldHeight: number };

export type CollimationOutput = {
  /** As medidas do campo, em cm, já limitadas ao domínio. */
  fieldWidth: number;
  fieldHeight: number;
  /** A área do campo, em cm². */
  area: number;
  /** O produto dose-área relativo ao campo todo, de 0 a 1 (o campo todo vale 1). */
  relativeDoseArea: number;
  /** A fração da imagem que o campo cobre, em cada lado, de 0 a 1. */
  fieldFraction: { width: number; height: number };
};

/** O tamanho da imagem do fantoma, em cm: 10 unidades da prancheta por cm. */
export const DETECTOR_WIDTH_CM = 27;
export const DETECTOR_HEIGHT_CM = 33;

/** O campo todo: a imagem inteira. É o ponto de partida, e o seu produto dose-área vale 1. */
export const FULL_FIELD: CollimationInput = Object.freeze({
  fieldWidth: DETECTOR_WIDTH_CM,
  fieldHeight: DETECTOR_HEIGHT_CM,
});

/** O menor lado do campo, em cm. */
const FIELD_MIN_CM = 1;

/**
 * O tom de fora do campo, onde não chega feixe. Fica acima do osso, que o
 * processamento fixa perto de 0,93, para a faixa colimada não se confundir
 * com ele.
 */
export const UNEXPOSED_LUMINANCE = 0.97;

const FULL_AREA = DETECTOR_WIDTH_CM * DETECTOR_HEIGHT_CM;

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

/** Entrada que não é número cai no campo todo; o resto é limitado. */
function limited(value: number, fallback: number, max: number): number {
  return Number.isFinite(value) ? clamp(value, FIELD_MIN_CM, max) : fallback;
}

export function collimationModel(input: CollimationInput): CollimationOutput {
  const fieldWidth = limited(input.fieldWidth, FULL_FIELD.fieldWidth, DETECTOR_WIDTH_CM);
  const fieldHeight = limited(input.fieldHeight, FULL_FIELD.fieldHeight, DETECTOR_HEIGHT_CM);
  const area = fieldWidth * fieldHeight;

  return {
    fieldWidth,
    fieldHeight,
    area,
    relativeDoseArea: area / FULL_AREA,
    fieldFraction: {
      width: fieldWidth / DETECTOR_WIDTH_CM,
      height: fieldHeight / DETECTOR_HEIGHT_CM,
    },
  };
}
