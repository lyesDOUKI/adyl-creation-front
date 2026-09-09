export class KeycloakClient {
    private readonly keycloak: Keycloak;

    constructor() {
        this.keycloak = new Keycloak(keycloakConfig);
    }

    get instance(): Keycloak {
        return this.keycloak;
    }
}