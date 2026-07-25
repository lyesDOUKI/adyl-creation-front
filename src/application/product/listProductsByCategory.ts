import type { Product, ProductCategory } from '@/domain/product/Product';
import type { ProductRepository } from '@/domain/product/ProductRepository';

export const listProductsByCategory = (
  repository: ProductRepository,
  category: ProductCategory,
): Product[] => repository.getByCategory(category);
