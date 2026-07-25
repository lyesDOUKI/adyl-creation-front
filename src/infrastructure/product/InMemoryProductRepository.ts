import type { Product, ProductCategory } from '@/domain/product/Product';
import type { ProductRepository } from '@/domain/product/ProductRepository';
import { productSeeds } from './productSeeds';

export class InMemoryProductRepository implements ProductRepository {
  private readonly products: Product[] = productSeeds;

  async getAll(): Promise<Product[]> {
    return this.products;
  }

  async getById(id: string): Promise<Product | undefined> {
    return this.products.find(p => p.id === id);
  }

  async getByCategory(category: ProductCategory): Promise<Product[]> {
    return this.products.filter(p => p.category === category);
  }
}