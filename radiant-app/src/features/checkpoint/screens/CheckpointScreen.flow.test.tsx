import React from 'react';
import { Circle } from 'react-native-svg';
import { PixelHeroSplit } from '../../../components/ui/PixelHeroSplit';
import { PixelIllustration } from '../../../ui/characters/PixelIllustration';
import { act, fireEvent, screen, waitFor } from '@testing-library/react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AccessibilityInfo } from 'react-native';
import CheckpointScreen from './CheckpointScreen';
import { renderWithProviders } from '../../../test/renderWithProviders';
import { JourneyProgressService } from '../../journey/services/JourneyProgressService';
import { GamificationService } from '../../gamification/services/GamificationService';
import { LessonOutcomeService } from '../../lesson-flow/services/LessonOutcomeService';
import { MATERIA_ENERGIA_E_RADIACAO_PRODUCTION_BATCH } from '../../student-checkpoints/production-batches';
import { router } from 'expo-router';
import { subscriptionService } from '../../subscription/SubscriptionService';
import { assessmentAttemptRepository } from '../../student-checkpoints/AssessmentAttemptRepository';
import { STORAGE_KEYS } from '../../../constants/storageKeys';
import { itemReviewRepository } from '../../spaced-repetition/repositories/ItemReviewRepository';
import { ItemReviewService } from '../../spaced-repetition/services/ItemReviewService';
import * as activeHook from '../../student-checkpoints/useActiveCheckpoint';
import * as shadowHook from '../../student-checkpoints/useShadowCheckpoint';
import { JourneyMedal } from '../../journey/components/JourneyMedal';
import { medalColors } from '../../../ui/theme';
import { ProductionCurriculumCatalog } from '../../student-checkpoints/ProductionCurriculumCatalog';

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
    dismissTo: jest.fn(),
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

// Armazenamento em memória que sobrevive à remontagem da tela: é ele que separa
// "o aluno saiu e voltou" de "o aluno começou do zero".
jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock'));

jest.mock('../../subscription/SubscriptionService', () => ({
  subscriptionService: { storeAvailable: jest.fn(() => false) },
}));

jest.mock('@expo/vector-icons/MaterialIcons', () => 'MaterialIcons');

