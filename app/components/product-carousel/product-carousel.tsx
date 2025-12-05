'use client';

import { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, PlayCircle, PauseCircle } from 'lucide-react';
import Product from '@/components/product';
import { Product as ProductType } from '@/lib/api/types';

interface ProductCarouselProps {
    products: ProductType[];
    title?: string;
    subtitle?: string;
    autoPlay?: boolean;
    autoPlayInterval?: number;
    slidesToShow?: number;
    slidesToScroll?: number;
    showControls?: boolean;
    showIndicators?: boolean;
    className?: string;
}

export default function ProductCarousel({
    products,
    title = 'Productos Destacados',
    subtitle = 'Descubre nuestra selección de productos',
    autoPlay = true,
    autoPlayInterval = 5000,
    slidesToShow = 4,
    slidesToScroll = 1,
    showControls = true,
    showIndicators = true,
    className = '',
}: ProductCarouselProps) {
    const [currentSlide, setCurrentSlide] = useState(0);
    const [isPlaying, setIsPlaying] = useState(autoPlay);
    const [isHovered, setIsHovered] = useState(false);

    // Calculate total slides based on products and slidesToShow
    const totalSlides = Math.max(0, products.length - slidesToShow + 1);
    const maxSlide = totalSlides - 1;

    // Auto-play functionality
    useEffect(() => {
        if (!isPlaying || isHovered || totalSlides <= 1) return;

        const interval = setInterval(() => {
            setCurrentSlide((prev) => (prev >= maxSlide ? 0 : prev + 1));
        }, autoPlayInterval);

        return () => clearInterval(interval);
    }, [isPlaying, isHovered, autoPlayInterval, maxSlide, totalSlides]);

    const goToSlide = useCallback(
        (slideIndex: number) => {
            setCurrentSlide(Math.max(0, Math.min(slideIndex, maxSlide)));
        },
        [maxSlide],
    );

    const goToPrevious = useCallback(() => {
        setCurrentSlide((prev) => (prev <= 0 ? maxSlide : prev - slidesToScroll));
    }, [maxSlide, slidesToScroll]);

    const goToNext = useCallback(() => {
        setCurrentSlide((prev) => (prev >= maxSlide ? 0 : prev + slidesToScroll));
    }, [maxSlide, slidesToScroll]);

    const togglePlayPause = useCallback(() => {
        setIsPlaying(!isPlaying);
    }, [isPlaying]);

    // Handle keyboard navigation
    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'ArrowLeft') {
                goToPrevious();
            } else if (event.key === 'ArrowRight') {
                goToNext();
            } else if (event.key === ' ') {
                event.preventDefault();
                togglePlayPause();
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [goToPrevious, goToNext, togglePlayPause]);

    if (products.length === 0) {
        return (
            <div className={`w-full ${className}`}>
                <div className="text-center py-12">
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">{title}</h2>
                    <p className="text-gray-600">No hay productos disponibles en este momento.</p>
                </div>
            </div>
        );
    }

    return (
        <div className={`w-full ${className}`}>
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h2 className="text-3xl font-bold text-gray-900 mb-2">{title}</h2>
                    {subtitle && <p className="text-gray-600 text-lg">{subtitle}</p>}
                </div>

                {showControls && (
                    <div className="flex items-center gap-2">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={togglePlayPause}
                            className="border-2 border-gray-300 hover:border-black"
                        >
                            {isPlaying ? <PauseCircle className="w-4 h-4" /> : <PlayCircle className="w-4 h-4" />}
                        </Button>

                        <Button
                            variant="outline"
                            size="sm"
                            onClick={goToPrevious}
                            disabled={totalSlides <= 1}
                            className="border-2 border-gray-300 hover:border-black disabled:opacity-50"
                        >
                            <ChevronLeft className="w-4 h-4" />
                        </Button>

                        <Button
                            variant="outline"
                            size="sm"
                            onClick={goToNext}
                            disabled={totalSlides <= 1}
                            className="border-2 border-gray-300 hover:border-black disabled:opacity-50"
                        >
                            <ChevronRight className="w-4 h-4" />
                        </Button>
                    </div>
                )}
            </div>

            {/* Carousel Container */}
            <div
                className="relative overflow-hidden rounded-lg"
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
            >
                {/* Products Track */}
                <div
                    className="flex transition-transform duration-500 ease-in-out"
                    style={{
                        transform: `translateX(-${currentSlide * (100 / slidesToShow)}%)`,
                    }}
                >
                    {products.map((product) => (
                        <div
                            key={product.id}
                            className="flex-shrink-0 px-2"
                            style={{ width: `${100 / slidesToShow}%` }}
                        >
                            <Product {...product} />
                        </div>
                    ))}
                </div>

                {/* Navigation Arrows */}
                {showControls && totalSlides > 1 && (
                    <>
                        <button
                            onClick={goToPrevious}
                            className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/90 hover:bg-white border-2 border-black rounded-full p-2 shadow-lg transition-all duration-200 hover:scale-110"
                            aria-label="Anterior"
                        >
                            <ChevronLeft className="w-6 h-6 text-black" />
                        </button>

                        <button
                            onClick={goToNext}
                            className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/90 hover:bg-white border-2 border-black rounded-full p-2 shadow-lg transition-all duration-200 hover:scale-110"
                            aria-label="Siguiente"
                        >
                            <ChevronRight className="w-6 h-6 text-black" />
                        </button>
                    </>
                )}
            </div>

            {/* Indicators */}
            {showIndicators && totalSlides > 1 && (
                <div className="flex justify-center mt-6 gap-2">
                    {Array.from({ length: totalSlides }).map((_, index) => (
                        <button
                            key={index}
                            onClick={() => goToSlide(index)}
                            className={`w-3 h-3 rounded-full transition-all duration-200 ${
                                index === currentSlide ? 'bg-black scale-125' : 'bg-gray-300 hover:bg-gray-400'
                            }`}
                            aria-label={`Ir a página ${index + 1}`}
                        />
                    ))}
                </div>
            )}

            {/* Progress Bar */}
            {isPlaying && totalSlides > 1 && (
                <div className="mt-4">
                    <div className="w-full bg-gray-200 rounded-full h-1">
                        <div
                            className="bg-black h-1 rounded-full transition-all duration-100"
                            style={{
                                width: `${((currentSlide + 1) / totalSlides) * 100}%`,
                            }}
                        />
                    </div>
                </div>
            )}

            {/* Statistics */}
            <div className="flex justify-center mt-4 text-sm text-gray-500">
                <span>
                    Mostrando {Math.min(slidesToShow, products.length)} de {products.length} productos
                    {totalSlides > 1 && ` • Página ${currentSlide + 1} de ${totalSlides}`}
                </span>
            </div>
        </div>
    );
}
