import React from 'react';
import { act, fireEvent, render, screen, waitFor } from '@testing-library/react-native';
import { ScrollView } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import RewardScreen, { canCollectReward } from './RewardScreen';
import type { JourneyNode } from '../../../types/journey';
import { renderWithProviders } from '../../../test/renderWithProviders';
import { JourneyProgressService } from '../../journey/services/JourneyProgressService';
import { PaywallService } from '../../paywall/PaywallService';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';
import { RatingPromptService } from '../../../services/RatingPromptService';
import { AppButton } from '../../../components/ui/AppButton';
import { medalColors } from '../../../ui/theme';
import { STORAGE_KEYS } from '../../../constants/storageKeys';
import { JourneyMedal } from '../../journey/components/JourneyMedal';
import { GamificationService } from '../../gamification/services/GamificationService';
import { AnimatedCounter } from '../../../components/ui/AnimatedCounter';

jest.mock('@react-native-async-storage/async-storage', () => ({
  __esModule: true,
  default: {
    getItem: jest.fn(),
    setItem: jest.fn(),
    removeItem: jest.fn(),
  },
}));

jest.mock('expo-router', () => ({
  router: {
    replace: jest.fn(),
    dismissTo: jest.fn(),
    push: jest.fn(),
    back: jest.fn(),
  },
}));

jest.mock('@expo/vector-icons/MaterialIcons', () => 'MaterialIcons');
jest.mock('../../student-checkpoints/useShadowCheckpoint', () => ({
  STUDENT_CHECKPOINT_SHADOW_CONTENT_VERSION: 'test-version', useShadowCheckpoint: jest.fn(),
}));

jest.mock('../../../components/ui/AppButton', () => {
  const React = require('react');
  const { Pressable, Text } = require('react-native');

  return {
    AppButton: ({ children, onPress, disabled, ...props }: { children: React.ReactNode; onPress: () => void; disabled?: boolean; testID?: string; accessibilityLabel?: string }) => (
      <Pressable {...props} accessibilityRole="button" onPress={onPress} disabled={disabled}>
        <Text>{children}</Text>
      </Pressable>
    ),
  };
});

jest.mock('../../../components/ui/PixelHeroSplit', () => {
  const React = require('react');
  const { Text, View } = require('react-native');

  // Observa apenas a montagem dos hosts fornecidos pelo caller. Não rasteriza
  // fonte nem simula a medida/recorte nativo de SpeechBubble.
  return {
    PixelHeroSplit: ({ eyebrow, message }: { eyebrow: string; message?: string }) => (
      <View testID="reward-pixel-host">
        <Text>{eyebrow}</Text>
        <Text>{message}</Text>
      </View>
    ),
  };
});

jest.mock('../../../components/ui/StatItem', () => {
  const React = require('react');
  const { View } = require('react-native');

  return {
    StatItem: () => <View />,
  };
});

jest.mock('../../../components/ui/SurfaceCard', () => {
  const React = require('react');
  const { View } = require('react-native');

  return {
    SurfaceCard: ({ children }: { children: React.ReactNode }) => <View>{children}</View>,
  };
});

jest.mock('../../journey/services/JourneyProgressService', () => ({
  JourneyProgressService: {
    bootstrap: jest.fn(),
    getSnapshotForNode: jest.fn(),
    setCurrentNode: jest.fn(),
    markNodeCompleted: jest.fn(),
  },
}));

jest.mock('../../../services/RatingPromptService', () => ({
  RatingPromptService: {
    maybePromptForReview: jest.fn().mockResolvedValue(false),
  },
}));

jest.mock('../../paywall/PaywallService', () => ({
  PaywallService: {
    maybePresentOffer: jest.fn().mockResolvedValue(null),
    recordOutcome: jest.fn().mockResolvedValue(undefined),
  },
}));

jest.mock('../../paywall/UpgradeInterestService', () => ({
  UpgradeInterestService: {
    captureInterest: jest.fn().mockResolvedValue({
      id: 'interest-1',
      email: 'user@example.com',
    }),
  },
}));

jest.mock('../../paywall/components/PaywallOfferCard', () => {
  const React = require('react');
  const { View } = require('react-native');

  return {
    PaywallOfferCard: () => <View />,
  };
});

const mockedJourneyProgressService = JourneyProgressService as jest.Mocked<typeof JourneyProgressService>;

const availableSnapshot = {
  track: {
    units: [
      {
        id: 'unit-1',
        title: 'Unidade 1',
        nodes: [
          { id: 'lesson-1', type: 'lesson', status: 'completed', unitId: 'unit-1' },
          {
            id: 'reward-1',
            type: 'reward',
            status: 'available',
            title: 'Conquista do módulo',
            description: 'Recompensa pronta para coleta.',
            unitId: 'unit-1',
          },
        ],
      },
    ],
  },
  nextRecommendedNode: null,
} as any;

