import { CartItem } from '@/lib/api/types';
import { withAuth } from '@/lib/auth-api-handler';

export const GET = withAuth(async ({ client }) => {
    const response = await client.get<CartItem[]>('/cart');
    const items = response.map((item) => ({ ...item, ...item.product }));

    return Response.json(items);
});
