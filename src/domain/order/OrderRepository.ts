import type { Order } from './Order';
import type { OrderItem } from './OrderItem';

export interface CreateOrderData {
  items: OrderItem[];
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  customerAddress: string;
  customerCity: string;
  message: string | null;
}

export interface OrderRepository {
  getAll(): Promise<Order[]>;
  getById(id: string): Promise<Order | undefined>;
  create(data: CreateOrderData): Promise<Order>;
}
