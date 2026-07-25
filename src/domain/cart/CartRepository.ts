import type { CartItem } from '@/domain/cart/CartItem';

export interface CartRepository {
    getItems(): Promise<CartItem[]>;
    save(items: CartItem[]): Promise<void>;
}