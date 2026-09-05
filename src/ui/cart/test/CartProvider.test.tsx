import { describe, it, expect } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { makeCartUseCases } from '@/composition/container';
import type { Product } from '@/domain/product/Product';
import { useCart } from '../useCart';
import { CartProvider } from '../CartProvider';
import { InMemoryCartRepository } from './InMemoryCartRepository';

const makeProduct = (overrides: Partial<Product> = {}): Product => ({
    id: 'prod-1',
    name: 'Doudou lapin',
    category : 'ACCESSORIES',
    price: 25,
    imageUrl: '',
    colors: [],
    numberOfOrders: 0,
    ...overrides,
});

describe('CartProvider (comportement complet, via useCart)', () => {
    it('ajoute un produit au panier et met à jour le total', async () => {
        const repository = new InMemoryCartRepository();
        const testCartUseCases = makeCartUseCases(repository);
        const wrapper = ({ children }: { children: React.ReactNode }) => (
            <CartProvider cartUseCases={testCartUseCases}>{children}</CartProvider>
        );

        const { result } = renderHook(() => useCart(), { wrapper });

        await act(async () => {
            result.current.addItem(makeProduct(), 'Beige');
        });

        expect(result.current.items).toHaveLength(1);
        expect(result.current.items[0].quantity).toBe(1);
        expect(result.current.total).toBe(25);
        expect(result.current.itemCount).toBe(1);
        expect(result.current.cartOpen).toBe(true);
    });

    it('incrémente la quantité si le produit est ajouté plusieurs fois et reste en stock', async () => {
        const repository = new InMemoryCartRepository();
        const testCartUseCases = makeCartUseCases(repository);
        const wrapper = ({ children }: { children: React.ReactNode }) => (
            <CartProvider cartUseCases={testCartUseCases}>{children}</CartProvider>
        );

        const { result } = renderHook(() => useCart(), { wrapper });
        const product = makeProduct();

        await act(async () => {
            result.current.addItem(product);
        });
        await act(async () => {
            result.current.addItem(product);
        });

        expect(result.current.items).toHaveLength(1);
        expect(result.current.items[0].quantity).toBe(2);
    });

    it('supprime un article du panier', async () => {
        const repository = new InMemoryCartRepository();
        const testCartUseCases = makeCartUseCases(repository);
        const wrapper = ({ children }: { children: React.ReactNode }) => (
            <CartProvider cartUseCases={testCartUseCases}>{children}</CartProvider>
        );

        const { result } = renderHook(() => useCart(), { wrapper });
        const product = makeProduct();

        await act(async () => {
            result.current.addItem(product);
        });
        expect(result.current.items).toHaveLength(1);

        await act(async () => {
            result.current.removeItem(product.id);
        });

        expect(result.current.items).toHaveLength(0);
        expect(result.current.total).toBe(0);
    });

    it('vide le panier via clearCart', async () => {
        const repository = new InMemoryCartRepository();
        const testCartUseCases = makeCartUseCases(repository);
        const wrapper = ({ children }: { children: React.ReactNode }) => (
            <CartProvider cartUseCases={testCartUseCases}>{children}</CartProvider>
        );

        const { result } = renderHook(() => useCart(), { wrapper });

        await act(async () => {
            result.current.addItem(makeProduct());
        });
        expect(result.current.items).toHaveLength(1);

        await act(async () => {
            result.current.clearCart();
        });

        expect(result.current.items).toHaveLength(0);
        expect(result.current.cartOpen).toBe(false);
    });
});