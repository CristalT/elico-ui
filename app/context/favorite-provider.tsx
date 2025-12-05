'use client';

import api from '@/lib/api';
import { Favorite, Product } from '@/lib/api/types';
import { useMutation, UseMutationResult, useQuery, useQueryClient } from '@tanstack/react-query';
import { createContext, useContext, useEffect } from 'react';
import { useAuth } from './auth-provider';

type FavoriteContextType = {
    items: Favorite[];
    exists: (id: string) => boolean;
    toggle: UseMutationResult<unknown, Error, Product, unknown>;
    remove: UseMutationResult<unknown, Error, string, unknown>;
    clear: UseMutationResult<unknown, Error, void, unknown>;
};

const FavoriteContext = createContext<FavoriteContextType | undefined>(undefined);

export default function FavoriteProvider({ children }: { children: React.ReactNode }) {
    const auth = useAuth();
    const queryClient = useQueryClient();

    useEffect(() => {
        api.favorites.setUser(auth?.user);
    }, [auth?.user]);

    const { data: items = [] } = useQuery({
        queryKey: ['favorites'],
        queryFn: async () => await api.favorites.getAll(),
    });

    const exists = (id: string) => items.some((item: Product) => item.id === id);

    const toggle = useMutation({
        mutationFn: async (item: Product) => {
            await api.favorites.toggle(item);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['favorites'] });
        },
    });

    const remove = useMutation({
        mutationFn: (id: string) => api.favorites.remove(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['favorites'] });
        },
    });

    const clear = useMutation({
        mutationFn: () => api.favorites.clearAll(),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['favorites'] });
        },
    });

    return (
        <FavoriteContext.Provider value={{ items, toggle, remove, exists, clear }}>{children}</FavoriteContext.Provider>
    );
}

export const useFavorites = () => useContext(FavoriteContext);
