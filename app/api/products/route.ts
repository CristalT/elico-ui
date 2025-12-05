import { withAuth } from '@/lib/auth-api-handler';

export const GET = withAuth(
    async ({ client, queryParams }) => {
        const response = await client.query(queryParams).get('products');
        return Response.json(response);
    },
    { guest: true },
);
