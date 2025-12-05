import ProductsList from './products-list';
import { Suspense } from 'react';

export default async function ProductsPage() {
    return (
        <Suspense
            fallback={
                <div className="flex justify-center items-center min-h-96">
                    <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
                </div>
            }
        >
            <ProductsList />
        </Suspense>
    );
}
