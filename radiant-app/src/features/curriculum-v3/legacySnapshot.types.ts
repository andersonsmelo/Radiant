export type JsonValue = null | boolean | number | string | JsonValue[] | {
  [key: string]: JsonValue;
};

/** Partial curriculum history, not a backup of SM-2, checkpoints, XP or preferences. */
export type LegacyCurriculumSnapshot = {
  schemaVersion: 'legacy-curriculum-snapshot.v1';
  id: 'legacy-snapshot:v1';
  curriculumId: 'curriculum:legacy';
  capturedAt: string;
  sources: {
    journeyProgress: JsonValue | null;
    learningAttempts: JsonValue | null;
    learningEvidence: JsonValue | null;
    competencyMastery: JsonValue | null;
  };
};

export function isRecord(value: unknown): value is Record<string, unknown> {
  return value !== null && typeof value === 'object' &&
    (Object.getPrototypeOf(value) === Object.prototype || Object.getPrototypeOf(value) === null);
}

/** Accept only our canonical UTC representation, including valid calendar dates. */
export function isIsoTimestamp(value: unknown): value is string {
  if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/.test(value)) return false;
  const timestamp = Date.parse(value);
  return Number.isFinite(timestamp) && new Date(timestamp).toISOString() === value;
}

export function isJsonValue(value: unknown, ancestors = new Set<object>()): value is JsonValue {
  if (value === null || typeof value === 'boolean' || typeof value === 'string') return true;
  if (typeof value === 'number') return Number.isFinite(value);
  if (!Array.isArray(value) && !isRecord(value)) return false;
  if (ancestors.has(value) || Object.getOwnPropertySymbols(value).length > 0) return false;
  ancestors.add(value);
  const entries = Array.isArray(value) ? Array.from(value) : Object.values(value);
  const valid = entries.every((entry) => isJsonValue(entry, ancestors));
  ancestors.delete(value);
  return valid;
}

export function isLegacyCurriculumSnapshot(value: unknown): value is LegacyCurriculumSnapshot {
  return isRecord(value) && Object.keys(value).length === 5 &&
    value.schemaVersion === 'legacy-curriculum-snapshot.v1' &&
    value.id === 'legacy-snapshot:v1' && value.curriculumId === 'curriculum:legacy' &&
    isIsoTimestamp(value.capturedAt) && isRecord(value.sources) &&
    Object.keys(value.sources).length === 4 &&
    ['journeyProgress', 'learningAttempts', 'learningEvidence', 'competencyMastery'].every(
      (key) => Object.prototype.hasOwnProperty.call(value.sources, key)
    ) && isJsonValue(value.sources);
}
