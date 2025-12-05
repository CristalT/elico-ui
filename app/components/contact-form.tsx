'use client';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { CheckCircle, TriangleAlert } from 'lucide-react';
import { useState } from 'react';
import ReCAPTCHA from 'react-google-recaptcha';
import Link from 'next/link';

import { z } from 'zod';
import api from '@/lib/api';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

const contactFormSchema = z.object({
    recaptchaToken: z.string().min(1, { message: 'Por favor, completá el reCAPTCHA' }),
    name: z.string().min(2, { message: 'Nombre demasiado corto' }).max(50, { message: 'Nombre demasiado largo' }),
    email: z.string().email({ message: 'Correo electrónico inválido' }),
    phone: z.string().min(6, { message: 'Teléfono inválido' }).max(15, { message: 'Teléfono demasiado largo' }),
    subject: z.string().min(5, { message: 'Asunto demasiado corto' }).max(100, { message: 'Asunto demasiado largo' }),
    message: z
        .string()
        .min(10, { message: 'Mensaje demasiado corto' })
        .max(1000, { message: 'Mensaje demasiado largo' }),
});

type ContactFormInputs = z.infer<typeof contactFormSchema>;

export default function ContactForm() {
    const recaptchaSiteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY || '';

    if (!recaptchaSiteKey) {
        throw new Error('RECAPTCHA_SITE_KEY is not set');
    }

    const form = useForm<ContactFormInputs>({
        resolver: zodResolver(contactFormSchema),
        defaultValues: {
            recaptchaToken: '',
            name: '',
            email: '',
            phone: '',
            subject: '',
            message: '',
        },
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitSuccess, setSubmitSuccess] = useState(false);
    const [submitError, setSubmitError] = useState<string | null>(null);

    const handleRecaptchaChange = (token: string | null) => {
        if (token) {
            form.setValue('recaptchaToken', token);
        }
    };

    const onSubmit = async (data: ContactFormInputs) => {
        setIsSubmitting(true);
        setSubmitError(null);
        setSubmitSuccess(false);

        try {
            await api.contact.send(data);
            setSubmitSuccess(true);
            form.reset();
        } catch (error) {
            console.error('Contact form error:', error);
            setSubmitError('Hubo un error al enviar el mensaje. Por favor, intentá nuevamente.');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (submitSuccess) {
        return (
            <div className="py-12">
                <div className="max-w-2xl mx-auto text-center">
                    <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-6" />
                    <h1 className="text-4xl font-extrabold mb-4">¡Mensaje Enviado!</h1>
                    <p className="text-gray-600 mb-8">
                        Gracias por contactarnos. Hemos recibido tu mensaje y te responderemos dentro de las próximas 24
                        horas.
                    </p>
                    <div className="flex gap-4 justify-center">
                        <Button
                            onClick={() => setSubmitSuccess(false)}
                            variant="outline"
                            className="border-2 border-black"
                        >
                            Enviar otro mensaje
                        </Button>
                        <Link href="/products">
                            <Button className="border-2 border-black">Volver a la tienda</Button>
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    {submitError && (
                        <div className="text-red-700 p-4 rounded-lg bg-red-50 flex gap-4 text-sm items-center">
                            <TriangleAlert className="w-5 h-5" />
                            {submitError}
                        </div>
                    )}

                    <FormField
                        control={form.control}
                        name="name"
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
                        name="email"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Correo Electrónico *</FormLabel>
                                <FormControl>
                                    <Input {...field} type="email" placeholder="tu@email.com" className="h-12 p-6" />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="phone"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Teléfono *</FormLabel>
                                <FormControl>
                                    <Input {...field} type="tel" placeholder="+1 (555) 123-4567" className="h-12 p-6" />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="subject"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Asunto *</FormLabel>
                                <FormControl>
                                    <Input {...field} placeholder="¿En qué podemos ayudarte?" className="h-12 p-6" />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="message"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Mensaje *</FormLabel>
                                <FormControl>
                                    <Textarea
                                        {...field}
                                        placeholder="Tu mensaje aquí..."
                                        className="min-h-32 p-6"
                                        rows={6}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="recaptchaToken"
                        render={({ field }) => (
                            <FormItem>
                                <FormControl>
                                    <ReCAPTCHA
                                        {...field}
                                        sitekey={recaptchaSiteKey}
                                        className="flex justify-center"
                                        onChange={handleRecaptchaChange}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <Button
                        type="submit"
                        size="lg"
                        className="w-full py-8 border-2 border-primary"
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? 'Enviando...' : 'Enviar Mensaje'}
                    </Button>
                </form>
            </Form>
        </div>
    );
}
