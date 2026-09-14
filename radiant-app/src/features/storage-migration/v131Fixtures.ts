export const V131_PEDAGOGICAL_FIXTURE = {
    '@radiant:journey_progress_v1': JSON.stringify({
        schemaVersion: 'journey-progress.v2',
        activeTrackId: 'track-radiology-foundations',
        tracks: {},
    }),
    'radiant:gami:v1': JSON.stringify({
        totalXp: 120,
        streakDays: 4,
        hearts: 2,
        maxHearts: 5,
        heartsLastRefillAt: '2026-09-14T10:00:00.000Z',
    }),
    '@radiant:sr_schedule_v1': JSON.stringify({
        cards: {},
        reviewHistory: [],
        lastUpdated: '2026-09-14T10:00:00.000Z',
    }),
    '@radiant/first_run_v1': JSON.stringify({ seen: true, lastStep: 3 }),
} as const;
