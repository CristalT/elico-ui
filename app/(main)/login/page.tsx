'use client';

import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { TriangleAlert, Undo2 } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuth } from '@/context/auth-provider';
import { useRouter } from 'next/navigation';

import Link from 'next/link';

const loginSchema = z.object({
    email: z.email({ message: 'Ingrese un correo electrónico válido' }),
    password: z.string().min(6, { message: 'La contraseña es incorrecta' }),
});

type LoginFormInputs = z.infer<typeof loginSchema>;

export default function Login() {
    const auth = useAuth();
    const router = useRouter();

    const form = useForm<LoginFormInputs>({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            email: '',
            password: '',
        },
    });

    const onSubmit = async (data: LoginFormInputs) => {
        auth?.login.mutateAsync(data).then(() => {
            router.push('/products');
        });
    };

    return (
        <div className="py-12">
            <h1 className="text-center text-5xl font-extrabold">Iniciar Sesión</h1>

            <div className="flex flex-col gap-8 max-w-md mx-auto mt-8">
                {auth?.login.isError && (
                    <div className="text-red-700 p-4 rounded-lg bg-red-50 flex gap-4 text-sm items-center">
                        <TriangleAlert />
                        {auth?.login.error?.message || 'Error inesperado. Intente nuevamente.'}
                    </div>
                )}

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Correo electrónico</FormLabel>
                                    <FormControl>
                                        <Input
                                            {...field}
                                            type="email"
                                            placeholder="tu@email.com"
                                            className="p-6"
                                            disabled={auth?.login.isPending}
                                            autoComplete="email"
                                            autoFocus
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
                                    <FormLabel>Contraseña</FormLabel>
                                    <FormControl>
                                        <Input
                                            {...field}
                                            type="password"
                                            placeholder="Tu contraseña"
                                            className="p-6"
                                            disabled={auth?.login.isPending}
                                            autoComplete="current-password"
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <div className="text-gray-600 hover:text-primary">
                            <Link href="/forgot-password" className="underline text-sm">
                                Olvidé mi contraseña
                            </Link>
                        </div>

                        <div className="flex items-center">
                            <Button
                                size="lg"
                                className="grow py-8 border-2 border-black"
                                type="submit"
                                disabled={auth?.login.isPending}
                            >
                                {auth?.login.isPending ? 'Ingresando...' : 'Ingresar'}
                            </Button>
                            <Link href="/account/create" className="grow ml-2">
                                <Button
                                    size="lg"
                                    variant="outline"
                                    className="py-8 w-full border-2 border-black"
                                    type="button"
                                    disabled={auth?.login.isPending}
                                >
                                    Crear cuenta
                                </Button>
                            </Link>
                        </div>
                    </form>
                </Form>

                <div className="flex space-x-2 items-center justify-center my-6 hover:text-lg transition-all overflow-hidden h-8">
                    <Undo2 />
                    <Link href="/products">Volver a la tienda</Link>
                </div>
            </div>
        </div>
    );
}
