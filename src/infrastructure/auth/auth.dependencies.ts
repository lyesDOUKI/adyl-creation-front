import Keycloak from 'keycloak-js';
import type { AuthRepository } from '@/domain/auth/AuthRepository';
import type { TokenProvider } from '@/domain/auth/TokenProvider';
import { keycloakConfig } from './keycloak.config';
import { KeycloakAuthRepository } from './KeycloakAuthRepository';
import { KeycloakTokenManager } from './KeycloakTokenManager';

const keycloak = new Keycloak(keycloakConfig);

const tokenManager = new KeycloakTokenManager(
    keycloak,
);

export const authRepository: AuthRepository =
    new KeycloakAuthRepository(
        keycloak,
        tokenManager,
    );

export const tokenProvider: TokenProvider =
    tokenManager;