import { withAuth } from '@/lib/auth-api-handler';

export const DELETE = withAuth<{ item: string }>(async ({ client, params }) => {
    const { item } = await params;

    if (!item) {
        return new Response('Missing item', { status: 400 });
    }

    await client.delete(`/cart/${item}`);

    return Response.json(`Item ${item} removed`);
});
