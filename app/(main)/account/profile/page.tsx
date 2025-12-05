'use client';

import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { CheckCircle, TriangleAlert, Undo2, User, Mail, Phone, MapPin, Lock } from 'lucide-react';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useAuth } from '@/context/auth-provider';
import api from '@/lib/api';

const profileSchema = z.object({
    firstName: z.string().min(2, { message: 'Nombre demasiado corto' }).max(50, { message: 'Nombre demasiado largo' }),
    lastName: z
        .string()
        .min(2, { message: 'Apellido demasiado corto' })
        .max(50, { message: 'Apellido demasiado largo' }),
    phone: z
        .string()
        .min(6, { message: 'Teléfono inválido' })
        .max(15, { message: 'Teléfono demasiado largo' })
        .optional()
        .or(z.literal('')),
    address: z.string().max(200, { message: 'Dirección demasiado larga' }).optional().or(z.literal('')),
    address2: z.string().max(200, { message: 'Dirección secundaria demasiado larga' }).optional().or(z.literal('')),
    postalCode: z.string().max(10, { message: 'Código postal demasiado largo' }).optional().or(z.literal('')),
    city: z.string().max(100, { message: 'Ciudad demasiado larga' }).optional().or(z.literal('')),
    province: z.string().max(100, { message: 'Provincia demasiado larga' }).optional().or(z.literal('')),
});

type ProfileFormInputs = z.infer<typeof profileSchema>;

