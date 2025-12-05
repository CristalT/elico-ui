import { withAuth } from '@/lib/auth-api-handler';

export const POST = withAuth(async ({ client, request }) => {
    const { email } = await request.json();
    const res = await client.post('/auth/forgot-password', { email });
    return Response.json(res);
});
