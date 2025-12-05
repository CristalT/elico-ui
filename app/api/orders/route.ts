import { withAuth } from '@/lib/auth-api-handler';

export const GET = withAuth(async ({ client }) => {
    const orders = await client.query({ order: 'desc', orderBy: 'createdAt' }).get('orders');
    return Response.json(orders);
});

export const POST = withAuth(async ({ client, request }) => {
    const payload = await request.json();
    const order = await client.post('orders', payload);
    return Response.json(order);
});
