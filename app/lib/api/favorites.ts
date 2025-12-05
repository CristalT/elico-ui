import { HttpClient } from '../http-client';
import { User } from './auth';
import { Product } from './types';

export default class Favorites {
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

        const localFavorites = JSON.parse(localStorage.getItem('favorites') || '[]');
        await this.client.post('favorites/sync', { favorites: localFavorites });

        // localStorage.setItem('favorites', JSON.stringify(serverFavorites));
    }

    getAll() {
        if (!this.user) {
            const favoritesLocal = localStorage.getItem('favorites');
            return Promise.resolve(favoritesLocal ? JSON.parse(favoritesLocal) : []);
        } else {
            return this.client.get<Product[]>('favorites');
        }
    }

    async toggle(item: Product) {
        if (!this.user) {
            const favorites = await this.getAll();
            const idx = favorites.findIndex((fav: Product) => fav.id === item.id);
            if (idx < 0) {
                favorites.push({
                    id: item.id,
                    productId: item.id,
                    product: { ...item },
                });
            } else {
                favorites.splice(idx, 1);
            }
            return Promise.resolve(localStorage.setItem('favorites', JSON.stringify(favorites)));
        }
        return this.client.post<Product, Product>('/favorites/add', item);
    }

    async remove(id: string) {
        if (!this.user) {
            const favorites = await this.getAll();
            const updatedFavorites = favorites.filter((item: Product) => item.id !== id);
            return Promise.resolve(localStorage.setItem('favorites', JSON.stringify(updatedFavorites)));
        }
        return this.client.delete(`favorites/remove/${id}`);
    }

    async clearAll() {
        if (!this.user) {
            localStorage.removeItem('favorites');
            return Promise.resolve();
        }
        return this.client.delete('favorites/clear');
    }
}
