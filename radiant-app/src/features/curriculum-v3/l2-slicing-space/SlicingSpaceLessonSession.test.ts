import { createSlicingSpaceLessonSession } from './SlicingSpaceLessonSession';

describe('SlicingSpaceLessonSession', () => {
  it('registra diagnóstico inicial sem XP ou domínio', () => {
    const session = createSlicingSpaceLessonSession();

    const result = session.answer('l2-initial-median', 'median');

    expect(result).toMatchObject({ correct: true, awardsXp: false, demonstratesMastery: false });
    expect(session.snapshot().evidence).toEqual([
      expect.objectContaining({ challengeId: 'l2-initial-median', evidenceKind: 'initial_independent', outcome: 'correct', visualScenarioId: 'thorax-midline' }),
    ]);
  });

  it('remedia erro sobre o plano mediano e só reconhece recuperação em cenário novo', () => {
    const session = createSlicingSpaceLessonSession();

    expect(session.answer('l2-initial-median', 'sagittal-not-median')).toMatchObject({
      correct: false,
      misconception: 'E-PLN-MED',
      remediationChallengeId: 'l2-assisted-sagittal',
      demonstratesMastery: false,
    });
    expect(session.answer('l2-assisted-sagittal', 'sagittal-not-median')).toMatchObject({
      evidenceKind: 'assisted_practice', awardsXp: false, nextChallengeId: 'l2-median-recovery', demonstratesMastery: false,
    });
    expect(session.answer('l2-median-recovery', 'median')).toMatchObject({
      evidenceKind: 'later_independent_retrieval', demonstratesMastery: true, awardsXp: true,
    });
  });

  it('classifica erro de obliquidade e encaminha para apoio específico', () => {
    const session = createSlicingSpaceLessonSession();

    const result = session.answer('l2-independent-oblique', 'reference-plane');

    expect(result).toMatchObject({
      correct: false,
      misconception: 'E-PLN-OBL',
      remediationChallengeId: 'l2-assisted-oblique',
      feedback: expect.stringMatching(/relação geométrica/i),
    });
  });

  it('não trata região com espessura como se fosse repetição de um plano e exige recuperação após apoio', () => {
    const session = createSlicingSpaceLessonSession();

    expect(session.answer('l2-independent-section', 'resulting-image')).toMatchObject({ misconception: 'E-PLN-SEC', correct: false });
    expect(session.answer('l2-assisted-section', 'resulting-image')).toMatchObject({
      evidenceKind: 'assisted_practice', demonstratesMastery: false, nextChallengeId: 'l2-section-recovery',
    });
    expect(session.answer('l2-section-recovery', 'region-with-nominal-thickness')).toMatchObject({
      evidenceKind: 'later_independent_retrieval', demonstratesMastery: true,
    });
  });

  it('não transforma a repetição da mesma recuperação após novo erro em domínio', () => {
    const session = createSlicingSpaceLessonSession();

    session.answer('l2-independent-oblique', 'reference-plane');
    session.answer('l2-assisted-oblique', 'oblique');
    session.answer('l2-oblique-recovery', 'coronal');

    const extraSupport = session.answer('l2-assisted-oblique', 'oblique');
    const repeatedRecovery = session.answer('l2-oblique-recovery', 'oblique');

    // O apoio extra não reabre a mesma recuperação — repetir o item errado não
    // é recuperação independente — mas encaminha ao objetivo seguinte. Zerar a
    // continuação aqui encerrava a lição com objetivos por ver.
    expect(extraSupport).toMatchObject({ demonstratesMastery: false, reviewTargetId: 'review:l2:obliquidade-em-regiao-nova' });
    expect(extraSupport.nextChallengeId).toBe('l2-independent-section');
    expect(extraSupport.nextActionLabel).toBe('Seguir; este objetivo volta na revisão');
    expect(repeatedRecovery).toMatchObject({ demonstratesMastery: false, awardsXp: false });
  });

  it('leva quem acerta o item inicial à recuperação independente, em vez de pular o objetivo', () => {
    const session = createSlicingSpaceLessonSession();

    const initial = session.answer('l2-initial-median', 'median');

    expect(initial).toMatchObject({ correct: true, nextChallengeId: 'l2-median-recovery' });
  });

  it('reconhece domínio de quem acerta sem errar, desde que a recuperação seja item novo', () => {
    // A §5.1 exige um item novo, sem ajuda, para TODO objetivo essencial — não
    // só para quem errou. Exigir erro diagnosticado como pré-condição de
    // domínio tornava o caminho correto incapaz de fechar o objetivo.
    const session = createSlicingSpaceLessonSession();

    session.answer('l2-initial-median', 'median');
    const recovery = session.answer('l2-median-recovery', 'median');

    expect(recovery).toMatchObject({
      evidenceKind: 'later_independent_retrieval', demonstratesMastery: true, awardsXp: true,
    });
  });

  it('não concede domínio se uma recuperação for chamada sem nenhuma decisão prévia sobre o objetivo', () => {
    const session = createSlicingSpaceLessonSession();

    expect(session.answer('l2-median-recovery', 'median')).toMatchObject({
      correct: true, demonstratesMastery: false, awardsXp: false,
    });
  });

  it('nunca deixa o aprendiz sem continuação depois de errar a recuperação e fechar o apoio', () => {
    // A regra que zera a continuação existia antes, mas só alcançava quem
    // errava o item inicial. Ao levar todo mundo à recuperação, ela virou o
    // caminho modal: um único erro ali encerrava a lição com três objetivos
    // por ver, enquanto a tela prometia "um item novo".
    const session = createSlicingSpaceLessonSession();

    const initial = session.answer('l2-initial-median', 'median');
    const failedRecovery = session.answer(initial.nextChallengeId!, 'sagittal-not-median');
    const support = session.answer(failedRecovery.nextChallengeId!, 'sagittal-not-median');

    expect(support.correct).toBe(true);
    expect(support.nextChallengeId).toBeDefined();
  });

  it('não converte em domínio o apoio que sucede uma recuperação falhada, mas segue o percurso', () => {
    const session = createSlicingSpaceLessonSession();

    session.answer('l2-initial-median', 'median');
    session.answer('l2-median-recovery', 'sagittal-not-median');
    const support = session.answer('l2-assisted-sagittal', 'sagittal-not-median');

    expect(support).toMatchObject({ demonstratesMastery: false, awardsXp: false });
    expect(support.nextChallengeId).toBe('l2-independent-reference-plane');
  });
});
