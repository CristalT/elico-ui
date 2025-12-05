import type { HttpClient } from '../http-client';
import { SettingsType } from './types';

export default class Setting {
    constructor(private client: HttpClient) {
        this.client = client;
    }

    getAll() {
        return this.client.get<SettingsType>('settings');
    }
}
