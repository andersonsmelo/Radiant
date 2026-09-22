import React from 'react';
import { fireEvent, render } from '@testing-library/react-native';
import { SlicingSpaceLessonPreview, reviewSentence } from './SlicingSpaceLessonPreview';

// O mock antigo devolvia `true` de forma síncrona e, com isso, escondia a
// violação de Reduce Motion na primeira renderização: o ramo "preferência
// ainda desconhecida" nunca era exercitado. Este é controlável, e há teste
// para os dois estados.
const motionPreference = { reducedMotionEnabled: true, resolved: true };
jest.mock('../../../ui/accessibility/useReducedMotionPreference', () => ({
  useReducedMotionPreferenceState: () => motionPreference,
  useReducedMotionPreference: () => motionPreference.reducedMotionEnabled,
}));

beforeEach(() => {
  motionPreference.reducedMotionEnabled = true;
  motionPreference.resolved = true;
});
jest.mock('../../../ui/motion', () => {
  const ReactActual = jest.requireActual('react');
  const { Animated } = jest.requireActual('react-native');
  return {
    // A prévia renderiza SlicingSpaceModel, que consome este helper. As
    // identidades precisam ser estáveis: slideTo/settle estão nas dependências
    // do efeito do modelo, e recriá-los a cada render o faria reentrar.
    useSlideToPosition: (startValue: number) => {
      const position = ReactActual.useRef(new Animated.Value(startValue)).current;
      const settle = ReactActual.useCallback((toValue: number) => position.setValue(toValue), [position]);
      const slideTo = ReactActual.useCallback((toValue: number, onFinished?: (finished: boolean) => void) => {
        position.setValue(toValue);
        onFinished?.(true);
        return () => undefined;
      }, [position]);
      return { position, settle, slideTo };
    },
  };
});

