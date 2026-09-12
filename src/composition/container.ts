import {listProducts} from '@/application/product/listProducts';
import {getProductById} from '@/application/product/getProductById';
import {listProductsByCategory} from '@/application/product/listProductsByCategory';
import type {ProductRepository} from '@/domain/product/ProductRepository';
import type {Product, ProductCategory} from '@/domain/product/Product';
import {listOrders} from '@/application/order/listOrders';
import {getOrderById} from '@/application/order/getOrderById';
import {createOrder} from '@/application/order/createOrder';
import type {CreateOrderData, OrderRepository} from '@/domain/order/OrderRepository';
import {getAvailableSlots} from '@/application/appointment/getAvailableSlots';
import {getUnavailableDates} from '@/application/appointment/getUnavailableDates';
import {createAppointment} from '@/application/appointment/createAppointment';
import type {AppointmentRepository, CreateAppointmentData} from '@/domain/appointment/AppointmentRepository';
import {LocalStorageCartRepository} from '@/infrastructure/cart/LocalStorageCartRepository';
import {addItemToCart} from '@/application/cart/AddItemToCart';
import {clearCart} from '@/application/cart/ClearCart';
import {getCart} from '@/application/cart/GetCart';
import {removeItemFromCart} from '@/application/cart/RemoveItemFromCart';
import {updateCartItemQuantity} from '@/application/cart/UpdateItemQuantity';
import type {CartRepository} from '@/domain/cart/CartRepository';
import {ApiProductRepository} from '@/infrastructure/product/ApiProductRepository';
import {ApiOrderRepository} from '@/infrastructure/order/ApiOrderRepository';
import {apiClient} from "@/infrastructure/api.dependencies.ts";
import {CustomerRepository, RegisterCustomerData} from "@/domain/customer/CustomerRepository.ts";
import {register} from "@/application/register/register.ts";
import {ApiRegisterRepository} from "@/infrastructure/register/ApiRegisterRepository.ts";
import {ApiAppointmentRepository} from "@/infrastructure/appointment/ApiAppointmentRepository.ts";
import {getAppointments} from "@/application/appointment/getAppointments.ts";

export const makeProductUseCases = (repository: ProductRepository) => ({
  listAll: () => listProducts(repository),
  getById: (id: string) => getProductById(repository, id),
  listByCategory: (category: ProductCategory) => listProductsByCategory(repository, category),
});
export type ProductUseCases = ReturnType<typeof makeProductUseCases>;

export const makeOrderUseCases = (repository: OrderRepository) => ({
  listAll: () => listOrders(repository),
  getById: (id: string) => getOrderById(repository, id),
  create: (data: CreateOrderData) => createOrder(repository, data),
});
export type OrderUseCases = ReturnType<typeof makeOrderUseCases>;


export const makeAppointmentUseCases = (repository: AppointmentRepository) => ({
  getAvailableSlots: (date: Date) => getAvailableSlots(repository, date),
  getUnavailableDates: () => getUnavailableDates(repository),
  create: (data: CreateAppointmentData) => createAppointment(repository, data),
  getAppointments: () => getAppointments(repository)
});
export type AppointmentUseCases = ReturnType<typeof makeAppointmentUseCases>;


export const makeCartUseCases = (repository: CartRepository) => ({
  getCart: () => getCart(repository),
  addItem: (product: Product, color?: string) => addItemToCart(repository, product, color),
  removeItem: (productId: string) => removeItemFromCart(repository, productId),
  updateQuantity: (productId: string, quantity: number) => updateCartItemQuantity(repository, productId, quantity),
  clear: () => clearCart(repository),
});
export type CartUseCases = ReturnType<typeof makeCartUseCases>;

export const makeCustomerUseCases = (repository: CustomerRepository) => ({
  register: (data: RegisterCustomerData) => register(repository, data)
});
export const productUseCases = makeProductUseCases(new ApiProductRepository(apiClient));
export const orderUseCases = makeOrderUseCases(new ApiOrderRepository(apiClient));
export const appointmentUseCases = makeAppointmentUseCases(new ApiAppointmentRepository(apiClient));
export const cartUseCases = makeCartUseCases(new LocalStorageCartRepository());
export const customerUseCases = makeCustomerUseCases(new ApiRegisterRepository(apiClient));