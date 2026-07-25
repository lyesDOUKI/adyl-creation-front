import type { Order } from '@/domain/order/Order';
import type { OrderRepository } from '@/domain/order/OrderRepository';

export const getOrderById = (
  repository: OrderRepository,
  id: string,
): Promise<Order | undefined> => repository.getById(id);
