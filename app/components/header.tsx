'use client';

import Subheader from './subheader';
import { Menu } from 'lucide-react';
import { Button } from './ui/button';
import SearchDialog from './search-dialog';
import { useState } from 'react';
import SearchInput from './search-input';
import Image from 'next/image';

export default function Header() {
    const [searchOpen, setSearchOpen] = useState(false);

    return (
        <header className="bg-white">
            <div className="border-b">
                <div className="flex items-center justify-between border-gray-200 px-4 max-w-7xl mx-auto">
                    <Button variant="ghost" className="lg:hidden size-12">
                        <Menu className="size-6" />
                    </Button>

                    <Image
                        src="/images/logo.png"
                        alt={process.env.NEXT_PUBLIC_COMPANY_NAME ?? ''}
                        width={150}
                        height={150}
                    />

                    <div className="hidden lg:block flex-1 mx-4 max-w-md relative">
                        <SearchInput />
                    </div>

                    <div className="lg:hidden">
                        <SearchDialog open={searchOpen} setOpen={setSearchOpen} />
                    </div>
                </div>
            </div>

            <Subheader />
        </header>
    );
}
