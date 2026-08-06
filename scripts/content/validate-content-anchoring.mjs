export function anchoringErrors({ aula, manifesto }) {
  const porId = new Map(manifesto.map((linha) => [linha.id, linha]));
  const erros = [];

  for (const claim of aula.claims) {
    if (!claim.excerptId) {
      erros.push('afirmacao sem excerto de apoio');
      continue;
    }
    const linha = porId.get(claim.excerptId);
    if (!linha) {
      erros.push(`excerto fora do manifesto: ${claim.excerptId}`);
      continue;
    }
    if (linha.rightsClass !== 'authorized') {
      erros.push(`excerto sem autorizacao de direitos: ${claim.excerptId}`);
      continue;
    }
    if (linha.hash !== claim.hash) {
      erros.push(`hash divergente para ${claim.excerptId}: fonte mudou desde a ancoragem`);
    }
  }

  return erros;
}
