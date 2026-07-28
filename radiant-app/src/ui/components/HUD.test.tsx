import React from 'react';
import { render } from '@testing-library/react-native';
import { HUD } from './HUD';

// Contrato de acessibilidade do HUD (item 4 da 2ª auditoria de design).
// O HUD aparece em 9 telas; antes cada tela lia "coração vermelho" 5x e os
// emojis decorativos de XP/streak. Aqui travamos o anúncio consolidado.

describe('HUD — acessibilidade', () => {
  it('expõe as vidas como um único rótulo, não um emoji por coração', () => {
    const { getByLabelText, queryByLabelText } = render(
      <HUD totalXp={1234} streakDays={3} hearts={2} maxHearts={5} />,
    );

    // Um nó único e legível em vez de cinco "coração vermelho".
    expect(getByLabelText('2 de 5 vidas')).toBeTruthy();
    // O emoji cru não vira rótulo de acessibilidade.
    expect(queryByLabelText('❤️')).toBeNull();
    expect(queryByLabelText('🤍')).toBeNull();
  });

  it('rotula os pills de XP e streak sem ler o emoji decorativo', () => {
    const { getByLabelText } = render(
      <HUD totalXp={1234} streakDays={3} hearts={5} maxHearts={5} />,
    );

    // Separador de milhar depende do locale do runtime; casamos só o sufixo.
    expect(getByLabelText(/XP$/)).toBeTruthy();
    expect(getByLabelText('3 dias de sequência')).toBeTruthy();
  });

  it('usa o singular quando a sequência é de um dia', () => {
    const { getByLabelText } = render(
      <HUD totalXp={0} streakDays={1} hearts={5} maxHearts={5} />,
    );

    expect(getByLabelText('1 dia de sequência')).toBeTruthy();
  });

  it('no modo compact mostra as vidas e omite os pills de XP/streak', () => {
    const { getByLabelText, queryByLabelText } = render(
      <HUD totalXp={1234} streakDays={3} hearts={4} maxHearts={5} compact />,
    );

    expect(getByLabelText('4 de 5 vidas')).toBeTruthy();
    expect(queryByLabelText(/XP$/)).toBeNull();
    expect(queryByLabelText(/de sequência$/)).toBeNull();
  });
});
