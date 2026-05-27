export declare class OrderItemDto {
    menuId: string;
    qty: number;
    note?: string;
}
export declare class CreateOrderDto {
    sessionToken: string;
    items: OrderItemDto[];
    note?: string;
}
