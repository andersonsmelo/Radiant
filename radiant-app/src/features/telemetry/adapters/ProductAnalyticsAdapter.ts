import type { ProductAnalyticsAdapter as ProductAnalyticsAdapterType, TelemetryEvent } from '../telemetry.types';

export type ProductAnalyticsAdapter = ProductAnalyticsAdapterType;

export function createNoopProductAnalyticsAdapter(): ProductAnalyticsAdapter {
    return {
        track: async (_event: TelemetryEvent) => undefined,
        identify: async () => undefined,
        reset: async () => undefined,
    };
}
