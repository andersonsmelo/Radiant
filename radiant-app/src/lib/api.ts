import { AppConfig } from '../config';

export class ApiError extends Error {
    status: number;
    code: 'timeout' | 'network' | 'unauthorized' | 'server' | 'unknown';

    constructor(
        message: string,
        status: number,
        code: 'timeout' | 'network' | 'unauthorized' | 'server' | 'unknown' = 'unknown'
    ) {
        super(message);
        this.name = 'ApiError';
        this.status = status;
        this.code = code;
    }
}

const DEFAULT_API_TIMEOUT_MS = 10_000;

function resolveBaseUrl(): string {
    return AppConfig.API_BASE_URL;
}

function buildRequestUrl(baseUrl: string, path: string): string {
    if (!path.startsWith('/')) {
        throw new ApiError('API path must start with "/"', 0, 'unknown');
    }

    return new URL(path, `${baseUrl}/`).toString();
}

export function isApiConfigured(): boolean {
    if (!AppConfig.API_BASE_URL) {
        return false;
    }

    try {
        const url = new URL(AppConfig.API_BASE_URL);
        return url.protocol === 'https:' || url.protocol === 'http:';
    } catch {
        return false;
    }
}

export async function apiRequest<T>(
    path: string,
    init: RequestInit = {},
    accessToken?: string
): Promise<T> {
    const baseUrl = resolveBaseUrl();

    if (!baseUrl) {
        throw new ApiError('API base URL is not configured', 0, 'unknown');
    }

    const headers = new Headers(init.headers);
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), DEFAULT_API_TIMEOUT_MS);

    if (!headers.has('Content-Type') && init.body) {
        headers.set('Content-Type', 'application/json');
    }

    if (!headers.has('Accept')) {
        headers.set('Accept', 'application/json');
    }

    if (accessToken) {
        headers.set('Authorization', `Bearer ${accessToken}`);
    }

    let response: Response;

    try {
        response = await fetch(buildRequestUrl(baseUrl, path), {
            ...init,
            headers,
            signal: init.signal ?? controller.signal,
        });
    } catch (error) {
        clearTimeout(timeout);

        if (error instanceof Error && error.name === 'AbortError') {
            throw new ApiError('API request timed out', 0, 'timeout');
        }

        throw new ApiError(error instanceof Error ? error.message : 'Network request failed', 0, 'network');
    }

    clearTimeout(timeout);

    if (!response.ok) {
        let message = `API request failed with status ${response.status}`;

        try {
            const errorBody = await response.clone().json();
            if (typeof errorBody?.message === 'string') {
                message = errorBody.message;
            }
        } catch {
            // Keep default message
        }

        const code =
            response.status === 401 ? 'unauthorized' : response.status >= 500 ? 'server' : 'unknown';
        throw new ApiError(message, response.status, code);
    }

    if (response.status === 204) {
        return undefined as T;
    }

    const contentType = response.headers.get('content-type') ?? '';
    if (!contentType.includes('application/json')) {
        return undefined as T;
    }

    return response.json() as Promise<T>;
}
