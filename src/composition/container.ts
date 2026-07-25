import { InMemoryProductRepository } from '@/infrastructure/product/InMemoryProductRepository';
import { InMemoryOrderRepository } from '@/infrastructure/order/InMemoryOrderRepository';
import { InMemoryAppointmentRepository } from '@/infrastructure/appointment/InMemoryAppointmentRepository';

import { listProducts } from '@/application/product/listProducts';
import { getProductById } from '@/application/product/getProductById';
import { listProductsByCategory } from '@/application/product/listProductsByCategory';

import { listOrders } from '@/application/order/listOrders';
import { getOrderById } from '@/application/order/getOrderById';
import { createOrder } from '@/application/order/createOrder';

import { getAvailableSlots } from '@/application/appointment/getAvailableSlots';
import { getUnavailableDates } from '@/application/appointment/getUnavailableDates';
import { createAppointment } from '@/application/appointment/createAppointment';

import type { Product, ProductCategory } from '@/domain/product/Product';
import type { CreateOrderData } from '@/domain/order/OrderRepository';
import type { CreateAppointmentData } from '@/domain/appointment/AppointmentRepository';
import { LocalStorageCartRepository } from '@/infrastructure/cart/LocalStorageCartRepository';
import { addItemToCart } from '@/application/cart/AddItemToCart';
import { clearCart } from '@/application/cart/ClearCart';
import { getCart } from '@/application/cart/GetCart';
import { removeItemFromCart } from '@/application/cart/RemoveItemFromCart';
import { updateCartItemQuantity } from '@/application/cart/UpdateItemQuantity';

const productRepository = new InMemoryProductRepository();
const orderRepository = new InMemoryOrderRepository();
const appointmentRepository = new InMemoryAppointmentRepository();
const cartRepository = new LocalStorageCartRepository();

export const productUseCases = {
  listAll: () => listProducts(productRepository),
  getById: (id: string) => getProductById(productRepository, id),
  listByCategory: (category: ProductCategory) =>
    listProductsByCategory(productRepository, category),
};

export const orderUseCases = {
  listAll: () => listOrders(orderRepository),
  getById: (id: string) => getOrderById(orderRepository, id),
  create: (data: CreateOrderData) => createOrder(orderRepository, data),
};

export const appointmentUseCases = {
  getAvailableSlots: (date: Date) => getAvailableSlots(appointmentRepository, date),
  getUnavailableDates: () => getUnavailableDates(appointmentRepository),
  create: (data: CreateAppointmentData) =>
    createAppointment(appointmentRepository, data),
};

export const cartUseCases = {
  getCart: () => getCart(cartRepository),
  addItem: (product: Product, color?: string) => addItemToCart(cartRepository, product, color),
  removeItem: (productId: string) => removeItemFromCart(cartRepository, productId),
  updateQuantity: (productId: string, quantity: number) =>
    updateCartItemQuantity(cartRepository, productId, quantity),
  clear: () => clearCart(cartRepository),
};