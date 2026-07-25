import type { Order } from '@/domain/order/Order';
import type {
  CreateOrderData,
  OrderRepository,
} from '@/domain/order/OrderRepository';

export const createOrder = (
  repository: OrderRepository,
  data: CreateOrderData,
): Promise<Order> => repository.create(data);
