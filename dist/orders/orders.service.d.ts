import { PrismaService } from '../prisma/prisma.service';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto';
import { AddCartItemDto, UpdateCartItemDto } from './dto/add-cart-item.dto';
import { OrderStatus } from '@prisma/client';
import { OrderGateway } from '../gateway/order.gateway';
export declare class OrdersService {
    private prisma;
    private gateway;
    constructor(prisma: PrismaService, gateway: OrderGateway);
    private getActiveSession;
    private getPendingCart;
    private recalcTotal;
    getCart(sessionToken: string): Promise<({
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
    addCartItem(sessionToken: string, dto: AddCartItemDto): Promise<{
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
    updateCartItem(sessionToken: string, itemId: string, dto: UpdateCartItemDto): Promise<{
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
    removeCartItem(sessionToken: string, itemId: string): Promise<{
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
    submitOrder(sessionToken: string): Promise<{
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
    getOrderById(orderId: string): Promise<{
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
    getOrdersBySession(sessionToken: string): Promise<({
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
    updateOrderStatus(orderId: string, dto: UpdateOrderStatusDto): Promise<{
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