export default function AccountProfile() {
    const auth = useAuth();
    const user = auth?.user;

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitSuccess, setSubmitSuccess] = useState(false);
    const [submitError, setSubmitError] = useState<string | null>(null);

    const form = useForm<ProfileFormInputs>({
        resolver: zodResolver(profileSchema),
        defaultValues: {
            firstName: '',
            lastName: '',
            phone: '',
            address: '',
            address2: '',
            postalCode: '',
            city: '',
            province: '',
        },
    });

    // Load user data when component mounts or user changes
    useEffect(() => {
        if (user) {
            form.reset({
                firstName: user.firstName || '',
                lastName: user.lastName || '',
                phone: user.phone || '',
                address: user.address || '',
                address2: user.address2 || '',
                postalCode: user.postalCode || '',
                city: user.city || '',
                province: user.province || '',
            });
        }
    }, [user, form]);

    const onSubmit = async (data: ProfileFormInputs) => {
        setIsSubmitting(true);
        setSubmitError(null);
        setSubmitSuccess(false);

        try {
            // Update user profile via API
            await api.auth.updateProfile(data);

            setSubmitSuccess(true);

            // Optionally refetch user data to update the context
            // auth?.refetch();

            // Hide success message after 3 seconds
            setTimeout(() => {
                setSubmitSuccess(false);
            }, 3000);
        } catch (error: unknown) {
            console.error('Profile update error:', error);
            const errorObj = error as { response?: { data?: { message?: string } }; message?: string };

            setSubmitError(
                errorObj?.response?.data?.message ||
                    errorObj?.message ||
                    'Error al actualizar el perfil. Intente nuevamente.',
            );
        } finally {
            setIsSubmitting(false);
        }
    };

    // Show loading state while user data is being fetched
    if (auth?.loading) {
        return (
            <div className="py-12">
                <div className="max-w-4xl mx-auto px-4 text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
                    <p className="mt-4 text-gray-600">Cargando perfil...</p>
                </div>
            </div>
        );
    }

    // Redirect if not authenticated
    if (!auth?.isAuthenticated || !user) {
        return (
            <div className="py-12">
                <div className="max-w-4xl mx-auto px-4 text-center">
                    <h1 className="text-5xl font-extrabold mb-8">Acceso Requerido</h1>
                    <p className="text-gray-600 mb-8">Necesitas iniciar sesión para ver tu perfil.</p>
                    <Link href="/login">
                        <Button className="border-2 border-black">Iniciar Sesión</Button>
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="py-12">
            <div className="max-w-4xl mx-auto px-4">
                <h1 className="text-5xl font-extrabold text-center mb-8">Mi Perfil</h1>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* User Info Card */}
                    <div className="lg:col-span-1">
                        <div className="bg-gray-50 rounded-lg p-6 space-y-4">
                            <div className="text-center">
                                <div className="w-20 h-20 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
                                    <User className="w-10 h-10 text-white" />
                                </div>
                                <h2 className="text-xl font-semibold">
                                    {user.firstName} {user.lastName}
                                </h2>
                            </div>

                            <div className="space-y-3">
                                <div className="flex items-center gap-3 text-sm">
                                    <Mail className="w-4 h-4 text-gray-500" />
                                    <span className="text-gray-600">{user.email}</span>
                                </div>

                                {user.phone && (
                                    <div className="flex items-center gap-3 text-sm">
                                        <Phone className="w-4 h-4 text-gray-500" />
                                        <span className="text-gray-600">{user.phone}</span>
                                    </div>
                                )}

                                {user.address && (
                                    <div className="flex items-center gap-3 text-sm">
                                        <MapPin className="w-4 h-4 text-gray-500" />
                                        <span className="text-gray-600">
                                            {user.address}
                                            {user.city && `, ${user.city}`}
                                        </span>
                                    </div>
                                )}
                            </div>

                            <div className="pt-4 border-t">
                                <Button
                                    variant="outline"
                                    className="w-full border-2 border-black"
                                    onClick={() => auth?.forgotPassword.mutate()}
                                >
                                    <Lock className="w-4 h-4 mr-2" />

                                    {auth.forgotPassword.isPending ? 'Enviando...' : 'Cambiar Contraseña'}
                                </Button>
                            </div>
                        </div>
                        {auth.forgotPassword.isSuccess && (
                            <div className="text-green-700 p-4 rounded-lg bg-green-50 flex gap-4 text-sm items-center mt-2">
                                <CheckCircle className="size-12" />
                                Se ha enviado un enlace de restablecimiento de contraseña a tu correo electrónico.
                            </div>
                        )}
                    </div>

                    {/* Profile Form */}
                    <div className="lg:col-span-2">
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                                {submitSuccess && (
                                    <div className="text-green-700 p-4 rounded-lg bg-green-50 flex gap-4 text-sm items-center">
                                        <CheckCircle className="w-5 h-5" />
                                        Perfil actualizado correctamente
                                    </div>
                                )}

                                {submitError && (
                                    <div className="text-red-700 p-4 rounded-lg bg-red-50 flex gap-4 text-sm items-center">
                                        <TriangleAlert className="w-5 h-5" />
                                        {submitError}
                                    </div>
                                )}

                                {/* Personal Information */}
                                <div className="space-y-4">
                                    <h3 className="text-lg font-semibold border-b pb-2">Información Personal</h3>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <FormField
                                            control={form.control}
                                            name="firstName"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Nombre *</FormLabel>
                                                    <FormControl>
                                                        <Input
                                                            {...field}
                                                            placeholder="Tu nombre"
                                                            className="h-12 p-6"
                                                            disabled={isSubmitting}
                                                        />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />

                                        <FormField
                                            control={form.control}
                                            name="lastName"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Apellido *</FormLabel>
                                                    <FormControl>
                                                        <Input
                                                            {...field}
                                                            placeholder="Tu apellido"
                                                            className="h-12 p-6"
                                                            disabled={isSubmitting}
                                                        />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </div>

                                    <FormField
                                        control={form.control}
                                        name="phone"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Teléfono</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        {...field}
                                                        type="tel"
                                                        placeholder="Tu número de teléfono"
                                                        className="h-12 p-6"
                                                        disabled={isSubmitting}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>

                                {/* Email (Read-only) */}
                                <div className="space-y-4">
                                    <h3 className="text-lg font-semibold border-b pb-2">Correo Electrónico</h3>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Correo Electrónico
                                        </label>
                                        <Input
                                            value={user.email}
                                            disabled
                                            className="h-12 p-6 bg-gray-100 text-gray-500"
                                        />
                                        <p className="text-xs text-gray-500 mt-1">
                                            El correo electrónico no se puede modificar
                                        </p>
                                    </div>
                                </div>

                                {/* Address Information */}
                                <div className="space-y-4">
                                    <h3 className="text-lg font-semibold border-b pb-2">Información de Dirección</h3>

                                    <FormField
                                        control={form.control}
                                        name="address"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Dirección</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        {...field}
                                                        placeholder="Calle, número, piso, departamento"
                                                        className="h-12 p-6"
                                                        disabled={isSubmitting}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name="address2"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Dirección 2 (Opcional)</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        {...field}
                                                        placeholder="Información adicional de dirección"
                                                        className="h-12 p-6"
                                                        disabled={isSubmitting}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        <FormField
                                            control={form.control}
                                            name="postalCode"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Código Postal</FormLabel>
                                                    <FormControl>
                                                        <Input
                                                            {...field}
                                                            placeholder="1234"
                                                            className="h-12 p-6"
                                                            disabled={isSubmitting}
                                                        />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />

                                        <FormField
                                            control={form.control}
                                            name="city"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Ciudad</FormLabel>
                                                    <FormControl>
                                                        <Input
                                                            {...field}
                                                            placeholder="Tu ciudad"
                                                            className="h-12 p-6"
                                                            disabled={isSubmitting}
                                                        />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />

                                        <FormField
                                            control={form.control}
                                            name="province"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Provincia</FormLabel>
                                                    <FormControl>
                                                        <Input
                                                            {...field}
                                                            placeholder="Tu provincia"
                                                            className="h-12 p-6"
                                                            disabled={isSubmitting}
                                                        />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </div>
                                </div>

                                {/* Submit Button */}
                                <div className="flex gap-4 pt-6">
                                    <Button type="submit" className="border-2 border-black" disabled={isSubmitting}>
                                        {isSubmitting ? 'Guardando...' : 'Guardar Cambios'}
                                    </Button>

                                    <Link href="/orders">
                                        <Button variant="outline" className="border-2 border-black">
                                            Ver Mis Pedidos
                                        </Button>
                                    </Link>
                                </div>
                            </form>
                        </Form>
                    </div>
                </div>

                <div className="flex space-x-2 items-center justify-center mt-12 hover:text-lg transition-all overflow-hidden h-8">
                    <Undo2 />
                    <Link href="/products">Volver a la tienda</Link>
                </div>
            </div>
        </div>
    );
}
