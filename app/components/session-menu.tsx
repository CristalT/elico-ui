import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { LogIn, LogOut, Package, User, UserPen } from 'lucide-react';
import Link from 'next/link';
import { Button } from './ui/button';
import { useAuth } from '@/context/auth-provider';
import { useRouter } from 'next/navigation';

export default function UserMenu() {
    const auth = useAuth();
    const router = useRouter();

    const options = [
        {
            label: 'Perfil',
            icon: <UserPen className="w-6 h-6 text-gray-600" />,
            onClick: () => router.push('/account/profile'),
        },
        {
            label: 'Mis pedidos',
            icon: <Package className="w-6 h-6 text-gray-600" />,
            onClick: () => router.push('/orders'),
        },
        {
            label: 'Salir',
            icon: <LogOut className="w-6 h-6 text-gray-600" />,
            onClick: async () => {
                await auth?.logout.mutateAsync();
                window.location.reload();
            },
        },
    ];

    if (auth?.loading) {
        return <div>Loading...</div>;
    }

    if (auth?.isAuthenticated) {
        return (
            <div>
                {/* User menu options */}

                <DropdownMenu>
                    <DropdownMenuTrigger className="relative p-3 rounded-md hover:bg-gray-100">
                        <User className="size-6 cursor-pointer" />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                        <DropdownMenuLabel>
                            {auth?.user?.firstName} {auth?.user?.lastName}
                        </DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        {options.map((option) => (
                            <DropdownMenuItem key={option.label} className="cursor-pointer" onClick={option.onClick}>
                                {option.icon}
                                {option.label}
                            </DropdownMenuItem>
                        ))}
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        );
    } else {
        return (
            <div className="flex items-center gap-2">
                <Link href="/login" className="flex-1 cursor-pointer">
                    <Button variant="ghost" className="flex-1 cursor-pointer">
                        <LogIn />
                        Ingresar
                    </Button>
                </Link>
                <Link href="/account/create">
                    <Button variant="default" className="flex-1">
                        Crear cuenta
                    </Button>
                </Link>
            </div>
        );
    }
}
