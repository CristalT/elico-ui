import { withAuth } from '@/lib/auth-api-handler';

export const PUT = withAuth(async ({ client, request }) => {
    try {
        const body = await request.json();

        // Validate required fields
        if (!body.currentPassword || !body.newPassword) {
            return Response.json(
                {
                    error: 'Bad Request',
                    message: 'Contraseña actual y nueva contraseña son requeridas',
                },
                { status: 400 },
            );
        }

        // Change password via the backend API
        await client.put('auth/password-reset', body);

        return Response.json({ message: 'Contraseña cambiada correctamente' });
    } catch (error: unknown) {
        console.error('Change password error:', error);

        const apiError = error as {
            response?: {
                status?: number;
                data?: { message?: string };
            };
            message?: string;
        };

        if (apiError?.response?.status === 400) {
            return Response.json(
                {
                    error: 'Bad Request',
                    message: apiError.response.data?.message || 'Contraseña actual incorrecta',
                },
                { status: 400 },
            );
        } else if (apiError?.response?.status === 401) {
            return Response.json(
                {
                    error: 'Unauthorized',
                    message: 'Contraseña actual incorrecta',
                },
                { status: 401 },
            );
        } else if (apiError?.response?.status === 422) {
            return Response.json(
                {
                    error: 'Unprocessable Entity',
                    message: 'La nueva contraseña no cumple con los requisitos',
                },
                { status: 422 },
            );
        } else if (apiError?.response?.status && apiError.response.status >= 500) {
            return Response.json(
                {
                    error: 'Internal Server Error',
                    message: 'Error del servidor. Intente nuevamente más tarde.',
                },
                { status: 500 },
            );
        } else {
            return Response.json(
                {
                    error: 'Change Password Failed',
                    message: 'Error inesperado al cambiar la contraseña',
                },
                { status: 500 },
            );
        }
    }
});
