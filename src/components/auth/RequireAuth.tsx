import { ReactNode, useEffect } from 'react';
import { useAuth } from '@/ui/hooks/useAuth';

export function RequireAuth({ children }: { children: ReactNode }) {
    const { isAuthenticated, isLoading, login } = useAuth();

    useEffect(() => {
        if (!isLoading && !isAuthenticated) {
            login();
        }
    }, [isLoading, isAuthenticated, login]);

    if (isLoading) {
        return <p>Chargement...</p>;
    }

    if (!isAuthenticated) {
        return null;
    }

    return <>{children}</>;
}