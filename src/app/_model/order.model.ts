import { Product } from "./product.model";

export interface Order {
    orderId: number;
    orderFullName: string;
    orderFullAddress: string;  // Corrected from `orderFullOrder`
    orderContactNumber: string;
    orderAlternateContactNumber: string;
    orderStatus: string;
    orderAmount: number;
    products: Product[];       // Changed to plural to represent multiple products
    user: any;
    orderDate?: Date;          // Optional field for order date
    paymentMethod?: string;    // Optional field for payment method
}