import React from 'react';
import * as Sentry from '@sentry/react-native';
import { AppConfig } from '../../config';
import { TelemetryService } from './TelemetryService';
import { createSentryCrashReportingAdapter } from './adapters/SentryCrashReportingAdapter';

let hasInitializedObservability = false;

function isSentryEnabled(): boolean {
    return AppConfig.ENABLE_CRASH_REPORTING && Boolean(AppConfig.SENTRY_DSN);
}

export function initializeObservability(): void {
    if (hasInitializedObservability) {
        return;
    }

    hasInitializedObservability = true;

    if (!isSentryEnabled()) {
        return;
    }

    Sentry.init({
        dsn: AppConfig.SENTRY_DSN,
        enabled: true,
        enableNativeFramesTracking: true,
        environment: AppConfig.APP_ENV,
        sendDefaultPii: false,
    });

    TelemetryService.registerCrashReportingAdapter(createSentryCrashReportingAdapter());
}

export function wrapRootWithObservability<TProps>(
    Component: React.ComponentType<TProps>
): React.ComponentType<TProps> {
    if (!isSentryEnabled()) {
        return Component;
    }

    return Sentry.wrap(Component as React.ComponentType<Record<string, unknown>>) as React.ComponentType<TProps>;
}
