import test from 'node:test';
import assert from 'node:assert/strict';
import { validateFoundation } from './validate-foundation.mjs';

test('foundation taxonomy is internally consistent', () => {
  const result = validateFoundation();

  assert.equal(result.ok, true, result.errors.join('\n'));
  assert.equal(result.summary.sourceCount, 1);
  assert.equal(result.summary.extractionJobCount, 1);
  assert.equal(result.summary.extractedJobCount, 1);
  assert.equal(result.summary.extractedPageCount, 75);
  assert.equal(result.summary.extractedExcerptCount, 109);
  assert.equal(result.summary.classificationJobCount, 1);
  assert.equal(result.summary.classifiedJobCount, 1);
  assert.equal(result.summary.classificationRecordCount, 109);
  assert.equal(result.summary.needsReviewCount, 30);
  assert.equal(result.summary.conceptJobCount, 1);
  assert.equal(result.summary.conceptRecordCount, 16);
  assert.equal(result.summary.conceptNeedsReviewCount, 7);
  assert.equal(result.summary.formatJobCount, 6);
  assert.equal(result.summary.formatBundleCount, 96);
  assert.equal(result.summary.formatNeedsReviewCount, 42);
  assert.deepEqual(result.summary.sourceSlugs, [
    'fundamentos-de-radiologia-everton-costa-pinto',
  ]);
  assert.deepEqual(result.summary.sourceExtractionStatuses, ['extracted']);
  assert.deepEqual(result.summary.sourceClassificationStatuses, ['classified']);
  assert.deepEqual(result.summary.sourceConceptStatuses, ['normalized']);
  assert.deepEqual(result.summary.sourceFormatStatuses, ['generated']);
  assert.deepEqual(result.summary.extractionStatuses, ['extracted']);
  assert.deepEqual(result.summary.classificationStatuses, ['classified']);
  assert.deepEqual(result.summary.conceptStatuses, ['normalized']);
  assert.deepEqual(result.summary.formatStatuses, ['generated', 'generated', 'generated', 'generated', 'generated', 'generated']);
  assert.deepEqual(result.summary.formatTypes, ['casos', 'checkpoints', 'microlições', 'quizzes', 'reviews', 'rewards']);
  assert.deepEqual(result.summary.classificationSourceSlugs, [
    'fundamentos-de-radiologia-everton-costa-pinto',
  ]);
  assert.equal(result.summary.galaxyCount, 3);
  assert.equal(result.summary.planetCount, 6);
  assert.equal(result.summary.starCount, 6);
  assert.deepEqual(result.summary.galaxyIds, [
    'galaxy-anatomia',
    'galaxy-fisica',
    'galaxy-patologias',
  ]);
});

test('governance schemas expose the required contract fields', () => {
  const result = validateFoundation();

  assert.equal(result.ok, true, result.errors.join('\n'));
  assert.deepEqual(result.summary.schemaTitles, [
    'Extraction Record',
    'Classification Record',
    'Concept',
    'Format Bundle',
  ]);
});
