import { createContext, useEffect, useState, type ReactNode } from 'react';
import type { AuthUser } from '@/domain/auth/User';
import type { AuthRepository } from '@/domain/auth/AuthRepository';
import { authRepository } from '@/infrastructure/auth/auth.dependencies';

interface AuthContextValue {
    user: AuthUser | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    login: () => Promise<void>;
    register: () => Promise<void>;
    logout: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextValue | undefined>(
    undefined,
);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<AuthUser | null>(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        console.log('AuthProvider: initialisation Keycloak...');

        authRepository
            .init()
            .then(authenticated => {
                console.log(
                    'AuthProvider: authenticated =',
                    authenticated,
                );

                setIsAuthenticated(authenticated);
                setUser(authRepository.getCurrentUser());
            })
            .catch(error => {
                console.error(
                    'AuthProvider: erreur Keycloak',
                    error,
                );

                setIsAuthenticated(false);
                setUser(null);
            })
            .finally(() => {
                setIsLoading(false);
            });
    }, []);

    const value: AuthContextValue = {
        user,
        isAuthenticated,
        isLoading,
        login: () => authRepository.login(),
        register: () => authRepository.register(),
        logout: () => authRepository.logout(),
    };

    if (isLoading) {
        return <div>Chargement...</div>;
    }

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
}