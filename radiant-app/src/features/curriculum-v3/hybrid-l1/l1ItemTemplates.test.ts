import { LANDMARK_POSITIONS, isBoxInsideFrame, markerBounds, landmarkScreenRegion, type BodyPerspective, type BodyPosture } from '../l1-body-reference/bodyMapGeometry';
import { L1_RELATION_TABLE } from './l1RelationTable';
import { REFERENCE_FRAME_WIDTH, describeRegion, lateralityItem, nextScenario, relationItem, trueFalseItem, variantOf } from './l1ItemTemplates';
import { createRng } from './seededRandom';
import type { HybridItem } from './hybridItem.types';

const POSTURES: readonly BodyPosture[] = ['anatomical', 'supine', 'prone'];
const PERSPECTIVES: readonly BodyPerspective[] = ['front', 'back'];
const SCENARIOS = POSTURES.flatMap((posture) => PERSPECTIVES.map((perspective) => [posture, perspective] as const));
const MISCONCEPTIONS = ['E-LAT-OBS', 'E-GRV', 'E-REL', 'E-POS'];

/**
 * Cópia literal do gabarito revisado, de propósito fora de `l1RelationTable.ts`.
 * Comparar o item com a própria tabela é espelho: um par trocado na tabela
 * passaria (medido em 2026-09-23, mutação 2.3 dos vermelhos). Mudar um par
 * exige mudar os dois arquivos, e a revisão do dono (Tarefa 3).
 */
const REVIEWED_KEY: Readonly<Record<string, readonly [string, string]>> = {
  'superior-inferior': ['head-marker', 'foot-marker'],
  'medial-lateral': ['midline-marker', 'outer-arm-marker'],
  'proximal-distal': ['shoulder-marker', 'wrist-marker'],
  'superficial-deep': ['outer-layer', 'inner-layer'],
  'anterior-posterior': ['anterior-thorax', 'posterior-thorax'],
};

function everyItem(): HybridItem[] {
  const rng = createRng(11);
  const items: HybridItem[] = [];
  for (const [posture, perspective] of SCENARIOS) {
    for (const side of ['left', 'right'] as const) {
      items.push(lateralityItem({ id: `lat-${posture}-${perspective}-${side}`, posture, perspective, side, phase: 'challenge', format: 'tap' }, rng));
    }
    for (const entry of L1_RELATION_TABLE) {
      for (const termIndex of [0, 1] as const) {
        const base = relationItem({ id: `rel-${entry.relation}-${termIndex}-${posture}-${perspective}`, relation: entry.relation, termIndex, posture, perspective, phase: 'challenge', format: 'choice' }, rng);
        items.push(base, trueFalseItem(base, 0, `${base.id}-tf0`), trueFalseItem(base, 1, `${base.id}-tf1`));
      }
    }
  }
  return items;
}

