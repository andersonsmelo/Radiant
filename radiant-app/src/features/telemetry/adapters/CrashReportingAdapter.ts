import type { CrashReportingAdapter as CrashReportingAdapterType } from '../telemetry.types';

export type CrashReportingAdapter = CrashReportingAdapterType;

export function createNoopCrashReportingAdapter(): CrashReportingAdapter {
    return {
        capture: async () => undefined,
        setUserId: async () => undefined,
        addBreadcrumb: async () => undefined,
    };
}
