import { HeuristicsService } from './HeuristicsService';
import { TelemetryService } from '../TelemetryService';

jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: jest.fn().mockResolvedValue(null),
  setItem: jest.fn().mockResolvedValue(undefined),
  multiSet: jest.fn().mockResolvedValue(undefined),
  multiRemove: jest.fn().mockResolvedValue(undefined),
}));

jest.mock('../TelemetryService', () => ({
  TelemetryService: {
    getLastAppOpen: jest.fn().mockResolvedValue(null),
    getPreviousAppOpen: jest.fn().mockResolvedValue(null),
    getHistory: jest.fn(),
  },
}));

const telemetria = TelemetryService as unknown as {
  getLastAppOpen: jest.Mock;
  getPreviousAppOpen: jest.Mock;
  getHistory: jest.Mock;
};

const HORA = 60 * 60 * 1000;

/**
 * Os dublês são tipados pelo que as heurísticas realmente leem do histórico, e
 * não por `any`: um fixture frouxo aqui esconderia mudança de forma no
 * `TelemetryService` — que é exatamente o acoplamento que estes testes vigiam.
 */
interface DiaDublê {
  reviewed: boolean;
  goalMet: boolean;
}

interface MétricasDublê {
  totals: { reviewDurationMs: number };
  eventCounts: Record<string, number>;
}

interface Cenário {
  days?: DiaDublê[];
  daily?: MétricasDublê[];
  ultimoOpen?: number | null;
  openAnterior?: number | null;
}

/** Um dia de atividade, com os campos que as heurísticas realmente leem. */
function dia({ reviewed = false, goalMet = false } = {}): DiaDublê {
  return { reviewed, goalMet };
}

/** Métricas diárias, na forma que `evaluateToday` consome. */
function metricas({ reviewDurationMs = 0, reviews = 0, learns = 0 } = {}): MétricasDublê {
  return {
    totals: { reviewDurationMs },
    eventCounts: { review_complete: reviews, learn_complete: learns },
  };
}

function cenario({ days = [], daily = [], ultimoOpen = null, openAnterior = null }: Cenário) {
  telemetria.getLastAppOpen.mockResolvedValue(ultimoOpen);
  telemetria.getPreviousAppOpen.mockResolvedValue(openAnterior);
  telemetria.getHistory.mockResolvedValue({ days, daily });
}

beforeEach(async () => {
  jest.clearAllMocks();
  await HeuristicsService.clear();
});

// ---------------------------------------------------------------------------
// H3 — quebra de hábito. O caso que motivou esta suíte.
// ---------------------------------------------------------------------------

describe('H3 — quebra de hábito', () => {
  it('dispara quando o intervalo ENTRE os dois últimos lançamentos passa de 48h', async () => {
    const agora = Date.now();
    cenario({
      ultimoOpen: agora,
      openAnterior: agora - 72 * HORA,
      days: [dia(), dia()],
      daily: [metricas()],
    });

    const alerta = await HeuristicsService.evaluateToday();

    expect(alerta?.id).toBe('H3');
    expect(alerta?.level).toBe('critical');
    expect(Number(alerta?.context?.hoursAbsent)).toBeCloseTo(72, 0);
  });

  it('MUTACAO: mede o INTERVALO entre lancamentos, nao o tempo desde o ultimo', async () => {
    // Este fixture existe para separar duas implementacoes que quase todo outro
    // caso confunde. Ate 2026-08-07 a conta era `Date.now() - lastAppOpenTs`, e
    // isso dava ~0 sempre: `useAppOpenLifecycle` grava `app_open` na linha 64 da
    // HomeScreen e `checkHeuristics` roda no efeito da linha 141, entao o
    // "ultimo" open era o do proprio lancamento.
    //
    // Aqui ha UM unico open, 72h atras, e nenhum anterior. Pela conta antiga o
    // resultado seria 72h e a H3 dispararia; pela conta nova nao ha intervalo, e
    // ela fica calada — que e o correto, porque primeiro lancamento nao e
    // ausencia. Um fixture com o open em `Date.now()` passaria nas DUAS
    // implementacoes e nao provaria nada.
    cenario({
      ultimoOpen: Date.now() - 72 * HORA,
      openAnterior: null,
      days: [dia(), dia()],
      daily: [metricas()],
    });

    const alerta = await HeuristicsService.evaluateToday();

    expect(alerta?.id).not.toBe('H3');
  });

  it('nao dispara quando o intervalo esta abaixo do limiar', async () => {
    const agora = Date.now();
    cenario({
      ultimoOpen: agora,
      openAnterior: agora - 47 * HORA,
      days: [dia(), dia()],
      daily: [metricas()],
    });

    expect((await HeuristicsService.evaluateToday())?.id).not.toBe('H3');
  });

  it('tem prioridade sobre a H1 quando as duas se aplicam', async () => {
    const agora = Date.now();
    cenario({
      ultimoOpen: agora,
      openAnterior: agora - 72 * HORA,
      // Tres dias ativos e nenhuma revisao: a H1 tambem se aplicaria.
      days: [dia(), dia(), dia()],
      daily: [metricas()],
    });

    expect((await HeuristicsService.evaluateToday())?.id).toBe('H3');
  });
});

