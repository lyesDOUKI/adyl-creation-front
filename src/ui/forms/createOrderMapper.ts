import type { CartItem } from '@/domain/cart/CartItem';
import { OrderItem } from '@/domain/order/OrderItem';
import {CreateOrderData, CreateOrderItem} from '@/domain/order/OrderRepository';

export interface OrderFormValues {
    address: string;
    city: string;
    message: string;
}

export const toCreateOrderItem = (cartItem: CartItem): CreateOrderItem => ({
    productId: cartItem.product.id,
    quantity: cartItem.quantity,
    chosenColor: cartItem.selectedColor,
});

export const toCreateOrderData = (
    form: OrderFormValues,
    items: CartItem[]
): CreateOrderData => ({
    customerAddress: form.address,
    customerCity: form.city,
    message: form.message || null,
    items: items.map(toCreateOrderItem),
});