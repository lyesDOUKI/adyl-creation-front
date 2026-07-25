import { InsufficientStockError } from '../error/InsufficientStockError';
import type { CartItem } from './CartItem';
import type { Product } from '@/domain/product/Product';

export class Cart {
    constructor(private readonly items: CartItem[] = []) { }

    getItems(): CartItem[] {
        return this.items;
    }

    getTotal(): number {
        return this.items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
    }

    getItemCount(): number {
        return this.items.reduce((sum, item) => sum + item.quantity, 0);
    }

    addItem(product: Product, color?: string): Cart {
        const existing = this.items.find(item => item.product.id === product.id);
        const requestedQuantity = (existing?.quantity ?? 0) + 1;

        if (!product.inStock) {
            throw new InsufficientStockError(product.name);
        }

        const updatedItems = existing
            ? this.items.map(item =>
                item.product.id === product.id
                    ? { ...item, quantity: requestedQuantity, selectedColor: color ?? item.selectedColor }
                    : item,
            )
            : [...this.items, { product, quantity: 1, selectedColor: color }];

        return new Cart(updatedItems);
    }

    removeItem(productId: string): Cart {
        return new Cart(this.items.filter(item => item.product.id !== productId));
    }

    updateQuantity(productId: string, quantity: number): Cart {
        if (quantity <= 0) {
            return this.removeItem(productId);
        }

        const item = this.items.find(i => i.product.id === productId);
        if (item && !item.product.inStock) {
            throw new InsufficientStockError(item.product.name);
        }

        return new Cart(this.items.map(i => (i.product.id === productId ? { ...i, quantity } : i)));
    }

    clear(): Cart {
        return new Cart([]);
    }
}