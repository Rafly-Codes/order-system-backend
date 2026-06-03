import { OrdersService } from './orders.service';
import { AddCartItemDto, UpdateCartItemDto } from './dto/add-cart-item.dto';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto';
import { OrderStatus } from '@prisma/client';
export declare class OrdersController {
    private readonly ordersService;
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
            note: string | null;
            price: number;
            orderId: string;
            menuId: string;
            qty: number;
        })[];
    } & {
        id: string;
        sessionId: string;
        status: import(".prisma/client").$Enums.OrderStatus;
        queueNumber: number | null;
        note: string | null;
        totalAmount: number;
        createdAt: Date;
        updatedAt: Date;
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
            note: string | null;
            price: number;
            orderId: string;
            menuId: string;
            qty: number;
        })[];
    } & {
        id: string;
        sessionId: string;
        status: import(".prisma/client").$Enums.OrderStatus;
        queueNumber: number | null;
        note: string | null;
        totalAmount: number;
        createdAt: Date;
        updatedAt: Date;
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
            note: string | null;
            price: number;
            orderId: string;
            menuId: string;
            qty: number;
        })[];
    } & {
        id: string;
        sessionId: string;
        status: import(".prisma/client").$Enums.OrderStatus;
        queueNumber: number | null;
        note: string | null;
        totalAmount: number;
        createdAt: Date;
        updatedAt: Date;
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
            note: string | null;
            price: number;
            orderId: string;
            menuId: string;
            qty: number;
        })[];
    } & {
        id: string;
        sessionId: string;
        status: import(".prisma/client").$Enums.OrderStatus;
        queueNumber: number | null;
        note: string | null;
        totalAmount: number;
        createdAt: Date;
        updatedAt: Date;
    }>;
    submitOrder(headers: Record<string, string>): Promise<{
        session: {
            orderType: import(".prisma/client").$Enums.OrderType;
            customerName: string;
            table: {
                number: number;
                id: string;
                status: import(".prisma/client").$Enums.TableStatus;
                capacity: number;
                qrCode: string;
            };
        };
        orderItems: ({
            menu: {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                name: string;
                description: string | null;
                price: number;
                imageUrl: string | null;
                isAvailable: boolean;
                categoryId: string;
            };
        } & {
            id: string;
            note: string | null;
            price: number;
            orderId: string;
            menuId: string;
            qty: number;
        })[];
    } & {
        id: string;
        sessionId: string;
        status: import(".prisma/client").$Enums.OrderStatus;
        queueNumber: number | null;
        note: string | null;
        totalAmount: number;
        createdAt: Date;
        updatedAt: Date;
    }>;
    getMyOrders(headers: Record<string, string>): Promise<({
        orderItems: ({
            menu: {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                name: string;
                description: string | null;
                price: number;
                imageUrl: string | null;
                isAvailable: boolean;
                categoryId: string;
            };
        } & {
            id: string;
            note: string | null;
            price: number;
            orderId: string;
            menuId: string;
            qty: number;
        })[];
        payment: {
            id: string;
            status: import(".prisma/client").$Enums.PaymentStatus;
            createdAt: Date;
            updatedAt: Date;
            orderId: string;
            snapToken: string | null;
            midtransOrderId: string;
            amount: number;
            paidAt: Date | null;
        };
    } & {
        id: string;
        sessionId: string;
        status: import(".prisma/client").$Enums.OrderStatus;
        queueNumber: number | null;
        note: string | null;
        totalAmount: number;
        createdAt: Date;
        updatedAt: Date;
    })[]>;
    getOrderById(id: string): Promise<{
        session: {
            token: string;
            orderType: import(".prisma/client").$Enums.OrderType;
            customerName: string;
            table: {
                number: number;
                id: string;
                status: import(".prisma/client").$Enums.TableStatus;
                capacity: number;
                qrCode: string;
            };
        };
        orderItems: ({
            menu: {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                name: string;
                description: string | null;
                price: number;
                imageUrl: string | null;
                isAvailable: boolean;
                categoryId: string;
            };
        } & {
            id: string;
            note: string | null;
            price: number;
            orderId: string;
            menuId: string;
            qty: number;
        })[];
        payment: {
            id: string;
            status: import(".prisma/client").$Enums.PaymentStatus;
            createdAt: Date;
            updatedAt: Date;
            orderId: string;
            snapToken: string | null;
            midtransOrderId: string;
            amount: number;
            paidAt: Date | null;
        };
    } & {
        id: string;
        sessionId: string;
        status: import(".prisma/client").$Enums.OrderStatus;
        queueNumber: number | null;
        note: string | null;
        totalAmount: number;
        createdAt: Date;
        updatedAt: Date;
    }>;
    getKitchenQueue(): Promise<({
        session: {
            orderType: import(".prisma/client").$Enums.OrderType;
            customerName: string;
            table: {
                number: number;
            };
        };
        orderItems: ({
            menu: {
                name: string;
            };
        } & {
            id: string;
            note: string | null;
            price: number;
            orderId: string;
            menuId: string;
            qty: number;
        })[];
    } & {
        id: string;
        sessionId: string;
        status: import(".prisma/client").$Enums.OrderStatus;
        queueNumber: number | null;
        note: string | null;
        totalAmount: number;
        createdAt: Date;
        updatedAt: Date;
    })[]>;
    updateOrderStatus(id: string, dto: UpdateOrderStatusDto): Promise<{
        session: {
            token: string;
            orderType: import(".prisma/client").$Enums.OrderType;
            customerName: string;
            table: {
                number: number;
                id: string;
                status: import(".prisma/client").$Enums.TableStatus;
                capacity: number;
                qrCode: string;
            };
        };
        orderItems: ({
            menu: {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                name: string;
                description: string | null;
                price: number;
                imageUrl: string | null;
                isAvailable: boolean;
                categoryId: string;
            };
        } & {
            id: string;
            note: string | null;
            price: number;
            orderId: string;
            menuId: string;
            qty: number;
        })[];
    } & {
        id: string;
        sessionId: string;
        status: import(".prisma/client").$Enums.OrderStatus;
        queueNumber: number | null;
        note: string | null;
        totalAmount: number;
        createdAt: Date;
        updatedAt: Date;
    }>;
    getAllOrders(status?: OrderStatus): Promise<({
        session: {
            orderType: import(".prisma/client").$Enums.OrderType;
            customerName: string;
            table: {
                number: number;
                id: string;
                status: import(".prisma/client").$Enums.TableStatus;
                capacity: number;
                qrCode: string;
            };
        };
        orderItems: ({
            menu: {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                name: string;
                description: string | null;
                price: number;
                imageUrl: string | null;
                isAvailable: boolean;
                categoryId: string;
            };
        } & {
            id: string;
            note: string | null;
            price: number;
            orderId: string;
            menuId: string;
            qty: number;
        })[];
        payment: {
            id: string;
            status: import(".prisma/client").$Enums.PaymentStatus;
            createdAt: Date;
            updatedAt: Date;
            orderId: string;
            snapToken: string | null;
            midtransOrderId: string;
            amount: number;
            paidAt: Date | null;
        };
    } & {
        id: string;
        sessionId: string;
        status: import(".prisma/client").$Enums.OrderStatus;
        queueNumber: number | null;
        note: string | null;
        totalAmount: number;
        createdAt: Date;
        updatedAt: Date;
    })[]>;
}
