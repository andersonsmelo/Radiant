import React from 'react';
import { render } from '@testing-library/react-native';
import { HUD } from './HUD';
import { useReducedMotionPreference } from '../accessibility/useReducedMotionPreference';

jest.mock('../accessibility/useReducedMotionPreference', () => ({
  useReducedMotionPreference: jest.fn(() => false),
}));

const mockedReducedMotion = useReducedMotionPreference as jest.MockedFunction<
  typeof useReducedMotionPreference
>;

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

// Encenação da perda de vida. O evento mais pesado que o app cobra não tinha
// sinal próprio: o coração trocava de ❤️ para 🤍 e nada mais acontecia.
describe('HUD — perda de vida', () => {
  beforeEach(() => {
    mockedReducedMotion.mockReturnValue(false);
  });

  it('anima só o coração que acabou de ser perdido, e não os vizinhos', () => {
    const { getByTestId, rerender } = render(
      <HUD totalXp={0} streakDays={0} hearts={3} maxHearts={5} />,
    );

    expect(findTransform(getByTestId('hud-heart-2'))).toBeUndefined();

    rerender(<HUD totalXp={0} streakDays={0} hearts={2} maxHearts={5} />);

    // Índice 2 é a posição que acabou de esvaziar (hearts já é o valor novo).
    expect(findTransform(getByTestId('hud-heart-2'))).toBeDefined();
    // Encenar a perda é apontar para UM coração; os outros ficam quietos.
    expect(findTransform(getByTestId('hud-heart-1'))).toBeUndefined();
    expect(findTransform(getByTestId('hud-heart-3'))).toBeUndefined();
  });

  it('não anima quando a pessoa GANHA vidas de volta', () => {
    const { getByTestId, rerender } = render(
      <HUD totalXp={0} streakDays={0} hearts={2} maxHearts={5} />,
    );

    rerender(<HUD totalXp={0} streakDays={0} hearts={4} maxHearts={5} />);

    expect(findTransform(getByTestId('hud-heart-2'))).toBeUndefined();
    expect(findTransform(getByTestId('hud-heart-3'))).toBeUndefined();
  });

  it('recarregar solta o coração marcado, para o estilo não ficar num índice cheio', () => {
    const { getByTestId, rerender } = render(
      <HUD totalXp={0} streakDays={0} hearts={3} maxHearts={5} />,
    );

    rerender(<HUD totalXp={0} streakDays={0} hearts={2} maxHearts={5} />);
    expect(findTransform(getByTestId('hud-heart-2'))).toBeDefined();

    rerender(<HUD totalXp={0} streakDays={0} hearts={5} maxHearts={5} />);
    expect(findTransform(getByTestId('hud-heart-2'))).toBeUndefined();
  });

  it('sob reduced motion a perda segue legível pelo rótulo, que é o canal que não pode depender de animação', () => {
    mockedReducedMotion.mockReturnValue(true);

    const { getByLabelText, rerender } = render(
      <HUD totalXp={0} streakDays={0} hearts={3} maxHearts={5} />,
    );

    rerender(<HUD totalXp={0} streakDays={0} hearts={2} maxHearts={5} />);

    expect(getByLabelText('2 de 5 vidas')).toBeTruthy();
  });
});

function findTransform(node: { props: { style?: unknown } }) {
  const style = node.props.style;
  const entries = Array.isArray(style) ? style : [style];
  return entries.find(
    (entry): entry is { transform: unknown } =>
      !!entry && typeof entry === 'object' && 'transform' in entry,
  );
}

// O emoji do sistema ignora token de cor, renderiza ao gosto do SO e era o
// objeto mais saturado da Home — mais forte que o CTA. O DESIGN.md o proíbe por
// escrito. Estes contratos travam a troca por vetor animado em código.
describe('HUD — identidade dos ícones', () => {
  const EMOJI = /[☀-➿\u{1F300}-\u{1F9FF}\u{FE0F}]/u;

  it('não renderiza nenhum emoji do sistema', () => {
    const { toJSON } = render(<HUD totalXp={1234} streakDays={3} hearts={2} maxHearts={5} />);

    expect(EMOJI.test(JSON.stringify(toJSON()))).toBe(false);
  });

  it('desenha um ícone vetorial para cada vida, cheia ou vazia', () => {
    const { getByTestId } = render(<HUD totalXp={0} streakDays={1} hearts={2} maxHearts={5} />);

    for (let i = 0; i < 5; i += 1) {
      expect(getByTestId(`hud-heart-${i}`)).toBeTruthy();
    }
  });

  it('distingue vida cheia de vazia por preenchimento, não só por opacidade', () => {
    const { getByTestId } = render(<HUD totalXp={0} streakDays={1} hearts={2} maxHearts={5} />);

    // A cor é o canal que o leitor de tela não tem; o rótulo agregado cobre
    // aquele lado. Aqui garantimos que o canal visual existe de fato.
    // O nó `hud-heart-N` é o wrapper animado; o preenchimento vive no vetor
    // dentro dele. Separar os dois mantém o contrato de animação que já existia.
    expect(getByTestId('hud-heart-fill-0').props.fill)
      .not.toBe(getByTestId('hud-heart-fill-4').props.fill);
  });
});
