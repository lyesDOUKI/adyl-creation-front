export type ProductCategory =
    | 'ACCESSORIES'
    | 'CLOTHING';

export interface Product {
  id: string;
  name: string;
  price: number;
  category: ProductCategory;
  colors: string[];
  imageUrl: string;
  numberOfOrders: number;
}