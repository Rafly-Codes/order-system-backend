import { OrderType, PaymentMethod } from '@prisma/client';
export declare class OrderItemDto {
    menuId: string;
    quantity: number;
    note?: string;
}
export declare class CreateOrderDto {
    orderType: OrderType;
    paymentMethod: PaymentMethod;
    items: OrderItemDto[];
    deliveryAddress?: string;
    address?: string;
    customerName?: string;
    note?: string;
}
