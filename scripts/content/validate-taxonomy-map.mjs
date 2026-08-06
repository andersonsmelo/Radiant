export function mapErrors({ map, taxonomyIds, catalogIds }) {
  const erros = [];
  const mapeados = new Set();

  for (const entrada of map) {
    if (entrada.taxonomyId === null) {
      mapeados.add(entrada.catalogId);
      continue;
    }
    if (!taxonomyIds.has(entrada.taxonomyId)) {
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
