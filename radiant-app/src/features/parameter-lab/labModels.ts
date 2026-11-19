// Modelos puros do formato `parameter-lab`: o aluno move um controle e o
// diagrama (dirigido por `progress`) e as leituras mostram o efeito.

export const LAB_MODEL_IDS = ['inverse-square', 'shielding', 'decay'] as const;
export type LabModelId = (typeof LAB_MODEL_IDS)[number];

type LabModel = {
  parameter: { label: string; unit: string; /** A unidade com o valor 1 ("1 camada"). */ unitSingular: string; min: number; max: number; step: number };
  diagramId: string;
  /** 0 no mínimo, 1 no máximo, linear. */
  progress(value: number): number;
  readouts(value: number): { label: string; value: string }[];
};

/** Vírgula decimal e no máximo uma casa: 100 -> "100%", 44,44 -> "44,4%". */
const percent = (x: number) => `${String(Number(x.toFixed(1))).replace('.', ',')}%`;

function model(
  parameter: LabModel['parameter'],
  diagramId: string,
  readoutLabel: string,
  percentAt: (value: number) => number,
): LabModel {
  return {
    parameter,
    diagramId,
    progress: (value) => (value - parameter.min) / (parameter.max - parameter.min),
    readouts: (value) => [{ label: readoutLabel, value: percent(percentAt(value)) }],
  };
}

export const LAB_MODELS: Record<LabModelId, LabModel> = {
  'inverse-square': model(
    { label: 'Distância', unit: 'm', unitSingular: 'm', min: 1, max: 4, step: 0.5 },
    'inverso-do-quadrado',
    'Intensidade relativa',
    (d) => 100 / (d * d),
  ),
  shielding: model(
    { label: 'Camadas semirredutoras', unit: 'camadas', unitSingular: 'camada', min: 0, max: 5, step: 1 },
    'blindagem-camadas',
    'Radiação que passa',
    (n) => 100 / 2 ** n,
  ),
  decay: model(
    { label: 'Meias-vidas', unit: 'meias-vidas', unitSingular: 'meia-vida', min: 0, max: 6, step: 1 },
    'decaimento-radioativo',
    'Atividade restante',
    (n) => 100 / 2 ** n,
  ),
};

/** Dentro de [mínimo, máximo] e múltiplo do passo a partir do mínimo (tolera erro de ponto flutuante). */
export function isOnLabGrid(id: LabModelId, value: number): boolean {
  const { min, max, step } = LAB_MODELS[id].parameter;
  if (!Number.isFinite(value) || value < min - 1e-9 || value > max + 1e-9) return false;
  const steps = (value - min) / step;
  return Math.abs(steps - Math.round(steps)) < 1e-9;
}

const num = (x: number) => String(x).replace('.', ',');

/** A meta em texto curto, com a unidade do modelo: "2 m ou mais", "até 1,5 m", "de 3 a 5 camadas", "1 camada ou mais". */
export function labGoalText(id: LabModelId, goal: { atLeast?: number; atMost?: number }): string {
  const { unit, unitSingular } = LAB_MODELS[id].parameter;
  const { atLeast, atMost } = goal;
  const withUnit = (x: number) => `${num(x)} ${x === 1 ? unitSingular : unit}`;
  if (atLeast !== undefined && atMost !== undefined) {
    return atLeast === atMost ? withUnit(atLeast) : `de ${num(atLeast)} a ${withUnit(atMost)}`;
  }
  return atLeast !== undefined ? `${withUnit(atLeast)} ou mais` : `até ${withUnit(atMost as number)}`;
}
