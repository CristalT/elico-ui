'use client';

import { Button } from '@/components/ui/button';
import {
    Drawer,
    DrawerContent,
    DrawerDescription,
    DrawerFooter,
    DrawerHeader,
    DrawerTitle,
    DrawerTrigger,
} from '@/components/ui/drawer';
import { Loader2, ShoppingCart } from 'lucide-react';
import { useCart } from '@/context/cart-context';
import { Input } from './ui/input';
import { useRouter } from 'next/navigation';
import Alert from './alert';
import ProductImage from './product-image';
import { useState } from 'react';

export function CartDrawer() {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const cart = useCart();
    const router = useRouter();

    const finish = async () => {
        setIsSubmitting(true);
        router.push('/checkout');
    };

    const length = cart?.cart?.length || 0;

    return (
        <>
            <Drawer direction="right">
                <DrawerTrigger asChild>
                    <div className="hover:bg-gray-100 p-3 rounded-md flex cursor-pointer">
                        <ShoppingCart className="size-6" />
                        {length > 0 && <span className="bg-red-600 w-2 h-2 rounded-full"></span>}
                    </div>
                </DrawerTrigger>
                <DrawerContent className="min-w-[600px]">
                    <DrawerHeader>
                        <DrawerTitle className="text-xl">Mi Carrito</DrawerTitle>
                        <DrawerDescription>Confirmá los artículos de tu compra</DrawerDescription>
                    </DrawerHeader>
                    <div className="p-4 overflow-y-auto scrollbar" style={{ height: 'calc(100vh - 240px)' }}>
                        {cart?.cart?.map((item) => (
                            <div key={item.productId} className="flex items-center justify-between border-b py-2">
                                <div className="flex items-center gap-2">
                                    <figure className="w-20 h-20 items-center flex justify-center">
                                        <ProductImage
                                            image={item.product.image}
                                            name={item.product.name}
                                            width={70}
                                            height={70}
                                        />
                                    </figure>
                                    <div className="w-50">
                                        <h4 className="text-xs font-medium">{item.product.name}</h4>

                                        <span className="text-xs text-gray-500">${item.price}</span>
                                    </div>
                                </div>
                                <div className="flex flex-col gap-1 items-end">
                                    <Input
                                        type="number"
                                        min="1"
                                        value={item.quantity}
                                        onChange={(e) =>
                                            cart?.editCartItem(item.productId, parseInt(e.target.value, 10) || 1)
                                        }
                                        className="w-16 text-xs text-center border-0 bg-gray-100 rounded"
                                    />

                                    <Alert
                                        title="Quitar"
                                        message="¿Desea quitar el artículo artículo del carrito?"
                                        cancel="Cancelar"
                                        accept="Aceptar"
                                        onAccept={() => cart?.remove.mutate(item.productId)}
                                    >
                                        <span className="text-xs text-gray-500 hover:underline cursor-pointer">
                                            Quitar
                                        </span>
                                    </Alert>
                                </div>
                            </div>
                        ))}
                    </div>
                    <DrawerFooter className="absolute bottom-0 w-full bg-white">
                        <div className="flex gap-4 items-center p-2 justify-between">
                            <div className="text-xs">
                                Los impuestos y gastos de envío se calculan en la pantalla de pago.
                            </div>
                            <div className="flex justify-end w-60">
                                <div className="flex flex-col">
                                    <span className="text-sm font-medium text-gray-500">Subtotal</span>{' '}
                                    <span className="font-bold text-2xl">$ {cart?.total.toLocaleString('es-AR')}</span>
                                </div>
                            </div>
                        </div>
                        <Button className="h-12" onClick={() => finish()} disabled={cart?.count === 0 || isSubmitting}>
                            {isSubmitting ? <Loader2 className="animate-spin" /> : null}
                            Finalizar pedido
                        </Button>
                    </DrawerFooter>
                </DrawerContent>
            </Drawer>
        </>
    );
}
