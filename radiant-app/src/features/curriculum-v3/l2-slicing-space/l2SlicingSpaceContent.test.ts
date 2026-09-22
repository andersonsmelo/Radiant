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

  it('não prende rótulo posicional à identidade da alternativa', () => {
    // O rótulo acompanhava a identidade ("Opção 1" para `median`, `coronal` e
    // `oblique`), enquanto a tela numerava por posição. Nos itens embaralhados
    // — os de recuperação, justamente — a linha 1 exibia "Opção 2", e quem
    // decorasse o rótulo acertava a recuperação sem olhar geometria nenhuma.
    const offenders = L2_SLICING_SPACE.challenges.flatMap((challenge) =>
      challenge.answerOptions
        .filter((option) => /op(?:ç|c)(?:ã|a)o\s*\d/i.test(JSON.stringify(option)))
        .map((option) => `${challenge.id}:${option.id}`));

    expect(offenders).toEqual([]);
  });

  it('não guarda o estado-resposta do modelo junto do desafio', () => {
    // `requiredPlane`/`requiredRegion`/`requiredThickness` duplicavam o
    // gabarito ao lado de `correctAnswerId` e não tinham consumidor: foi essa a
    // superfície do achado crítico v1 (a), em que o estado de exploração
    // pré-exibia a resposta. Some agora que os três eixos do modelo são
    // independentes, e esta guarda impede que voltem.
    const offenders = L2_SLICING_SPACE.challenges.filter((challenge) =>
      'requiredPlane' in challenge || 'requiredRegion' in challenge || 'requiredThickness' in challenge);

    expect(offenders).toEqual([]);
  });

  it('move a resposta correta de posição entre o item inicial e a recuperação, em TODA família', () => {
    // A guarda anterior media só a família mediana — a única em que o
    // embaralhamento de fato acontecia. Em três das quatro, a resposta certa
    // ficava na mesma posição, e em duas a alternativa correta era o mesmo
    // objeto na mesma ordem: quem decorou a posição fechava a recuperação sem
    // ler geometria, que é o mecanismo do C6 reaparecendo pela posição.
    const positionOf = (challengeId: string): number => {
      const challenge = L2_SLICING_SPACE.challenges.find(({ id }) => id === challengeId);
      if (!challenge) throw new Error(`desafio ausente: ${challengeId}`);
      return challenge.answerOptions.findIndex(({ id }) => id === challenge.correctAnswerId);
    };

    const offenders = L2_SLICING_SPACE.challenges
      .filter((challenge) => challenge.evidenceKind === 'initial_independent' && challenge.additionalRecoveryChallengeId)
      .filter((challenge) => positionOf(challenge.id) === positionOf(challenge.additionalRecoveryChallengeId!))
      .map((challenge) => `${challenge.id} → ${challenge.additionalRecoveryChallengeId}`);

    expect(offenders).toEqual([]);
  });

  it('não apresenta o item inicial e a recuperação como o mesmo problema', () => {
    // Item idêntico é o par de alternativas na mesma ordem COM a mesma
    // resposta correta; aí só o enunciado e o nível anatômico mudam, e a §9.3
    // diz textualmente que isso não produz item novo. Trocar a resposta certa
    // dentro do mesmo par, por outro lado, é pergunta diferente.
    const offenders = L2_SLICING_SPACE.challenges
      .filter((challenge) => challenge.evidenceKind === 'initial_independent' && challenge.additionalRecoveryChallengeId)
      .filter((challenge) => {
        const recovery = L2_SLICING_SPACE.challenges.find(({ id }) => id === challenge.additionalRecoveryChallengeId);
        return JSON.stringify(challenge.answerOptions) === JSON.stringify(recovery?.answerOptions)
          && challenge.correctAnswerId === recovery?.correctAnswerId;
      })
      .map((challenge) => `${challenge.id} → ${challenge.additionalRecoveryChallengeId}`);

    expect(offenders).toEqual([]);
  });
});
