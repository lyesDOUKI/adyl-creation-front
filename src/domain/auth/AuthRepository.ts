import type { AuthUser } from './User';

export interface AuthRepository {
    init(): Promise<boolean>;
    login(): Promise<void>;
    register(): Promise<void>;
    logout(): Promise<void>;
    getCurrentUser(): AuthUser | null;
    isAuthenticated(): boolean;
}