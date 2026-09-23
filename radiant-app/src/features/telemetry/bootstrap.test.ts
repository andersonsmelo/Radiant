// AsyncStorage entra por transitividade do TelemetryService; o módulo nativo é
// nulo no Jest. O mock é de dependência alheia ao que se testa aqui.
jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: jest.fn(async () => null),
  setItem: jest.fn(async () => undefined),
}));

import { buildSentryOptions, scrubSentryEvent } from './bootstrap';

/**
 * O rótulo "Dados não coletados" na App Store depende do que o SDK enviaria se
 * a flag fosse ligada — não do fato de o portão estar fechado hoje. Estas
 * asserções incidem sobre as opções reais passadas ao `Sentry.init` e sobre a
 * função que limpa o evento, não sobre um mock do SDK.
 */
describe('configuração mínima do Sentry', () => {
  it('não pede PII por padrão nem liga rastreamento de desempenho', () => {
    const options = buildSentryOptions({ dsn: 'https://exemplo@o0.ingest.sentry.io/1', environment: 'production' });

    expect(options.sendDefaultPii).toBe(false);
    expect(options.tracesSampleRate).toBe(0);
    expect(options.enableNativeFramesTracking).toBe(false);
  });

  it('remove identificador e IP de qualquer evento antes do envio', () => {
    const scrubbed = scrubSentryEvent({
      message: 'falha',
      user: { id: 'aluno-42', email: 'alguem@exemplo.com', ip_address: '203.0.113.7' },
      server_name: 'iPhone de Fulano',
      contexts: { device: { name: 'iPhone de Fulano' } },
    });

    expect(scrubbed.user).toBeUndefined();
    expect(scrubbed.server_name).toBeUndefined();
    expect(scrubbed.contexts?.device?.name).toBeUndefined();
  });

  it('preserva a mensagem do erro, que é o motivo de o relatório existir', () => {
    const scrubbed = scrubSentryEvent({ message: 'TypeError: undefined is not a function' });

    expect(scrubbed.message).toBe('TypeError: undefined is not a function');
  });

  it('instala a limpeza como beforeSend, para que nenhum evento escape dela', () => {
    const options = buildSentryOptions({ dsn: 'https://exemplo@o0.ingest.sentry.io/1', environment: 'production' });

    const scrubbed = options.beforeSend?.({ user: { id: 'aluno-42' } } as never, {} as never);

    expect((scrubbed as { user?: unknown } | null)?.user).toBeUndefined();
  });

  it('descarta migalhas que carregam conteúdo digitado ou corpo de requisição', () => {
    const options = buildSentryOptions({ dsn: 'https://exemplo@o0.ingest.sentry.io/1', environment: 'production' });

    expect(options.beforeBreadcrumb?.({ category: 'console', message: 'resposta do aluno: mediano' } as never, undefined)).toBeNull();
    expect(options.beforeBreadcrumb?.({ category: 'xhr' } as never, undefined)).toBeNull();
    expect(options.beforeBreadcrumb?.({ category: 'navigation' } as never, undefined)).not.toBeNull();
  });
});
