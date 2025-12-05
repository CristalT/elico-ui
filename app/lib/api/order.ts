import { HttpClient } from '../http-client';
import type { Order as OrderType } from './types';

export default class Order {
    constructor(private httpClient: HttpClient) {
        this.httpClient = httpClient;
    }

    getAll() {
        return this.httpClient.get<{ data: OrderType[] }>('orders');
    }
}
