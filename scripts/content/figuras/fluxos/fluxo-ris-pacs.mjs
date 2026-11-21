// Fluxo RIS-PACS (m22). Mesma grade e mesmo gerador da cadeia de custódia: ver cadeia-de-custodia.mjs.
import { fileURLToPath } from 'node:url';
import { ALT, escreveFluxo } from './cadeia-de-custodia.mjs';

export const FLUXO = {
  alt: ALT,
  nota: 'Caminho do pedido: do cadastro à estação de visualização.',
  passos: [
    ['clipboard-list', 'Cadastro e pedido'], ['list-checks', 'Lista de trabalho'], ['radiation', 'Equipamento de raios X', 'beam'],
    ['hard-drive', 'Arquivo de imagens'], ['monitor-check', 'Estação de visualização'],
  ],
};
if (process.argv[1] === fileURLToPath(import.meta.url)) escreveFluxo('fluxo-ris-pacs', FLUXO);
