export interface TokenProvider {
    getToken(): string | undefined;
}