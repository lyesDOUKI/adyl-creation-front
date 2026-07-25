import type { Product } from '@/domain/product/Product';
import type { ProductRepository } from '@/domain/product/ProductRepository';

export const getProductById = async (
  repository: ProductRepository,
  id: string,
): Promise<Product | undefined> => repository.getById(id);
