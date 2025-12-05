import { withAuth } from '@/lib/auth-api-handler';

export const GET = withAuth<{ id: string }>(async ({ client, params }) => {
    // Extract the product ID from the URL
    const { id: productId } = await params;

    if (!productId) {
        return Response.json({ error: 'Product ID is required' }, { status: 400 });
    }

    const response = await client.get(`products/${productId}`);
    return Response.json(response);
});