describe('SlicingSpaceLessonPreview', () => {
  it('separa decisão inicial, prática assistida e recuperação independente depois de erro sobre plano mediano', () => {
    const { getByLabelText, getByText, getByTestId, queryByText } = render(<SlicingSpaceLessonPreview />);

    expect(getByText('Diagnóstico inicial · sem XP')).toBeTruthy();
    fireEvent.press(getByLabelText('Selecionar opção 2. Uma placa vertical paralela, deslocada para um lado.'));
    fireEvent.press(getByText('Confirmar decisão'));
    expect(getByText(/Só o que passa pela linha mediana é mediano/i)).toBeTruthy();
    fireEvent.press(getByText('Praticar com apoio'));

    expect(getByText('Prática assistida · não demonstra domínio')).toBeTruthy();
    fireEvent.press(getByLabelText('Selecionar opção 2. Uma placa vertical paralela, deslocada para um lado.'));
    fireEvent.press(getByText('Confirmar decisão'));
    fireEvent.press(getByText('Tentar outro cenário sem apoio'));

    expect(getByText('Recuperação independente · novo cenário')).toBeTruthy();
    expect(getByTestId('slicing-model-scenario-caption').props.children)
      .toMatch(/marcadores pélvicos equidistantes/i);
    fireEvent.press(getByLabelText('Selecionar opção 2. Uma placa vertical central que percorre o meio do corpo.'));
    fireEvent.press(getByText('Confirmar decisão'));
    expect(getByText('Recuperação independente registrada.')).toBeTruthy();
    expect(queryByText(/domínio confirmado por XP/i)).toBeNull();
  });

  it('usa Reduce Motion e não revela a resposta em rótulos de alternativas avaliativas', () => {
    const { getByLabelText, getByTestId } = render(<SlicingSpaceLessonPreview />);

    expect(getByTestId('slicing-model-motion-state').props.children).toBe('Movimento reduzido: geometria final exibida.');
    const option = getByLabelText('Selecionar opção 1. Uma placa vertical central que percorre o meio do corpo.');
    expect(option.props.accessibilityHint).not.toMatch(/correta|mediano|gabarito/i);
    expect(option.props.accessibilityLabel).not.toMatch(/mediano|sagital|correta/i);
  });

  it('expõe a seleção de rádio por estado e valor acessível, sem nomear o gabarito', () => {
    const { getByLabelText } = render(<SlicingSpaceLessonPreview />);
    const option = getByLabelText('Selecionar opção 1. Uma placa vertical central que percorre o meio do corpo.');

    fireEvent.press(option);

    expect(getByLabelText('Selecionar opção 1. Uma placa vertical central que percorre o meio do corpo.').props.accessibilityState).toEqual({ selected: true });
    expect(getByLabelText('Selecionar opção 1. Uma placa vertical central que percorre o meio do corpo.').props.accessibilityValue).toEqual({ text: 'selecionada' });
  });

  it('deixa explorar o modelo sem transformar a geometria exibida em oráculo da resposta', () => {
    const { getByLabelText, getByRole } = render(<SlicingSpaceLessonPreview />);

    fireEvent.press(getByLabelText('Selecionar orientação de referência coronal'));
    fireEvent.press(getByLabelText('Selecionar opção 1. Uma placa vertical central que percorre o meio do corpo.'));
    expect(getByRole('button', { name: 'Confirmar decisão' }).props.accessibilityState.disabled).toBe(false);
  });

  it('permite selecionar uma alternativa pelo candidato visual equivalente ao rádio textual', () => {
    const { getByLabelText } = render(<SlicingSpaceLessonPreview />);

    fireEvent.press(getByLabelText('Selecionar opção 2 no modelo. Uma placa vertical paralela, deslocada para um lado.'));

    expect(getByLabelText('Selecionar opção 2. Uma placa vertical paralela, deslocada para um lado.').props.accessibilityState).toEqual({ selected: true });
  });

  it('exige recuperação independente em cenário novo mesmo de quem acerta a decisão inicial', () => {
    // A §5.1 pede item novo e sem ajuda para TODO objetivo essencial. O caminho
    // correto pulava direto ao objetivo seguinte, então o objetivo fechava sem
    // nenhuma evidência de recuperação.
    const { getByLabelText, getByText } = render(<SlicingSpaceLessonPreview />);

    fireEvent.press(getByLabelText('Selecionar opção 1. Uma placa vertical central que percorre o meio do corpo.'));
    fireEvent.press(getByText('Confirmar decisão'));
    fireEvent.press(getByText('Tentar um cenário novo sem apoio'));

    expect(getByText('Recuperação independente · novo cenário')).toBeTruthy();
    expect(getByText(/Agora na pelve/i)).toBeTruthy();
  });

  it('não inicia a sequência instrutiva enquanto a preferência de movimento não respondeu', () => {
    // Primeira renderização: `AccessibilityInfo` ainda não respondeu. Quem
    // agenda aqui faz quem pediu menos movimento ver a sequência começar e ser
    // cortada, a cada desafio.
    motionPreference.reducedMotionEnabled = false;
    motionPreference.resolved = false;

    const { getByTestId } = render(<SlicingSpaceLessonPreview />);

    expect(getByTestId('slicing-model-motion-state').props.children)
      .toBe('Preferência de movimento ainda desconhecida: geometria final exibida sem animar.');
  });

  it('segue para o objetivo seguinte só depois de fechada a recuperação do objetivo anterior', () => {
    const { getByLabelText, getByText } = render(<SlicingSpaceLessonPreview />);

    fireEvent.press(getByLabelText('Selecionar opção 1. Uma placa vertical central que percorre o meio do corpo.'));
    fireEvent.press(getByText('Confirmar decisão'));
    fireEvent.press(getByText('Tentar um cenário novo sem apoio'));
    fireEvent.press(getByLabelText('Selecionar opção 2. Uma placa vertical central que percorre o meio do corpo.'));
    fireEvent.press(getByText('Confirmar decisão'));
    fireEvent.press(getByText('Continuar para referências'));

    expect(getByText(/Qual placa separa uma porção superior/i)).toBeTruthy();
  });

  it('não promete item novo quando a lição não tem item novo a oferecer', () => {
    // No último objetivo não há destino adiante: `l2-independent-section` não
    // declara `nextChallengeId`, então a recuperação bloqueada não encaminha a
    // lugar nenhum e o botão some. A frase "com um item novo" ficava na tela
    // prometendo exatamente o que o motor acabara de negar.
    expect(reviewSentence({ reviewTargetId: 'review:l2:x', nextChallengeId: 'l2-outro' }))
      .toMatch(/com um item novo/i);
    expect(reviewSentence({ reviewTargetId: 'review:l2:x' }))
      .toMatch(/volta na revisão agendada/i);
    expect(reviewSentence({ reviewTargetId: 'review:l2:x' }))
      .not.toMatch(/com um item novo/i);
  });
});
