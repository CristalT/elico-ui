import { withAuth } from '@/lib/auth-api-handler';

export const POST = withAuth(async ({ client, request }) => {
    const { favorites } = await request.json();

    const response = await client.post('/favorites-sync', { favorites });

    return Response.json(response);
});
