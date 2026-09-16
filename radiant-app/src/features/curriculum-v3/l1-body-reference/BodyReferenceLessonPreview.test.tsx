import React from 'react';
import { fireEvent, render } from '@testing-library/react-native';
import { BodyReferenceLessonPreview } from './BodyReferenceLessonPreview';

jest.mock('../../../ui/accessibility/useReducedMotionPreference', () => ({
  useReducedMotionPreference: () => true,
}));

describe('BodyReferenceLessonPreview', () => {
  it('separa diagnóstico, prática assistida e recuperação independente depois de um erro', () => {
    const { getByLabelText, getByText, queryByText } = render(<BodyReferenceLessonPreview />);

    expect(getByText('Diagnóstico inicial · sem XP')).toBeTruthy();
    fireEvent.press(getByLabelText(/Selecionar opção 2\./));
    fireEvent.press(getByText('Confirmar decisão'));
    expect(getByText(/O lado direito ou esquerdo pertence ao corpo descrito/i)).toBeTruthy();
    expect(getByText('Praticar com apoio')).toBeTruthy();

    fireEvent.press(getByText('Praticar com apoio'));
    expect(getByText('Prática assistida · não demonstra domínio')).toBeTruthy();
    fireEvent.press(getByLabelText(/Selecionar opção 1\./));
    fireEvent.press(getByText('Confirmar decisão'));
    expect(getByText('Tentar lateralidade em nova vista')).toBeTruthy();

    fireEvent.press(getByText('Tentar lateralidade em nova vista'));
    expect(getByText('Recuperação independente · novo cenário')).toBeTruthy();
    fireEvent.press(getByLabelText(/Selecionar opção 1\./));
    fireEvent.press(getByText('Confirmar decisão'));
    expect(getByText('Recuperação independente registrada.')).toBeTruthy();
    expect(queryByText(/domínio confirmado por XP/i)).toBeNull();
  });

  it('passa Reduce Motion ao modelo e não vaza a resposta na descrição da opção', () => {
    const { getByLabelText, getByTestId } = render(<BodyReferenceLessonPreview />);

    expect(getByTestId('body-map-motion-state').props.children).toBe('Movimento reduzido: estado final exibido.');
    const option = getByLabelText(/Selecionar opção 1\./);
    expect(option.props.accessibilityHint).not.toMatch(/correta|esquerdo|anterior/i);
    expect(option.props.accessibilityLabel).toMatch(/Mão apresentada à direita de quem observa/i);
  });

  it('deixa explorar o modelo, mas exige restaurar o cenário antes de registrar a decisão', () => {
    const { getByLabelText, getByRole } = render(<BodyReferenceLessonPreview />);

    fireEvent.press(getByLabelText('Ver corpo por trás'));
    fireEvent.press(getByLabelText(/Selecionar opção 1\./));
    expect(getByRole('button', { name: 'Confirmar decisão' }).props.accessibilityState.disabled).toBe(true);
    fireEvent.press(getByLabelText('Restaurar cenário do desafio'));
    expect(getByRole('button', { name: 'Confirmar decisão' }).props.accessibilityState.disabled).toBe(false);
  });

  it('usa o toque do landmark para selecionar a mesma alternativa que o controle textual', () => {
    const { getByLabelText, getByRole } = render(<BodyReferenceLessonPreview />);

    fireEvent.press(getByLabelText(/Selecionar opção 1 no mapa\./));
    expect(getByRole('radio', { name: /Selecionar opção 1\./ }).props.accessibilityState.selected).toBe(true);
  });

  it('continua a trilha depois de um diagnóstico correto e percorre todos os objetivos', () => {
    const { getByLabelText, getByText } = render(<BodyReferenceLessonPreview />);

    fireEvent.press(getByLabelText(/Selecionar opção 1\./));
    fireEvent.press(getByText('Confirmar decisão'));
    expect(getByText('Continuar para lateralidade em nova vista')).toBeTruthy();
    fireEvent.press(getByText('Continuar para lateralidade em nova vista'));
    expect(getByText('Recuperação independente · novo cenário')).toBeTruthy();
  });
});
