import { createBodyReferenceLessonSession } from './BodyReferenceLessonSession';
import { syntheticL1 } from '../../../test/fixtures/syntheticSpatialLessons';

describe('injected body-reference session', () => {
  it('uses the supplied definition and rejects unknown IDs', () => {
    const session = createBodyReferenceLessonSession(syntheticL1);
    expect(session.answer('initial', 'a')).toMatchObject({ correct: true, awardsXp: false });
    expect(() => session.answer('retired-id', 'a')).toThrow('UNKNOWN_L1_CHALLENGE');
  });
  it('records failed evidence and offers configured remediation', () => {
    const session = createBodyReferenceLessonSession(syntheticL1);
    expect(session.answer('initial', 'b')).toMatchObject({ correct: false, misconception: 'E-REL', remediationChallengeId: 'support', awardsXp: false });
    expect(session.snapshot().evidence).toEqual([{ challengeId: 'initial', evidenceKind: 'initial_independent', outcome: 'incorrect', misconception: 'E-REL' }]);
  });
  it('assisted practice cannot demonstrate mastery; fresh retrieval can', () => {
    const session = createBodyReferenceLessonSession(syntheticL1);
    session.answer('initial', 'b');
    expect(session.answer('support', 'a')).toMatchObject({ demonstratesMastery: false, awardsXp: false });
    expect(session.answer('recovery', 'a')).toMatchObject({ demonstratesMastery: true, awardsXp: true });
    expect(session.answer('recovery', 'a').demonstratesMastery).toBe(false);
  });
  it('failed retrieval is not upgraded by immediate retry', () => {
    const session = createBodyReferenceLessonSession(syntheticL1);
    session.answer('recovery', 'b');
    expect(session.answer('recovery', 'a').demonstratesMastery).toBe(false);
  });
  it('offers a fresh recovery and then scheduled review when both were attempted', () => {
    const session = createBodyReferenceLessonSession(syntheticL1);
    session.answer('initial', 'b'); session.answer('recovery', 'b');
    expect(session.answer('support', 'a').nextChallengeId).toBe('alternate');
    session.answer('alternate', 'b');
    expect(session.answer('support', 'a')).toMatchObject({ reviewTargetId: 'synthetic-review' });
    expect(session.answer('support', 'a').nextChallengeId).toBeUndefined();
  });
  it('does not expose its internal evidence array', () => {
    const session = createBodyReferenceLessonSession(syntheticL1);
    const snapshot = session.snapshot(); session.answer('initial', 'a');
    expect(snapshot.evidence).toHaveLength(0);
    expect(session.snapshot().evidence).toHaveLength(1);
  });
});
