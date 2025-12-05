import { HttpClient } from '../http-client';

export interface User {
    name: string;
    firstName: string;
    lastName: string;
    email: string;
    address?: string;
    address2?: string;
    postalCode?: string;
    city?: string;
    province?: string;
    phone?: string;
}

export interface TokenResponse {
    user: User;
    token: {
        token: string;
        type: 'bearer';
        abilities: string[];
        expiresAt?: string;
        lastUsedAt?: string;
        name?: string;
    };
}

export default class Auth {
    private client: HttpClient;

    constructor(client: HttpClient) {
        this.client = client;
    }

    public async createAccount(data: {
        firstName: string;
        lastName: string;
        email: string;
        password: string;
        passwordConfirmation: string;
    }) {
        const response = await this.client.post('/auth/signup', data);
        return response;
    }

    public async login(email: string, password: string) {
        return this.client.post<{ email: string; password: string }, User | { error: string }>('/auth/login', {
            email,
            password,
        });
    }

    public async me() {
        return this.client.get<User>('/auth/me');
    }

    public async logout() {
        return this.client.post('/auth/logout', {});
    }

    public async updateProfile(data: {
        firstName: string;
        lastName: string;
        phone?: string;
        address?: string;
        address2?: string;
        postalCode?: string;
        city?: string;
        province?: string;
    }) {
        return this.client.put<User>('/auth/profile', data);
    }

    public async changePassword(data: { currentPassword: string; newPassword: string }) {
        return this.client.put('/auth/change-password', data);
    }

    public async forgotPassword(email: string) {
        console.log({ email });
        return this.client.post<{ email: string }, User>('/auth/forgot-password', { email });
    }
}
