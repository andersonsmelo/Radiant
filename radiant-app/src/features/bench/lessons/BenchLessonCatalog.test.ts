import { readFileSync } from 'fs';
import { join } from 'path';

import {
  learningActivityWarnings,
  validateLearningActivity,
  type BenchControl,
  type LearningActivityV2,
  type LearningInteractionV2,
} from '../../../types/learningActivity';
import {
  encodeBenchValue,
  isCorrectInteractionValue,
  type BenchValues,
} from '../../lesson-flow/renderers/InteractionAnswerValue';
import { DETECTOR_WIDTH_CM } from '../collimationModel';
import { REFERENCE_EXPOSURE } from '../exposureModel';
import { EXPOSURE_SKSL, PHANTOM_WIDTH } from '../exposureShader';
import { BENCH_LESSON_IDS, BenchLessonCatalog, isBenchLessonId } from './BenchLessonCatalog';
import { COLIMACAO } from './colimacao';
import { EXPOSICAO } from './exposicao';

type Bench = Extract<LearningInteractionV2, { type: 'bench' }>;
type Choice = Extract<LearningInteractionV2, { type: 'multiple-choice' }>;

const LESSONS: [string, LearningActivityV2][] = [
  [EXPOSICAO.id, EXPOSICAO],
  [COLIMACAO.id, COLIMACAO],
];

/** As faixas que o aluno vê, as da prancheta (o modelo aceita mais). */
const PRANCHETA_RANGES: Partial<Record<string, { min: number; max: number }>> = {
  kv: { min: 50, max: 120 },
  mas: { min: 1, max: 20 },
};

/** O documento em que o dono revisa cada frase, na raiz do repositório. */
const REVIEW_DOC = join(__dirname, '../../../../../docs/conteudo-bancada/2026-10-24-aulas-de-exemplo.md');

const globalWithDev = globalThis as unknown as { __DEV__: boolean };

function interactionsOf(lesson: LearningActivityV2): LearningInteractionV2[] {
  return lesson.steps.flatMap((step) => (step.kind === 'interaction' ? [step.interaction] : []));
}

function benchesOf(lesson: LearningActivityV2): Bench[] {
  return interactionsOf(lesson).filter((interaction): interaction is Bench => interaction.type === 'bench');
}

function choicesOf(lesson: LearningActivityV2): Choice[] {
  return interactionsOf(lesson).filter((interaction): interaction is Choice => interaction.type === 'multiple-choice');
}

function initialValues(controls: BenchControl[]): BenchValues {
  return Object.fromEntries(controls.map((control) => [control.id, control.initial]));
}

/** Todos os valores que os botões − e + alcançam num controle, do mínimo ao máximo. */
function grid(control: BenchControl): number[] {
  const values: number[] = [];
  for (let value = control.min; value <= control.max + 1e-9; value += control.step) {
    values.push(Math.round(value * 1e6) / 1e6);
  }
  return values;
}

/** Todas as combinações de posições dos controles da bancada. */
function positions(controls: BenchControl[]): BenchValues[] {
  return controls.reduce<BenchValues[]>(
    (combos, control) => combos.flatMap((combo) => grid(control).map((value) => ({ ...combo, [control.id]: value }))),
    [{}],
  );
}

/**
 * Os campos que o aluno lê ou ouve. Ids, competências, tipos e alvos ficam de
 * fora: não são texto de tela.
 */
const TEXT_KEYS = new Set([
  'title',
  'body',
  'eyebrow',
  'prompt',
  'label',
  'hint',
  'explanation',
  'correct',
  'incorrect',
  'tooLow',
  'tooHigh',
  'phantomLabel',
  'unit',
]);

type Phrase = { path: string; text: string };

function collectPhrases(value: unknown, path: string, out: Phrase[]): Phrase[] {
  if (Array.isArray(value)) {
    value.forEach((item, index) => collectPhrases(item, `${path}[${index}]`, out));
  } else if (typeof value === 'object' && value !== null) {
    for (const [key, child] of Object.entries(value)) {
      if (key === 'provenance') continue;
      if (typeof child === 'string') {
        if (TEXT_KEYS.has(key)) out.push({ path: `${path}.${key}`, text: child });
      } else {
        collectPhrases(child, `${path}.${key}`, out);
      }
    }
  }
  return out;
}

