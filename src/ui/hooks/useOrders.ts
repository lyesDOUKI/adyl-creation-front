import { orderUseCases } from '@/composition/container';
import type { Order } from '@/domain/order/Order';
import { useCallback } from 'react';
import { useAsyncReadState } from './core/use-async-read-state';

export const useOrders = () => {
    const fetchOrders = useCallback(() => orderUseCases.listAll(), []);
    return useAsyncReadState<Order[]>(fetchOrders, []);
}

