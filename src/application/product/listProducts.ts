import type { Product } from '@/domain/product/Product';
import type { ProductRepository } from '@/domain/product/ProductRepository';

export const listProducts = async (repository: ProductRepository): Promise<Product[]> =>
  repository.getAll();
