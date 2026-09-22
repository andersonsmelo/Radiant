import React from 'react';
import { fireEvent, render } from '@testing-library/react-native';
import { StyleSheet } from 'react-native';
import { SlicingSpaceModel } from './SlicingSpaceModel';

jest.mock('../../../ui/motion', () => {
  const ReactActual = jest.requireActual('react');
  const { Animated } = jest.requireActual('react-native');
  return {
    // Identidades estáveis, como no helper real: o efeito do componente tem
    // slideTo/settle nas dependências, e recriá-los a cada render o faria
    // reentrar indefinidamente.
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

describe('SlicingSpaceModel', () => {
  const props = {
    orientation: 'sagittal' as const,
    medianRelation: 'median' as const,
    inclination: 'aligned' as const,
    region: 'thorax' as const,
    thickness: 'thin' as const,
    selectedLayer: 'geometric-plane' as const,
    reduceMotion: true,
    motionResolved: true,
    onOrientationChange: jest.fn(),
    onMedianRelationChange: jest.fn(),
    onInclinationChange: jest.fn(),
    onRegionChange: jest.fn(),
    onThicknessChange: jest.fn(),
    onLayerSelect: jest.fn(),
  };

  beforeEach(() => jest.clearAllMocks());

  it('altera orientação, região, espessura e camada por controles nomeados', () => {
    const { getByLabelText } = render(<SlicingSpaceModel {...props} />);

    fireEvent.press(getByLabelText('Selecionar orientação de referência coronal'));
    fireEvent.press(getByLabelText('Mover região para pelve'));
    fireEvent.press(getByLabelText('Usar espessura nominal'));
    fireEvent.press(getByLabelText('Destacar região espacial'));

    expect(props.onOrientationChange).toHaveBeenCalledWith('coronal');
    expect(props.onRegionChange).toHaveBeenCalledWith('pelvis');
    expect(props.onThicknessChange).toHaveBeenCalledWith('nominal');
    expect(props.onLayerSelect).toHaveBeenCalledWith('sampled-region');
  });

  it('trata a relação com o eixo mediano como subdivisão de sagital, não como orientação irmã', () => {
    // O seletor antigo punha coronal, sagital, mediano, transversal e oblíquo
    // como cinco opções mutuamente exclusivas: escolher "mediano" desselecionava
    // "sagital", afirmando que mediano NÃO é sagital — `E-PLN-MED` codificado no
    // próprio controle que a lição usa para remediá-lo.
    const sagittal = render(<SlicingSpaceModel {...props} />);

    expect(sagittal.getByLabelText('Selecionar orientação de referência sagital').props.accessibilityState.selected).toBe(true);
    expect(sagittal.getByLabelText('Usar plano mediano, sobre o eixo').props.accessibilityState.selected).toBe(true);
  });

  it('não oferece a relação com o eixo mediano fora da família sagital', () => {
    const coronal = render(<SlicingSpaceModel {...props} orientation="coronal" />);

    expect(coronal.queryByLabelText('Usar plano mediano, sobre o eixo')).toBeNull();
  });

  it('trata obliquidade como relação com as referências, não como uma orientação à parte', () => {
    const { getByLabelText } = render(<SlicingSpaceModel {...props} />);

    fireEvent.press(getByLabelText('Inclinar a placa em relação às referências'));

    expect(props.onInclinationChange).toHaveBeenCalledWith('oblique');
    expect(getByLabelText('Selecionar orientação de referência sagital').props.accessibilityState.selected).toBe(true);
  });

  it('descreve os três eixos no estado acessível, sem chamar uma opção de correta', () => {
    const { getByLabelText, getByTestId } = render(<SlicingSpaceModel {...props} />);

    expect(getByLabelText(/estado de exploração.*[Oo]rientação: sagital.*eixo mediano: sobre o eixo.*inclinação: alinhada/is)).toBeTruthy();
    expect(getByLabelText('Selecionar orientação de referência sagital').props.accessibilityHint).not.toMatch(/correta|gabarito/i);
    expect(getByTestId('slicing-model-state').props.children.join('')).toMatch(/Orientação: sagital/i);
  });

  it('mostra a geometria final e alvos mínimos quando movimento reduzido está ativo', () => {
    const { getByLabelText, getByTestId } = render(<SlicingSpaceModel {...props} reduceMotion />);

    expect(getByTestId('slicing-model-motion-state').props.children).toBe('Movimento reduzido: geometria final exibida.');
    expect(StyleSheet.flatten(getByLabelText('Selecionar orientação de referência sagital').props.style).minHeight).toBeGreaterThanOrEqual(44);
  });

  it('não anuncia sequência instrutiva enquanto a preferência de movimento é desconhecida', () => {
    // Com `motionResolved` falso a preferência ainda não voltou da consulta
    // assíncrona. Agendar nessa passada é a corrida que faz quem pediu menos
    // movimento ver a sequência começar e ser cortada.
    const { getByTestId } = render(<SlicingSpaceModel {...props} reduceMotion={false} motionResolved={false} />);

    expect(getByTestId('slicing-model-motion-state').props.children)
      .toBe('Preferência de movimento ainda desconhecida: geometria final exibida sem animar.');
  });

  it('dá legenda e marcadores próprios a cada cenário de uma mesma família', () => {
    const initial = render(<SlicingSpaceModel {...props} scenarioId="abdomen-transverse" />);
    const recovery = render(<SlicingSpaceModel {...props} scenarioId="pelvis-coronal-recovery" />);

    expect(initial.getByTestId('slicing-model-scenario-caption').props.children)
      .not.toBe(recovery.getByTestId('slicing-model-scenario-caption').props.children);
  });

  it('não promete toque no desenho quando o desenho não recebe toque', () => {
    const { queryByText } = render(<SlicingSpaceModel {...props} answerOptions={[
      { id: 'median', textDescription: 'Uma placa vertical central.' },
      { id: 'sagittal-not-median', textDescription: 'Uma placa vertical deslocada.' },
    ]} />);

    expect(queryByText(/Toque em um candidato no modelo/i)).toBeNull();
  });
});
