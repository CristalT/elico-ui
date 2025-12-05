import { withAuth } from '@/lib/auth-api-handler';

export const POST = withAuth(
    async ({ client, request }) => {
        const envelope = await request.json();
        const response = await client.post('messages', envelope);
        return Response.json(response);
    },
    { guest: true },
);

export const GET = withAuth(
    async ({ client }) => {
        const response = await client.get('contact-info');
        return Response.json(response);
    },
    { guest: true },
);
