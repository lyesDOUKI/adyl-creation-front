import React, { createContext, useState, useCallback, useEffect } from 'react';
import type { Product } from '@/domain/product/Product';
import type { CartItem } from '@/domain/cart/CartItem';

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