import React from 'react';
import { fireEvent, render } from '@testing-library/react-native';
import { JourneyUnitNavigation } from './JourneyUnitNavigation';

it('usa o destino da unidade selecionada sem abrir atividade', () => {
  const onSelect = jest.fn();
  const screen = render(<JourneyUnitNavigation destinations={[
    { key: 't:u1', unitId: 'u1', title: 'Estrutura', trackTitle: 'Fundamentos', unitNumber: 1, unitCount: 2, itemIndex: 0 },
    { key: 't:u2', unitId: 'u2', title: 'Interações', trackTitle: 'Fundamentos', unitNumber: 2, unitCount: 2, itemIndex: 31 },
  ]} onSelect={onSelect} />);
  fireEvent.press(screen.getByRole('button', { name: 'Ver unidade 2 de 2: Interações. Fundamentos' }));
  expect(onSelect).toHaveBeenCalledWith(31);
  expect(onSelect).toHaveBeenCalledTimes(1);
});
