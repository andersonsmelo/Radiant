/**
 * Pontos silábicos pt-BR deliberados para as palavras extensas dos títulos
 * locais, os títulos de estresse de T13 e a data. Não é um silabificador:
 * palavras novas/desconhecidas ficam intactas e exigem conferência editorial.
 * `|` marca uma oportunidade, não uma quebra obrigatória.
 */
const SEGMENTED_WORDS = [
  'a|ces|só|rios', 'a|li|men|tos', 'a|pli|ca|ções', 'a|ti|vi|da|de',
  'com|po|nen|tes', 'com|pu|ta|do|ri|za|da', 'con|so|li|da|dos', 'con|ven|ci|o|nal',
  'des|co|ber|ta', 'dis|po|ní|vel', 'e|qui|pa|men|to', 'e|qui|pa|men|tos',
  'es|pe|ci|a|li|za|ções', 'es|tru|tu|ra', 'fun|da|men|tos', 'in|te|ra|ção',
  'ir|ra|di|a|ção', 'mag|né|ti|ca', 'ma|mo|gra|fi|a', 'me|di|ci|na',
  'mo|da|li|da|des', 'nu|cle|ar', 'par|tí|cu|las', 'pre|ser|va|ção',
  'prin|cí|pios', 'pro|ces|sa|men|to', 'pro|du|ção', 'pro|fis|são',
  'pro|pri|e|da|des', 'pro|te|ção', 'qua|li|da|de', 'ra|di|a|ção', 'ra|di|a|ções',
  'ra|di|o|a|ti|vi|da|de', 'ra|di|o|gra|fi|a', 'ra|di|o|grá|fi|co',
  'ra|di|o|i|so|tó|pi|cas', 'ra|di|o|lo|gi|a', 'ra|di|o|ló|gi|ca',
  'ra|di|o|ló|gi|cos', 'ra|di|o|te|ra|pi|a', 'res|so|nân|cia', 'to|mo|gra|fi|a',
] as const;

const wordParts = new Map<string, readonly string[]>(SEGMENTED_WORDS.map(segmented => {
  const parts = segmented.split('|');
  return [parts.join(''), parts];
}));

/** Só para o texto visual da coluna; nunca aplicar ao nó ou ao rótulo acessível. */
export function trailColumnText(text: string): string {
  return text.replace(/[\p{L}\p{M}\u00ad]+/gu, word => {
    const parts = wordParts.get(word.toLocaleLowerCase('pt-BR'));
    if (!parts) return word;
    let offset = 0;
    return parts.map(part => {
      const original = word.slice(offset, offset + part.length);
      offset += part.length;
      return original;
    }).join('\u00ad');
  }).replace(/\/(?!\u200b)/gu, '/\u200b');
}
