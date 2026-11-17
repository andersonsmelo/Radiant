/** Primeira frase do corpo (até . ? ! seguido de espaço ou fim) e o restante. */
export function splitTeachBody(body: string): { lead: string; rest: string } {
    const text = body.trim();
    const match = /^(.*?[.!?])(?=\s|$)/su.exec(text);
    if (!match) return { lead: text, rest: '' };
    return { lead: match[1], rest: text.slice(match[1].length).trim() };
}

const MAX_TERM = 40;

/** Separa "Termo: explicação"; sem termo válido devolve o ponto inteiro. */
export function splitKeyPoint(point: string): { term: string | null; text: string } {
    const cut = point.indexOf(': ');
    const term = cut > 0 ? point.slice(0, cut) : '';
    const rest = cut > 0 ? point.slice(cut + 2).trim() : '';
    // Rótulo não é horário nem valor ("Às 10: comece") nem enumeração ("Pedido, faixa e série: quatro passos") nem fórmula.
    if (!term || term.length > MAX_TERM || /[,;=]/u.test(term) || /\d$/u.test(term) || !rest) return { term: null, text: point };
    // Unidade ("mAs", "kV") começa em minúscula de propósito: não se capitaliza.
    const unit = /^\p{Ll}\p{Lu}/u.test(rest);
    return { term, text: unit ? rest : rest.charAt(0).toLocaleUpperCase('pt-BR') + rest.slice(1) };
}
