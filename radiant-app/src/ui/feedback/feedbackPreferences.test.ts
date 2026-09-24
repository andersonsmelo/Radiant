import { DEFAULT_FEEDBACK_PREFERENCES, readFeedbackPreferences, writeFeedbackPreferences } from './feedbackPreferences';

jest.mock('@react-native-async-storage/async-storage', () => require('@react-native-async-storage/async-storage/jest/async-storage-mock'));

function memoryStorage(initial: Record<string, string> = {}) {
  const data = { ...initial };
  return {
    data,
    getItem: jest.fn(async (key: string) => data[key] ?? null),
    setItem: jest.fn(async (key: string, value: string) => { data[key] = value; }),
  };
}

describe('preferências de som e vibração', () => {
  it('começam ligadas', async () => {
    expect(await readFeedbackPreferences(memoryStorage())).toEqual(DEFAULT_FEEDBACK_PREFERENCES);
    expect(DEFAULT_FEEDBACK_PREFERENCES).toEqual({ sounds: true, haptics: true });
  });

  it('guardam e devolvem a escolha', async () => {
    const storage = memoryStorage();
    await writeFeedbackPreferences({ sounds: false, haptics: true }, storage);
    expect(await readFeedbackPreferences(storage)).toEqual({ sounds: false, haptics: true });
  });

  it('valor corrompido volta ao padrão em vez de desligar tudo', async () => {
    expect(await readFeedbackPreferences(memoryStorage({ '@radiant:feedback_preferences_v1': '{quebrado' }))).toEqual(DEFAULT_FEEDBACK_PREFERENCES);
  });
});
