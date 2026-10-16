import React from 'react';
import { render, screen } from '@testing-library/react-native';

import { JourneyLevelBand } from './JourneyLevelBand';

jest.mock('@expo/vector-icons/MaterialIcons', () => 'MaterialIcons');

describe('JourneyLevelBand — o cadeado diz o que abre a trilha', () => {
  // Visto no simulador em 2026-10-16: "BLOQUEADO · Radiação, Modalidades e
  // Equipamento", sem nada que dissesse ao aluno o que fazer.
  it('trilha fechada nomeia a trilha que precisa ser concluída', () => {
    render(
      <JourneyLevelBand
        trackId="t2"
        trackTitle="Radiação, Modalidades e Equipamento"
        unlocked={false}
        previousTrackTitle="Fundamentos de Radiologia"
      />,
    );

    expect(screen.getByText('Abre ao concluir Fundamentos de Radiologia')).toBeTruthy();
    expect(
      screen.getByLabelText(
        'Bloqueado: Radiação, Modalidades e Equipamento. Abre ao concluir Fundamentos de Radiologia.',
      ),
    ).toBeTruthy();
  });

  it('trilha aberta não carrega a dica do cadeado', () => {
    render(
      <JourneyLevelBand
        trackId="t2"
        trackTitle="Radiação, Modalidades e Equipamento"
        unlocked
        previousTrackTitle="Fundamentos de Radiologia"
      />,
    );

    expect(screen.queryByText(/Abre ao concluir/u)).toBeNull();
  });
});
