import { withAuth } from '@/lib/auth-api-handler';

export const PATCH = withAuth<{ item: string }>(async ({ client, request, params }) => {
    const { item: id } = await params;

    const { quantity } = await request.json();

    if (!id || !quantity) {
        return new Response('Invalid request', { status: 400 });
    }

    const response = await client.patch(`cart/${id}`, { quantity });
    return Response.json(response);
});
