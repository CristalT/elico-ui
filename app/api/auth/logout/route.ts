import { withAuth } from '@/lib/auth-api-handler';
import { cookies } from 'next/headers';

export const POST = withAuth(async ({ client }) => {
    const cookieStore = await cookies();

    client.post('auth/logout', {});
    cookieStore.delete('token');

    return Response.json({ message: 'Logged out successfully' });
});
