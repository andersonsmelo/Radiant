export type AppEnvironment = 'development' | 'preview' | 'production';

export interface RuntimeRemoteConfig {
    apiBaseUrl: string;
    enableRemoteSync: boolean;
    enableLearningRoad: boolean;
    enableTelemetryDebugScreen: boolean;
    enableProductAnalytics: boolean;
    enableCrashReporting: boolean;
    enablePaywall: boolean;
    enableRevenueCat: boolean;
}

export interface AuthSessionEnvelope {
    accessToken: string;
    refreshToken: string;
    expiresAt: string;
    user: {
        id: string;
        email: string;
    };
}

export function resolveEnvironment(rawValue?: string): AppEnvironment {
    const raw = rawValue?.trim().toLowerCase();

    if (raw === 'preview' || raw === 'production') {
        return raw;
    }

    return __DEV__ ? 'development' : 'production';
}

export function readBooleanFlag(value: string | undefined, defaultValue: boolean): boolean {
    if (value === undefined) {
        return defaultValue;
    }

    return value.trim().toLowerCase() === 'true';
}

export function normalizeUrl(value: string | undefined): string {
    return (value ?? '').trim().replace(/\/+$/, '');
}
