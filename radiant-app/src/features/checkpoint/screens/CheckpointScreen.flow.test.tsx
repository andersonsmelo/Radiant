import React from 'react';
import { act, fireEvent, screen, waitFor } from '@testing-library/react-native';
import CheckpointScreen from './CheckpointScreen';
import { renderWithProviders } from '../../../test/renderWithProviders';
import { JourneyProgressService } from '../../journey/services/JourneyProgressService';
import { MATERIA_ENERGIA_E_RADIACAO_PRODUCTION_BATCH } from '../../student-checkpoints/production-batches';
import { router } from 'expo-router';
import { subscriptionService } from '../../subscription/SubscriptionService';

const mockedRouter = router as jest.Mocked<typeof router>;
const mockedSubscription = subscriptionService as jest.Mocked<typeof subscriptionService>;

// Foco controlável: a tela relê as vidas ao voltar de outra rota, e o teste
// precisa simular essa volta sem desmontar a tela.
const mockFocusCallbacks = new Set<() => void | (() => void)>();
function voltarParaATela() {
  act(() => mockFocusCallbacks.forEach(callback => { callback(); }));
}

jest.mock('expo-router', () => ({
  router: {
    replace: jest.fn(),
    push: jest.fn(),
    back: jest.fn(),
  },
  useFocusEffect: (callback: () => void | (() => void)) => {
    const React = require('react');
    React.useEffect(() => {
      mockFocusCallbacks.add(callback);
      const cleanup = callback();
      return () => {
        mockFocusCallbacks.delete(callback);
        if (typeof cleanup === 'function') cleanup();
      };
    }, [callback]);
  },
}));

jest.mock('../../subscription/SubscriptionService', () => ({
  subscriptionService: { storeAvailable: jest.fn(() => false) },
}));

jest.mock('@expo/vector-icons/MaterialIcons', () => 'MaterialIcons');

jest.mock('../../../components/ui/AppButton', () => {
  const React = require('react');
  const { Pressable, Text } = require('react-native');

  return {
    AppButton: ({ children, onPress, disabled }: { children: React.ReactNode; onPress: () => void; disabled?: boolean }) => (
      <Pressable accessibilityRole="button" onPress={onPress} disabled={disabled}>
        <Text>{children}</Text>
      </Pressable>
    ),
  };
});

jest.mock('../../../components/ui/PixelHeroSplit', () => {
  const React = require('react');
  const { View } = require('react-native');

  return {
    PixelHeroSplit: () => <View />,
  };
});

jest.mock('../../../ui/components/StarfieldBackground', () => ({
  StarfieldBackground: () => null,
}));

jest.mock('../../../ui/components/HUD', () => ({
  HUD: () => null,
}));

jest.mock('../../gamification/services/GamificationService', () => ({
  GamificationService: {
    getSnapshot: jest.fn().mockResolvedValue({
      totalXp: 120,
      streakDays: 3,
    }),
  },
}));

jest.mock('../../hearts/HeartsRepository', () => ({
  heartsRepository: {
    getSnapshot: jest.fn().mockResolvedValue({ count: 5, status: 'full', nextRefillAt: null, unlimitedUntil: null }),
    spend: jest.fn().mockResolvedValue({ count: 4, status: 'recovering', nextRefillAt: null, unlimitedUntil: null }),
  },
}));

jest.mock('../../hearts/components/HeartsSheet', () => {
  const React = require('react');
  const { Text } = require('react-native');
  const { Pressable } = require('react-native');
  return {
    HeartsSheet: ({ visible, storeAvailable, onSubscribe }: { visible: boolean; storeAvailable: boolean; onSubscribe: () => void }) =>
      visible ? (
        <>
          <Text>Checkpoint pausado por falta de vidas</Text>
          <Text>{storeAvailable ? 'folha: com assinatura' : 'folha: sem assinatura'}</Text>
          <Pressable accessibilityRole="button" onPress={onSubscribe}><Text>Assinar pela folha</Text></Pressable>
        </>
      ) : null,
  };
});

