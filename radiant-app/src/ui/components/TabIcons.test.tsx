import React from 'react';
import { render } from '@testing-library/react-native';
import Svg, { Circle, Ellipse, Path, Rect } from 'react-native-svg';
import { ProfileTabIcon, StudyTabIcon } from './TabIcons';
import { galaxyColors, medalColors } from '../theme';

// Os dois ícones da barra de abas são desenhados em código, no mesmo relevo do
// Medalhão: três tons quando a aba está ativa, um tom só quando está inativa.
// O Jest não rasteriza SVG; a asserção recai sobre os `fill`, que são os valores
// que decidem o que o aluno vê.

const ICONS = [
  { name: 'StudyTabIcon', Icon: StudyTabIcon },
  { name: 'ProfileTabIcon', Icon: ProfileTabIcon },
] as const;

const fillsOf = (screen: ReturnType<typeof render>) =>
  screen.UNSAFE_getAllByType(Path).map((path) => path.props.fill as string);

describe.each(ICONS)('$name', ({ Icon }) => {
  it('inativo pinta um só tom', () => {
    const fills = fillsOf(render(<Icon focused={false} />));

    expect(fills.length).toBeGreaterThan(0);
    for (const fill of fills) {
      expect(fill).toBe(galaxyColors.tabBarInactive);
    }
  });

  it('ativo usa os tons da unidade', () => {
    const { face, lip, inner } = medalColors.unit;
    const fills = fillsOf(render(<Icon focused />));

    expect(new Set(fills)).toEqual(new Set([face, lip, inner]));
  });

  it('desenha tudo com Path, para que a asserção de cor cubra cada forma', () => {
    const screen = render(<Icon focused />);

    expect(screen.UNSAFE_queryAllByType(Circle)).toHaveLength(0);
    expect(screen.UNSAFE_queryAllByType(Ellipse)).toHaveLength(0);
    expect(screen.UNSAFE_queryAllByType(Rect)).toHaveLength(0);
  });

  it('é decorativo: o rótulo da aba é o texto visível', () => {
    const root = render(<Icon focused />).toJSON() as { props: Record<string, unknown> };

    expect(root.props.accessibilityElementsHidden).toBe(true);
    expect(root.props.importantForAccessibility).toBe('no-hide-descendants');
  });

  it('mede 28 por padrão e obedece a size', () => {
    expect(render(<Icon focused />).UNSAFE_getByType(Svg).props.width).toBe(28);
    expect(render(<Icon focused size={20} />).UNSAFE_getByType(Svg).props.width).toBe(20);
  });
});
