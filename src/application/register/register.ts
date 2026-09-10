import {CustomerRepository, RegisterCustomerData} from "@/domain/customer/CustomerRepository.ts";

export const register = (
    repository: CustomerRepository,
    data: RegisterCustomerData,
): Promise<void> =>
    repository.register({
        ...data,
        phone: data.phone,
    });