jest.mock('../../journey/services/JourneyProgressService', () => ({
  JourneyProgressService: {
    bootstrap: jest.fn(),
    markNodeCompleted: jest.fn(),
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
      id: 'interest-checkpoint-1',
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
            id: 'checkpoint-1',
            type: 'checkpoint',
            status: 'available',
            title: 'Checkpoint do módulo',
            description: 'Validar etapa antes de seguir.',
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
            id: 'checkpoint-1',
            type: 'checkpoint',
            status: 'completed',
            title: 'Checkpoint do módulo',
            description: 'Etapa validada.',
            unitId: 'unit-1',
          },
        ],
      },
    ],
  },
  // O `progress` não é decoração: a tela lê `completedNodeIds` para saber se a
  // conquista foi mesmo gravada, porque a guarda de autorização recusa
  // devolvendo o snapshot inalterado em vez de lançar. Sem este campo o dublê
  // fazia a tela estourar e o caminho feliz passava pelo `catch`.
  progress: { completedNodeIds: ['lesson-1', 'checkpoint-1'], pendingSyncEvents: [] },
  nextRecommendedNode: null,
} as any;

// **Mudou em 2026-08-21.** A avaliação única de dez itens virou cinco avaliações
// por competência — a regra de "depois de um estágio, uma avaliação abre o
// seguinte". Estes casos passam a exercitar a avaliação do PRIMEIRO estágio, que
// é a que o aluno encontra primeiro. O que eles medem não mudou: o limiar de 80%
// e o encaminhamento de reforço abaixo dele.
const productionStageCompetencyId =
  MATERIA_ENERGIA_E_RADIACAO_PRODUCTION_BATCH.activities[0].competencyIds[0];
const productionStageItems = MATERIA_ENERGIA_E_RADIACAO_PRODUCTION_BATCH.checkpoint.items.filter(
  (item) => item.competencyIds[0] === productionStageCompetencyId,
);
const productionNodeId = `node:${MATERIA_ENERGIA_E_RADIACAO_PRODUCTION_BATCH.checkpoint.id}:${
  productionStageCompetencyId.split(':').at(-1)
}`;
const productionAvailableSnapshot = {
  track: {
    units: [{
      id: MATERIA_ENERGIA_E_RADIACAO_PRODUCTION_BATCH.unitId,
      title: 'Matéria, energia e radiação',
      nodes: [{
        id: productionNodeId,
        type: 'checkpoint',
        status: 'available',
        title: 'Avaliação 1 de 5',
        description: '2 itens desta competência. A aprovação exige 80%.',
        unitId: MATERIA_ENERGIA_E_RADIACAO_PRODUCTION_BATCH.unitId,
      }],
    }],
  },
  progress: { completedNodeIds: [], pendingSyncEvents: [] },
  nextRecommendedNode: null,
} as any;
const productionCompletedSnapshot = {
  ...productionAvailableSnapshot,
  track: {
    units: [{
      ...productionAvailableSnapshot.track.units[0],
      nodes: [{ ...productionAvailableSnapshot.track.units[0].nodes[0], status: 'completed' }],
    }],
  },
  progress: { completedNodeIds: [productionNodeId], pendingSyncEvents: [] },
} as any;

async function answerProductionCheckpoint(correct: boolean): Promise<void> {
  fireEvent.press(await screen.findByText('Iniciar checkpoint'));
  for (const [index, item] of productionStageItems.entries()) {
    expect(await screen.findByText(item.prompt)).toBeTruthy();
    const option = correct
      ? item.options.find((entry) => entry.id === item.correctOptionId)
      : item.options.find((entry) => entry.id !== item.correctOptionId);
    if (!option) throw new Error('checkpoint-option-fixture-invalid');
    fireEvent.press(screen.getByLabelText(option.label));
    if (index === productionStageItems.length - 1) {
      await act(async () => {
        fireEvent.press(screen.getByText('Enviar checkpoint'));
        await Promise.resolve();
        await Promise.resolve();
      });
    } else {
      fireEvent.press(screen.getByText('Próxima questão'));
    }
  }
}

