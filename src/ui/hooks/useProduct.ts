import { useCallback } from 'react';
import { useAsyncReadState } from './core/use-async-read-state';
import { productUseCases } from '@/composition/container';

export const useProduct = (id: string) => {
  const fetchProduct = useCallback(() => productUseCases.getById(id), [id]);
  return useAsyncReadState(fetchProduct, undefined);
};