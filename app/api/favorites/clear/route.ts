import { withAuth } from '@/lib/auth-api-handler';

export const DELETE = withAuth(async ({ client }) => {
    await client.delete('favorites/clear');
    return new Response(null, { status: 204 });
});
