import { ReactNode } from 'react';
import Header from '@/components/header';

export default function MainLayout({ children }: Readonly<{ children: ReactNode }>) {
    return (
        <div className="bg-black min-h-screen">
            <Header />
            <main className="bg-white">
                <div className="max-w-7xl mx-auto pt-6 pb-20">{children}</div>
            </main>
            <footer className="bg-black text-white">
                <div className="max-w-7xl mx-auto px-4 py-12">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                        {/* Company info */}
                        <div>
                            <h3 className="text-lg font-bold mb-4">{process.env.NEXT_PUBLIC_COMPANY_NAME}</h3>
                            <p className="text-gray-400 text-sm">
                                La mejor experiencia de compra online con productos de calidad y envío rápido.
                            </p>
                        </div>

                        {/* Quick links */}
                        <div>
                            <h4 className="font-semibold mb-4">Enlaces rápidos</h4>
                            <ul className="space-y-2 text-sm text-gray-400">
                                <li>
                                    <a href="#" className="hover:text-white">
                                        Sobre nosotros
                                    </a>
                                </li>
                                <li>
                                    <a href="#" className="hover:text-white">
                                        Contacto
                                    </a>
                                </li>
                                <li>
                                    <a href="#" className="hover:text-white">
                                        FAQ
                                    </a>
                                </li>
                                <li>
                                    <a href="#" className="hover:text-white">
                                        Blog
                                    </a>
                                </li>
                            </ul>
                        </div>

                        {/* Customer service */}
                        <div>
                            <h4 className="font-semibold mb-4">Atención al cliente</h4>
                            <ul className="space-y-2 text-sm text-gray-400">
                                <li>
                                    <a href="#" className="hover:text-white">
                                        Centro de ayuda
                                    </a>
                                </li>
                                <li>
                                    <a href="#" className="hover:text-white">
                                        Devoluciones
                                    </a>
                                </li>
                                <li>
                                    <a href="#" className="hover:text-white">
                                        Envíos
                                    </a>
                                </li>
                                <li>
                                    <a href="#" className="hover:text-white">
                                        Garantías
                                    </a>
                                </li>
                            </ul>
                        </div>

                        {/* Legal */}
                        <div>
                            <h4 className="font-semibold mb-4">Legal</h4>
                            <ul className="space-y-2 text-sm text-gray-400">
                                <li>
                                    <a href="#" className="hover:text-white">
                                        Términos y condiciones
                                    </a>
                                </li>
                                <li>
                                    <a href="#" className="hover:text-white">
                                        Política de privacidad
                                    </a>
                                </li>
                                <li>
                                    <a href="#" className="hover:text-white">
                                        Cookies
                                    </a>
                                </li>
                            </ul>
                        </div>
                    </div>

                    <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm text-gray-400">
                        <p>&copy; 2025 Rey Castor. Todos los derechos reservados.</p>
                    </div>
                </div>
            </footer>
        </div>
    );
}
