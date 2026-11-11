import {OrderRepository} from "@/domain/order/OrderRepository.ts";
import {Order} from "@/domain/order/Order.ts";
import {hasLink} from "@/infrastructure/HalLinks.ts";

export const cancelOrder = async (
    repository: OrderRepository,
    order: Order,
): Promise<void> => {
    if (!hasLink(order, 'cancel')) {
        throw new Error("Cette commande ne peut plus être annulée.");
    }
    await repository.cancel(order);
};