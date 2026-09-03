import type { Order } from '@/domain/order/Order';
import type {
  CreateOrderData,
  OrderRepository,
} from '@/domain/order/OrderRepository';

interface CreateOrderRequest {
  customerName: string;
  customerEmail: string;
  customerPhoneNumber: string;
  customerAddress: string;
  customerCity: string;
  customerMessage?: string;
  items: CreateOrderItemRequest[];
}

interface CreateOrderItemRequest {
  productId: string;
  quantity: number;
  color?: string;
}

interface CreateOrderResponse {
  orderId: string;
  total: number;
}

export class ApiOrderRepository implements OrderRepository {
  private readonly orderRoute = '/api/orders';

  async create(data: CreateOrderData): Promise<Order> {
    const response = await fetch(this.orderRoute, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(this.toCreateOrderRequest(data)),
    });

    if (!response.ok) {
      throw new Error(
          `Failed to create order: ${response.status} ${response.statusText}`,
      );
    }

    const responseData: CreateOrderResponse = await response.json();

    return this.toOrder(data, responseData);
  }

  async getAll(): Promise<Order[]> {
    const response = await fetch(this.orderRoute);

    if (!response.ok) {
      throw new Error(
          `Failed to fetch orders: ${response.status} ${response.statusText}`,
      );
    }

    const responseData: CreateOrderResponse[] = await response.json();

    return responseData.map((order) => this.toOrderFromResponse(order));
  }

  async getById(id: string): Promise<Order | undefined> {
    const response = await fetch(`${this.orderRoute}/${id}`);

    if (response.status === 404) {
      return undefined;
    }

    if (!response.ok) {
      throw new Error(
          `Failed to fetch order: ${response.status} ${response.statusText}`,
      );
    }

    const responseData: CreateOrderResponse = await response.json();

    return this.toOrderFromResponse(responseData);
  }

  private toCreateOrderRequest(
      data: CreateOrderData,
  ): CreateOrderRequest {
    return {
      customerName: data.customerName,
      customerEmail: data.customerEmail,
      customerPhoneNumber: data.customerPhone,
      customerAddress: data.customerAddress,
      customerCity: data.customerCity,
      customerMessage: data.message,
      items: data.items.map((item) => ({
        productId: item.productId,
        quantity: item.quantity,
        color: item.selectedColor,
      })),
    };
  }

  private toOrder(
      data: CreateOrderData,
      response: CreateOrderResponse,
  ): Order {
    const createdAt = new Date();

    return {
      id: response.orderId,
      items: data.items,
      total: response.total,
      status: 'pending',
      createdAt,
      customerName: data.customerName,
      customerPhone: data.customerPhone,
      customerEmail: data.customerEmail,
      customerAddress: data.customerAddress,
      customerCity: data.customerCity,
      message: data.message,
      steps: this.createOrderSteps(createdAt),
    };
  }

  private toOrderFromResponse(
      response: CreateOrderResponse,
  ): Order {
    const createdAt = new Date();

    return {
      id: response.orderId,
      items: [],
      total: response.total,
      status: 'pending',
      createdAt,
      customerName: '',
      customerPhone: '',
      customerEmail: '',
      customerAddress: '',
      customerCity: '',
      message: '',
      steps: this.createOrderSteps(createdAt),
    };
  }

  private createOrderSteps(createdAt: Date): Order['steps'] {
    return [
      {
        status: 'pending',
        label: 'Commande reçue',
        date: createdAt,
        completed: true,
      },
      {
        status: 'confirmed',
        label: 'Confirmée',
        completed: false,
      },
      {
        status: 'in_progress',
        label: 'En fabrication',
        completed: false,
      },
      {
        status: 'shipped',
        label: 'Expédiée',
        completed: false,
      },
      {
        status: 'delivered',
        label: 'Livrée',
        completed: false,
      },
    ];
  }
}