describe('modelos de exercício da L1', () => {
  it('lateralidade: a resposta é a mão do lado pedido do corpo, em qualquer cenário', () => {
    const rng = createRng(1);
    for (const [posture, perspective] of SCENARIOS) {
      for (const side of ['left', 'right'] as const) {
        const item = lateralityItem({ id: 'x', posture, perspective, side, phase: 'challenge', format: 'tap' }, rng);
        const correct = item.options.find((option) => option.id === item.correctOptionId);
        expect(correct?.landmarkId).toBe(`patient-${side}-hand`);
      }
    }
  });

  it('lateralidade: a descrição de cada mão diz onde o mapa a desenha', () => {
    const rng = createRng(2);
    for (const [posture, perspective] of SCENARIOS) {
      const item = lateralityItem({ id: 'x', posture, perspective, side: 'left', phase: 'challenge', format: 'tap' }, rng);
      for (const option of item.options) {
        const region = landmarkScreenRegion(option.landmarkId ?? '', posture, perspective, REFERENCE_FRAME_WIDTH);
        expect(option.textDescription).toContain(describeRegion(region));
      }
    }
  });

  it('relação: a resposta é o landmark que a tabela liga ao termo pedido, e a outra opção é o par dele', () => {
    const rng = createRng(3);
    expect(L1_RELATION_TABLE.map((entry) => entry.relation).sort()).toEqual(Object.keys(REVIEWED_KEY).sort());
    for (const entry of L1_RELATION_TABLE) {
      for (const termIndex of [0, 1] as const) {
        for (const [posture, perspective] of SCENARIOS) {
          const item = relationItem({ id: 'x', relation: entry.relation, termIndex, posture, perspective, phase: 'challenge', format: 'choice' }, rng);
          const byId = new Map(item.options.map((option) => [option.id, option.landmarkId]));
          expect(byId.get(item.correctOptionId)).toBe(REVIEWED_KEY[entry.relation][termIndex]);
          expect([...byId.values()].sort()).toEqual([...REVIEWED_KEY[entry.relation]].sort());
        }
      }
    }
  });

  it('validade: todo landmark que um item numera existe e aparece dentro do quadro', () => {
    for (const item of everyItem()) {
      for (const landmark of item.landmarks) {
        expect(LANDMARK_POSITIONS[landmark.landmarkId]).toBeDefined();
        // O marcador inteiro (44 pt), não só o ponto, nas larguras reais do quadro.
        for (const width of [343, 370, 398]) {
          expect({ item: item.id, landmark: landmark.landmarkId, inside: isBoxInsideFrame(markerBounds(landmark.landmarkId, item.posture, item.perspective, width), width) })
            .toEqual({ item: item.id, landmark: landmark.landmarkId, inside: true });
        }
      }
    }
  });

  it('verdadeiro/falso: é verdadeiro exatamente quando a opção citada é a certa do item de origem', () => {
    const base = relationItem({ id: 'b', relation: 'medial-lateral', termIndex: 0, posture: 'supine', perspective: 'front', phase: 'challenge', format: 'choice' }, createRng(4));
    base.options.forEach((option, index) => {
      const tf = trueFalseItem(base, index, `tf${index}`);
      expect(tf.correctOptionId).toBe(option.id === base.correctOptionId ? 'verdadeiro' : 'falso');
      expect(tf.prompt).toContain(`${base.optionNoun} ${index + 1} ${base.claim}`);
      expect(tf.landmarks).toEqual(base.landmarks);
    });
  });

  it('forma: todo item tem objetivo, código de erro conhecido, opções únicas, resposta entre as opções e textos dentro do limite', () => {
    for (const item of everyItem()) {
      const ids = item.options.map((option) => option.id);
      expect(item.objectiveId).not.toBe('');
      expect(MISCONCEPTIONS).toContain(item.misconception);
      expect(new Set(ids).size).toBe(ids.length);
      expect(ids).toContain(item.correctOptionId);
      expect(item.prompt.length).toBeLessThanOrEqual(140);
      expect(item.hint.length).toBeLessThanOrEqual(80);
      expect(item.feedback.correct).not.toBe('');
      expect(item.feedback.incorrect).not.toBe('');
      expect(item.accessiblePrompt.startsWith(item.prompt)).toBe(true);
    }
  });

  it('variação: o item que volta usa outro cenário, a mesma regra e é marcado como variante', () => {
    const rng = createRng(5);
    const original = relationItem({ id: 'o', relation: 'proximal-distal', termIndex: 1, posture: 'anatomical', perspective: 'back', phase: 'challenge', format: 'choice' }, rng);
    const variant = variantOf(original, rng);
    expect([variant.posture, variant.perspective]).toEqual(nextScenario('anatomical', 'back'));
    expect([variant.posture, variant.perspective]).not.toEqual(['anatomical', 'back']);
    expect(variant.source).toEqual(original.source);
    expect(variant.variant).toBe(true);
    expect(variant.id).toBe('o-v');
  });

  it('determinismo: a mesma semente gera os mesmos itens', () => {
    const make = () => lateralityItem({ id: 'x', posture: 'prone', perspective: 'back', side: 'right', phase: 'challenge', format: 'choice' }, createRng(9));
    expect(make()).toEqual(make());
  });
});
