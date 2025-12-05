'use client';

import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Heart, ShoppingCart, ArrowLeft, Plus, Minus, Package, Truck, Star, Share2, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';
import ProductImage from '@/components/product-image';
import { useCart } from '@/context/cart-context';
import { useFavorites } from '@/context/favorite-provider';

interface ProductDetailProps {
    productId: string;
}

export default function ProductDetail({ productId }: ProductDetailProps) {
    const router = useRouter();
    const cart = useCart();
    const fav = useFavorites();
    const [quantity, setQuantity] = useState(1);

    const {
        data: product,
        isLoading,
        error,
    } = useQuery({
        queryKey: ['product', productId],
        queryFn: () => api.stock.getProduct(productId),
        staleTime: 5 * 60 * 1000, // 5 minutes
    });

    const handleQuantityChange = (newQuantity: number) => {
        if (newQuantity >= 1) {
            setQuantity(newQuantity);
        }
    };

    const handleAddToCart = () => {
        if (product && !cart?.existsInCart(product.id!)) {
            cart?.add.mutate({
                price: product.price,
                productId: product.id!,
                quantity: quantity,
                product: product,
            });
        }
    };

    const handleBuyNow = () => {
        handleAddToCart();
        router.push('/checkout');
    };

    if (isLoading) {
        return (
            <div className="py-12">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                        {/* Image Skeleton */}
                        <Skeleton className="aspect-square rounded-lg" />

                        {/* Content Skeleton */}
                        <div className="space-y-6">
                            <Skeleton className="h-8 rounded" />
                            <Skeleton className="h-4 rounded w-1/3" />
                            <Skeleton className="h-6 rounded w-1/4" />
                            <div className="space-y-2">
                                <Skeleton className="h-4 rounded" />
                                <Skeleton className="h-4 rounded" />
                                <Skeleton className="h-4 rounded w-2/3" />
                            </div>
                            <div className="flex gap-4">
                                <Skeleton className="h-12 rounded w-32" />
                                <Skeleton className="h-12 rounded w-32" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (error || !product) {
        return (
            <div className="py-12">
                <div className="max-w-4xl mx-auto px-4 text-center">
                    <Package className="w-16 h-16 text-gray-400 mx-auto mb-6" />
                    <h1 className="text-4xl font-bold mb-4">Producto no encontrado</h1>
                    <p className="text-gray-600 mb-8">El producto que buscas no existe o no está disponible.</p>
                    <Link href="/products">
                        <Button className="border-2 border-black">
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            Volver a productos
                        </Button>
                    </Link>
                </div>
            </div>
        );
    }

    const isInCart = cart?.existsInCart(product.id!);
    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('es-AR', {
            style: 'currency',
            currency: 'ARS',
        }).format(price);
    };

    return (
        <div className="py-8">
            <div className="max-w-7xl mx-auto px-4">
                {/* Breadcrumb */}
                <nav className="mb-8">
                    <ol className="flex items-center space-x-2 text-sm text-gray-500">
                        <li>
                            <Link href="/products" className="hover:text-primary">
                                Productos
                            </Link>
                        </li>
                        {product.categories && product.categories.length > 0 && (
                            <>
                                {/* Sort categories by parentId to show parent categories first */}
                                {product.categories
                                    .sort((a, b) => {
                                        // Parent categories (parentId: null) come first
                                        if (a.parentId === null && b.parentId !== null) return -1;
                                        if (a.parentId !== null && b.parentId === null) return 1;
                                        return 0;
                                    })
                                    .map((category) => (
                                        <React.Fragment key={category.id}>
                                            <li className="mx-2">
                                                <ChevronRight className="w-4 h-4 text-gray-400" />
                                            </li>
                                            <li>
                                                <Link
                                                    href={`/products?category=${category.slug}`}
                                                    className="hover:text-primary"
                                                >
                                                    {category.name}
                                                </Link>
                                            </li>
                                        </React.Fragment>
                                    ))}
                            </>
                        )}
                    </ol>
                </nav>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                    {/* Product Image */}
                    <div className="space-y-4">
                        <div className="aspect-square bg-white rounded-lg border-2 border-gray-200 overflow-hidden flex items-center justify-center">
                            <ProductImage
                                image={product.image}
                                name={product.name}
                                width={600}
                                height={600}
                                className="object-cover w-full h-full"
                            />
                        </div>

                        {/* Additional Product Images - Placeholder for future enhancement */}
                        <div className="grid grid-cols-4 gap-2">
                            {[1, 2, 3, 4].map((index) => (
                                <div
                                    key={index}
                                    className="aspect-square bg-gray-100 rounded border border-gray-200 flex items-center justify-center opacity-50"
                                >
                                    <Package className="w-6 h-6 text-gray-400" />
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Product Info */}
                    <div className="space-y-6">
                        {/* Header */}
                        <div className="space-y-2">
                            <div className="flex items-start justify-between">
                                <h1 className="text-3xl font-bold text-gray-900">{product.name}</h1>
                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={() => fav?.toggle.mutate(product)}
                                        className={`p-2 rounded-full ${
                                            fav?.exists(product.id!)
                                                ? 'text-red-500 bg-red-50'
                                                : 'text-gray-400 hover:text-red-500'
                                        } transition-colors`}
                                    >
                                        <Heart
                                            className={`w-6 h-6 ${fav?.exists(product.id!) ? 'fill-current' : ''} cursor-pointer`}
                                        />
                                    </button>
                                    <button className="p-2 rounded-full text-gray-400 hover:text-gray-600 transition-colors">
                                        <Share2 className="w-6 h-6 cursor-pointer" />
                                    </button>
                                </div>
                            </div>

                            <div className="flex items-center gap-4">
                                <Badge variant="outline" className="text-sm">
                                    Código: {product.id}
                                </Badge>
                                <div className="flex items-center gap-1">
                                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                                    <Star className="w-4 h-4 text-gray-300" />
                                    <span className="text-sm text-gray-600 ml-1">(4.0)</span>
                                </div>
                            </div>
                        </div>

                        {/* Price */}
                        <div className="space-y-2">
                            <div className="text-3xl font-bold text-gray-900">{formatPrice(product.price)}</div>
                            {product.stock > 0 && <p className="text-green-600 font-medium">✓ Disponible en stock</p>}
                            {product.stock < 1 && <p className="text-red-600 font-medium">✗ Sin stock</p>}
                        </div>

                        {/* Description */}
                        <div className="space-y-4">
                            <h3 className="font-semibold text-lg">Descripción</h3>
                            <p className="text-gray-600 leading-relaxed">
                                {product.name} {product.description ? `- ${product.description}` : ''}
                            </p>
                        </div>

                        {/* Quantity Selector */}
                        <div className="space-y-4">
                            <div className="flex items-center gap-4">
                                <span className="font-medium">Cantidad:</span>
                                <div className="flex items-center border border-gray-300 rounded-lg">
                                    <button
                                        onClick={() => handleQuantityChange(quantity - 1)}
                                        className="p-2 hover:bg-gray-100 transition-colors"
                                        disabled={quantity <= 1}
                                    >
                                        <Minus className="w-4 h-4" />
                                    </button>
                                    <span className="px-4 py-2 font-medium min-w-[3rem] text-center">{quantity}</span>
                                    <button
                                        onClick={() => handleQuantityChange(quantity + 1)}
                                        className="p-2 hover:bg-gray-100 transition-colors"
                                    >
                                        <Plus className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="space-y-4">
                            <div className="flex gap-4">
                                {isInCart ? (
                                    <Button
                                        variant="outline"
                                        size="lg"
                                        className="flex-1 border-2 border-red-500 text-red-600 hover:bg-red-50 hover:text-red-600"
                                        onClick={() => cart?.remove.mutate(product.id!)}
                                    >
                                        Quitar del carrito
                                    </Button>
                                ) : (
                                    <Button
                                        size="lg"
                                        className="flex-1 border-2 border-black"
                                        onClick={handleAddToCart}
                                        disabled={cart?.add.isPending}
                                    >
                                        <ShoppingCart className="w-5 h-5 mr-2" />
                                        {cart?.add.isPending ? 'Agregando...' : 'Agregar al carrito'}
                                    </Button>
                                )}

                                <Button
                                    size="lg"
                                    variant="outline"
                                    className="flex-1 border-2 border-black"
                                    onClick={handleBuyNow}
                                    disabled={cart?.add.isPending}
                                >
                                    Comprar ahora
                                </Button>
                            </div>
                        </div>

                        {/* Features */}
                        <div className="space-y-4">
                            <div className="grid grid-cols-1 gap-4">
                                <Card>
                                    <CardContent className="p-4">
                                        <div className="flex items-center gap-3">
                                            <Truck className="w-5 h-5 text-blue-600" />
                                            <div>
                                                <p className="font-medium">Envío gratis</p>
                                                <p className="text-sm text-gray-600">En compras mayores a $50.000</p>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Back to Products */}
                <div className="flex justify-center mt-12">
                    <Link href="/products">
                        <Button variant="outline" className="border-2 border-black">
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            Volver a productos
                        </Button>
                    </Link>
                </div>
            </div>
        </div>
    );
}
