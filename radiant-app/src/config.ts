import {
    normalizeUrl,
    readBooleanFlag,
    resolveEnvironment,
} from './config/contracts';

const environment = resolveEnvironment(process.env.EXPO_PUBLIC_APP_ENV);

export const AppConfig = {
    // metadata
    VERSION: process.env.EXPO_PUBLIC_APP_VERSION ?? '1.0.0',
    APP_ENV: environment,
    IS_DEV: __DEV__,
    IS_BETA: environment !== 'production',

    // remote integration
    API_BASE_URL: normalizeUrl(process.env.EXPO_PUBLIC_API_BASE_URL),
    ENABLE_REMOTE_SYNC: readBooleanFlag(process.env.EXPO_PUBLIC_ENABLE_REMOTE_SYNC, false),
    ENABLE_REMOTE_CONTENT_CATALOG: readBooleanFlag(
        process.env.EXPO_PUBLIC_ENABLE_REMOTE_CONTENT_CATALOG,
        false
    ),
    SENTRY_DSN: process.env.EXPO_PUBLIC_SENTRY_DSN?.trim() ?? '',
    ENABLE_PRODUCT_ANALYTICS: readBooleanFlag(process.env.EXPO_PUBLIC_ENABLE_PRODUCT_ANALYTICS, false),
    ENABLE_CRASH_REPORTING: readBooleanFlag(process.env.EXPO_PUBLIC_ENABLE_CRASH_REPORTING, false),
    ENABLE_PAYWALL: readBooleanFlag(process.env.EXPO_PUBLIC_ENABLE_PAYWALL, false),
    ENABLE_REVENUECAT: readBooleanFlag(process.env.EXPO_PUBLIC_ENABLE_REVENUECAT, false),

    // release controls
    SHOW_DEV_TOOLS: __DEV__ || readBooleanFlag(process.env.EXPO_PUBLIC_ENABLE_DEV_TOOLS, false),
    ENABLE_TELEMETRY_DEBUG_SCREEN:
        __DEV__ || readBooleanFlag(process.env.EXPO_PUBLIC_ENABLE_TELEMETRY_DEBUG_SCREEN, false),
    ENABLE_LEARNING_ROAD: readBooleanFlag(process.env.EXPO_PUBLIC_ENABLE_LEARNING_ROAD, false),

    // kill switches (safety)
    ENABLE_REVIEW: true,
    ENABLE_GAMIFICATION: true,
    ENABLE_ONBOARDING: true,
    ENABLE_HEURISTICS: true,

    // beta access control
    ENABLE_BETA_GATE: readBooleanFlag(process.env.EXPO_PUBLIC_ENABLE_BETA_GATE, environment !== 'production'),
    BETA_INVITE_CODE: process.env.EXPO_PUBLIC_BETA_INVITE_CODE ?? 'RADIANT2025',
};