describe('CheckpointScreen flow', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockedJourneyProgressService.bootstrap.mockResolvedValue(availableSnapshot);
    mockedJourneyProgressService.markNodeCompleted.mockResolvedValue(completedSnapshot);
  });

  it('cobra cada resposta errada do checkpoint uma única vez', async () => {
    const heartsRepository = require('../../hearts/HeartsRepository').heartsRepository as { spend: jest.Mock };
    mockedJourneyProgressService.bootstrap.mockResolvedValue(productionAvailableSnapshot);
    renderWithProviders(<CheckpointScreen nodeId={productionNodeId} />);

    await answerProductionCheckpoint(false);

    await waitFor(() => expect(heartsRepository.spend).toHaveBeenCalledTimes(productionStageItems.length));
  });

  it('pausa o checkpoint ao zerar sem avançar para a questão seguinte', async () => {
    const heartsRepository = require('../../hearts/HeartsRepository').heartsRepository as { spend: jest.Mock };
    heartsRepository.spend.mockResolvedValueOnce({ count: 0, status: 'empty', nextRefillAt: null, unlimitedUntil: null });
    mockedJourneyProgressService.bootstrap.mockResolvedValue(productionAvailableSnapshot);
    renderWithProviders(<CheckpointScreen nodeId={productionNodeId} />);

    fireEvent.press(await screen.findByText('Iniciar checkpoint'));
    const item = productionStageItems[0];
    const wrong = item.options.find(option => option.id !== item.correctOptionId)!;
    fireEvent.press(screen.getByLabelText(wrong.label));
    fireEvent.press(screen.getByText('Próxima questão'));

    expect(await screen.findByText('Checkpoint pausado por falta de vidas')).toBeTruthy();
    expect(screen.getByText(item.prompt)).toBeTruthy();
  });

  it('assinante com contagem zero não é pausado: o estado, não o número, decide o bloqueio', async () => {
    // `setUnlimited` preserva a contagem — quem assinou com zero vidas continua
    // com `count: 0` e `status: 'unlimited'`. Bloquear pelo número deixaria o
    // assinante preso na folha que a assinatura promete nunca mais mostrar.
    const heartsRepository = require('../../hearts/HeartsRepository').heartsRepository as { getSnapshot: jest.Mock; spend: jest.Mock };
    const ilimitada = { count: 0, status: 'unlimited', nextRefillAt: null, unlimitedUntil: '2026-10-14T12:00:00.000Z' };
    heartsRepository.getSnapshot.mockResolvedValue(ilimitada);
    heartsRepository.spend.mockResolvedValue(ilimitada);
    mockedJourneyProgressService.bootstrap.mockResolvedValue(productionAvailableSnapshot);
    renderWithProviders(<CheckpointScreen nodeId={productionNodeId} />);

    fireEvent.press(await screen.findByText('Iniciar checkpoint'));
    const item = productionStageItems[0];
    const wrong = item.options.find(option => option.id !== item.correctOptionId)!;
    expect(await screen.findByText(item.prompt)).toBeTruthy();
    fireEvent.press(screen.getByLabelText(wrong.label));
    fireEvent.press(screen.getByText('Próxima questão'));

    expect(await screen.findByText(productionStageItems[1].prompt)).toBeTruthy();
    expect(screen.queryByText('Checkpoint pausado por falta de vidas')).toBeNull();
  });

  describe('folha de vidas e a loja', () => {
    const vazia = { count: 0, status: 'empty', nextRefillAt: '2026-09-14T12:30:00.000Z', unlimitedUntil: null };
    const ilimitada = { count: 0, status: 'unlimited', nextRefillAt: null, unlimitedUntil: '2026-10-14T12:00:00.000Z' };
    const heartsRepository = () =>
      require('../../hearts/HeartsRepository').heartsRepository as { getSnapshot: jest.Mock; spend: jest.Mock };

    async function bloquearNaEntrada() {
      heartsRepository().getSnapshot.mockResolvedValue(vazia);
      mockedJourneyProgressService.bootstrap.mockResolvedValue(productionAvailableSnapshot);
      renderWithProviders(<CheckpointScreen nodeId={productionNodeId} />);
      await act(async () => {});
      fireEvent.press(await screen.findByText('Iniciar checkpoint'));
      expect(await screen.findByText('Checkpoint pausado por falta de vidas')).toBeTruthy();
    }

    afterEach(() => {
      heartsRepository().getSnapshot.mockResolvedValue({ count: 5, status: 'full', nextRefillAt: null, unlimitedUntil: null });
    });

    it('com loja no binário, a folha oferece a assinatura e leva à tela dela', async () => {
      mockedSubscription.storeAvailable.mockReturnValue(true);
      await bloquearNaEntrada();

      expect(screen.getByText('folha: com assinatura')).toBeTruthy();
      fireEvent.press(screen.getByText('Assinar pela folha'));

      expect(mockedRouter.push).toHaveBeenCalledWith('/subscription');
      expect(screen.queryByText('Checkpoint pausado por falta de vidas')).toBeNull();
    });

    it('sem loja no binário, a folha não oferece a assinatura', async () => {
      mockedSubscription.storeAvailable.mockReturnValue(false);
      await bloquearNaEntrada();

      expect(screen.getByText('folha: sem assinatura')).toBeTruthy();
    });

    it('voltando da compra, o checkpoint relê as vidas e deixa começar', async () => {
      mockedSubscription.storeAvailable.mockReturnValue(true);
      await bloquearNaEntrada();
      fireEvent.press(screen.getByText('Assinar pela folha'));

      heartsRepository().getSnapshot.mockResolvedValue(ilimitada);
      voltarParaATela();
      await act(async () => {});
      fireEvent.press(screen.getByText('Iniciar checkpoint'));

      expect(await screen.findByText(productionStageItems[0].prompt)).toBeTruthy();
      expect(screen.queryByText('Checkpoint pausado por falta de vidas')).toBeNull();
    });
  });

  it('completes an available checkpoint and updates the journey snapshot', async () => {
    renderWithProviders(<CheckpointScreen nodeId="checkpoint-1" />);

    await waitFor(() => {
      expect(screen.getByText('Pronto para fechar esta etapa?')).toBeTruthy();
    });

    fireEvent.press(screen.getByText('Concluir checkpoint'));

    await waitFor(() => {
      expect(mockedJourneyProgressService.markNodeCompleted).toHaveBeenCalledWith('checkpoint-1');
    });

    expect(await screen.findByText('Etapa validada.')).toBeTruthy();
  });

  it('aplica as questões do estágio e só conclui quando atinge 80%', async () => {
    mockedJourneyProgressService.bootstrap.mockResolvedValue(productionAvailableSnapshot);
    mockedJourneyProgressService.markNodeCompleted.mockResolvedValue(productionCompletedSnapshot);

    renderWithProviders(<CheckpointScreen nodeId={productionNodeId} />);
    await answerProductionCheckpoint(true);

    await waitFor(() => {
      expect(mockedJourneyProgressService.markNodeCompleted).toHaveBeenCalledWith(productionNodeId);
    });
    expect(await screen.findByText(/^Avaliação 1 de /u)).toBeTruthy();
  });

  it('mantém o nó bloqueado e encaminha reforço quando a nota fica abaixo de 80%', async () => {
    mockedJourneyProgressService.bootstrap.mockResolvedValue(productionAvailableSnapshot);

    renderWithProviders(<CheckpointScreen nodeId={productionNodeId} />);
    await answerProductionCheckpoint(false);

    expect(await screen.findByText('Reforço necessário antes de tentar novamente')).toBeTruthy();
    expect(
      screen.getByText(new RegExp(`Você acertou 0 de ${productionStageItems.length} quest`, 'u')),
    ).toBeTruthy();
    expect(screen.getByText('Revisar competência frágil')).toBeTruthy();
    expect(mockedJourneyProgressService.markNodeCompleted).not.toHaveBeenCalled();
  });
});
