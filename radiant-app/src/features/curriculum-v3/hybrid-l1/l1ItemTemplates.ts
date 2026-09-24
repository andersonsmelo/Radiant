import { landmarkScreenRegion, type BodyPerspective, type BodyPosture, type ScreenRegion } from '../l1-body-reference/bodyMapGeometry';
import type { L1AnswerOption } from '../l1-body-reference/l1BodyReference.types';
import { LANDMARK_DESCRIPTIONS, LATERALITY_ENTRY, relationEntry } from './l1RelationTable';
import { shuffled, type Rng } from './seededRandom';
import type { HybridFormat, HybridItem, HybridOption, HybridPhase, RelationId } from './hybridItem.types';

/** Largura de referência para descrever posições. A região não depende da largura (guarda da Tarefa 1). */
export const REFERENCE_FRAME_WIDTH = 390;

const POSTURE_TEXT: Readonly<Record<BodyPosture, string>> = { anatomical: 'Na posição anatômica', supine: 'Em decúbito dorsal', prone: 'Em decúbito ventral' };
const PERSPECTIVE_TEXT: Readonly<Record<BodyPerspective, string>> = { front: 'vista de frente', back: 'vista por trás' };
const ACCESSIBLE_SUFFIX = 'As opções são numeradas; as descrições indicam posições, não a resposta.';

const SCENARIOS: readonly (readonly [BodyPosture, BodyPerspective])[] = [
  ['anatomical', 'front'], ['anatomical', 'back'], ['supine', 'front'], ['supine', 'back'], ['prone', 'front'], ['prone', 'back'],
];

export const TRUE_FALSE_OPTIONS: readonly HybridOption[] = [
  { id: 'verdadeiro', label: 'Verdadeiro', landmarkId: null, textDescription: 'A afirmação está correta.' },
  { id: 'falso', label: 'Falso', landmarkId: null, textDescription: 'A afirmação está errada.' },
];

type CommonParams = Readonly<{ id: string; posture: BodyPosture; perspective: BodyPerspective; phase: HybridPhase; format: Exclude<HybridFormat, 'true_false'> }>;
export type LateralityParams = CommonParams & Readonly<{ side: 'left' | 'right' }>;
export type RelationParams = CommonParams & Readonly<{ relation: RelationId; termIndex: 0 | 1 }>;

export function scenarioIntro(posture: BodyPosture, perspective: BodyPerspective): string {
  return `${POSTURE_TEXT[posture]}, ${PERSPECTIVE_TEXT[perspective]},`;
}

export function describeRegion(region: ScreenRegion): string {
  if (region === 'direita') return 'à direita de quem observa';
  if (region === 'esquerda') return 'à esquerda de quem observa';
  return region === 'cima' ? 'na parte de cima do quadro' : 'na parte de baixo do quadro';
}

export function nextScenario(posture: BodyPosture, perspective: BodyPerspective): readonly [BodyPosture, BodyPerspective] {
  const index = SCENARIOS.findIndex(([p, v]) => p === posture && v === perspective);
  return SCENARIOS[(index + 1) % SCENARIOS.length];
}

const accessible = (prompt: string): string => `${prompt} ${ACCESSIBLE_SUFFIX}`;

export function lateralityItem(params: LateralityParams, rng: Rng): HybridItem {
  const options: L1AnswerOption[] = shuffled(['left', 'right'] as const, rng).map((side, index) => {
    const landmarkId = `patient-${side}-hand`;
    const region = landmarkScreenRegion(landmarkId, params.posture, params.perspective, REFERENCE_FRAME_WIDTH);
    return { id: `patient-${side}`, label: `Mão ${index + 1}`, landmarkId, textDescription: `Aparece ${describeRegion(region)}.` };
  });
  const sideWord = params.side === 'left' ? 'esquerdo' : 'direito';
  const intro = scenarioIntro(params.posture, params.perspective);
  const prompt = `${intro} qual mão pertence ao lado ${sideWord} da pessoa?`;
  return {
    id: params.id, source: { kind: 'laterality', side: params.side }, variant: false,
    phase: params.phase, format: params.format,
    objectiveId: LATERALITY_ENTRY.objectiveId, misconception: LATERALITY_ENTRY.misconception,
    posture: params.posture, perspective: params.perspective, relation: 'medial-lateral',
    intro, prompt, accessiblePrompt: accessible(prompt),
    options, landmarks: options, correctOptionId: `patient-${params.side}`,
    feedback: LATERALITY_ENTRY.feedback, hint: LATERALITY_ENTRY.hint,
    optionNoun: 'mão', optionArticle: 'a', claim: `pertence ao lado ${sideWord} da pessoa`,
  };
}

export function relationItem(params: RelationParams, rng: Rng): HybridItem {
  const entry = relationEntry(params.relation);
  const asked = entry.terms[params.termIndex];
  const options: L1AnswerOption[] = shuffled(entry.terms, rng).map((term, index) => ({
    id: term.id, label: `${entry.optionLabel} ${index + 1}`, landmarkId: term.landmarkId, textDescription: LANDMARK_DESCRIPTIONS[term.landmarkId] ?? '',
  }));
  const intro = scenarioIntro(params.posture, params.perspective);
  const prompt = `${intro} ${asked.question}`;
  return {
    id: params.id, source: { kind: 'relation', relation: params.relation, termIndex: params.termIndex }, variant: false,
    phase: params.phase, format: params.format,
    objectiveId: entry.objectiveId, misconception: entry.misconception,
    posture: params.posture, perspective: params.perspective, relation: entry.relation,
    intro, prompt, accessiblePrompt: accessible(prompt),
    options, landmarks: options, correctOptionId: asked.id,
    feedback: entry.feedback, hint: entry.hint,
    optionNoun: entry.optionNoun, optionArticle: entry.optionArticle, claim: asked.claim,
  };
}

export function trueFalseItem(base: HybridItem, optionIndex: number, id: string): HybridItem {
  const option = base.options[optionIndex];
  const prompt = `${base.intro} verdadeiro ou falso: ${base.optionArticle} ${base.optionNoun} ${optionIndex + 1} ${base.claim}.`;
  return {
    ...base,
    id,
    source: { kind: 'true_false', base, optionIndex },
    format: 'true_false',
    prompt,
    accessiblePrompt: accessible(prompt),
    options: TRUE_FALSE_OPTIONS,
    landmarks: base.landmarks,
    correctOptionId: option.id === base.correctOptionId ? 'verdadeiro' : 'falso',
  };
}

/** O item que volta depois de um erro: mesma regra, próximo cenário, nova ordem de opções. */
export function variantOf(item: HybridItem, rng: Rng): HybridItem {
  const [posture, perspective] = nextScenario(item.posture, item.perspective);
  const id = `${item.id}-v`;
  const source = item.source;
  if (source.kind === 'laterality') {
    return { ...lateralityItem({ id, posture, perspective, side: source.side, phase: 'challenge', format: item.format === 'true_false' ? 'choice' : item.format }, rng), variant: true };
  }
  if (source.kind === 'relation') {
    return { ...relationItem({ id, relation: source.relation, termIndex: source.termIndex, posture, perspective, phase: 'challenge', format: item.format === 'true_false' ? 'choice' : item.format }, rng), variant: true };
  }
  const base = variantOf(source.base, rng);
  return { ...trueFalseItem(base, source.optionIndex, id), variant: true };
}
