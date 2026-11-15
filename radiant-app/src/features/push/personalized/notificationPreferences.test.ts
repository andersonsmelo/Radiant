import AsyncStorage from '@react-native-async-storage/async-storage';
import { NOTIFICATION_PREFERENCES_KEY, readNotificationPreferences, setNotificationPreference } from './notificationPreferences';
import { ALL_ON } from './composeReminder';

jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock'));

beforeEach(() => AsyncStorage.clear());

describe('preferências por tipo de lembrete', () => {
  it('sem nada gravado, todos os tipos ligados (o geral continua no push.optin.v1)', async () => {
    expect(await readNotificationPreferences()).toEqual(ALL_ON);
  });

  it('grava um tipo e preserva os demais', async () => {
    await setNotificationPreference('liga', false);
    await setNotificationPreference('meta', false);
    expect(await readNotificationPreferences()).toEqual({ ...ALL_ON, liga: false, meta: false });
    expect(JSON.parse((await AsyncStorage.getItem(NOTIFICATION_PREFERENCES_KEY))!)).toMatchObject({ schemaVersion: 1 });
  });

  it.each(['{', 'null', '{"schemaVersion":2,"liga":false}', '{"schemaVersion":1,"liga":"não"}'])(
    'registro inválido %p não desliga nada', async (raw) => {
      await AsyncStorage.setItem(NOTIFICATION_PREFERENCES_KEY, raw);
      expect(await readNotificationPreferences()).toEqual(ALL_ON);
    });
});
