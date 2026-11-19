// Referência a lei, norma, órgão ou conselho de um país. A trilha rtg-2026 usa base
// internacional (guia de autoria, regra 1.4), então estes trechos reprovam a aula.
const B = '(?<![\\p{L}\\p{N}])';
const E = '(?![\\p{L}\\p{N}])';
const NUM = '(?:nº\\s*)?\\d+(?:\\.\\d+)*';
const PATTERNS = [
  // Ato normativo só conta com número: "lei de Ohm" e "resolução espacial" são física.
  [`${B}(?:Lei|Decreto|Portaria|Resolução|Instrução Normativa)\\s+${NUM}`, 'iu'],
  [`${B}Lei\\s+(?:Brasileira|federal)${E}`, 'iu'],
  [`${B}(?:RDC|IN)\\s+${NUM}`, 'u'],
  [`${B}NR-\\d+${E}`, 'u'],
  [`${B}(?:Anvisa|ANVISA|CNEN|ANSN|CONTER|CRTR|CFM|LGPD|SUS)${E}`, 'u'],
  [`${B}Ministério da Saúde${E}`, 'iu'],
  [`${B}norma regulamentadora${E}`, 'iu'],
  [`${B}código de ética${E}`, 'iu'],
  [`${B}no Brasil${E}`, 'iu'],
  [`${B}brasileir[oa]s?${E}`, 'iu'],
  // "lei" sozinha é a lei do país; "lei de Ohm" e "lei do inverso do quadrado" são física.
  [`${B}leis?${E}(?!\\s+d[eoa]s?\\s)`, 'iu'],
  [`${B}legisla[\\p{L}]+`, 'iu'],
  [`${B}normativ[oa]s?${E}`, 'iu'],
  [`${B}Política Nacional${E}`, 'iu'],
  [`${B}(?:autoridade|vigilância) sanitária${E}`, 'iu'],
];

/** Os trechos que citam lei, norma ou órgão nacional, na ordem em que aparecem. */
export function findNationalReferences(value) {
  if (typeof value !== 'string') return [];
  const found = [];
  for (const [source, flags] of PATTERNS) {
    for (const match of value.matchAll(new RegExp(source, `g${flags}`))) {
      // "Lei Brasileira" e "brasileira" casam o mesmo trecho: fica o mais longo.
      if (!found.some((f) => match.index >= f.index && match.index < f.index + f.text.length)) {
        found.push({ index: match.index, text: match[0] });
      }
    }
  }
  return found.sort((a, b) => a.index - b.index).map((f) => f.text);
}
