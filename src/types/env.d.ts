export {};

declare global {
    interface Window {
        __ENV__: {
            KEYCLOAK_URL: string;
            KEYCLOAK_REALM: string;
            KEYCLOAK_CLIENT_ID: string;
            GEOCODE_API_URL: string;
        };
    }
}