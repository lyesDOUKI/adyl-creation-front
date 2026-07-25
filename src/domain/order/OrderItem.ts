export interface OrderItem {
  productId: string;
  productName: string;
  unitPrice: number;
  quantity: number;
  selectedColor?: string;
  imageUrl?: string;
}
