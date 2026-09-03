import type {
  Product,
  ProductCategory,
} from '@/domain/product/Product';
import type { ProductRepository } from '@/domain/product/ProductRepository';

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
  private readonly productRoute = '/api/products';

  async getAll(): Promise<Product[]> {
    const response = await fetch(this.productRoute);

    if (!response.ok) {
      throw new Error(
          `Failed to fetch products: ${response.status} ${response.statusText}`,
      );
    }

    const page = await response.json() as PageResponse<ApiProductResponse>;

    return page.content.map((product) => this.toProduct(product));
  }

  async getById(id: string): Promise<Product | undefined> {
    const response = await fetch(`${this.productRoute}/${id}`);

    if (response.status === 404) {
      return undefined;
    }

    if (!response.ok) {
      throw new Error(
          `Failed to fetch product ${id}: ${response.status} ${response.statusText}`,
      );
    }

    const product = await response.json() as ApiProductResponse;

    return this.toProduct(product);
  }

  async getByCategory(category: ProductCategory): Promise<Product[]> {
    const params = new URLSearchParams({
      category,
    });

    const response = await fetch(
        `${this.productRoute}?${params.toString()}`,
    );

    if (!response.ok) {
      throw new Error(
          `Failed to fetch products for category ${category}: ` +
          `${response.status} ${response.statusText}`,
      );
    }

    const page = await response.json() as PageResponse<ApiProductResponse>;

    return page.content.map((product) => this.toProduct(product));
  }

  private toProduct(product: ApiProductResponse): Product {
    return {
      id: product.productId,
      name: product.name,
      price: product.price,
      category: product.productCategory,
      colors: product.colors,
      imageUrl: product.photosUri[0] ?? '',
      numberOfOrders: product.numberOfOrders,
    };
  }
}