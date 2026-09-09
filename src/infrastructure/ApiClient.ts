// api-client.ts
import type { TokenProvider } from '@/domain/auth/TokenProvider';

interface RequestOptions extends RequestInit {
    requiresAuth?: boolean;
}

export class ApiClient {
    constructor(
        private readonly tokenProvider: TokenProvider,
        private readonly baseUrl = '/api'
    ) {}

    async get<T>(path: string, options?: RequestOptions): Promise<T> {
        return this.request<T>(path, { ...options, method: 'GET' });
    }

    async post<T>(path: string, body?: unknown, options?: RequestOptions): Promise<T> {
        return this.request<T>(path, {
            ...options,
            method: 'POST',
            body: body ? JSON.stringify(body) : undefined,
        });
    }

    async put<T>(path: string, body?: unknown, options?: RequestOptions): Promise<T> {
        return this.request<T>(path, {
            ...options,
            method: 'PUT',
            body: body ? JSON.stringify(body) : undefined,
        });
    }

    async delete<T>(path: string, options?: RequestOptions): Promise<T> {
        return this.request<T>(path, { ...options, method: 'DELETE' });
    }

    private async request<T>(path: string, options: RequestOptions): Promise<T> {
        const headers = this.buildHeaders(options.requiresAuth !== false, options.headers);
        const response = await fetch(`${this.baseUrl}${path}`, {
            ...options,
            headers,
        });

        if (!response.ok) {
            throw new ApiError(response.status, response.statusText);
        }

        return response.status === 204 ? (undefined as T) : response.json();
    }

    private buildHeaders(includeAuth: boolean, initialHeaders?: HeadersInit): Headers {
        const headers = new Headers(initialHeaders);
        headers.set('Content-Type', 'application/json');

        if (includeAuth) {
            const token = this.tokenProvider.getToken();
            if (token) {
                headers.set('Authorization', `Bearer ${token}`);
            }
        }

        return headers;
    }
}

export class ApiError extends Error {
    constructor(
        public readonly status: number,
        public readonly statusText: string
    ) {
        super(`HTTP ${status}: ${statusText}`);
        this.name = 'ApiError';
    }

    isNotFound(): boolean {
        return this.status === 404;
    }

    isUnauthorized(): boolean {
        return this.status === 401;
    }

    isForbidden(): boolean {
        return this.status === 403;
    }
}