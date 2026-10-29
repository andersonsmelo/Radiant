import AsyncStorage from '@react-native-async-storage/async-storage';
import { DAILY_GOAL_STORAGE_KEY } from '../../../constants/dailyGoal';
import { DailyGoalService } from './DailyGoalService';

jest.mock('@react-native-async-storage/async-storage', () => ({
  __esModule: true,
  default: {
    getItem: jest.fn(),
    setItem: jest.fn(),
    removeItem: jest.fn(),
  },
}));

const mockedStorage = AsyncStorage as jest.Mocked<typeof AsyncStorage>;

describe('DailyGoalService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('persiste o reset quando a leitura encontra o progresso de um dia anterior', async () => {
    mockedStorage.getItem.mockResolvedValue(JSON.stringify({
      dateKey: '2026-08-12',
      completedToday: 20,
      goalPerDay: 20,
      tierId: 'rhythm',
    }));

    const snapshot = await DailyGoalService.getSnapshot(new Date('2026-08-13T09:00:00'));

    expect(snapshot).toMatchObject({
      dateKey: '2026-08-13',
      earnedXpToday: 0,
      goalXp: 20,
      tierId: 'rhythm',
      isCompleted: false,
    });
    expect(mockedStorage.setItem).toHaveBeenCalledWith(
      DAILY_GOAL_STORAGE_KEY,
      expect.stringContaining('"dateKey":"2026-08-13"'),
    );
  });

  describe('schema desconhecido (G7)', () => {
    // Gravado por uma versão mais nova do app, que passou a versionar a meta.
    // Esta versão nunca gravou `schemaVersion`, então não conhece nenhuma: usa
    // os campos que entende, em memória, e não regrava o que não entende.
    const futuro = (dateKey: string) => JSON.stringify({
      schemaVersion: 2,
      dateKey,
      completedToday: 5,
      goalPerDay: 20,
      tierId: 'rhythm',
      campoNovo: true,
    });

    it('getSnapshot na virada do dia não grava por cima', async () => {
      mockedStorage.getItem.mockResolvedValue(futuro('2026-08-12'));

      const snapshot = await DailyGoalService.getSnapshot(new Date('2026-08-13T09:00:00'));

      expect(snapshot).toMatchObject({ dateKey: '2026-08-13', earnedXpToday: 0, goalXp: 20 });
      expect(mockedStorage.setItem).not.toHaveBeenCalled();
    });

    it('recordXp soma em memória e não grava por cima', async () => {
      mockedStorage.getItem.mockResolvedValue(futuro('2026-08-13'));

      const snapshot = await DailyGoalService.recordXp(10, new Date('2026-08-13T09:00:00'));

      expect(snapshot).toMatchObject({ earnedXpToday: 15, goalXp: 20 });
      expect(mockedStorage.setItem).not.toHaveBeenCalled();
    });
  });
});

function barrier<T>() {
  let resolve!: (value: T) => void; let reject!: (cause: Error) => void;
  const promise = new Promise<T>((yes, no) => { resolve = yes; reject = no; });
  return { promise, resolve, reject };
}

