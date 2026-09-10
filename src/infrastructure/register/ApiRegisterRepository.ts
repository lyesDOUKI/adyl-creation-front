import {CustomerRepository, RegisterCustomerData} from "@/domain/customer/CustomerRepository.ts";
import {ApiClient} from "@/infrastructure/ApiClient.ts";


export class ApiRegisterRepository implements CustomerRepository {
    private readonly registerRoute = '/customer/me';

    constructor(private readonly apiClient: ApiClient) {}

    async register(data: RegisterCustomerData): Promise<void> {
        await this.apiClient.post<void>(this.registerRoute, data);
    }
}