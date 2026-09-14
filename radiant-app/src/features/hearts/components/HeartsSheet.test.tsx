import React from 'react';
import { fireEvent, render } from '@testing-library/react-native';

import type { HeartsSnapshot } from '../hearts.types';
import { HeartsSheet } from './HeartsSheet';

const recovering: HeartsSnapshot = {
  count: 0,
  status: 'empty',
  nextRefillAt: '2026-09-14T12:30:00.000Z',
  unlimitedUntil: null,
};

describe('HeartsSheet', () => {
  it('oferece esperar, revisar e assinar quando as três saídas existem', () => {
    const onReview = jest.fn();
    const onSubscribe = jest.fn();
    const screen = render(
      <HeartsSheet
        visible
        snapshot={recovering}
        nowMs={Date.parse('2026-09-14T12:00:00.000Z')}
        dueReviewCount={2}
        storeAvailable
        onClose={jest.fn()}
        onReview={onReview}
        onSubscribe={onSubscribe}
      />,
    );

    expect(screen.getByText('Próxima vida em 30 min')).toBeTruthy();
    fireEvent.press(screen.getByRole('button', { name: 'Revisar agora' }));
    fireEvent.press(screen.getByRole('button', { name: 'Ver assinatura' }));
    expect(onReview).toHaveBeenCalledTimes(1);
    expect(onSubscribe).toHaveBeenCalledTimes(1);
  });

  it('omite Revisar quando nada está devido', () => {
    const screen = render(
      <HeartsSheet
        visible
        snapshot={recovering}
        nowMs={Date.parse('2026-09-14T12:00:00.000Z')}
        dueReviewCount={0}
        storeAvailable
        onClose={jest.fn()}
        onReview={jest.fn()}
        onSubscribe={jest.fn()}
      />,
    );

    expect(screen.queryByRole('button', { name: 'Revisar agora' })).toBeNull();
    expect(screen.getByRole('button', { name: 'Ver assinatura' })).toBeTruthy();
  });

  it('omite Assinar e explica quando a loja está indisponível', () => {
    const screen = render(
      <HeartsSheet
        visible
        snapshot={recovering}
        nowMs={Date.parse('2026-09-14T12:00:00.000Z')}
        dueReviewCount={1}
        storeAvailable={false}
        onClose={jest.fn()}
        onReview={jest.fn()}
        onSubscribe={jest.fn()}
      />,
    );

    expect(screen.queryByRole('button', { name: 'Ver assinatura' })).toBeNull();
    expect(screen.getByText('Assinatura indisponível neste aparelho.')).toBeTruthy();
  });
});
