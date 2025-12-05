'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { z } from 'zod';
import { Checkbox } from '../../components/ui/checkbox';
import { CheckCircle, TriangleAlert, Undo2 } from 'lucide-react';
import Link from 'next/link';
import { useAuth } from '@/context/auth-provider';
import { useEffect, useState } from 'react';
import { useCart } from '@/context/cart-context';

const formSchema = z.object({
    email: z.email({ message: 'Correo electrónico inválido' }),
    newsletter: z.boolean(),
    firstName: z.string().min(2, { message: 'Nombre demasiado corto' }).max(100),
    lastName: z.string().min(2, { message: 'Apellido demasiado corto' }).max(100),
    address: z.string().min(5, { message: 'Dirección demasiado corta' }).max(200),
    address2: z.string().optional(),
    postalCode: z.string().min(4, { message: 'Código postal inválido' }).max(10),
    city: z.string().min(2, { message: 'Ciudad demasiado corta' }).max(100),
    province: z.string().min(2, { message: 'Ingrese provincia' }).max(100),
    phone: z.string().min(6, { message: 'Teléfono inválido' }).max(15),
});

export default function CheckoutForm({ onSubmitSuccess }: { onSubmitSuccess?: () => void }) {
    const auth = useAuth();
    const user = auth?.user;
    const cart = useCart();

    // State for form submission
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitSuccess, setSubmitSuccess] = useState(false);
    const [submitError, setSubmitError] = useState<string | null>(null);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: '',
            newsletter: true,
            firstName: '',
            lastName: '',
            address: '',
            address2: '',
            postalCode: '',
            city: '',
            province: '',
            phone: '',
        },
    });

    useEffect(() => {
        if (user) {
            form.reset({
                ...form.getValues(),
                email: user.email || '',
                firstName: user.firstName || '',
                lastName: user.lastName || '',
                address: user.address || '',
                address2: user.address2 || '',
                postalCode: user.postalCode || '',
                city: user.city || '',
                province: user.province || '',
                phone: user.phone || '',
                newsletter: true,
            });
        }
    }, [user, form]);

    const handleSubmit = async (data: z.infer<typeof formSchema>) => {
        setIsSubmitting(true);
        setSubmitError(null);
        setSubmitSuccess(false);

        try {
            const { newsletter, ...deliveryInfo } = data;
            const payload = {
                newsletter,
                deliveryInfo,
                items: cart?.cart.map(({ id, quantity }) => ({ id, quantity })),
            };

            await cart?.finish(payload);
            setSubmitSuccess(true);
            form.reset();

            // Call the parent callback if provided
            if (onSubmitSuccess) {
                onSubmitSuccess();
            }
        } catch (error) {
            console.error('Checkout error:', error);
            setSubmitError(
                error instanceof Error
                    ? error.message
                    : 'Hubo un error al procesar tu pedido. Por favor, intentá nuevamente.',
            );
        } finally {
            setIsSubmitting(false);
        }
    };

    // Success view
    if (submitSuccess) {
        return (
            <div className="py-12">
                <div className="max-w-2xl mx-auto text-center">
                    <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-6" />
                    <h1 className="text-4xl font-extrabold mb-4">¡Pedido Confirmado!</h1>
                    <p className="text-gray-600 mb-8">
                        Tu pedido ha sido procesado exitosamente. Recibirás un email de confirmación con los detalles de
                        tu compra y el seguimiento del envío.
                    </p>
                    <div className="flex gap-4 justify-center">
                        <Link href="/orders">
                            <Button className="border-2 border-black">Ver mis pedidos</Button>
                        </Link>
                        <Link href="/products">
                            <Button variant="outline" className="border-2 border-black">
                                Seguir comprando
                            </Button>
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
                {submitError && (
                    <div className="text-red-700 p-4 rounded-lg bg-red-50 flex gap-4 text-sm items-center">
                        <TriangleAlert className="w-5 h-5" />
                        {submitError}
                    </div>
                )}

                <h2 className="text-2xl font-semibold">Contacto</h2>
                <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Correo electrónico</FormLabel>
                            <FormControl>
                                <Input className="h-12" type="email" placeholder="Correo electrónico" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="newsletter"
                    render={({ field }) => (
                        <FormItem className="flex flex-row items-center gap-2">
                            <FormControl>
                                <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                            </FormControl>
                            <FormLabel>Enviarme novedades y ofertas por correo electrónico</FormLabel>
                        </FormItem>
                    )}
                />

                <div className="flex flex-col gap-4 mt-10">
                    <h2 className="text-xl font-semibold">Entrega</h2>
                    <div className="flex items-center gap-4">
                        <FormField
                            control={form.control}
                            name="firstName"
                            render={({ field }) => (
                                <FormItem className="w-full">
                                    <FormLabel>Nombre</FormLabel>
                                    <FormControl>
                                        <Input className="h-12" type="text" placeholder="Nombre" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="lastName"
                            render={({ field }) => (
                                <FormItem className="w-full">
                                    <FormLabel>Apellido</FormLabel>
                                    <FormControl>
                                        <Input className="h-12" type="text" placeholder="Apellido" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>

                    <FormField
                        control={form.control}
                        name="address"
                        render={({ field }) => (
                            <FormItem className="w-full">
                                <FormLabel>Dirección</FormLabel>
                                <FormControl>
                                    <Input
                                        className="h-12"
                                        type="text"
                                        placeholder="Dirección (calle y altura)"
                                        {...field}
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
                            <FormItem className="w-full">
                                <FormLabel>Dirección 2</FormLabel>
                                <FormControl>
                                    <Input
                                        className="h-12"
                                        type="text"
                                        placeholder="Casa, piso, depto, etc. (opcional)"
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <div className="flex items-center gap-4">
                        <FormField
                            control={form.control}
                            name="postalCode"
                            render={({ field }) => (
                                <FormItem className="w-full">
                                    <FormLabel>Código postal</FormLabel>
                                    <FormControl>
                                        <Input className="h-12" type="text" placeholder="Código postal" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="city"
                            render={({ field }) => (
                                <FormItem className="w-full">
                                    <FormLabel>Ciudad</FormLabel>
                                    <FormControl>
                                        <Input className="h-12" type="text" placeholder="Ciudad" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="province"
                            render={({ field }) => (
                                <FormItem className="w-full">
                                    <FormLabel>Provincia</FormLabel>
                                    <FormControl>
                                        <Input className="h-12" type="text" placeholder="Provincia" {...field} />
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
                            <FormItem className="w-full">
                                <FormLabel>Teléfono</FormLabel>
                                <FormControl>
                                    <Input className="h-12" type="text" placeholder="Teléfono" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                <div className="flex flex-col gap-4">
                    <Button className="h-13 text-md mt-6 w-full" type="submit" disabled={isSubmitting}>
                        {isSubmitting ? 'Procesando pedido...' : 'Finalizar pedido'}
                    </Button>
                    <Link href="/products" className="flex items-center justify-center gap-4 hover:underline text-sm">
                        <Undo2 /> Seguir comprando
                    </Link>
                </div>
            </form>
        </Form>
    );
}
