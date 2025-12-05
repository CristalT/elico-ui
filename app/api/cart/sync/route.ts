import { withAuth } from '@/lib/auth-api-handler';

export const POST = withAuth(async ({ client, request }) => {
    const { cart } = await request.json();

    const response = await client.post('/cart-sync', { cart });

    return Response.json(response);
});
