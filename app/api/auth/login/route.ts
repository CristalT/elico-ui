import { TokenResponse } from '@/lib/api/auth';
import { withAuth } from '@/lib/auth-api-handler';
import { cookies } from 'next/headers';

export const POST = withAuth(
    async ({ client, request }) => {
        const cookieStore = await cookies();
        const body = await request.json();

        try {
            const response = await client.post<{ email: string; password: string }, TokenResponse>('auth/login', body);
            const { token, user } = response;
            cookieStore.delete('token');
            cookieStore.set('token', token.token);
            return Response.json(user);
        } catch (error) {
            console.log('Login error', error);
            return Response.json({ error: 'Login failed' }, { status: 401 });
        }
    },
    { guest: true },
);
