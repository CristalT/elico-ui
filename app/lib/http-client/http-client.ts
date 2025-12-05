export class HttpClient {
    private params: Record<string, string | number> = {};
    private headers: Record<string, string> = {};

    constructor(private baseURL: string) {
        if (!this.baseURL) {
            throw new Error('Base URL is not defined');
        }
    }

    private async request<T>(endpoint: string, options: RequestInit): Promise<T> {
        const url = new URL(`${this.baseURL}${endpoint.startsWith('/') ? '' : '/'}${endpoint}`);

        Object.entries(this.params).forEach(([key, value]) => {
            url.searchParams.append(key, String(value));
        });

        const headers = {
            'Content-Type': 'application/json',
            ...this.headers,
            ...options.headers,
        };

        return fetch(url, {
            method: options.method,
            headers,
            body: options.body,
        }).then((response) => {
            if (!response.ok) {
                throw Error(response.statusText);
            }

            if (response.body) {
                return response.json();
            }
            return {} as T;
        }) as Promise<T>;
    }

    token(token: string) {
        this.headers.Authorization = `Bearer ${token}`;
        return this;
    }

    query(params: Record<string, string | number>) {
        this.params = params;
        return this;
    }

    get<T>(endpoint: string) {
        return this.request<T>(endpoint, { method: 'GET' });
    }

    post<Body, Response>(endpoint: string, body: Body) {
        return this.request<Response>(endpoint, {
            method: 'POST',
            body: JSON.stringify(body),
        });
    }

    put<T>(endpoint: string, body: Record<string, unknown>) {
        return this.request<T>(endpoint, {
            method: 'PUT',
            body: JSON.stringify(body),
        });
    }

    patch<T>(endpoint: string, body: Record<string, unknown>) {
        return this.request<T>(endpoint, {
            method: 'PATCH',
            body: JSON.stringify(body),
        });
    }

    delete<T>(endpoint: string) {
        return this.request<T>(endpoint, { method: 'DELETE' });
    }
}
