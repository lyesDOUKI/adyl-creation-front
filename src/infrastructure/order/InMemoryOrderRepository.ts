import type { Order } from '@/domain/order/Order';
import type {
  CreateOrderData,
  OrderRepository,
} from '@/domain/order/OrderRepository';
import { orderSeeds } from './orderSeeds';

export class InMemoryOrderRepository implements OrderRepository {
  private readonly orders: Order[] = [...orderSeeds];

  async getAll(): Promise<Order[]> {
    return this.orders;
  }

  async getById(id: string): Promise<Order | undefined> {
    return this.orders.find(o => o.id === id);
  }

  async create(data: CreateOrderData): Promise<Order> {
    const order: Order = {
      id: `CMD-${Date.now().toString().slice(-6)}`,
      items: data.items,
      total: data.items.reduce((sum, i) => sum + i.unitPrice * i.quantity, 0),
      status: 'pending',
      createdAt: new Date(),
      customerName: data.customerName,
      customerPhone: data.customerPhone,
      customerEmail: data.customerEmail,
      customerAddress: data.customerAddress,
      customerCity: data.custormerCity,
      message: data.message,
      steps: [
        { status: 'pending', label: 'Commande reçue', date: new Date(), completed: true },
        { status: 'confirmed', label: 'Confirmée', completed: false },
        { status: 'in_progress', label: 'En fabrication', completed: false },
        { status: 'shipped', label: 'Expédiée', completed: false },
        { status: 'delivered', label: 'Livrée', completed: false },
      ],
    };
    this.orders.push(order);
    return order;
  }
}
