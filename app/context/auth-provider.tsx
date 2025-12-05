'use client';
import api from '@/lib/api';
import { User } from '@/lib/api/auth';
import { useMutation, UseMutationResult, useQuery, useQueryClient } from '@tanstack/react-query';
import { useContext, createContext, useMemo } from 'react';

interface AuthContextType {
    user?: User;
    loading: boolean;
    isAuthenticated: boolean;
    login: UseMutationResult<User | { error: string }, Error, { email: string; password: string }, unknown>;
    logout: UseMutationResult<void, Error, void, unknown>;
    forgotPassword: UseMutationResult<User, Error, void, unknown>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export default function AuthProvider({ children }: { children: React.ReactNode }) {
    const queryClient = useQueryClient();
    const { data: user, isLoading: loading } = useQuery({
        queryKey: ['user'],
        queryFn: () => api.auth.me(),
    });

    // Calculate isAuthenticated based on user state and loading state
    const isAuthenticated = useMemo(() => !loading && user !== null, [loading, user]);

    const login = useMutation({
        mutationKey: ['login'],
        mutationFn: async (credentials: { email: string; password: string }) => {
            try {
                return await api.auth.login(credentials.email, credentials.password);
            } catch (error) {
                if (error instanceof Error && error.message === 'Unauthorized') {
                    throw Error('Ocurrió un error al iniciar sesión. Verificá tus credenciales e intentá nuevamente.');
                }
                throw error;
            }
        },
        onSuccess: (user) => {
            queryClient.setQueryData(['user'], user);
        },
    });

    const logout = useMutation({
        mutationKey: ['logout'],
        mutationFn: async () => {
            await api.auth.logout();
        },
        onSuccess: () => {
            queryClient.setQueryData(['user'], null);
        },
    });

    const forgotPassword = useMutation({
        mutationKey: ['forgot-password'],
        mutationFn: async () => {
            if (user?.email) {
                return await api.auth.forgotPassword(user.email);
            }

            throw new Error('No se pudo enviar el correo de restablecimiento de contraseña.');
        },
    });

    return (
        <AuthContext.Provider value={{ user, loading, isAuthenticated, login, logout, forgotPassword }}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => useContext(AuthContext);
