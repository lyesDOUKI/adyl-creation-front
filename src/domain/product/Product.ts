export type ProductCategory =
  | 'amigurumi'
  | 'accessoire'
  | 'decoration'
  | 'bebe'
  | 'vetement'
  | 'personnalise';

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: ProductCategory;
  imageUrl: string;
  colors: string[];
  isCustomizable: boolean;
  inStock: boolean;
  rating: number;
  reviewCount: number;
}
