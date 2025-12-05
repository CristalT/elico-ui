'use client';

import { Search, X } from 'lucide-react';
import { Input } from './ui/input';
import { useSearchParams, useRouter } from 'next/navigation';
import { useState, useRef, useEffect, Suspense } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useDebouncedValue } from '@tanstack/react-pacer';
import api from '@/lib/api';
import ProductImage from './product-image';
import type { Product } from '@/lib/api/types';

function SearchInputComponent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [inputValue, setInputValue] = useState('');
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [debouncedSearchTerm] = useDebouncedValue(searchTerm, { wait: 500 });
    const [selectedIndex, setSelectedIndex] = useState(-1);
    const inputRef = useRef<HTMLInputElement>(null);
    const suggestionsRef = useRef<HTMLDivElement>(null);

    // Get suggestions from API
    const { data, isFetching } = useQuery({
        queryKey: ['search-suggestions', debouncedSearchTerm],
        queryFn: () => api.stock.search(debouncedSearchTerm, { limit: 5 }),
        enabled: !!debouncedSearchTerm && debouncedSearchTerm.length >= 2,
    });

    const suggestions = data?.data || [];

    // Handle input change
    const handleInputChange = (value: string) => {
        setSearchTerm(value);
        setInputValue(value);
        setSelectedIndex(-1);

        if (value.length >= 2) {
            setShowSuggestions(true);
        } else {
            setShowSuggestions(false);
        }
    };

    // Search function
    const search = (value: string) => {
        const params = new URLSearchParams(searchParams.toString());
        if (value) {
            params.set('search', value);
        } else {
            params.delete('search');
        }
        params.set('page', '1');
        router.push(`/products?${params.toString()}`);
        setShowSuggestions(false);
        setInputValue('');
    };

    // Handle keyboard navigation
    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (!showSuggestions || !suggestions?.length) {
            if (e.key === 'Enter') {
                search(inputValue);
            }
            return;
        }

        switch (e.key) {
            case 'ArrowDown':
                e.preventDefault();
                setSelectedIndex((prev) => (prev < suggestions.length - 1 ? prev + 1 : prev));
                break;
            case 'ArrowUp':
                e.preventDefault();
                setSelectedIndex((prev) => (prev > 0 ? prev - 1 : -1));
                break;
            case 'Enter':
                e.preventDefault();
                if (selectedIndex >= 0 && suggestions[selectedIndex]) {
                    handleSuggestionClick(suggestions[selectedIndex]);
                } else {
                    search(inputValue);
                }
                break;
            case 'Escape':
                setShowSuggestions(false);
                setSelectedIndex(-1);
                break;
        }
    };

    // Handle suggestion click
    const handleSuggestionClick = (product: Product) => {
        router.push(`/products/${product.id}`);
    };

    // Close suggestions when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                suggestionsRef.current &&
                !suggestionsRef.current.contains(event.target as Node) &&
                inputRef.current &&
                !inputRef.current.contains(event.target as Node)
            ) {
                setShowSuggestions(false);
                setSelectedIndex(-1);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    return (
        <div className="hidden lg:block flex-1 mx-4 max-w-md relative">
            <Search className="absolute left-3 top-3 h-6 w-6 text-gray-400 z-10" />
            <Input
                ref={inputRef}
                placeholder="Qué estás buscando ..."
                className="pl-10 h-12"
                value={searchTerm}
                onChange={(e) => handleInputChange(e.target.value)}
                onKeyDown={handleKeyDown}
                onFocus={() => {
                    if (inputValue.length >= 2 && suggestions?.length) {
                        setShowSuggestions(true);
                    }
                }}
            />

            {/* Clear button */}
            {searchTerm && (
                <button
                    className="absolute right-3 top-3 h-6 w-6 text-gray-400 hover:text-gray-600 z-10 cursor-pointer"
                    onClick={() => {
                        setSearchTerm('');
                        setShowSuggestions(false);
                        inputRef.current?.focus();
                    }}
                >
                    <X className="h-4 w-4" />
                </button>
            )}

            {/* Suggestions Dropdown */}
            {showSuggestions && (
                <div
                    ref={suggestionsRef}
                    className="absolute top-full left-0 right-0 bg-white border border-gray-200 rounded-md shadow-lg z-50 max-h-96 overflow-y-auto scrollbar"
                >
                    {isFetching && (
                        <div className="p-4 text-center">
                            <div className="flex items-center justify-center space-x-2">
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
                            <p className="text-sm text-gray-500 mt-2">Buscando...</p>
                        </div>
                    )}

                    {!isFetching && suggestions && suggestions.length > 0 && (
                        <div className="py-2">
                            <div className="px-4 py-2 text-xs text-gray-500 font-medium border-b">
                                {suggestions.length} resultado
                                {suggestions.length !== 1 ? 's' : ''} encontrado
                                {suggestions.length !== 1 ? 's' : ''}
                            </div>
                            {suggestions.map((product, index) => (
                                <div
                                    key={product.id}
                                    className={`w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors cursor-pointer ${
                                        selectedIndex === index ? 'bg-gray-50 border-l-2 border-primary' : ''
                                    }`}
                                    onClick={() => handleSuggestionClick(product)}
                                >
                                    <div className="w-12 h-12 bg-gray-100 rounded-md flex items-center justify-center overflow-hidden flex-shrink-0">
                                        <ProductImage
                                            image={product.image}
                                            name={product.name}
                                            width={48}
                                            height={48}
                                            className="object-cover rounded-md"
                                        />
                                    </div>
                                    <div className="flex-1 text-left">
                                        <p className="font-medium text-sm text-gray-900 line-clamp-1">{product.name}</p>
                                    </div>
                                </div>
                            ))}
                            <div className="border-t mt-2">
                                <button
                                    className="w-full pt-3 pb-2 text-center text-sm text-primary hover:underline transition-colors"
                                    onClick={() => search(inputValue)}
                                >
                                    Ver todos los resultados para &ldquo;{inputValue}&rdquo;
                                </button>
                            </div>
                        </div>
                    )}

                    {!isFetching && suggestions && suggestions.length === 0 && debouncedSearchTerm && (
                        <div className="p-4 text-center">
                            <p className="text-sm text-gray-500">
                                No se encontraron resultados para &ldquo;{debouncedSearchTerm}&rdquo;
                            </p>
                            <button
                                className="mt-2 text-sm text-primary hover:underline cursor-pointer"
                                onClick={() => search(inputValue)}
                            >
                                Buscar de todas formas
                            </button>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}

// Fallback component for loading state
function SearchInputFallback() {
    return (
        <div className="relative w-full">
            <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                    className="pl-10 pr-10 py-2 w-full border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Buscar productos..."
                    disabled
                />
            </div>
        </div>
    );
}

// Main component with Suspense boundary
export default function SearchInput() {
    return (
        <Suspense fallback={<SearchInputFallback />}>
            <SearchInputComponent />
        </Suspense>
    );
}
