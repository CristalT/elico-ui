export enum OrderStatus {
    IN_CART = 'in_cart',
    PENDING = 'pending',
    PROCESSING = 'processing',
    COMPLETED = 'completed',
    CANCELLED = 'cancelled',
    DELIVERED = 'delivered',
}

export interface Category {
    id: number;
    parentId: number | null;
    name: string;
    slug: string;
    description: string | null;
    createdAt: string;
    updatedAt: string;
}

export interface Product {
    id: string;
    code: string;
    name: string;
    description: string;
    stock: number;
    price: number;
    image?: string;
    categories?: Category[];
}

export interface CartItem {
    id?: number;
    quantity: number;
    status?: OrderStatus;
    price: number;
    productId: string;
    product: Product;
}

export interface Favorite {
    id: string;
    product: Product;
    createdAt: string;
}

export interface OrderItem {
    id: string;
    productId: string;
    quantity: number;
    price: number;
    product: Product;
}

export interface Showcase {
    id: number;
    name: string;
    description: string;
    order: number;
    products: Product[];
}

export interface Order {
    id: string;
    orderNumber: string;
    status: OrderStatus;
    total: number;
    createdAt: string;
    updatedAt: string;
    cartItems: OrderItem[];
    deliveryInfo: {
        firstName: string;
        lastName: string;
        address: string;
        city: string;
        postalCode: string;
        phone: string;
    };
    trackingNumber?: string;
    estimatedDelivery?: string;
}

export interface Setting {
    key: string;
    value: string;
}

export interface DeliveryInfo {
    email: string;
    firstName: string;
    lastName: string;
    address: string;
    address2?: string;
    postalCode: string;
    city: string;
    province: string;
    phone: string;
}

export interface SettingsType {
    eshopGuestEnabled: boolean;
}

export interface Meta {
    perPage: number;
    lastPage: number;
    currentPage: number;
}
