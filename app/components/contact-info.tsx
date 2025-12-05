'use client';
import api from '@/lib/api';
import { useQuery } from '@tanstack/react-query';
import { Mail, MapPin, Phone } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

interface ContactInfoProps {
    initialData?: Record<string, string>;
}

export default function ContactInfo({ initialData }: ContactInfoProps) {
    const { data, isLoading, error } = useQuery({
        queryKey: ['contact', 'info'],
        queryFn: () => api.contact.info(),
        staleTime: 10 * 60 * 1000, // 10 minutes
        gcTime: 15 * 60 * 1000, // 15 minutes
        initialData: initialData,
    });

    if (isLoading) {
        return (
            <div className="space-y-8">
                <h2 className="text-2xl font-semibold mb-6">Información de Contacto</h2>
                <div className="space-y-4">
                    {/* Email skeleton */}
                    <div className="flex items-center gap-4">
                        <Skeleton className="w-5 h-5 rounded" />
                        <div className="space-y-2">
                            <Skeleton className="h-4 w-32" />
                            <Skeleton className="h-4 w-48" />
                        </div>
                    </div>

                    {/* Phone skeleton */}
                    <div className="flex items-center gap-4">
                        <Skeleton className="w-5 h-5 rounded" />
                        <div className="space-y-2">
                            <Skeleton className="h-4 w-24" />
                            <Skeleton className="h-4 w-36" />
                        </div>
                    </div>

                    {/* Address skeleton */}
                    <div className="flex items-center gap-4">
                        <Skeleton className="w-5 h-5 rounded" />
                        <div className="space-y-2">
                            <Skeleton className="h-4 w-20" />
                            <Skeleton className="h-4 w-56" />
                            <Skeleton className="h-4 w-32" />
                            <Skeleton className="h-4 w-40" />
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="space-y-8">
                <h2 className="text-2xl font-semibold mb-6">Información de Contacto</h2>
                <div className="text-center py-8">
                    <p className="text-red-600 mb-4">Error al cargar la información de contacto</p>
                    <button
                        onClick={() => window.location.reload()}
                        className="px-4 py-2 bg-black text-white rounded hover:bg-gray-800 transition-colors border-2 border-black"
                    >
                        Reintentar
                    </button>
                </div>
            </div>
        );
    }

    const info = data || { email: '', phone: '', address: '', zip_code: '', city: '' };

    return (
        <div className="space-y-8">
            <h2 className="text-2xl font-semibold mb-6">Información de Contacto</h2>

            <div className="space-y-4">
                <div className="flex items-center gap-4">
                    <Mail className="w-5 h-5 text-primary" />
                    <div>
                        <p className="font-medium">Correo Electrónico</p>
                        <p className="text-gray-600">{info.email}</p>
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    <Phone className="w-5 h-5 text-primary" />
                    <div>
                        <p className="font-medium">Teléfono</p>
                        <p className="text-gray-600">{info.phone}</p>
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    <MapPin className="w-5 h-5 text-primary" />
                    <div>
                        <p className="font-medium">Dirección</p>
                        <p className="text-gray-600">{info.address}</p>
                        <p className="text-gray-600">Código Postal: {info.zip_code}</p>
                        <p className="text-gray-600">{info.city}</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
