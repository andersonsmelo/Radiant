import AsyncStorage from '@react-native-async-storage/async-storage';
import { ApiError, apiRequest, isApiConfigured } from '../../lib/api';
import { TelemetryService } from '../telemetry/TelemetryService';
import { LocalAccountMigrationService } from './LocalAccountMigrationService';
import type {
    AuthSession,
    PasswordResetConfirmResponse,
    PasswordResetRequestResponse,
} from './types';

const AUTH_SESSION_STORAGE_KEY = '@radiant:auth_session_v1';

class AuthServiceImpl {
    private session: AuthSession | null = null;
    private initialized = false;

    private parseSession(raw: string | null): AuthSession | null {
        if (!raw) {
            return null;
        }

        const parsed = JSON.parse(raw) as Partial<AuthSession>;

        if (!parsed.user?.id || !parsed.accessToken) {
            return null;
        }

        return {
            accessToken: parsed.accessToken,
            refreshToken: parsed.refreshToken,
            user: parsed.user,
            expiresAt: parsed.expiresAt,
        };
    }

    async bootstrap(): Promise<AuthSession | null> {
        if (this.initialized) {
            return this.session;
        }

        if (!isApiConfigured()) {
            this.initialized = true;
            this.session = null;
            return null;
        }

        try {
            void TelemetryService.track('auth_bootstrap', { configured: isApiConfigured() });
            const raw = await AsyncStorage.getItem(AUTH_SESSION_STORAGE_KEY);
            this.session = this.parseSession(raw);
        } catch (error) {
            console.error('[AuthService] Failed to read persisted session:', error);
            this.session = null;
            try {
                await AsyncStorage.removeItem(AUTH_SESSION_STORAGE_KEY);
            } catch {
                // Test doubles may not return a Promise consistently; ignore cleanup failures.
            }
        }

        this.initialized = true;
        if (this.session && this.isAccessTokenExpired(this.session) && this.session.refreshToken) {
            await this.refreshSession().catch((error) => {
                console.error('[AuthService] Failed to refresh expired session during bootstrap:', error);
            });
        }

        return this.session;
    }

    isInitialized(): boolean {
        return this.initialized;
    }

    getSession(): AuthSession | null {
        return this.session;
    }

    hasAuthenticatedSession(): boolean {
        return Boolean(this.session?.user.id && (this.session.accessToken || this.session.refreshToken));
    }

    async setSession(session: AuthSession | null): Promise<void> {
        this.session = session;
        this.initialized = true;

        try {
            if (session) {
                await AsyncStorage.setItem(AUTH_SESSION_STORAGE_KEY, JSON.stringify(session));
            } else {
                await AsyncStorage.removeItem(AUTH_SESSION_STORAGE_KEY);
            }
        } catch (error) {
            console.error('[AuthService] Failed to persist session:', error);
        }

        void TelemetryService.setUserContext(
            session
                ? {
                      id: session.user.id,
                      email: session.user.email,
                  }
                : null
        );
    }

    async register(email: string, password: string): Promise<AuthSession> {
        try {
            void TelemetryService.track('auth_login_attempt', { provider: 'email', mode: 'register' });
            const session = await apiRequest<AuthSession>('/v1/auth/register', {
                method: 'POST',
                body: JSON.stringify({ email, password }),
            });

            await this.finalizeAuthenticatedSession(session);
            void TelemetryService.track('auth_register_success', { provider: 'email' });
            return session;
        } catch (error) {
            void TelemetryService.track('auth_register_failure', {
                provider: 'email',
                message: error instanceof Error ? error.message : 'unknown_error',
            });
            throw error;
        }
    }

    async login(email: string, password: string): Promise<AuthSession> {
        try {
            void TelemetryService.track('auth_login_attempt', { provider: 'email', mode: 'login' });
            const session = await apiRequest<AuthSession>('/v1/auth/login', {
                method: 'POST',
                body: JSON.stringify({ email, password }),
            });

            await this.finalizeAuthenticatedSession(session);
            void TelemetryService.track('auth_login_success', { provider: 'email' });
            return session;
        } catch (error) {
            void TelemetryService.track('auth_login_failure', {
                provider: 'email',
                message: error instanceof Error ? error.message : 'unknown_error',
            });
            throw error;
        }
    }

