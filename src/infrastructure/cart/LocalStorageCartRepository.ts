import type { CartItem } from '@/domain/cart/CartItem';
import { CartRepository } from '@/domain/cart/CartRepository';

const STORAGE_KEY = 'cart';

export class LocalStorageCartRepository implements CartRepository {
    async getItems(): Promise<CartItem[]> {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (!raw) return [];
        try {
            return JSON.parse(raw) as CartItem[];
        } catch {
            return [];
        }
    }

    async save(items: CartItem[]): Promise<void> {
        if (items.length === 0) {
            localStorage.removeItem(STORAGE_KEY);
            return;
        }
        localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    }
}