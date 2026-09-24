import AsyncStorage from '@react-native-async-storage/async-storage';
import { STORAGE_KEYS } from '../../constants/storageKeys';

export type FeedbackPreferences = Readonly<{ sounds: boolean; haptics: boolean }>;

export const DEFAULT_FEEDBACK_PREFERENCES: FeedbackPreferences = { sounds: true, haptics: true };

type PreferencesStorage = Readonly<{
  getItem(key: string): Promise<string | null>;
  setItem(key: string, value: string): Promise<void>;
}>;

export async function readFeedbackPreferences(storage: PreferencesStorage = AsyncStorage): Promise<FeedbackPreferences> {
  try {
    const raw = await storage.getItem(STORAGE_KEYS.FEEDBACK_PREFERENCES);
    if (!raw) return DEFAULT_FEEDBACK_PREFERENCES;
    const value = JSON.parse(raw) as Partial<FeedbackPreferences> | null;
    return { sounds: value?.sounds !== false, haptics: value?.haptics !== false };
  } catch {
    return DEFAULT_FEEDBACK_PREFERENCES;
  }
}

export async function writeFeedbackPreferences(next: FeedbackPreferences, storage: PreferencesStorage = AsyncStorage): Promise<void> {
  await storage.setItem(STORAGE_KEYS.FEEDBACK_PREFERENCES, JSON.stringify(next));
}
