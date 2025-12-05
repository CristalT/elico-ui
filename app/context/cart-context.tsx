'use client';
import api from '@/lib/api';
import type { CartItem, DeliveryInfo } from '@/lib/api/types';
import { useMutation, UseMutationResult, useQuery, useQueryClient } from '@tanstack/react-query';
import { createContext, useContext, useEffect, useMemo } from 'react';
import { useAuth } from './auth-provider';

interface CartContextType {
    cart: CartItem[];
    total: number;
    count: number;
    add: UseMutationResult<unknown, Error, CartItem, { prevItems: CartItem[] | undefined }>;
    remove: UseMutationResult<unknown, Error, string, { prevItems: CartItem[] | undefined }>;
    editCartItem: (productId: string, quantity: number) => Promise<void>;
    existsInCart: (productId: string) => boolean;
    finish: (payload: { deliveryInfo: DeliveryInfo; newsletter: boolean }) => Promise<void>;
    clear: () => Promise<void>;
}

const CartContext = createContext<CartContextType | null>(null);

export default function CartProvider({ children }: { children: React.ReactNode }) {
    const queryClient = useQueryClient();

    const auth = useAuth();

    useEffect(() => {
        api.cart.setUser(auth?.user);
    }, [auth?.user]);

    const { data: cart, refetch } = useQuery({
        queryKey: ['cart'],
        queryFn: () => api.cart.getCart(),
        initialData: [],
        enabled: false,
    });

    useEffect(() => {
        api.cart.sync();
        refetch();
    });

    const total = useMemo(() => {
        return cart?.reduce((acc, item) => acc + item.price * item.quantity, 0) ?? 0;
    }, [cart]);

    const count = useMemo(() => {
        return cart?.reduce((acc, item) => acc + item.quantity, 0) ?? 0;
    }, [cart]);

    const existsInCart = (productId: string) => {
        return cart?.some((item) => item.productId === productId) ?? false;
    };

    const add = useMutation({
        mutationFn: async (product: CartItem) => api.cart.addToCart(product),
        onMutate: async (newItem: CartItem) => {
            await queryClient.cancelQueries({ queryKey: ['cart'] });
            const prevItems = queryClient.getQueryData<CartItem[]>(['cart']);
            queryClient.setQueryData<CartItem[]>(['cart'], (old = []) => [...old, newItem]);
            return { prevItems };
        },
        onError: (err, newCartItem, context) => {
            console.log('Error adding item to cart:', newCartItem, err);
            queryClient.setQueryData(['cart'], context?.prevItems);
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: ['cart'] });
        },
    });

    const remove = useMutation({
        mutationFn: async (productId: string) => api.cart.removeFromCart(productId),
        onMutate: async (productId: string) => {
            await queryClient.cancelQueries({ queryKey: ['cart'] });
            const prevItems = queryClient.getQueryData<CartItem[]>(['cart']);
            queryClient.setQueryData<CartItem[]>(['cart'], (old = []) =>
                old.filter((item) => item.productId !== productId),
            );
            return { prevItems };
        },
        onError: (err, product, context) => {
            console.log('Error removing item from cart:', product, err);
            queryClient.setQueryData(['cart'], context?.prevItems);
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: ['cart'] });
        },
    });

    const editCartItem = async (productId: string, quantity: number) => {
        await api.cart.editCartItem(productId, quantity);
        refetch();
    };

    const finish = async (payload: { deliveryInfo: DeliveryInfo; newsletter: boolean }) => {
        await api.cart.finish(payload);
        refetch();
    };

    const clear = async () => {
        api.cart.clear();
    };

    return (
        <CartContext.Provider value={{ count, total, cart, add, remove, editCartItem, existsInCart, finish, clear }}>
            {children}
        </CartContext.Provider>
    );
}

export const useCart = () => useContext(CartContext);
