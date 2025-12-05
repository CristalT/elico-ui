'use client';

import { useState, useEffect } from 'react';
import ProductCarousel from './product-carousel';
import { Product } from '@/lib/api/types';

interface ResponsiveProductCarouselProps {
    products: Product[];
    title?: string;
    subtitle?: string;
    autoPlay?: boolean;
    autoPlayInterval?: number;
    showControls?: boolean;
    showIndicators?: boolean;
    className?: string;
}

export default function ResponsiveProductCarousel(props: ResponsiveProductCarouselProps) {
    const [slidesToShow, setSlidesToShow] = useState(4);

    useEffect(() => {
        const updateSlidesToShow = () => {
            const width = window.innerWidth;
            if (width < 640) {
                setSlidesToShow(1); // Mobile
            } else if (width < 768) {
                setSlidesToShow(2); // Small tablet
            } else if (width < 1024) {
                setSlidesToShow(3); // Tablet
            } else {
                setSlidesToShow(4); // Desktop
            }
        };

        updateSlidesToShow();
        window.addEventListener('resize', updateSlidesToShow);
        return () => window.removeEventListener('resize', updateSlidesToShow);
    }, []);

    return <ProductCarousel {...props} slidesToShow={slidesToShow} slidesToScroll={1} />;
}
