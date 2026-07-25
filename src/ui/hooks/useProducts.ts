import { useCallback } from 'react';
import { productUseCases } from '@/composition/container';
import type { Product } from '@/domain/product/Product';
import { useAsyncReadState } from './core/use-async-read-state';

export const useProducts = () => {
    const fetchProducts = useCallback(() => productUseCases.listAll(), []);
    return useAsyncReadState<Product[]>(fetchProducts, []);
}