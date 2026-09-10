import type { OrderStatus } from './OrderStatus';

export interface OrderStep {
  status: OrderStatus;
  label: string;
  date?: Date;
  completed: boolean;
}