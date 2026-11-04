import React from 'react';
import { fireEvent, render } from '@testing-library/react-native';
import { ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { HeartIcon } from '../../../ui/components/HudIcons';
import { AppButton } from '../../../components/ui/AppButton';
import Svg, { Ellipse } from 'react-native-svg';
import type { HeartsSnapshot } from '../hearts.types';
import { HeartsSheet } from './HeartsSheet';

// I/O da preferência do sistema é fixado; a folha e o vetor continuam reais.
jest.mock('../../../ui/accessibility/useReducedMotionPreference', () => ({
  useReducedMotionPreference: () => false,
  useReducedMotionPreferenceState: () => ({ reducedMotionEnabled: false, resolved: true }),
}));

const nowMs = Date.parse('2026-09-14T12:00:00.000Z');
const recovering: HeartsSnapshot = {
  count: 0, status: 'empty', nextRefillAt: '2026-09-14T12:30:00.000Z', unlimitedUntil: null,
};
function sheet(overrides: Partial<React.ComponentProps<typeof HeartsSheet>> = {}) {
  return <HeartsSheet visible snapshot={recovering} nowMs={nowMs} dueReviewCount={2}
    storeAvailable onClose={jest.fn()} onReview={jest.fn()} onSubscribe={jest.fn()} {...overrides} />;
}

describe('HeartsSheet', () => {
  it.each([0, 1, 2, 3, 4, 5])('desenha os cinco corações de 40 pt, com %i cheios', count => {
    const snapshot: HeartsSnapshot = { ...recovering, count, status: count === 0 ? 'empty' : count === 5 ? 'full' : 'recovering' };
    const view = render(sheet({ snapshot }));
    const icons = view.UNSAFE_getAllByType(HeartIcon);
    expect(icons).toHaveLength(5);
    expect(icons.map(icon => icon.props.filled)).toEqual([
      count > 0, count > 1, count > 2, count > 3, count > 4,
    ]);
    icons.forEach((icon, index) => {
      expect(icon.props.size).toBe(40);
      // O vetor real tem realce apenas nos cheios; Jest não rasteriza SVG.
      expect(icon.findAllByType(Ellipse)).toHaveLength(index < count ? 1 : 0);
      expect(icon.findByType(Svg).props.width).toBe(40);
    });
    expect(view.getByText(count === 0 ? 'Sem vidas' : 'Suas vidas')).toBeTruthy();
    expect(view.getByLabelText(`${count} de 5 vidas`)).toBeTruthy();
  });

  it('prioriza revisão e oferece assinatura como link, com fechar e voltar funcionais', () => {
    const onReview = jest.fn(); const onSubscribe = jest.fn(); const onClose = jest.fn();
    const view = render(sheet({ onReview, onSubscribe, onClose }));
    expect(view.getByText('A próxima volta em 30 min.')).toBeTruthy();
    const review = view.UNSAFE_getAllByType(AppButton).find(button => button.props.label === 'Revisar agora');
    expect(review?.props.variant).toBe('galaxy');
    fireEvent.press(view.getByRole('button', { name: 'Revisar agora' }));
    fireEvent.press(view.getByRole('link', { name: 'Vidas ilimitadas' }));
    fireEvent.press(view.getByRole('button', { name: 'Voltar' }));
    expect(onReview).toHaveBeenCalledTimes(1); expect(onSubscribe).toHaveBeenCalledTimes(1); expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('sem revisão devida, Voltar é a ação principal', () => {
    const view = render(sheet({ dueReviewCount: 0 }));
    expect(view.queryByRole('button', { name: 'Revisar agora' })).toBeNull();
    expect(view.UNSAFE_getAllByType(AppButton).find(button => button.props.label === 'Voltar')?.props.variant).toBe('galaxy');
  });

  it('sem loja omite link de assinatura', () => {
    const view = render(sheet({ storeAvailable: false }));
    expect(view.queryByRole('link', { name: 'Vidas ilimitadas' })).toBeNull();
    expect(view.getByText('Assinatura indisponível neste aparelho.')).toBeTruthy();
  });

  it.each([
    ['2026-09-14T12:01:01.000Z', 'A próxima volta em 2 min.'],
    ['2026-09-14T11:59:00.000Z', 'A próxima volta em 1 min.'],
    [null, 'A próxima vida chegará em breve'],
  ])('usa a recarga real %s sem inventar prazo', (nextRefillAt, copy) => {
    const view = render(sheet({ snapshot: { ...recovering, nextRefillAt } }));
    expect(view.getByText(copy)).toBeTruthy();
  });

  it('vidas cheias não fabricam prazo', () => {
    const view = render(sheet({ snapshot: { ...recovering, count: 5, status: 'full' } }));
    expect(view.getByText('Suas vidas estão cheias')).toBeTruthy();
    expect(view.queryByText(/A próxima volta/)).toBeNull();
  });

  it('ilimitado não abre nem quando visible chega verdadeiro', () => {
    const view = render(sheet({ snapshot: { ...recovering, status: 'unlimited' } }));
    expect(view.toJSON()).toBeNull();
  });

  it('mantém conteúdo e ações na rolagem e protege as áreas seguras sem limitar texto', () => {
    const view = render(sheet());
    const scroll = view.UNSAFE_getByType(ScrollView);
    expect(view.UNSAFE_getByType(SafeAreaView).props.edges).toEqual(['top', 'bottom']);
    expect(StyleSheet.flatten(scroll.props.style).flexShrink).toBe(1);
    for (const label of ['Sem vidas', 'A próxima volta em 30 min.', 'Vidas ilimitadas']) {
      const text = view.getByText(label);
      expect(text.props.numberOfLines).toBeUndefined();
      expect(text.props.maxFontSizeMultiplier).toBeUndefined();
      let ancestor = text.parent;
      while (ancestor && ancestor !== scroll) ancestor = ancestor.parent;
      expect(ancestor).toBe(scroll);
    }
  });
});