const completedSnapshot = {
  track: {
    units: [
      {
        id: 'unit-1',
        title: 'Unidade 1',
        nodes: [
          { id: 'lesson-1', type: 'lesson', status: 'completed', unitId: 'unit-1' },
          {
            id: 'reward-1',
            type: 'reward',
            status: 'completed',
            title: 'Conquista do módulo',
            description: 'Recompensa registrada.',
            unitId: 'unit-1',
          },
        ],
      },
    ],
  },
  nextRecommendedNode: null,
} as any;

// Cobre a contagem de marcos primários da unidade (completedPrimaryNodes /
// totalPrimaryNodes) que RewardScreen.tsx exibe na sectionCard: mistura
// lesson/checkpoint completos e disponíveis com um nó de review completo,
// que precisa ficar de fora tanto do total quanto do concluído.
const snapshotWithUnitProgress = {
  track: {
    units: [
      {
        id: 'unit-1',
        title: 'Unidade 1',
        nodes: [
          { id: 'lesson-1', type: 'lesson', status: 'completed', unitId: 'unit-1' },
          { id: 'lesson-2', type: 'lesson', status: 'available', unitId: 'unit-1' },
          { id: 'checkpoint-1', type: 'checkpoint', status: 'completed', unitId: 'unit-1' },
          { id: 'review-1', type: 'review', status: 'completed', unitId: 'unit-1' },
          {
            id: 'reward-1',
            type: 'reward',
            status: 'available',
            title: 'Conquista do módulo',
            description: 'Recompensa pronta para coleta.',
            unitId: 'unit-1',
          },
        ],
      },
    ],
  },
  nextRecommendedNode: null,
} as any;

const lockedSnapshot = {
  track: {
    units: [
      {
        id: 'unit-1',
        title: 'Unidade 1',
        nodes: [
          { id: 'lesson-1', type: 'lesson', status: 'available', unitId: 'unit-1' },
          {
            id: 'reward-1',
            type: 'reward',
            status: 'locked',
            title: 'Conquista do módulo',
            description: 'Recompensa ainda bloqueada.',
            unitId: 'unit-1',
          },
        ],
      },
    ],
  },
  nextRecommendedNode: null,
} as any;

const fontTestMetrics = {
  frame: { x: 0, y: 0, width: 402, height: 874 },
  insets: { top: 0, left: 0, right: 0, bottom: 0 },
};

function renderRewardForLiveFont() {
  return render(<RewardScreen nodeId="reward-1" />, {
    // O wrapper é mantido pelo rerender, preservando a montagem da tela.
    wrapper: ({ children }: { children: React.ReactNode }) => (
      <SafeAreaProvider initialMetrics={fontTestMetrics}>{children}</SafeAreaProvider>
    ),
  });
}

