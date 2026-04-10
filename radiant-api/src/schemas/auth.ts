import { z } from 'zod';

export const credentialsSchema = z.object({
    email: z.email(),
    password: z.string().min(8),
});

export const refreshTokenSchema = z.object({
    refreshToken: z.string().min(20),
});

export const passwordResetRequestSchema = z.object({
    email: z.email(),
});

export const passwordResetConfirmSchema = z.object({
    email: z.email(),
    resetToken: z.string().min(20),
    password: z.string().min(8),
});
