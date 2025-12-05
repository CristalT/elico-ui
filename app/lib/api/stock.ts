import { HttpClient } from '../http-client';
import type { Meta, Product, Showcase } from './types';

export default class Stock {
    private client: HttpClient;

    constructor(client: HttpClient) {
        this.client = client;
    }

    public async search(search: string, { page = 1, limit = 12 }: { page?: number; limit?: number }) {
        const response = await this.client
            .query({ search, page, limit })
            .get<{ data: Product[]; meta: Meta }>('products');
        return response;
    }

    public async getProduct(id: string): Promise<Product> {
        const response = await this.client.get<Product>(`products/${id}`);
        return response;
    }

    public async showcases() {
        const response = await this.client.get<Showcase[]>('products/showcases');
        return response;
    }
}
