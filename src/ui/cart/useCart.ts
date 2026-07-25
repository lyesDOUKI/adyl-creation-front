import { useContext } from 'react';
import { CartContext, type CartContextValue } from './CartContext';

export const useCart = (): CartContextValue => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
};
