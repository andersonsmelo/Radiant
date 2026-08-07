import React from 'react';
import { render } from '@testing-library/react-native';
import { BodyCard } from './GalaxyInteriorScreen';
import { useReducedMotionPreferenceState } from '@/src/ui/accessibility/useReducedMotionPreference';
import type { CelestialBody } from '@/src/types/galaxy';

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

// Espionar os construtores de animação é o que torna o teste honesto: sob o
// mock do Reanimated, a escrita num shared value não chega ao `toJSON()`, então
// afirmar opacidade lida da árvore mede o valor INICIAL — o mesmo com o gate
// ligado ou desligado. O requisito é comportamental ("nada entra em movimento"),
// e é isso que se observa aqui. Mesma escolha, e mesma razão, de
// PlanetBody.test.tsx.
jest.mock('react-native-reanimated', () => {
  const actual = jest.requireActual('react-native-reanimated/mock');
  return {
    ...actual,
    __esModule: true,
    default: actual.default ?? actual,
    withSpring: jest.fn((value) => value),
    withTiming: jest.fn((value) => value),
  };
});

// O espião vem do registro de mocks, e não de um import direto, porque a regra
// R4 do `visual:qa:strict` reprova qualquer import de `react-native-reanimated`
// fora de `src/ui/motion.ts`.
const reanimated = jest.requireMock('react-native-reanimated') as {
  withSpring: jest.Mock;
  withTiming: jest.Mock;
};

const mockedPreference = useReducedMotionPreferenceState as jest.MockedFunction<
  typeof useReducedMotionPreferenceState
>;

const body: CelestialBody = {
  id: 'body-teste',
  galaxyId: 'galaxy-teste',
  title: 'Corpo de teste',
  bodyType: 'planet',
  size: 'md',
  status: 'available',
  hasRing: false,
  surfaceConfig: {
    type: 'ice',
    glowColor: 'rgba(61, 202, 232, 0.4)',
    atmosphereColor: 'rgba(61, 202, 232, 0.2)',
  },
  mapPosition: { x: 0.5, y: 0.5 },
  nodes: [],
};

// Índice 3 = 240ms de atraso na cascata. É o bastante para separar "agendou" de
// "não agendou" sem depender de nenhum tempo real.
const CASCADE_INDEX = 3;
const CASCADE_DELAY_MS = CASCADE_INDEX * 80;

function renderCard() {
  return render(<BodyCard body={body} index={CASCADE_INDEX} onPress={jest.fn()} />);
}

describe('BodyCard — entrada em cascata e preferência de movimento', () => {
  beforeEach(() => {
    jest.useFakeTimers();
    jest.clearAllMocks();
    mockedPreference.mockReturnValue({ reducedMotionEnabled: false, resolved: true });
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('não agenda nada enquanto a preferência é desconhecida', () => {
    // O defeito: `useReducedMotionPreference` devolvia `false` na primeira
    // renderização e resolvia depois. Com `index * 80`, os primeiros corpos
    // entravam animados antes de a resposta chegar — a preferência valia só
    // para os de índice alto.
    mockedPreference.mockReturnValue({ reducedMotionEnabled: false, resolved: false });

    renderCard();
    jest.advanceTimersByTime(10_000);

    expect(reanimated.withSpring).not.toHaveBeenCalled();
    expect(reanimated.withTiming).not.toHaveBeenCalled();
  });

  it('não anima quando a preferência resolve pedindo menos movimento', () => {
    mockedPreference.mockReturnValue({ reducedMotionEnabled: true, resolved: true });

    renderCard();
    jest.advanceTimersByTime(10_000);

    expect(reanimated.withSpring).not.toHaveBeenCalled();
    expect(reanimated.withTiming).not.toHaveBeenCalled();
  });

  it('anima a entrada quando a preferência resolve sem redução', () => {
    // A contraprova: sem ela, "não anima nunca" passaria os dois testes acima.
    renderCard();

    expect(reanimated.withSpring).not.toHaveBeenCalled();

    jest.advanceTimersByTime(CASCADE_DELAY_MS);

    expect(reanimated.withSpring).toHaveBeenCalled();
    expect(reanimated.withTiming).toHaveBeenCalled();
  });

  it('não deixa o timeout sobreviver à virada da preferência', () => {
    // O vazamento: o efeito antigo não devolvia limpeza, então o timeout já
    // agendado disparava depois de a preferência ter virado — animando
    // exatamente para quem pediu para não ver animação.
    //
    // A primeira passada precisa AGENDAR. Com `resolved: false` o efeito volta
    // antes do `setTimeout` e não haveria o que limpar: o caso passaria pelo
    // gate e não conseguiria falhar, duplicando o teste de preferência
    // indeterminada. Então começa resolvida e sem redução.
    mockedPreference.mockReturnValue({ reducedMotionEnabled: false, resolved: true });
    const view = renderCard();

    // Meio caminho até o disparo: agendado, ainda não vencido.
    jest.advanceTimersByTime(CASCADE_DELAY_MS / 2);
    expect(reanimated.withSpring).not.toHaveBeenCalled();

    mockedPreference.mockReturnValue({ reducedMotionEnabled: true, resolved: true });
    view.rerender(<BodyCard body={body} index={CASCADE_INDEX} onPress={jest.fn()} />);

    jest.advanceTimersByTime(10_000);

    expect(reanimated.withSpring).not.toHaveBeenCalled();
    expect(reanimated.withTiming).not.toHaveBeenCalled();
  });

  it('não deixa o timeout sobreviver à desmontagem', () => {
    const view = renderCard();

    view.unmount();
    jest.advanceTimersByTime(10_000);

    expect(reanimated.withSpring).not.toHaveBeenCalled();
    expect(reanimated.withTiming).not.toHaveBeenCalled();
  });
});
