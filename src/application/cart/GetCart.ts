import { Cart } from '@/domain/cart/Cart';
import { CartRepository } from '@/domain/cart/CartRepository';

export const getCart = async (repository: CartRepository): Promise<Cart> => {
    const items = await repository.getItems();
    return new Cart(items);
};