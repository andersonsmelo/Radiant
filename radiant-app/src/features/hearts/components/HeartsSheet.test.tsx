import React from 'react';
import { act, fireEvent, render } from '@testing-library/react-native';
import { ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { HeartIcon } from '../../../ui/components/HudIcons';
import { AppButton } from '../../../components/ui/AppButton';
import Svg, { Ellipse } from 'react-native-svg';
import type { HeartsSnapshot } from '../hearts.types';
import { HeartsSheet } from './HeartsSheet';
import { STORAGE_KEYS } from '../../../constants/storageKeys';
import { ConversionService } from '../../conversion/ConversionService';

jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock'));

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

// Achado 3 da prova de 2026-11-07: a folha também lia a hora uma vez só.
describe('HeartsSheet — o tempo da próxima vida anda sozinho', () => {
  beforeEach(() => {
    jest.useFakeTimers();
    jest.setSystemTime(nowMs);
  });
  afterEach(() => jest.useRealTimers());

  it('sem nowMs, a espera diminui conforme o relógio passa', () => {
    const screen = render(sheet({ nowMs: undefined }));
    expect(screen.getByText('A próxima volta em 30 min.')).toBeTruthy();

    act(() => { jest.advanceTimersByTime(10 * 60_000); });

    expect(screen.getByText('A próxima volta em 20 min.')).toBeTruthy();
  });
});

describe('HeartsSheet — convite de assinatura (F8)', () => {
  function conversao(ligada: boolean) {
    const dados = new Map<string, string>();
    const disco = {
      getItem: jest.fn(async (key: string) => dados.get(key) ?? null),
      setItem: jest.fn(async (key: string, value: string) => { dados.set(key, value); }),
    };
    const unlimited: HeartsSnapshot = { count: 0, status: 'unlimited', nextRefillAt: null, unlimitedUntil: '2026-09-14T12:30:00.000Z' };
    const hearts = { setUnlimited: jest.fn(async () => unlimited) };
    const service = new ConversionService({
      storage: disco, hearts, enabled: () => ligada,
      subscription: { getStatus: async () => ({ kind: 'none' }), storeAvailable: () => true },
    });
    return { service, disco, hearts, unlimited, dados };
  }

  it('sem vidas e chave ligada: convida, oferece a amostra e mantém Revisar e Voltar', async () => {
    const { service } = conversao(true);
    const view = render(sheet({ inviteAllowed: true, conversion: service, onHeartsChanged: jest.fn() }));
    expect(await view.findByText('Com o Radiant Ilimitado, errar não gasta vida.')).toBeTruthy();
    expect(view.getByRole('button', { name: /Experimentar/ })).toBeTruthy();
    expect(view.getByRole('button', { name: 'Revisar agora' })).toBeTruthy();
    expect(view.getByRole('button', { name: 'Voltar' })).toBeTruthy();
    expect(view.queryByText('Vidas ilimitadas')).toBeNull();
  });

  it('Conhecer o Ilimitado segue para a assinatura pelo mesmo caminho do link', async () => {
    const onSubscribe = jest.fn();
    const view = render(sheet({ inviteAllowed: true, conversion: conversao(true).service, onSubscribe }));
    fireEvent.press(await view.findByRole('button', { name: 'Conhecer o Ilimitado' }));
    expect(onSubscribe).toHaveBeenCalledTimes(1);
  });

  it('a amostra entrega as vidas novas à tela que montou a folha', async () => {
    const { service, hearts, unlimited } = conversao(true);
    const onHeartsChanged = jest.fn();
    const view = render(sheet({ inviteAllowed: true, conversion: service, onHeartsChanged }));
    const amostra = await view.findByRole('button', { name: /Experimentar/ });
    await act(async () => { fireEvent.press(amostra); });
    expect(hearts.setUnlimited).toHaveBeenCalledTimes(1);
    expect(onHeartsChanged).toHaveBeenCalledWith(unlimited);
  });

  it('com vidas, a folha não convida', async () => {
    const { service, disco } = conversao(true);
    const snapshot: HeartsSnapshot = { ...recovering, count: 2, status: 'recovering' };
    const view = render(sheet({ inviteAllowed: true, conversion: service, snapshot }));
    expect(await view.findByText('Vidas ilimitadas')).toBeTruthy();
    expect(view.queryByText('Com o Radiant Ilimitado, errar não gasta vida.')).toBeNull();
    expect(disco.setItem).not.toHaveBeenCalled();
  });

  it('reaberta no mesmo dia, volta ao link de sempre', async () => {
    const { service } = conversao(true);
    const first = render(sheet({ inviteAllowed: true, conversion: service }));
    await first.findByText('Com o Radiant Ilimitado, errar não gasta vida.');
    await act(async () => {});
    first.unmount();
    const second = render(sheet({ inviteAllowed: true, conversion: service }));
    expect(await second.findByText('Vidas ilimitadas')).toBeTruthy();
    expect(second.queryByText('Com o Radiant Ilimitado, errar não gasta vida.')).toBeNull();
  });

  it('sem a tela dizer que é uma pausa, não convida: nunca no meio de uma questão', async () => {
    const { service, disco } = conversao(true);
    const view = render(sheet({ conversion: service, onHeartsChanged: jest.fn() }));
    expect(await view.findByText('Vidas ilimitadas')).toBeTruthy();
    await act(async () => {});
    expect(view.queryByText('Com o Radiant Ilimitado, errar não gasta vida.')).toBeNull();
    expect(disco.setItem).not.toHaveBeenCalled();
  });

  it('desligada (contraprova): o link da main, sem convite e sem escrever a chave', async () => {
    const { service, disco, dados } = conversao(false);
    const view = render(sheet({ inviteAllowed: true, conversion: service, onHeartsChanged: jest.fn() }));
    expect(await view.findByText('Vidas ilimitadas')).toBeTruthy();
    expect(view.queryByText('Com o Radiant Ilimitado, errar não gasta vida.')).toBeNull();
    expect(view.queryByRole('button', { name: /Experimentar/ })).toBeNull();
    expect(disco.setItem).not.toHaveBeenCalled();
    expect(dados.has(STORAGE_KEYS.CONVERSION)).toBe(false);
  });
});
