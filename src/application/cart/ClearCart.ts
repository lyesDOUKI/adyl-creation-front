import type { CartRepository } from '@/domain/cart/CartRepository';
import { Cart } from '@/domain/cart/Cart';

export const clearCart = async (repository: CartRepository): Promise<Cart> => {
    await repository.save([]);
    return new Cart([]);
};