import { orderUseCases } from '@/composition/container';
import type { Order } from '@/domain/order/Order';


import { useCallback } from 'react';
import { useAsyncReadState } from './core/use-async-read-state';

export const useOrder = (id: string) => {
  const fetchOrder = useCallback(() => orderUseCases.getById(id), [id]);
  return useAsyncReadState<Order | undefined>(fetchOrder, undefined);
}

