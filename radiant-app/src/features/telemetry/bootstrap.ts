import React from 'react';
import * as Sentry from '@sentry/react-native';
import { AppConfig } from '../../config';
import { TelemetryService } from './TelemetryService';
import { createSentryCrashReportingAdapter } from './adapters/SentryCrashReportingAdapter';

let hasInitializedObservability = false;

function isSentryEnabled(): boolean {
    return AppConfig.ENABLE_CRASH_REPORTING && Boolean(AppConfig.SENTRY_DSN);
}

type SentryEventLike = {
    message?: string;
    user?: unknown;
    server_name?: unknown;
    contexts?: { device?: { name?: unknown } & Record<string, unknown> } & Record<string, unknown>;
} & Record<string, unknown>;

/**
 * Remove identificador, IP e nome de aparelho de todo evento.
 *
 * `sendDefaultPii: false` já evita que o SDK COLETE PII por conta própria, mas
 * não impede que um identificador chegue por outro caminho — `Sentry.setUser`
 * em código futuro, um nome de aparelho no contexto, um `server_name`. Esta
 * função é a última barreira antes do envio, e o teste incide sobre ela, não
 * sobre um mock do SDK.
 *
 * A mensagem do erro é preservada de propósito: é o motivo de o relatório
 * existir.
 */
export function scrubSentryEvent<TEvent extends SentryEventLike>(event: TEvent): TEvent {
    const { user: _user, server_name: _serverName, ...rest } = event;
    const contexts = event.contexts;
    if (!contexts?.device) return rest as TEvent;

    const { name: _deviceName, ...device } = contexts.device;
    return { ...rest, contexts: { ...contexts, device } } as TEvent;
}

/**
 * Migalhas que podem carregar conteúdo do aluno ou corpo de requisição.
 *
 * `console` captura o que o app imprimiu, o que inclui resposta digitada em
 * lição; `xhr`/`fetch` carregam URL e, conforme a versão, corpo. Nenhum dos dois
 * ajuda a diagnosticar um crash o suficiente para justificar o risco.
 */
const DROPPED_BREADCRUMB_CATEGORIES = new Set(['console', 'xhr', 'fetch']);

/**
 * Opções do `Sentry.init` na configuração mínima da 1.4.
 *
 * Exportada como função pura porque é ela que determina o que sairia do
 * aparelho, e é sobre isso que o rótulo "Dados não coletados" da App Store se
 * apoia — não sobre o portão estar fechado hoje.
 */
export function buildSentryOptions(
    config: Readonly<{ dsn: string; environment: string }>
): Sentry.ReactNativeOptions {
    return {
        dsn: config.dsn,
        enabled: true,
        environment: config.environment,
        // Sem PII, sem desempenho, sem quadros nativos: a 1.4 quer saber que
        // quebrou e onde, e nada além disso.
        sendDefaultPii: false,
        tracesSampleRate: 0,
        enableNativeFramesTracking: false,
        maxBreadcrumbs: 20,
        // A ponte passa por `unknown` de propósito: `ErrorEvent` do SDK e o
        // tipo estrutural acima descrevem o mesmo objeto em tempo de execução,
        // mas não se sobrepõem nominalmente para o compilador. A limpeza é
        // verificada por comportamento em `bootstrap.test.ts`, sobre o objeto
        // real — não sobre o tipo.
        beforeSend: (event) => scrubSentryEvent(event as unknown as SentryEventLike) as unknown as typeof event,
        beforeBreadcrumb: (breadcrumb) =>
            DROPPED_BREADCRUMB_CATEGORIES.has(breadcrumb.category ?? '') ? null : breadcrumb,
    };
}

export function initializeObservability(): void {
    if (hasInitializedObservability) {
        return;
    }

    hasInitializedObservability = true;

    if (!isSentryEnabled()) {
        return;
    }

    Sentry.init(buildSentryOptions({ dsn: AppConfig.SENTRY_DSN, environment: AppConfig.APP_ENV }));

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
