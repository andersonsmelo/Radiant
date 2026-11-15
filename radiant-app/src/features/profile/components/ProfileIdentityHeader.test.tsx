import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react-native';
import { ProfileIdentityHeader } from './ProfileIdentityHeader';
jest.mock('@expo/vector-icons/MaterialIcons', () => 'MaterialIcons');

it('mostra a identidade local sem duplicar contador/XP e abre Ajustes', () => {
  const onOpenSettings = jest.fn();
  render(<ProfileIdentityHeader email={null} onOpenSettings={onOpenSettings} />);
  expect(screen.getByText('Estudante')).toBeTruthy();
  expect(screen.getByText('Estudo local, sem conta')).toBeTruthy();
  expect(screen.queryByText('SEQUÊNCIA')).toBeNull();
  expect(screen.queryByText('XP TOTAL')).toBeNull();
  fireEvent.press(screen.getByRole('button', { name: 'Ajustes' }));
  expect(onOpenSettings).toHaveBeenCalledTimes(1);
});
it('identidade recebida não vira mascote e não desenha engrenagem inerte', () => {
  render(<ProfileIdentityHeader email="ana@example.test" />);
  expect(screen.getByText('ana')).toBeTruthy();
  expect(screen.getByText('ana@example.test')).toBeTruthy();
  expect(screen.queryByRole('button')).toBeNull();
});

it('texto máximo põe a identidade inteira abaixo do avatar e da engrenagem, sem cortar nome', () => {
  const Native = require('react-native');
  const dimensions = jest.spyOn(Native, 'useWindowDimensions').mockReturnValue({ width: 320, height: 800, scale: 2, fontScale: 3.1 });
  const result = render(<ProfileIdentityHeader email={null} onOpenSettings={jest.fn()} />);
  expect(Native.StyleSheet.flatten(screen.getByTestId('profile-identity-text').props.style).flex).toBe(0);
  for (const text of result.UNSAFE_getAllByType(Native.Text)) {
    expect(text.props.numberOfLines).toBeUndefined();
    expect(text.props.maxFontSizeMultiplier).toBeUndefined();
  }
  dimensions.mockRestore();
});

// F6 da 1.6: decorações equipadas aparecem onde o aluno se vê.
describe('decorações equipadas', () => {
  const { DECORATIONS } = require('../../decorations/catalog') as typeof import('../../decorations/catalog');
  const item = (id: string) => DECORATIONS.find(d => d.id === id)!;
  const Native = require('react-native');

  it('sem decoração (flag desligada ou nada equipado), a estrutura é a da 1.5.0', () => {
    for (const decorations of [undefined, null, { moldura: null, selo: null, cartao: null }]) {
      const tree = render(<ProfileIdentityHeader email={null} onOpenSettings={() => undefined} decorations={decorations} />).toJSON() as {
        props: Record<string, unknown>; children: { props: Record<string, unknown>; children: { props: Record<string, unknown>; children: unknown[] }[] }[];
      };
      // Como a 1.5.0 desenhava: cabeçalho sem cartão, avatar filho direto da linha, nome filho direto do bloco.
      expect(tree.props.testID).toBeUndefined();
      expect(Native.StyleSheet.flatten(tree.props.style)).toEqual({ gap: 16 });
      const [row] = tree.children;
      expect(Native.StyleSheet.flatten(row.children[0].props.style)).toMatchObject({ minWidth: 64, borderWidth: 1 });
      type Node = { type: string; props: Record<string, unknown>; children: (Node | string)[] | null };
      const find = (node: Node | string): Node | null => typeof node === 'string' ? null
        : node.props.testID === 'profile-identity-text' ? node : (node.children ?? []).map(find).find(Boolean) ?? null;
      const first = find(tree as unknown as Node)?.children?.[0] as Node;
      expect([first.type, first.children]).toEqual(['Text', ['Estudante']]);
      expect(screen.queryByRole('image')).toBeNull();
      screen.unmount();
    }
  });

  it('o selo vem com o nome escrito para o leitor de tela, e a moldura e o cartão mudam a forma', () => {
    render(<ProfileIdentityHeader email={null} onOpenSettings={() => undefined}
      decorations={{ moldura: item('moldura-orbita'), selo: item('selo-faisca'), cartao: item('cartao-noite') }} />);
    expect(screen.getByLabelText('Selo Faísca')).toBeTruthy();
    const frame = Native.StyleSheet.flatten(screen.getByTestId('profile-avatar-frame', { includeHiddenElements: true }).props.style);
    expect(frame).toMatchObject({ borderWidth: 3, borderColor: item('moldura-orbita').art.type === 'moldura' ? (item('moldura-orbita').art as { ring: string }).ring : '' });
    // A moldura é decorativa: fica fora da árvore do leitor de tela, como o avatar.
    expect(screen.queryByTestId('profile-avatar-frame')).toBeNull();
    expect(screen.getByTestId('profile-avatar-frame-inner', { includeHiddenElements: true })).toBeTruthy();
    expect(Native.StyleSheet.flatten(screen.getByTestId('profile-identity-card').props.style)).toMatchObject({ borderWidth: 2 });
  });
});
