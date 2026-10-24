import type { BenchControl, LearningActivityV2 } from '../../../types/learningActivity';
import { DETECTOR_HEIGHT_CM, DETECTOR_WIDTH_CM } from '../collimationModel';

/**
 * Aula-bancada de exemplo: a colimação, a segunda bancada
 * (`docs/evidence/2026-10-24-segunda-bancada.md`).
 *
 * Roteiro no molde da aula de exposição: abertura, explorar (fechar a altura e
 * ver o produto dose-área cair), ler o que mudou, enquadrar o joelho pela
 * largura e fechamento. Cinco passos e três interações.
 *
 * Cada frase de física afirma só o que o topo de `collimationModel.ts` lista
 * como AFIRMAÇÃO FÍSICA: o produto dose-área cresce com a área; a dose do
 * feixe direto num ponto dentro do campo não muda ao colimar; campo menor
 * reduz a radiação espalhada; colimar até a região de interesse é proteção
 * radiológica. Nada do que ele lista como simplificação vira frase: em
 * especial, nenhuma diz que a imagem dentro do campo melhora ou piora ao
 * colimar.
 *
 * "Dose" sozinha não aparece: a grandeza que a tela mostra, e que cai com a
 * área, é o produto dose-área. A única exceção é "a dose do feixe direto", a
 * afirmação de que ela não muda num ponto dentro do campo. A dose total num
 * ponto cai um pouco ao colimar, porque soma o espalhamento do tecido vizinho.
 *
 * O texto inteiro vai, igual, ao documento em que o dono revisa cada frase
 * (`docs/conteudo-bancada/2026-10-24-aulas-de-exemplo.md`); o teste do
 * catálogo confere os dois lados. Mudou uma frase aqui, mude lá.
 */

const COMPETENCY_COLLIMATION = 'competency:protecao-radiologica:colimacao-filtracao-e-reducao';

const PHANTOM_LABEL = 'Fantoma simulado';

/** O campo parte aberto, do tamanho da imagem, e fecha até 5 cm. */
const FIELD_MIN_CM = 5;

const heightControl: BenchControl = {
  id: 'fieldHeight',
  label: 'Altura do campo',
  unit: 'cm',
  min: FIELD_MIN_CM,
  max: DETECTOR_HEIGHT_CM,
  step: 1,
  initial: DETECTOR_HEIGHT_CM,
};

const widthControl: BenchControl = {
  id: 'fieldWidth',
  label: 'Largura do campo',
  unit: 'cm',
  min: FIELD_MIN_CM,
  max: DETECTOR_WIDTH_CM,
  step: 1,
  initial: DETECTOR_WIDTH_CM,
};

/**
 * A largura que enquadra o joelho inteiro, com as partes moles, medida no
 * desenho do shader (`exposureShader.ts`, 10 unidades por cm, campo centrado
 * em x = 135). A pele vai de x = 22 a x = 234 na altura do joelho (raio 106 em
 * torno de x = 128), então o campo precisa de 22,6 cm para cobrir os dois
 * lados: 23 cm no passo do controle. O fantoma não é centrado, e com 23 cm
 * ainda sobra 1,6 cm de campo à direita. Com 25 cm ou mais sobra campo dos
 * dois lados. Sem o mínimo, fechar até 5 cm também acertaria e cortaria a
 * anatomia.
 */
const FRAME_MIN_CM = 23;
const FRAME_MAX_CM = 24;

