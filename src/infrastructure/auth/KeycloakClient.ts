import Keycloak from "keycloak-js";
import {keycloakConfig} from "@/infrastructure/auth/keycloak.config.ts";

export class KeycloakClient {
    private readonly keycloak: Keycloak;

    constructor() {
        this.keycloak = new Keycloak(keycloakConfig);
    }

    get instance(): Keycloak {
        return this.keycloak;
    }
}