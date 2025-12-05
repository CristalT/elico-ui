import { withAuth } from '@/lib/auth-api-handler';
import { cookies } from 'next/headers';

export const GET = withAuth(
    async ({ client }) => {
        const cookieStore = await cookies();

        if (!cookieStore.has('token')) {
            return Response.json(null);
        }
        const user = await client.get('/auth/me');
        return Response.json(user);
    },
    { guest: true },
);
