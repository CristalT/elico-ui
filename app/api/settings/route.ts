import { withAuth } from '@/lib/auth-api-handler';

export const GET = withAuth(
    async ({ client }) => {
        const settings = await client.get('settings');
        return Response.json(settings);
    },
    { guest: true },
);
