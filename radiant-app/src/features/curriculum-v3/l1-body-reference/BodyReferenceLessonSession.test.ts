import { createBodyReferenceLessonSession } from './BodyReferenceLessonSession';

describe('BodyReferenceLessonSession', () => {
  it('registra o diagnóstico inicial sem transformar acerto em domínio ou XP', () => {
    const session = createBodyReferenceLessonSession();

    const result = session.answer('l1-diagnostic-laterality', 'patient-left');

    expect(result).toMatchObject({ correct: true, awardsXp: false, demonstratesMastery: false });
    expect(session.snapshot().evidence).toEqual([
      expect.objectContaining({ evidenceKind: 'initial_independent', outcome: 'correct' }),
    ]);
  });

  it('encaminha o erro de lateralidade para ajuda e exige nova recuperação independente', () => {
    const session = createBodyReferenceLessonSession();

    const incorrect = session.answer('l1-diagnostic-laterality', 'observer-left');
    expect(incorrect).toMatchObject({
      correct: false,
      misconception: 'E-LAT-OBS',
      remediationChallengeId: 'l1-remediate-laterality',
      demonstratesMastery: false,
    });

    session.answer('l1-remediate-laterality', 'patient-left');
    const retrieval = session.answer('l1-laterality-transfer', 'patient-left');

    expect(retrieval).toMatchObject({
      correct: true,
      evidenceKind: 'later_independent_retrieval',
      demonstratesMastery: true,
    });
  });

  it('preserva a referência anatômica quando a postura muda', () => {
    const session = createBodyReferenceLessonSession();

    const result = session.answer('l1-transfer-posture', 'anterior');

    expect(result.feedback).toMatch(/referência anatômica/i);
    expect(result.misconception).not.toBe('E-GRV');
  });

  it('só demonstra lateralidade após a recuperação nova do mesmo objetivo quando houve ajuda', () => {
    const session = createBodyReferenceLessonSession();

    session.answer('l1-diagnostic-laterality', 'observer-left');
    session.answer('l1-remediate-laterality', 'patient-left');

    expect(session.answer('l1-diagnostic-laterality', 'patient-left').demonstratesMastery).toBe(false);
    expect(session.answer('l1-laterality-transfer', 'patient-left')).toMatchObject({
      correct: true,
      demonstratesMastery: true,
    });
  });

  it('não aceita o mesmo item de postura como recuperação depois de ajuda', () => {
    const session = createBodyReferenceLessonSession();

    session.answer('l1-transfer-posture', 'posterior');
    session.answer('l1-assisted-posture', 'anterior');

    expect(session.answer('l1-transfer-posture', 'anterior').demonstratesMastery).toBe(false);
    expect(session.answer('l1-posture-recovery', 'posterior').demonstratesMastery).toBe(true);
  });

  it('não usa uma explicação de relação como se fosse recuperação independente', () => {
    const session = createBodyReferenceLessonSession();

    session.answer('l1-medial-lateral', 'lateral');
    expect(session.answer('l1-assisted-medial-lateral', 'medial')).toMatchObject({
      evidenceKind: 'assisted_practice',
      demonstratesMastery: false,
      awardsXp: false,
    });
    expect(session.answer('l1-medial-lateral-recovery', 'medial')).toMatchObject({
      evidenceKind: 'later_independent_retrieval',
      demonstratesMastery: true,
      awardsXp: true,
    });
  });

  it('encaminha uma segunda recuperação nova quando a primeira recuperação independente falha', () => {
    const session = createBodyReferenceLessonSession();

    session.answer('l1-laterality-transfer', 'patient-right');
    expect(session.answer('l1-remediate-laterality', 'patient-left')).toMatchObject({
      nextChallengeId: 'l1-laterality-recovery-2',
      nextActionLabel: 'Tentar outro cenário sem apoio',
    });
    expect(session.answer('l1-laterality-recovery-2', 'patient-left')).toMatchObject({
      demonstratesMastery: true,
      awardsXp: true,
    });
  });

  it('não repete a segunda recuperação após ajuda adicional e deixa a revisão pendente', () => {
    const session = createBodyReferenceLessonSession();

    session.answer('l1-laterality-transfer', 'patient-right');
    session.answer('l1-remediate-laterality', 'patient-left');
    session.answer('l1-laterality-recovery-2', 'patient-right');

    const result = session.answer('l1-remediate-laterality', 'patient-left');
    expect(result).toMatchObject({
      reviewTargetId: 'review:l1:lateralidade-em-nova-postura',
      demonstratesMastery: false,
    });
    expect(result).not.toHaveProperty('nextChallengeId');
  });
});
