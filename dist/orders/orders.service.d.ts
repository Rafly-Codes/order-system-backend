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
    submitOrder(sessionToken: string): Promise<{
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
    getOrderById(orderId: string): Promise<{
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
    getOrdersBySession(sessionToken: string): Promise<({
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
    updateOrderStatus(orderId: string, dto: UpdateOrderStatusDto): Promise<{
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
