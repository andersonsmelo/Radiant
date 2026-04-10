export type HealthLabel = 'adjusting' | 'consistent' | 'strong' | 'excellent';

export interface HealthComponents {
    consistency: number;      // 0..35
    reviewStickiness: number; // 0..35
    balance: number;          // 0..20
    goalConsistency: number;  // 0..10
    penalty: number;          // 0..15 (subtracted)
}

export interface HealthScore {
    score: number;            // 0..100
    label: HealthLabel;
    microcopy: string;
    components: HealthComponents;
    windowDays: number;       // 7
    computedAt: number;       // timestamp
    dayKey: string;           // YYYY-MM-DD
}
