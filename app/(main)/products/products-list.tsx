'use client';

import { Paginator } from '@/components/paginator';
import Product from '@/components/product';
import { useSearchParams, useRouter } from 'next/navigation';
import api from '@/lib/api';
import { useQuery } from '@tanstack/react-query';

export default function ProductsList() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const searchTerm = searchParams.get('search') || '';
    const currentPage = parseInt(searchParams.get('page') || '1');

    const { data, isLoading, isError, error, isFetching } = useQuery({
        queryKey: ['products', currentPage, searchTerm],
        queryFn: () => api.stock.search(searchTerm, { page: currentPage, limit: 12 }),
        staleTime: 5 * 60 * 1000, // 5 minutes
        gcTime: 10 * 60 * 1000, // 10 minutes (garbage collection time)
    });

    const handlePageChange = (page: number) => {
        const params = new URLSearchParams(searchParams.toString());
        params.set('page', page.toString());
        router.push(`?${params.toString()}`);
    };

    if (isLoading) {
        return (
            <div className="flex justify-center items-center min-h-96">
                <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
            </div>
        );
    }

    if (isError) {
        return (
            <div className="text-center py-8">
                <h2 className="text-2xl font-bold text-red-600 mb-2">Error</h2>
                <p className="text-gray-600">
                    {error instanceof Error ? error.message : 'Ocurrió un error al listar los productos'}
                </p>
                <button
                    onClick={() => window.location.reload()}
                    className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                    Intentar de nuevo
                </button>
            </div>
        );
    }

    const products = data?.data || [];
    const meta = data?.meta;

    return (
        <div>
            {/* Loading indicator for page changes */}
            {isFetching && (
                <div className="fixed top-4 right-4 bg-blue-600 text-white px-4 py-2 rounded shadow-lg">Loading...</div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
                {products.map((product) => (
                    <Product key={product.id} {...product} />
                ))}
            </div>

            {meta && (
                <Paginator
                    currentPage={meta.currentPage}
                    lastPage={meta.lastPage}
                    onPageChange={(page) => handlePageChange(page)}
                />
            )}
        </div>
    );
}
