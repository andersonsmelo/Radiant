export type HeuristicId = 'H1' | 'H2' | 'H3' | 'H4' | 'H5';
export type HeuristicLevel = 'info' | 'warning' | 'critical';
export type MascotState = 'idle' | 'thinking' | 'happy' | 'celebrate' | 'oops';
export type SuggestedAction = 'start_review' | 'start_review_quick' | 'continue_learning' | 'none';

export interface HeuristicAlert {
    id: HeuristicId;
    level: HeuristicLevel;
    mascotState: MascotState;
    message: string;
    suggestedAction: SuggestedAction;
    createdAt: number;
    context?: Record<string, any>;
}

// Storage structure for persistence
export interface HeuristicsStore {
    alerts: Record<string, HeuristicAlert>; // Key: YYYY-MM-DD
    shown: Record<string, boolean>; // Key: YYYY-MM-DD
}