export const COLIMACAO: LearningActivityV2 = {
  id: 'bancada:colimacao',
  competencyIds: [COMPETENCY_COLLIMATION],
  provenance: {
    contentVersion: 'bancada-exemplo-2026-10-24-revisao-pendente',
    sourceIds: ['docs/evidence/2026-10-24-segunda-bancada.md', 'radiant-app/src/features/bench/collimationModel.ts'],
  },
  steps: [
    {
      kind: 'presentation',
      id: 'bancada:colimacao:abertura',
      role: 'hook',
      payload: {
        title: 'O campo do tamanho certo',
        body: 'Você vai abrir e fechar o campo do feixe e ver o que muda na área irradiada e no produto dose-área.',
      },
    },
    {
      kind: 'interaction',
      interaction: {
        id: 'bancada:colimacao:explorar',
        type: 'bench',
        competencyIds: [COMPETENCY_COLLIMATION],
        evidenceKind: 'guided-practice',
        completionRule: 'answered',
        criticalSafety: false,
        feedback: {
          correct: 'A área do campo caiu, e o produto dose-área caiu na mesma proporção: ele cresce com a área irradiada.',
          incorrect: 'Feche a altura do campo para ver o produto dose-área cair.',
        },
        accessibility: { label: 'Bancada de colimação: feche a altura do campo até 16 cm' },
        payload: {
          prompt: 'Feche a altura do campo até 16 cm e acompanhe o produto dose-área.',
          simulator: 'collimation',
          mode: 'explore',
          controls: [heightControl],
          goal: { kind: 'reach', control: 'fieldHeight', atMost: 16 },
          phantomLabel: PHANTOM_LABEL,
          hints: {
            tooLow: 'A altura já está abaixo de 16 cm. Veja o produto dose-área.',
            tooHigh: 'O campo ainda passa de 16 cm de altura. Feche mais.',
          },
        },
      },
    },
    {
      kind: 'interaction',
      interaction: {
        id: 'bancada:colimacao:leitura',
        type: 'multiple-choice',
        competencyIds: [COMPETENCY_COLLIMATION],
        evidenceKind: 'independent-recall',
        completionRule: 'answered',
        criticalSafety: false,
        feedback: {
          correct: 'Com kV e mAs fixos, o produto dose-área é proporcional à área: metade da área, metade do produto dose-área.',
          incorrect: 'Compare a área e o produto dose-área antes e depois de fechar o campo.',
        },
        accessibility: { label: 'O campo ficou menor: o que diminuiu junto com a área?' },
        payload: {
          prompt: 'O campo ficou menor. O que diminuiu junto com a área?',
          options: [
            { id: 'produto-dose-area', label: 'O produto dose-área' },
            {
              id: 'dose-no-ponto',
              label: 'A dose do feixe direto num ponto dentro do campo',
              explanation: 'A dose do feixe direto num ponto dentro do campo não muda ao colimar. O que cai é a área irradiada, e com ela o produto dose-área.',
            },
            {
              id: 'kv',
              label: 'O kV do aparelho',
              explanation: 'Colimar não muda o kV nem o mAs. Muda só a área que o feixe cobre.',
            },
          ],
          correctOptionId: 'produto-dose-area',
        },
      },
    },
    {
      kind: 'interaction',
      interaction: {
        id: 'bancada:colimacao:enquadrar',
        type: 'bench',
        competencyIds: [COMPETENCY_COLLIMATION],
        evidenceKind: 'applied-transfer',
        completionRule: 'answered',
        criticalSafety: false,
        feedback: {
          correct: 'O campo cobre o joelho inteiro, com as partes moles, e o que ficou fora dele não recebe o feixe direto. Colimar até a região de interesse é proteção radiológica.',
          incorrect: 'Ajuste a largura até o campo cobrir o joelho inteiro, com as partes moles, sem sobrar campo fora dele.',
        },
        accessibility: { label: 'Bancada de colimação: enquadre o joelho inteiro pela largura do campo' },
        payload: {
          prompt: 'Feche a largura do campo até ele cobrir o joelho do fantoma inteiro, com as partes moles dos dois lados, sem cortar nada dele.',
          simulator: 'collimation',
          mode: 'challenge',
          controls: [widthControl],
          goal: { kind: 'reach', control: 'fieldWidth', atLeast: FRAME_MIN_CM, atMost: FRAME_MAX_CM },
          phantomLabel: PHANTOM_LABEL,
          hints: {
            tooLow: 'O campo corta as partes moles do joelho. Abra um pouco a largura.',
            tooHigh: 'Ainda sobra campo fora do joelho. Feche mais a largura.',
          },
        },
      },
    },
    {
      kind: 'presentation',
      id: 'bancada:colimacao:fechamento',
      role: 'closing',
      payload: {
        title: 'O que a colimação muda',
        body: 'O produto dose-área cresce com a área do campo. Fechar o campo até a região de interesse reduz a radiação espalhada e poupa do feixe direto o que fica fora dele.',
      },
    },
  ],
};
