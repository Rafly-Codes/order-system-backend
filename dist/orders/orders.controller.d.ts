import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
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
        deliveryAddress: string | null;
        paymentMethod: import(".prisma/client").$Enums.PaymentMethod | null;
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
        deliveryAddress: string | null;
        paymentMethod: import(".prisma/client").$Enums.PaymentMethod | null;
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
        deliveryAddress: string | null;
        paymentMethod: import(".prisma/client").$Enums.PaymentMethod | null;
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
        deliveryAddress: string | null;
        paymentMethod: import(".prisma/client").$Enums.PaymentMethod | null;
    }>;
    createOrder(dto: CreateOrderDto): Promise<{
        session: {
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
        deliveryAddress: string | null;
        paymentMethod: import(".prisma/client").$Enums.PaymentMethod | null;
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
        deliveryAddress: string | null;
        paymentMethod: import(".prisma/client").$Enums.PaymentMethod | null;
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
        deliveryAddress: string | null;
        paymentMethod: import(".prisma/client").$Enums.PaymentMethod | null;
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
        deliveryAddress: string | null;
        paymentMethod: import(".prisma/client").$Enums.PaymentMethod | null;
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
        deliveryAddress: string | null;
        paymentMethod: import(".prisma/client").$Enums.PaymentMethod | null;
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
        deliveryAddress: string | null;
        paymentMethod: import(".prisma/client").$Enums.PaymentMethod | null;
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
        deliveryAddress: string | null;
        paymentMethod: import(".prisma/client").$Enums.PaymentMethod | null;
    })[]>;
}
