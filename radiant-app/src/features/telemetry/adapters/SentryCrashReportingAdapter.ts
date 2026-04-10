import * as Sentry from '@sentry/react-native';
import type { CrashReportingAdapter } from './CrashReportingAdapter';

export function createSentryCrashReportingAdapter(): CrashReportingAdapter {
    return {
        capture: async (error, context) => {
            Sentry.withScope((scope) => {
                if (context) {
                    scope.setContext('radiant', context);
                }

                if (error instanceof Error) {
                    Sentry.captureException(error);
                    return;
                }

                scope.setLevel('error');
                Sentry.captureMessage('non_error_exception');
            });
        },
        setUserId: async (userId) => {
            Sentry.setUser(userId ? { id: userId } : null);
        },
        addBreadcrumb: async (message, data) => {
            Sentry.addBreadcrumb({
                category: 'telemetry',
                level: 'info',
                message,
                data,
            });
        },
    };
}
