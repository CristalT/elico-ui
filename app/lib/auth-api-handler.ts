import { castorApiClient as httpClient } from '@/lib/http-client';
import { cookies } from 'next/headers';
import { NextRequest } from 'next/server';

// Types for better type safety
export interface AuthenticatedApiContext<Params = Record<string, string>> {
    client: ReturnType<typeof httpClient.token>;
    request: NextRequest;
    queryParams: Record<string, string>;
    params: Promise<Params>;
}

export type AuthenticatedHandler<Params> = (context: AuthenticatedApiContext<Params>) => Promise<Response>;

/**
 * Higher-order function that wraps API handlers with authentication
 * @param handler The API handler to wrap
 * @returns A new handler with authentication
 */

export function withAuth<Params>(handler: AuthenticatedHandler<Params>, { guest = false } = {}) {
    return async (request: NextRequest, { params }: { params: Promise<Params> }): Promise<Response> => {
        // Get authentication token
        const cookieStore = await cookies();
        const token = cookieStore.get('token');

        if (!token && !guest) {
            return Response.json({ error: 'Unauthorized', message: 'Authentication token required' }, { status: 401 });
        } else if (token) {
            httpClient.token(token.value);
        }

        // Parse request parameters
        const searchParams = request.nextUrl.searchParams;
        const queryParams = Object.fromEntries(searchParams.entries());

        // Create context object
        const context: AuthenticatedApiContext<Params> = {
            client: httpClient,
            request,
            queryParams,
            params,
        };

        return handler(context);
    };
}
