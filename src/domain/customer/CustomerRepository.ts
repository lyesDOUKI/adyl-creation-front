export interface RegisterCustomerData {
    email: string;
    phone: string;
}

export interface CustomerRepository {
    register(data: RegisterCustomerData): Promise<void>;
}