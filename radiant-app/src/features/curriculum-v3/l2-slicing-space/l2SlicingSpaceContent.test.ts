import { L2_SLICING_SPACE } from './l2SlicingSpaceContent';

describe('L2_SLICING_SPACE', () => {
  it('fixa objetivos, fontes normativas e IDs estáveis para os planos de referência', () => {
    expect(L2_SLICING_SPACE.id).toBe('lesson:v3:arc:spatial-orientation:l2-slicing-space');
    expect(L2_SLICING_SPACE.objectives.map(({ id }) => id)).toEqual([
      'l2-reference-planes',
      'l2-median-is-sagittal',
      'l2-obliquity',
      'l2-spatial-region-thickness-image',
    ]);
    expect(L2_SLICING_SPACE.sources).toEqual(expect.arrayContaining([
      expect.objectContaining({ id: 'fipat-ta2-part-1', edition: 'Terminologia Anatomica, 2nd edition (2019)', consultedOn: '2026-08-28' }),
      expect.objectContaining({ id: 'dicom-ps3-3-slice-thickness', edition: 'PS3.3 2026c', sections: ['C.7.6.2 Image Plane Module — Slice Thickness (0018,0050)'] }),
      expect.objectContaining({ id: 'apple-hig-accessibility', consultedOn: '2026-08-28' }),
    ]));
  });

  it('ensina o plano mediano como caso particular de plano sagital e exige item novo após ajuda', () => {
    const diagnostic = L2_SLICING_SPACE.challenges.find(({ id }) => id === 'l2-initial-median');
    const assisted = L2_SLICING_SPACE.challenges.find(({ id }) => id === 'l2-assisted-sagittal');
    const recovery = L2_SLICING_SPACE.challenges.find(({ id }) => id === 'l2-median-recovery');

    expect(diagnostic).toMatchObject({
      objectiveId: 'l2-median-is-sagittal',
      evidenceKind: 'initial_independent',
      correctAnswerId: 'median',
      misconception: 'E-PLN-MED',
      remediationChallengeId: 'l2-assisted-sagittal',
    });
    expect(assisted).toMatchObject({ evidenceKind: 'assisted_practice', awardsXp: false, correctAnswerId: 'sagittal-not-median' });
    expect(recovery).toMatchObject({ evidenceKind: 'later_independent_retrieval', correctAnswerId: 'median', visualScenarioId: 'pelvis-symmetry' });
    expect(diagnostic?.visualScenarioId).not.toBe(recovery?.visualScenarioId);
  });

  it('separa plano geométrico, região amostrada, espessura e imagem em desafio independente', () => {
    const sectionChallenge = L2_SLICING_SPACE.challenges.find(({ id }) => id === 'l2-independent-section');

    expect(sectionChallenge).toMatchObject({
      evidenceKind: 'initial_independent',
      misconception: 'E-PLN-SEC',
      correctAnswerId: 'region-with-nominal-thickness',
      remediationChallengeId: 'l2-assisted-section',
    });
    expect(L2_SLICING_SPACE.modelLayers).toEqual(expect.arrayContaining([
      expect.objectContaining({ id: 'geometric-plane' }),
      expect.objectContaining({ id: 'sampled-region' }),
      expect.objectContaining({ id: 'nominal-thickness' }),
      expect.objectContaining({ id: 'resulting-image' }),
    ]));
  });

  it('mede coronal e transversal em cenário independente, com recuperação nova se houver apoio', () => {
    const initial = L2_SLICING_SPACE.challenges.find(({ id }) => id === 'l2-independent-reference-plane');
    const assisted = L2_SLICING_SPACE.challenges.find(({ id }) => id === 'l2-assisted-reference-plane');
    const recovery = L2_SLICING_SPACE.challenges.find(({ id }) => id === 'l2-reference-plane-recovery');

    expect(initial).toMatchObject({
      objectiveId: 'l2-reference-planes', evidenceKind: 'initial_independent', correctAnswerId: 'transverse', remediationChallengeId: 'l2-assisted-reference-plane',
    });
    expect(assisted).toMatchObject({ evidenceKind: 'assisted_practice', correctAnswerId: 'transverse', awardsXp: false });
    expect(recovery).toMatchObject({
      evidenceKind: 'later_independent_retrieval', correctAnswerId: 'coronal', visualScenarioId: 'pelvis-coronal-recovery',
    });
  });

  it('mantém obliquidade como relação com os planos de referência e não introduz orientação DICOM', () => {
    const oblique = L2_SLICING_SPACE.challenges.find(({ id }) => id === 'l2-independent-oblique');

    expect(oblique).toMatchObject({
      objectiveId: 'l2-obliquity',
      misconception: 'E-PLN-OBL',
      correctAnswerId: 'oblique',
      evidenceKind: 'initial_independent',
    });
    expect(JSON.stringify({ objectives: L2_SLICING_SPACE.objectives, challenges: L2_SLICING_SPACE.challenges, modelLayers: L2_SLICING_SPACE.modelLayers })).not.toMatch(/Patient Position|Image Orientation/i);
  });
});
