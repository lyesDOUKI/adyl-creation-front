import type { Product, ProductCategory } from '@/domain/product/Product';
import type { ProductRepository } from '@/domain/product/ProductRepository';
import {ApiClient, ApiError} from '@/infrastructure/ApiClient';

interface PageResponse<T> {
  content: T[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
}

interface ApiProductResponse {
  productId: string;
  productCategory: ProductCategory;
  name: string;
  price: number;
  colors: string[];
  photosUri: string[];
  numberOfOrders: number;
}

export class ApiProductRepository implements ProductRepository {
  private readonly productRoute = '/products';

  constructor(private readonly apiClient: ApiClient) {}

  async getAll(): Promise<Product[]> {
    const response = await this.apiClient.get<PageResponse<ApiProductResponse>>(
        this.productRoute
    );
    return response.content.map(this.mapToProduct);
  }

  async getById(id: string): Promise<Product | undefined> {
    try {
      const product = await this.apiClient.get<ApiProductResponse>(
          `${this.productRoute}/${id}`
      );
      return this.mapToProduct(product);
    } catch (error) {
      if (error instanceof ApiError && error.isNotFound()) {
        return undefined;
      }
      throw error;
    }
  }

  async getByCategory(category: ProductCategory): Promise<Product[]> {
    const params = new URLSearchParams({ category });
    const response = await this.apiClient.get<PageResponse<ApiProductResponse>>(
        `${this.productRoute}?${params.toString()}`
    );
    return response.content.map(this.mapToProduct);
  }

  private mapToProduct(response: ApiProductResponse): Product {
    return {
      id: response.productId,
      name: response.name,
      price: response.price,
      category: response.productCategory,
      colors: response.colors,
      imageUrl: response.photosUri[0] ?? '',
      numberOfOrders: response.numberOfOrders,
    };
  }
}