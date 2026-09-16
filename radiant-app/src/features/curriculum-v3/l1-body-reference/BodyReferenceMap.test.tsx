import React from 'react';
import { fireEvent, render } from '@testing-library/react-native';
import { StyleSheet } from 'react-native';
import { BodyReferenceMap } from './BodyReferenceMap';

describe('BodyReferenceMap', () => {
  const props = {
    posture: 'anatomical' as const,
    perspective: 'front' as const,
    selectedRelation: 'medial-lateral',
    reduceMotion: false,
    onPostureChange: jest.fn(),
    onPerspectiveChange: jest.fn(),
    onRegionSelect: jest.fn(),
  };

  beforeEach(() => jest.clearAllMocks());

  it('altera perspectiva, postura e região pelo toque e por controles nomeados', () => {
    const { getByLabelText } = render(<BodyReferenceMap {...props} />);

    fireEvent.press(getByLabelText('Ver corpo por trás'));
    fireEvent.press(getByLabelText('Apresentar pessoa em decúbito ventral'));
    fireEvent.press(getByLabelText(/Selecionar opção 1 no mapa\./));

    expect(props.onPerspectiveChange).toHaveBeenCalledWith('back');
    expect(props.onPostureChange).toHaveBeenCalledWith('prone');
    expect(props.onRegionSelect).toHaveBeenCalledWith('patient-left');
  });

  it('expõe estado textual e não revela a resposta de um desafio na descrição acessível', () => {
    const { getByLabelText, getByTestId } = render(<BodyReferenceMap {...props} />);

    expect(getByLabelText('Modelo corporal interativo. Vista frontal, posição anatômica.')).toBeTruthy();
    expect(getByLabelText(/Selecionar opção 1 no mapa\./).props.accessibilityHint).not.toMatch(/medial|lateral|correta/i);
    expect(getByTestId('body-map-state').props.children.join('')).toMatch(/Perspectiva: frente/i);
  });

  it('usa o estado final estático ao reduzir movimento e mantém alvos mínimos', () => {
    const { getByLabelText, getByTestId } = render(<BodyReferenceMap {...props} reduceMotion />);

    expect(getByTestId('body-map-motion-state').props.children).toBe('Movimento reduzido: estado final exibido.');
    const target = getByLabelText(/Selecionar opção 1 no mapa\./);
    expect(StyleSheet.flatten(target.props.style).minWidth).toBeGreaterThanOrEqual(44);
    expect(StyleSheet.flatten(target.props.style).minHeight).toBeGreaterThanOrEqual(44);
  });

  it('muda a geometria e os landmarks quando a postura ou a vista mudam', () => {
    const front = render(<BodyReferenceMap {...props} posture="anatomical" perspective="front" />);
    const backProne = render(<BodyReferenceMap {...props} posture="prone" perspective="back" />);

    expect(front.getByTestId('body-geometry').props.children).toContain('upright-front');
    expect(backProne.getByTestId('body-geometry').props.children).toContain('prone-back');
    expect(front.getByTestId('landmark-patient-left-hand')).toBeTruthy();
    expect(backProne.getByTestId('landmark-patient-left-hand')).toBeTruthy();
    const canvas = front.getByTestId('body-map-canvas');
    expect(canvas.findByProps({ testID: 'landmark-patient-left-hand' })).toBeTruthy();
    expect(canvas.props.style).toEqual(expect.objectContaining({ transform: expect.any(Array) }));
  });
});
