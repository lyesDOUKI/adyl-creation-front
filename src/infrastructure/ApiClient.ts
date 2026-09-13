import type {TokenProvider} from '@/domain/auth/TokenProvider';

interface RequestOptions extends RequestInit {
    requiresAuth?: boolean;
}

export interface ProblemDetails {
    failureType?: string;
    code?: string;
    title?: string;
    detail?: string;
    status?: number;
    instance?: string;
}

const DEFAULT_ERROR_MESSAGE = 'Une erreur est survenue, veuillez réessayer.';

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
            const problem = await this.tryParseProblem(response);
            throw new ApiError(response.status, response.statusText, problem);
        }

        return response.status === 204 ? (undefined as T) : response.json();
    }

    private async tryParseProblem(response: Response): Promise<ProblemDetails | undefined> {
        try {
            const contentType = response.headers.get('content-type') ?? '';
            if (!contentType.includes('json')) {
                return undefined;
            }
            return await response.json() as ProblemDetails;
        } catch {
            return undefined;
        }
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
        public readonly statusText: string,
        public readonly problem?: ProblemDetails
    ) {
        super(problem?.title ?? problem?.detail ?? DEFAULT_ERROR_MESSAGE);
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

    isBusinessRule(): boolean {
        return this.status === 422 && this.problem?.failureType === 'BUSINESS_RULE';
    }

    isValidationError(): boolean {
        return this.status === 422 && this.problem?.failureType === 'VALIDATION';
    }

    get title(): string | undefined {
        return this.problem?.title;
    }

    get detail(): string | undefined {
        return this.problem?.detail;
    }

    get code(): string | undefined {
        return this.problem?.code;
    }

    get userMessage(): string {
        return this.problem?.title ?? this.problem?.detail ?? DEFAULT_ERROR_MESSAGE;
    }
}