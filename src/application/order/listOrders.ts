import type { Order } from '@/domain/order/Order';
import type { OrderRepository } from '@/domain/order/OrderRepository';

export const listOrders = async (repository: OrderRepository): Promise<Order[]> =>
  repository.getAll();
