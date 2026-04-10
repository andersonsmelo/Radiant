export interface ApiUser {
    id: string;
    email: string;
}

export interface ApiHealthResponse {
    ok: true;
    service: string;
    now: string;
}

export interface ApiReadinessResponse {
    ok: true;
    service: string;
    ready: true;
}

export interface ApiCatalogLessonSummary {
    id: string;
    slug: string;
    title: string;
    difficulty: 'beginner' | 'intermediate' | 'advanced';
    trackId: string;
    order: number;
    payload?: {
        id: string;
        title: string;
        difficulty: 'beginner' | 'intermediate' | 'advanced';
        journey?: {
            intro?: {
                questionIndex?: number;
                contextBody?: string;
                teachBody?: string;
                reinforceBody?: string;
            };
            review?: {
                questionIndex?: number;
                contextBody?: string;
                teachBody?: string;
                reinforceBody?: string;
            };
        };
        questions: {
            id: string;
            type: 'multiple-choice' | 'image';
            prompt: string;
            imageUrl?: string;
            options: {
                label: string;
            }[];
            correctAnswerIndex: number;
            explanation: string;
            hint?: string;
        }[];
    };
}

export interface ApiCatalogTrackSummary {
    id: string;
    slug: string;
    title: string;
    description: string;
    lessonIds: string[];
}

export interface ApiCatalogMeta {
    source: 'local' | 'remote';
    generatedAt: string;
}

export interface ApiCatalogResponse {
    version: string;
    initialLessonId: string | null;
    meta?: ApiCatalogMeta;
    tracks: ApiCatalogTrackSummary[];
    lessons: ApiCatalogLessonSummary[];
}

export interface AuthSessionResponse {
    accessToken: string;
    refreshToken: string;
    expiresAt: string;
    user: ApiUser;
}

export interface PasswordResetRequestResponse {
    accepted: true;
    resetToken?: string;
}

export interface PasswordResetConfirmResponse {
    success: true;
}
