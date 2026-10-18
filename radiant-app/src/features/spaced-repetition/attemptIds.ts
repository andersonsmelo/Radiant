// Ids das tentativas que o journal por item grava. O journal valida o id com o
// validador de evidência, que procura dado sensível em todo valor; por isso o
// sorteio daqui não pode compor nenhuma sigla que esse detector reconheça.
//
// FILA 63 (2026-10-18): o sufixo era sorteado em base 36 e, em ~1 de 1.600
// avaliações e ~1 de 1.060 lições, compunha "rg", "cpf" ou "pacs" entre dígitos.
// O journal recusava a tentativa. Toda sigla do detector tem ao menos uma letra
// fora de a–f, então o sorteio hexadecimal não consegue compô-la.
const HEX_DIGITS = '0123456789abcdef';

function randomHex(length: number): string {
    let value = '';
    for (let index = 0; index < length; index += 1) value += HEX_DIGITS[Math.floor(Math.random() * 16)];
    return value;
}

/** Sufixo comum ao `operationId` e ao `attemptId` de uma avaliação. 32 bits, como os 6 dígitos em base 36 de antes. */
export function assessmentAttemptSuffix(now: number = Date.now()): string {
    return `${now}-${randomHex(8)}`;
}

/** Id da tentativa de estudo de uma lição. 52 bits, como a fração em base 36 de antes. */
export function studyAttemptId(now: number = Date.now()): string {
    return `study:${now}:${randomHex(13)}`;
}
