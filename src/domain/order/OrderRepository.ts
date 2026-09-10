import type { Order } from './Order';
import type { OrderItem } from './OrderItem';

export interface CreateOrderData {
  items: CreateOrderItem[];
  customerAddress: string;
  customerCity: string;
  message: string | null;
}
export interface CreateOrderItem {
  productId: string;
  quantity: number;
  chosenColor?: string;
}
export interface OrderRepository {
  getAll(): Promise<Order[]>;
  getById(id: string): Promise<Order | undefined>;
  create(data: CreateOrderData): Promise<Order>;
}
