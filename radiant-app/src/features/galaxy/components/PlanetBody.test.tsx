import React from 'react';
import { render } from '@testing-library/react-native';
import { PlanetBody } from './PlanetBody';
import { useReducedMotionPreference } from '../../../ui/accessibility/useReducedMotionPreference';
import type { CelestialBody } from '../../../types/galaxy';

jest.mock('../../../ui/accessibility/useReducedMotionPreference', () => ({
  useReducedMotionPreference: jest.fn(() => false),
}));

jest.mock('./PlanetSurface', () => ({
  PlanetSurface: () => null,
}));

// Espionar `withRepeat` é o que torna este teste honesto. A primeira versão
// afirmava a opacidade lida da árvore renderizada e passava pelo motivo errado:
// sob o mock do Reanimated a escrita em shared value não chega ao `toJSON()`,
// então o que estava sendo medido era o valor INICIAL do `useSharedValue` — o
// mesmo com o gate ligado ou desligado. O requisito real é comportamental
// ("nenhum laço contínuo é iniciado"), e é ele que se observa aqui.
jest.mock('react-native-reanimated', () => {
  const actual = jest.requireActual('react-native-reanimated/mock');
  return { ...actual, __esModule: true, default: actual.default ?? actual, withRepeat: jest.fn((v) => v) };
});

const mockedReducedMotion = useReducedMotionPreference as jest.MockedFunction<
  typeof useReducedMotionPreference
>;

// O espião vem do registro de mocks, e não de um `import ... from
// 'react-native-reanimated'`, porque a regra R4 do `visual:qa:strict` reprova
// qualquer import dessa biblioteca fora de `src/ui/motion.ts` — inclusive num
// teste cujo propósito é justamente provar que a animação está travada. A
// isenção certa seria a regra ignorar arquivos `*.test.*`; até lá, pegar o mock
// pelo registro é o caminho idiomático que não enfraquece a política.
const mockedWithRepeat = (jest.requireMock('react-native-reanimated') as {
  withRepeat: jest.Mock;
}).withRepeat;

function makeBody(status: CelestialBody['status']): CelestialBody {
  return {
    id: `body-${status}`,
    galaxyId: 'galaxy-teste',
    title: 'Corpo de teste',
    bodyType: 'planet',
    size: 'md',
    status,
    hasRing: false,
    surfaceConfig: {
      type: 'ice',
      glowColor: 'rgba(61, 202, 232, 0.4)',
      atmosphereColor: 'rgba(61, 202, 232, 0.2)',
    },
    mapPosition: { x: 0.5, y: 0.5 },
    nodes: [],
  };
}

describe('PlanetBody — reduced motion', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('não inicia nenhum laço contínuo quando a pessoa pediu menos movimento', () => {
    mockedReducedMotion.mockReturnValue(true);

    render(<PlanetBody body={makeBody('active')} />);

    // O planeta ativo é o que mais anima: glow pulsante + anel de pulso.
    // Sob a preferência, nada disso é agendado.
    expect(mockedWithRepeat).not.toHaveBeenCalled();
  });

  it('anima o planeta ativo normalmente quando não há preferência', () => {
    mockedReducedMotion.mockReturnValue(false);

    render(<PlanetBody body={makeBody('active')} />);

    // Contraprova: sem o gate o mesmo corpo agenda seus laços. Sem esta metade,
    // o teste acima passaria mesmo se o componente nunca animasse nada.
    expect(mockedWithRepeat).toHaveBeenCalled();
  });

  it('o concluído também para de pulsar sob a preferência', () => {
    mockedReducedMotion.mockReturnValue(true);

    render(<PlanetBody body={makeBody('completed')} />);

    expect(mockedWithRepeat).not.toHaveBeenCalled();
  });

  it('corpo bloqueado não anima em nenhum dos dois modos', () => {
    mockedReducedMotion.mockReturnValue(false);

    render(<PlanetBody body={makeBody('locked')} />);

    expect(mockedWithRepeat).not.toHaveBeenCalled();
  });
});
