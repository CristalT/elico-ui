import ContactInfo from '@/components/contact-info';
import { QueryClient, dehydrate, HydrationBoundary } from '@tanstack/react-query';
import api from '@/lib/api';
import { Suspense } from 'react';
import { Skeleton } from './ui/skeleton';

// Fallback component for loading state
function ContactInfoSkeleton() {
    return (
        <div className="space-y-8">
            <h2 className="text-2xl font-semibold mb-6">Información de Contacto</h2>
            <div className="space-y-4">
                {/* Email skeleton */}
                <div className="flex items-center gap-4">
                    <Skeleton className="w-5 h-5 rounded" />
                    <div className="space-y-2">
                        <Skeleton className="h-4 w-32" />
                        <Skeleton className="h-4 w-48" />
                    </div>
                </div>

                {/* Phone skeleton */}
                <div className="flex items-center gap-4">
                    <Skeleton className="w-5 h-5 rounded" />
                    <div className="space-y-2">
                        <Skeleton className="h-4 w-24" />
                        <Skeleton className="h-4 w-36" />
                    </div>
                </div>

                {/* Address skeleton */}
                <div className="flex items-center gap-4">
                    <Skeleton className="w-5 h-5 rounded" />
                    <div className="space-y-2">
                        <Skeleton className="h-4 w-20" />
                        <Skeleton className="h-4 w-56" />
                        <Skeleton className="h-4 w-32" />
                        <Skeleton className="h-4 w-40" />
                    </div>
                </div>
            </div>
        </div>
    );
}

// Server component that handles prefetching
async function ContactInfoServerFetcher() {
    const queryClient = new QueryClient({
        defaultOptions: {
            queries: {
                retry: 2,
                staleTime: 10 * 60 * 1000, // 10 minutes
                gcTime: 15 * 60 * 1000, // 15 minutes
            },
        },
    });

    try {
        // Prefetch contact info data on the server
        await queryClient.prefetchQuery({
            queryKey: ['contact', 'info'],
            queryFn: () => api.contact.info(),
        });

        // Return hydrated component with prefetched data
        return (
            <HydrationBoundary state={dehydrate(queryClient)}>
                <ContactInfo />
            </HydrationBoundary>
        );
    } catch (error) {
        console.error('Error prefetching contact info:', error);

        // Fallback to client-side fetching if server prefetch fails
        return <ContactInfo />;
    }
}

/**
 * Advanced SSR component with proper error handling and suspense boundaries
 */
export default function ContactInfoAdvancedSSR() {
    return (
        <Suspense fallback={<ContactInfoSkeleton />}>
            <ContactInfoServerFetcher />
        </Suspense>
    );
}
