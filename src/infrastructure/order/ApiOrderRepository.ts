import type { Order } from '@/domain/order/Order';
import type { OrderItem } from '@/domain/order/OrderItem';
import type { OrderStatus } from '@/domain/order/OrderStatus';
import {CreateOrderData, OrderRepository} from "@/domain/order/OrderRepository.ts";
import {ApiClient, ApiError} from "@/infrastructure/ApiClient.ts";
import {buildOrderSteps} from "@/domain/order/BuildOrderSteps.ts";
import {ProductCategory} from "@/domain/product/Product.ts";


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

interface OrderLineResponse {
  productId: string;
  productName: string;
  productCategory: ProductCategory | null;
  quantity: number;
  unitPrice: number;
  chosenColor: string | null;
  subtotalBeforeDiscount: number;
  discountRate: number;
  discountAmount: number;
  totalAmount: number;
}

interface GetOrderResponse {
  orderId: string;
  customerId: string;
  customerMessage: string | null;
  createdAt: string;
  updatedAt: string;
  total: number;
  status: string;
  lines: OrderLineResponse[];
  lineCount: number;
  totalQuantity: number;
}

interface PageResponse<T> {
  content: T[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
}

export class ApiOrderRepository implements OrderRepository {
  private readonly orderRoute = '/orders';

  constructor(private readonly apiClient: ApiClient) {}

  async create(data: CreateOrderData): Promise<Order> {
    const response = await this.apiClient.post<GetOrderResponse>(
        this.orderRoute,
        this.toCreateOrderRequest(data),
    );

    return this.toOrderFromGetResponse(response);
  }

  async getAll(): Promise<Order[]> {
    const response = await this.apiClient.get<PageResponse<GetOrderResponse>>(
        this.orderRoute,
    );

    return response.content.map((order) => this.toOrderFromGetResponse(order));
  }

  async getById(id: string): Promise<Order | undefined> {
    try {
      const response = await this.apiClient.get<GetOrderResponse>(
          `${this.orderRoute}/${id}`,
      );

      return this.toOrderFromGetResponse(response);
    } catch (error) {
      if (error instanceof ApiError && error.isNotFound()) {
        return undefined;
      }

      throw error;
    }
  }

  private toCreateOrderRequest(data: CreateOrderData): CreateOrderRequest {
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
        color: item.chosenColor,
      })),
    };
  }

  private toOrderFromGetResponse(response: GetOrderResponse): Order {
    const createdAt = new Date(response.createdAt);
    const updatedAt = new Date(response.updatedAt);
    const status = response.status as OrderStatus;

    return {
      id: response.orderId,
      customerId: response.customerId,
      items: (response.lines ?? []).map((line) => this.toOrderItem(line)),
      lineCount: response.lineCount,
      totalQuantity: response.totalQuantity,
      total: response.total,
      status,
      createdAt,
      updatedAt,
      message: response.customerMessage ?? undefined,
      steps: buildOrderSteps(status, createdAt, updatedAt),
    };
  }

  private toOrderItem(line: OrderLineResponse): OrderItem {
    return {
      productId: line.productId,
      productName: line.productName,
      productCategory: line.productCategory ?? undefined,
      quantity: line.quantity,
      unitPrice: line.unitPrice,
      chosenColor: line.chosenColor ?? undefined,
      subtotalBeforeDiscount: line.subtotalBeforeDiscount,
      discountRate: line.discountRate,
      discountAmount: line.discountAmount,
      totalAmount: line.totalAmount,
    };
  }
}