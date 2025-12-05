import { HydrationBoundary, dehydrate } from '@tanstack/react-query';
import { getQueryClient } from '@/lib/query-client';
import api from '@/lib/api';
import ProductDetail from './components/product-detail';

interface ProductPageProps {
    params: Promise<{ id: string }>;
}

export default async function ProductPage({ params }: ProductPageProps) {
    const { id } = await params;
    const queryClient = getQueryClient();

    try {
        // Prefetch product data on the server
        await queryClient.prefetchQuery({
            queryKey: ['product', id],
            queryFn: () => api.stock.getProduct(id),
        });
    } catch (error) {
        console.error('Error prefetching product:', error);
        // Continue rendering even if prefetch fails
    }

    return (
        <HydrationBoundary state={dehydrate(queryClient)}>
            <ProductDetail productId={id} />
        </HydrationBoundary>
    );
}