describe('DailyGoalService — ordenação entre consumidores', () => {
  let raw: string | null;
  const now = new Date(2026, 9, 29, 12);
  beforeEach(() => {
    raw = JSON.stringify({ dateKey: '2026-10-29', completedToday: 7, goalPerDay: 10, tierId: 'start' });
    mockedStorage.getItem.mockReset().mockImplementation(async () => raw);
    mockedStorage.setItem.mockReset().mockImplementation(async (_key, value) => { raw = value; });
    mockedStorage.removeItem.mockReset().mockImplementation(async () => { raw = null; });
  });

  it('leitor novo espera setTier pendente e recebe a escolha persistida', async () => {
    const entered = barrier<void>(); const gate = barrier<void>();
    mockedStorage.setItem.mockImplementationOnce(async (_key, value) => { entered.resolve(); await gate.promise; raw = value; });
    const save = DailyGoalService.setTier('focus', now); await entered.promise;
    let settled = false; const read = DailyGoalService.getSnapshot(now).then(value => { settled = true; return value; });
    try {
      await Promise.resolve(); await Promise.resolve(); await Promise.resolve();
      expect(settled).toBe(false);
      gate.resolve(); await save;
      expect(await read).toMatchObject({ tierId: 'focus', goalXp: 35, earnedXpToday: 7 });
    } finally { gate.resolve(); await save; await read; }
  });

  it('recordXp depois de setTier preserva ambos os efeitos na ordem, sem mudar o cap', async () => {
    const entered = barrier<void>(); const gate = barrier<void>();
    mockedStorage.setItem.mockImplementationOnce(async (_key, value) => { entered.resolve(); await gate.promise; raw = value; });
    const save = DailyGoalService.setTier('focus', now); await entered.promise;
    const award = DailyGoalService.recordXp(5, now);
    try {
      await Promise.resolve(); await Promise.resolve(); gate.resolve();
      await save; await award;
      expect(await DailyGoalService.getSnapshot(now)).toMatchObject({ tierId: 'focus', goalXp: 35, earnedXpToday: 12 });
      expect((await DailyGoalService.recordXp(100, now)).earnedXpToday).toBe(35);
    } finally { gate.resolve(); await save; await award; }
  });

  it('reset depois de save pendente não ressuscita o registro apagado', async () => {
    const entered = barrier<void>(); const gate = barrier<void>();
    mockedStorage.setItem.mockImplementationOnce(async (_key, value) => { entered.resolve(); await gate.promise; raw = value; });
    const save = DailyGoalService.setTier('focus', now); await entered.promise;
    const reset = DailyGoalService.reset();
    try { await Promise.resolve(); gate.resolve(); await save; await reset;
      expect(await DailyGoalService.getSnapshot(now)).toMatchObject({ tierId: 'start', goalXp: 10, earnedXpToday: 0 });
    } finally { gate.resolve(); await save; await reset; }
  });

  it('rejeita o save publicamente, recupera a fila e permite leitura e próxima escrita', async () => {
    const error = jest.spyOn(console, 'error').mockImplementation(() => undefined);
    mockedStorage.setItem.mockRejectedValueOnce(new Error('disk'));
    try {
      await expect(DailyGoalService.setTier('focus', now)).rejects.toThrow('disk');
      await expect(DailyGoalService.getSnapshot(now)).resolves.toMatchObject({ tierId: 'start', goalXp: 10 });
      expect(await DailyGoalService.setTier('challenge', now)).toMatchObject({ tierId: 'challenge', goalXp: 50 });
    } finally { error.mockRestore(); }
  });

  it('rollover entra depois de setTier e mantém seu tier', async () => {
    const entered = barrier<void>(); const gate = barrier<void>();
    mockedStorage.setItem.mockImplementationOnce(async (_key, value) => { entered.resolve(); await gate.promise; raw = value; });
    const save = DailyGoalService.setTier('focus', now); await entered.promise;
    const read = DailyGoalService.getSnapshot(new Date(2026, 9, 30, 0, 1));
    try { gate.resolve(); await save;
      expect(await read).toMatchObject({ tierId: 'focus', goalXp: 35, earnedXpToday: 0, dateKey: '2026-10-30' });
    } finally { gate.resolve(); await save; await read; }
  });

  it('Date default fica no instante da chamada, mesmo atravessando a meia-noite na fila', async () => {
    jest.useFakeTimers({ now: new Date(2026, 9, 29, 23, 59), doNotFake: ['setImmediate', 'queueMicrotask', 'nextTick'] });
    const entered = barrier<void>(); const gate = barrier<void>();
    mockedStorage.setItem.mockImplementationOnce(async (_key, value) => { entered.resolve(); await gate.promise; raw = value; });
    const save = DailyGoalService.setTier('focus'); await entered.promise;
    const read = DailyGoalService.getSnapshot();
    try { jest.setSystemTime(new Date(2026, 9, 30, 0, 1)); gate.resolve(); await save;
      expect(await read).toMatchObject({ dateKey: '2026-10-29', tierId: 'focus', earnedXpToday: 7 });
    } finally { gate.resolve(); await save; await read; jest.useRealTimers(); }
  });

  it.each(['read', 'award', 'tier'] as const)('captura Date recebido na entrada de %s antes da espera, sem mudar o dia pelo objeto mutável do chamador', async kind => {
    const entered = barrier<void>(); const gate = barrier<void>();
    mockedStorage.setItem.mockImplementationOnce(async (_key, value) => { entered.resolve(); await gate.promise; raw = value; });
    const save = DailyGoalService.setTier('focus', now); await entered.promise;
    const atCall = new Date(2026, 9, 29, 12);
    const following = kind === 'read' ? DailyGoalService.getSnapshot(atCall) : kind === 'award' ? DailyGoalService.recordXp(5, atCall) : DailyGoalService.setTier('challenge', atCall);
    try { atCall.setDate(30); gate.resolve(); await save;
      expect(await following).toMatchObject({ dateKey: '2026-10-29', earnedXpToday: kind === 'award' ? 12 : 7, goalXp: kind === 'tier' ? 50 : 35 });
    } finally { gate.resolve(); await save; await following; }
  });

  it('alias recordQuizCompletion termina sem reenfileirar a própria espera', async () => {
    expect(await DailyGoalService.recordQuizCompletion(now)).toMatchObject({ tierId: 'start', earnedXpToday: 10, goalXp: 10 });
  });
});
