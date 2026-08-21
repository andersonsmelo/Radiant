import React from 'react';
import { StyleSheet } from 'react-native';
import { render } from '@testing-library/react-native';
import { JourneyStageHeader } from './JourneyStageHeader';

function renderHeader(props: Partial<React.ComponentProps<typeof JourneyStageHeader>> = {}) {
  return render(
    <JourneyStageHeader title="Fundamentos de Radiologia" completed={7} total={21} {...props} />,
  );
}

describe('JourneyStageHeader — o aluno se localiza também pelo número', () => {
  // A cor do caminho responde "onde eu estou" de relance; o contador responde
  // "quanto falta", que a cor não consegue dizer. São perguntas diferentes, e é
  // por isso que os dois convivem em vez de um substituir o outro.

  it('nomeia o estágio e conta o percurso dentro dele', () => {
    const screen = renderHeader();

    expect(screen.getByText('Fundamentos de Radiologia')).toBeTruthy();
    expect(screen.getByText('7 de 21')).toBeTruthy();
  });

  it('anuncia o progresso como uma frase só, e não como três fragmentos', () => {
    // Lido peça por peça, o cabeçalho sairia como "Fundamentos de Radiologia",
    // "7 de 21", "barra de progresso 33%" — três paradas para uma informação.
    const screen = renderHeader();

    expect(
      screen.getByLabelText('Fundamentos de Radiologia. 7 de 21 etapas concluídas.'),
    ).toBeTruthy();
  });

  it('preenche a barra na proporção do percurso', () => {
    const screen = renderHeader({ completed: 5, total: 20 });
    const fill = screen.getByTestId('journey-stage-progress-fill');

    expect(StyleSheet.flatten(fill.props.style).width).toBe('25%');
  });

  it('não divide por zero num estágio ainda sem etapas', () => {
    // Catálogo que ainda não produziu conteúdo: a barra fica vazia em vez de
    // NaN, que o React Native renderiza como largura inválida.
    const screen = renderHeader({ completed: 0, total: 0 });

    expect(
      StyleSheet.flatten(screen.getByTestId('journey-stage-progress-fill').props.style).width,
    ).toBe('0%');
    expect(screen.getByText('0 de 0')).toBeTruthy();
  });

  it('não deixa a barra passar de cheia se a contagem vier inconsistente', () => {
    const screen = renderHeader({ completed: 30, total: 21 });

    expect(
      StyleSheet.flatten(screen.getByTestId('journey-stage-progress-fill').props.style).width,
    ).toBe('100%');
  });
});
