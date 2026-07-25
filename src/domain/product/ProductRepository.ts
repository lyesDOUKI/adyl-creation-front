import type { Product, ProductCategory } from './Product';

export interface ProductRepository {
  getAll(): Promise<Product[]>;
  getById(id: string): Promise<Product | undefined>;
  getByCategory(category: ProductCategory): Promise<Product[]>;
}
