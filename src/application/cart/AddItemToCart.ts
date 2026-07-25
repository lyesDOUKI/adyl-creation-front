import type { CartRepository } from '@/domain/cart/CartRepository';
import type { Product } from '@/domain/product/Product';
import { Cart } from '@/domain/cart/Cart';

export const addItemToCart = async (
    repository: CartRepository,
    product: Product,
    color?: string,
): Promise<Cart> => {
    const currentItems = await repository.getItems();
    const updatedCart = new Cart(currentItems).addItem(product, color);
    await repository.save(updatedCart.getItems());
    return updatedCart;
};