    async requestPasswordReset(email: string): Promise<PasswordResetRequestResponse> {
        try {
            const result = await apiRequest<PasswordResetRequestResponse>('/v1/auth/password-reset/request', {
                method: 'POST',
                body: JSON.stringify({ email: email.trim().toLowerCase() }),
            });

            void TelemetryService.track('auth_password_reset_requested', {
                provider: 'email',
                tokenPreviewAvailable: Boolean(result.resetToken),
            });
            return result;
        } catch (error) {
            void TelemetryService.track('auth_password_reset_request_failed', {
                provider: 'email',
                message: error instanceof Error ? error.message : 'unknown_error',
            });
            throw error;
        }
    }

    async confirmPasswordReset(
        email: string,
        resetToken: string,
        password: string
    ): Promise<PasswordResetConfirmResponse> {
        try {
            const result = await apiRequest<PasswordResetConfirmResponse>('/v1/auth/password-reset/confirm', {
                method: 'POST',
                body: JSON.stringify({
                    email: email.trim().toLowerCase(),
                    resetToken: resetToken.trim(),
                    password,
                }),
            });

            void TelemetryService.track('auth_password_reset_confirmed', {
                provider: 'email',
            });
            return result;
        } catch (error) {
            void TelemetryService.track('auth_password_reset_confirm_failed', {
                provider: 'email',
                message: error instanceof Error ? error.message : 'unknown_error',
            });
            throw error;
        }
    }

    async getValidAccessToken(): Promise<string | null> {
        if (!this.session) {
            return null;
        }

        if (!this.isAccessTokenExpired(this.session)) {
            return this.session.accessToken;
        }

        if (!this.session.refreshToken) {
            await this.setSession(null);
            return null;
        }

        const refreshed = await this.refreshSession();
        return refreshed?.accessToken ?? null;
    }

    async hydrateUser(): Promise<AuthSession | null> {
        const accessToken = await this.getValidAccessToken();
        if (!accessToken) {
            return null;
        }

        try {
            const result = await apiRequest<{ user: AuthSession['user'] }>('/v1/auth/me', {}, accessToken);
            const nextSession: AuthSession = {
                ...this.session!,
                accessToken,
                user: result.user,
            };

            await this.setSession(nextSession);
            return nextSession;
        } catch (error) {
            if (this.isUnauthorized(error) && this.session?.refreshToken) {
                const refreshed = await this.refreshSession();
                if (!refreshed) {
                    return null;
                }

                const result = await apiRequest<{ user: AuthSession['user'] }>(
                    '/v1/auth/me',
                    {},
                    refreshed.accessToken
                );
                const nextSession: AuthSession = {
                    ...refreshed,
                    user: result.user,
                };

                await this.setSession(nextSession);
                return nextSession;
            }

            throw error;
        }
    }

    async refreshSession(): Promise<AuthSession | null> {
        if (!this.session?.refreshToken) {
            return null;
        }

        try {
            const nextSession = await apiRequest<AuthSession>('/v1/auth/refresh', {
                method: 'POST',
                body: JSON.stringify({ refreshToken: this.session.refreshToken }),
            });

            await this.setSession(nextSession);
            void TelemetryService.track('auth_session_refreshed');
            return nextSession;
        } catch (error) {
            if (this.isUnauthorized(error)) {
                await this.setSession(null);
                return null;
            }

            throw error;
        }
    }

    async logout(): Promise<void> {
        if (this.session?.refreshToken) {
            try {
                await apiRequest(
                    '/v1/auth/logout',
                    {
                        method: 'POST',
                        body: JSON.stringify({ refreshToken: this.session.refreshToken }),
                    },
                    this.session.accessToken
                );
            } catch (error) {
                console.error('[AuthService] Failed to revoke refresh token during logout:', error);
            }
        }

        await this.setSession(null);
        void TelemetryService.track('auth_logout');
    }

    async resetLocalSession(): Promise<void> {
        await this.setSession(null);
    }

    async resetForTests(): Promise<void> {
        this.session = null;
        this.initialized = false;
        try {
            await AsyncStorage.removeItem(AUTH_SESSION_STORAGE_KEY);
        } catch {
            // Test doubles may not return a Promise consistently; ignore cleanup failures.
        }
    }

    private async finalizeAuthenticatedSession(session: AuthSession): Promise<void> {
        await this.setSession(session);
        await LocalAccountMigrationService.migrateLocalStateToAuthenticatedAccount(session);
    }

    private isAccessTokenExpired(session: AuthSession): boolean {
        if (!session.expiresAt) {
            return false;
        }

        const expiresAt = new Date(session.expiresAt).getTime();
        return Number.isFinite(expiresAt) && expiresAt <= Date.now() + 60_000;
    }

    private isUnauthorized(error: unknown): boolean {
        return error instanceof ApiError && error.status === 401;
    }
}

export const AuthService = new AuthServiceImpl();
