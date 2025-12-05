import { ReactNode } from 'react';
import { Be_Vietnam_Pro } from 'next/font/google';
import './globals.css';
import QueryProvider from './providers/query-client-provider';
import AuthProvider from './context/auth-provider';
import CartProvider from './context/cart-context';
import SettingsProvider from './context/settings-provider';
import FavoriteProvider from './context/favorite-provider';

const font = Be_Vietnam_Pro({
    subsets: ['latin'],
    weight: ['300', '400', '500', '600', '700'],
    display: 'swap',
});

const siteTitle = `${process.env.NEXT_PUBLIC_COMPANY_NAME} - eShop`;

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
    return (
        <html lang="en">
            <head>
                <title>{siteTitle}</title>
                <meta
                    name="description"
                    content="Welcome to Rey Castor's eShop, your number one source for all things fashion. We're dedicated to giving you the very best of clothing, with a focus on dependability, customer service, and uniqueness."
                />
                <link rel="icon" href="/images/favicon.ico" />
            </head>
            <body className={`${font.className}`}>
                <QueryProvider>
                    <AuthProvider>
                        <SettingsProvider>
                            <FavoriteProvider>
                                <CartProvider>{children}</CartProvider>
                            </FavoriteProvider>
                        </SettingsProvider>
                    </AuthProvider>
                </QueryProvider>
            </body>
        </html>
    );
}
