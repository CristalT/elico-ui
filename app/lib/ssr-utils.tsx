import { QueryClient, dehydrate, HydrationBoundary } from '@tanstack/react-query';
import { ReactNode } from 'react';

/**
 * Utility function to create SSR-enabled components with React Query prefetching
 */
export async function createSSRComponent<T = unknown>(
    queryKey: string[],
    queryFn: () => Promise<T>,
    ClientComponent: React.ComponentType<{ initialData?: T }>,
    options?: {
        staleTime?: number;
        gcTime?: number;
        retry?: number;
    },
): Promise<ReactNode> {
    const queryClient = new QueryClient({
        defaultOptions: {
            queries: {
                retry: options?.retry ?? 2,
                staleTime: options?.staleTime ?? 10 * 60 * 1000, // 10 minutes
                gcTime: options?.gcTime ?? 15 * 60 * 1000, // 15 minutes
            },
        },
    });

    try {
        // Prefetch data on the server
        await queryClient.prefetchQuery({
            queryKey,
            queryFn,
        });

        // Return hydrated component
        return (
            <HydrationBoundary state={dehydrate(queryClient)}>
                <ClientComponent />
            </HydrationBoundary>
        );
    } catch (error) {
        console.warn(`Failed to prefetch data for ${queryKey.join('.')}:`, error);

        // Fallback to client-side rendering
        return <ClientComponent />;
    }
}

/**
 * Higher-order component for creating SSR-enabled components
 */
export function withSSR<P extends Record<string, unknown>>(
    Component: React.ComponentType<P>,
    queryKey: string[],
    queryFn: () => Promise<unknown>,
    options?: {
        staleTime?: number;
        gcTime?: number;
        retry?: number;
    },
) {
    return async function SSRComponent(props: P) {
        const queryClient = new QueryClient({
            defaultOptions: {
                queries: {
                    retry: options?.retry ?? 2,
                    staleTime: options?.staleTime ?? 10 * 60 * 1000,
                    gcTime: options?.gcTime ?? 15 * 60 * 1000,
                },
            },
        });

        try {
            await queryClient.prefetchQuery({
                queryKey,
                queryFn,
            });

            return (
                <HydrationBoundary state={dehydrate(queryClient)}>
                    <Component {...props} />
                </HydrationBoundary>
            );
        } catch (error) {
            console.warn(`SSR prefetch failed for ${queryKey.join('.')}:`, error);
            return <Component {...props} />;
        }
    };
}

/**
 * Type-safe wrapper for React Query SSR patterns
 */
export class SSRQueryBuilder<T> {
    private queryKey: string[];
    private queryFn: () => Promise<T>;
    private options: {
        staleTime?: number;
        gcTime?: number;
        retry?: number;
    };

    constructor(
        queryKey: string[],
        queryFn: () => Promise<T>,
        options: { staleTime?: number; gcTime?: number; retry?: number } = {},
    ) {
        this.queryKey = queryKey;
        this.queryFn = queryFn;
        this.options = options;
    }

    async hydrate<P extends Record<string, unknown>>(
        Component: React.ComponentType<P & { initialData?: T }>,
        props?: P,
    ): Promise<ReactNode> {
        return createSSRComponent(
            this.queryKey,
            this.queryFn,
            (componentProps: { initialData?: T }) => <Component {...(props || ({} as P))} {...componentProps} />,
            this.options,
        );
    }

    withComponent<P extends Record<string, unknown>>(Component: React.ComponentType<P>) {
        return withSSR(Component, this.queryKey, this.queryFn, this.options);
    }
}
