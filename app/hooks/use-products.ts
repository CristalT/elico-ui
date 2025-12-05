import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';

export default function useProducts(page: number = 1, terms: string = '') {
    return useQuery({
        queryKey: ['products', page, terms],
        queryFn: () => api.stock.search(terms, { page, limit: 12 }),
        staleTime: 5 * 60 * 1000, // 5 minutes
        gcTime: 10 * 60 * 1000, // 10 minutes (garbage collection time)
    });
}
