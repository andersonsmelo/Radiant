// Abstract engine fixtures only. Never imported by production catalogs or routes.
import type { L1BodyReferenceLesson, L1Challenge } from '../../features/curriculum-v3/l1-body-reference/l1BodyReference.types';
import type { L2SlicingSpaceLesson, L2Challenge } from '../../features/curriculum-v3/l2-slicing-space/l2SlicingSpace.types';
import type { HybridItem } from '../../features/curriculum-v3/hybrid-l1/hybridItem.types';

const feedback = { correct: 'Registro aceito.', incorrect: 'Compare os registros.' };
const l1Item = (id: string, evidenceKind: L1Challenge['evidenceKind'], extra: Partial<L1Challenge> = {}): L1Challenge => ({
  id, objectiveId: 'synthetic-objective', prompt: `Registro ${id}`, accessiblePrompt: `Registro acessível ${id}`,
  answerOptions: [{ id: 'a', label: 'A', landmarkId: 'left-hand', textDescription: 'Registro A' }, { id: 'b', label: 'B', landmarkId: 'right-hand', textDescription: 'Registro B' }],
  correctAnswerId: 'a', evidenceKind, awardsXp: evidenceKind === 'later_independent_retrieval', misconception: 'E-REL', feedback,
  remediationChallengeId: 'support', reviewTargetId: 'synthetic-review', posture: 'anatomical', perspective: 'front', ...extra,
});
export const syntheticL1: L1BodyReferenceLesson = {
  id: 'synthetic:l1', title: 'Laboratório A', audienceLabel: 'Teste', version: 'test', sources: [], relationships: [],
  challenges: [l1Item('initial', 'initial_independent', { nextChallengeId: 'recovery' }), l1Item('support', 'assisted_practice', { nextChallengeId: 'recovery', additionalRecoveryChallengeId: 'alternate' }), l1Item('recovery', 'later_independent_retrieval'), l1Item('alternate', 'later_independent_retrieval')],
  sequence: ['initial', 'recovery'], synthesis: ['Registro final A.'], reviewPlan: [],
};
const l2Item = (id: string, evidenceKind: L2Challenge['evidenceKind'], extra: Partial<L2Challenge> = {}): L2Challenge => ({
  id, objectiveId: 'synthetic-objective', prompt: `Registro ${id}`, accessiblePrompt: `Registro acessível ${id}`,
  answerOptions: [{ id: 'median', textDescription: 'Forma A' }, { id: 'paramedian', textDescription: 'Forma B' }],
  correctAnswerId: 'median', evidenceKind, awardsXp: evidenceKind === 'later_independent_retrieval', misconception: 'E-PLN-MED', feedback,
  remediationChallengeId: 'support', reviewTargetId: 'synthetic-review', visualScenarioId: id === 'initial' ? 'thorax-midline' : id === 'support' ? 'pelvis-symmetry' : 'pelvis-coronal-recovery', ...extra,
});
export const syntheticL2: L2SlicingSpaceLesson = {
  id: 'synthetic:l2', title: 'Laboratório B', audienceLabel: 'Teste', version: 'test', sources: [], objectives: [], modelLayers: [],
  challenges: [l2Item('initial', 'initial_independent', { additionalRecoveryChallengeId: 'recovery', nextChallengeId: 'next' }), l2Item('support', 'assisted_practice', { nextChallengeId: 'recovery' }), l2Item('recovery', 'later_independent_retrieval', { nextChallengeId: 'next' }), l2Item('next', 'initial_independent', { objectiveId: 'next-objective' })],
  sequence: ['initial', 'next'], synthesis: ['Registro final B.'], reviewPlan: [],
};
export function buildSyntheticHybridPlan(): readonly HybridItem[] {
  return Array.from({ length: 12 }, (_, index): HybridItem => ({
    id: `sample-${index}`, source: { kind: 'laterality', side: 'left' }, variant: false,
    phase: index < 4 ? 'first_contact' : 'challenge', format: index === 0 ? 'tap' : index === 1 ? 'true_false' : 'choice',
    objectiveId: `objective-${index}`, misconception: index === 7 ? 'E-GRV' : 'E-LAT-OBS', posture: 'anatomical', perspective: 'front', relation: '',
    intro: '', prompt: `Selecione o registro A no ensaio ${index}.`, accessiblePrompt: `Ensaio ${index}: escolha A.`,
    options: [{ id: 'a', label: 'A', landmarkId: 'left-hand', textDescription: 'Registro alfa' }, { id: 'b', label: 'B', landmarkId: 'right-hand', textDescription: 'Registro beta' }],
    landmarks: [{ id: 'a', label: 'A', landmarkId: 'left-hand', textDescription: 'Registro alfa' }, { id: 'b', label: 'B', landmarkId: 'right-hand', textDescription: 'Registro beta' }],
    correctOptionId: 'a', feedback, hint: 'Compare A e B.', optionNoun: 'registro', optionArticle: 'o', claim: 'A é o registro solicitado.',
  }));
}
export const syntheticVariant = (item: HybridItem): HybridItem => ({ ...item, id: `${item.id}-v`, variant: true, prompt: `Novo ensaio de ${item.id}.` });