// ---------------------------------------------------------------------------
// H1, H2, H4, H5 — cada limiar com o caso que morde quando ele muda.
// ---------------------------------------------------------------------------

describe('H1 — fuga da revisão', () => {
  it('dispara com 3+ dias ativos e menos de 30% deles com revisão', async () => {
    cenario({ days: [dia(), dia(), dia({ reviewed: true })], daily: [metricas()] });
    // 1 de 3 = 0,33 nao dispara; com 4 dias e 1 revisao, 0,25 dispara.
    cenario({
      days: [dia(), dia(), dia(), dia({ reviewed: true })],
      daily: [metricas()],
    });

    const alerta = await HeuristicsService.evaluateToday();
    expect(alerta?.id).toBe('H1');
    expect(alerta?.level).toBe('critical');
  });

  it('MUTACAO: nao dispara com menos de 3 dias ativos, por pouco dado', async () => {
    cenario({ days: [dia(), dia()], daily: [metricas()] });
    expect((await HeuristicsService.evaluateToday())?.id).not.toBe('H1');
  });

  it('MUTACAO: nao dispara quando a razao de revisao esta ACIMA do limiar', async () => {
    // Este caso existe porque a varredura de mutacao mostrou que o limiar de
    // 0,30 nao era mordido por nada: os outros casos exercitam a guarda de dias
    // ativos, e um cenario que dispara H1 continua disparando com o limiar
    // frouxo. So um cenario que NAO dispara distingue 0,30 de 0,99.
    cenario({
      days: [dia(), dia(), dia({ reviewed: true }), dia({ reviewed: true })],
      daily: [metricas()],
    });
    // 2 de 4 = 0,50, acima dos 0,30 exigidos para acusar fuga da revisao.
    expect((await HeuristicsService.evaluateToday())?.id).not.toBe('H1');
  });
});

describe('H2 — revisão longa', () => {
  it('dispara quando a média por revisão passa de 180s', async () => {
    cenario({
      days: [dia({ reviewed: true })],
      daily: [metricas({ reviewDurationMs: 400_000, reviews: 2, learns: 0 })],
    });
    // 400.000 / 2 = 200.000ms de media, acima dos 180.000 do limiar.
    expect((await HeuristicsService.evaluateToday())?.id).toBe('H2');
  });

  it('MUTACAO: nao dispara logo abaixo do limiar', async () => {
    cenario({
      days: [dia({ reviewed: true })],
      daily: [metricas({ reviewDurationMs: 358_000, reviews: 2, learns: 0 })],
    });
    // 179.000ms de media.
    expect((await HeuristicsService.evaluateToday())?.id).not.toBe('H2');
  });
});

describe('H4 — meta ignorada', () => {
  it('dispara com 5+ dias ativos e consistência de meta abaixo de 40%', async () => {
    cenario({
      days: [dia({ reviewed: true }), dia({ reviewed: true }), dia({ reviewed: true }), dia({ reviewed: true }), dia({ reviewed: true, goalMet: true })],
      daily: [metricas({ reviews: 1, learns: 1 })],
    });
    // 1 de 5 = 0,20 de consistencia; revisao em todos os dias mantem a H1 calada.
    const alerta = await HeuristicsService.evaluateToday();
    expect(alerta?.id).toBe('H4');
    expect(alerta?.level).toBe('warning');
  });

  it('MUTACAO: nao dispara com menos de 5 dias ativos', async () => {
    cenario({
      days: [dia({ reviewed: true }), dia({ reviewed: true }), dia({ reviewed: true }), dia({ reviewed: true })],
      daily: [metricas({ reviews: 1, learns: 1 })],
    });
    expect((await HeuristicsService.evaluateToday())?.id).not.toBe('H4');
  });
});

describe('H5 — ritmo saudável', () => {
  it('dispara quando a razao revisao/aprendizado e equilibrada e a meta e consistente', async () => {
    cenario({
      days: [dia({ reviewed: true, goalMet: true }), dia({ reviewed: true, goalMet: true })],
      daily: [metricas({ reviews: 2, learns: 2 })],
    });
    const alerta = await HeuristicsService.evaluateToday();
    expect(alerta?.id).toBe('H5');
    expect(alerta?.level).toBe('info');
    expect(alerta?.suggestedAction).toBe('none');
  });

  it('MUTACAO: nao dispara quando a consistencia da meta fica abaixo do piso', async () => {
    cenario({
      days: [dia({ reviewed: true, goalMet: true }), dia({ reviewed: true })],
      daily: [metricas({ reviews: 2, learns: 2 })],
    });
    // 1 de 2 = 0,50 de consistencia, abaixo dos 0,60 exigidos.
    expect((await HeuristicsService.evaluateToday())?.id).not.toBe('H5');
  });
});

describe('silêncio', () => {
  it('nao inventa alerta quando nenhuma heuristica se aplica', async () => {
    // Um unico dia ativo, com revisao e sem meta: poucos dados para H1 e H4,
    // duracao zerada para H2, sem intervalo para H3, e consistencia zero
    // derruba a H5.
    cenario({
      days: [dia({ reviewed: true })],
      daily: [metricas({ reviews: 1, learns: 1 })],
    });
    expect(await HeuristicsService.evaluateToday()).toBeNull();
  });
});
