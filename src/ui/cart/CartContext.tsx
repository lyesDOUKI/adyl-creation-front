import React, { createContext, useState, useCallback, useEffect } from 'react';
import type { Product } from '@/domain/product/Product';
import type { CartItem } from '@/domain/cart/CartItem';
import { Cart } from '@/domain/cart/Cart';
import { InsufficientStockError } from '@/domain/error/InsufficientStockError';
import { cartUseCases } from '@/composition/container';

export interface CartContextValue {
  items: CartItem[];
  addItem: (product: Product, color?: string) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  total: number;
  itemCount: number;
  cartOpen: boolean;
  setCartOpen: (open: boolean) => void;
  error: string | null;
}

export const CartContext = createContext<CartContextValue | undefined>(undefined);

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