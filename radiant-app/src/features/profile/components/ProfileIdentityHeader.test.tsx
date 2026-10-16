import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react-native';

import { ProfileIdentityHeader } from './ProfileIdentityHeader';

jest.mock('@expo/vector-icons/MaterialIcons', () => 'MaterialIcons');

describe('ProfileIdentityHeader — a engrenagem da Configuração', () => {
  it('oferece a Configuração como botão nomeado, que chama quem abre a tela', () => {
    const onOpenSettings = jest.fn();
    render(<ProfileIdentityHeader email={null} streakDays={1} totalXp={110} onOpenSettings={onOpenSettings} />);

    fireEvent.press(screen.getByRole('button', { name: 'Configuração' }));

    expect(onOpenSettings).toHaveBeenCalledTimes(1);
  });

  it('sem quem abra a tela, não desenha uma engrenagem inerte', () => {
    render(<ProfileIdentityHeader email={null} streakDays={1} totalXp={110} />);

    expect(screen.queryByRole('button', { name: 'Configuração' })).toBeNull();
  });
});