describe('RewardScreen flow', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockedJourneyProgressService.bootstrap.mockResolvedValue(availableSnapshot);
    mockedJourneyProgressService.getSnapshotForNode.mockResolvedValue(availableSnapshot);
    mockedJourneyProgressService.setCurrentNode.mockResolvedValue(availableSnapshot);
    mockedJourneyProgressService.markNodeCompleted.mockResolvedValue(completedSnapshot);
  });

  // A remoção da renovação de qualquer parágrafo/linha deve apontar o host
  // retido, sem confundir isto com prova rasterizada de legibilidade nativa.
  describe('FIX3 textos locais fora do hero', () => {
    it.each([
      ['available', 1, 3.1], ['available', 3.1, 2.5], ['available', 3.1, 1],
      ['locked', 1, 3.1], ['locked', 3.1, 2.5], ['locked', 3.1, 1],
      ['completed', 1, 3.1], ['completed', 3.1, 2.5], ['completed', 3.1, 1],
    ] as const)('renova cada Text em %s, %s → %s, mantendo controles e dados', async (status, from, to) => {
      const window = { width: 402, height: 874, scale: 3, fontScale: from as number };
      const dimensions = jest.spyOn(require('react-native'), 'useWindowDimensions').mockReturnValue(window);
      const gamification = jest.spyOn(GamificationService, 'getSnapshot').mockResolvedValue({ totalXp: 54, streakDays: 3, lastActiveDate: null });
      const snapshot = status === 'available' ? availableSnapshot : status === 'locked' ? lockedSnapshot : completedSnapshot;
      mockedJourneyProgressService.getSnapshotForNode.mockResolvedValue(snapshot);
      try {
        const view = renderRewardForLiveFont();
        const actionTitle = status === 'available' ? 'Pronto para coletar essa conquista?'
          : status === 'locked' ? 'Esta conquista ainda não abriu' : 'Conquista registrada';
        await screen.findByText(actionTitle);
        const texts = [
          'Conquista', 'Unidade ativa', 'Unidade 1', 'Conquista do módulo',
          status === 'available' ? 'Recompensa pronta para coleta.' : status === 'locked' ? 'Recompensa ainda bloqueada.' : 'Recompensa registrada.',
          'Status', status === 'available' ? 'Pronta para ser coletada' : status === 'locked' ? 'Bloqueada até a unidade fechar' : 'Salva no seu progresso',
          'Progresso', status === 'completed' ? '2 de 2 marcos da unidade concluídos' : status === 'locked' ? '0 de 2 marcos da unidade concluídos' : '1 de 2 marcos da unidade concluídos',
          'Revisão', 'Nenhuma revisão crítica bloqueando a trilha', actionTitle,
          status === 'available' ? 'Coletar marca esta etapa como concluída e libera a próxima parte da trilha.'
            : status === 'locked' ? 'Ela abre quando os marcos da unidade forem concluídos. O progresso acima mostra quanto falta.'
              : 'Seu progresso está salvo e o próximo passo já está esperando por você.',
          ...(status === 'completed' ? ['XP TOTAL', 'Sequência de 3 dias mantida', 'Volte amanhã para continuar'] : []),
        ];
        const hosts = texts.map(text => screen.getByText(text));
        const buttons = view.UNSAFE_getAllByType(AppButton);
        const scroll = view.UNSAFE_getByType(ScrollView);
        const medal = view.UNSAFE_getByType(JourneyMedal);
        const close = screen.getByLabelText('Voltar');
        const counter = status === 'completed' ? view.UNSAFE_getByType(AnimatedCounter) : null;
        window.fontScale = to;
        view.rerender(<RewardScreen nodeId="reward-1" />);
        expect(texts.filter((text, index) => screen.getByText(text) === hosts[index])).toEqual([]);
        expect(view.UNSAFE_getByType(ScrollView) === scroll).toBe(true);
        expect(view.UNSAFE_getByType(JourneyMedal) === medal).toBe(true);
        expect(screen.getByLabelText('Voltar') === close).toBe(true);
        expect(view.UNSAFE_getAllByType(AppButton).every((button, index) => button === buttons[index])).toBe(true);
        if (counter) {
          expect(view.UNSAFE_getByType(AnimatedCounter) === counter).toBe(true);
          expect(screen.getByLabelText('XP total acumulado: 54').props.value).toBe('54 XP');
        }
        const renewed = texts.map(text => screen.getByText(text));
        view.rerender(<RewardScreen nodeId="reward-1" />);
        expect(texts.every((text, index) => screen.getByText(text) === renewed[index])).toBe(true);
        expect(mockedJourneyProgressService.getSnapshotForNode).toHaveBeenCalledTimes(1);
        expect(mockedJourneyProgressService.setCurrentNode).toHaveBeenCalledTimes(status === 'available' ? 1 : 0);
        expect(gamification).toHaveBeenCalledTimes(1);
        expect(mockedJourneyProgressService.markNodeCompleted).not.toHaveBeenCalled();
        expect(RatingPromptService.maybePromptForReview).not.toHaveBeenCalled();
      } finally {
        dimensions.mockRestore();
        gamification.mockRestore();
      }
    });

    it.each(['leitura', 'coleta'] as const)('renova erro de %s ao vivo sem repetir pedido nem remontar botões', async (kind) => {
      const window = { width: 402, height: 874, scale: 3, fontScale: 1 };
      const dimensions = jest.spyOn(require('react-native'), 'useWindowDimensions').mockReturnValue(window);
      const log = jest.spyOn(console, 'error').mockImplementation(() => {});
      if (kind === 'leitura') mockedJourneyProgressService.getSnapshotForNode.mockRejectedValue(new Error('offline'));
      else mockedJourneyProgressService.markNodeCompleted.mockRejectedValueOnce(new Error('offline'));
      try {
        const view = renderRewardForLiveFont();
        if (kind === 'coleta') fireEvent.press(await screen.findByText('Receber conquista'));
        const text = kind === 'leitura' ? 'Nao foi possivel carregar a conquista.' : 'Nao foi possivel registrar a conquista agora.';
        await screen.findByText(text);
        const buttons = view.UNSAFE_getAllByType(AppButton);
        for (const fontScale of [3.1, 2.5, 1]) {
          const host = screen.getByText(text);
          window.fontScale = fontScale;
          view.rerender(<RewardScreen nodeId="reward-1" />);
          expect(screen.getByText(text) === host).toBe(false);
          expect(view.UNSAFE_getAllByType(AppButton).every((button, index) => button === buttons[index])).toBe(true);
        }
        expect(mockedJourneyProgressService.getSnapshotForNode).toHaveBeenCalledTimes(1);
        expect(mockedJourneyProgressService.markNodeCompleted).toHaveBeenCalledTimes(kind === 'coleta' ? 1 : 0);
        expect(RatingPromptService.maybePromptForReview).not.toHaveBeenCalled();
        expect(router.dismissTo).not.toHaveBeenCalled();
      } finally {
        dimensions.mockRestore();
        log.mockRestore();
      }
    });
  });

  it.each([[1, 3.1], [3.1, 2.5], [3.1, 1]])('FIX2 renova fala e eyebrow em %s → %s sem remontar estado ou saídas', async (from, to) => {
    const window = { width: 402, height: 874, scale: 3, fontScale: from };
    const dimensions = jest.spyOn(require('react-native'), 'useWindowDimensions').mockReturnValue(window);
    mockedJourneyProgressService.getSnapshotForNode.mockResolvedValue(lockedSnapshot);
    try {
      const view = renderRewardForLiveFont();
      await screen.findByText('Esta conquista ainda não abriu');
      const host = screen.getByTestId('reward-pixel-host');
      const eyebrow = screen.getByText('Jornada de Radiologia');
      const message = screen.getByText('Você chegou até aqui. Recolha sua conquista antes de seguir.');
      const scroll = view.UNSAFE_getByType(ScrollView);
      const medal = view.UNSAFE_getByType(JourneyMedal);
      const close = screen.getByLabelText('Voltar');
      const exit = screen.getByText('Voltar para jornada');
      window.fontScale = to;
      view.rerender(<RewardScreen nodeId="reward-1" />);
      expect([
        screen.getByTestId('reward-pixel-host') === host ? 'host' : null,
        screen.getByText('Jornada de Radiologia') === eyebrow ? 'eyebrow' : null,
        screen.getByText('Você chegou até aqui. Recolha sua conquista antes de seguir.') === message ? 'fala' : null,
      ].filter(Boolean)).toEqual([]);
      expect(view.UNSAFE_getByType(ScrollView) === scroll).toBe(true);
      expect(view.UNSAFE_getByType(JourneyMedal) === medal).toBe(true);
      expect(screen.getByLabelText('Voltar') === close).toBe(true);
      expect(screen.getByText('Voltar para jornada') === exit).toBe(true);
      expect(mockedJourneyProgressService.getSnapshotForNode).toHaveBeenCalledTimes(1);
      expect(mockedJourneyProgressService.setCurrentNode).not.toHaveBeenCalled();
      expect(mockedJourneyProgressService.markNodeCompleted).not.toHaveBeenCalled();
      expect(RatingPromptService.maybePromptForReview).not.toHaveBeenCalled();
      const sameScaleHost = screen.getByTestId('reward-pixel-host');
      view.rerender(<RewardScreen nodeId="reward-1" />);
      expect(screen.getByTestId('reward-pixel-host') === sameScaleHost).toBe(true);
      fireEvent.press(screen.getByText('Voltar para jornada'));
      expect(router.dismissTo).toHaveBeenCalledWith('/(tabs)');
    } finally {
      dimensions.mockRestore();
    }
  });

  it('FIX2 mantém coleta em andamento e confirmação ao mudar fonte, sem repetir ganho ou avaliação', async () => {
    const window = { width: 402, height: 874, scale: 3, fontScale: 1 };
    const dimensions = jest.spyOn(require('react-native'), 'useWindowDimensions').mockReturnValue(window);
    let confirm!: (snapshot: any) => void;
    mockedJourneyProgressService.markNodeCompleted.mockReturnValue(new Promise(resolve => { confirm = resolve; }));
    try {
      const view = renderRewardForLiveFont();
      await screen.findByText('Receber conquista');
      const scroll = view.UNSAFE_getByType(ScrollView);
      const medal = view.UNSAFE_getByType(JourneyMedal);
      const collection = view.UNSAFE_getAllByType(AppButton).find(button => button.props.children === 'Receber conquista')!;
      const captured = collection.props.onPress;
      fireEvent.press(screen.getByText('Receber conquista'));
      await screen.findByText('Registrando conquista...');
      const host = screen.getByTestId('reward-pixel-host');
      window.fontScale = 3.1;
      view.rerender(<RewardScreen nodeId="reward-1" />);
      expect(screen.getByTestId('reward-pixel-host') === host).toBe(false);
      expect(view.UNSAFE_getByType(ScrollView) === scroll).toBe(true);
      expect(view.UNSAFE_getByType(JourneyMedal) === medal).toBe(true);
      expect(view.UNSAFE_getAllByType(AppButton).includes(collection)).toBe(true);
      expect(collection.props.disabled).toBe(true);
      act(() => { captured(); });
      expect(mockedJourneyProgressService.markNodeCompleted).toHaveBeenCalledTimes(1);
      await act(async () => { confirm(completedSnapshot); });
      await screen.findByText('Conquista registrada');
      const confirmedHost = screen.getByTestId('reward-pixel-host');
      const next = screen.getByText('Continuar');
      window.fontScale = 1;
      view.rerender(<RewardScreen nodeId="reward-1" />);
      expect(screen.getByTestId('reward-pixel-host') === confirmedHost).toBe(false);
      expect(screen.getByText('Continuar') === next).toBe(true);
      expect(screen.getByText('Conquista registrada')).toBeTruthy();
      expect(view.UNSAFE_getByType(ScrollView) === scroll).toBe(true);
      expect(view.UNSAFE_getByType(JourneyMedal) === medal).toBe(true);
      act(() => { captured(); });
      expect(mockedJourneyProgressService.getSnapshotForNode).toHaveBeenCalledTimes(1);
      expect(mockedJourneyProgressService.setCurrentNode).toHaveBeenCalledTimes(1);
      expect(mockedJourneyProgressService.markNodeCompleted).toHaveBeenCalledTimes(1);
      expect(RatingPromptService.maybePromptForReview).toHaveBeenCalledTimes(1);
      fireEvent.press(screen.getByText('Continuar'));
      expect(router.dismissTo).toHaveBeenCalledWith('/(tabs)');
    } finally {
      dimensions.mockRestore();
    }
  });

  it('carrega a conquista da área anterior pelo destino e preserva o contexto da coleta', async () => {
    mockedJourneyProgressService.bootstrap.mockResolvedValue({ ...availableSnapshot, track: { units: [{ id: 'other-unit', title: 'Outra área', nodes: [] }] } } as any);
    mockedJourneyProgressService.getSnapshotForNode.mockResolvedValue(availableSnapshot);
    renderWithProviders(<RewardScreen nodeId="reward-1" />);
    await waitFor(() => expect(mockedJourneyProgressService.getSnapshotForNode).toHaveBeenCalledWith('reward-1'));
    await waitFor(() => expect(mockedJourneyProgressService.setCurrentNode).toHaveBeenCalledWith('reward-1', availableSnapshot.track));
    fireEvent.press(await screen.findByText('Receber conquista'));
    await waitFor(() => expect(mockedJourneyProgressService.markNodeCompleted).toHaveBeenCalledWith('reward-1'));
    expect(await screen.findByText('Conquista registrada')).toBeTruthy();
  });

  it.each(['reward-inexistente', 'lesson-1'])('destino inválido %s volta automaticamente sem tela indisponível nem coleta', async (nodeId) => {
    renderWithProviders(<RewardScreen nodeId={nodeId} />);
    await waitFor(() => expect(router.dismissTo).toHaveBeenCalledWith('/(tabs)'));
    expect(screen.UNSAFE_getByType(RewardScreen).children).toEqual([]);
    expect(mockedJourneyProgressService.markNodeCompleted).not.toHaveBeenCalled();
    expect(mockedJourneyProgressService.setCurrentNode).not.toHaveBeenCalled();
    expect(RatingPromptService.maybePromptForReview).not.toHaveBeenCalled();
  });

  it('unidade ausente volta sem ativar nem coletar o nó', async () => {
    const invalid = JSON.parse(JSON.stringify(availableSnapshot));
    invalid.track.units[0].nodes[1].unitId = 'missing-unit';
    mockedJourneyProgressService.getSnapshotForNode.mockResolvedValue(invalid);
    renderWithProviders(<RewardScreen nodeId="reward-1" />);
    await waitFor(() => expect(router.dismissTo).toHaveBeenCalledWith('/(tabs)'));
    expect(screen.UNSAFE_getByType(RewardScreen).children).toEqual([]);
    expect(mockedJourneyProgressService.setCurrentNode).not.toHaveBeenCalled();
    expect(mockedJourneyProgressService.markNodeCompleted).not.toHaveBeenCalled();
  });

  it('sem ID e sem recompensa disponível volta à trilha', async () => {
    mockedJourneyProgressService.bootstrap.mockResolvedValue(lockedSnapshot);
    renderWithProviders(<RewardScreen />);
    await waitFor(() => expect(router.dismissTo).toHaveBeenCalledWith('/(tabs)'));
    expect(mockedJourneyProgressService.markNodeCompleted).not.toHaveBeenCalled();
  });

  it('leitura pendente não é ausência conhecida', async () => {
    mockedJourneyProgressService.getSnapshotForNode.mockReturnValue(new Promise(() => {}));
    renderWithProviders(<RewardScreen nodeId="reward-1" />);
    await act(async () => {});
    expect(router.dismissTo).not.toHaveBeenCalled();
    expect(screen.toJSON()).not.toBeNull();
  });

  it('erro de leitura mantém recuperação e não redireciona como inválido', async () => {
    const log = jest.spyOn(console, 'error').mockImplementation(() => {});
    mockedJourneyProgressService.getSnapshotForNode.mockRejectedValue(new Error('offline'));
    renderWithProviders(<RewardScreen nodeId="reward-1" />);
    expect(await screen.findByText('Nao foi possivel carregar a conquista.')).toBeTruthy();
    expect(router.dismissTo).not.toHaveBeenCalled();
    fireEvent.press(screen.getByText('Voltar para jornada'));
    expect(router.dismissTo).toHaveBeenCalledWith('/(tabs)');
    log.mockRestore();
  });

  it('já coletada mostra medalha ouro real e Continuar sem nova coleta ou avaliação', async () => {
    mockedJourneyProgressService.getSnapshotForNode.mockResolvedValue(completedSnapshot);
    renderWithProviders(<RewardScreen nodeId="reward-1" />);
    const medal = await screen.findByRole('image', { name: 'Conquista do módulo. Conquista registrada.' });
    expect(medal.findAll((node: { props: { fill?: string } }) => node.props.fill === medalColors.gold.face).length).toBeGreaterThan(0);
    expect(router.dismissTo).not.toHaveBeenCalled();
    fireEvent.press(screen.getByText('Continuar'));
    expect(router.dismissTo).toHaveBeenCalledWith('/(tabs)');
    expect(mockedJourneyProgressService.setCurrentNode).not.toHaveBeenCalled();
    expect(mockedJourneyProgressService.markNodeCompleted).not.toHaveBeenCalled();
    expect(RatingPromptService.maybePromptForReview).not.toHaveBeenCalled();
  });

  it('recompensa disponível apresenta a medalha ouro sem inventar estrelas', async () => {
    renderWithProviders(<RewardScreen nodeId="reward-1" />);
    const medal = await screen.findByRole('image', { name: 'Conquista do módulo. Pronta para coleta.' });
    expect(medal.findAll((node: { props: { fill?: string } }) => node.props.fill === medalColors.gold.face).length).toBeGreaterThan(0);
    expect(screen.queryByTestId('journey-medal-star-on')).toBeNull();
    expect(screen.queryByTestId('journey-medal-star-off')).toBeNull();
    expect(mockedJourneyProgressService.markNodeCompleted).not.toHaveBeenCalled();
  });

  it('erro de leitura permite tentar de novo sem conceder prêmio', async () => {
    const log = jest.spyOn(console, 'error').mockImplementation(() => {});
    mockedJourneyProgressService.getSnapshotForNode.mockRejectedValueOnce(new Error('offline'));
    renderWithProviders(<RewardScreen nodeId="reward-1" />);
    fireEvent.press(await screen.findByText('Tentar novamente'));
    expect(await screen.findByText('Receber conquista')).toBeTruthy();
    expect(router.dismissTo).not.toHaveBeenCalled();
    expect(mockedJourneyProgressService.markNodeCompleted).not.toHaveBeenCalled();
    log.mockRestore();
  });

  it('coleta via fallback sem ID mantém a recompensa confirmada na tela', async () => {
    const confirmed = {
      ...completedSnapshot,
      track: {
        ...completedSnapshot.track,
        units: completedSnapshot.track.units.map((unit: any) => ({
          ...unit,
          nodes: [...unit.nodes, { id: 'reward-2', type: 'reward', status: 'available', title: 'Outra conquista', unitId: unit.id }],
        })),
      },
    };
    mockedJourneyProgressService.markNodeCompleted.mockResolvedValue(confirmed);
    const view = renderWithProviders(<RewardScreen />);
    fireEvent.press(await screen.findByText('Receber conquista'));
    expect(await screen.findByText('Conquista registrada')).toBeTruthy();
    expect(await screen.findByRole('image', { name: 'Conquista do módulo. Conquista registrada.' })).toBeTruthy();
    expect(screen.queryByText('Outra conquista')).toBeNull();
    expect(screen.getByText('Continuar')).toBeTruthy();
    expect(router.dismissTo).not.toHaveBeenCalled();
    fireEvent.press(screen.getByText('Continuar'));
    expect(router.dismissTo).toHaveBeenCalledWith('/(tabs)');
    view.unmount();
    mockedJourneyProgressService.getSnapshotForNode.mockResolvedValue(confirmed);
    renderWithProviders(<RewardScreen nodeId="reward-1" />);
    expect(await screen.findByRole('image', { name: 'Conquista do módulo. Conquista registrada.' })).toBeTruthy();
    expect(screen.queryByText('Receber conquista')).toBeNull();
    expect(mockedJourneyProgressService.markNodeCompleted).toHaveBeenCalledTimes(1);
    expect(mockedJourneyProgressService.setCurrentNode).toHaveBeenCalledTimes(1);
    expect(RatingPromptService.maybePromptForReview).toHaveBeenCalledTimes(1);
  });

  it('recusa do serviço não celebra nem solicita avaliação', async () => {
    mockedJourneyProgressService.markNodeCompleted.mockResolvedValue(lockedSnapshot);
    renderWithProviders(<RewardScreen nodeId="reward-1" />);
    fireEvent.press(await screen.findByText('Receber conquista'));
    expect(await screen.findByText('Esta conquista ainda não abriu')).toBeTruthy();
    expect(screen.queryByText('Conquista registrada')).toBeNull();
    expect(RatingPromptService.maybePromptForReview).not.toHaveBeenCalled();
    expect(router.dismissTo).not.toHaveBeenCalled();
    fireEvent.press(screen.getByText('Voltar para jornada'));
    expect(router.dismissTo).toHaveBeenCalledWith('/(tabs)');
  });

  it('barra invocações simultâneas e após confirmação pelo handler capturado', async () => {
    let resolve!: (snapshot: any) => void;
    mockedJourneyProgressService.markNodeCompleted.mockReturnValue(new Promise(done => { resolve = done; }));
    const view = renderWithProviders(<RewardScreen nodeId="reward-1" />);
    await screen.findByText('Receber conquista');
    const collect = view.UNSAFE_getAllByType(AppButton).find(button => button.props.children === 'Receber conquista')!.props.onPress;
    act(() => { collect(); collect(); });
    expect(mockedJourneyProgressService.markNodeCompleted).toHaveBeenCalledTimes(1);
    await act(async () => { resolve(completedSnapshot); });
    expect(await screen.findByText('Conquista registrada')).toBeTruthy();
    act(() => { collect(); });
    expect(mockedJourneyProgressService.markNodeCompleted).toHaveBeenCalledTimes(1);
    expect(RatingPromptService.maybePromptForReview).toHaveBeenCalledTimes(1);
  });

  it.each([
    ['lesson', 'available', 'block-next', { pathname: '/learn', params: { nodeId: 'next', blockId: 'block-next' } }],
    ['review', 'due-review', 'block-review', { pathname: '/learn', params: { nodeId: 'next', blockId: 'block-review' } }],
    ['checkpoint', 'available', undefined, { pathname: '/checkpoint', params: { nodeId: 'next' } }],
    ['reward', 'available', undefined, { pathname: '/reward', params: { nodeId: 'next' } }],
  ])('Continuar segue o destino real de %s', async (type, status, blockId, destination) => {
    mockedJourneyProgressService.getSnapshotForNode.mockResolvedValue({ ...completedSnapshot, nextRecommendedNode: { id: 'next', type, status, blockId } } as any);
    renderWithProviders(<RewardScreen nodeId="reward-1" />);
    fireEvent.press(await screen.findByText('Continuar'));
    expect(router.replace).toHaveBeenCalledWith(destination);
    expect(mockedJourneyProgressService.markNodeCompleted).not.toHaveBeenCalled();
  });

  it('destino recomendado bloqueado volta à trilha', async () => {
    mockedJourneyProgressService.getSnapshotForNode.mockResolvedValue({ ...completedSnapshot, nextRecommendedNode: { id: 'next', type: 'lesson', status: 'locked', blockId: 'block-next' } } as any);
    renderWithProviders(<RewardScreen nodeId="reward-1" />);
    fireEvent.press(await screen.findByText('Continuar'));
    expect(router.dismissTo).toHaveBeenCalledWith('/(tabs)');
    expect(router.replace).not.toHaveBeenCalled();
  });

  it('fechar e saída secundária navegam sem conceder prêmio', async () => {
    renderWithProviders(<RewardScreen nodeId="reward-1" />);
    await screen.findByText('Receber conquista');
    fireEvent.press(screen.getByLabelText('Voltar'));
    expect(router.back).toHaveBeenCalledTimes(1);
    fireEvent.press(screen.getByText('Voltar para jornada'));
    expect(router.dismissTo).toHaveBeenCalledWith('/(tabs)');
    expect(mockedJourneyProgressService.markNodeCompleted).not.toHaveBeenCalled();
  });

  it('explica que a coleta opcional não libera etapas', async () => {
    const optional = { ...availableSnapshot, track: { ...availableSnapshot.track, units: availableSnapshot.track.units.map((unit: any) => ({ ...unit, nodes: unit.nodes.map((node: any) => node.type === 'reward' ? { ...node, optionalForProgression: true } : node) })) } };
    mockedJourneyProgressService.getSnapshotForNode.mockResolvedValue(optional);
    mockedJourneyProgressService.setCurrentNode.mockResolvedValue(optional);
    renderWithProviders(<RewardScreen nodeId="reward-1" />);
    expect(await screen.findByText('A coleta é opcional e não bloqueia seus estudos.')).toBeTruthy();
    expect(screen.queryByText(/Coletar marca esta etapa como concluída e libera/)).toBeNull();
  });

  it('collects an available reward and updates the journey snapshot', async () => {
    renderWithProviders(<RewardScreen nodeId="reward-1" />);

    await waitFor(() => {
      expect(screen.getByText('Pronto para coletar essa conquista?')).toBeTruthy();
    });

    fireEvent.press(screen.getByText('Receber conquista'));

    await waitFor(() => {
      expect(mockedJourneyProgressService.markNodeCompleted).toHaveBeenCalledWith('reward-1');
    });

    expect(await screen.findByText('Conquista registrada')).toBeTruthy();
    expect(PaywallService.maybePresentOffer).not.toHaveBeenCalled();
  });

  it('conta só os marcos primários da unidade — review completo não entra no total nem no concluído', async () => {
    // Mutação que este teste pega: contar nós de review no total ou no
    // concluído, ou usar um par de filtros diferente do que
    // computeUnitPrimaryProgress define.
    // status='available' faz RewardScreen chamar setCurrentNode e usar o
    // snapshot que ELE devolve, não o de bootstrap — os dois precisam
    // apontar para o mesmo fixture.
    mockedJourneyProgressService.bootstrap.mockResolvedValue(snapshotWithUnitProgress);
    mockedJourneyProgressService.getSnapshotForNode.mockResolvedValue(snapshotWithUnitProgress);
    mockedJourneyProgressService.setCurrentNode.mockResolvedValue(snapshotWithUnitProgress);

    renderWithProviders(<RewardScreen nodeId="reward-1" />);

    expect(await screen.findByText('2 de 4 marcos da unidade concluídos')).toBeTruthy();
  });

  it('does not offer collection for a reward reached while still locked', async () => {
    // `findReward` resolve por id sem olhar status, de proposito. O efeito
    // colateral e que `radiantapp://reward?nodeId=...` -- esquema invocavel de
    // fora do app -- alcanca um no bloqueado. Ate 2026-08-04 a tela dizia
    // "Pronta para ser coletada" com zero marcos concluidos e o botao gravava a
    // conquista da unidade. Estes dois testes existem para que o caminho de
    // coleta nunca volte a ignorar o status.
    mockedJourneyProgressService.bootstrap.mockResolvedValue(lockedSnapshot);
    mockedJourneyProgressService.getSnapshotForNode.mockResolvedValue(lockedSnapshot);

    renderWithProviders(<RewardScreen nodeId="reward-1" />);

    expect(await screen.findByText('Esta conquista ainda não abriu')).toBeTruthy();
    expect(screen.queryByText('Receber conquista')).toBeNull();
    expect(screen.queryByText('Pronto para coletar essa conquista?')).toBeNull();
    expect(screen.getByText('Bloqueada até a unidade fechar')).toBeTruthy();
  });

  it('never marks a locked reward completed, even if the collect path is reached', async () => {
    // Contraprova da guarda de defesa em profundidade: mesmo sem o botao na
    // tela, o caminho de gravacao precisa recusar. Gravar progressao e
    // irreversivel, e quem chega por deep link chega por fora do controle do app.
    mockedJourneyProgressService.bootstrap.mockResolvedValue(lockedSnapshot);
    mockedJourneyProgressService.getSnapshotForNode.mockResolvedValue(lockedSnapshot);

    renderWithProviders(<RewardScreen nodeId="reward-1" />);

    await screen.findByText('Esta conquista ainda não abriu');

    expect(mockedJourneyProgressService.markNodeCompleted).not.toHaveBeenCalled();
    expect(mockedJourneyProgressService.setCurrentNode).not.toHaveBeenCalled();
  });

  describe('HUD — vidas do heartsRepository, não do contador legado', () => {
    // O `GamificationService` guarda um contador de corações que o caminho vivo
    // nunca desconta; com o storage vazio ele diz 5. A lição desconta no
    // `heartsRepository`. Se o HUD da recompensa voltar a ler o legado, estes
    // testes veem "5 de 5" onde o aluno tem 2 — ou corações onde o assinante
    // deveria ver ∞.
    const mockedGetItem = AsyncStorage.getItem as jest.Mock;
    const seedHearts = (state: { count: number; lastRefillAt: string | null; unlimitedUntil: string | null }) => {
      mockedGetItem.mockImplementation(async (key: string) =>
        key === STORAGE_KEYS.HEARTS ? JSON.stringify(state) : null);
    };

    afterEach(() => {
      mockedGetItem.mockReset();
    });

    it('mostra as vidas que a lição descontou', async () => {
      seedHearts({ count: 2, lastRefillAt: new Date(Date.now() - 5 * 60 * 1000).toISOString(), unlimitedUntil: null });

      renderWithProviders(<RewardScreen nodeId="reward-1" />);

      expect(await screen.findByLabelText(/^2 de 5 vidas/)).toBeTruthy();
      expect(screen.queryByLabelText(/^5 de 5 vidas/)).toBeNull();
    });

    it('assinante vê ∞', async () => {
      seedHearts({
        count: 1,
        lastRefillAt: null,
        unlimitedUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      });

      renderWithProviders(<RewardScreen nodeId="reward-1" />);

      expect(await screen.findByText('∞')).toBeTruthy();
    });
  });

  describe('canCollectReward — a decisão que o handler de coleta consulta', () => {
    // O teste anterior renderiza a tela bloqueada e afirma que nada gravou. Ele
    // NAO alcanca a guarda: sem apertar nada, o caminho de coleta nunca roda, e
    // apagar a condicao do handler o deixava verde. A regra vive numa funcao
    // justamente para poder ser invocada — o ramo de coleta e inalcancavel pela
    // UI quando o no esta bloqueado, porque o mesmo booleano decide se o botao
    // existe e se o handler grava.
    //
    // A autorizacao de verdade e a de
    // `JourneyProgressService.markNodeCompleted`, provada em
    // JourneyNodeCompletionGuard.test.tsx por cada caminho que alcanca a
    // escrita. Esta aqui e a segunda camada.
    const node = (status: JourneyNode['status']): JourneyNode =>
      ({ id: 'reward-1', unitId: 'unit-1', type: 'reward', title: 'Conquista', status }) as JourneyNode;

    it('recusa um no bloqueado', () => {
      expect(canCollectReward(node('locked'), false)).toBe(false);
    });

    it('recusa todo status que nao seja disponivel ou ativo', () => {
      for (const status of ['locked', 'completed', 'due-review', 'resumable'] as const) {
        expect(canCollectReward(node(status), false)).toBe(false);
      }
    });

    it('recusa quando a conquista ja foi coletada nesta sessao', () => {
      expect(canCollectReward(node('available'), true)).toBe(false);
    });

    it('recusa quando nao ha no resolvido', () => {
      expect(canCollectReward(null, false)).toBe(false);
    });

    it('aceita o no disponivel e o ativo, senao a correcao vira "nada coleta"', () => {
      expect(canCollectReward(node('available'), false)).toBe(true);
      expect(canCollectReward(node('active'), false)).toBe(true);
    });
  });
});
