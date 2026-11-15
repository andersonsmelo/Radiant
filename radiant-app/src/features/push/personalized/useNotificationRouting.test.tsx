import React from 'react';
import { render, waitFor } from '@testing-library/react-native';
import * as Notifications from 'expo-notifications';
import { router } from 'expo-router';
import { AppConfig } from '../../../config';
import { resetNotificationRoutingForTests, routeFromNotification, useNotificationRouting } from './useNotificationRouting';

jest.mock('expo-router', () => ({ router: { push: jest.fn() } }));
jest.mock('expo-notifications', () => ({
  addNotificationResponseReceivedListener: jest.fn(() => ({ remove: jest.fn() })),
  getLastNotificationResponseAsync: jest.fn(async () => null),
}));

const notifications = Notifications as jest.Mocked<typeof Notifications>;
const push = router.push as jest.Mock;
const original = AppConfig.ENABLE_PERSONALIZED_NOTIFICATIONS;

function Host() { useNotificationRouting(); return null; }
const response = (data: unknown, id = 'radiant.lembrete.personalizado', date = 1) =>
  ({ notification: { date, request: { identifier: id, content: { data } } } }) as never;

beforeEach(() => { jest.clearAllMocks(); resetNotificationRoutingForTests(); });
afterEach(() => { AppConfig.ENABLE_PERSONALIZED_NOTIFICATIONS = original; });

describe('routeFromNotification', () => {
  it.each([
    [{ url: '/review' }, '/review'], [{ url: '/' }, '/'],
    [{ url: '/subscription' }, null], [{ url: 'https://exemplo.com' }, null], [{ type: 'goal' }, null], [null, null], ['x', null],
  ])('%p → %p (só rotas da lista)', (data, route) => {
    expect(routeFromNotification(data)).toBe(route);
  });
});

describe('useNotificationRouting', () => {
  it('desligada: nem ouve o toque', () => {
    AppConfig.ENABLE_PERSONALIZED_NOTIFICATIONS = false;
    render(<Host />);
    expect(notifications.addNotificationResponseReceivedListener).not.toHaveBeenCalled();
  });

  it('ligada: o toque abre a rota do lembrete', () => {
    AppConfig.ENABLE_PERSONALIZED_NOTIFICATIONS = true;
    render(<Host />);
    const listener = notifications.addNotificationResponseReceivedListener.mock.calls[0][0];
    listener(response({ url: '/review' }));
    expect(push).toHaveBeenCalledWith('/review');
  });

  it('app aberto pelo toque: navega uma vez, mesmo remontando', async () => {
    AppConfig.ENABLE_PERSONALIZED_NOTIFICATIONS = true;
    notifications.getLastNotificationResponseAsync.mockResolvedValue(response({ url: '/review' }));
    const first = render(<Host />);
    await waitFor(() => expect(push).toHaveBeenCalledTimes(1));
    first.unmount();
    render(<Host />);
    await new Promise(resolve => setImmediate(resolve));
    expect(push).toHaveBeenCalledTimes(1);
  });
});
