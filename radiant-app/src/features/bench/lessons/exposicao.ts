import type { BenchControl, LearningActivityV2 } from '../../../types/learningActivity';
import { REFERENCE_EXPOSURE } from '../exposureModel';

/**
 * Aula-bancada de exemplo: o kV e o mAs numa radiografia DIGITAL.
 *
 * Roteiro da prancheta de 2026-10-21 (`docs/design/2026-10-21-aula-bancada.html`):
 * abertura, explorar o kV, igualar a referência, ler a imagem granulada,
 * corrigir pelo mAs e fechamento. Seis passos e quatro interações, o máximo
 * que `validateLearningActivity` aceita.
 *
 * Cada frase de física afirma só o que o topo de `exposureModel.ts` lista como
 * AFIRMAÇÃO FÍSICA: o kV muda o contraste entre osso e partes moles; o mAs muda
 * a quantidade de fótons e o ruído, que cai com 1/√mAs; com processamento
 * digital, o mAs não muda o brilho. Nada do que ele lista como simplificação
 * (o osso fixo no mesmo tom, o ruído que não muda com o kV) vira frase.
 *
 * O texto inteiro vai, igual, ao documento em que o dono revisa cada frase
 * (`docs/conteudo-bancada/2026-10-24-aulas-de-exemplo.md`); o teste do
 * catálogo confere os dois lados. Mudou uma frase aqui, mude lá.
 */

const COMPETENCY_KV_MAS = 'competency:parametros-e-qualidade:efeitos-de-kvp-mas-e-distancia';
const COMPETENCY_NOISE = 'competency:parametros-e-qualidade:contraste-resolucao-ruido-artefato';

const PHANTOM_LABEL = 'Fantoma simulado';

/** As faixas da prancheta: kV de 50 a 120 e mAs de 1 a 20. O modelo aceita mais. */
function kvControl(initial: number): BenchControl {
  return { id: 'kv', label: 'Tensão do tubo', unit: 'kV', min: 50, max: 120, step: 5, initial };
}

function masControl(initial: number): BenchControl {
  return { id: 'mas', label: 'Corrente × tempo', unit: 'mAs', min: 1, max: 20, step: 1, initial };
}

