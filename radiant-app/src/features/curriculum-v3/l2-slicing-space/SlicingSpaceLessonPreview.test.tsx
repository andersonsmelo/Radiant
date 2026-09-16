import React from 'react';
import { fireEvent, render } from '@testing-library/react-native';
import { SlicingSpaceLessonPreview } from './SlicingSpaceLessonPreview';

jest.mock('../../../ui/accessibility/useReducedMotionPreference', () => ({
  useReducedMotionPreference: () => true,
}));
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
    expect(getByTestId('slicing-model-scenario').props.children).toBe('pelvis-symmetry');
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

    fireEvent.press(getByLabelText('Selecionar plano coronal'));
    fireEvent.press(getByLabelText('Selecionar opção 1. Uma placa vertical central que percorre o meio do corpo.'));
    expect(getByRole('button', { name: 'Confirmar decisão' }).props.accessibilityState.disabled).toBe(false);
  });

  it('permite selecionar uma alternativa pelo candidato visual equivalente ao rádio textual', () => {
    const { getByLabelText } = render(<SlicingSpaceLessonPreview />);

    fireEvent.press(getByLabelText('Selecionar opção 2 no modelo. Uma placa vertical paralela, deslocada para um lado.'));

    expect(getByLabelText('Selecionar opção 2. Uma placa vertical paralela, deslocada para um lado.').props.accessibilityState).toEqual({ selected: true });
  });

  it('segue para obliquidade e região/espessura quando a decisão inicial está correta', () => {
    const { getByLabelText, getByText } = render(<SlicingSpaceLessonPreview />);

    fireEvent.press(getByLabelText('Selecionar opção 1. Uma placa vertical central que percorre o meio do corpo.'));
    fireEvent.press(getByText('Confirmar decisão'));
    fireEvent.press(getByText('Continuar para referências'));
    expect(getByText(/Qual placa separa uma porção superior/i)).toBeTruthy();
    fireEvent.press(getByLabelText('Selecionar opção 2. Uma placa horizontal que separa uma porção superior e outra inferior.'));
    fireEvent.press(getByText('Confirmar decisão'));
    fireEvent.press(getByText('Continuar para inclinação'));
    expect(getByText('Decisão independente · sem XP')).toBeTruthy();
    expect(getByText(/placa no abdome está inclinada/i)).toBeTruthy();
  });
});
