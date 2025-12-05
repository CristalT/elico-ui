'use client';
import { useCart } from '@/context/cart-context';
import ProductImage from '@/components/product-image';

export default function CartSummary() {
    const cart = useCart();

    return (
        <div>
            {cart?.cart.map((item) => (
                <div key={item.productId} className="flex items-center justify-between py-2">
                    <div className="flex items-center gap-2">
                        <figure className="w-20 h-20 items-center flex justify-center">
                            <ProductImage image={item.product.image} name={item.product.name} width={48} height={48} />
                        </figure>
                        <div className="w-sm">
                            <h4 className="text-sm font-medium">{item.product.name}</h4>

                            <span className="text-xs text-gray-500">${item.product.price}</span>
                            <span className="text-xs text-gray-500"> x {item.quantity}</span>
                        </div>
                    </div>
                </div>
            ))}
            <div className="flex justify-between mt-4">
                <span className="text-sm text-gray-500">Subtotal - {cart?.count} artículos</span>
                <span className="text-sm font-medium">$ {cart?.total.toLocaleString('es-AR')}</span>
            </div>
            <div className="flex justify-between mt-4">
                <span className="text-sm text-gray-500">Envío</span>
                <span className="text-sm font-medium">GRATIS</span>
            </div>
            <div className="flex justify-between mt-4">
                <span className="text-xl font-bold ">Total</span>
                <span className="text-xl font-bold">$ {cart?.total.toLocaleString('es-AR')}</span>
            </div>
        </div>
    );
}
