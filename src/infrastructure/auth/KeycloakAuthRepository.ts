import type Keycloak from 'keycloak-js';
import type { AuthRepository } from '@/domain/auth/AuthRepository';
import type { AuthUser } from '@/domain/auth/User';
import { KeycloakAuthPopup } from './KeycloakAuthPopup';
import { KeycloakTokenManager } from './KeycloakTokenManager';
import { KeycloakUserMapper } from './KeycloakUserMapper';

export class KeycloakAuthRepository implements AuthRepository {

    private readonly popup: KeycloakAuthPopup;
    private readonly userMapper: KeycloakUserMapper;

    private currentUser: AuthUser | null = null;
    private initializationPromise: Promise<boolean> | null = null;

    constructor(
        private readonly keycloak: Keycloak,
        private readonly tokenManager: KeycloakTokenManager,
    ) {
        this.popup = new KeycloakAuthPopup();
        this.userMapper = new KeycloakUserMapper();

        this.keycloak.onAuthLogout = () => {
            this.currentUser = null;
            this.tokenManager.stop();
        };

        this.keycloak.onAuthRefreshSuccess = () => {
            this.updateCurrentUser();
        };

        this.keycloak.onAuthRefreshError = () => {
            this.currentUser = null;
        };
    }

    async init(): Promise<boolean> {
        if (this.initializationPromise) {
            return this.initializationPromise;
        }

        this.initializationPromise = this.initialize();

        return this.initializationPromise;
    }

    async login(): Promise<void> {
        const url = await this.keycloak.createLoginUrl({
            redirectUri: this.popup.getCallbackUrl(),
            locale: 'fr',
        });

        await this.popup.open(url);
    }

    async register(): Promise<void> {
        const url = await this.keycloak.createRegisterUrl({
            redirectUri: this.popup.getCallbackUrl(),
            locale: 'fr',
        });

        await this.popup.open(url);
    }

    async logout(): Promise<void> {
        await this.keycloak.logout({
            redirectUri: window.location.origin,
        });
    }

    getCurrentUser(): AuthUser | null {
        return this.currentUser;
    }

    isAuthenticated(): boolean {
        return this.keycloak.authenticated ?? false;
    }

    private async initialize(): Promise<boolean> {
        try {
            const authenticated = await this.keycloak.init({
                onLoad: 'check-sso',
                silentCheckSsoRedirectUri:
                    `${window.location.origin}/silent-check-sso.html`,
                pkceMethod: 'S256',
                checkLoginIframe: true,
            });

            if (authenticated) {
                this.updateCurrentUser();
                this.tokenManager.start();
            }

            return authenticated;
        } catch (error) {
            this.initializationPromise = null;
            throw error;
        }
    }

    private updateCurrentUser(): void {
        const token = this.keycloak.tokenParsed;

        this.currentUser = token
            ? this.userMapper.toDomain(token)
            : null;
    }
}