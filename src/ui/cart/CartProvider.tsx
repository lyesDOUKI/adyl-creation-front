import React, { useState, useCallback, useEffect } from 'react';
import { CartContext } from './CartContext';
import type { Product } from '@/domain/product/Product';
import type { CartItem } from '@/domain/cart/CartItem';
import { Cart } from '@/domain/cart/Cart';
import { InsufficientStockError } from '@/domain/error/InsufficientStockError';
import { cartUseCases as defaultCartUseCases, type CartUseCases } from '@/composition/container';

interface CartProviderProps {
    children: React.ReactNode;
    cartUseCases?: CartUseCases;
}

export const CartProvider: React.FC<CartProviderProps> = ({
    children,
    cartUseCases = defaultCartUseCases,
}) => {
    const [items, setItems] = useState<CartItem[]>([]);
    const [cartOpen, setCartOpen] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        cartUseCases.getCart().then(cart => setItems(cart.getItems()));
    }, [cartUseCases]);

    const addItem = useCallback(async (product: Product, color?: string) => {
        try {
            const cart = await cartUseCases.addItem(product, color);
            setItems(cart.getItems());
            setCartOpen(true);
            setError(null);
        } catch (err) {
            setError(err instanceof InsufficientStockError ? err.message : "Impossible d'ajouter ce produit.");
        }
    }, [cartUseCases]);

    const removeItem = useCallback(async (productId: string) => {
        const cart = await cartUseCases.removeItem(productId);
        setItems(cart.getItems());
    }, [cartUseCases]);

    const updateQuantity = useCallback(async (productId: string, quantity: number) => {
        try {
            const cart = await cartUseCases.updateQuantity(productId, quantity);
            setItems(cart.getItems());
            setError(null);
        } catch (err) {
            setError(err instanceof InsufficientStockError ? err.message : 'Quantité invalide.');
        }
    }, [cartUseCases]);

    const clearCartAction = useCallback(async () => {
        const cart = await cartUseCases.clear();
        setItems(cart.getItems());
        setCartOpen(false);
    }, [cartUseCases]);

    const cart = new Cart(items);
    const total = cart.getTotal();
    const itemCount = cart.getItemCount();

    return (
        <CartContext.Provider
            value={{ items, addItem, removeItem, updateQuantity, clearCart: clearCartAction, total, itemCount, cartOpen, setCartOpen, error }}
        >
            {children}
        </CartContext.Provider>
    );
};