import { HttpClient } from '../http-client';

export default class Captcha {
    private client: HttpClient;

    constructor(client: HttpClient) {
        this.client = client;
    }

    async getSiteKey(): Promise<string> {
        const { key } = await this.client.get<{ key: string }>('/captcha');
        return key;
    }
}
