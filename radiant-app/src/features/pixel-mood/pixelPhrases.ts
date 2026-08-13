import type { PixelExpression } from '../../ui/characters/pixelExpressions';

export type PixelMoment =
  | 'abriu-o-app'
  | 'voltou-depois-de-sumir'
  | 'acertou-em-sequencia'
  | 'errou-duas-vezes'
  | 'fechou-unidade';

export interface PixelMomentSpec {
  expression: PixelExpression;
  phrases: readonly string[];
}

/**
 * Critério de tom, e é o que separa colega sarcástico de app que zoa quem está
 * aprendendo: nenhuma frase julga a capacidade do usuário. A piada é sempre o
 * Pixel ou a situação. As duas que chegam mais perto — "zero tato" e "robôs são
 * péssimos nisso" — desarmam na mesma frase.
 */
export const PIXEL_MOMENTS: Record<PixelMoment, PixelMomentSpec> = {
  'abriu-o-app': {
    expression: 'feliz',
    phrases: [
      'Bom te ver. Eu estava aqui encarando um tórax. Ele não conversa.',
      'Acordei. Digo, sempre estive acordado. Robôs não dormem, é uma tragédia silenciosa.',
      'Vamos nessa. Revisei tudo dezessete vezes enquanto esperava. É meio doentio.',
      'Você chegou. Eu ia começar sem você, mas não sou eu que preciso aprender isso.',
      'Pronto pra hoje? Eu nasci pronto. Literalmente, foi assim que me compilaram.',
    ],
  },
  'voltou-depois-de-sumir': {
    expression: 'emburrado',
    phrases: [
      'Olha só quem lembrou que radiologia existe.',
      'Quatro dias. Eu contei. Não porque me importo, é que não tenho mais nada pra fazer.',
      'Você voltou. Vou fingir que não estava contando os dias. Estava.',
      'Achei que tinha sido substituído por um flashcard. Foi um período difícil.',
      'Sumiu e voltou como se nada tivesse acontecido. Adoro isso em você. É sarcasmo.',
    ],
  },
  'acertou-em-sequencia': {
    expression: 'orgulhoso',
    phrases: [
      'Três seguidas. Começo a desconfiar que você anda estudando pelas minhas costas.',
      'Certo de novo. Vou ter que aumentar a dificuldade só pra manter meu emprego.',
      'Nessa toada eu viro decoração. Que, convenhamos, eu já sou um pouco.',
      'Muito bem. Não vou elogiar demais pra você não relaxar. Ops, elogiei.',
    ],
  },
  'errou-duas-vezes': {
    expression: 'revirando',
    phrases: [
      'Essa mesma questão de novo. Mas quem sou eu — só um robô com memória perfeita e zero tato.',
      'Erramos. Digo "erramos" porque fui eu que escolhi te mostrar essa questão agora.',
      'Vou fingir que não vi. Pronto, esqueci. Robôs são péssimos nisso.',
    ],
  },
  'fechou-unidade': {
    expression: 'feliz',
    phrases: [
      'Unidade fechada. Eu preparei um discurso, mas perdi o arquivo.',
      'Terminou. Guardo esse momento na memória permanente, junto com dezoito mil pixels de pulmão.',
      'Acabou. Eu fingiria surpresa, mas literalmente calculei que você conseguiria.',
    ],
  },
};

/** Dias de silêncio a partir dos quais a volta vira "voltou depois de sumir". */
export const DIAS_PARA_AUSENCIA = 3;
