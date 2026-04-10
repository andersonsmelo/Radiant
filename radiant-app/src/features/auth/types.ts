export interface AuthBootstrapState {
    initialized: boolean;
    hasSession: boolean;
}

export interface AuthUser {
    id: string;
    email: string;
}

export interface AuthSession {
    accessToken: string;
    refreshToken?: string;
    user: AuthUser;
    expiresAt?: string;
}

export interface PasswordResetRequestResponse {
    accepted: true;
    resetToken?: string;
}

export interface PasswordResetConfirmResponse {
    success: true;
}
