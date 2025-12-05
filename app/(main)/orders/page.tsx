'use client';

import { useMemo, useState } from 'react';
import { OrderStatus } from '@/lib/api/types';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
    Package,
    Clock,
    CheckCircle,
    XCircle,
    MapPin,
    Phone,
    User,
    Calendar,
    CreditCard,
    Undo2,
    PackageSearch,
    ChevronDown,
    ChevronUp,
} from 'lucide-react';
import Link from 'next/link';
import api from '@/lib/api';
import ProductImage from '@/components/product-image';
import { useQuery } from '@tanstack/react-query';

const statusConfig = {
    [OrderStatus.PROCESSING]: {
        label: 'Procesando',
        color: 'bg-blue-100 text-blue-800',
        icon: PackageSearch,
    },
    [OrderStatus.PENDING]: {
        label: 'Pendiente',
        color: 'bg-yellow-100 text-yellow-800',
        icon: Clock,
    },
    [OrderStatus.COMPLETED]: {
        label: 'Completado',
        color: 'bg-green-100 text-green-800',
        icon: CheckCircle,
    },
    [OrderStatus.CANCELLED]: {
        label: 'Cancelado',
        color: 'bg-red-100 text-red-800',
        icon: XCircle,
    },
    [OrderStatus.DELIVERED]: {
        label: 'Entregado',
        color: 'bg-emerald-100 text-emerald-800',
        icon: Package,
    },
    [OrderStatus.IN_CART]: {
        label: 'En Carrito',
        color: 'bg-gray-100 text-gray-800',
        icon: Package,
    },
};

