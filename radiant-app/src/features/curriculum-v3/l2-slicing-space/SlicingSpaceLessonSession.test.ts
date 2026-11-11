import { createSlicingSpaceLessonSession } from './SlicingSpaceLessonSession';
import { syntheticL2 } from '../../../test/fixtures/syntheticSpatialLessons';

describe('injected slicing session', () => {
  it('reads its supplied definition and rejects removed IDs', () => {
    const session = createSlicingSpaceLessonSession(syntheticL2);
    expect(session.answer('initial', 'median')).toMatchObject({ correct: true, awardsXp: false, demonstratesMastery: false, nextChallengeId: 'recovery' });
    expect(() => session.answer('retired-id', 'median')).toThrow('Unknown L2 challenge');
  });
  it('cannot claim mastery by directly entering retrieval', () => {
    const session = createSlicingSpaceLessonSession(syntheticL2);
    expect(session.answer('recovery', 'median')).toMatchObject({ demonstratesMastery: false, awardsXp: false });
  });
  it('requires fresh unassisted retrieval after an independent attempt', () => {
    const session = createSlicingSpaceLessonSession(syntheticL2);
    session.answer('initial', 'median');
    expect(session.answer('recovery', 'median')).toMatchObject({ demonstratesMastery: true, awardsXp: true });
    expect(session.answer('recovery', 'median')).toMatchObject({ demonstratesMastery: false, awardsXp: false });
  });
  it('requires support after an error and does not count support as mastery', () => {
    const session = createSlicingSpaceLessonSession(syntheticL2);
    expect(session.answer('initial', 'paramedian').nextChallengeId).toBe('support');
    expect(session.answer('support', 'median')).toMatchObject({ demonstratesMastery: false, awardsXp: false, nextChallengeId: 'recovery' });
    expect(session.answer('recovery', 'median').demonstratesMastery).toBe(true);
  });
  it('failed retrieval continues onward after support and leaves the review debt', () => {
    const session = createSlicingSpaceLessonSession(syntheticL2);
    session.answer('initial', 'median'); session.answer('recovery', 'paramedian');
    expect(session.answer('support', 'median')).toMatchObject({ nextChallengeId: 'next', reviewTargetId: 'synthetic-review', demonstratesMastery: false });
  });
  it('a reused visual scenario cannot count as independent retrieval', () => {
    const lesson = { ...syntheticL2, challenges: syntheticL2.challenges.map((item) => ({ ...item, visualScenarioId: 'same-scenario' })) };
    const session = createSlicingSpaceLessonSession(lesson);
    session.answer('initial', 'median');
    expect(session.answer('recovery', 'median').demonstratesMastery).toBe(false);
  });
  it('snapshots cannot be changed by later answers', () => {
    const session = createSlicingSpaceLessonSession(syntheticL2);
    const snapshot = session.snapshot(); session.answer('initial', 'median');
    expect(snapshot.evidence).toHaveLength(0);
    expect(session.snapshot().evidence[0]).toMatchObject({ challengeId: 'initial', objectiveId: 'synthetic-objective', outcome: 'correct' });
  });
});
