import type { CartItem } from '@/domain/cart/CartItem';
import type { CartRepository } from '@/domain/cart/CartRepository';

export class InMemoryCartRepository implements CartRepository {
    private items: CartItem[] = [];

    async getItems(): Promise<CartItem[]> {
        return this.items;
    }

    async save(items: CartItem[]): Promise<void> {
        this.items = items;
    }
}