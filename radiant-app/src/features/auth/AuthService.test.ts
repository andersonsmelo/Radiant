import AsyncStorage from '@react-native-async-storage/async-storage';
import { AuthService } from './AuthService';
import { apiRequest } from '../../lib/api';
import { TelemetryService } from '../telemetry/TelemetryService';
import { LocalAccountMigrationService } from './LocalAccountMigrationService';

jest.mock('@react-native-async-storage/async-storage', () => ({
  __esModule: true,
  default: {
    getItem: jest.fn(),
    setItem: jest.fn(),
    removeItem: jest.fn(),
  },
}));

jest.mock('../../config', () => ({
  AppConfig: {
    API_BASE_URL: 'https://api.test',
  },
}));

jest.mock('../../lib/api', () => ({
  ApiError: class ApiError extends Error {
    status: number;

    constructor(message: string, status: number) {
      super(message);
      this.status = status;
    }
  },
  apiRequest: jest.fn(),
  isApiConfigured: jest.fn(() => true),
}));

jest.mock('../telemetry/TelemetryService', () => ({
  TelemetryService: {
    track: jest.fn().mockResolvedValue(undefined),
    setUserContext: jest.fn().mockResolvedValue(undefined),
  },
}));

jest.mock('./LocalAccountMigrationService', () => ({
  LocalAccountMigrationService: {
    migrateLocalStateToAuthenticatedAccount: jest.fn().mockResolvedValue(undefined),
  },
}));

const mockedStorage = AsyncStorage as jest.Mocked<typeof AsyncStorage>;
const mockedApiRequest = apiRequest as jest.MockedFunction<typeof apiRequest>;
const mockedTelemetryTrack = TelemetryService.track as jest.MockedFunction<typeof TelemetryService.track>;
const mockedTelemetrySetUserContext = TelemetryService.setUserContext as jest.MockedFunction<
  typeof TelemetryService.setUserContext
>;
const mockedLocalAccountMigrationService =
  LocalAccountMigrationService as jest.Mocked<typeof LocalAccountMigrationService>;

describe('AuthService', () => {
  beforeEach(async () => {
    jest.clearAllMocks();
    await AuthService.resetForTests();
  });

  it('removes malformed persisted sessions during bootstrap', async () => {
    mockedStorage.getItem.mockResolvedValueOnce('{broken json');

    const session = await AuthService.bootstrap();

    expect(session).toBeNull();
    expect(mockedStorage.removeItem).toHaveBeenCalledWith('@radiant:auth_session_v1');
    expect(mockedTelemetryTrack).toHaveBeenCalledWith('auth_bootstrap', { configured: true });
  });

  it('logs in and persists the returned session', async () => {
    mockedApiRequest.mockResolvedValueOnce({
      accessToken: 'access-token',
      refreshToken: 'refresh-token',
      user: { id: 'user-1', email: 'user@example.com' },
    });

    const session = await AuthService.login('user@example.com', 'secret');

    expect(mockedApiRequest).toHaveBeenCalledWith(
      '/v1/auth/login',
      {
        method: 'POST',
        body: JSON.stringify({ email: 'user@example.com', password: 'secret' }),
      }
    );
    expect(session.user.id).toBe('user-1');
    expect(mockedStorage.setItem).toHaveBeenCalledWith(
      '@radiant:auth_session_v1',
      JSON.stringify(session)
    );
    expect(
      mockedLocalAccountMigrationService.migrateLocalStateToAuthenticatedAccount
    ).toHaveBeenCalledWith(session);
    expect(mockedTelemetryTrack).toHaveBeenCalledWith('auth_login_attempt', {
      provider: 'email',
      mode: 'login',
    });
    expect(mockedTelemetryTrack).toHaveBeenCalledWith('auth_login_success', { provider: 'email' });
    expect(mockedTelemetrySetUserContext).toHaveBeenCalledWith({
      id: 'user-1',
      email: 'user@example.com',
    });
  });

  it('registers, persists the session, and triggers local-state migration', async () => {
    mockedApiRequest.mockResolvedValueOnce({
      accessToken: 'register-access-token',
      refreshToken: 'register-refresh-token',
      user: { id: 'user-2', email: 'new@example.com' },
    });

    const session = await AuthService.register('new@example.com', 'secret123');

    expect(mockedApiRequest).toHaveBeenCalledWith(
      '/v1/auth/register',
      {
        method: 'POST',
        body: JSON.stringify({ email: 'new@example.com', password: 'secret123' }),
      }
    );
    expect(
      mockedLocalAccountMigrationService.migrateLocalStateToAuthenticatedAccount
    ).toHaveBeenCalledWith(session);
    expect(mockedTelemetryTrack).toHaveBeenCalledWith('auth_register_success', {
      provider: 'email',
    });
    expect(mockedTelemetrySetUserContext).toHaveBeenCalledWith({
      id: 'user-2',
      email: 'new@example.com',
    });
  });

  it('requests a password reset and returns the preview token when available', async () => {
    mockedApiRequest.mockResolvedValueOnce({
      accepted: true,
      resetToken: 'reset-token-1234567890',
    });

    const result = await AuthService.requestPasswordReset('USER@example.com');

    expect(mockedApiRequest).toHaveBeenCalledWith('/v1/auth/password-reset/request', {
      method: 'POST',
      body: JSON.stringify({ email: 'user@example.com' }),
    });
    expect(result).toEqual({
      accepted: true,
      resetToken: 'reset-token-1234567890',
    });
    expect(mockedTelemetryTrack).toHaveBeenCalledWith('auth_password_reset_requested', {
      provider: 'email',
      tokenPreviewAvailable: true,
    });
  });

  it('confirms a password reset with token and new password', async () => {
    mockedApiRequest.mockResolvedValueOnce({
      success: true,
    });

    const result = await AuthService.confirmPasswordReset(
      'USER@example.com',
      ' reset-token-1234567890 ',
      'new-secret-123'
    );

    expect(mockedApiRequest).toHaveBeenCalledWith('/v1/auth/password-reset/confirm', {
      method: 'POST',
      body: JSON.stringify({
        email: 'user@example.com',
        resetToken: 'reset-token-1234567890',
        password: 'new-secret-123',
      }),
    });
    expect(result).toEqual({ success: true });
    expect(mockedTelemetryTrack).toHaveBeenCalledWith('auth_password_reset_confirmed', {
      provider: 'email',
    });
  });
});
