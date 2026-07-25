import type { CartItem } from '@/domain/cart/CartItem';
import { OrderItem } from '@/domain/order/OrderItem';
import { CreateOrderData } from '@/domain/order/OrderRepository';

export interface OrderFormValues {
    name: string;
    phone: string;
    email: string;
    address: string;
    city: string;
    message: string;
}

export const toOrderItem = (cartItem: CartItem): OrderItem => ({
    productId: cartItem.product.id,
    productName: cartItem.product.name,
    unitPrice: cartItem.product.price,
    quantity: cartItem.quantity,
    selectedColor: cartItem.selectedColor,
    imageUrl: cartItem.product.imageUrl,
});

export const toCreateOrderData = (
    form: OrderFormValues,
    items: CartItem[]
): CreateOrderData => ({
    customerName: form.name,
    customerPhone: form.phone,
    customerEmail: form.email,
    customerAddress: form.address,
    custormerCity: form.city,
    message: form.message || null,
    items: items.map(toOrderItem),
});