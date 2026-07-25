import type { Product } from '@/domain/product/Product';

export interface CartItem {
  product: Product;
  quantity: number;
  selectedColor?: string;
}
