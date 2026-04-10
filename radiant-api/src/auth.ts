import { createHash, randomBytes } from 'node:crypto';
import bcrypt from 'bcryptjs';
import { SignJWT, jwtVerify } from 'jose';
import { config } from './config.js';

const secret = new TextEncoder().encode(config.jwtSecret);

export async function hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, 12);
}

export async function verifyPassword(password: string, passwordHash: string): Promise<boolean> {
    return bcrypt.compare(password, passwordHash);
}

export async function signAccessToken(payload: { sub: string; email: string }): Promise<{
    token: string;
    expiresAt: string;
}> {
    const expiresAt = new Date(Date.now() + config.accessTokenTtlHours * 60 * 60 * 1000);
    const token = await new SignJWT({ email: payload.email })
        .setProtectedHeader({ alg: 'HS256' })
        .setSubject(payload.sub)
        .setIssuedAt()
        .setExpirationTime(Math.floor(expiresAt.getTime() / 1000))
        .sign(secret);

    return {
        token,
        expiresAt: expiresAt.toISOString(),
    };
}

export async function verifyAccessToken(token: string): Promise<{ userId: string; email: string }> {
    const verified = await jwtVerify(token, secret);

    return {
        userId: verified.payload.sub ?? '',
        email: typeof verified.payload.email === 'string' ? verified.payload.email : '',
    };
}

export function generateRefreshToken(): string {
    return randomBytes(48).toString('base64url');
}

export function hashRefreshToken(token: string): string {
    return createHash('sha256').update(token).digest('hex');
}

export function buildRefreshTokenExpiresAt(): string {
    return new Date(Date.now() + config.refreshTokenTtlDays * 24 * 60 * 60 * 1000).toISOString();
}

export function buildPasswordResetExpiresAt(): string {
    return new Date(Date.now() + config.passwordResetTokenTtlMinutes * 60 * 1000).toISOString();
}
