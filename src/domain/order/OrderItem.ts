import {ProductCategory} from "@/domain/product/Product.ts";


export interface OrderItem {
  productId: string;
  productName: string;
  productCategory?: ProductCategory;
  quantity: number;
  unitPrice: number;
  chosenColor?: string;
  subtotalBeforeDiscount: number;
  discountRate: number;
  discountAmount: number;
  totalAmount: number;
  imageUrl?: string;
}