jest.mock('../../../components/ui/AppButton', () => {
  const React = require('react');
  const { Pressable, Text } = require('react-native');

  return {
    AppButton: ({ children, label, onPress, disabled }: { children?: React.ReactNode; label?: string; onPress: () => void; disabled?: boolean }) => (
      <Pressable accessibilityRole="button" onPress={onPress} disabled={disabled}>
        <Text>{children ?? label}</Text>
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
    HeartsSheet: ({ visible, storeAvailable, onSubscribe, dueReviewCount, onReview, onClose }: { visible: boolean; storeAvailable: boolean; onSubscribe: () => void; dueReviewCount: number; onReview: () => void; onClose: () => void }) =>
      visible ? (
        <>
          <Text>Checkpoint pausado por falta de vidas</Text>
          <Text>{storeAvailable ? 'folha: com assinatura' : 'folha: sem assinatura'}</Text>
          <Text>{`A revisar: ${dueReviewCount}`}</Text>
          <Pressable accessibilityRole="button" onPress={onSubscribe}><Text>Assinar pela folha</Text></Pressable>
          {dueReviewCount > 0 ? <Pressable accessibilityRole="button" onPress={onReview}><Text>Revisar pela folha</Text></Pressable> : null}
          <Pressable accessibilityRole="button" onPress={onClose}><Text>Fechar folha</Text></Pressable>
        </>
      ) : null,
  };
});

jest.mock('../../journey/services/JourneyProgressService', () => ({
  JourneyProgressService: {
    bootstrap: jest.fn(),
    getSnapshotForNode: jest.fn(),
    markNodeCompleted: jest.fn(),
  },
}));

jest.mock('../../lesson-flow/services/LessonOutcomeService', () => ({
  LessonOutcomeService: {
    recordAssessmentApproval: jest.fn(),
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
const mockedGamification = GamificationService as jest.Mocked<typeof GamificationService>;
const mockedLessonOutcome = LessonOutcomeService as jest.Mocked<typeof LessonOutcomeService>;

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
  fireEvent.press(await screen.findByText('Começar avaliação'));
  for (const [index, item] of productionStageItems.entries()) {
    expect(await screen.findByText(item.prompt)).toBeTruthy();
    const option = correct
      ? item.options.find((entry) => entry.id === item.correctOptionId)
      : item.options.find((entry) => entry.id !== item.correctOptionId);
    if (!option) throw new Error('checkpoint-option-fixture-invalid');
    fireEvent.press(screen.getByLabelText(option.label));
    if (index === productionStageItems.length - 1) {
      await act(async () => {
        fireEvent.press(screen.getByText('Enviar avaliação'));
        await Promise.resolve();
        await Promise.resolve();
      });
    } else {
      fireEvent.press(screen.getByText('Próxima questão'));
    }
  }
}

describe('CheckpointScreen flow', () => {
  beforeEach(async () => {
    jest.clearAllMocks();
    await AsyncStorage.clear();
    mockedJourneyProgressService.bootstrap.mockResolvedValue(availableSnapshot);
    mockedJourneyProgressService.getSnapshotForNode.mockImplementation(() => mockedJourneyProgressService.bootstrap());
    mockedJourneyProgressService.markNodeCompleted.mockResolvedValue(completedSnapshot);
    mockedGamification.getSnapshot.mockResolvedValue({ totalXp: 120, streakDays: 3 } as any);
    mockedLessonOutcome.recordAssessmentApproval.mockResolvedValue({ award: null, rewarded: false });
  });

  describe('estados Medalhão', () => {
    beforeEach(() => {
      // A fonte anterior usa bootstrap: manter os dois caminhos reais permite
      // reproduzir os sintomas antigos, sem fabricar o estado indisponível.
      mockedJourneyProgressService.bootstrap.mockResolvedValue(productionAvailableSnapshot);
    });
    // Duas aulas necessárias, uma futura e uma revisão: só as duas primeiras
    // pertencem à cadeia de pré-requisitos desta avaliação.
    const dependencySnapshot = {
      ...productionAvailableSnapshot,
      track: { units: [
        { id: 'earlier-unit', title: 'Outra unidade', nodes: [] },
        { ...productionAvailableSnapshot.track.units[0], nodes: [
          { id: 'aula-a', unitId: productionAvailableSnapshot.track.units[0].id, type: 'lesson', status: 'completed', title: 'Aula A' },
          { id: 'aula-b', unitId: productionAvailableSnapshot.track.units[0].id, type: 'lesson', status: 'available', title: 'Aula B', unlockRule: { requiresNodeIds: ['aula-a'] } },
          { id: 'revisao', unitId: productionAvailableSnapshot.track.units[0].id, type: 'review', status: 'locked', title: 'Revisão' },
          { ...productionAvailableSnapshot.track.units[0].nodes[0], status: 'locked', unlockRule: { requiresNodeIds: ['aula-b'] } },
          { id: 'aula-futura', unitId: productionAvailableSnapshot.track.units[0].id, type: 'lesson', status: 'locked', title: 'Aula futura', unlockRule: { requiresNodeIds: [productionNodeId] } },
        ] },
      ] },
      progress: { completedNodeIds: ['aula-a'], pendingSyncEvents: [] },
    } as any;

    it('bloqueada explica só as aulas necessárias e não abre histórico nem runtime', async () => {
      mockedJourneyProgressService.getSnapshotForNode.mockResolvedValue(dependencySnapshot);
      mockedJourneyProgressService.bootstrap.mockResolvedValue(dependencySnapshot);
      const history = jest.spyOn(assessmentAttemptRepository, 'getState');
      const active = jest.spyOn(activeHook, 'useActiveCheckpoint');
      const shadow = jest.spyOn(shadowHook, 'useShadowCheckpoint');
      try {
        renderWithProviders(<CheckpointScreen nodeId={productionNodeId} />);
        expect(await screen.findByText('Abre depois das 2 aulas. Faltam 1.')).toBeTruthy();
        expect(screen.getByText('Avaliação da unidade 2')).toBeTruthy();
        expect(screen.getByLabelText('Avaliação da unidade 2. Bloqueada.')).toBeTruthy();
        expect(screen.UNSAFE_getByType(JourneyMedal).findAllByType(Circle).some((circle: { props: { fill?: string } }) => circle.props.fill === medalColors.locked.face)).toBe(true);
        expect(screen.queryByText('Começar avaliação')).toBeNull();
        expect(screen.queryByRole('radio')).toBeNull();
        expect(history).not.toHaveBeenCalled();
        expect(active.mock.calls.at(-1)?.[0].enabled).toBe(false);
        expect(shadow.mock.calls.at(-1)?.[0].enabled).toBe(false);
        expect(mockedLessonOutcome.recordAssessmentApproval).not.toHaveBeenCalled();
        expect(mockedJourneyProgressService.markNodeCompleted).not.toHaveBeenCalled();
      } finally { history.mockRestore(); active.mockRestore(); shadow.mockRestore(); }
    });

    it('inválida explícita volta à trilha em vez de abrir outra avaliação disponível', async () => {
      mockedJourneyProgressService.getSnapshotForNode.mockResolvedValue(productionAvailableSnapshot);
      mockedJourneyProgressService.bootstrap.mockResolvedValue(productionAvailableSnapshot);
      const history = jest.spyOn(assessmentAttemptRepository, 'getState');
      const active = jest.spyOn(activeHook, 'useActiveCheckpoint');
      const shadow = jest.spyOn(shadowHook, 'useShadowCheckpoint');
      try {
        renderWithProviders(<CheckpointScreen nodeId="node:invalid" />);
        await waitFor(() => expect(mockedRouter.dismissTo).toHaveBeenCalledWith('/(tabs)'));
        expect(history).not.toHaveBeenCalled();
        expect(active.mock.calls.at(-1)?.[0].enabled).toBe(false);
        expect(shadow.mock.calls.at(-1)?.[0].enabled).toBe(false);
        expect(screen.queryByText('Começar avaliação')).toBeNull();
        expect(mockedJourneyProgressService.markNodeCompleted).not.toHaveBeenCalled();
      } finally { history.mockRestore(); active.mockRestore(); shadow.mockRestore(); }
    });

    it('disponível em outra trilha usa snapshot do nó, prata e regra real sem Pixel', async () => {
      mockedJourneyProgressService.getSnapshotForNode.mockResolvedValue(productionAvailableSnapshot);
      renderWithProviders(<CheckpointScreen nodeId={productionNodeId} />);
      fireEvent.press(await screen.findByText('Começar avaliação'));
      expect(mockedJourneyProgressService.getSnapshotForNode).toHaveBeenCalledWith(productionNodeId);
      expect(mockedJourneyProgressService.bootstrap).not.toHaveBeenCalled();
      expect(screen.getByText('Avaliação da unidade 1')).toBeTruthy();
      expect(screen.getByText('Avaliação 1 de 5')).toBeTruthy();
      expect(screen.getByText('Questão 1 de 2')).toBeTruthy();
      expect(screen.getByLabelText('Avaliação da unidade 1. Disponível.')).toBeTruthy();
      const medal = screen.UNSAFE_getByType(JourneyMedal);
      // Cor efetiva dos desenhos SVG, não cópia das props do componente.
      expect(medal.findAllByType(Circle).some((circle: { props: { fill?: string } }) => circle.props.fill === medalColors.silver.face)).toBe(true);
      expect(screen.UNSAFE_queryByType(PixelHeroSplit)).toBeNull();
      expect(screen.UNSAFE_queryByType(PixelIllustration)).toBeNull();
      expect(screen.queryByLabelText(/Pixel/u)).toBeNull();
      expect(screen.queryByText(/checkpoint|jornada|indisponível/iu)).toBeNull();
    });

    it('falha de leitura mostra erro recuperável e não é tratada como nó inválido', async () => {
      mockedJourneyProgressService.getSnapshotForNode.mockRejectedValueOnce(Error('read-failed'));
      const error = jest.spyOn(console, 'error').mockImplementation(() => undefined);
      try {
        renderWithProviders(<CheckpointScreen nodeId={productionNodeId} />);
        expect(await screen.findByText('Não foi possível carregar a avaliação.')).toBeTruthy();
        expect(mockedRouter.dismissTo).not.toHaveBeenCalled();
        mockedJourneyProgressService.getSnapshotForNode.mockResolvedValue(productionAvailableSnapshot);
        fireEvent.press(screen.getByText('Tentar novamente'));
        expect(await screen.findByText('Começar avaliação')).toBeTruthy();
      } finally { error.mockRestore(); }
    });

    it('conclusão sem nodeId sobrevive ao desaparecimento do fallback e não inventa XP', async () => {
      mockedJourneyProgressService.bootstrap.mockResolvedValue(productionAvailableSnapshot);
      mockedJourneyProgressService.markNodeCompleted.mockResolvedValue(productionCompletedSnapshot);
      renderWithProviders(<CheckpointScreen />);
      await answerProductionCheckpoint(true);
      expect(await screen.findByText('Avaliação concluída')).toBeTruthy();
      expect(screen.getByLabelText('Avaliação concluída. Medalha de prata.')).toBeTruthy();
      expect(screen.queryByText(/\+null XP|\+0 XP/u)).toBeNull();
      fireEvent.press(screen.getByText('Voltar para a trilha'));
      expect(mockedRouter.dismissTo).toHaveBeenCalledWith('/(tabs)');
    });

    it('retoma resumo confirmado sem reenviar respostas ou creditar novamente', async () => {
      mockedJourneyProgressService.getSnapshotForNode.mockResolvedValue(productionCompletedSnapshot);
      mockedJourneyProgressService.bootstrap.mockResolvedValue(productionCompletedSnapshot);
      const submit = jest.spyOn(assessmentAttemptRepository, 'submit');
      try {
        renderWithProviders(<CheckpointScreen nodeId={productionNodeId} resumeCheckpointId="saved-summary" resumeCursorId="checkpoint-summary" />);
        expect(await screen.findByText('Avaliação concluída')).toBeTruthy();
        expect(submit).not.toHaveBeenCalled();
        expect(mockedLessonOutcome.recordAssessmentApproval).not.toHaveBeenCalled();
        expect(mockedJourneyProgressService.markNodeCompleted).not.toHaveBeenCalled();
      } finally { submit.mockRestore(); }
    });
  });

  it.each([false, true])('mantém a primeira avaliação no resumo sem abrir a segunda (finish pendente: %s)', async (deferFinish) => {
    const canonical = ProductionCurriculumCatalog.getJourneyTrackDefinition(ProductionCurriculumCatalog.listTracks()[0].id)!;
    const firstTwo = canonical.units.flatMap(unit => unit.nodes).filter(node => node.type === 'checkpoint').slice(0, 2);
    expect(firstTwo[0].id).toBe(productionNodeId);
    expect(firstTwo[1].title).toBe('Avaliação 2 de 5');
    const completedLessons = canonical.units.flatMap(unit => unit.nodes).filter(node => node.type === 'lesson').map(node => node.id);
    const before = {
      ...productionAvailableSnapshot,
      track: { ...canonical, units: canonical.units.map(unit => ({ ...unit, nodes: unit.nodes.map(node => ({
        ...node, status: node.type === 'lesson' ? 'completed' : node.type === 'checkpoint' ? 'available' : 'locked',
      })) })) },
      progress: { completedNodeIds: completedLessons, pendingSyncEvents: [] },
      nextRecommendedNode: { ...firstTwo[0], status: 'available' },
    } as any;
    const after = {
      ...before,
      track: { ...before.track, units: before.track.units.map((unit: any) => ({ ...unit, nodes: unit.nodes.map((node: any) =>
        node.id === firstTwo[0].id ? { ...node, status: 'completed' } : node) })) },
      progress: { ...before.progress, completedNodeIds: [...completedLessons, firstTwo[0].id] },
      nextRecommendedNode: { ...firstTwo[1], status: 'available' },
    } as any;
    mockedJourneyProgressService.bootstrap.mockResolvedValue(before);
    mockedJourneyProgressService.markNodeCompleted.mockResolvedValue(after);
    const history = jest.spyOn(assessmentAttemptRepository, 'getState');
    const submit = jest.spyOn(assessmentAttemptRepository, 'submit');
    const realActive = activeHook.useActiveCheckpoint;
    let releaseFinish!: () => void;
    const gate = deferFinish ? new Promise<void>(resolve => { releaseFinish = resolve; }) : Promise.resolve();
    const finishedFlowIds: string[] = [];
    const active = jest.spyOn(activeHook, 'useActiveCheckpoint').mockImplementation(binding => {
      const control = realActive(binding);
      return { ...control, finish: async () => {
        finishedFlowIds.push(binding.flowId);
        await gate;
        await control.finish();
      } };
    });
    const shadow = jest.spyOn(shadowHook, 'useShadowCheckpoint');
    const original = renderWithProviders(<CheckpointScreen />);
    try {
      await answerProductionCheckpoint(true);
      if (deferFinish) {
        await waitFor(() => expect(finishedFlowIds).toEqual([`unit-checkpoint:${firstTwo[0].id}`]));
        // Esta é a janela setSnapshot -> finish, antes da celebração. Não pode
        // mudar identidade nem abrir o runtime da avaliação seguinte aqui.
        expect(screen.getByText(firstTwo[0].title)).toBeTruthy();
        expect(screen.UNSAFE_getByType(JourneyMedal).props.node.id).toBe(firstTwo[0].id);
        expect(history.mock.calls.some(([id]) => id === firstTwo[1].id)).toBe(false);
        expect(active.mock.calls.some(([binding]) => binding.journeyNodeId === firstTwo[1].id)).toBe(false);
        expect(shadow.mock.calls.some(([binding]) => binding.journeyNodeId === firstTwo[1].id)).toBe(false);
        await act(async () => { releaseFinish(); });
      }
      expect(await screen.findByText('Avaliação concluída')).toBeTruthy();
      expect(screen.getByText(firstTwo[0].title)).toBeTruthy();
      expect(screen.queryByText(firstTwo[1].title)).toBeNull();
      const medal = screen.UNSAFE_getByType(JourneyMedal);
      expect(medal.props.node.id).toBe(firstTwo[0].id);
      expect(medal.props.unitNumber).toBe(1);
      expect(history.mock.calls.some(([id]) => id === firstTwo[1].id)).toBe(false);
      expect(active.mock.calls.some(([binding]) => binding.journeyNodeId === firstTwo[1].id)).toBe(false);
      expect(shadow.mock.calls.some(([binding]) => binding.journeyNodeId === firstTwo[1].id)).toBe(false);
      expect(finishedFlowIds).toEqual([`unit-checkpoint:${firstTwo[0].id}`]);
      expect(submit).toHaveBeenCalledTimes(1);
      expect(submit.mock.calls[0][0].journeyNodeId).toBe(firstTwo[0].id);
      expect(mockedJourneyProgressService.markNodeCompleted.mock.calls).toEqual([[firstTwo[0].id]]);
      expect(mockedLessonOutcome.recordAssessmentApproval).toHaveBeenCalledTimes(1);
      expect(mockedLessonOutcome.recordAssessmentApproval.mock.calls[0][0].nodeId).toBe(firstTwo[0].id);
      fireEvent.press(screen.getByText('Abrir avaliação'));
      expect(mockedRouter.replace).toHaveBeenCalledWith({ pathname: '/checkpoint', params: { nodeId: firstTwo[1].id } });
      original.unmount();
      mockedJourneyProgressService.getSnapshotForNode.mockResolvedValue(after);
      renderWithProviders(<CheckpointScreen nodeId={firstTwo[1].id} />);
      fireEvent.press(await screen.findByText('Começar avaliação'));
      const nextItems = ProductionCurriculumCatalog.getCheckpointByNodeId(firstTwo[1].id)!.items;
      expect(await screen.findByText(nextItems[0].prompt)).toBeTruthy();
      expect(mockedJourneyProgressService.markNodeCompleted.mock.calls).toEqual([[firstTwo[0].id]]);
    } finally {
      releaseFinish?.();
      history.mockRestore(); submit.mockRestore(); active.mockRestore(); shadow.mockRestore();
    }
  });

  it('dois toques no envio comprometem uma única tentativa e um único crédito', async () => {
    mockedJourneyProgressService.bootstrap.mockResolvedValue(productionAvailableSnapshot);
    mockedJourneyProgressService.markNodeCompleted.mockResolvedValue(productionCompletedSnapshot);
    const submit = jest.spyOn(assessmentAttemptRepository, 'submit');
    try {
      renderWithProviders(<CheckpointScreen nodeId={productionNodeId} />);
      fireEvent.press(await screen.findByText('Começar avaliação'));
      for (const [index, item] of productionStageItems.entries()) {
        fireEvent.press(await screen.findByLabelText(item.options.find(option => option.id === item.correctOptionId)!.label));
        if (index < productionStageItems.length - 1) fireEvent.press(screen.getByText('Próxima questão'));
      }
      const send = screen.getByRole('button', { name: 'Enviar avaliação' });
      await act(async () => {
        fireEvent.press(send);
        fireEvent.press(send);
      });
      expect(await screen.findByText('Avaliação concluída')).toBeTruthy();
      expect(submit).toHaveBeenCalledTimes(1);
      expect(mockedJourneyProgressService.markNodeCompleted).toHaveBeenCalledTimes(1);
      expect(mockedLessonOutcome.recordAssessmentApproval).toHaveBeenCalledTimes(1);
      expect(await itemReviewRepository.getAttempts()).toHaveLength(2);
    } finally { submit.mockRestore(); }
  });

  it('retry após falha de gravação envia o mesmo ID e as mesmas respostas, sem concluir antes', async () => {
    mockedJourneyProgressService.bootstrap.mockResolvedValue(productionAvailableSnapshot);
    const submit = jest.spyOn(assessmentAttemptRepository, 'submit');
    const setItem = (AsyncStorage.setItem as jest.Mock).getMockImplementation()!;
    let failed = false;
    const write = jest.spyOn(AsyncStorage, 'setItem').mockImplementation(async (key, raw) => {
      if (!failed && key === STORAGE_KEYS.ITEM_REVIEW) { failed = true; throw Error('full'); }
      return setItem(key, raw);
    });
    try {
      renderWithProviders(<CheckpointScreen nodeId={productionNodeId} />);
      await answerProductionCheckpoint(true);
      expect(await screen.findByText(/Suas respostas não foram presumidas/u)).toBeTruthy();
      expect(mockedJourneyProgressService.markNodeCompleted).not.toHaveBeenCalled();
      expect(mockedLessonOutcome.recordAssessmentApproval).not.toHaveBeenCalled();
      const first = submit.mock.calls[0][0];
      fireEvent.press(screen.getByText('Enviar avaliação'));
      await waitFor(() => expect(mockedJourneyProgressService.markNodeCompleted).toHaveBeenCalledWith(productionNodeId));
      expect(submit.mock.calls[1][0]).toEqual(first);
      expect(await itemReviewRepository.getAttempts()).toHaveLength(productionStageItems.length);
      const due = new Date(Date.now() + 2 * 86400000);
      const queue = await ItemReviewService.loadQueue([], due);
      expect(queue.map(entry => entry.question.id).sort()).toEqual(productionStageItems.map(item => item.id).sort());
      expect((await ItemReviewService.recordReview(queue[0], true, due)).accepted).toBe(true);
      expect((await itemReviewRepository.getAttempts()).at(-1)).toMatchObject({ mode: 'self-review', hintUsed: true });
    } finally {
      submit.mockRestore(); write.mockRestore();
      (AsyncStorage.setItem as jest.Mock).mockImplementation(setItem);
    }
  });

  it('reabrir uma aprovação salva oferece concluir sem refazer nem duplicar a tentativa', async () => {
    mockedJourneyProgressService.bootstrap.mockResolvedValue(productionAvailableSnapshot);
    const original = renderWithProviders(<CheckpointScreen nodeId={productionNodeId} />);
    const recordApproval = mockedLessonOutcome.recordAssessmentApproval;
    recordApproval.mockRejectedValueOnce(Error('after-journal'));
    await answerProductionCheckpoint(true);
    expect(await screen.findByText('Concluir avaliação registrada')).toBeTruthy();
    const before = await itemReviewRepository.getAttempts();
    original.unmount();
    renderWithProviders(<CheckpointScreen nodeId={productionNodeId} />);
    fireEvent.press(await screen.findByText('Concluir avaliação registrada'));
    await waitFor(() => expect(mockedJourneyProgressService.markNodeCompleted).toHaveBeenCalledWith(productionNodeId));
    expect(await itemReviewRepository.getAttempts()).toEqual(before);
    expect(screen.queryByText('Começar avaliação')).toBeNull();
  });

  it('retry da conclusão na mesma tela não volta a pedir crédito de XP', async () => {
    mockedJourneyProgressService.bootstrap.mockResolvedValue(productionAvailableSnapshot);
    mockedJourneyProgressService.markNodeCompleted
      .mockResolvedValueOnce(productionAvailableSnapshot).mockResolvedValue(productionCompletedSnapshot);
    renderWithProviders(<CheckpointScreen nodeId={productionNodeId} />);
    await answerProductionCheckpoint(true);
    expect(await screen.findByText('Não foi possível concluir a avaliação agora.')).toBeTruthy();
    fireEvent.press(screen.getByText('Concluir avaliação registrada'));
    await waitFor(() => expect(mockedJourneyProgressService.markNodeCompleted).toHaveBeenCalledTimes(2));
    expect(mockedLessonOutcome.recordAssessmentApproval).toHaveBeenCalledTimes(1);
  });

  // ADR 2026-09-24, decisão 2: numa mesma tentativa, cada pergunta custa no
  // máximo uma vida, mesmo que o aluno saia e volte. A tentativa vai do
  // "Começar avaliação" até o envio.
  describe('uma vida por pergunta por tentativa', () => {
    async function errarAPrimeiraPergunta(): Promise<void> {
      fireEvent.press(await screen.findByText('Começar avaliação'));
      const item = productionStageItems[0];
      expect(await screen.findByText(item.prompt)).toBeTruthy();
      const wrong = item.options.find(option => option.id !== item.correctOptionId)!;
      fireEvent.press(screen.getByLabelText(wrong.label));
      fireEvent.press(screen.getByText('Próxima questão'));
      expect(await screen.findByText(productionStageItems[1].prompt)).toBeTruthy();
    }

    it('errar, sair e errar de novo a mesma pergunta cobra uma vida, não duas', async () => {
      const heartsRepository = require('../../hearts/HeartsRepository').heartsRepository as { spend: jest.Mock };
      mockedJourneyProgressService.bootstrap.mockResolvedValue(productionAvailableSnapshot);

      const primeiraVisita = renderWithProviders(<CheckpointScreen nodeId={productionNodeId} />);
      await errarAPrimeiraPergunta();
      expect(heartsRepository.spend).toHaveBeenCalledTimes(1);
      primeiraVisita.unmount();

      renderWithProviders(<CheckpointScreen nodeId={productionNodeId} />);
      await errarAPrimeiraPergunta();

      expect(heartsRepository.spend).toHaveBeenCalledTimes(1);
    });

    it('o envio reprovado encerra a tentativa: a seguinte cobra de novo', async () => {
      const heartsRepository = require('../../hearts/HeartsRepository').heartsRepository as { spend: jest.Mock };
      mockedJourneyProgressService.bootstrap.mockResolvedValue(productionAvailableSnapshot);

      const tentativaReprovada = renderWithProviders(<CheckpointScreen nodeId={productionNodeId} />);
      await answerProductionCheckpoint(false);
      expect(await screen.findByText('Reforço necessário antes de tentar novamente')).toBeTruthy();
      expect(heartsRepository.spend).toHaveBeenCalledTimes(productionStageItems.length);
      tentativaReprovada.unmount();

      for (const activity of MATERIA_ENERGIA_E_RADIACAO_PRODUCTION_BATCH.activities.filter(entry => entry.competencyIds.includes(productionStageCompetencyId))) {
        const answers = Object.fromEntries(activity.steps.flatMap(step => step.kind === 'interaction' ? [[step.interaction.id, true]] : []));
        await assessmentAttemptRepository.completeActivity(activity, answers);
      }

      renderWithProviders(<CheckpointScreen nodeId={productionNodeId} />);
      await errarAPrimeiraPergunta();

      expect(heartsRepository.spend).toHaveBeenCalledTimes(productionStageItems.length + 1);
    });

    it('o envio aprovado apaga a lista de perguntas cobradas do nó', async () => {
      mockedJourneyProgressService.bootstrap.mockResolvedValue(productionAvailableSnapshot);
      mockedJourneyProgressService.markNodeCompleted.mockResolvedValue(productionCompletedSnapshot);

      const tentativaAbandonada = renderWithProviders(<CheckpointScreen nodeId={productionNodeId} />);
      await errarAPrimeiraPergunta();
      tentativaAbandonada.unmount();

      renderWithProviders(<CheckpointScreen nodeId={productionNodeId} />);
      await answerProductionCheckpoint(true);
      expect(await screen.findByText('Avaliação concluída')).toBeTruthy();

      const stored = JSON.parse(await AsyncStorage.getItem('@radiant:checkpoint_charged_items_v1') ?? '{}');
      expect(stored[productionNodeId]).toBeUndefined();
    });
  });

  // FILA, 35: errar numa avaliação debita a vida, e quem enxerga vê o coração
  // cair no HUD. O leitor de tela passa a ouvir a mesma frase da lição (FILA,
  // 25). A avaliação não diz se a resposta estava certa, então o anúncio é só
  // o da vida.
  describe('anúncio da perda de vida ao leitor de tela', () => {
    const heartsRepository = () =>
      require('../../hearts/HeartsRepository').heartsRepository as { getSnapshot: jest.Mock; spend: jest.Mock };
    const vidas = (count: number, status: string) => ({ count, status, nextRefillAt: null, unlimitedUntil: null });
    let announce: jest.SpyInstance;
    const anunciosDeVida = () =>
      announce.mock.calls.map(([texto]) => texto as string).filter((texto) => /vida/u.test(texto));

    async function responderAPrimeira(certa: boolean): Promise<void> {
      fireEvent.press(await screen.findByText('Começar avaliação'));
      const item = productionStageItems[0];
      expect(await screen.findByText(item.prompt)).toBeTruthy();
      const opcao = item.options.find(option => (option.id === item.correctOptionId) === certa)!;
      fireEvent.press(screen.getByLabelText(opcao.label));
      fireEvent.press(screen.getByText('Próxima questão'));
      expect(await screen.findByText(productionStageItems[1].prompt)).toBeTruthy();
    }

    beforeEach(() => {
      announce = jest.spyOn(AccessibilityInfo, 'announceForAccessibility').mockImplementation(() => undefined);
      mockedJourneyProgressService.bootstrap.mockResolvedValue(productionAvailableSnapshot);
    });

    afterEach(() => {
      announce.mockRestore();
      // Os padrões do mock do módulo, para não vazar para os testes seguintes.
      heartsRepository().getSnapshot.mockResolvedValue(vidas(5, 'full'));
      heartsRepository().spend.mockResolvedValue(vidas(4, 'recovering'));
    });

    it('errar anuncia a vida perdida e quantas restam', async () => {
      heartsRepository().getSnapshot.mockResolvedValue(vidas(5, 'full'));
      heartsRepository().spend.mockResolvedValue(vidas(4, 'recovering'));
      renderWithProviders(<CheckpointScreen nodeId={productionNodeId} />);

      await responderAPrimeira(false);

      expect(anunciosDeVida()).toEqual(['Você perdeu uma vida; restam 4.']);
    });

    it('errar com a última vida anuncia que foi a última', async () => {
      heartsRepository().getSnapshot.mockResolvedValue(vidas(1, 'recovering'));
      heartsRepository().spend.mockResolvedValue(vidas(0, 'empty'));
      renderWithProviders(<CheckpointScreen nodeId={productionNodeId} />);

      fireEvent.press(await screen.findByText('Começar avaliação'));
      const item = productionStageItems[0];
      fireEvent.press(await screen.findByLabelText(item.options.find(option => option.id !== item.correctOptionId)!.label));
      fireEvent.press(screen.getByText('Próxima questão'));

      expect(await screen.findByText('Checkpoint pausado por falta de vidas')).toBeTruthy();
      expect(anunciosDeVida()).toEqual(['Você perdeu sua última vida.']);
    });

    it('o assinante não ouve nada sobre vidas', async () => {
      heartsRepository().getSnapshot.mockResolvedValue(vidas(0, 'unlimited'));
      heartsRepository().spend.mockResolvedValue(vidas(0, 'unlimited'));
      renderWithProviders(<CheckpointScreen nodeId={productionNodeId} />);

      await responderAPrimeira(false);

      expect(heartsRepository().spend).toHaveBeenCalledTimes(1);
      expect(anunciosDeVida()).toEqual([]);
    });

    it('acertar não anuncia perda', async () => {
      renderWithProviders(<CheckpointScreen nodeId={productionNodeId} />);

      await responderAPrimeira(true);

      expect(anunciosDeVida()).toEqual([]);
    });

    it('a mesma pergunta, errada de novo na mesma tentativa, não anuncia de novo', async () => {
      const primeiraVisita = renderWithProviders(<CheckpointScreen nodeId={productionNodeId} />);
      await responderAPrimeira(false);
      primeiraVisita.unmount();

      renderWithProviders(<CheckpointScreen nodeId={productionNodeId} />);
      await responderAPrimeira(false);

      expect(heartsRepository().spend).toHaveBeenCalledTimes(1);
      expect(anunciosDeVida()).toEqual(['Você perdeu uma vida; restam 4.']);
    });
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

    fireEvent.press(await screen.findByText('Começar avaliação'));
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

    fireEvent.press(await screen.findByText('Começar avaliação'));
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
      fireEvent.press(await screen.findByText('Começar avaliação'));
      expect(await screen.findByText('Checkpoint pausado por falta de vidas')).toBeTruthy();
    }

    afterEach(() => {
      heartsRepository().getSnapshot.mockResolvedValue({ count: 5, status: 'full', nextRefillAt: null, unlimitedUntil: null });
    });

    it('T12 a folha aberta some ao voltar ilimitado sem fechar antes', async () => {
      await bloquearNaEntrada();
      heartsRepository().getSnapshot.mockResolvedValue(ilimitada);
      voltarParaATela();
      // A releitura é uma Promise: drene-a antes da asserção negativa.
      // Serializar o Fiber ainda aberto dentro de waitFor custa a janela em CPU limitada.
      await act(async () => {});
      expect(screen.queryByText('Checkpoint pausado por falta de vidas')).toBeNull();
    });

    it('T12 não oferece revisão global que não pertence à unidade ativa', async () => {
      heartsRepository().getSnapshot.mockResolvedValue(vazia);
      mockedJourneyProgressService.getSnapshotForNode.mockResolvedValue({ ...productionAvailableSnapshot, dueReviewCount: 9 } as any);
      renderWithProviders(<CheckpointScreen nodeId={productionNodeId} />);
      await act(async () => {});
      fireEvent.press(await screen.findByText('Começar avaliação'));
      expect(await screen.findByText('Checkpoint pausado por falta de vidas')).toBeTruthy();
      expect(screen.queryByText('Revisar pela folha')).toBeNull();
    });

    it('T12 conta só revisões da unidade ativa e fecha antes de revisar', async () => {
      heartsRepository().getSnapshot.mockResolvedValue(vazia);
      const snapshot = { ...productionAvailableSnapshot, dueReviewCount: 9, track: {
        ...productionAvailableSnapshot.track, units: [
          { ...productionAvailableSnapshot.track.units[0], nodes: [
            ...productionAvailableSnapshot.track.units[0].nodes,
            { id: 'due-active', type: 'review', status: 'due-review', unitId: productionAvailableSnapshot.track.units[0].id },
          ] },
        ],
      } };
      mockedJourneyProgressService.getSnapshotForNode.mockResolvedValue(snapshot as any);
      renderWithProviders(<CheckpointScreen nodeId={productionNodeId} />);
      await act(async () => {});
      fireEvent.press(await screen.findByText('Começar avaliação'));
      expect(await screen.findByText('A revisar: 1')).toBeTruthy();
      fireEvent.press(screen.getByText('Revisar pela folha'));
      expect(mockedRouter.replace).toHaveBeenCalledWith('/review');
      expect(screen.queryByText('Checkpoint pausado por falta de vidas')).toBeNull();
      expect(mockedJourneyProgressService.markNodeCompleted).not.toHaveBeenCalled();
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
      fireEvent.press(screen.getByText('Começar avaliação'));

      expect(await screen.findByText(productionStageItems[0].prompt)).toBeTruthy();
      expect(screen.queryByText('Checkpoint pausado por falta de vidas')).toBeNull();
    });
  });

  it('a checkpoint without an assessment cannot be completed by a legacy button', async () => {
    renderWithProviders(<CheckpointScreen nodeId="checkpoint-1" />);
    await waitFor(() => expect(mockedRouter.dismissTo).toHaveBeenCalledWith('/(tabs)'));
    expect(screen.queryByText('Concluir checkpoint')).toBeNull();
    expect(screen.queryByText('Começar avaliação')).toBeNull();
    expect(mockedJourneyProgressService.markNodeCompleted).not.toHaveBeenCalled();
    expect(mockedRouter.dismissTo).toHaveBeenCalledWith('/(tabs)');
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

  // FILA, 13 (decidido pelo dono em 2026-10-09): aprovar rende XP pela regra
  // da lição, e a celebração mostra o ganho e o total depois dele. Antes, a
  // aprovação só concluía o nó, e a caixa repetia o total lido ao abrir a tela.
  describe('XP da aprovação', () => {
    const award = { baseXp: 10, bonusXp: 8, totalXpAwarded: 18, reason: 'quiz_complete' as const };

    beforeEach(() => {
      mockedJourneyProgressService.bootstrap.mockResolvedValue(productionAvailableSnapshot);
      mockedJourneyProgressService.markNodeCompleted.mockResolvedValue(productionCompletedSnapshot);
    });

    it('credita o XP antes de concluir o nó, com os acertos da avaliação', async () => {
      mockedLessonOutcome.recordAssessmentApproval.mockResolvedValue({ award, rewarded: true });

      renderWithProviders(<CheckpointScreen nodeId={productionNodeId} />);
      await answerProductionCheckpoint(true);

      await waitFor(() => {
        expect(mockedJourneyProgressService.markNodeCompleted).toHaveBeenCalledWith(productionNodeId);
      });
      expect(mockedLessonOutcome.recordAssessmentApproval).toHaveBeenCalledWith(expect.objectContaining({
        nodeId: productionNodeId,
        totalQuestions: productionStageItems.length,
        correctAnswers: productionStageItems.length,
      }));
      // O backup do iCloud sai da conclusão e leva o XP: creditar depois dela
      // mandaria para a nuvem o total de antes.
      expect(mockedLessonOutcome.recordAssessmentApproval.mock.invocationCallOrder[0])
        .toBeLessThan(mockedJourneyProgressService.markNodeCompleted.mock.invocationCallOrder[0]);
    });

    it('a celebração mostra o ganho e o total depois dele', async () => {
      mockedLessonOutcome.recordAssessmentApproval.mockResolvedValue({ award, rewarded: true });
      mockedGamification.getSnapshot
        .mockResolvedValueOnce({ totalXp: 120, streakDays: 3 } as any)
        .mockResolvedValue({ totalXp: 138, streakDays: 3 } as any);

      renderWithProviders(<CheckpointScreen nodeId={productionNodeId} />);
      await answerProductionCheckpoint(true);

      expect(await screen.findByText('+18 XP')).toBeTruthy();
      expect(screen.getByText('XP total: 138')).toBeTruthy();
      expect(screen.queryByText('XP total: 120')).toBeNull();
    });

    // FILA 63 (2026-10-18): este sorteio fazia o `attemptId` terminar em
    // "rg5i…", o detector de dado sensível recusava o id no journal, e a
    // aprovação caía em "Nao foi possivel registrar o checkpoint agora." — a
    // falha do CI da PR #51, que ocorria em ~1 de 1.600 envios.
    it('o sorteio do id não impede o registro da aprovação', async () => {
      const random = jest.spyOn(Math, 'random').mockReturnValue(0.7624635631001372);
      mockedLessonOutcome.recordAssessmentApproval.mockResolvedValue({ award, rewarded: true });
      try {
        renderWithProviders(<CheckpointScreen nodeId={productionNodeId} />);
        await answerProductionCheckpoint(true);

        expect(await screen.findByText('+18 XP')).toBeTruthy();
        expect(screen.queryByText(/Não foi possível registrar a avaliação/u)).toBeNull();
        expect(await itemReviewRepository.getAttempts()).toHaveLength(productionStageItems.length);
      } finally {
        random.mockRestore();
      }
    });

    it('sem crédito, a celebração mostra só o total', async () => {
      renderWithProviders(<CheckpointScreen nodeId={productionNodeId} />);
      await answerProductionCheckpoint(true);

      expect(await screen.findByText('XP total: 120')).toBeTruthy();
      expect(screen.queryByText(/^\+/u)).toBeNull();
    });

    it('reprovar não credita XP', async () => {
      renderWithProviders(<CheckpointScreen nodeId={productionNodeId} />);
      await answerProductionCheckpoint(false);

      expect(await screen.findByText('Reforço necessário antes de tentar novamente')).toBeTruthy();
      expect(mockedLessonOutcome.recordAssessmentApproval).not.toHaveBeenCalled();
    });
  });

  // Achado 1 do gate H4 (2026-09-24): a tela ainda descrevia a avaliação única
  // de dez itens, anterior a 2026-08-21 — "Responda 10 questões… acerte pelo
  // menos 8" na abertura e "exige 8 acertos" no reforço —, numa avaliação de
  // dois itens. Cada asserção de ausência vem com a de presença do texto certo.
  it('descreve na abertura a avaliação que o aluno vai fazer, não a antiga de dez itens', async () => {
    expect(productionStageItems).toHaveLength(2);
    mockedJourneyProgressService.bootstrap.mockResolvedValue(productionAvailableSnapshot);

    renderWithProviders(<CheckpointScreen nodeId={productionNodeId} />);

    expect(await screen.findByText('Responda as 2 questões. Para avançar, acerte todas.')).toBeTruthy();
    expect(screen.queryByText(/10 questões/u)).toBeNull();
  });

  it('diz no reforço quantos acertos esta avaliação exige', async () => {
    mockedJourneyProgressService.bootstrap.mockResolvedValue(productionAvailableSnapshot);

    renderWithProviders(<CheckpointScreen nodeId={productionNodeId} />);
    await answerProductionCheckpoint(false);

    expect(await screen.findByText(/A aprovação exige 2 acertos\./u)).toBeTruthy();
    expect(screen.queryByText(/8 acertos/u)).toBeNull();
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

  it('sair e voltar após reprovar preserva o reforço e impede uma nova tentativa', async () => {
    mockedJourneyProgressService.bootstrap.mockResolvedValue(productionAvailableSnapshot);
    const first = renderWithProviders(<CheckpointScreen nodeId={productionNodeId} />);
    await answerProductionCheckpoint(false);
    expect(await screen.findByText('Reforço necessário antes de tentar novamente')).toBeTruthy();
    first.unmount();
    renderWithProviders(<CheckpointScreen nodeId={productionNodeId} />);
    expect(await screen.findByText('Reforço necessário antes de tentar novamente')).toBeTruthy();
    expect(screen.queryByText('Começar avaliação')).toBeNull();
  });

  it('concluir o reforço permite uma nova tentativa ao reabrir a tela', async () => {
    mockedJourneyProgressService.bootstrap.mockResolvedValue(productionAvailableSnapshot);
    const first = renderWithProviders(<CheckpointScreen nodeId={productionNodeId} />);
    await answerProductionCheckpoint(false);
    expect(await screen.findByText('Reforço necessário antes de tentar novamente')).toBeTruthy();
    first.unmount();
    for (const activity of MATERIA_ENERGIA_E_RADIACAO_PRODUCTION_BATCH.activities.filter(entry => entry.competencyIds.includes(productionStageCompetencyId))) {
      await assessmentAttemptRepository.completeActivity(activity, Object.fromEntries(activity.steps.flatMap(step => step.kind === 'interaction' ? [[step.interaction.id, true]] : [])));
    }
    renderWithProviders(<CheckpointScreen nodeId={productionNodeId} />);
    const start = await screen.findByText('Começar avaliação');
    await waitFor(() => expect(screen.queryByText('Reforço necessário antes de tentar novamente')).toBeNull());
    fireEvent.press(start);
    expect(await screen.findByText(productionStageItems[0].prompt)).toBeTruthy();
  });

  it('voltar do reforço na mesma instância inicia na primeira questão, sem reutilizar respostas antigas', async () => {
    mockedJourneyProgressService.bootstrap.mockResolvedValue(productionAvailableSnapshot);
    renderWithProviders(<CheckpointScreen nodeId={productionNodeId} />);
    await answerProductionCheckpoint(false);
    expect(await screen.findByText('Reforço necessário antes de tentar novamente')).toBeTruthy();
    for (const activity of MATERIA_ENERGIA_E_RADIACAO_PRODUCTION_BATCH.activities.filter(entry => entry.competencyIds.includes(productionStageCompetencyId))) {
      await assessmentAttemptRepository.completeActivity(activity, Object.fromEntries(activity.steps.flatMap(step => step.kind === 'interaction' ? [[step.interaction.id, true]] : [])));
    }
    voltarParaATela();
    fireEvent.press(await screen.findByText('Começar avaliação'));
    expect(await screen.findByText(productionStageItems[0].prompt)).toBeTruthy();
    expect(screen.queryByText(productionStageItems[1].prompt)).toBeNull();
    const firstItem = productionStageItems[0];
    fireEvent.press(screen.getByLabelText(firstItem.options.find(option => option.id === firstItem.correctOptionId)!.label));
    fireEvent.press(screen.getByText('Próxima questão'));
    expect(await screen.findByText(productionStageItems[1].prompt)).toBeTruthy();
    voltarParaATela();
    await waitFor(() => expect(screen.getByText(productionStageItems[1].prompt)).toBeTruthy());
    expect(screen.queryByText('Começar avaliação')).toBeNull();
  });
});
