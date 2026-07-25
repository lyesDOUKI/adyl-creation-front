import { cartUseCases } from "@/composition/container";
import { Cart } from "@/domain/cart/Cart";
import { CartItem } from "@/domain/cart/CartItem";
import { InsufficientStockError } from "@/domain/error/InsufficientStockError";
import { Product } from "@/domain/product/Product";
import { useState, useEffect, useCallback } from "react";
import { CartContext } from "./CartContext";

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [items, setItems] = useState<CartItem[]>([]);
    const [cartOpen, setCartOpen] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        cartUseCases.getCart().then(cart => setItems(cart.getItems()));
    }, []);

    const addItem = useCallback(async (product: Product, color?: string) => {
        try {
            const cart = await cartUseCases.addItem(product, color);
            setItems(cart.getItems());
            setCartOpen(true);
            setError(null);
        } catch (err) {
            setError(err instanceof InsufficientStockError ? err.message : "Impossible d'ajouter ce produit.");
        }
    }, []);

    const removeItem = useCallback(async (productId: string) => {
        const cart = await cartUseCases.removeItem(productId);
        setItems(cart.getItems());
    }, []);

    const updateQuantity = useCallback(async (productId: string, quantity: number) => {
        try {
            const cart = await cartUseCases.updateQuantity(productId, quantity);
            setItems(cart.getItems());
            setError(null);
        } catch (err) {
            setError(err instanceof InsufficientStockError ? err.message : 'Quantité invalide.');
        }
    }, []);

    const clearCartAction = useCallback(async () => {
        const cart = await cartUseCases.clear();
        setItems(cart.getItems());
        setCartOpen(false);
    }, []);

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