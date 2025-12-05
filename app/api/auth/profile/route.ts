import { withAuth } from '@/lib/auth-api-handler';

export const PUT = withAuth(async ({ client, request }) => {
    try {
        const body = await request.json();

        const updatedUser = await client.put('auth/profile', body);

        return Response.json(updatedUser);
    } catch (error: unknown) {
        console.log('Error al actualizar datos', error);
        return Response.json({ error: 'Error al actualizar datos' }, { status: 401 });
    }
});
