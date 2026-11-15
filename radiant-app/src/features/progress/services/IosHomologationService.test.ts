import AsyncStorage from '@react-native-async-storage/async-storage';
import { STORAGE_KEYS } from '../../../constants/storageKeys';
import { IosHomologationService } from './IosHomologationService';

jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock'));

// Os outros passos têm testes próprios; aqui só importa que o reset alcance a chave nova da F6.
jest.mock('../../journey/services/JourneyProgressService', () => ({ JourneyProgressService: { reset: async () => undefined } }));
jest.mock('../../spaced-repetition/services/SpacedRepetitionService', () => ({ SpacedRepetitionService: { reset: async () => undefined } }));
jest.mock('../../daily-goal/services/DailyGoalService', () => ({ DailyGoalService: { reset: async () => undefined } }));
jest.mock('../../gamification/services/GamificationService', () => ({ GamificationService: { reset: async () => undefined } }));
jest.mock('../../sync/SyncQueueService', () => ({ SyncQueueService: { reset: async () => undefined } }));
jest.mock('../../auth/AuthService', () => ({ AuthService: { resetLocalSession: async () => undefined } }));
jest.mock('../../beta/BetaService', () => ({ BetaService: { resetAccess: async () => undefined } }));
jest.mock('../../telemetry/TelemetryService', () => ({ TelemetryService: { clear: async () => undefined } }));
jest.mock('../../telemetry/heuristics/HeuristicsService', () => ({ HeuristicsService: { clear: async () => undefined } }));
jest.mock('../../health/HealthScoreService', () => ({ HealthScoreService: { clear: async () => undefined } }));
jest.mock('../../onboarding/OnboardingService', () => ({ OnboardingService: { reset: async () => undefined } }));

it('o reset local apaga as decorações gravadas (F6)', async () => {
  await AsyncStorage.setItem(STORAGE_KEYS.DECORATIONS, JSON.stringify({ schemaVersion: 1, unlocked: ['moldura-aurora'], equipped: {} }));
  await IosHomologationService.resetLocalState();
  expect(await AsyncStorage.getItem(STORAGE_KEYS.DECORATIONS)).toBeNull();
});
