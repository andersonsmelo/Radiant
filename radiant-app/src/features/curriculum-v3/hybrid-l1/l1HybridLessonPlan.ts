import { lateralityItem, relationItem, trueFalseItem, variantOf } from './l1ItemTemplates';
import { createRng } from './seededRandom';
import type { HybridItem } from './hybridItem.types';

export const L1_HYBRID_SEED = 20260923;

/** Os 12 itens da L1 (spec §5.1): 4 de primeiro contato e 8 de desafio. */
export function buildL1HybridPlan(seed: number = L1_HYBRID_SEED): readonly HybridItem[] {
  const rng = createRng(seed);
  return [
    lateralityItem({ id: 'h01-lat-frente', posture: 'anatomical', perspective: 'front', side: 'left', phase: 'first_contact', format: 'tap' }, rng),
    lateralityItem({ id: 'h02-lat-costas', posture: 'anatomical', perspective: 'back', side: 'left', phase: 'first_contact', format: 'tap' }, rng),
    relationItem({ id: 'h03-sup-inf', relation: 'superior-inferior', termIndex: 0, posture: 'anatomical', perspective: 'front', phase: 'first_contact', format: 'choice' }, rng),
    relationItem({ id: 'h04-med-lat', relation: 'medial-lateral', termIndex: 0, posture: 'anatomical', perspective: 'front', phase: 'first_contact', format: 'choice' }, rng),
    lateralityItem({ id: 'h05-lat-dorsal', posture: 'supine', perspective: 'front', side: 'right', phase: 'challenge', format: 'tap' }, rng),
    relationItem({ id: 'h06-prox-dist', relation: 'proximal-distal', termIndex: 0, posture: 'anatomical', perspective: 'front', phase: 'challenge', format: 'choice' }, rng),
    relationItem({ id: 'h07-sup-prof', relation: 'superficial-deep', termIndex: 1, posture: 'anatomical', perspective: 'back', phase: 'challenge', format: 'tap' }, rng),
    relationItem({ id: 'h08-ant-post', relation: 'anterior-posterior', termIndex: 0, posture: 'prone', perspective: 'front', phase: 'challenge', format: 'choice' }, rng),
    trueFalseItem(relationItem({ id: 'h09-base', relation: 'medial-lateral', termIndex: 1, posture: 'supine', perspective: 'front', phase: 'challenge', format: 'choice' }, rng), 0, 'h09-vf-med-lat'),
    lateralityItem({ id: 'h10-lat-ventral', posture: 'prone', perspective: 'back', side: 'left', phase: 'challenge', format: 'choice' }, rng),
    relationItem({ id: 'h11-sup-inf', relation: 'superior-inferior', termIndex: 1, posture: 'supine', perspective: 'front', phase: 'challenge', format: 'tap' }, rng),
    trueFalseItem(relationItem({ id: 'h12-base', relation: 'proximal-distal', termIndex: 1, posture: 'anatomical', perspective: 'back', phase: 'challenge', format: 'choice' }, rng), 1, 'h12-vf-prox-dist'),
  ];
}

/**
 * O que o dono revisa: os 12 itens mais a variante de cada desafio, que é
 * tudo o que a lição pode mostrar — 20 itens.
 */
export function reviewSample(seed: number = L1_HYBRID_SEED): readonly HybridItem[] {
  const plan = buildL1HybridPlan(seed);
  const rng = createRng(seed + 1);
  return [...plan, ...plan.filter((item) => item.phase === 'challenge').map((item) => variantOf(item, rng))];
}
