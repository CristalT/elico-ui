import { ReactNode } from 'react';
import Link from 'next/link';
import CartProvider from '@/context/cart-context';
import AuthProvider from '@/context/auth-provider';

interface CheckoutLayoutProps {
    children: ReactNode;
}

export default function CheckoutLayout({ children }: CheckoutLayoutProps) {
    return (
        <div className="bg-white">
            <header className="border-b text-center">
                <h1 className="text-5xl font-bold p-8 bg-white">Rey Castor</h1>
            </header>
            <AuthProvider>
                <CartProvider>
                    <main className="bg-gray-100">{children}</main>
                </CartProvider>
            </AuthProvider>
            <footer className="border-t items-center bg-white">
                <nav className="flex gap-6 justify-center max-w-7xl mx-auto p-4 text-gray-600">
                    <Link href="#">Política de reembolso</Link>
                    <Link href="#">Envío</Link>
                    <Link href="#">Política de privacidad</Link>
                    <Link href="#">Términos y condiciones</Link>
                    <Link href="#">Contacto</Link>
                </nav>
            </footer>
        </div>
    );
}
