import type { CartRepository } from '@/domain/cart/CartRepository';
import { Cart } from '@/domain/cart/Cart';

export const updateCartItemQuantity = async (
    repository: CartRepository,
    productId: string,
    quantity: number,
): Promise<Cart> => {
    const currentItems = await repository.getItems();
    const updatedCart = new Cart(currentItems).updateQuantity(productId, quantity);
    await repository.save(updatedCart.getItems());
    return updatedCart;
};