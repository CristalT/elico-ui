import { withAuth } from '@/lib/auth-api-handler';

export const POST = withAuth(async ({ client, request }) => {
    const product = await request.json();

    const response = await client.post('/favorites', product);

    return Response.json(response);
});
