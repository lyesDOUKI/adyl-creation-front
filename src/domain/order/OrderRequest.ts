import { OrderStep } from "./OrderStep";

export interface OrderRequest {
    id: string;
    items: OrderRequestItem[];
    customerName: string;
    customerPhone: string;
    customerEmail: string;
    message: string | null;
    status: OrderRequestStatus;
    createdAt: Date;
    steps: OrderStep[];
}

export type OrderRequestStatus = 'pending' | 'confirmed' | 'declined';

export interface OrderRequestItem {
    productId: string;
    quantity: number;
    selectedColor?: string;
}