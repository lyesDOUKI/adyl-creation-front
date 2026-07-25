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

import type { ProductCategory } from '@/domain/product/Product';
import type { CreateOrderData } from '@/domain/order/OrderRepository';
import type { CreateAppointmentData } from '@/domain/appointment/AppointmentRepository';

const productRepository = new InMemoryProductRepository();
const orderRepository = new InMemoryOrderRepository();
const appointmentRepository = new InMemoryAppointmentRepository();

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