function phrasesOf(lesson: LearningActivityV2): Phrase[] {
  return collectPhrases(lesson.steps, lesson.id, []);
}

/** As linhas da tabela da aula no documento: [passo, frase, ok do dono]. */
function reviewRows(lessonId: string): string[][] {
  const doc = readFileSync(REVIEW_DOC, 'utf8');
  const section = doc.split(/^## /m).find((part) => part.split('\n')[0].includes(`\`${lessonId}\``));
  if (section === undefined) throw new Error(`o documento não tem a seção da aula ${lessonId}`);

  return section
    .split('\n')
    .filter((line) => line.startsWith('|'))
    .map((line) => line.replace(/^\|/, '').replace(/\|$/, '').split('|').map((cell) => cell.trim()));
}

describe('BenchLessonCatalog — só em build de desenvolvimento, porque o dono ainda não revisou o texto', () => {
  const original = globalWithDev.__DEV__;
  afterEach(() => {
    globalWithDev.__DEV__ = original;
  });

  it('lista as duas aulas de exemplo, exposição e colimação', () => {
    expect(BENCH_LESSON_IDS).toEqual(['bancada:exposicao', 'bancada:colimacao']);
    expect(EXPOSICAO.id).toBe('bancada:exposicao');
    expect(COLIMACAO.id).toBe('bancada:colimacao');
    expect(isBenchLessonId('bancada:exposicao')).toBe(true);
    expect(isBenchLessonId('activity:materia-energia-e-radiacao:01')).toBe(false);
  });

  it('com __DEV__, serve cada aula pelo id, e nada para outro id', () => {
    globalWithDev.__DEV__ = true;

    expect(BenchLessonCatalog.getActivityById('bancada:exposicao')).toBe(EXPOSICAO);
    expect(BenchLessonCatalog.getActivityById('bancada:colimacao')).toBe(COLIMACAO);
    expect(BenchLessonCatalog.getActivityById('bancada:posicionamento')).toBeNull();
  });

  it('fora de __DEV__, não serve nenhuma aula, nem pelo id certo', () => {
    globalWithDev.__DEV__ = false;

    expect(BenchLessonCatalog.getActivityById('bancada:exposicao')).toBeNull();
    expect(BenchLessonCatalog.getActivityById('bancada:colimacao')).toBeNull();
  });

  it('sem __DEV__ definido, como nos scripts de QA em Node, não serve nenhuma aula e não lança', () => {
    // `scripts/qa/trilha-structural-inventory.cjs` chama `LessonFlowService`
    // fora do React Native, onde `__DEV__` não existe.
    delete (globalThis as { __DEV__?: boolean }).__DEV__;

    expect(() => BenchLessonCatalog.getActivityById('bancada:exposicao')).not.toThrow();
    expect(BenchLessonCatalog.getActivityById('bancada:exposicao')).toBeNull();
  });
});

describe.each(LESSONS)('a aula %s', (_id, lesson) => {
  it('passa na validação v2 sem nenhuma violação', () => {
    expect(validateLearningActivity(lesson)).toEqual([]);
  });

  it('não tem aviso editorial', () => {
    expect(learningActivityWarnings(lesson)).toEqual([]);
  });

  it('tem ao menos uma bancada, e cada uma diz que o fantoma é simulado', () => {
    const benches = benchesOf(lesson);

    expect(benches.length).toBeGreaterThan(0);
    for (const bench of benches) {
      expect(bench.payload.phantomLabel).toBe('Fantoma simulado');
    }
  });

  it('mostra ao aluno as faixas da prancheta: kV de 50 a 120 e mAs de 1 a 20', () => {
    for (const bench of benchesOf(lesson)) {
      for (const control of bench.payload.controls) {
        const range = PRANCHETA_RANGES[control.id];
        if (range) expect({ id: control.id, min: control.min, max: control.max }).toEqual({ id: control.id, ...range });
      }
    }
  });

  it('cada alvo reach cabe na faixa do controle, com atLeast <= atMost quando há os dois', () => {
    for (const bench of benchesOf(lesson)) {
      const { goal, controls } = bench.payload;
      if (goal.kind !== 'reach') continue;
      const control = controls.find((candidate) => candidate.id === goal.control);

      expect({ id: bench.id, control: control?.id }).toEqual({ id: bench.id, control: goal.control });
      for (const limit of [goal.atLeast, goal.atMost]) {
        if (limit === undefined || control === undefined) continue;
        expect(limit).toBeGreaterThanOrEqual(control.min);
        expect(limit).toBeLessThanOrEqual(control.max);
      }
      if (goal.atLeast !== undefined && goal.atMost !== undefined) {
        expect({ id: bench.id, ordered: goal.atLeast <= goal.atMost }).toEqual({ id: bench.id, ordered: true });
      }
    }
  });

  it('o ponto de partida de cada bancada não cumpre o alvo: o passo não se responde sozinho', () => {
    for (const bench of benchesOf(lesson)) {
      const start = encodeBenchValue(initialValues(bench.payload.controls));
      expect({ id: bench.id, solvedAtStart: isCorrectInteractionValue(bench, start) })
        .toEqual({ id: bench.id, solvedAtStart: false });
    }
  });

  it('cada bancada tem ao menos uma posição dos controles, ao alcance dos botões, que cumpre o alvo', () => {
    for (const bench of benchesOf(lesson)) {
      const solvable = positions(bench.payload.controls)
        .some((values) => isCorrectInteractionValue(bench, encodeBenchValue(values)));
      expect({ id: bench.id, solvable }).toEqual({ id: bench.id, solvable: true });
    }
  });

  it('cada match tem a referência dentro da faixa dos controles, e no ponto de referência o que a bancada não oferece', () => {
    for (const bench of benchesOf(lesson)) {
      const { goal, controls } = bench.payload;
      if (goal.kind !== 'match') continue;

      for (const axis of ['kv', 'mas'] as const) {
        const control = controls.find((candidate) => candidate.id === axis);
        if (control) {
          expect(goal.reference[axis]).toBeGreaterThanOrEqual(control.min);
          expect(goal.reference[axis]).toBeLessThanOrEqual(control.max);
        } else {
          // A imagem do aluno usa o ponto de referência no eixo sem controle; a
          // referência precisa usar o mesmo, senão as duas imagens diferem nele.
          expect(goal.reference[axis]).toBe(REFERENCE_EXPOSURE[axis]);
        }
      }
    }
  });

  it('cada alternativa errada tem explicação própria, diferente das outras e do retorno genérico', () => {
    for (const choice of choicesOf(lesson)) {
      const wrong = choice.payload.options.filter((option) => option.id !== choice.payload.correctOptionId);
      const explanations = wrong.map((option) => option.explanation?.trim() ?? '');

      expect(wrong.length).toBeGreaterThan(0);
      expect(explanations.every((text) => text.length > 0)).toBe(true);
      expect(new Set(explanations).size).toBe(explanations.length);
      expect(explanations).not.toContain(choice.feedback.incorrect.trim());
    }
  });
});

describe('o texto das aulas (A Regra Sem Cara de IA)', () => {
  const all = LESSONS.flatMap(([, lesson]) => phrasesOf(lesson));

  it('a varredura alcança todas as frases: título, enunciado, dicas, alternativas, explicações, retornos e fechamento', () => {
    const fields = new Set(all.map((phrase) => phrase.path.split('.').at(-1)));
    for (const field of ['title', 'body', 'prompt', 'label', 'explanation', 'correct', 'incorrect', 'tooLow', 'tooHigh', 'phantomLabel']) {
      expect(fields).toContain(field);
    }
  });

  it('nenhuma frase usa "quase"', () => {
    expect(all.filter((phrase) => /\bquase\b/i.test(phrase.text))).toEqual([]);
  });

  it('nenhuma frase usa travessão de efeito', () => {
    expect(all.filter((phrase) => / [—–] /.test(phrase.text))).toEqual([]);
  });

  it('na colimação, nenhuma frase diz "dose" solta: a grandeza que cai com a área é o produto dose-área', () => {
    // Só duas formas passam: "dose-área" (o produto) e "dose do feixe direto",
    // a afirmação de que a dose do feixe direto num ponto dentro do campo não
    // muda ao colimar. A dose total num ponto cai um pouco, porque soma o
    // espalhamento do tecido vizinho.
    const loose = phrasesOf(COLIMACAO).filter((phrase) => /\bdoses?\b(?!-área| do feixe direto)/i.test(phrase.text));
    expect(loose).toEqual([]);
  });
});

describe('o desafio de enquadrar da colimação cobre o joelho inteiro, com as partes moles', () => {
  // A silhueta de partes moles do fantoma, lida do próprio shader: um círculo
  // de raio `softR` em torno de x = centro, e o raio é máximo na altura do
  // joelho (96 + 10). O campo é centrado na imagem.
  const silhouette = /float softR = ([\d.]+) \+ ([\d.]+) \* exp\(-\(knee \* knee\)\);\s*float soft_chord = chord\(softR, abs\(x - ([\d.]+)\)\);/
    .exec(EXPOSURE_SKSL);
  if (silhouette === null) throw new Error('a silhueta de partes moles do shader mudou de forma: refaça esta medida');
  const radius = Number(silhouette[1]) + Number(silhouette[2]);
  const center = Number(silhouette[3]);
  const unitsPerCm = PHANTOM_WIDTH / DETECTOR_WIDTH_CM;
  const fieldCenter = PHANTOM_WIDTH / 2;
  /** A menor largura, em cm, de um campo centrado que cobre a pele dos dois lados. */
  const skinWidthCm = (2 * Math.max(fieldCenter - (center - radius), center + radius - fieldCenter)) / unitsPerCm;

  const frame = benchesOf(COLIMACAO).find((bench) => bench.id === 'bancada:colimacao:enquadrar');
  if (frame === undefined) throw new Error('a aula de colimação perdeu o desafio de enquadrar');
  const width = frame.payload.controls.find((control) => control.id === 'fieldWidth');
  if (width === undefined) throw new Error('o desafio de enquadrar perdeu o controle de largura');
  const accepted = grid(width).filter((value) => isCorrectInteractionValue(frame, encodeBenchValue({ fieldWidth: value })));

  it('a medida da pele bate com a do revisor: 22,6 cm', () => {
    expect(skinWidthCm).toBeCloseTo(22.6, 5);
  });

  it('toda largura aceita cobre a pele dos dois lados', () => {
    expect(accepted.length).toBeGreaterThan(0);
    expect(accepted.filter((value) => value < skinWidthCm)).toEqual([]);
  });

  it('a menor largura que cobre a pele, no passo do controle, é aceita', () => {
    const smallest = grid(width).find((value) => value >= skinWidthCm);
    expect(smallest).toBe(23);
    expect(accepted).toContain(smallest);
  });

  it('o campo todo não é aceito: ainda sobra campo fora do joelho', () => {
    expect(accepted).not.toContain(width.max);
  });
});

describe('o documento de revisão do dono', () => {
  it.each(LESSONS)('traz, na tabela da aula %s, cada frase do código, igual, caractere por caractere', (id, lesson) => {
    const rows = reviewRows(id);
    const [header, separator, ...body] = rows;

    expect(header).toEqual(['Passo', 'Frase', 'Ok do dono']);
    expect(separator.every((cell) => /^:?-+:?$/.test(cell))).toBe(true);
    // Uma linha por frase, nem a mais nem a menos: frase que mudou no código e
    // não no documento reprova dos dois lados.
    expect(body.map((row) => row[1]).sort()).toEqual(phrasesOf(lesson).map((phrase) => phrase.text).sort());
  });

  it.each(LESSONS)('deixa vazia a coluna "ok do dono" da aula %s', (id) => {
    const [, , ...body] = reviewRows(id);

    expect(body.length).toBeGreaterThan(0);
    for (const row of body) {
      expect(row).toHaveLength(3);
      expect(row[2]).toBe('');
    }
  });
});
