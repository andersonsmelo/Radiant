import { L1_BODY_REFERENCE } from './l1BodyReferenceContent';

describe('L1_BODY_REFERENCE', () => {
  it('mantém uma lição original rastreável e não pontua o diagnóstico inicial', () => {
    expect(L1_BODY_REFERENCE.id).toBe('lesson:v3:arc:spatial-orientation:l1-body-reference');
    expect(L1_BODY_REFERENCE.audienceLabel).not.toMatch(/alun/i);
    expect(L1_BODY_REFERENCE.sources).toEqual(expect.arrayContaining([
      expect.objectContaining({ id: 'fipat-ta2-part-1', edition: 'TA2 Part 1' }),
      expect.objectContaining({ id: 'ifaa-fipat-status' }),
      expect.objectContaining({ id: 'apple-hig-accessibility' }),
    ]));
    expect(L1_BODY_REFERENCE.challenges.find((challenge) => challenge.id === 'l1-diagnostic-laterality')).toMatchObject({
      evidenceKind: 'initial_independent',
      awardsXp: false,
      misconception: 'E-LAT-OBS',
    });
  });

  it('liga cada relação essencial a uma prática nova, feedback, remediação e revisão', () => {
    expect(L1_BODY_REFERENCE.relationships.map((relationship) => relationship.id)).toEqual([
      'superior-inferior',
      'anterior-posterior',
      'medial-lateral',
      'proximal-distal',
      'superficial-deep',
    ]);

    for (const challenge of L1_BODY_REFERENCE.challenges) {
      expect(challenge.objectiveId).toBeTruthy();
      expect(challenge.feedback.incorrect).toBeTruthy();
      expect(challenge.remediationChallengeId).toBeTruthy();
      expect(challenge.reviewTargetId).toBeTruthy();
      expect(L1_BODY_REFERENCE.challenges.find((entry) => entry.id === challenge.remediationChallengeId)).toBeDefined();
    }

    const guided = L1_BODY_REFERENCE.challenges.find((challenge) => challenge.id === 'l1-remediate-laterality');
    const retrieval = L1_BODY_REFERENCE.challenges.find((challenge) => challenge.id === 'l1-laterality-transfer');
    expect(guided?.evidenceKind).toBe('assisted_practice');
    expect(retrieval).toMatchObject({
      evidenceKind: 'later_independent_retrieval',
      awardsXp: true,
    });
    expect(retrieval?.prompt).not.toBe(guided?.prompt);
  });

  it('torna cada decisão alcançável com exatamente duas opções próprias e um landmark equivalente', () => {
    for (const challenge of L1_BODY_REFERENCE.challenges) {
      expect(challenge.answerOptions).toHaveLength(2);
      expect(challenge.answerOptions.map((option) => option.id)).toContain(challenge.correctAnswerId);
      expect(challenge.answerOptions.every((option) => option.landmarkId && option.textDescription)).toBe(true);
    }
    expect(L1_BODY_REFERENCE.challenges.find((challenge) => challenge.id === 'l1-laterality-transfer')).toBeDefined();
    expect(L1_BODY_REFERENCE.challenges.find((challenge) => challenge.id === 'l1-posture-recovery')).toBeDefined();
    expect(L1_BODY_REFERENCE.challenges.filter((challenge) => challenge.evidenceKind === 'assisted_practice')).toHaveLength(6);
  });
});
