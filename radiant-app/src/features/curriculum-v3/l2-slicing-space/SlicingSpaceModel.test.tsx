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
    plane: 'median' as const,
    region: 'thorax' as const,
    thickness: 'thin' as const,
    selectedLayer: 'geometric-plane' as const,
    reduceMotion: true,
    onPlaneChange: jest.fn(),
    onRegionChange: jest.fn(),
    onThicknessChange: jest.fn(),
    onLayerSelect: jest.fn(),
  };

  beforeEach(() => jest.clearAllMocks());

  it('altera plano, região, espessura e camada por controles nomeados', () => {
    const { getByLabelText } = render(<SlicingSpaceModel {...props} />);

    fireEvent.press(getByLabelText('Selecionar plano coronal'));
    fireEvent.press(getByLabelText('Mover região para pelve'));
    fireEvent.press(getByLabelText('Usar espessura nominal'));
    fireEvent.press(getByLabelText('Destacar região espacial'));

    expect(props.onPlaneChange).toHaveBeenCalledWith('coronal');
    expect(props.onRegionChange).toHaveBeenCalledWith('pelvis');
    expect(props.onThicknessChange).toHaveBeenCalledWith('nominal');
    expect(props.onLayerSelect).toHaveBeenCalledWith('sampled-region');
  });

  it('expõe o estado e uma descrição acessível do modelo sem chamar uma opção de correta', () => {
    const { getByLabelText, getByTestId } = render(<SlicingSpaceModel {...props} />);

    expect(getByLabelText(/Modelo 2\.5D, estado de exploração\. Marcas de referência distribuídas pelo modelo\. Plano: mediano/i)).toBeTruthy();
    expect(getByLabelText('Selecionar plano mediano').props.accessibilityHint).not.toMatch(/correta|gabarito/i);
    expect(getByTestId('slicing-model-state').props.children.join('')).toMatch(/Plano: mediano/i);
  });

  it('mostra a geometria final e alvos mínimos quando movimento reduzido está ativo', () => {
    const { getByLabelText, getByTestId } = render(<SlicingSpaceModel {...props} reduceMotion />);

    expect(getByTestId('slicing-model-motion-state').props.children).toBe('Movimento reduzido: geometria final exibida.');
    expect(getByTestId('slicing-model-geometry').props.children).toContain('median-thorax-thin');
    expect(StyleSheet.flatten(getByLabelText('Selecionar plano mediano').props.style).minHeight).toBeGreaterThanOrEqual(44);
  });

  it('muda a geometria observável para explicar plano, região e espessura', () => {
    const medianThorax = render(<SlicingSpaceModel {...props} />);
    const obliquePelvis = render(<SlicingSpaceModel {...props} plane="oblique" region="pelvis" thickness="thick" selectedLayer="nominal-thickness" />);

    expect(medianThorax.getByTestId('slicing-plane').props.children).toContain('M 120 36');
    expect(obliquePelvis.getByTestId('slicing-plane').props.children).toContain('M 66 260');
    expect(medianThorax.getByTestId('slicing-model-geometry').props.children).toContain('median-thorax-thin');
    expect(obliquePelvis.getByTestId('slicing-model-state').props.children.join('')).toMatch(/Região: pelve.*Espessura: espessa/i);
  });

  it('consome um cenário novo na geometria e no estado acessível, além da região escolhida', () => {
    const initial = render(<SlicingSpaceModel {...props} scenarioId="thorax-midline" />);
    const recovery = render(<SlicingSpaceModel {...props} scenarioId="pelvis-symmetry" />);

    expect(initial.getByTestId('slicing-model-scenario').props.children).toBe('thorax-midline');
    expect(recovery.getByTestId('slicing-model-scenario').props.children).toBe('pelvis-symmetry');
    expect(initial.getByTestId('slicing-model-geometry').props.children).not.toBe(recovery.getByTestId('slicing-model-geometry').props.children);
    expect(initial.getByTestId('slicing-model-scenario-caption').props.children).toBe('Marcas de referência nos ombros.');
    expect(recovery.getByTestId('slicing-model-scenario-caption').props.children).toBe('Dois marcadores pélvicos equidistantes da linha central permitem comparar simetria.');
    expect(initial.getByLabelText(/estado de exploração.*Plano: mediano/i)).toBeTruthy();
  });
});
