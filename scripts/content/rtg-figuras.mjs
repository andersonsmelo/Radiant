// Registro de origem das figuras importadas (content-manifest/rtg-2026/figuras.json).
// Régua: toda figura `art: 'imported'` tem entrada; a arte de terceiros só entra com licença aberta e crédito.
import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';

export const FIGURAS_PATH = fileURLToPath(new URL('../../content-manifest/rtg-2026/figuras.json', import.meta.url));
const ORIGENS = ['acervo', 'anatomy', 'codigo', 'gerada'];
const OPEN_LICENSE = /^(CC0( 1\.0)?|Domínio público|CC BY [\d.]+)$/;
const IMPORTED_ORIGINS = ['acervo', 'anatomy', 'gerada'];

/** Erros do registro. `importedIds`: ids das figuras `art: 'imported'` do registro do app. */
export function figurasErrors(figuras, importedIds) {
  const errors = [];
  const ids = new Set();
  for (const entry of figuras) {
    const at = `figura ${entry?.id}`;
    if (ids.has(entry.id)) errors.push(`${at}: id repetido`);
    ids.add(entry.id);
    if (!ORIGENS.includes(entry.origem)) errors.push(`${at}: origem inválida: ${entry.origem}`);
    if (IMPORTED_ORIGINS.includes(entry.origem) && !importedIds.includes(entry.id)) errors.push(`${at}: origem ${entry.origem} sem figura art: 'imported' no registro do app`);
    if (entry.origem === 'acervo') {
      for (const field of ['sourcePage', 'author', 'license', 'licenseUrl', 'retrievedAt', 'sha256Original']) if (!entry[field]) errors.push(`${at}: acervo sem ${field}`);
      if (entry.license && !OPEN_LICENSE.test(entry.license)) errors.push(`${at}: licença fora de CC0, domínio público e CC BY: ${entry.license}`);
    }
    if (entry.origem === 'gerada' && !entry.conferidaPor) errors.push(`${at}: gerada sem conferidaPor`);
  }
  for (const id of importedIds) if (!ids.has(id)) errors.push(`figura ${id}: art 'imported' sem entrada em figuras.json`);
  return errors;
}

/** Entradas que a tela de créditos mostra: toda arte de terceiros (tem autoria). */
export const creditedFigures = (figuras) => figuras.filter((entry) => entry.origem === 'acervo');

/** Erros dos créditos no módulo gerado: toda figura com crédito aparece nele, com autor e licença. */
export function creditErrors(figuras, generatedSource) {
  return creditedFigures(figuras).flatMap((entry) => [entry.id, entry.author, entry.license]
    .filter((text) => !generatedSource.includes(JSON.stringify(text).slice(1, -1)))
    .map((text) => `figura ${entry.id}: crédito ausente na lista gerada (${text})`));
}

export async function readFiguras(file = FIGURAS_PATH) {
  try { return JSON.parse(await readFile(file, 'utf8')); }
  catch (error) { if (error?.code === 'ENOENT') return []; throw error; }
}
