import { InMemoryProductRepository } from '@/infrastructure/product/InMemoryProductRepository';
import { listProducts } from '@/application/product/listProducts';
import { getProductById } from '@/application/product/getProductById';
import { listProductsByCategory } from '@/application/product/listProductsByCategory';
import type { ProductRepository } from '@/domain/product/ProductRepository';
import type { ProductCategory } from '@/domain/product/Product';

export const makeProductUseCases = (repository: ProductRepository) => ({
  listAll: () => listProducts(repository),
  getById: (id: string) => getProductById(repository, id),
  listByCategory: (category: ProductCategory) => listProductsByCategory(repository, category),
});
export type ProductUseCases = ReturnType<typeof makeProductUseCases>;

import { InMemoryOrderRepository } from '@/infrastructure/order/InMemoryOrderRepository';
import { listOrders } from '@/application/order/listOrders';
import { getOrderById } from '@/application/order/getOrderById';
import { createOrder } from '@/application/order/createOrder';
import type { OrderRepository, CreateOrderData } from '@/domain/order/OrderRepository';

export const makeOrderUseCases = (repository: OrderRepository) => ({
  listAll: () => listOrders(repository),
  getById: (id: string) => getOrderById(repository, id),
  create: (data: CreateOrderData) => createOrder(repository, data),
});
export type OrderUseCases = ReturnType<typeof makeOrderUseCases>;


import { InMemoryAppointmentRepository } from '@/infrastructure/appointment/InMemoryAppointmentRepository';
import { getAvailableSlots } from '@/application/appointment/getAvailableSlots';
import { getUnavailableDates } from '@/application/appointment/getUnavailableDates';
import { createAppointment } from '@/application/appointment/createAppointment';
import type { AppointmentRepository, CreateAppointmentData } from '@/domain/appointment/AppointmentRepository';

export const makeAppointmentUseCases = (repository: AppointmentRepository) => ({
  getAvailableSlots: (date: Date) => getAvailableSlots(repository, date),
  getUnavailableDates: () => getUnavailableDates(repository),
  create: (data: CreateAppointmentData) => createAppointment(repository, data),
});
export type AppointmentUseCases = ReturnType<typeof makeAppointmentUseCases>;


import { LocalStorageCartRepository } from '@/infrastructure/cart/LocalStorageCartRepository';
import { addItemToCart } from '@/application/cart/AddItemToCart';
import { clearCart } from '@/application/cart/ClearCart';
import { getCart } from '@/application/cart/GetCart';
import { removeItemFromCart } from '@/application/cart/RemoveItemFromCart';
import { updateCartItemQuantity } from '@/application/cart/UpdateItemQuantity';
import type { CartRepository } from '@/domain/cart/CartRepository';
import type { Product } from '@/domain/product/Product';
import { ApiProductRepository } from '@/infrastructure/product/ApiProductRepository';
import { ApiOrderRepository } from '@/infrastructure/order/ApiOrderRepository';

export const makeCartUseCases = (repository: CartRepository) => ({
  getCart: () => getCart(repository),
  addItem: (product: Product, color?: string) => addItemToCart(repository, product, color),
  removeItem: (productId: string) => removeItemFromCart(repository, productId),
  updateQuantity: (productId: string, quantity: number) => updateCartItemQuantity(repository, productId, quantity),
  clear: () => clearCart(repository),
});
export type CartUseCases = ReturnType<typeof makeCartUseCases>;

export const productUseCases = makeProductUseCases(new ApiProductRepository());
export const orderUseCases = makeOrderUseCases(new ApiOrderRepository());
export const appointmentUseCases = makeAppointmentUseCases(new InMemoryAppointmentRepository());
export const cartUseCases = makeCartUseCases(new LocalStorageCartRepository());