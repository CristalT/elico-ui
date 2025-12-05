'use client';
import ResponsiveProductCarousel from './responsive-product-carousel';
import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';
import { Skeleton } from '@/components/ui/skeleton';

// Skeleton component for individual product cards
function ProductCardSkeleton() {
    return (
        <div className="bg-gray-100 rounded-md border border-gray-200 shadow-md">
            <div className="relative h-[200px] rounded-tl-md rounded-tr-md overflow-hidden bg-gray-200">
                {/* Heart icon skeleton */}
                <Skeleton className="absolute top-4 right-4 w-6 h-6 rounded-full" />
                {/* Category badge skeleton */}
                <Skeleton className="absolute bottom-4 left-4 w-20 h-6 rounded-full" />
            </div>

            {/* Product info skeleton */}
            <div className="p-4 space-y-3">
                {/* Product code */}
                <Skeleton className="h-3 w-24 mx-auto" />

                {/* Product name */}
                <div className="space-y-2">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-3/4 mx-auto" />
                </div>

                {/* Price */}
                <Skeleton className="h-6 w-20 mx-auto" />

                {/* Action buttons */}
                <div className="space-y-2 pt-2">
                    <Skeleton className="h-10 w-full" />
                    <Skeleton className="h-10 w-full" />
                </div>
            </div>
        </div>
    );
}

// Skeleton component for carousel section
function CarouselSkeleton() {
    return (
        <div className="w-full mb-12">
            {/* Header skeleton */}
            <div className="flex items-center justify-between mb-8">
                <div>
                    <Skeleton className="h-8 w-64 mb-2" />
                    <Skeleton className="h-5 w-80" />
                </div>
                <div className="flex items-center gap-2">
                    <Skeleton className="h-8 w-8 rounded" />
                    <Skeleton className="h-8 w-8 rounded" />
                    <Skeleton className="h-8 w-8 rounded" />
                </div>
            </div>

            {/* Product cards skeleton */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {Array.from({ length: 4 }).map((_, index) => (
                    <ProductCardSkeleton key={index} />
                ))}
            </div>

            {/* Indicators skeleton */}
            <div className="flex justify-center mt-6 gap-2">
                {Array.from({ length: 3 }).map((_, index) => (
                    <Skeleton key={index} className="w-3 h-3 rounded-full" />
                ))}
            </div>

            {/* Progress bar skeleton */}
            <div className="mt-4">
                <Skeleton className="w-full h-1 rounded-full" />
            </div>

            {/* Statistics skeleton */}
            <div className="flex justify-center mt-4">
                <Skeleton className="h-4 w-48" />
            </div>
        </div>
    );
}

export function Showcase() {
    const { data, isLoading } = useQuery({
        queryKey: ['showcase'],
        queryFn: () => api.stock.showcases(),
    });

    if (isLoading) {
        return (
            <div className="py-12 space-y-12">
                {/* Show multiple carousel skeletons to match expected layout */}
                <CarouselSkeleton />
                <CarouselSkeleton />
            </div>
        );
    }

    const showcases = data || [];

    return (
        <div className="py-12">
            {showcases.map((showcase, index) => (
                <ResponsiveProductCarousel
                    key={index}
                    products={showcase.products}
                    title={showcase.name}
                    subtitle={showcase.description}
                    autoPlay={true}
                    autoPlayInterval={4000}
                    showControls={true}
                    showIndicators={true}
                />
            ))}
        </div>
    );
}
