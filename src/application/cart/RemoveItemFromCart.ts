import type { CartRepository } from '@/domain/cart/CartRepository';
import { Cart } from '@/domain/cart/Cart';

export const removeItemFromCart = async (
    repository: CartRepository,
    productId: string,
): Promise<Cart> => {
    const currentItems = await repository.getItems();
    const updatedCart = new Cart(currentItems).removeItem(productId);
    await repository.save(updatedCart.getItems());
    return updatedCart;
};