import Image from 'next/image';
import { ImageIcon } from 'lucide-react';

export default function ProductImage({
    className,
    image,
    name,
    width,
    height,
}: {
    className?: string;
    image?: string;
    name: string;
    width: number;
    height: number;
}) {
    const baseUrl = process.env.NEXT_PUBLIC_IMAGES_URL?.replace(/\/$/, '') || '';
    const imageSrc = `${baseUrl}/${image}`;

    if (!image || image.trim() === '') {
        return <ImageIcon className="text-gray-400 w-1/2 h-1/2" />;
    } else {
        return (
            <Image
                className={className}
                src={imageSrc}
                alt={name}
                width={width}
                height={height}
                style={{ height: '100%', width: 'auto', background: 'red' }}
                priority={true}
            />
        );
    }
}
