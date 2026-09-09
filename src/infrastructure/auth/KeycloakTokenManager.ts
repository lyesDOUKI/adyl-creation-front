import type Keycloak from 'keycloak-js';
import type { TokenProvider } from '@/domain/auth/TokenProvider';

export class KeycloakTokenManager implements TokenProvider {

    private refreshInterval: number | null = null;

    constructor(
        private readonly keycloak: Keycloak,
    ) {}

    getToken(): string | undefined {
        return this.keycloak.token;
    }

    start(): void {
        if (this.refreshInterval !== null) {
            return;
        }

        this.refreshInterval = window.setInterval(async () => {
            if (!this.keycloak.authenticated) {
                return;
            }

            try {
                await this.keycloak.updateToken(30);
            } catch (error) {
                console.error(
                    'Impossible de rafraîchir le token Keycloak.',
                    error,
                );

                this.keycloak.clearToken();
            }
        }, 20_000);
    }

    stop(): void {
        if (this.refreshInterval === null) {
            return;
        }

        window.clearInterval(this.refreshInterval);
        this.refreshInterval = null;
    }

    clear(): void {
        this.keycloak.clearToken();
    }
}