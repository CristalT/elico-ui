'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { Heart } from 'lucide-react';
import SessionMenu from './session-menu';
import { CartDrawer } from '@/components/cart';
import { useSettings } from '@/context/settings-provider';
import { useMemo } from 'react';
import { useAuth } from '@/context/auth-provider';
import { useFavorites } from '@/context/favorite-provider';

export default function Subheader() {
    const pathname = usePathname();

    const menuOptions = [
        { href: '/', label: 'Inicio' },
        { href: '/products', label: 'Productos' },
        { href: '/contact', label: 'Contacto' },
        { href: '/about', label: 'Sobre nosotros' },
    ];

    const settings = useSettings();
    const auth = useAuth();
    const favorites = useFavorites();
    const length = favorites?.items?.length || 0;

    const eshopGuestEnabled = useMemo(() => settings?.settings?.eshopGuestEnabled, [settings]);
    const isAuthenticated = useMemo(() => auth?.isAuthenticated, [auth]);

    return (
        <div className="hidden lg:flex items-center justify-between border-b">
            <div className="items-center max-w-7xl w-full flex justify-between mx-auto">
                <nav className="p-4 text-sm">
                    <ul className="flex gap-14">
                        {menuOptions.map(({ href, label }, key) => (
                            <li key={key}>
                                <Link
                                    href={href}
                                    className={`${pathname === href ? 'text-primary font-medium' : 'text-gray-600'} hover:text-gray-900`}
                                >
                                    {label}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </nav>

                <nav className="p-4 flex items-center gap-4">
                    <Link href="/favorites" className="hover:bg-gray-100 px-4 py-3 rounded-md relative">
                        <Heart className="size-6" />
                        {length > 0 && <span className="bg-red-600 w-2 h-2 rounded-full absolute top-3 right-2"></span>}
                    </Link>

                    {(eshopGuestEnabled || isAuthenticated) && <CartDrawer />}

                    <SessionMenu />
                </nav>
            </div>
        </div>
    );
}
