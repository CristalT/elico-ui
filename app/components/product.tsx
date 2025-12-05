import { Heart } from 'lucide-react';
import ProductImage from './product-image';
import { useFavorites } from '@/context/favorite-provider';
import { Product as ProductProps } from '@/lib/api/types';
import { Badge } from './ui/badge';
import Heading from './ui/heading';
import ProductActions from './product-actions';

export default function Product(product: ProductProps) {
    const { id, name, price, image } = product;
    const fav = useFavorites();
    const category = product.categories?.[0]?.name;
    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('es-AR', {
            style: 'currency',
            currency: 'ARS',
        }).format(price);
    };

    return (
        <div className="bg-gray-100 rounded-md border border-gray-200 shadow-md">
            <div className="relative h-[200px] rounded-tl-md rounded-tr-md overflow-hidden flex items-center justify-center bg-white border-b border-gray-200">
                <Heart
                    className={`${fav?.exists(id!) ? 'fill-red-500 text-red-500' : ''} absolute top-4 right-4 size-6 cursor-pointer rounded-full text-primary hover:fill-primary hover:text-primary`}
                    onClick={() => fav?.toggle.mutate(product)}
                />
                <ProductImage image={image} name={name} width={200} height={200} />
                {category && (
                    <Badge variant="default" className="absolute bottom-4 left-4 rounded-full">
                        {category}
                    </Badge>
                )}
            </div>
            <div className="p-4 min-h-[150px]">
                <Heading className="font-semibold text-gray-900 text-md mb-2 line-clamp-2 leading-tight">
                    {name}
                </Heading>
                <div className="flex flex-col gap-4 mt-2">
                    <p className="text-sm text-gray-500">Código: {id}</p>
                    {price && <p className="text-2xl font-bold text-gray-900 text-right">{formatPrice(price)}</p>}
                </div>
            </div>
            <ProductActions product={product} />
        </div>
    );
}
