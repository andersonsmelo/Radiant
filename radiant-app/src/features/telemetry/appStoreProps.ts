import { TelemetryPropKeys } from './telemetry.constants';
import { AppConfig } from '../../config';

function resolveLocale(): string {
    try {
        return Intl.DateTimeFormat().resolvedOptions().locale || 'unknown';
    } catch {
        return 'unknown';
    }
}

function resolveMarket(locale: string): string {
    const [, region] = locale.split('-');
    return region?.toUpperCase() ?? 'unknown';
}

/**
 * Props de loja anexadas a eventos de superfícies de aquisição.
 * Vive aqui, e não dentro de um serviço, porque mais de uma superfície
 * precisa da mesma lista — duas cópias iguais é a forma de elas divergirem.
 */
export function resolveAppStoreProps(entrySurface: string): Record<string, string> {
    const locale = resolveLocale();

    return {
        [TelemetryPropKeys.LOCALE]: locale,
        [TelemetryPropKeys.MARKET]: resolveMarket(locale),
        [TelemetryPropKeys.ENTRY_SURFACE]: entrySurface,
        [TelemetryPropKeys.BUILD_CHANNEL]: AppConfig.APP_ENV,
    };
}
