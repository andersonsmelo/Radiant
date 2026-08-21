import React from 'react';
import { act, fireEvent, screen, waitFor } from '@testing-library/react-native';
import CheckpointScreen from './CheckpointScreen';
import { renderWithProviders } from '../../../test/renderWithProviders';
import { JourneyProgressService } from '../../journey/services/JourneyProgressService';
import { MATERIA_ENERGIA_E_RADIACAO_PRODUCTION_BATCH } from '../../student-checkpoints/production-batches';

jest.mock('expo-router', () => ({
  router: {
    replace: jest.fn(),
    push: jest.fn(),
    back: jest.fn(),
  },
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
      hearts: 5,
      maxHearts: 5,
    }),
  },
}));

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
