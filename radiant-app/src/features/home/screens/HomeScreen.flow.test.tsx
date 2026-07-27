/* eslint-disable @typescript-eslint/no-require-imports, react-hooks/exhaustive-deps */
import React from 'react';
import { fireEvent, screen } from '@testing-library/react-native';
import { router } from 'expo-router';
import HomeScreen from './HomeScreen';
import { renderWithProviders } from '../../../test/renderWithProviders';
import { localHomeDashboardService } from '../services/createLocalHomeDashboardService';

// A rota da aba entrega a JourneyHomeScreen quando ENABLE_LEARNING_ROAD está
// ligada (ADR 2026-07-27), então esta tela só é alcançável com a flag desligada.
// Fixar o valor aqui descreve essa configuração e impede que o teste herde o
// default do ambiente: com a flag ligada, a tela renderiza o título da missão
// no hero e no card da jornada, e a consulta por texto fica ambígua.
jest.mock('../../../config', () => ({
  AppConfig: { ENABLE_LEARNING_ROAD: false, IS_BETA: true },
}));

// O primeiro render do arquivo paga o custo único de transformar os módulos do
// react-native carregados sob demanda; sob `--no-cache` e `--runInBand` isso
// passa de 1s e estoura o timeout padrão do findByText. Os mocks já são
// determinísticos, então a folga é ambiental, não uma espera por dado.
const FIRST_RENDER_TIMEOUT_MS = 4000;

jest.mock('expo-router', () => ({ router: { push: jest.fn() }, useFocusEffect: (callback: () => void) => { const React = require('react'); React.useEffect(() => { callback(); }, []); } }));
jest.mock('../../../components/ui/AppButton', () => ({ AppButton: ({ label, children, onPress, disabled }: any) => { const { Pressable, Text } = require('react-native'); return <Pressable accessibilityRole="button" accessibilityLabel={label} disabled={disabled} onPress={onPress}><Text>{label ?? children}</Text></Pressable>; } }));
jest.mock('../../../components/ui/StatPill', () => ({ StatPill: ({ value }: any) => { const { Text } = require('react-native'); return <Text>{value}</Text>; } }));
jest.mock('../../../components/ui/ProgressRing', () => ({ ProgressRing: ({ children }: any) => children }));
jest.mock('../../../ui/characters/PixelIllustration', () => ({ PixelIllustration: () => null }));
jest.mock('../../../ui/motion', () => ({ useFadeInUp: () => ({ animateIn: jest.fn(), style: {} }), useCardEnter: () => ({ animateIn: jest.fn(), animatedStyle: {} }) }));
jest.mock('../services/createLocalHomeDashboardService', () => ({ localHomeDashboardService: { getDashboard: jest.fn() } }));
jest.mock('../../health/HealthScoreService', () => ({ HealthScoreService: { getScore: jest.fn().mockResolvedValue(null) } }));
jest.mock('../../telemetry/TelemetryService', () => ({ TelemetryService: { track: jest.fn(), markDayOpen: jest.fn() } }));
jest.mock('../../telemetry/heuristics/HeuristicsService', () => ({ HeuristicsService: { evaluateToday: jest.fn().mockResolvedValue(null), wasShownToday: jest.fn().mockResolvedValue(false), markShownToday: jest.fn() } }));
jest.mock('../../onboarding/OnboardingService', () => ({ OnboardingService: { init: jest.fn().mockResolvedValue(undefined), getStage: jest.fn().mockReturnValue('graduated'), shouldShowIntro: jest.fn().mockReturnValue(false), shouldShowClosure: jest.fn().mockReturnValue(false) } }));
jest.mock('../../push/services/PushService', () => ({ PushService: { scheduleDailyIfEligible: jest.fn(), onAppOpen: jest.fn(), getOptIn: jest.fn() } }));
jest.mock('../../push/components/PushOptInCard', () => ({ PushOptInCard: () => null }));

describe('HomeScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (localHomeDashboardService.getDashboard as jest.Mock).mockResolvedValue({
      greeting: 'Olá', avatarInitials: null, dateLabel: 'quarta-feira, 23 de julho', streakDays: 2, totalXp: 80,
      hearts: { current: 4, maximum: 5 }, dailyGoal: { completed: 1, target: 3 }, dueReviewCount: 0,
      masteredCases: null, accuracyPercent: null,
      mission: { title: 'Fundamentos de radiologia', caseCount: null, durationMinutes: null, xpReward: null, action: { kind: 'learn', lessonId: 'lesson-1', nodeId: 'node-1', blockId: 'block-1' } },
    });
  });

  it('renders truthful dashboard data and routes the mission action', async () => {
    renderWithProviders(<HomeScreen />);
    expect(
      await screen.findByText('Fundamentos de radiologia', {}, { timeout: FIRST_RENDER_TIMEOUT_MS }),
    ).toBeTruthy();
    expect(screen.getAllByText('—')).toHaveLength(3);
    fireEvent.press(screen.getByRole('button', { name: 'Iniciar atividade' }));
    expect(router.push).toHaveBeenCalledWith({ pathname: '/learn', params: { nodeId: 'node-1', blockId: 'block-1' } });
  });
});
