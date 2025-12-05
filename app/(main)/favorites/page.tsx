'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Heart, ShoppingCart, Eye, Trash2, Share2 } from 'lucide-react';
import Link from 'next/link';
import ProductImage from '@/components/product-image';
import { useFavorites } from '@/context/favorite-provider';
import Alert from '@/components/alert';

export default function FavoritesPage() {
    const favorites = useFavorites();

    const favoritesLength = favorites?.items.length || 0;

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('es-AR', {
            style: 'currency',
            currency: 'ARS',
        }).format(price);
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('es-AR', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
    };

    return (
        <div className="max-w-7xl mx-auto px-4 py-8">
            {/* Header Section */}
            <div className="mb-8">
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h1 className="text-4xl font-bold text-gray-900 flex items-center gap-3 mb-2">
                            <Heart className="w-10 h-10 text-red-500 fill-current" />
                            Mis Productos Favoritos
                        </h1>
                        <p className="text-gray-600 text-lg">
                            {favoritesLength > 0
                                ? `Tienes ${favoritesLength} producto${favoritesLength === 1 ? '' : 's'} guardado${favoritesLength === 1 ? '' : 's'} en tu lista de favoritos`
                                : 'Tu lista de favoritos está vacía'}
                        </p>
                    </div>

                    {favoritesLength > 0 && (
                        <Alert
                            title="Vaciar favoritos"
                            message="Esta acción eliminará todos los productos de tu lista de favoritos."
                            onAccept={() => favorites?.clear.mutate()}
                        >
                            <Button variant="danger">
                                <Trash2 className="w-4 h-4 mr-2" />
                                Limpiar Lista
                            </Button>
                        </Alert>
                    )}
                </div>
            </div>

            {/* Empty State */}
            {favoritesLength === 0 ? (
                <div className="text-center py-16">
                    <div className="max-w-md mx-auto">
                        <Heart className="w-24 h-24 text-gray-300 mx-auto mb-6" />
                        <h2 className="text-3xl font-semibold text-gray-900 mb-4">¡Comienza tu lista de favoritos!</h2>
                        <p className="text-gray-600 mb-8 leading-relaxed">
                            Explora nuestro catálogo de productos y guarda los que más te interesen para encontrarlos
                            fácilmente después.
                        </p>
                        <Link href="/products">
                            <Button className="border-2 border-black">
                                <Eye className="w-5 h-5 mr-2" />
                                Explorar Productos
                            </Button>
                        </Link>
                    </div>
                </div>
            ) : (
                /* Favorites Grid */
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {favorites?.items.map((favorite) => (
                        <Card
                            key={favorite.id}
                            className="overflow-hidden hover:shadow-lg transition-all duration-300 border-2 border-gray-100 hover:border-gray-200"
                        >
                            <div className="relative group">
                                {/* Product Image */}
                                <div className="aspect-square bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center relative overflow-hidden">
                                    <ProductImage
                                        image={favorite.product.image}
                                        name={favorite.product.name}
                                        width={300}
                                        height={300}
                                        className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-105"
                                    />

                                    {/* Action Buttons Overlay */}
                                    <div className="absolute top-3 right-3 flex flex-col gap-2">
                                        <button
                                            onClick={() => favorites.remove.mutate(favorite.id)}
                                            className="p-2 bg-white rounded-full shadow-md hover:bg-red-50 transition-colors group/heart cursor-pointer"
                                        >
                                            <Heart className="w-5 h-5 text-red-500 fill-current group-hover/heart:scale-110 transition-transform" />
                                        </button>
                                        <button className="p-2 bg-white rounded-full shadow-md hover:bg-gray-50 transition-colors">
                                            <Share2 className="w-5 h-5 text-gray-600" />
                                        </button>
                                    </div>

                                    {/* Category Badge */}
                                    {favorite.product.categories?.[0] && (
                                        <div className="absolute bottom-3 left-3">
                                            <span className="px-3 py-1 bg-black text-white text-xs font-medium rounded-full">
                                                {favorite.product.categories[0].name}
                                            </span>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <CardContent className="p-6">
                                {/* Product Info */}
                                <div className="mb-4">
                                    <h3 className="font-semibold text-gray-900 text-lg mb-2 line-clamp-2 leading-tight">
                                        {favorite.product.name}
                                    </h3>
                                    <div className="flex items-center justify-between mb-3">
                                        <p className="text-sm text-gray-500">Código: {favorite.product.code}</p>
                                        <p className="text-2xl font-bold text-gray-900">
                                            {formatPrice(favorite.product.price)}
                                        </p>
                                    </div>
                                    <p className="text-xs text-gray-400">
                                        Agregado el {formatDate(favorite.createdAt)}
                                    </p>
                                </div>

                                {/* Action Buttons */}
                                <div className="space-y-3">
                                    <Link href={`/products/${favorite.id}`} className="block">
                                        <Button
                                            variant="outline"
                                            className="w-full border-2 border-black hover:bg-black hover:text-white transition-colors"
                                        >
                                            <Eye className="w-4 h-4 mr-2" />
                                            Ver Detalles
                                        </Button>
                                    </Link>

                                    <Button
                                        className="w-full border-2 border-black bg-black text-white hover:bg-gray-800"
                                        onClick={() => {
                                            // TODO: add to cart functionality
                                        }}
                                    >
                                        <ShoppingCart className="w-4 h-4 mr-2" />
                                        Agregar al Carrito
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}

            {/* Action Footer */}
            {favoritesLength > 0 && (
                <div className="mt-12 pt-8 border-t border-gray-200">
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <Link href="/products">
                            <Button variant="outline" className="border-2 border-black">
                                Continuar Explorando
                            </Button>
                        </Link>
                        <Button
                            className="border-2 border-black bg-black text-white"
                            onClick={() => {
                                // TODO: add all to cart functionality
                            }}
                        >
                            <ShoppingCart className="w-4 h-4 mr-2" />
                            Agregar Todos al Carrito ({favoritesLength})
                        </Button>
                    </div>
                </div>
            )}
        </div>
    );
}
