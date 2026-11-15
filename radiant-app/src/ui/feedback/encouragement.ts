/**
 * Reforço curto nos marcos da aula (F3 da 1.6): sequência de acertos, acerto
 * logo depois de um erro e aula sem erro. Nunca pune: o erro já tem o seu
 * acolhimento no retorno ("Vamos reforçar" e o Pixel preocupado).
 */
export type EncouragementMoment =
  | { kind: 'sequencia'; milestone: 3 | 5 | 10 }
  | { kind: 'retomada' }
  | { kind: 'aula-sem-erro' };

const SEQUENCIA: Readonly<Record<3 | 5 | 10, readonly string[]>> = {
  3: ['Três seguidas. Você pegou o ritmo.', 'Três certas em sequência. Siga assim.'],
  5: ['Cinco seguidas. Leitura firme.', 'Cinco certas em sequência. Isso é constância.'],
  10: ['Dez seguidas. Que consistência.', 'Dez certas em sequência. O conteúdo está assentando.'],
};

const RETOMADA = ['Isso. Você acertou o rumo.', 'Agora foi. Rever ajuda a fixar.', 'Boa retomada.'];

const AULA_SEM_ERRO = ['Aula sem nenhum erro.', 'Tudo certo nesta aula, do começo ao fim.', 'Nenhum erro nesta aula.'];

function phrasesFor(moment: EncouragementMoment): readonly string[] {
  if (moment.kind === 'sequencia') return SEQUENCIA[moment.milestone];
  return moment.kind === 'retomada' ? RETOMADA : AULA_SEM_ERRO;
}

/**
 * A frase do momento. `turn` faz o rodízio: quem chama passa quantos
 * incentivos deste tipo já mostrou (um contador por tipo), e em turnos
 * seguidos do mesmo momento a frase muda.
 */
export function encouragementFor(moment: EncouragementMoment, turn: number): string {
  const phrases = phrasesFor(moment);
  return phrases[Math.abs(Math.trunc(turn)) % phrases.length];
}
