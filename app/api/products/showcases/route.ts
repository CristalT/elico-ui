import { withAuth } from '@/lib/auth-api-handler';

export const GET = withAuth(
    async ({ client }) => {
        const showcases = await client.get('showcases');

        return Response.json(showcases);
    },
    { guest: true },
);
