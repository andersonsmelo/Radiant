// Fluxo de pesquisa (m31). Mesma grade e mesmo gerador da cadeia de custódia: ver cadeia-de-custodia.mjs.
import { fileURLToPath } from 'node:url';
import { ALT, escreveFluxo } from './cadeia-de-custodia.mjs';

export const FLUXO = {
  alt: ALT,
  nota: 'Percurso de um estudo: da aprovação ao arquivo trancado.',
  passos: [
    ['file-check', 'Aprovação do comitê'], ['file-signature', 'Consentimento assinado'], ['scan-line', 'Aquisição da imagem', 'beam'],
    ['eye-off', 'Ficha com o nome coberto'], ['folder-lock', 'Arquivo trancado'],
  ],
};
if (process.argv[1] === fileURLToPath(import.meta.url)) escreveFluxo('fluxo-de-pesquisa', FLUXO);
