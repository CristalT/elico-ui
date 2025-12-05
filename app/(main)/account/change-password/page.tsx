'use client';

import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { CheckCircle, TriangleAlert, Undo2, Lock, Eye, EyeOff } from 'lucide-react';
import { useState } from 'react';
import Link from 'next/link';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useAuth } from '@/context/auth-provider';
import api from '@/lib/api';

const changePasswordSchema = z
    .object({
        currentPassword: z.string().min(1, { message: 'Contraseña actual requerida' }),
        newPassword: z
            .string()
            .min(8, { message: 'La nueva contraseña debe tener al menos 8 caracteres' })
            .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, {
                message: 'La contraseña debe contener al menos una mayúscula, una minúscula y un número',
            }),
        confirmPassword: z.string(),
    })
    .refine((data) => data.newPassword === data.confirmPassword, {
        message: 'Las contraseñas no coinciden',
        path: ['confirmPassword'],
    });

type ChangePasswordFormInputs = z.infer<typeof changePasswordSchema>;

export default function ChangePassword() {
    const auth = useAuth();
    const user = auth?.user;

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitSuccess, setSubmitSuccess] = useState(false);
    const [submitError, setSubmitError] = useState<string | null>(null);
    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const form = useForm<ChangePasswordFormInputs>({
        resolver: zodResolver(changePasswordSchema),
        defaultValues: {
            currentPassword: '',
            newPassword: '',
            confirmPassword: '',
        },
    });

    const onSubmit = async (data: ChangePasswordFormInputs) => {
        setIsSubmitting(true);
        setSubmitError(null);
        setSubmitSuccess(false);

        try {
            await api.auth.changePassword({
                currentPassword: data.currentPassword,
                newPassword: data.newPassword,
            });

            setSubmitSuccess(true);
            form.reset();

            // Hide success message after 5 seconds
            setTimeout(() => {
                setSubmitSuccess(false);
            }, 5000);
        } catch (error: unknown) {
            console.error('Change password error:', error);
            const errorObj = error as { response?: { data?: { message?: string } }; message?: string };

            setSubmitError(
                errorObj?.response?.data?.message ||
                    errorObj?.message ||
                    'Error al cambiar la contraseña. Intente nuevamente.',
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
                    <p className="mt-4 text-gray-600">Cargando...</p>
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
                    <p className="text-gray-600 mb-8">Necesitas iniciar sesión para cambiar tu contraseña.</p>
                    <Link href="/login">
                        <Button className="border-2 border-black">Iniciar Sesión</Button>
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="py-12">
            <div className="max-w-2xl mx-auto px-4">
                <h1 className="text-5xl font-extrabold text-center mb-8">Cambiar Contraseña</h1>

                <div className="bg-white rounded-lg border-2 border-gray-200 p-8">
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                            {submitSuccess && (
                                <div className="text-green-700 p-4 rounded-lg bg-green-50 flex gap-4 text-sm items-center">
                                    <CheckCircle className="w-5 h-5" />
                                    Contraseña cambiada correctamente
                                </div>
                            )}

                            {submitError && (
                                <div className="text-red-700 p-4 rounded-lg bg-red-50 flex gap-4 text-sm items-center">
                                    <TriangleAlert className="w-5 h-5" />
                                    {submitError}
                                </div>
                            )}

                            <div className="space-y-4">
                                <div className="text-center mb-6">
                                    <Lock className="w-12 h-12 text-primary mx-auto mb-4" />
                                    <p className="text-gray-600">
                                        Para tu seguridad, necesitamos verificar tu contraseña actual antes de
                                        cambiarla.
                                    </p>
                                </div>

                                <FormField
                                    control={form.control}
                                    name="currentPassword"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Contraseña Actual *</FormLabel>
                                            <FormControl>
                                                <div className="relative">
                                                    <Input
                                                        {...field}
                                                        type={showCurrentPassword ? 'text' : 'password'}
                                                        placeholder="Tu contraseña actual"
                                                        className="h-12 p-6 pr-12"
                                                        disabled={isSubmitting}
                                                        autoComplete="current-password"
                                                    />
                                                    <button
                                                        type="button"
                                                        className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                                                        onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                                                    >
                                                        {showCurrentPassword ? (
                                                            <EyeOff className="w-5 h-5" />
                                                        ) : (
                                                            <Eye className="w-5 h-5" />
                                                        )}
                                                    </button>
                                                </div>
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="newPassword"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Nueva Contraseña *</FormLabel>
                                            <FormControl>
                                                <div className="relative">
                                                    <Input
                                                        {...field}
                                                        type={showNewPassword ? 'text' : 'password'}
                                                        placeholder="Tu nueva contraseña"
                                                        className="h-12 p-6 pr-12"
                                                        disabled={isSubmitting}
                                                        autoComplete="new-password"
                                                    />
                                                    <button
                                                        type="button"
                                                        className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                                                        onClick={() => setShowNewPassword(!showNewPassword)}
                                                    >
                                                        {showNewPassword ? (
                                                            <EyeOff className="w-5 h-5" />
                                                        ) : (
                                                            <Eye className="w-5 h-5" />
                                                        )}
                                                    </button>
                                                </div>
                                            </FormControl>
                                            <FormMessage />
                                            <p className="text-xs text-gray-500 mt-1">
                                                Mínimo 8 caracteres, debe incluir mayúscula, minúscula y número
                                            </p>
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="confirmPassword"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Confirmar Nueva Contraseña *</FormLabel>
                                            <FormControl>
                                                <div className="relative">
                                                    <Input
                                                        {...field}
                                                        type={showConfirmPassword ? 'text' : 'password'}
                                                        placeholder="Confirma tu nueva contraseña"
                                                        className="h-12 p-6 pr-12"
                                                        disabled={isSubmitting}
                                                        autoComplete="new-password"
                                                    />
                                                    <button
                                                        type="button"
                                                        className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                                    >
                                                        {showConfirmPassword ? (
                                                            <EyeOff className="w-5 h-5" />
                                                        ) : (
                                                            <Eye className="w-5 h-5" />
                                                        )}
                                                    </button>
                                                </div>
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            <div className="flex gap-4 pt-6">
                                <Button type="submit" className="border-2 border-black" disabled={isSubmitting}>
                                    {isSubmitting ? 'Cambiando...' : 'Cambiar Contraseña'}
                                </Button>

                                <Link href="/account/profile">
                                    <Button variant="outline" className="border-2 border-black">
                                        Cancelar
                                    </Button>
                                </Link>
                            </div>
                        </form>
                    </Form>
                </div>

                <div className="flex space-x-2 items-center justify-center mt-8 hover:text-lg transition-all overflow-hidden h-8">
                    <Undo2 />
                    <Link href="/account/profile">Volver al perfil</Link>
                </div>
            </div>
        </div>
    );
}
