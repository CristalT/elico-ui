'use client';

import CartSummary from './cart-summary';
import CheckoutForm from './checkout-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useState } from 'react';

export default function CheckoutPage() {
    const [isOrderSubmitted, setIsOrderSubmitted] = useState(false);

    const handleSubmitSuccess = () => {
        setIsOrderSubmitted(true);
    };

    return (
        <div className="flex">
            <div
                className={`${isOrderSubmitted ? 'w-full' : 'w-1/2'} bg-white py-6 px-12 ${!isOrderSubmitted ? 'border-r' : ''} flex justify-end transition-all duration-300`}
            >
                <div className={`${isOrderSubmitted ? 'w-full' : 'w-4/5'} flex flex-col gap-4`}>
                    <CheckoutForm onSubmitSuccess={handleSubmitSuccess} />
                </div>
            </div>

            {!isOrderSubmitted && (
                <div className="w-1/2 py-6 px-12">
                    <div className="w-4/5 flex flex-col gap-4">
                        <CartSummary />
                        <div className="flex gap-2 mt-4 border-t py-6">
                            <Input className="h-12 bg-white" type="text" placeholder="Código de descuento" />
                            <Button className="h-12" variant="outline">
                                Aplicar
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
