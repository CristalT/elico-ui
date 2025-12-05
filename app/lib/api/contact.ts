import type { HttpClient } from '../http-client';
import { Setting } from './types';

export default class Contact {
    private client: HttpClient;
    constructor(client: HttpClient) {
        this.client = client;
    }

    send(data: Record<string, unknown>) {
        return this.client.post('/contact', data);
    }

    async info(): Promise<Record<string, string>> {
        const data = await this.client.get<Setting[]>('contact');

        return data.reduce(
            (acc, { key, value }) => {
                acc[key.replace('company_', '')] = value;
                return acc;
            },
            {} as Record<string, string>,
        );
    }
}
