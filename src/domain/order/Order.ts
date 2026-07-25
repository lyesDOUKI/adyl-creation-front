import type { OrderItem } from './OrderItem';
import type { OrderStatus } from './OrderStatus';
import type { OrderStep } from './OrderStep';

export interface Order {
  id: string;
  items: OrderItem[];
  total: number;
  status: OrderStatus;
  createdAt: Date;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  customerAddress: string;
  customerCity: string;
  message?: string;
  steps: OrderStep[];
}
