// Fluxo RIS-PACS (m22). Mesma grade e mesmo gerador da cadeia de custódia: ver cadeia-de-custodia.mjs.
import { fileURLToPath } from 'node:url';
import { alt, escreveFluxo } from './cadeia-de-custodia.mjs';

export const FLUXO = {
  alt: alt('Fluxo do pedido de um exame'),
  nota: 'Caminho do pedido: do cadastro à estação de visualização.',
  passos: [
    ['file-pen', 'Cadastro e pedido'], ['list-checks', 'Lista de trabalho'], ['radiation', 'Equipamento de raios X', 'beam'],
    ['images', 'Arquivo de imagens'], ['laptop-minimal-check', 'Estação de visualização'],
  ],
};
if (process.argv[1] === fileURLToPath(import.meta.url)) escreveFluxo('fluxo-ris-pacs', FLUXO);
