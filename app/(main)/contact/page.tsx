import ContactInfoWithSSR from '@/components/contact-info-ssr';
import ContactForm from '@/components/contact-form';

export default async function Contact() {
    return (
        <div className="py-12">
            <h1 className="text-center text-5xl font-extrabold mb-12">Contacto</h1>

            <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 px-10">
                {/* Contact Form */}
                <ContactForm />

                {/* Contact Information with SSR */}
                <ContactInfoWithSSR />
            </div>
        </div>
    );
}