export const EXPOSICAO: LearningActivityV2 = {
  id: 'bancada:exposicao',
  theme: 'tubo',
  competencyIds: [COMPETENCY_KV_MAS, COMPETENCY_NOISE],
  provenance: {
    contentVersion: 'bancada-exemplo-2026-10-24-revisao-pendente',
    sourceIds: ['docs/design/2026-10-21-aula-bancada.html', 'radiant-app/src/features/bench/exposureModel.ts'],
  },
  steps: [
    {
      kind: 'presentation',
      id: 'bancada:exposicao:abertura',
      role: 'hook',
      payload: {
        title: 'O kV e o contraste',
        body: 'Você vai operar o aparelho. Em quatro passos, descobre o que o kV e o mAs fazem com a imagem, mexendo neles.',
      },
    },
    {
      kind: 'interaction',
      interaction: {
        id: 'bancada:exposicao:explorar',
        type: 'bench',
        competencyIds: [COMPETENCY_KV_MAS],
        evidenceKind: 'guided-practice',
        completionRule: 'answered',
        criticalSafety: false,
        feedback: {
          correct: 'Viu? Com kV alto o feixe atravessa mais, e osso e partes moles ficam com tons parecidos: menos contraste.',
          incorrect: 'Suba o kV até 100 para ver o que acontece com o contraste.',
        },
        accessibility: { label: 'Bancada de exposição: suba o kV até 100' },
        payload: {
          prompt: 'Arraste o kV até 100 e observe a diferença entre o osso e as partes moles.',
          simulator: 'exposure',
          mode: 'explore',
          controls: [kvControl(60)],
          goal: { kind: 'reach', control: 'kv', atLeast: 100 },
          phantomLabel: PHANTOM_LABEL,
          hints: {
            tooLow: 'Ainda abaixo de 100 kV. Suba mais o kV e compare o tom do osso com o das partes moles.',
            tooHigh: 'O kV já passou de 100. Compare o tom do osso com o das partes moles.',
          },
        },
      },
    },
    {
      kind: 'interaction',
      interaction: {
        id: 'bancada:exposicao:desafio',
        type: 'bench',
        competencyIds: [COMPETENCY_KV_MAS],
        evidenceKind: 'independent-recall',
        completionRule: 'answered',
        criticalSafety: false,
        feedback: {
          correct: 'O contraste ficou como o da referência, que foi feita com 70 kV.',
          incorrect: 'Compare o contraste entre osso e partes moles nas duas imagens e ajuste o kV.',
        },
        accessibility: { label: 'Bancada de exposição: iguale o contraste da referência' },
        payload: {
          prompt: 'Ajuste o kV até o contraste da sua imagem ficar igual ao da referência.',
          simulator: 'exposure',
          mode: 'challenge',
          controls: [kvControl(110)],
          // A referência usa o mAs do ponto de partida, o mesmo que a imagem do
          // aluno usa sem o controle de mAs. A tolerância aceita 65, 70 e 75 kV,
          // como a prancheta aceitava ±6 kV.
          goal: { kind: 'match', reference: { kv: 70, mas: REFERENCE_EXPOSURE.mas }, tolerance: 0.03 },
          phantomLabel: PHANTOM_LABEL,
          hints: {
            tooLow: 'Sua imagem tem mais contraste que a referência: o kV está baixo. Suba o kV e compare de novo.',
            tooHigh: 'Sua imagem tem menos contraste que a referência: o kV está alto. Desça o kV e compare de novo.',
          },
        },
      },
    },
    {
      kind: 'interaction',
      interaction: {
        id: 'bancada:exposicao:leitura',
        type: 'multiple-choice',
        competencyIds: [COMPETENCY_NOISE],
        evidenceKind: 'applied-transfer',
        completionRule: 'answered',
        criticalSafety: false,
        feedback: {
          correct: 'Com mAs baixo, poucos fótons formam a imagem. O processamento ajusta o brilho, mas o ruído continua: é o granulado.',
          incorrect: 'O contraste está igual ao da referência, e o que mudou foi o granulado. Pense na quantidade de fótons.',
        },
        accessibility: { label: 'Leitura da imagem: o que deixou a imagem granulada?' },
        payload: {
          exposureImage: { input: { kv: REFERENCE_EXPOSURE.kv, mas: 2 }, label: PHANTOM_LABEL },
          prompt: 'Uma imagem do fantoma saiu granulada, com o mesmo kV da referência. O contraste entre osso e partes moles está igual ao dela, mas a imagem toda tem pontos claros e escuros espalhados. O que mudou?',
          options: [
            { id: 'mas-baixo', label: 'O mAs ficou baixo demais' },
            {
              id: 'mas-alto',
              label: 'O mAs ficou alto demais',
              explanation: 'Com mAs alto, mais fótons formam a imagem, e o ruído cai. A imagem sairia mais limpa, e não granulada.',
            },
            {
              id: 'kv-alto',
              label: 'O kV ficou alto demais',
              explanation: 'O kV muda o contraste entre osso e partes moles, e o contraste aqui está igual ao da referência. O granulado vem de outra coisa.',
            },
          ],
          correctOptionId: 'mas-baixo',
        },
      },
    },
    {
      kind: 'interaction',
      interaction: {
        id: 'bancada:exposicao:corrigir',
        type: 'bench',
        competencyIds: [COMPETENCY_NOISE],
        evidenceKind: 'guided-practice',
        completionRule: 'answered',
        criticalSafety: false,
        feedback: {
          correct: 'Com mais fótons, o ruído caiu, e o brilho continuou o mesmo. Quadruplicar o mAs divide o ruído por dois.',
          incorrect: 'Suba o mAs para formar a imagem com mais fótons.',
        },
        accessibility: { label: 'Bancada de exposição: suba o mAs até 16' },
        payload: {
          prompt: 'Agora corrija: suba o mAs até 16. O mAs define quantos fótons formam a imagem, e com poucos fótons sobra ruído, mesmo com o brilho ajustado pelo processamento.',
          simulator: 'exposure',
          mode: 'correct',
          controls: [masControl(2)],
          goal: { kind: 'reach', control: 'mas', atLeast: 16 },
          phantomLabel: PHANTOM_LABEL,
          hints: {
            tooLow: 'Ainda abaixo de 16 mAs, e o granulado continua. Suba mais o mAs.',
            tooHigh: 'O mAs já passou de 16. Compare o granulado com o do começo.',
          },
        },
      },
    },
    {
      kind: 'presentation',
      id: 'bancada:exposicao:fechamento',
      role: 'closing',
      payload: {
        title: 'O que cada controle faz',
        body: 'O kV mexe no contraste. O mAs mexe na quantidade de fótons e no ruído.',
      },
    },
  ],
};
