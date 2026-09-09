import type { KeycloakTokenParsed } from 'keycloak-js';
import type { AuthUser } from '@/domain/auth/User';

export class KeycloakUserMapper {

    toDomain(token: KeycloakTokenParsed): AuthUser {
        return {
            id: token.sub ?? '',
            email: token.email ?? '',
            firstName: token.given_name,
            lastName: token.family_name,
            roles: token.realm_access?.roles ?? [],
        };
    }
}