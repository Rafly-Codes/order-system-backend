import { OrdersService } from './orders.service';
import { AddCartItemDto, UpdateCartItemDto } from './dto/add-cart-item.dto';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto';
import { OrderStatus } from '@prisma/client';
export declare class OrdersController {
    private ordersService;
    constructor(ordersService: OrdersService);
    getCart(headers: Record<string, string>): Promise<({
        orderItems: ({
            menu: {
                id: string;
                name: string;
                price: number;
                isAvailable: boolean;
            };
        } & {
            id: string;
            price: number;
            note: string | null;
            orderId: string;
            menuId: string;
            qty: number;
        })[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: import(".prisma/client").$Enums.OrderStatus;
        sessionId: string;
        queueNumber: number | null;
        note: string | null;
        totalAmount: number;
    }) | {
        items: any[];
        totalAmount: number;
        message: string;
    }>;
    addCartItem(headers: Record<string, string>, dto: AddCartItemDto): Promise<{
        orderItems: ({
            menu: {
                id: string;
                name: string;
                price: number;
                isAvailable: boolean;
            };
        } & {
            id: string;
            price: number;
            note: string | null;
            orderId: string;
            menuId: string;
            qty: number;
        })[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: import(".prisma/client").$Enums.OrderStatus;
        sessionId: string;
        queueNumber: number | null;
        note: string | null;
        totalAmount: number;
    }>;
    updateCartItem(headers: Record<string, string>, id: string, dto: UpdateCartItemDto): Promise<{
        orderItems: ({
            menu: {
                id: string;
                name: string;
                price: number;
                isAvailable: boolean;
            };
        } & {
            id: string;
            price: number;
            note: string | null;
            orderId: string;
            menuId: string;
            qty: number;
        })[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: import(".prisma/client").$Enums.OrderStatus;
        sessionId: string;
        queueNumber: number | null;
        note: string | null;
        totalAmount: number;
    }>;
    removeCartItem(headers: Record<string, string>, id: string): Promise<{
        orderItems: ({
            menu: {
                id: string;
                name: string;
                price: number;
                isAvailable: boolean;
            };
        } & {
            id: string;
            price: number;
            note: string | null;
            orderId: string;
            menuId: string;
            qty: number;
        })[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: import(".prisma/client").$Enums.OrderStatus;
        sessionId: string;
        queueNumber: number | null;
        note: string | null;
        totalAmount: number;
    }>;
    submitOrder(headers: Record<string, string>): Promise<{
        session: {
            table: {
                number: number;
                id: string;
                capacity: number;
                status: import(".prisma/client").$Enums.TableStatus;
                qrCode: string;
            };
            orderType: import(".prisma/client").$Enums.OrderType;
            customerName: string;
        };
        orderItems: ({
            menu: {
                id: string;
                name: string;
                createdAt: Date;
                updatedAt: Date;
                description: string | null;
                price: number;
                imageUrl: string | null;
                categoryId: string;
                isAvailable: boolean;
            };
        } & {
            id: string;
            price: number;
            note: string | null;
            orderId: string;
            menuId: string;
            qty: number;
        })[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: import(".prisma/client").$Enums.OrderStatus;
        sessionId: string;
        queueNumber: number | null;
        note: string | null;
        totalAmount: number;
    }>;
    getMyOrders(headers: Record<string, string>): Promise<({
        payment: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            status: import(".prisma/client").$Enums.PaymentStatus;
            orderId: string;
            snapToken: string | null;
            midtransOrderId: string;
            amount: number;
            paidAt: Date | null;
        };
        orderItems: ({
            menu: {
                id: string;
                name: string;
                createdAt: Date;
                updatedAt: Date;
                description: string | null;
                price: number;
                imageUrl: string | null;
                categoryId: string;
                isAvailable: boolean;
            };
        } & {
            id: string;
            price: number;
            note: string | null;
            orderId: string;
            menuId: string;
            qty: number;
        })[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: import(".prisma/client").$Enums.OrderStatus;
        sessionId: string;
        queueNumber: number | null;
        note: string | null;
        totalAmount: number;
    })[]>;
    getOrderById(id: string): Promise<{
        session: {
            table: {
                number: number;
                id: string;
                capacity: number;
                status: import(".prisma/client").$Enums.TableStatus;
                qrCode: string;
            };
            orderType: import(".prisma/client").$Enums.OrderType;
            customerName: string;
            token: string;
        };
        payment: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            status: import(".prisma/client").$Enums.PaymentStatus;
            orderId: string;
            snapToken: string | null;
            midtransOrderId: string;
            amount: number;
            paidAt: Date | null;
        };
        orderItems: ({
            menu: {
                id: string;
                name: string;
                createdAt: Date;
                updatedAt: Date;
                description: string | null;
                price: number;
                imageUrl: string | null;
                categoryId: string;
                isAvailable: boolean;
            };
        } & {
            id: string;
            price: number;
            note: string | null;
            orderId: string;
            menuId: string;
            qty: number;
        })[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: import(".prisma/client").$Enums.OrderStatus;
        sessionId: string;
        queueNumber: number | null;
        note: string | null;
        totalAmount: number;
    }>;
    getKitchenQueue(): Promise<({
        session: {
            table: {
                number: number;
            };
            orderType: import(".prisma/client").$Enums.OrderType;
            customerName: string;
        };
        orderItems: ({
            menu: {
                name: string;
            };
        } & {
            id: string;
            price: number;
            note: string | null;
            orderId: string;
            menuId: string;
            qty: number;
        })[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: import(".prisma/client").$Enums.OrderStatus;
        sessionId: string;
        queueNumber: number | null;
        note: string | null;
        totalAmount: number;
    })[]>;
    updateOrderStatus(id: string, dto: UpdateOrderStatusDto): Promise<{
        session: {
            table: {
                number: number;
                id: string;
                capacity: number;
                status: import(".prisma/client").$Enums.TableStatus;
                qrCode: string;
            };
            orderType: import(".prisma/client").$Enums.OrderType;
            customerName: string;
            token: string;
        };
        orderItems: ({
            menu: {
                id: string;
                name: string;
                createdAt: Date;
                updatedAt: Date;
                description: string | null;
                price: number;
                imageUrl: string | null;
                categoryId: string;
                isAvailable: boolean;
            };
        } & {
            id: string;
            price: number;
            note: string | null;
            orderId: string;
            menuId: string;
            qty: number;
        })[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: import(".prisma/client").$Enums.OrderStatus;
        sessionId: string;
        queueNumber: number | null;
        note: string | null;
        totalAmount: number;
    }>;
    getAllOrders(status?: OrderStatus): Promise<({
        session: {
            table: {
                number: number;
                id: string;
                capacity: number;
                status: import(".prisma/client").$Enums.TableStatus;
                qrCode: string;
            };
            orderType: import(".prisma/client").$Enums.OrderType;
            customerName: string;
        };
        payment: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            status: import(".prisma/client").$Enums.PaymentStatus;
            orderId: string;
            snapToken: string | null;
            midtransOrderId: string;
            amount: number;
            paidAt: Date | null;
        };
        orderItems: ({
            menu: {
                id: string;
                name: string;
                createdAt: Date;
                updatedAt: Date;
                description: string | null;
                price: number;
                imageUrl: string | null;
                categoryId: string;
                isAvailable: boolean;
            };
        } & {
            id: string;
            price: number;
            note: string | null;
            orderId: string;
            menuId: string;
            qty: number;
        })[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: import(".prisma/client").$Enums.OrderStatus;
        sessionId: string;
        queueNumber: number | null;
        note: string | null;
        totalAmount: number;
    })[]>;
}
