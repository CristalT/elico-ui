import { withAuth } from '@/lib/auth-api-handler';

export const GET = withAuth(
    async ({ client }) => {
        const captcha = await client.get('captcha');
        return Response.json(captcha);
    },
    { guest: true },
);
