import { readFileSync } from 'node:fs';
import path from 'node:path';
import process from 'node:process';
import { pathToFileURL } from 'node:url';

export function mapErrors({ map, taxonomyIds, catalogIds }) {
  const erros = [];
  const mapeados = new Set();

  for (const entrada of map) {
    if (entrada.taxonomyId !== null && !taxonomyIds.has(entrada.taxonomyId)) {
      erros.push(`mapa aponta para taxonomia inexistente: ${entrada.taxonomyId}`);
    }
    if (!catalogIds.has(entrada.catalogId)) {
      erros.push(`mapa aponta para catalogo inexistente: ${entrada.catalogId}`);
    }
    mapeados.add(entrada.catalogId);
  }

  for (const catalogId of catalogIds) {
    if (catalogId.startsWith('ai-lesson:') && !mapeados.has(catalogId)) {
      erros.push(`no de catalogo sem entrada no mapa: ${catalogId}`);
    }
  }

  return erros;
}

const ARQUIVOS_DE_TAXONOMIA = ['galaxias.json', 'planetas.json', 'estrelas.json'];

function lerJson(caminho) {
  return JSON.parse(readFileSync(caminho, 'utf8'));
}

export function loadInputs(root) {
  const map = lerJson(path.join(root, 'content-manifest', 'taxonomy-catalog-map.json'));

  const taxonomyIds = new Set();
  for (const arquivo of ARQUIVOS_DE_TAXONOMIA) {
    for (const no of lerJson(path.join(root, 'Conteúdo', 'taxonomia', arquivo))) {
      taxonomyIds.add(no.id);
    }
  }

  const catalogIds = new Set();
  for (const track of lerJson(path.join(root, 'Conteúdo', 'governança', 'wave-1-priority-tracks.json')).tracks) {
    for (const lessonId of track.lessonIds) catalogIds.add(lessonId);
  }

  return { map, taxonomyIds, catalogIds };
}

export function main(root = process.cwd()) {
  const { map, taxonomyIds, catalogIds } = loadInputs(root);
  const erros = mapErrors({ map, taxonomyIds, catalogIds });
  process.stdout.write(
    JSON.stringify(
      { mapEntries: map.length, taxonomyIds: taxonomyIds.size, catalogIds: catalogIds.size, errors: erros },
      null,
      2,
    ) + '\n',
  );
  return erros.length === 0 ? 0 : 1;
}

// Mesma guarda que o resto dos validadores do repositorio: sem ela,
// `pathToFileURL(undefined)` lanca quando o modulo e importado por um contexto
// sem script de entrada.
if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  process.exit(main());
}
