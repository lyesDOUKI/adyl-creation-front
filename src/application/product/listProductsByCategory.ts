import type { Product, ProductCategory } from '@/domain/product/Product';
import type { ProductRepository } from '@/domain/product/ProductRepository';

export const listProductsByCategory = async (
    repository: ProductRepository,
    category: ProductCategory,
): Promise<Product[]> => await repository.getByCategory(category);
