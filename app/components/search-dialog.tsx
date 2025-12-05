'use client';

import api from '@/lib/api';

import { Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Drawer, DrawerContent, DrawerFooter, DrawerHeader, DrawerTitle, DrawerTrigger } from '@/components/ui/drawer';
import { useQuery } from '@tanstack/react-query';
import { useDebouncedValue } from '@tanstack/react-pacer';
import { useState } from 'react';
import ProductImage from './product-image';
import { useRouter } from 'next/navigation';

export default function SearchDialog({ open, setOpen }: { open: boolean; setOpen: (open: boolean) => void }) {
    const router = useRouter();

    const [searchTerm, setSearchTerm] = useState('');
    const [debouncedSearchTerm] = useDebouncedValue(searchTerm, { wait: 500 });

    const { data, isFetching } = useQuery({
        queryKey: ['search', debouncedSearchTerm],
        queryFn: () => api.stock.search(debouncedSearchTerm, { limit: 5 }),
        enabled: !!debouncedSearchTerm && debouncedSearchTerm.length >= 2,
    });

    const products = data?.data || [];

    const goToCatalog = () => {
        // Navigate to the catalog page
        router.push('/products?search=' + searchTerm);
        setOpen(false);
    };

    return (
        <Drawer open={open} onOpenChange={setOpen}>
            <DrawerTrigger className="cursor-pointer hover:bg-gray-100 p-3 rounded-md">
                <Search className="size-6" />
            </DrawerTrigger>
            <DrawerContent className="h-full p-8">
                <DrawerHeader>
                    <DrawerTitle className="text-2xl mb-2">Buscar</DrawerTitle>
                </DrawerHeader>
                <div className="px-6">
                    <Input
                        placeholder="Buscar..."
                        className="h-12 w-full mb-4"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />

                    {isFetching && (
                        <div className="flex items-center justify-center py-8">
                            <div className="flex items-center space-x-2">
                                <div className="w-4 h-4 bg-primary rounded-full animate-pulse"></div>
                                <div
                                    className="w-4 h-4 bg-primary rounded-full animate-pulse"
                                    style={{ animationDelay: '0.2s' }}
                                ></div>
                                <div
                                    className="w-4 h-4 bg-primary rounded-full animate-pulse"
                                    style={{ animationDelay: '0.4s' }}
                                ></div>
                            </div>
                        </div>
                    )}

                    {products.length > 0 && (
                        <div>
                            {products.map((item) => (
                                <div
                                    key={item.id}
                                    className="flex items-center gap-4 p-4 rounded-md hover:bg-gray-100 cursor-pointer"
                                    onClick={() => {
                                        router.push(`/products/${item.id}`);
                                        setOpen(false);
                                    }}
                                >
                                    <div className="w-20">
                                        <ProductImage image={item.image} name={item.name} width={60} height={60} />
                                    </div>
                                    <div className="flex flex-col gap-2 w-full">
                                        <div className="font-semibold text-sm">{item.name}</div>
                                        <div className="text-gray-500 text-sm">$ {item.price}</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
                <DrawerFooter>
                    <Button variant="default" className="h-12" onClick={() => goToCatalog()}>
                        Ver más
                    </Button>
                </DrawerFooter>
            </DrawerContent>
        </Drawer>
    );
}
