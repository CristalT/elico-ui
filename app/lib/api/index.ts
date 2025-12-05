import Captcha from './captcha';
import Cart from './cart';
import Contact from './contact';
import Stock from './stock';
import Auth from './auth';
import Order from './order';
import Setting from './setting';
import Favorites from './favorites';

import { localApiClient } from '../http-client';

export class Api {
    public cart: Cart;
    public contact: Contact;
    public stock: Stock;
    public captcha: Captcha;
    public auth: Auth;
    public order: Order;
    public setting: Setting;
    public favorites: Favorites;

    constructor() {
        this.auth = new Auth(localApiClient);
        this.cart = new Cart(localApiClient);
        this.stock = new Stock(localApiClient);
        this.contact = new Contact(localApiClient);
        this.captcha = new Captcha(localApiClient);
        this.order = new Order(localApiClient);
        this.setting = new Setting(localApiClient);
        this.favorites = new Favorites(localApiClient);
    }
}

const api = new Api();
export default api;