export default function OrdersPage() {
    const { data, isLoading, error, refetch } = useQuery({
        queryKey: ['orders'],
        queryFn: () => api.order.getAll(),
    });

    const orders = useMemo(() => data?.data || [], [data]);
    const [expandedOrders, setExpandedOrders] = useState<Set<string>>(new Set());

    const toggleOrderDetails = (orderId: string) => {
        setExpandedOrders((prev) => {
            const newSet = new Set(prev);
            if (newSet.has(orderId)) {
                newSet.delete(orderId);
            } else {
                newSet.add(orderId);
            }
            return newSet;
        });
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('es-AR', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('es-AR', {
            style: 'currency',
            currency: 'ARS',
        }).format(price);
    };

    if (isLoading) {
        return (
            <div className="py-12">
                <div className="max-w-4xl mx-auto px-4">
                    <h1 className="text-5xl font-extrabold text-center mb-8">Mis Pedidos</h1>
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
                        <p className="mt-4 text-gray-600">Cargando tus pedidos...</p>
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="py-12">
                <div className="max-w-4xl mx-auto px-4 text-center">
                    <h1 className="text-5xl font-extrabold mb-8">Mis Pedidos</h1>
                    <div className="bg-red-50 text-red-700 p-6 rounded-lg">
                        <XCircle className="w-12 h-12 mx-auto mb-4" />
                        <p className="text-lg font-medium mb-2">Error al cargar los pedidos</p>
                        <p className="text-sm">{error.message}</p>
                        <Button onClick={() => refetch()} className="mt-4 border-2 border-black">
                            Intentar nuevamente
                        </Button>
                    </div>
                </div>
            </div>
        );
    }

    if (orders.length === 0) {
        return (
            <div className="py-12">
                <div className="max-w-4xl mx-auto px-4 text-center">
                    <h1 className="text-5xl font-extrabold mb-8">Mis Pedidos</h1>
                    <div className="bg-gray-50 p-12 rounded-lg">
                        <Package className="w-16 h-16 text-gray-400 mx-auto mb-6" />
                        <h2 className="text-2xl font-semibold mb-4">No tenés pedidos aún</h2>
                        <p className="text-gray-600 mb-8">
                            Cuando realices tu primera compra, podrás seguir el estado de tus pedidos aquí.
                        </p>
                        <Link href="/products">
                            <Button className="border-2 border-black">Explorar productos</Button>
                        </Link>
                    </div>

                    <div className="flex space-x-2 items-center justify-center mt-8 hover:text-lg transition-all overflow-hidden h-8">
                        <Undo2 />
                        <Link href="/products">Volver a la tienda</Link>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="py-12">
            <div className="max-w-4xl mx-auto px-4">
                <h1 className="text-5xl font-extrabold text-center mb-8">Mis Pedidos</h1>

                <div className="space-y-6">
                    {orders.map((order) => {
                        const StatusIcon = statusConfig[order.status]?.icon || Package;

                        return (
                            <Card key={order.id} className="border-2 transition-all duration-300 hover:shadow-lg">
                                <CardHeader className="pb-4">
                                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                                        <div>
                                            <CardTitle className="text-xl">Pedido #{order.id}</CardTitle>
                                            <div className="flex items-center gap-2 text-sm text-gray-600 mt-1">
                                                <Calendar className="w-4 h-4" />
                                                {formatDate(order.createdAt)}
                                            </div>
                                        </div>
                                        <div className="flex flex-col sm:items-end gap-2">
                                            <Badge className={statusConfig[order.status]?.color}>
                                                <StatusIcon className="w-3 h-3 mr-1" />
                                                {statusConfig[order.status]?.label}
                                            </Badge>
                                            <div className="flex items-center gap-1 text-lg font-semibold">
                                                <CreditCard className="w-4 h-4" />
                                                {formatPrice(
                                                    order.cartItems.reduce(
                                                        (sum, item) => sum + item.product.price * item.quantity,
                                                        0,
                                                    ),
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </CardHeader>

                                <div
                                    className={`overflow-hidden transition-all duration-500 ease-out ${
                                        expandedOrders.has(order.id)
                                            ? 'max-h-[2000px] opacity-100 transform translate-y-0'
                                            : 'max-h-0 opacity-0 transform -translate-y-2'
                                    }`}
                                >
                                    <CardContent className="space-y-6 pb-0">
                                        {/* Order Items */}
                                        <div className="animate-in slide-in-from-top-3 duration-300">
                                            <h3 className="font-medium mb-3">Productos</h3>
                                            <div className="space-y-3">
                                                {order.cartItems.map((item) => (
                                                    <div
                                                        key={item.id}
                                                        className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg"
                                                    >
                                                        <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center overflow-hidden">
                                                            {item.product.image ? (
                                                                <ProductImage
                                                                    image={item.product.image}
                                                                    name={item.product.name}
                                                                    width={64}
                                                                    height={64}
                                                                    className="object-cover"
                                                                />
                                                            ) : (
                                                                <Package className="w-6 h-6 text-gray-400" />
                                                            )}
                                                        </div>
                                                        <div className="flex-1">
                                                            <h4 className="font-medium">{item.product.name}</h4>
                                                            <p className="text-sm text-gray-600">
                                                                Código: {item.product.code}
                                                            </p>
                                                            <p className="text-sm text-gray-600">
                                                                Cantidad: {item.quantity} ×{' '}
                                                                {formatPrice(item.product.price)}
                                                            </p>
                                                        </div>
                                                        <div className="text-right">
                                                            <p className="font-medium">
                                                                {formatPrice(item.product.price * item.quantity)}
                                                            </p>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Shipping Information */}
                                        <div className="grid md:grid-cols-2 gap-6 animate-in slide-in-from-top-3 duration-300 delay-75">
                                            <div>
                                                <h3 className="font-medium mb-3 flex items-center gap-2">
                                                    <MapPin className="w-4 h-4" />
                                                    Dirección de Envío
                                                </h3>
                                                <div className="text-sm text-gray-600 space-y-1">
                                                    <div className="flex items-center gap-2">
                                                        <User className="w-3 h-3" />
                                                        {order.deliveryInfo.firstName} {order.deliveryInfo.lastName}
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <MapPin className="w-3 h-3" />
                                                        {order.deliveryInfo.address}, ({order.deliveryInfo.postalCode}){' '}
                                                        {order.deliveryInfo.city}
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <Phone className="w-3 h-3" />
                                                        {order.deliveryInfo.phone}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Tracking Information */}
                                        {/* {(order.trackingNumber || order.estimatedDelivery) && (
                                            <div>
                                                <h3 className="font-medium mb-3 flex items-center gap-2">
                                                    <Truck className="w-4 h-4" />
                                                    Información de Envío
                                                </h3>
                                                <div className="text-sm text-gray-600 space-y-1">
                                                    {order.trackingNumber && (
                                                        <p>
                                                            <span className="font-medium">Código de seguimiento:</span>{' '}
                                                            {order.trackingNumber}
                                                        </p>
                                                    )}
                                                    {order.estimatedDelivery && (
                                                        <p>
                                                            <span className="font-medium">Entrega estimada:</span>{' '}
                                                            {formatDate(order.estimatedDelivery)}
                                                        </p>
                                                    )}
                                                </div>
                                            </div>
                                        )} */}
                                        {/* </div> */}

                                        {/* Action Buttons */}
                                        <div className="flex gap-3 pt-4 border-t animate-in slide-in-from-top-3 duration-300 delay-150">
                                            {/* {order.trackingNumber && (
                                            <Button variant="outline" size="sm" className="border-2 border-black">
                                                <Truck className="w-4 h-4 mr-2" />
                                                Rastrear pedido
                                            </Button>
                                        )} */}
                                            {order.status === OrderStatus.PROCESSING && (
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    className="border-2 border-red-500 text-red-600 hover:bg-red-50"
                                                >
                                                    <XCircle className="w-4 h-4 mr-2" />
                                                    Cancelar pedido
                                                </Button>
                                            )}
                                        </div>
                                    </CardContent>
                                </div>

                                <div className="px-6 pb-6">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="border-2 border-black w-full transition-all duration-200"
                                        onClick={() => toggleOrderDetails(order.id)}
                                    >
                                        <div className="flex items-center justify-center transition-all duration-200">
                                            {!expandedOrders.has(order.id) ? (
                                                <>
                                                    <ChevronDown className="w-4 h-4 mr-2 transition-transform duration-200" />
                                                    Ver detalles
                                                </>
                                            ) : (
                                                <>
                                                    <ChevronUp className="w-4 h-4 mr-2 transition-transform duration-200" />
                                                    Ocultar detalles
                                                </>
                                            )}
                                        </div>
                                    </Button>
                                </div>
                            </Card>
                        );
                    })}
                </div>

                <div className="flex space-x-2 items-center justify-center mt-12 hover:text-lg transition-all overflow-hidden h-8">
                    <Undo2 />
                    <Link href="/products">Volver a la tienda</Link>
                </div>
            </div>
        </div>
    );
}
