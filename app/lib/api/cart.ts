import { HttpClient } from '../http-client';
import type { User } from './auth';
import type { CartItem, DeliveryInfo } from './types';

export default class Cart {
    private client: HttpClient;
    private user: User | undefined = undefined;

    constructor(client: HttpClient) {
        this.client = client;
    }

    setUser(user?: User) {
        this.user = user;

        if (this.user) {
            this.sync();
        }
    }

    async sync() {
        if (!this.user) return;

        const localCart = JSON.parse(localStorage.getItem('cart') || '[]');
        await this.client.post('/cart/sync', { cart: localCart });

        const serverCart = await this.client.get('/cart');
        localStorage.setItem('cart', JSON.stringify(serverCart));
    }

    getCart(): Promise<CartItem[]> {
        if (!this.user) {
            return Promise.resolve(JSON.parse(localStorage.getItem('cart') || '[]'));
        }
        return this.client.get<CartItem[]>('/cart');
    }

    addToCart(item: CartItem) {
        if (!this.user) {
            const localCart = localStorage.getItem('cart');

            localStorage.setItem('cart', JSON.stringify([...JSON.parse(localCart || '[]'), item]));
            return;
        }
        return this.client.post<CartItem, CartItem>('/cart/add', item);
    }

    removeFromCart(productId: string) {
        const localCart = JSON.parse(localStorage.getItem('cart') || '[]');
        localStorage.setItem(
            'cart',
            JSON.stringify(localCart.filter((item: CartItem) => item.productId !== productId)),
        );

        if (!this.user) {
            return;
        }

        return this.client.delete(`/cart/remove/${productId}`);
    }

    editCartItem(productId: string, quantity: number) {
        const localCart = JSON.parse(localStorage.getItem('cart') || '[]');
        localStorage.setItem(
            'cart',
            JSON.stringify(
                localCart.map((item: CartItem) => (item.productId === productId ? { ...item, quantity } : item)),
            ),
        );

        if (!this.user) {
            return;
        }

        return this.client.patch(`cart/edit/${productId}`, { quantity });
    }

    clear() {
        localStorage.removeItem('cart');
    }

    async finish(payload: { deliveryInfo: DeliveryInfo; newsletter: boolean }) {
        return this.client.post('orders', payload).then(this.clear);
    }
}
