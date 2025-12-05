import ContactInfo from '@/components/contact-info';
import { QueryClient, dehydrate, HydrationBoundary } from '@tanstack/react-query';
import api from '@/lib/api';

/**
 * Server component that prefetches contact info data and hydrates the client component
 */
export default async function ContactInfoWithSSR() {
    const queryClient = new QueryClient();

    // Prefetch contact info data on the server
    let hasError = false;
    try {
        await queryClient.prefetchQuery({
            queryKey: ['contact', 'info'],
            queryFn: () => api.contact.info(),
            staleTime: 10 * 60 * 1000, // 10 minutes
        });
    } catch (error) {
        console.warn('Failed to prefetch contact info:', error);
        hasError = true;
    }

    // If there was an error prefetching, render the client component without initial data
    if (hasError) {
        return <ContactInfo />;
    }

    // Return the hydrated client component with prefetched data
    return (
        <HydrationBoundary state={dehydrate(queryClient)}>
            <ContactInfo />
        </HydrationBoundary>
    );
}
