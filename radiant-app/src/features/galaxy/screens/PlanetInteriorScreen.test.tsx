import React from 'react';
import { render } from '@testing-library/react-native';
import { LessonNode } from './PlanetInteriorScreen';
import { useReducedMotionPreferenceState } from '@/src/ui/accessibility/useReducedMotionPreference';
import type { JourneyNode } from '@/src/types/journey';

jest.mock('@/src/ui/accessibility/useReducedMotionPreference', () => ({
  useReducedMotionPreferenceState: jest.fn(() => ({ reducedMotionEnabled: false, resolved: true })),
}));

jest.mock('expo-router', () => ({
  useLocalSearchParams: () => ({}),
  useRouter: () => ({ push: jest.fn(), back: jest.fn(), replace: jest.fn() }),
}));

jest.mock('@/src/features/gamification/services/GamificationService', () => ({
  GamificationService: { getSnapshot: jest.fn().mockResolvedValue(null) },
}));

jest.mock('../components/PlanetBody', () => ({
  PlanetBody: () => null,
}));

jest.mock('@/src/ui/components/StarfieldBackground', () => ({
  StarfieldBackground: () => null,
}));

jest.mock('@/src/ui/components/HUD', () => ({
  HUD: () => null,
}));

// Ver a nota em GalaxyInteriorScreen.test.tsx: o requisito é comportamental
// ("nada entra em movimento"), e sob o mock do Reanimated a escrita em shared
// value não chega à árvore renderizada.
jest.mock('react-native-reanimated', () => {
  const actual = jest.requireActual('react-native-reanimated/mock');
  return {
    ...actual,
    __esModule: true,
    default: actual.default ?? actual,
    withSpring: jest.fn((value) => value),
    withTiming: jest.fn((value) => value),
    withRepeat: jest.fn((value) => value),
  };
});

const reanimated = jest.requireMock('react-native-reanimated') as {
  withSpring: jest.Mock;
  withTiming: jest.Mock;
  withRepeat: jest.Mock;
};

const mockedPreference = useReducedMotionPreferenceState as jest.MockedFunction<
  typeof useReducedMotionPreferenceState
>;

function makeNode(status: JourneyNode['status']): JourneyNode {
  return {
    id: `node-${status}`,
    unitId: 'unit-teste',
    type: 'lesson',
    title: 'Nó de teste',
    status,
  };
}

// Índice 3 = 180ms de atraso na cascata.
const CASCADE_INDEX = 3;
const CASCADE_DELAY_MS = CASCADE_INDEX * 60;

function renderNode(status: JourneyNode['status'] = 'available') {
  const node = makeNode(status);
  return {
    node,
    ...render(<LessonNode node={node} index={CASCADE_INDEX} onPress={jest.fn()} accentColor="#4D7FFF" />),
  };
}

describe('LessonNode — entrada em cascata e preferência de movimento', () => {
  beforeEach(() => {
    jest.useFakeTimers();
    jest.clearAllMocks();
    mockedPreference.mockReturnValue({ reducedMotionEnabled: false, resolved: true });
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('não agenda nada enquanto a preferência é desconhecida', () => {
    mockedPreference.mockReturnValue({ reducedMotionEnabled: false, resolved: false });

    renderNode();
    jest.advanceTimersByTime(10_000);

    expect(reanimated.withSpring).not.toHaveBeenCalled();
    expect(reanimated.withTiming).not.toHaveBeenCalled();
  });

  it('não inicia laço contínuo no nó ativo enquanto a preferência é desconhecida', () => {
    // O glow do nó ativo é `withRepeat(..., -1)`: um laço infinito. Começá-lo
    // antes de saber é pior que a cascata, porque ele não termina sozinho.
    mockedPreference.mockReturnValue({ reducedMotionEnabled: false, resolved: false });

    renderNode('active');
    jest.advanceTimersByTime(10_000);

    expect(reanimated.withRepeat).not.toHaveBeenCalled();
  });

  it('não anima quando a preferência resolve pedindo menos movimento', () => {
    mockedPreference.mockReturnValue({ reducedMotionEnabled: true, resolved: true });

    renderNode('active');
    jest.advanceTimersByTime(10_000);

    expect(reanimated.withSpring).not.toHaveBeenCalled();
    expect(reanimated.withTiming).not.toHaveBeenCalled();
    expect(reanimated.withRepeat).not.toHaveBeenCalled();
  });

  it('anima a entrada e o glow quando a preferência resolve sem redução', () => {
    renderNode('active');

    expect(reanimated.withSpring).not.toHaveBeenCalled();
    // O glow do nó ativo não passa pelo timeout — ele começa junto do efeito.
    expect(reanimated.withRepeat).toHaveBeenCalled();

    jest.advanceTimersByTime(CASCADE_DELAY_MS);

    expect(reanimated.withSpring).toHaveBeenCalled();
    expect(reanimated.withTiming).toHaveBeenCalled();
  });

  it('não deixa o timeout sobreviver à virada da preferência', () => {
    // A primeira passada precisa AGENDAR, senão não há o que limpar e o caso
    // não consegue falhar: com `resolved: false` o efeito volta antes do
    // `setTimeout` e o teste passaria pelo gate, duplicando o caso acima.
    // Então: resolvida e sem redução (a cascata é agendada), a preferência
    // vira antes de o timeout vencer, e o que a limpeza tem de garantir é que
    // ele nunca dispare.
    mockedPreference.mockReturnValue({ reducedMotionEnabled: false, resolved: true });
    const view = renderNode();

    // Meio caminho até o disparo: agendado, ainda não vencido.
    jest.advanceTimersByTime(CASCADE_DELAY_MS / 2);
    expect(reanimated.withSpring).not.toHaveBeenCalled();

    mockedPreference.mockReturnValue({ reducedMotionEnabled: true, resolved: true });
    view.rerender(
      <LessonNode node={view.node} index={CASCADE_INDEX} onPress={jest.fn()} accentColor="#4D7FFF" />
    );

    jest.advanceTimersByTime(10_000);

    expect(reanimated.withSpring).not.toHaveBeenCalled();
    expect(reanimated.withTiming).not.toHaveBeenCalled();
  });

  it('não deixa o timeout sobreviver à desmontagem', () => {
    const view = renderNode();

    view.unmount();
    jest.advanceTimersByTime(10_000);

    expect(reanimated.withSpring).not.toHaveBeenCalled();
    expect(reanimated.withTiming).not.toHaveBeenCalled();
  });
});
