export interface AuthUser {
    id: string;
    email: string;
    phone: string;
    firstName?: string;
    lastName?: string;
    roles: string[];
}