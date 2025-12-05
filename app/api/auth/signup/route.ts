import { withAuth } from '@/lib/auth-api-handler';

export const POST = withAuth(
    async ({ client, request }) => {
        const body = await request.json();

        const { email, password } = body;

        if (!email || !password) {
            return new Response('Faltan datos', { status: 400 });
        }

        const response = await client.post('auth/signup', body);

        return Response.json(response);
    },
    { guest: true },
);
