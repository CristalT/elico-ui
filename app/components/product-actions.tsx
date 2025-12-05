'use client';

import { Product } from '@/lib/api/types';
import { Button } from './ui/button';
import { Eye, ShoppingCart } from 'lucide-react';
import { useCart } from '@/context/cart-context';
import Link from 'next/link';

export default function ProductActions({ product }: { product: Product }) {
    const cart = useCart();

    return (
        <div className="flex flex-col gap-2 bottom-0 p-4">
            {/* Ver más button */}
            <Link href={`/products/${product.id}`}>
                <Button variant="outline" className="w-full">
                    <Eye className="w-4 h-4 mr-2" />
                    Ver más
                </Button>
            </Link>

            {/* Cart button - only render if price > 0 and not null */}
            {product.price &&
                product.price > 0 &&
                (cart?.existsInCart(product.id) ? (
                    <Button variant="danger" onClick={() => cart?.remove.mutate(product.id)}>
                        <span>Quitar del carrito</span>
                    </Button>
                ) : (
                    <Button
                        variant="default"
                        onClick={() =>
                            cart?.add.mutate({ price: product.price, productId: product.id, quantity: 1, product })
                        }
                    >
                        <ShoppingCart className="w-4 h-4 mr-2" />
                        <span>Agregar al carrito</span>
                    </Button>
                ))}
        </div>
    );
}
