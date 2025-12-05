'use client';

import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { CheckCircle, TriangleAlert, Undo2 } from 'lucide-react';
import { useState } from 'react';
import Link from 'next/link';

import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import api from '@/lib/api';

const createAccountSchema = z
    .object({
        firstName: z
            .string()
            .min(2, { message: 'Nombre demasiado corto' })
            .max(50, { message: 'Nombre demasiado largo' }),
        lastName: z
            .string()
            .min(2, { message: 'Apellido demasiado corto' })
            .max(50, { message: 'Apellido demasiado largo' }),
        email: z.string().email({ message: 'Correo electrónico inválido' }),
        password: z
            .string()
            .min(8, { message: 'La contraseña debe tener al menos 8 caracteres' })
            .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, {
                message: 'La contraseña debe contener al menos una mayúscula, una minúscula y un número',
            }),
        confirmPassword: z.string(),
        acceptTerms: z.boolean().refine((value) => value === true, {
            message: 'Debes aceptar los términos y condiciones',
        }),
    })
    .refine((data) => data.password === data.confirmPassword, {
        message: 'Las contraseñas no coinciden',
        path: ['confirmPassword'],
    });

type CreateAccountInputs = z.infer<typeof createAccountSchema>;

export default function CreateAccount() {
    const form = useForm<CreateAccountInputs>({
        resolver: zodResolver(createAccountSchema),
        defaultValues: {
            firstName: '',
            lastName: '',
            email: '',
            password: '',
            confirmPassword: '',
            acceptTerms: false,
        },
    });

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitSuccess, setSubmitSuccess] = useState(false);
    const [submitError, setSubmitError] = useState<string | null>(null);

    const onSubmit = async (data: CreateAccountInputs) => {
        setIsSubmitting(true);
        setSubmitError(null);
        setSubmitSuccess(false);

        try {
            await api.auth.createAccount({
                firstName: data.firstName,
                lastName: data.lastName,
                email: data.email,
                password: data.password,
                passwordConfirmation: data.confirmPassword,
            });

            setSubmitSuccess(true);
            form.reset();
        } catch (error) {
            console.log(error);
            setSubmitError('Hubo un error al crear la cuenta. Por favor, intentá nuevamente.');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (submitSuccess) {
        return (
            <div className="py-12">
                <div className="max-w-2xl mx-auto text-center">
                    <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-6" />
                    <h1 className="text-4xl font-extrabold mb-4">¡Cuenta Creada!</h1>
                    <p className="text-gray-600 mb-8">
                        Tu cuenta ha sido creada exitosamente. Ya podés iniciar sesión con tu correo electrónico y
                        contraseña.
                    </p>
                    <div className="flex gap-4 justify-center">
                        <Link href="/login">
                            <Button className="border-2 border-black">Iniciar Sesión</Button>
                        </Link>
                        <Link href="/products">
                            <Button variant="outline" className="border-2 border-black">
                                Volver a la tienda
                            </Button>
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="py-12">
            <h1 className="text-center text-5xl font-extrabold mb-8">Crear Cuenta</h1>

            <div className="max-w-2xl mx-auto">
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        {submitError && (
                            <div className="text-red-700 p-4 rounded-lg bg-red-50 flex gap-4 text-sm items-center">
                                <TriangleAlert className="w-5 h-5" />
                                {submitError}
                            </div>
                        )}

                        <div className="grid grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="firstName"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Nombre *</FormLabel>
                                        <FormControl>
                                            <Input {...field} placeholder="Tu nombre" className="h-12 p-6" />
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
                                            <Input {...field} placeholder="Tu apellido" className="h-12 p-6" />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Correo Electrónico *</FormLabel>
                                    <FormControl>
                                        <Input
                                            {...field}
                                            type="email"
                                            placeholder="tu@email.com"
                                            className="h-12 p-6"
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="password"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Contraseña *</FormLabel>
                                    <FormControl>
                                        <Input
                                            {...field}
                                            type="password"
                                            placeholder="Contraseña"
                                            className="h-12 p-6"
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="confirmPassword"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Confirmar Contraseña *</FormLabel>
                                    <FormControl>
                                        <Input
                                            {...field}
                                            type="password"
                                            placeholder="Confirmar contraseña"
                                            className="h-12 p-6"
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="acceptTerms"
                            render={({ field }) => (
                                <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                                    <FormControl>
                                        <input
                                            type="checkbox"
                                            checked={field.value}
                                            onChange={field.onChange}
                                            className="mt-1"
                                        />
                                    </FormControl>
                                    <div className="">
                                        <FormLabel className="text-sm font-normal">
                                            <span>
                                                Acepto los &nbsp;
                                                <Link href="/terms" className="text-primary underline">
                                                    términos y condiciones
                                                </Link>
                                                &nbsp;y la &nbsp;
                                                <Link href="/privacy" className="text-primary underline">
                                                    política de privacidad
                                                </Link>
                                            </span>
                                        </FormLabel>
                                        <FormMessage />
                                    </div>
                                </FormItem>
                            )}
                        />

                        <Button
                            type="submit"
                            size="lg"
                            className="w-full py-8 border-2 border-black"
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? 'Creando cuenta...' : 'Crear Cuenta'}
                        </Button>

                        <div className="text-center text-sm text-gray-600">
                            <span className="mr-2">¿Ya tenés una cuenta?</span>
                            <Link href="/login" className="text-primary underline">
                                Iniciar sesión
                            </Link>
                        </div>

                        <div className="flex space-x-2 items-center justify-center my-6 hover:text-lg transition-all overflow-hidden h-8">
                            <Undo2 />
                            <Link href="/products">Volver a la tienda</Link>
                        </div>
                    </form>
                </Form>
            </div>
        </div>
    );
}
