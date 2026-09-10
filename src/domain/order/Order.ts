import type { OrderItem } from './OrderItem';
import type { OrderStatus } from './OrderStatus';
import type { OrderStep } from './OrderStep';

export interface Order {
  id: string;
  customerId: string;
  items: OrderItem[];
  lineCount: number;
  totalQuantity: number;
  total: number;
  status: OrderStatus;
  createdAt: Date;
  updatedAt: Date;
  message?: string;
  steps: OrderStep[];
}